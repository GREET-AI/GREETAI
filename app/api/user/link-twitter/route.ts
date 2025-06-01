import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, twitterUsername } = await request.json();

    if (!walletAddress || !twitterUsername) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if Twitter username is already linked to another wallet
    const existingTwitterUser = await prisma.user.findUnique({
      where: { twitterUsername }
    });

    if (existingTwitterUser && existingTwitterUser.pumpWallet !== walletAddress) {
      return NextResponse.json(
        { error: 'Twitter account already linked to another wallet' },
        { status: 409 }
      );
    }

    // Check if wallet already has a linked Twitter account
    const existingWalletUser = await prisma.user.findUnique({
      where: { pumpWallet: walletAddress }
    });

    if (existingWalletUser && existingWalletUser.twitterUsername !== twitterUsername) {
      return NextResponse.json(
        { error: 'Wallet already has a linked Twitter account' },
        { status: 409 }
      );
    }

    // Update or create user
    const user = await prisma.user.upsert({
      where: { pumpWallet: walletAddress },
      update: { twitterUsername },
      create: {
        pumpWallet: walletAddress,
        twitterUsername,
        referralCode: `GREET${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      }
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error linking Twitter account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 