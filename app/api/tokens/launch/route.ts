import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      name,
      symbol,
      description,
      imageUrl,
      bannerUrl,
      platform,
      website,
      twitterUrl,
      telegramUrl,
      totalSupply,
      decimals
    } = body;

    // Validate required fields
    if (!userId || !name || !symbol || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create token in database
    const launchedToken = await prisma.launchedToken.create({
      data: {
        userId,
        name,
        symbol,
        description,
        imageUrl,
        bannerUrl,
        platform: platform.toUpperCase(),
        website,
        twitterUrl,
        telegramUrl,
        totalSupply,
        decimals: decimals ? parseInt(decimals) : null,
        status: 'PENDING',
        launchDate: new Date()
      }
    });

    // Update user's total launches
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalLaunches: {
          increment: 1
        }
      }
    });

    // TODO: Future API integration
    // When we have API keys, we'll add the actual launch logic here:
    // - Call Pump.fun API for token creation
    // - Call LetsBonk API for token creation
    // - Update launchpadId and launchpadUrl
    // - Set status to 'LAUNCHING' or 'LIVE'

    return NextResponse.json({
      success: true,
      token: launchedToken,
      message: 'Token launch initiated successfully'
    });

  } catch (error) {
    console.error('Token launch error:', error);
    return NextResponse.json(
      { error: 'Failed to launch token' },
      { status: 500 }
    );
  }
} 