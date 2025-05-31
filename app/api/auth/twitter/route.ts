import { NextResponse } from 'next/server';
import { generateCodeVerifier, generateCodeChallenge } from '../../../utils/oauth';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

// Twitter OAuth Configuration
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID!;
const TWITTER_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/twitter/callback';

export async function GET() {
  try {
    // Debug logging
    console.log('Twitter OAuth Config:', {
      clientId: TWITTER_CLIENT_ID ? 'present' : 'missing',
      redirectUri: TWITTER_REDIRECT_URI,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      nodeEnv: process.env.NODE_ENV
    });

    if (!TWITTER_CLIENT_ID) {
      throw new Error('TWITTER_CLIENT_ID is not defined');
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error('NEXT_PUBLIC_APP_URL is not defined');
    }

    // Generate PKCE values
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    // Generate state
    const state = crypto.randomUUID();

    // Build Twitter OAuth URL
    const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', TWITTER_CLIENT_ID);
    authUrl.searchParams.append('redirect_uri', TWITTER_REDIRECT_URI);
    authUrl.searchParams.append('scope', 'tweet.read users.read offline.access');
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');

    // Debug logging
    console.log('OAuth Debug:', {
      state,
      codeVerifier: codeVerifier ? 'generated' : 'missing',
      codeChallenge: codeChallenge ? 'generated' : 'missing',
      authUrl: authUrl.toString()
    });

    // Set cookies for verification
    const response = NextResponse.redirect(authUrl.toString());
    
    // Set cookies with more permissive settings for local development
    const cookieOptions: Partial<ResponseCookie> = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'lax' as const : 'none' as const,
      path: '/',
      maxAge: 60 * 10 // 10 minutes
    };

    response.cookies.set('twitter_oauth_state', state, cookieOptions);
    response.cookies.set('twitter_code_verifier', codeVerifier, cookieOptions);

    console.log('Setting cookies with options:', cookieOptions);

    return response;
  } catch (error) {
    console.error('Twitter OAuth Error:', error);
    return NextResponse.json({ error: 'Failed to initialize Twitter OAuth', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 