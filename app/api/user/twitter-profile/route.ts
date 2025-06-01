import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

// Twitter API Client
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
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
  } catch (error) {
    console.error('Error fetching Twitter profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Twitter profile' },
      { status: 500 }
    );
  }
} 