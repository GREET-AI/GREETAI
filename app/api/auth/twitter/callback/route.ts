import { NextRequest, NextResponse } from 'next/server';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import prisma from '../../../../lib/prisma';

const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID!;
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET!;
// Use a more reliable redirect URI construction
const TWITTER_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback`
  : 'http://localhost:3000/api/auth/twitter/callback';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const walletAddress = searchParams.get('state')?.split(':')[1]; // We'll store wallet in state
  
  // Get stored values from cookies
  const storedState = request.cookies.get('twitter_oauth_state')?.value;
  const codeVerifier = request.cookies.get('twitter_code_verifier')?.value;

  console.log('OAuth Callback Debug:', {
    code: code ? 'present' : 'missing',
    state,
    storedState,
    codeVerifier: codeVerifier ? 'present' : 'missing',
    cookies: request.cookies.getAll().map(c => ({name: c.name, value: c.value})),
    redirectUri: TWITTER_REDIRECT_URI,
    nodeEnv: process.env.NODE_ENV
  });

  // Verify state to prevent CSRF
  if (!state || !storedState || state !== storedState) {
    console.error('State verification failed:', {
      receivedState: state,
      storedState,
      match: state === storedState,
      allCookies: request.cookies.getAll().map(c => c.name)
    });
    return new NextResponse(
      `<html><body><script>
        window.opener.postMessage({ type: 'TWITTER_AUTH_ERROR', error: 'Invalid state' }, '*');
        window.close();
      </script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  try {
    // Generate Base64 credentials
    const credentials = Buffer.from(
      `${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`
    ).toString('base64');

    // Exchange code for tokens
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code!,
        redirect_uri: TWITTER_REDIRECT_URI,
        code_verifier: codeVerifier!
      }).toString()
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token Exchange Error:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorText,
        requestDetails: {
          url: 'https://api.twitter.com/2/oauth2/token',
          method: 'POST',
          headers: {
            'Authorization': `Basic ${credentials.substring(0, 20)}...`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          bodyParams: Object.fromEntries(new URLSearchParams({
            grant_type: 'authorization_code',
            code: code?.substring(0, 20) + '...',
            redirect_uri: TWITTER_REDIRECT_URI,
            code_verifier: codeVerifier?.substring(0, 20) + '...'
          }).entries())
        }
      });
      throw new Error(`Token exchange failed: ${tokenResponse.status} (${errorText})`);
    }

    const tokenData = await tokenResponse.json();

    // Get user info
    const userResponse = await fetch('https://api.twitter.com/2/users/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.text();
      console.error('User info fetch failed:', {
        status: userResponse.status,
        statusText: userResponse.statusText,
        error: errorData
      });
      throw new Error('Failed to get user info');
    }

    const userData = await userResponse.json();

    // Store tokens in database
    if (walletAddress) {
      // First, check if a user with this Twitter username already exists
      const existingUser = await prisma.user.findUnique({
        where: { twitterUsername: userData.data.username }
      });

      if (existingUser) {
        // Update existing user with new wallet and tokens
        await prisma.user.update({
          where: { twitterUsername: userData.data.username },
          data: {
            pumpWallet: walletAddress,
            twitterAccessToken: tokenData.access_token,
            twitterRefreshToken: tokenData.refresh_token,
            twitterTokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000)
          }
        });
      } else {
        // Check if a user with this wallet already exists
        const existingWalletUser = await prisma.user.findUnique({
          where: { pumpWallet: walletAddress }
        });

        if (existingWalletUser) {
          // Update existing wallet user with Twitter info
          await prisma.user.update({
            where: { pumpWallet: walletAddress },
            data: {
              twitterUsername: userData.data.username,
              twitterAccessToken: tokenData.access_token,
              twitterRefreshToken: tokenData.refresh_token,
              twitterTokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000)
            }
          });
        } else {
          // Create new user
          await prisma.user.create({
            data: {
              pumpWallet: walletAddress,
              twitterUsername: userData.data.username,
              twitterAccessToken: tokenData.access_token,
              twitterRefreshToken: tokenData.refresh_token,
              twitterTokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
              referralCode: `GREET${Math.random().toString(36).substring(2, 8).toUpperCase()}`
            }
          });
        }
      }
    }

    // Clear OAuth cookies and return success
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

    // Cookie options for clearing
    const cookieOptions: Partial<ResponseCookie> = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 0
    };

    response.cookies.set('twitter_oauth_state', '', cookieOptions);
    response.cookies.set('twitter_code_verifier', '', cookieOptions);

    return response;
  } catch (error) {
    console.error('Twitter OAuth Error:', error);
    return new NextResponse(
      `<html><body><script>
        window.opener.postMessage({
          type: 'TWITTER_AUTH_ERROR',
          error: ${JSON.stringify(error instanceof Error ? error.message : 'Authentication failed')}
        }, '*');
        window.close();
      </script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
} 