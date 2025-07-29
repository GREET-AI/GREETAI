import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get Twitter API credentials from environment variables
    const apiKey = process.env.TWITTER_API_KEY;
    const apiSecret = process.env.TWITTER_API_SECRET;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const accessSecret = process.env.TWITTER_ACCESS_SECRET;

    if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
      console.error('Missing Twitter API credentials');
      return NextResponse.json({ error: 'Twitter API credentials not configured' }, { status: 500 });
    }

    // GREET Twitter account ID (you might need to update this)
    const userId = '1928824337466851328'; // This should be the GREET account ID
    
    // Fetch user timeline using OAuth 1.0a
    const timelineUrl = `https://api.twitter.com/2/users/${userId}/tweets?max_results=20&tweet.fields=created_at,public_metrics,author_id&user.fields=profile_image_url,username,name&expansions=author_id`;
    
    // For now, let's use a simpler approach with the user's own timeline
    // We'll need to get the bearer token first or use OAuth 1.0a
    
    // Try to get bearer token from environment or generate one
    let bearerToken = process.env.TWITTER_BEARER_TOKEN;
    
    if (!bearerToken) {
      // Generate bearer token from API key and secret
      const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
      const tokenResponse = await fetch('https://api.twitter.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: 'grant_type=client_credentials',
      });

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        bearerToken = tokenData.access_token;
      } else {
        console.error('Failed to get bearer token:', tokenResponse.status);
        return NextResponse.json({ error: 'Failed to authenticate with Twitter API' }, { status: 500 });
      }
    }

    const headers: HeadersInit = {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(timelineUrl, { headers });
    
    if (!response.ok) {
      console.error('Twitter API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return NextResponse.json({ error: 'Failed to fetch Twitter posts' }, { status: response.status });
    }

    const data = await response.json();
    
    // Transform Twitter data to our format
    const posts = data.data?.map((tweet: any) => {
      const user = data.includes?.users?.find((u: any) => u.id === tweet.author_id);
      const metrics = tweet.public_metrics;
      
      return {
        id: tweet.id,
        type: 'x-post' as const,
        user: {
          name: user?.name || 'GREET',
          username: user ? `@${user.username}` : '@GREET',
          avatar: user?.profile_image_url || '/GREET.png'
        },
        content: tweet.text,
        timestamp: formatTimestamp(tweet.created_at),
        engagement: {
          likes: metrics?.like_count || 0,
          shares: metrics?.retweet_count || 0,
          comments: metrics?.reply_count || 0
        }
      };
    }) || [];

    return NextResponse.json({ posts });

  } catch (error) {
    console.error('Error fetching Twitter posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function formatTimestamp(createdAt: string): string {
  const now = new Date();
  const tweetDate = new Date(createdAt);
  const diffInMinutes = Math.floor((now.getTime() - tweetDate.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return tweetDate.toLocaleDateString();
} 