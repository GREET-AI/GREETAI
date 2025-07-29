# 🚀 GREET + LetsBonk.fun Integration

## Overview
GREET now integrates with LetsBonk.fun to enable real token launches on Solana with automatic Raydium listing, plus live token data from the LetsBonk ecosystem.

## Features
- ✅ **Real Token Creation** on Solana blockchain
- ✅ **Automatic Raydium Listing** for liquidity
- ✅ **IPFS Metadata Upload** for token images
- ✅ **Solana Wallet Integration** for transactions
- ✅ **LetsBonk API Integration** for seamless launches
- ✅ **Live Token Data** from GraphQL queries
- ✅ **Token Discovery** with search and filters
- ✅ **Real-time Updates** every 30 seconds

## Setup Instructions

### 1. Environment Variables
Add these to your `.env.local`:

```bash
# LetsBonk API Configuration
LETSBONK_API_KEY=your_letsbonk_api_key_here
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# GraphQL Data (BitQuery)
BITQUERY_API_KEY=your_bitquery_api_key_here

# Twitter API (for social features)
TWITTER_CLIENT_ID=your_twitter_client_id_here
TWITTER_CLIENT_SECRET=your_twitter_client_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Get API Keys

#### LetsBonk API Key
1. Visit [LetsBonk.fun](https://letsbonk.fun)
2. Create an account
3. Go to API settings
4. Generate API key
5. Add to environment variables

#### BitQuery API Key (for live data)
1. Visit [BitQuery](https://bitquery.io)
2. Create an account
3. Go to API settings
4. Generate API key
5. Add to environment variables

### 3. Solana Configuration
- **Network**: Mainnet Beta (production)
- **RPC URL**: `https://api.mainnet-beta.solana.com`
- **Wallet**: Any Solana wallet (Phantom, Solflare, etc.)

## API Endpoints

### `/api/letsbonk/launch`
Creates a new token on LetsBonk.fun

**Request:**
```json
{
  "tokenName": "My Awesome Token",
  "tokenSymbol": "MAT",
  "description": "A revolutionary token",
  "website": "https://example.com",
  "telegram": "https://t.me/group",
  "imageUrl": "https://ipfs.io/ipfs/Qm...",
  "walletAddress": "CtFt3q..."
}
```

**Response:**
```json
{
  "success": true,
  "tokenAddress": "CtFt3q...",
  "message": "Token launched successfully on LetsBonk.fun!",
  "details": {
    "name": "My Awesome Token",
    "symbol": "MAT",
    "platform": "LetsBonk.fun",
    "status": "launched",
    "tokenAddress": "CtFt3q...",
    "raydiumPool": "pool_address",
    "liquidityPool": "liquidity_address"
  }
}
```

### `/api/letsbonk/tokens`
Fetches live token data from LetsBonk ecosystem

**Query Parameters:**
- `action`: `featured` | `trades` | `pools` | `launches` | `all`
- `limit`: Number of tokens to fetch (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "signature",
      "tokenName": "Token Name",
      "tokenSymbol": "SYMBOL",
      "tokenAddress": "mint_address",
      "priceUSD": 0.001234,
      "amountUSD": 50000,
      "timestamp": "2024-01-01T00:00:00Z",
      "type": "trading|liquidity|launch",
      "lastActivity": "2024-01-01T00:00:00Z"
    }
  ],
  "cached": false
}
```

### `/api/ipfs`
Uploads token images to IPFS

**Request:** FormData with image file

**Response:**
```json
{
  "success": true,
  "url": "https://ipfs.io/ipfs/Qm...",
  "hash": "Qm...",
  "message": "File uploaded to IPFS successfully"
}
```

## GraphQL Queries

The integration uses these GraphQL queries to fetch live data:

### Latest Trades
```graphql
query GetLatestTrades($limit: Int = 10) {
  Solana {
    DEXTradeByTokens(
      orderBy: {descending: Block_Time}
      limit: {count: $limit}
      where: {Trade: {Dex: {ProtocolName: {is: "raydium_launchpad"}}}}
    ) {
      Block { Time }
      Transaction { Signature }
      Trade {
        AmountInUSD
        PriceInUSD
        Currency { Name, Symbol, MintAddress }
        Side { Type }
      }
    }
  }
}
```

### Liquidity Pools
```graphql
query GetLiquidityPools {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Base: {PostAmount: {gt: "206900000", lt: "246555000"}},
          Dex: {ProgramAddress: {is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"}}
        }
      }
    ) {
      Pool {
        Market {
          BaseCurrency { MintAddress, Name, Symbol }
        }
        Base { PostAmount }
        Quote { PostAmount, PriceInUSD, PostAmountInUSD }
      }
    }
  }
}
```

### Token Launches
```graphql
query GetTokenLaunches($limit: Int = 20) {
  Solana {
    Instructions(
      where: {
        Instruction: {
          Program: {Address: {is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"}},
          Method: {in: ["migrate_to_amm","migrate_to_cpswap"]}
        }
      }
      limit: {count: $limit}
      orderBy: {descending: Block_Time}
    ) {
      Block { Time }
      Transaction { Signature, Signer }
      Instruction {
        Program { Method }
        Accounts { Token { Mint } }
      }
    }
  }
}
```

## User Flow

### Token Launch
1. **User connects Solana wallet**
2. **Fills token details** (name, symbol, description, etc.)
3. **Uploads token image** (automatically uploaded to IPFS)
4. **Clicks "Create Token"**
5. **Token is created** on Solana blockchain
6. **Automatic Raydium listing** for liquidity
7. **Success notification** with links to view token

### Token Discovery
1. **User visits "LetsBonk Tokens" section**
2. **Views live token data** (auto-refresh every 30s)
3. **Filters by type** (Featured, Trades, Pools, Launches)
4. **Searches tokens** by name or symbol
5. **Clicks on token** for detailed view

## Technical Details

### Dependencies
```bash
npm install @solana/web3.js @solana/spl-token
```

### Key Files
- `app/api/letsbonk/launch/route.ts` - Main launch API
- `app/api/letsbonk/tokens/route.ts` - Live token data API
- `app/api/ipfs/route.ts` - IPFS upload handler
- `app/components/LaunchToken.tsx` - Token creation UI
- `app/components/LetsBonkTokens.tsx` - Token discovery UI

### Data Processing
- **Caching**: 5-minute cache for API responses
- **Real-time**: Auto-refresh every 30 seconds
- **Filtering**: Search and category filters
- **Formatting**: Price, amount, and time formatting

### Error Handling
- **API Key Missing**: Graceful fallback with mock response
- **Network Errors**: User-friendly error messages
- **Validation**: File size, type, and required field checks
- **Rate Limiting**: Built-in request throttling

## Production Considerations

### IPFS Service
For production, replace mock IPFS with:
- **Pinata**: `https://api.pinata.cloud`
- **Infura**: `https://ipfs.infura.io`
- **Web3.Storage**: `https://api.web3.storage`

### Rate Limiting
- Implement rate limiting for API calls
- Add user quotas for token launches
- Monitor API usage

### Security
- Validate all user inputs
- Sanitize file uploads
- Implement proper authentication
- Add transaction signing verification

## Support

For issues with:
- **LetsBonk API**: Contact LetsBonk.fun support
- **BitQuery API**: Contact BitQuery support
- **Solana Integration**: Check Solana documentation
- **GREET Integration**: Check this documentation

## Future Enhancements

- [ ] **Batch Token Launches** - Launch multiple tokens
- [ ] **Token Management** - Edit/update launched tokens
- [ ] **Analytics Dashboard** - Track token performance
- [ ] **Community Features** - Token discovery and voting
- [ ] **Advanced Metadata** - Rich token descriptions and links
- [ ] **Price Alerts** - Notifications for price changes
- [ ] **Portfolio Tracking** - Track user's token holdings
- [ ] **Social Features** - Share and discuss tokens 