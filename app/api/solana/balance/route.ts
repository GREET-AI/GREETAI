import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    const heliusApiKey = process.env.HELIUS_API_KEY;
    const heliusEndpoint = process.env.HELIUS_RPC_ENDPOINT;

    if (!heliusApiKey || !heliusEndpoint) {
      console.error('Helius API credentials not configured');
      return NextResponse.json({ error: 'Helius API not configured' }, { status: 500 });
    }

    // TODO: When GREET token is live, implement real balance checking
    // const greetTokenMint = 'GREET_TOKEN_MINT_ADDRESS_HERE';
    // 
    // const response = await fetch(heliusEndpoint, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     jsonrpc: '2.0',
    //     id: 'my-id',
    //     method: 'getTokenAccountsByOwner',
    //     params: [walletAddress, { mint: greetTokenMint }, { encoding: 'jsonParsed' }]
    //   })
    // });
    // 
    // const data = await response.json();
    // const greetBalance = data.result?.value?.[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0;

    // For now, everything is 0 until GREET token is live
    const balanceData = {
      greetBalance: 0,
      greetPot: 0,
      solBalance: 0,
      portfolioValue: 0,
    };

    return NextResponse.json({
      success: true,
      data: balanceData
    });

  } catch (error) {
    console.error('Error fetching Solana balance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET method for testing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet');

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Same logic as POST - everything is 0
    const balanceData = {
      greetBalance: 0,
      greetPot: 0,
      solBalance: 0,
      portfolioValue: 0,
    };

    return NextResponse.json({
      success: true,
      data: balanceData
    });

  } catch (error) {
    console.error('Error fetching Solana balance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 