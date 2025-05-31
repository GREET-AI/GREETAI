import { NextResponse } from 'next/server';
import { generateCodeVerifier, generateCodeChallenge } from '../../../utils/oauth';

// Twitter OAuth Configuration
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID!;
const TWITTER_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/twitter/callback';

export async function GET() {
  try {
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
    authUrl.searchParams.append('scope', 'tweet.read users.read');
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');

    // Set cookies for verification
    const response = NextResponse.redirect(authUrl.toString());
    response.cookies.set('twitter_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10 // 10 minutes
    });
    response.cookies.set('twitter_code_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10 // 10 minutes
    });

    return response;
  } catch (error) {
    console.error('Twitter OAuth Error:', error);
    return NextResponse.json({ error: 'Failed to initialize Twitter OAuth' }, { status: 500 });
  }
} 