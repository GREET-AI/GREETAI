import { NextRequest, NextResponse } from 'next/server';

const BITQUERY_API_URL = 'https://graphql.bitquery.io';
const BITQUERY_API_KEY = process.env.BITQUERY_API_KEY;

export async function GET(request: NextRequest) {
  try {
    if (!BITQUERY_API_KEY) {
      return NextResponse.json(
        { error: 'Bitquery API key not configured' },
        { status: 500 }
      );
    }

    // Query to get top tokens from LetsBonk.fun (Raydium Launchpad)
    const query = `
      query GetTopLetsBonkTokens {
        Solana {
          DEXPools(
            where: {
              Pool: {
                Dex: {ProtocolName: {is: "raydium_launchpad"}}
              }
            }
            orderBy: {descending: Pool_Base_PostAmountInUSD}
            limit: {count: 6}
          ) {
            Pool {
              Market {
                BaseCurrency {
                  MintAddress
                  Name
                  Symbol
                  Decimals
                }
                QuoteCurrency {
                  MintAddress
                  Name
                  Symbol
                }
              }
              Base {
                PostAmount
                PostAmountInUSD
              }
              Quote {
                PostAmount
                PostAmountInUSD
              }
              Dex {
                ProtocolName
                ProtocolFamily
              }
            }
          }
        }
      }
    `;

    const response = await fetch(BITQUERY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': BITQUERY_API_KEY,
      },
      body: JSON.stringify({
        query,
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
    
    // Process and format the data
    const processedData = processTopTokens(data);
    
    return NextResponse.json(processedData);

  } catch (error) {
    console.error('Error in letsbonk-top-tokens API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function processTopTokens(data: any) {
  try {
    const pools = data.data?.Solana?.DEXPools || [];
    
    const tokens = pools.map((pool: any, index: number) => {
      const baseCurrency = pool.Pool?.Market?.BaseCurrency;
      const quoteCurrency = pool.Pool?.Market?.QuoteCurrency;
      const baseAmount = pool.Pool?.Base?.PostAmount || 0;
      const baseAmountUSD = pool.Pool?.Base?.PostAmountInUSD || 0;
      const quoteAmountUSD = pool.Pool?.Quote?.PostAmountInUSD || 0;
      
      // Calculate market cap (simplified)
      const marketCap = baseAmountUSD + quoteAmountUSD;
      
      // Get token age (would need additional query for creation time)
      const tokenAge = "N/A"; // Placeholder - would need to query token creation time
      
      return {
        id: index + 1,
        rank: index + 1,
        name: baseCurrency?.Name || "Unknown",
        symbol: baseCurrency?.Symbol || "UNKNOWN",
        mintAddress: baseCurrency?.MintAddress || "",
        contractAddress: baseCurrency?.MintAddress || "",
        marketCap: marketCap,
        marketCapFormatted: formatMarketCap(marketCap),
        baseAmount: baseAmount,
        baseAmountUSD: baseAmountUSD,
        quoteAmountUSD: quoteAmountUSD,
        age: tokenAge,
        platform: "LetsBonk.fun",
        protocol: pool.Pool?.Dex?.ProtocolName || "raydium_launchpad"
      };
    });

    return {
      tokens,
      totalCount: tokens.length,
      platform: "LetsBonk.fun",
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error processing top tokens:', error);
    return {
      tokens: [],
      totalCount: 0,
      platform: "LetsBonk.fun",
      lastUpdated: new Date().toISOString(),
      error: "Failed to process token data"
    };
  }
}

function formatMarketCap(marketCap: number) {
  if (marketCap >= 1000000) {
    return `$${(marketCap / 1000000).toFixed(1)}M`;
  } else if (marketCap >= 1000) {
    return `$${(marketCap / 1000).toFixed(1)}K`;
  } else {
    return `$${marketCap.toFixed(2)}`;
  }
} 