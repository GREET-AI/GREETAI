import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const response = await fetch('https://solana-mainnet.g.alchemy.com/v2/demo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Solana RPC proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy Solana RPC request' },
      { status: 500 }
    );
  }
} 