import { NextRequest, NextResponse } from 'next/server';

const BITQUERY_API_URL = 'https://graphql.bitquery.io';
const BITQUERY_API_KEY = process.env.BITQUERY_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { query, variables } = await request.json();

    if (!BITQUERY_API_KEY) {
      return NextResponse.json(
        { error: 'Bitquery API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(BITQUERY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': BITQUERY_API_KEY,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Bitquery API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch data from Bitquery' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in token-data API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Additional queries for different platforms
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  const mintAddress = searchParams.get('mintAddress');

  if (!platform || !mintAddress) {
    return NextResponse.json(
      { error: 'Platform and mint address are required' },
      { status: 400 }
    );
  }

  try {
    let query: string;
    let variables: any;

    if (platform === 'letsbonk') {
      // Query for LetsBonk.fun token data
      query = `
        query GetLetsBonkTokenData($mintAddress: String!) {
          Solana {
            DEXTradeByTokens(
              orderBy: {descending: Block_Time}
              limit: {count: 1}
              where: {
                Trade: {
                  Dex: {ProtocolName: {is: "raydium_launchpad"}}, 
                  Currency: {MintAddress: {is: $mintAddress}}
                }
              }
            ) {
              Block {
                Time
              }
              Trade {
                AmountInUSD
                PriceInUSD
                Amount
                Currency {
                  Name
                  Symbol
                  MintAddress
                }
              }
            }
          }
        }
      `;
      variables = { mintAddress };
    } else if (platform === 'pumpfun') {
      // Query for Pump.fun token data
      query = `
        query GetPumpFunTokenData($mintAddress: String!) {
          Solana {
            DEXTrades(
              limitBy: {by: Trade_Buy_Currency_MintAddress, count: 1}
              limit: {count: 10}
              orderBy: {descending: Trade_Buy_Price}
              where: {
                Trade: {
                  Dex: {ProtocolName: {is: "pump"}}, 
                  Buy: {Currency: {MintAddress: {is: $mintAddress}}}
                }, 
                Transaction: {Result: {Success: true}}
              }
            ) {
              Trade {
                Buy {
                  Price(maximum: Block_Time)
                  PriceInUSD(maximum: Block_Time)
                  Currency {
                    Name
                    Symbol
                    MintAddress
                    Decimals
                  }
                }
                AmountInUSD
                PriceInUSD
              }
            }
          }
        }
      `;
      variables = { mintAddress };
    } else {
      return NextResponse.json(
        { error: 'Unsupported platform' },
        { status: 400 }
      );
    }

    const response = await fetch(BITQUERY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': BITQUERY_API_KEY!,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Bitquery API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch data from Bitquery' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in token-data API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 