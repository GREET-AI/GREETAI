import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// GET /api/user/profile?wallet={walletAddress}
export async function GET(request: NextRequest) {
  try {
    const wallet = request.nextUrl.searchParams.get('wallet');
    console.log('GET /api/user/profile - Wallet:', wallet);

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    console.log('Fetching user from database...');
    const user = await prisma.user.findUnique({
      where: { pumpWallet: wallet },
      select: {
        id: true,
        twitterUsername: true,
        displayName: true,
        bio: true,
        profileImageUrl: true,
        customLinks: true,
        isProfileComplete: true,
      }
    });
    console.log('Database response:', user);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If user has a Twitter username but no profile image, try to get it from Twitter
    if (user.twitterUsername && !user.profileImageUrl) {
      try {
        const twitterResponse = await fetch(`${request.nextUrl.origin}/api/user/twitter-profile?username=${user.twitterUsername}`);
        const twitterData = await twitterResponse.json();
        
        if (twitterResponse.ok && twitterData.profileImageUrl) {
          // Update user with Twitter profile image
          await prisma.user.update({
            where: { id: user.id },
            data: { profileImageUrl: twitterData.profileImageUrl }
          });
          user.profileImageUrl = twitterData.profileImageUrl;
        }
      } catch (error) {
        console.error('Error fetching Twitter profile image:', error);
        // Don't fail the whole request if Twitter image fetch fails
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Detailed error in GET /api/user/profile:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/user/profile
export async function PATCH(request: NextRequest) {
  try {
    const { wallet, displayName, bio, customLinks, rank, xp } = await request.json();
    console.log('PATCH /api/user/profile - Request body:', { wallet, displayName, bio, customLinks, rank, xp });

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Find existing user
    console.log('Finding existing user...');
    const existingUser = await prisma.user.findUnique({
      where: { pumpWallet: wallet }
    });
    console.log('Existing user:', existingUser);

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Validate customLinks if provided
    if (customLinks) {
      try {
        // Ensure it's valid JSON if it's a string
        const parsedLinks = typeof customLinks === 'string' 
          ? JSON.parse(customLinks) 
          : customLinks;
        
        // Basic validation of link structure
        if (!Array.isArray(parsedLinks)) {
          throw new Error('customLinks must be an array');
        }
        
        // Validate each link object
        parsedLinks.forEach((link: any) => {
          if (!link.platform || !link.url) {
            throw new Error('Each link must have platform and url');
          }
        });
      } catch (error) {
        console.error('Custom links validation error:', error);
        return NextResponse.json(
          { error: 'Invalid customLinks format' },
          { status: 400 }
        );
      }
    }

    // Update user profile
    console.log('Updating user profile...');
    const updatedUser = await prisma.user.update({
      where: { pumpWallet: wallet },
      data: {
        displayName: displayName || existingUser.twitterUsername,
        bio: bio === null || bio === '' ? null : bio,
        customLinks: customLinks || undefined,
        ...(rank ? { rank } : {}),
        ...(typeof xp === 'number' ? { xp } : {}),
        isProfileComplete: true,
      },
      select: {
        id: true,
        twitterUsername: true,
        displayName: true,
        bio: true,
        profileImageUrl: true,
        customLinks: true,
        isProfileComplete: true,
        rank: true,
        xp: true
      }
    });
    console.log('Updated user:', updatedUser);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Detailed error in PATCH /api/user/profile:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 