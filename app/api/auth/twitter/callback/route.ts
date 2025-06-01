import { NextRequest, NextResponse } from 'next/server';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import prisma from '../../../../lib/prisma';

const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID!;
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET!;
const TWITTER_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/twitter/callback';

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

  if (!code || !codeVerifier) {
    throw new Error('Missing required OAuth parameters');
  }

  if (!process.env.TWITTER_CLIENT_ID || !process.env.TWITTER_CLIENT_SECRET) {
    console.error('Missing Twitter credentials:', {
      hasClientId: !!process.env.TWITTER_CLIENT_ID,
      hasClientSecret: !!process.env.TWITTER_CLIENT_SECRET
    });
    throw new Error('Missing Twitter API credentials');
  }

  // Clean and validate credentials
  const clientId = process.env.TWITTER_CLIENT_ID.trim();
  const clientSecret = process.env.TWITTER_CLIENT_SECRET.trim();

  // Validate credential lengths - Client ID must be 34 chars, Secret can be 49 or 50
  if (clientId.length !== 34 || (clientSecret.length !== 49 && clientSecret.length !== 50)) {
    console.error('Invalid credential lengths:', {
      expectedClientIdLength: 34,
      actualClientIdLength: clientId.length,
      expectedClientSecretLength: '49 or 50',
      actualClientSecretLength: clientSecret.length
    });
    throw new Error('Invalid Twitter API credential lengths');
  }

  // Log raw credentials for debugging (first few chars only)
  console.log('Raw Credentials Debug:', {
    clientIdStart: clientId.substring(0, 5) + '...',
    clientSecretStart: clientSecret.substring(0, 5) + '...',
    hasSpecialChars: {
      clientId: /[^a-zA-Z0-9-]/.test(clientId),
      clientSecret: /[^a-zA-Z0-9-]/.test(clientSecret)
    }
  });

  // Prepare authorization header
  const credentials = `${clientId}:${clientSecret}`;
  const base64Credentials = Buffer.from(credentials).toString('base64');
  const authHeader = `Basic ${base64Credentials}`;

  // Validate final header format
  if (!authHeader.startsWith('Basic ') || authHeader.length < 20) {
    console.error('Invalid auth header format:', {
      startsWithBasic: authHeader.startsWith('Basic '),
      headerLength: authHeader.length
    });
    throw new Error('Invalid authorization header format');
  }

  console.log('Auth Debug:', {
    credentialsLength: credentials.length,
    base64Length: base64Credentials.length,
    authHeaderLength: authHeader.length,
    sampleAuth: authHeader.substring(0, 20) + '...',
    format: {
      hasColon: credentials.includes(':'),
      colonPosition: credentials.indexOf(':'),
      base64Pattern: /^[A-Za-z0-9+/]+=*$/.test(base64Credentials)
    }
  });

  try {
    // Exchange code for tokens
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: TWITTER_REDIRECT_URI,
      code_verifier: codeVerifier
    });

    console.log('Request Parameters:', {
      grantType: params.get('grant_type'),
      codeLength: code.length,
      redirectUri: params.get('redirect_uri'),
      verifierLength: codeVerifier.length
    });

    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params.toString()
    });

    // Log response details before checking status
    console.log('Token Response Debug:', {
      status: tokenResponse.status,
      statusText: tokenResponse.statusText,
      headers: Object.fromEntries(tokenResponse.headers.entries())
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
          headerKeys: Object.keys(tokenResponse.headers),
          bodyParams: Array.from(params.keys())
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
      await prisma.user.upsert({
        where: { pumpWallet: walletAddress },
        update: {
          twitterUsername: userData.data.username,
          twitterAccessToken: tokenData.access_token,
          twitterRefreshToken: tokenData.refresh_token,
          twitterTokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000)
        },
        create: {
          pumpWallet: walletAddress,
          twitterUsername: userData.data.username,
          twitterAccessToken: tokenData.access_token,
          twitterRefreshToken: tokenData.refresh_token,
          twitterTokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
          referralCode: `GREET${Math.random().toString(36).substring(2, 8).toUpperCase()}`
        }
      });
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
      secure: true,
      sameSite: 'none' as const,
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