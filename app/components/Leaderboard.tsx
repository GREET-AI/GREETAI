'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface TopToken {
  id: string;
  name: string;
  symbol: string;
  imageUrl?: string;
  totalGreets: number;
  holders: number;
  marketCap: number;
  launchDate: string;
  contractAddress: string;
  isLaunchingSoon: boolean;
  platform: 'letsbonk' | 'pumpfun';
  mintAddress?: string;
  volume24h?: number;
  price?: number;
  age?: string;
  rank?: number;
}

interface TokenData {
  priceInUSD: number;
  volume24h: number;
  marketCap: number;
  holders: number;
  lastTradeTime: string;
}

const Leaderboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<'tokens' | 'users'>('tokens');
  const [topTokens, setTopTokens] = useState<TopToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<Record<string, TokenData>>({});

  useEffect(() => {
    // Initialize with GREET token as placeholder
    const initialTokens: TopToken[] = [
      {
        id: 'greet',
        name: 'GREET',
        symbol: 'GREET',
        imageUrl: '/GREET.png',
        totalGreets: 0,
        holders: 0,
        marketCap: 0,
        launchDate: '2024-01-15',
        contractAddress: 'To be announced',
        isLaunchingSoon: true,
        platform: 'letsbonk',
        mintAddress: undefined
      }
    ];

    setTopTokens(initialTokens);
    fetchLetsBonkTokens();
    setIsLoading(false);
  }, []);

  // Fetch top 6 tokens from LetsBonk.fun
  const fetchLetsBonkTokens = async () => {
    try {
      const response = await fetch('/api/bitquery/letsbonk-detailed-tokens', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.tokens && data.tokens.length > 0) {
          const letsbonkTokens: TopToken[] = data.tokens.map((token: any) => ({
            id: token.id.toString(),
            name: token.name,
            symbol: token.symbol,
            imageUrl: `/GREET.png`, // Default image for now
            totalGreets: token.volume24h || 0,
            holders: 0, // Would need separate query for holder count
            marketCap: token.marketCap || 0,
            launchDate: 'N/A',
            contractAddress: token.contractAddress || 'N/A',
            isLaunchingSoon: false,
            platform: 'letsbonk' as const,
            mintAddress: token.mintAddress,
            volume24h: token.volume24h,
            price: token.price,
            age: token.age,
            rank: token.rank
          }));

          // Always keep GREET token at the top, then add other tokens
          const greetToken: TopToken = {
            id: 'greet',
            name: 'GREET',
            symbol: 'GREET',
            imageUrl: '/GREET.png',
            totalGreets: 0,
            holders: 0,
            marketCap: 0,
            launchDate: '2024-01-15',
            contractAddress: 'To be announced',
            isLaunchingSoon: true,
            platform: 'letsbonk',
            mintAddress: undefined,
            volume24h: 0,
            price: 0,
            age: 'Coming Soon',
            rank: 1
          };

          setTopTokens([greetToken, ...letsbonkTokens]);
        }
      }
    } catch (error) {
      console.error('Error fetching LetsBonk tokens:', error);
      // Fallback: just show GREET token
      const greetToken: TopToken = {
        id: 'greet',
        name: 'GREET',
        symbol: 'GREET',
        imageUrl: '/GREET.png',
        totalGreets: 0,
        holders: 0,
        marketCap: 0,
        launchDate: '2024-01-15',
        contractAddress: 'To be announced',
        isLaunchingSoon: true,
        platform: 'letsbonk',
        mintAddress: undefined,
        volume24h: 0,
        price: 0,
        age: 'Coming Soon',
        rank: 1
      };
      setTopTokens([greetToken]);
    }
  };

  // Fetch real token data from Bitquery API
  const fetchTokenData = async (mintAddress: string, platform: 'letsbonk' | 'pumpfun') => {
    try {
      const response = await fetch(`/api/bitquery/token-stats?mintAddress=${mintAddress}&platform=${platform}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error fetching token data:', error);
    }
    return null;
  };

  // Update token data when mint address is available
  useEffect(() => {
    const updateTokenData = async () => {
      const updatedTokens = await Promise.all(
        topTokens.map(async (token) => {
          if (token.mintAddress) {
            const data = await fetchTokenData(token.mintAddress, token.platform);
            if (data) {
              // Update token with real data
              return {
                ...token,
                totalGreets: data.volume24h || 0,
                holders: data.holders || 0,
                marketCap: data.marketCap || 0
              };
            }
          }
          return token;
        })
      );
      setTopTokens(updatedTokens);
    };

    updateTokenData();
  }, [topTokens.length]);

  // Function to update token with mint address (called when token is created)
  const updateTokenMintAddress = (tokenId: string, mintAddress: string, platform: 'letsbonk' | 'pumpfun') => {
    setTopTokens(prevTokens => 
      prevTokens.map(token => 
        token.id === tokenId 
          ? { ...token, mintAddress, platform }
          : token
      )
    );
  };

  // Example: Update GREET token when it's created
  // This would be called from the launchpad when token is successfully created
  useEffect(() => {
    // For demo purposes - in real app this would be triggered by token creation
    // updateTokenMintAddress('1', 'GREET_MINT_ADDRESS_HERE', 'letsbonk');
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatMarketCap = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num}`;
  };

  const copyToClipboard = async (text: string, tokenId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(tokenId);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleCALink = (platform: 'letsbonk' | 'pumpfun') => {
    const url = platform === 'letsbonk' ? 'https://letsbonk.fun' : 'https://pump.fun';
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="bg-gradient-to-r from-green-500/20 to-purple-500/20 border border-green-500/30 rounded-xl p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500/20 to-purple-500/20 border border-green-500/30 rounded-xl p-6 text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <Image
              src="/GREET.png"
              alt="GREET"
              width={48}
              height={48}
              className="w-10 h-10"
            />
          </div>
          <h1 className="text-4xl font-bold text-white font-chippunk" style={{ textShadow: '0 2px 8px #00FF41, 0 4px 16px #00FF41' }}>
            GREET Leaderboard
          </h1>
        </div>
        <p className="text-green-400 text-lg mb-6">Top 6 tokens from LetsBonk.fun - Real-time data</p>
        
        {/* Category Selector */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setSelectedCategory('tokens')}
            className={`px-6 py-3 rounded-lg transition-all ${
              selectedCategory === 'tokens'
                ? 'bg-green-500 text-white'
                : 'bg-black/50 text-gray-300 hover:bg-black/70'
            }`}
          >
            🪙 Top Tokens
          </button>
          <button
            onClick={() => setSelectedCategory('users')}
            className={`px-6 py-3 rounded-lg transition-all ${
              selectedCategory === 'users'
                ? 'bg-green-500 text-white'
                : 'bg-black/50 text-gray-300 hover:bg-black/70'
            }`}
          >
            👥 Top Users
          </button>
        </div>
      </div>

      {/* GREET Tokens Leaderboard */}
      {selectedCategory === 'tokens' && (
        <div className="space-y-4">
          {topTokens.map((token, index) => (
            <div 
              key={token.id} 
              className={`border rounded-xl p-6 transition-colors ${
                token.id === 'greet' 
                  ? 'bg-gradient-to-r from-green-500/20 to-purple-500/20 border-green-400/50 shadow-[0_0_20px_rgba(0,255,65,0.3)] hover:shadow-[0_0_30px_rgba(0,255,65,0.5)]' 
                  : 'bg-black/30 border-green-500/30 hover:border-green-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Rank & Token Info */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    token.id === 'greet' ? 'bg-gradient-to-r from-green-400 to-purple-500 shadow-[0_0_10px_rgba(0,255,65,0.5)]' :
                    index === 1 ? 'bg-yellow-500' :
                    index === 2 ? 'bg-gray-400' :
                    index === 3 ? 'bg-orange-600' : 'bg-green-500'
                  }`}>
                    #{token.rank || index + 1}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {token.imageUrl ? (
                      <Image
                        src={token.imageUrl}
                        alt={token.name}
                        width={48}
                        height={48}
                        className={`w-12 h-12 rounded-full ${
                          token.id === 'greet' ? 'animate-pulse' : ''
                        }`}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-xl">🪙</span>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold text-lg ${
                          token.id === 'greet' 
                            ? 'text-green-400 font-chippunk' 
                            : 'text-white'
                        }`}>
                          {token.name}
                        </h3>
                        {token.isLaunchingSoon && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                            <span className="text-green-400 text-xs font-bold animate-pulse">🚀</span>
                            <span className="text-green-400 text-xs font-bold">LAUNCHING SOON</span>
                          </div>
                        )}
                        <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                          {token.platform === 'letsbonk' ? 'LetsBonk.fun' : 'Pump.fun'}
                        </span>
                      </div>
                      <p className="text-gray-400">${token.symbol}</p>
                      {token.age && token.age !== 'N/A' && (
                        <p className="text-xs text-gray-500">{token.age}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className={`font-bold text-lg ${
                      token.id === 'greet' ? 'text-green-400' : 'text-green-400'
                    }`}>
                      {formatNumber(token.volume24h || token.totalGreets)}
                    </div>
                    <div className="text-gray-400 text-sm">24H VOLUME</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-bold text-lg ${
                      token.id === 'greet' ? 'text-blue-400' : 'text-blue-400'
                    }`}>
                      {formatNumber(token.holders)}
                    </div>
                    <div className="text-gray-400 text-sm">HOLDERS</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-bold text-lg ${
                      token.id === 'greet' ? 'text-purple-400' : 'text-purple-400'
                    }`}>
                      {formatMarketCap(token.marketCap)}
                    </div>
                    <div className="text-gray-400 text-sm">MARKET CAP</div>
                  </div>
                  {token.price && token.price > 0 && (
                    <div className="text-center">
                      <div className="text-yellow-400 font-bold text-lg">${token.price.toFixed(6)}</div>
                      <div className="text-gray-400 text-sm">PRICE</div>
                    </div>
                  )}
                  
                  {/* Contract Address */}
                  <div className="text-center">
                    <div className={`font-mono text-sm rounded px-3 py-2 border cursor-pointer transition-colors ${
                      token.id === 'greet' 
                        ? 'text-gray-300 bg-black/50 border-gray-600 hover:border-green-500/50' 
                        : 'text-gray-300 bg-black/50 border-gray-600 hover:border-green-500/50'
                    }`}
                         onClick={() => copyToClipboard(token.contractAddress, token.id)}>
                      {copiedAddress === token.id ? (
                        <span className="text-green-400">✓ Copied!</span>
                      ) : (
                        <span className="text-gray-300">{token.contractAddress}</span>
                      )}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">CONTRACT ADDRESS</div>
                    <button 
                      onClick={() => handleCALink(token.platform)}
                      className="text-green-400 text-xs hover:text-green-300 transition-colors mt-1 underline"
                    >
                      View on {token.platform === 'letsbonk' ? 'LetsBonk.fun' : 'Pump.fun'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top Users Leaderboard - Placeholder */}
      {selectedCategory === 'users' && (
        <div className="bg-black/30 border border-green-500/30 rounded-xl p-6 text-center">
          <div className="text-green-400 text-lg mb-4">👥 Top Users</div>
          <p className="text-gray-400">User rankings will be available when GREET token is live</p>
          <p className="text-gray-500 text-sm mt-2">Track your progress and compete with other GREET users</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard; 