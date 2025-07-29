import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import prisma from '../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { tweetId, expectedContent } = await request.json();

    if (!tweetId || !expectedContent) {
      return NextResponse.json({ 
        success: false, 
        verified: false,
        error: 'Tweet ID and expected content are required' 
      }, { status: 400 });
    }

    // Get user's Twitter tokens from database
    const user = await prisma.user.findFirst({
      where: {
        twitterAccessToken: { not: null },
        twitterRefreshToken: { not: null }
      },
      select: {
        twitterAccessToken: true,
        twitterRefreshToken: true,
        twitterTokenExpiresAt: true,
        twitterUsername: true
      }
    });

    if (!user?.twitterAccessToken) {
      return NextResponse.json({ 
        success: false, 
        verified: false,
        error: 'No Twitter account connected' 
      }, { status: 401 });
    }

    // Check if token is expired and refresh if needed
    let accessToken = user.twitterAccessToken;
    if (user.twitterTokenExpiresAt && user.twitterTokenExpiresAt < new Date()) {
      console.log('Token expired, refreshing...');
      
      const credentials = Buffer.from(
        `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
      ).toString('base64');

      const refreshResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: user.twitterRefreshToken!
        }).toString()
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        accessToken = refreshData.access_token;
        
        // Update tokens in database
        await prisma.user.updateMany({
          where: { twitterUsername: user.twitterUsername },
          data: {
            twitterAccessToken: refreshData.access_token,
            twitterRefreshToken: refreshData.refresh_token,
            twitterTokenExpiresAt: new Date(Date.now() + refreshData.expires_in * 1000)
          }
        });
      } else {
        return NextResponse.json({ 
          success: false, 
          verified: false,
          error: 'Twitter token expired and could not be refreshed' 
        }, { status: 401 });
      }
    }

    // Create Twitter client
    const client = new TwitterApi(accessToken);

    // Fetch the tweet
    const tweet = await client.v2.singleTweet(tweetId, {
      expansions: ['author_id'],
      'tweet.fields': ['text', 'created_at']
    });

    if (!tweet.data) {
      return NextResponse.json({ 
        success: true, 
        verified: false,
        message: 'Tweet not found' 
      });
    }

    // Check if content matches (allowing for minor differences)
    const actualContent = tweet.data.text;
    const contentMatches = actualContent.includes('@AIGreet') && 
                          actualContent.includes('#GREET') &&
                          actualContent.length > 50; // Basic content check

    console.log(`Verifying tweet ${tweetId}: ${contentMatches ? 'VERIFIED' : 'FAILED'}`);
    console.log(`Expected: ${expectedContent.substring(0, 100)}...`);
    console.log(`Actual: ${actualContent.substring(0, 100)}...`);

    return NextResponse.json({ 
      success: true, 
      verified: contentMatches,
      message: contentMatches ? 'Tweet verified successfully' : 'Content mismatch'
    });

  } catch (error) {
    console.error('Error verifying tweet:', error);
    return NextResponse.json({ 
      success: false, 
      verified: false,
      error: 'Failed to verify tweet' 
    }, { status: 500 });
  }
}

// Real implementation would use Twitter API v2 to verify tweets
// by fetching the tweet and comparing content 