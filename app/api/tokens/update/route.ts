import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenId, marketData, status, launchpadId, launchpadUrl } = body;

    if (!tokenId) {
      return NextResponse.json(
        { error: 'Token ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      lastApiCheck: new Date(),
      apiData: marketData || {}
    };

    if (status) updateData.status = status;
    if (launchpadId) updateData.launchpadId = launchpadId;
    if (launchpadUrl) updateData.launchpadUrl = launchpadUrl;

    // Update market data if provided
    if (marketData) {
      if (marketData.marketCap !== undefined) updateData.marketCap = marketData.marketCap;
      if (marketData.price !== undefined) updateData.price = marketData.price;
      if (marketData.volume24h !== undefined) updateData.volume24h = marketData.volume24h;
      if (marketData.holders !== undefined) updateData.holders = marketData.holders;
    }

    // Set live date if status changes to LIVE
    if (status === 'LIVE') {
      updateData.liveDate = new Date();
    }

    const updatedToken = await prisma.launchedToken.update({
      where: { id: tokenId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      token: updatedToken
    });

  } catch (error) {
    console.error('Token update error:', error);
    return NextResponse.json(
      { error: 'Failed to update token' },
      { status: 500 }
    );
  }
}

// Batch update endpoint for updating multiple tokens
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body; // Array of { tokenId, marketData, status, etc. }

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Updates array is required' },
        { status: 400 }
      );
    }

    const results = [];

    for (const update of updates) {
      try {
        const { tokenId, marketData, status, launchpadId, launchpadUrl } = update;

        const updateData: any = {
          lastApiCheck: new Date(),
          apiData: marketData || {}
        };

        if (status) updateData.status = status;
        if (launchpadId) updateData.launchpadId = launchpadId;
        if (launchpadUrl) updateData.launchpadUrl = launchpadUrl;

        if (marketData) {
          if (marketData.marketCap !== undefined) updateData.marketCap = marketData.marketCap;
          if (marketData.price !== undefined) updateData.price = marketData.price;
          if (marketData.volume24h !== undefined) updateData.volume24h = marketData.volume24h;
          if (marketData.holders !== undefined) updateData.holders = marketData.holders;
        }

        if (status === 'LIVE') {
          updateData.liveDate = new Date();
        }

        const updatedToken = await prisma.launchedToken.update({
          where: { id: tokenId },
          data: updateData
        });

        results.push({ success: true, tokenId, token: updatedToken });
      } catch (error) {
        results.push({ success: false, tokenId: update.tokenId, error: String(error) });
      }
    }

    return NextResponse.json({
      success: true,
      results
    });

  } catch (error) {
    console.error('Batch token update error:', error);
    return NextResponse.json(
      { error: 'Failed to update tokens' },
      { status: 500 }
    );
  }
} 