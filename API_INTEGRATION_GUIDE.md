# GREET Launchpad API Integration Guide

## 🎯 Overview

This guide explains how to integrate GREET with real launchpad APIs (Pump.fun, LetsBonk.fun) when API keys become available.

## 📊 Current System Architecture

### Database Schema
- **LaunchedToken Model**: Stores all token data and launch status
- **Status Tracking**: PENDING → LAUNCHING → LIVE/FAILED
- **Market Data**: Price, volume, holders, market cap
- **API Integration**: Raw API responses and last check timestamps

### API Endpoints
- `POST /api/tokens/launch` - Launch new token
- `GET /api/tokens` - Fetch all launched tokens
- `POST /api/tokens/update` - Update single token
- `PUT /api/tokens/update` - Batch update tokens

## 🚀 Integration Strategy

### Phase 1: Token Launch Integration

#### Pump.fun Integration
```typescript
// Example integration (when API is available)
async function launchOnPumpFun(tokenData: TokenData) {
  const response = await fetch('https://api.pump.fun/tokens/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PUMP_FUN_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: tokenData.name,
      symbol: tokenData.symbol,
      description: tokenData.description,
      image: tokenData.imageUrl,
      banner: tokenData.bannerUrl,
      website: tokenData.website,
      telegram: tokenData.telegramUrl
    })
  });

  const result = await response.json();
  
  // Update our database with launchpad data
  await updateToken(tokenData.id, {
    status: 'LAUNCHING',
    launchpadId: result.tokenId,
    launchpadUrl: result.tokenUrl,
    apiData: result
  });

  return result;
}
```

#### LetsBonk.fun Integration
```typescript
// Example integration (when API is available)
async function launchOnLetsBonk(tokenData: TokenData) {
  const response = await fetch('https://api.letsbonk.fun/tokens/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LETSBONK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: tokenData.name,
      symbol: tokenData.symbol,
      description: tokenData.description,
      image: tokenData.imageUrl,
      website: tokenData.website,
      twitter: tokenData.twitterUrl,
      telegram: tokenData.telegramUrl,
      totalSupply: tokenData.totalSupply,
      decimals: tokenData.decimals
    })
  });

  const result = await response.json();
  
  await updateToken(tokenData.id, {
    status: 'LAUNCHING',
    launchpadId: result.tokenId,
    launchpadUrl: result.tokenUrl,
    apiData: result
  });

  return result;
}
```

### Phase 2: Market Data Updates

#### Scheduled Updates
```typescript
// Cron job or scheduled function
async function updateTokenMarketData() {
  const pendingTokens = await getTokensByStatus(['LAUNCHING', 'LIVE']);
  
  for (const token of pendingTokens) {
    try {
      let marketData;
      
      if (token.platform === 'PUMP_FUN') {
        marketData = await fetchPumpFunMarketData(token.launchpadId);
      } else if (token.platform === 'LETSBONK') {
        marketData = await fetchLetsBonkMarketData(token.launchpadId);
      }
      
      if (marketData) {
        await updateToken(token.id, {
          marketCap: marketData.marketCap,
          price: marketData.price,
          volume24h: marketData.volume24h,
          holders: marketData.holders,
          status: marketData.isLive ? 'LIVE' : 'LAUNCHING'
        });
      }
    } catch (error) {
      console.error(`Failed to update token ${token.id}:`, error);
    }
  }
}
```

#### Real-time Updates
```typescript
// WebSocket or polling for real-time updates
async function setupRealTimeUpdates() {
  // WebSocket connection to launchpad APIs
  const pumpFunSocket = new WebSocket('wss://api.pump.fun/ws');
  const letsBonkSocket = new WebSocket('wss://api.letsbonk.fun/ws');
  
  pumpFunSocket.onmessage = async (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'TOKEN_UPDATE') {
      await updateTokenFromWebSocket(data);
    }
  };
}
```

## 🔧 Implementation Steps

### 1. Environment Variables
```env
# Add to .env.local
PUMP_FUN_API_KEY=your_pump_fun_api_key
LETSBONK_API_KEY=your_letsbonk_api_key
PUMP_FUN_WEBHOOK_SECRET=your_webhook_secret
LETSBONK_WEBHOOK_SECRET=your_webhook_secret
```

### 2. Update Launch Function
```typescript
// In /api/tokens/launch/route.ts
export async function POST(request: NextRequest) {
  // ... existing validation ...
  
  // Create token in database first
  const launchedToken = await prisma.launchedToken.create({...});
  
  // Launch on actual platform
  try {
    if (platform === 'PUMP_FUN') {
      const result = await launchOnPumpFun(launchedToken);
      await updateToken(launchedToken.id, {
        status: 'LAUNCHING',
        launchpadId: result.tokenId,
        launchpadUrl: result.tokenUrl
      });
    } else if (platform === 'LETSBONK') {
      const result = await launchOnLetsBonk(launchedToken);
      await updateToken(launchedToken.id, {
        status: 'LAUNCHING',
        launchpadId: result.tokenId,
        launchpadUrl: result.tokenUrl
      });
    }
  } catch (error) {
    await updateToken(launchedToken.id, { status: 'FAILED' });
    throw error;
  }
}
```

### 3. Webhook Endpoints
```typescript
// /api/webhooks/pump-fun/route.ts
export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-pump-fun-signature');
  const body = await request.text();
  
  // Verify webhook signature
  if (!verifySignature(body, signature, PUMP_FUN_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  const data = JSON.parse(body);
  
  // Update token based on webhook data
  await updateToken(data.tokenId, {
    status: data.status,
    marketCap: data.marketCap,
    price: data.price,
    volume24h: data.volume24h,
    holders: data.holders
  });
  
  return NextResponse.json({ success: true });
}
```

### 4. Scheduled Tasks
```typescript
// /api/cron/update-tokens/route.ts
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  await updateTokenMarketData();
  return NextResponse.json({ success: true });
}
```

## 📈 Monitoring & Analytics

### Token Performance Tracking
```typescript
interface TokenAnalytics {
  tokenId: string;
  launchTime: Date;
  timeToLive: number; // minutes
  initialPrice: number;
  peakPrice: number;
  currentPrice: number;
  totalVolume: number;
  holderGrowth: number;
  socialEngagement: number;
}
```

### User Analytics
```typescript
interface UserAnalytics {
  userId: string;
  totalTokensLaunched: number;
  successfulLaunches: number;
  averageTokenPerformance: number;
  totalVolumeGenerated: number;
  rank: string;
  achievements: string[];
}
```

## 🔒 Security Considerations

1. **API Key Management**: Store keys securely in environment variables
2. **Webhook Verification**: Always verify webhook signatures
3. **Rate Limiting**: Implement rate limiting for API calls
4. **Error Handling**: Graceful handling of API failures
5. **Data Validation**: Validate all incoming data from external APIs

## 🚀 Deployment Checklist

- [ ] Set up environment variables
- [ ] Implement API integration functions
- [ ] Add webhook endpoints
- [ ] Set up scheduled tasks
- [ ] Add monitoring and logging
- [ ] Test with sandbox APIs
- [ ] Deploy to production
- [ ] Monitor performance and errors

## 📞 Support

When you get API access:
1. Review the official API documentation
2. Test in sandbox environment first
3. Implement webhook handling
4. Set up monitoring and alerts
5. Gradually roll out to production

The current system is designed to be easily extended with real API integration when the keys become available! 