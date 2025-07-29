import { NextRequest, NextResponse } from 'next/server';

const BITQUERY_API_URL = 'https://graphql.bitquery.io';
const BITQUERY_API_KEY = process.env.BITQUERY_API_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mintAddress = searchParams.get('mintAddress');
  const platform = searchParams.get('platform');

  if (!mintAddress || !platform) {
    return NextResponse.json(
      { error: 'Mint address and platform are required' },
      { status: 400 }
    );
  }

  try {
    let query: string;
    let variables: any;

    if (platform === 'letsbonk') {
      // Comprehensive query for LetsBonk.fun token statistics
      query = `
        query GetLetsBonkTokenStats($mintAddress: String!) {
          Solana {
            # Latest price and trade data
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
            
            # Pool data for market cap calculation
            DEXPools(
              where: {
                Pool: {
                  Base: {Currency: {MintAddress: {is: $mintAddress}}}, 
                  Dex: {ProtocolName: {is: "raydium_launchpad"}}
                }
              }
            ) {
              Pool {
                Base {
                  PostAmount
                  PostAmountInUSD
                }
                Quote {
                  PostAmount
                  PostAmountInUSD
                }
                Market {
                  BaseCurrency {
                    MintAddress
                    Name
                    Symbol
                  }
                  QuoteCurrency {
                    MintAddress
                    Name
                    Symbol
                  }
                }
              }
            }
            
            # Token holder count (approximate)
            Transfers(
              where: {
                Currency: {MintAddress: {is: $mintAddress}}
              }
              limit: {count: 1000}
            ) {
              Receiver {
                Address
              }
              Sender {
                Address
              }
              Currency {
                MintAddress
                Symbol
              }
            }
          }
        }
      `;
    } else if (platform === 'pumpfun') {
      // Comprehensive query for Pump.fun token statistics
      query = `
        query GetPumpFunTokenStats($mintAddress: String!) {
          Solana {
            # Latest trades
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
            
            # Token supply and creation info
            TokenSupplyUpdates(
              where: {
                TokenSupplyUpdate: {
                  Currency: {MintAddress: {is: $mintAddress}}
                }
              }
            ) {
              TokenSupplyUpdate {
                Amount
                PostBalance
                Currency {
                  Symbol
                  MintAddress
                  Decimals
                }
              }
            }
            
            # Recent transfers for holder count
            Transfers(
              where: {
                Currency: {MintAddress: {is: $mintAddress}}
              }
              limit: {count: 1000}
            ) {
              Receiver {
                Address
              }
              Sender {
                Address
              }
              Currency {
                MintAddress
                Symbol
              }
            }
          }
        }
      `;
    } else {
      return NextResponse.json(
        { error: 'Unsupported platform' },
        { status: 400 }
      );
    }

    variables = { mintAddress };

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
    
    // Process and format the data
    const processedData = processTokenStats(data, platform);
    
    return NextResponse.json(processedData);

  } catch (error) {
    console.error('Error in token-stats API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function processTokenStats(data: any, platform: string) {
  try {
    const solanaData = data.data?.Solana;
    if (!solanaData) {
      return {
        priceInUSD: 0,
        volume24h: 0,
        marketCap: 0,
        holders: 0,
        lastTradeTime: null,
        platform
      };
    }

    // Extract latest price
    let priceInUSD = 0;
    let lastTradeTime = null;

    if (platform === 'letsbonk') {
      const latestTrade = solanaData.DEXTradeByTokens?.[0];
      if (latestTrade) {
        priceInUSD = latestTrade.Trade?.PriceInUSD || 0;
        lastTradeTime = latestTrade.Block?.Time;
      }
    } else if (platform === 'pumpfun') {
      const latestTrade = solanaData.DEXTrades?.[0];
      if (latestTrade) {
        priceInUSD = latestTrade.Trade?.Buy?.PriceInUSD || 0;
        // Note: Pump.fun trades don't include Block.Time in this query
      }
    }

    // Calculate market cap (simplified)
    let marketCap = 0;
    if (platform === 'letsbonk') {
      const pool = solanaData.DEXPools?.[0];
      if (pool) {
        const baseAmountUSD = pool.Pool?.Base?.PostAmountInUSD || 0;
        const quoteAmountUSD = pool.Pool?.Quote?.PostAmountInUSD || 0;
        marketCap = baseAmountUSD + quoteAmountUSD;
      }
    }

    // Estimate holders (unique addresses from transfers)
    let holders = 0;
    const transfers = solanaData.Transfers || [];
    const uniqueAddresses = new Set();
    
    transfers.forEach((transfer: any) => {
      if (transfer.Receiver?.Address) {
        uniqueAddresses.add(transfer.Receiver.Address);
      }
      if (transfer.Sender?.Address) {
        uniqueAddresses.add(transfer.Sender.Address);
      }
    });
    
    holders = uniqueAddresses.size;

    // Calculate 24h volume (simplified - would need more complex query for accurate data)
    let volume24h = 0;
    if (platform === 'letsbonk') {
      const latestTrade = solanaData.DEXTradeByTokens?.[0];
      if (latestTrade) {
        volume24h = latestTrade.Trade?.AmountInUSD || 0;
      }
    } else if (platform === 'pumpfun') {
      const trades = solanaData.DEXTrades || [];
      volume24h = trades.reduce((sum: number, trade: any) => {
        return sum + (trade.Trade?.AmountInUSD || 0);
      }, 0);
    }

    return {
      priceInUSD,
      volume24h,
      marketCap,
      holders,
      lastTradeTime,
      platform
    };

  } catch (error) {
    console.error('Error processing token stats:', error);
    return {
      priceInUSD: 0,
      volume24h: 0,
      marketCap: 0,
      holders: 0,
      lastTradeTime: null,
      platform
    };
  }
} 