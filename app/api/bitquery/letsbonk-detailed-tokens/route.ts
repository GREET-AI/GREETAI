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

    // More comprehensive query for LetsBonk.fun tokens
    const query = `
      query GetDetailedLetsBonkTokens {
        Solana {
          # Get top pools by market cap
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
          
          # Get recent trades for volume calculation
          DEXTrades(
            where: {
              Trade: {
                Dex: {ProtocolName: {is: "raydium_launchpad"}}
              }
            }
            orderBy: {descending: Block_Time}
            limit: {count: 100}
          ) {
            Block {
              Time
            }
            Trade {
              AmountInUSD
              PriceInUSD
              Buy {
                Currency {
                  MintAddress
                  Symbol
                }
              }
              Sell {
                Currency {
                  MintAddress
                  Symbol
                }
              }
            }
          }
          
          # Get token creation events
          Instructions(
            where: {
              Instruction: {
                Program: {Address: {is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"}}
              }
            }
            orderBy: {descending: Block_Time}
            limit: {count: 50}
          ) {
            Block {
              Time
            }
            Instruction {
              Program {
                Method
              }
              Accounts {
                Address
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
    const processedData = processDetailedTokens(data);
    
    return NextResponse.json(processedData);

  } catch (error) {
    console.error('Error in letsbonk-detailed-tokens API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function processDetailedTokens(data: any) {
  try {
    const pools = data.data?.Solana?.DEXPools || [];
    const trades = data.data?.Solana?.DEXTrades || [];
    const instructions = data.data?.Solana?.Instructions || [];
    
    const tokens = pools.map((pool: any, index: number) => {
      const baseCurrency = pool.Pool?.Market?.BaseCurrency;
      const mintAddress = baseCurrency?.MintAddress;
      
      // Calculate market cap
      const baseAmountUSD = pool.Pool?.Base?.PostAmountInUSD || 0;
      const quoteAmountUSD = pool.Pool?.Quote?.PostAmountInUSD || 0;
      const marketCap = baseAmountUSD + quoteAmountUSD;
      
      // Calculate 24h volume for this token
      const tokenTrades = trades.filter((trade: any) => {
        const buyMint = trade.Trade?.Buy?.Currency?.MintAddress;
        const sellMint = trade.Trade?.Sell?.Currency?.MintAddress;
        return buyMint === mintAddress || sellMint === mintAddress;
      });
      
      const volume24h = tokenTrades.reduce((sum: number, trade: any) => {
        return sum + (trade.Trade?.AmountInUSD || 0);
      }, 0);
      
      // Estimate token age (simplified - would need more complex logic)
      const tokenAge = "N/A"; // Placeholder
      
      // Get latest price
      const latestTrade = tokenTrades[0];
      const latestPrice = latestTrade?.Trade?.PriceInUSD || 0;
      
      return {
        id: index + 1,
        rank: index + 1,
        name: baseCurrency?.Name || "Unknown",
        symbol: baseCurrency?.Symbol || "UNKNOWN",
        mintAddress: mintAddress || "",
        contractAddress: mintAddress || "",
        marketCap: marketCap,
        marketCapFormatted: formatMarketCap(marketCap),
        volume24h: volume24h,
        volume24hFormatted: formatVolume(volume24h),
        price: latestPrice,
        priceFormatted: formatPrice(latestPrice),
        baseAmount: pool.Pool?.Base?.PostAmount || 0,
        baseAmountUSD: baseAmountUSD,
        quoteAmountUSD: quoteAmountUSD,
        age: tokenAge,
        platform: "LetsBonk.fun",
        protocol: pool.Pool?.Dex?.ProtocolName || "raydium_launchpad",
        decimals: baseCurrency?.Decimals || 9
      };
    });

    return {
      tokens,
      totalCount: tokens.length,
      platform: "LetsBonk.fun",
      lastUpdated: new Date().toISOString(),
      summary: {
        totalMarketCap: tokens.reduce((sum: number, token: any) => sum + token.marketCap, 0),
        totalVolume24h: tokens.reduce((sum: number, token: any) => sum + token.volume24h, 0)
      }
    };

  } catch (error) {
    console.error('Error processing detailed tokens:', error);
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

function formatVolume(volume: number) {
  if (volume >= 1000000) {
    return `$${(volume / 1000000).toFixed(1)}M`;
  } else if (volume >= 1000) {
    return `$${(volume / 1000).toFixed(1)}K`;
  } else {
    return `$${volume.toFixed(2)}`;
  }
}

function formatPrice(price: number) {
  if (price >= 1) {
    return `$${price.toFixed(4)}`;
  } else if (price >= 0.0001) {
    return `$${price.toFixed(6)}`;
  } else {
    return `$${price.toExponential(2)}`;
  }
} 