import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import prisma from '../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Text is required' }, { status: 400 });
    }

    // For now, we'll get the first user with Twitter tokens
    // In production, you'd get the current user from the session
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
        error: 'No Twitter account connected. Please connect your Twitter account first.' 
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
          error: 'Twitter token expired and could not be refreshed. Please reconnect your Twitter account.' 
        }, { status: 401 });
      }
    }

    // Create Twitter client with user access token
    const client = new TwitterApi(accessToken);

    // Post tweet
    const tweet = await client.v2.tweet(text);
    
    console.log(`Posted tweet successfully: ${tweet.data.id}`);
    console.log(`Content: ${text}`);

    return NextResponse.json({ 
      success: true, 
      tweetId: tweet.data.id,
      message: 'Tweet posted successfully'
    });

  } catch (error) {
    console.error('Error posting to Twitter:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to post to Twitter' 
    }, { status: 500 });
  }
}

// Real implementation would look like this:
// import { TwitterApi } from 'twitter-api-v2';
// 
// export async function POST(request: NextRequest) {
//   try {
//     const { text } = await request.json();
//     
//     // Get user's Twitter tokens from database
//     const user = await prisma.user.findFirst({
//       where: { /* user identification */ },
//       select: { twitterAccessToken: true, twitterRefreshToken: true }
//     });
// 
//     if (!user?.twitterAccessToken) {
//       return NextResponse.json({ success: false, error: 'Twitter not connected' }, { status: 401 });
//     }
// 
//     // Create Twitter client
//     const client = new TwitterApi({
//       appKey: process.env.TWITTER_API_KEY!,
//       appSecret: process.env.TWITTER_API_SECRET!,
//       accessToken: user.twitterAccessToken,
//       accessSecret: user.twitterRefreshToken,
//     });
// 
//     // Post tweet
//     const tweet = await client.v2.tweet(text);
//     
//     return NextResponse.json({ 
//       success: true, 
//       tweetId: tweet.data.id,
//       message: 'Tweet posted successfully'
//     });
// 
//   } catch (error) {
//     console.error('Error posting to Twitter:', error);
//     return NextResponse.json({ 
//       success: false, 
//       error: 'Failed to post to Twitter' 
//     }, { status: 500 });
//   }
// } 