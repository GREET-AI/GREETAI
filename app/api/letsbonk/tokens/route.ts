import { NextRequest, NextResponse } from 'next/server';

// GraphQL endpoint for LetsBonk data
const GRAPHQL_ENDPOINT = 'https://graphql.bitquery.io';

// GraphQL queries for LetsBonk data
const QUERIES = {
  // Get latest token trades
  getLatestTrades: `
    query GetLatestTrades($limit: Int = 10) {
      Solana {
        DEXTradeByTokens(
          orderBy: {descending: Block_Time}
          limit: {count: $limit}
          where: {Trade: {Dex: {ProtocolName: {is: "raydium_launchpad"}}}}
        ) {
          Block {
            Time
          }
          Transaction {
            Signature
          }
          Trade {
            Market {
              MarketAddress
            }
            Dex {
              ProtocolName
              ProtocolFamily
            }
            AmountInUSD
            PriceInUSD
            Amount
            Currency {
              Name
              Symbol
              MintAddress
            }
            Side {
              Type
              Currency {
                Symbol
                MintAddress
                Name
              }
              AmountInUSD
              Amount
            }
          }
        }
      }
    }
  `,

  // Get liquidity pools
  getLiquidityPools: `
    query GetLiquidityPools {
      Solana {
        DEXPools(
          where: {
            Pool: {
              Base: {PostAmount: {gt: "206900000", lt: "246555000"}},
              Dex: {ProgramAddress: {is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"}},
              Market: {QuoteCurrency: {MintAddress: {in: ["11111111111111111111111111111111","So11111111111111111111111111111111111111112"]}}}
            },
            Transaction: {Result: {Success: true}}
          }
        ) {
          Pool {
            Market {
              BaseCurrency {
                MintAddress
                Name
                Symbol
              }
              MarketAddress
              QuoteCurrency {
                MintAddress
                Name
                Symbol
              }
            }
            Dex {
              ProtocolName
              ProtocolFamily
            }
            Base {
              PostAmount
            }
            Quote {
              PostAmount
              PriceInUSD
              PostAmountInUSD
            }
          }
        }
      }
    }
  `,

  // Get token launches
  getTokenLaunches: `
    query GetTokenLaunches($limit: Int = 20) {
      Solana {
        Instructions(
          where: {
            Instruction: {
              Program: {Address: {is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"}},
              Method: {in: ["migrate_to_amm","migrate_to_cpswap"]}
            },
            Transaction: {Result: {Success: true}}
          }
          limit: {count: $limit}
          orderBy: {descending: Block_Time}
        ) {
          Block {
            Time
          }
          Instruction {
            Program {
              Method
              AccountNames
              Address
              Arguments {
                Value {
                  ... on Solana_ABI_Json_Value_Arg {
                    json
                  }
                  ... on Solana_ABI_Float_Value_Arg {
                    float
                  }
                  ... on Solana_ABI_Boolean_Value_Arg {
                    bool
                  }
                  ... on Solana_ABI_Bytes_Value_Arg {
                    hex
                  }
                  ... on Solana_ABI_BigInt_Value_Arg {
                    bigInteger
                  }
                  ... on Solana_ABI_Address_Value_Arg {
                    address
                  }
                  ... on Solana_ABI_Integer_Value_Arg {
                    integer
                  }
                  ... on Solana_ABI_String_Value_Arg {
                    string
                  }
                }
                Type
                Name
              }
              Name
            }
            Accounts {
              Address
              IsWritable
              Token {
                ProgramId
                Owner
                Mint
              }
            }
          }
          Transaction {
            Signature
            Signer
          }
        }
      }
    }
  `
};

// Cache for storing processed data
let tokenCache: {
  latestTrades: any[];
  liquidityPools: any[];
  tokenLaunches: any[];
  featuredTokens: any[];
  lastUpdated: number | null;
} = {
  latestTrades: [],
  liquidityPools: [],
  tokenLaunches: [],
  featuredTokens: [],
  lastUpdated: null
};

// Process and format token data
function processTokenData(rawData: any) {
  const processed = {
    latestTrades: [] as any[],
    liquidityPools: [] as any[],
    tokenLaunches: [] as any[],
    featuredTokens: [] as any[]
  };

  // Process latest trades
  if (rawData.latestTrades?.Solana?.DEXTradeByTokens) {
    processed.latestTrades = rawData.latestTrades.Solana.DEXTradeByTokens.map((trade: any) => ({
      id: trade.Transaction.Signature,
      tokenName: trade.Trade.Currency.Name,
      tokenSymbol: trade.Trade.Currency.Symbol,
      tokenAddress: trade.Trade.Currency.MintAddress,
      priceUSD: trade.Trade.PriceInUSD,
      amountUSD: trade.Trade.AmountInUSD,
      amount: trade.Trade.Amount,
      timestamp: trade.Block.Time,
      marketAddress: trade.Trade.Market.MarketAddress,
      tradeType: trade.Trade.Side.Type
    }));
  }

  // Process liquidity pools
  if (rawData.liquidityPools?.Solana?.DEXPools) {
    processed.liquidityPools = rawData.liquidityPools.Solana.DEXPools.map((pool: any) => ({
      id: pool.Pool.Market.MarketAddress,
      tokenName: pool.Pool.Market.BaseCurrency.Name,
      tokenSymbol: pool.Pool.Market.BaseCurrency.Symbol,
      tokenAddress: pool.Pool.Market.BaseCurrency.MintAddress,
      baseAmount: pool.Pool.Base.PostAmount,
      quoteAmount: pool.Pool.Quote.PostAmount,
      priceUSD: pool.Pool.Quote.PriceInUSD,
      liquidityUSD: pool.Pool.Quote.PostAmountInUSD,
      dex: pool.Pool.Dex.ProtocolName
    }));
  }

  // Process token launches
  if (rawData.tokenLaunches?.Solana?.Instructions) {
    processed.tokenLaunches = rawData.tokenLaunches.Solana.Instructions.map((launch: any) => ({
      id: launch.Transaction.Signature,
      tokenAddress: launch.Instruction.Accounts.find((acc: any) => acc.Token?.Mint)?.Token?.Mint,
      method: launch.Instruction.Program.Method,
      timestamp: launch.Block.Time,
      signer: launch.Transaction.Signer,
      programAddress: launch.Instruction.Program.Address
    }));
  }

  // Create featured tokens (combine data from all sources)
  const tokenMap = new Map<string, any>();
  
  // Add from trades
  processed.latestTrades.forEach((trade: any) => {
    if (trade.tokenAddress && !tokenMap.has(trade.tokenAddress)) {
      tokenMap.set(trade.tokenAddress, {
        ...trade,
        type: 'trading',
        lastActivity: trade.timestamp
      });
    }
  });

  // Add from pools
  processed.liquidityPools.forEach((pool: any) => {
    if (pool.tokenAddress && !tokenMap.has(pool.tokenAddress)) {
      tokenMap.set(pool.tokenAddress, {
        ...pool,
        type: 'liquidity',
        lastActivity: new Date().toISOString()
      });
    }
  });

  // Add from launches
  processed.tokenLaunches.forEach((launch: any) => {
    if (launch.tokenAddress && !tokenMap.has(launch.tokenAddress)) {
      tokenMap.set(launch.tokenAddress, {
        ...launch,
        type: 'launch',
        lastActivity: launch.timestamp
      });
    }
  });

  processed.featuredTokens = Array.from(tokenMap.values())
    .sort((a: any, b: any) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
    .slice(0, 20);

  return processed;
}

// Fetch data from GraphQL
async function fetchGraphQLData(query: string, variables: any = {}) {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BITQUERY_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('GraphQL fetch error:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');

    // Check cache (5 minutes)
    const now = Date.now();
    if (tokenCache.lastUpdated && (now - tokenCache.lastUpdated) < 5 * 60 * 1000) {
      console.log('Returning cached token data');
      return NextResponse.json({
        success: true,
        data: tokenCache,
        cached: true
      });
    }

    console.log('Fetching fresh token data from LetsBonk...');

    // Fetch all data
    const [latestTrades, liquidityPools, tokenLaunches] = await Promise.all([
      fetchGraphQLData(QUERIES.getLatestTrades, { limit }),
      fetchGraphQLData(QUERIES.getLiquidityPools),
      fetchGraphQLData(QUERIES.getTokenLaunches, { limit })
    ]);

    // Process data
    const processedData = processTokenData({
      latestTrades,
      liquidityPools,
      tokenLaunches
    });

    // Update cache
    tokenCache = {
      ...processedData,
      lastUpdated: now
    };

    // Return based on action
    if (action === 'trades') {
      return NextResponse.json({
        success: true,
        data: processedData.latestTrades
      });
    } else if (action === 'pools') {
      return NextResponse.json({
        success: true,
        data: processedData.liquidityPools
      });
    } else if (action === 'launches') {
      return NextResponse.json({
        success: true,
        data: processedData.tokenLaunches
      });
    } else if (action === 'featured') {
      return NextResponse.json({
        success: true,
        data: processedData.featuredTokens
      });
    } else {
      return NextResponse.json({
        success: true,
        data: processedData
      });
    }

  } catch (error) {
    console.error('Error fetching LetsBonk data:', error);
    
    // Return cached data if available
    if (tokenCache.lastUpdated) {
      return NextResponse.json({
        success: true,
        data: tokenCache,
        cached: true,
        error: 'Using cached data due to fetch error'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch LetsBonk data'
    }, { status: 500 });
  }
} 