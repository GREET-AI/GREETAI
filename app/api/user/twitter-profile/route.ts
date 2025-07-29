import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

// Twitter API Client
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY || '',
  appSecret: process.env.TWITTER_API_SECRET || '',
  accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
  accessSecret: process.env.TWITTER_ACCESS_SECRET || '',
});

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.searchParams.get('username');
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Check if Twitter API keys are configured
    if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET) {
      console.warn('Twitter API keys not configured, returning dummy data');
      // Return dummy data for development
      return NextResponse.json({
        username,
        profileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        verified: false
      });
    }

    try {
      const user = await client.v2.userByUsername(username, {
        'user.fields': ['profile_image_url', 'verified']
      });

      if (!user.data) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Twitter returns a _normal size image, we'll get the original size
      const profileImageUrl = user.data.profile_image_url?.replace('_normal', '') || null;

      return NextResponse.json({
        username: user.data.username,
        profileImageUrl,
        verified: user.data.verified || false
      });
    } catch (twitterError) {
      console.error('Twitter API error:', twitterError);
      // Fallback to dummy avatar if Twitter API fails
      return NextResponse.json({
        username,
        profileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        verified: false
      });
    }
  } catch (error) {
    console.error('Error in twitter-profile route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Twitter profile' },
      { status: 500 }
    );
  }
} 