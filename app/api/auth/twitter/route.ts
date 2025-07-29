import { NextResponse } from 'next/server';
import { generateCodeVerifier, generateCodeChallenge } from '../../../utils/oauth';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextRequest } from 'next/server';

// Twitter OAuth Configuration
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID!;
// Use a more reliable redirect URI construction
const TWITTER_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback`
  : 'http://localhost:3000/api/auth/twitter/callback';

export async function GET(request: NextRequest) {
  try {
    // Get and decode wallet address from query params
    const encodedWallet = request.nextUrl.searchParams.get('wallet');
    const walletAddress = encodedWallet ? decodeURIComponent(encodedWallet) : null;
    
    if (!walletAddress) {
      console.error('Missing wallet address in request:', request.nextUrl.toString());
      throw new Error('Wallet address is required');
    }

    if (!TWITTER_CLIENT_ID) {
      console.error('Missing TWITTER_CLIENT_ID environment variable');
      throw new Error('Twitter client ID is not configured');
    }

    // Generate PKCE values
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    // Generate state with wallet address
    const state = `${crypto.randomUUID()}:${walletAddress}`;

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
    console.log('Twitter OAuth Request:', {
      walletAddress,
      state: state.substring(0, 20) + '...',
      redirectUri: TWITTER_REDIRECT_URI,
      clientId: TWITTER_CLIENT_ID.substring(0, 10) + '...'
    });

    // Set cookies for verification
    const response = NextResponse.redirect(authUrl.toString());
    
    const cookieOptions: Partial<ResponseCookie> = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 10, // 10 minutes
    };

    response.cookies.set('twitter_oauth_state', state, cookieOptions);
    response.cookies.set('twitter_code_verifier', codeVerifier, cookieOptions);

    return response;
  } catch (error) {
    console.error('Twitter OAuth Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to initialize Twitter OAuth',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 