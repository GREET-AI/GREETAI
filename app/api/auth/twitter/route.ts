import { NextResponse } from 'next/server';
import { generateCodeVerifier, generateCodeChallenge } from '../../../utils/oauth';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextRequest } from 'next/server';

// Twitter OAuth Configuration
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID!;
const TWITTER_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/twitter/callback';

export async function GET(request: NextRequest) {
  try {
    // Get and decode wallet address from query params
    const encodedWallet = request.nextUrl.searchParams.get('wallet');
    
    console.log('Twitter OAuth Request:', {
      url: request.nextUrl.toString(),
      encodedWallet,
      headers: Object.fromEntries(request.headers.entries())
    });
    
    if (!encodedWallet) {
      console.error('Missing wallet address in request:', request.nextUrl.toString());
      return NextResponse.json(
        { 
          error: 'Wallet address is required',
          details: 'The wallet parameter is missing from the request'
        },
        { status: 400 }
      );
    }

    const walletAddress = decodeURIComponent(encodedWallet);
    
    if (!walletAddress) {
      console.error('Invalid wallet address after decoding:', encodedWallet);
      return NextResponse.json(
        { 
          error: 'Invalid wallet address',
          details: 'Could not decode the wallet address'
        },
        { status: 400 }
      );
    }

    if (!TWITTER_CLIENT_ID) {
      console.error('Missing TWITTER_CLIENT_ID environment variable');
      return NextResponse.json(
        { 
          error: 'Configuration error',
          details: 'Twitter Client ID is not configured'
        },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.error('Missing NEXT_PUBLIC_APP_URL environment variable');
      return NextResponse.json(
        { 
          error: 'Configuration error',
          details: 'App URL is not configured'
        },
        { status: 500 }
      );
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
      redirectUri: TWITTER_REDIRECT_URI
    });

    // Set cookies for verification
    const response = NextResponse.redirect(authUrl.toString());
    
    const cookieOptions: Partial<ResponseCookie> = {
      httpOnly: true,
      secure: true,
      sameSite: 'none' as const,
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