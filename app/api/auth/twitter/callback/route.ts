import { NextRequest, NextResponse } from 'next/server';

const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID!;
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET!;
const TWITTER_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/twitter/callback';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  
  // Get stored values from cookies
  const storedState = request.cookies.get('twitter_oauth_state')?.value;
  const codeVerifier = request.cookies.get('twitter_code_verifier')?.value;

  // Verify state to prevent CSRF
  if (!state || !storedState || state !== storedState) {
    return new NextResponse(
      `<html><body><script>
        window.opener.postMessage({ type: 'TWITTER_AUTH_ERROR', error: 'Invalid state' }, '*');
        window.close();
      </script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        code: code!,
        grant_type: 'authorization_code',
        redirect_uri: TWITTER_REDIRECT_URI,
        code_verifier: codeVerifier!,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token');
    }

    const tokenData = await tokenResponse.json();

    // Get user info
    const userResponse = await fetch('https://api.twitter.com/2/users/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const userData = await userResponse.json();

    // Clear OAuth cookies
    const response = new NextResponse(
      `<html><body><script>
        window.opener.postMessage({
          type: 'TWITTER_AUTH_SUCCESS',
          username: '${userData.data.username}'
        }, '*');
        window.close();
      </script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );

    response.cookies.delete('twitter_oauth_state');
    response.cookies.delete('twitter_code_verifier');

    return response;
  } catch (error) {
    console.error('Twitter OAuth Error:', error);
    return new NextResponse(
      `<html><body><script>
        window.opener.postMessage({
          type: 'TWITTER_AUTH_ERROR',
          error: 'Authentication failed'
        }, '*');
        window.close();
      </script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}

export async function GET_popup(request: Request) {
  try {
    // Handle OAuth callback logic here
    
    // Return HTML that sends a message to the opener and closes itself
    return new NextResponse(
      `
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'TWITTER_AUTH_SUCCESS' }, '*');
              window.close();
            }
          </script>
        </body>
      </html>
      `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Twitter callback error:', error);
    return new NextResponse(
      `
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'TWITTER_AUTH_ERROR' }, '*');
              window.close();
            }
          </script>
        </body>
      </html>
      `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
} 