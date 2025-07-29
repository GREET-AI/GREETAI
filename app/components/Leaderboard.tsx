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
}

interface TopUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  totalGreetsEarned: number;
  totalGreetsSent: number;
  rank: number;
  streak: number;
}

const Leaderboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<'tokens' | 'users'>('tokens');
  const [topTokens, setTopTokens] = useState<TopToken[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const mockTokens: TopToken[] = [
      {
        id: '1',
        name: 'GREET',
        symbol: 'GREET',
        imageUrl: '/GREET.png',
        totalGreets: 1250000,
        holders: 15420,
        marketCap: 2500000,
        launchDate: '2024-01-15'
      },
      {
        id: '2',
        name: 'DegenCoin',
        symbol: 'DEGEN',
        imageUrl: '/letsbonk.png',
        totalGreets: 890000,
        holders: 8920,
        marketCap: 1800000,
        launchDate: '2024-01-20'
      },
      {
        id: '3',
        name: 'MoonToken',
        symbol: 'MOON',
        imageUrl: '/pumplogo.png',
        totalGreets: 567000,
        holders: 6540,
        marketCap: 1200000,
        launchDate: '2024-01-25'
      },
      {
        id: '4',
        name: 'ApeCoin',
        symbol: 'APE',
        totalGreets: 345000,
        holders: 4320,
        marketCap: 890000,
        launchDate: '2024-01-30'
      },
      {
        id: '5',
        name: 'WhaleToken',
        symbol: 'WHALE',
        totalGreets: 234000,
        holders: 3210,
        marketCap: 567000,
        launchDate: '2024-02-01'
      }
    ];

    const mockUsers: TopUser[] = [
      {
        id: '1',
        name: 'CryptoWhale',
        username: '@cryptowhale',
        avatar: '/boy.png',
        totalGreetsEarned: 125000,
        totalGreetsSent: 89000,
        rank: 1,
        streak: 15
      },
      {
        id: '2',
        name: 'DegenMaster',
        username: '@degenmaster',
        avatar: '/boy.png',
        totalGreetsEarned: 98000,
        totalGreetsSent: 67000,
        rank: 2,
        streak: 12
      },
      {
        id: '3',
        name: 'ApeTrader',
        username: '@apetrader',
        avatar: '/boy.png',
        totalGreetsEarned: 76000,
        totalGreetsSent: 54000,
        rank: 3,
        streak: 8
      },
      {
        id: '4',
        name: 'SolanaInfluencer',
        username: '@solana_influencer',
        avatar: '/boy.png',
        totalGreetsEarned: 65000,
        totalGreetsSent: 43000,
        rank: 4,
        streak: 10
      },
      {
        id: '5',
        name: 'MoonShooter',
        username: '@moonshooter',
        avatar: '/boy.png',
        totalGreetsEarned: 54000,
        totalGreetsSent: 32000,
        rank: 5,
        streak: 6
      }
    ];

    setTopTokens(mockTokens);
    setTopUsers(mockUsers);
    setIsLoading(false);
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
        <p className="text-green-400 text-lg mb-6">Top tokens and users by GREET activity</p>
        
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

      {/* Top Tokens Leaderboard */}
      {selectedCategory === 'tokens' && (
        <div className="space-y-4">
          {topTokens.map((token, index) => (
            <div key={token.id} className="bg-black/30 border border-green-500/30 rounded-xl p-6 hover:border-green-500/50 transition-colors">
              <div className="flex items-center justify-between">
                {/* Rank & Token Info */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-600' : 'bg-green-500'
                  }`}>
                    #{index + 1}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {token.imageUrl ? (
                      <Image
                        src={token.imageUrl}
                        alt={token.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-xl">🪙</span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-white font-bold text-lg">{token.name}</h3>
                      <p className="text-gray-400">${token.symbol}</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-green-400 font-bold text-lg">{formatNumber(token.totalGreets)}</div>
                    <div className="text-gray-400 text-sm">GREETS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-400 font-bold text-lg">{formatNumber(token.holders)}</div>
                    <div className="text-gray-400 text-sm">HOLDERS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 font-bold text-lg">{formatMarketCap(token.marketCap)}</div>
                    <div className="text-gray-400 text-sm">MARKET CAP</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top Users Leaderboard */}
      {selectedCategory === 'users' && (
        <div className="space-y-4">
          {topUsers.map((user, index) => (
            <div key={user.id} className="bg-black/30 border border-green-500/30 rounded-xl p-6 hover:border-green-500/50 transition-colors">
              <div className="flex items-center justify-between">
                {/* Rank & User Info */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-600' : 'bg-green-500'
                  }`}>
                    #{index + 1}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-sm">👤</span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-white font-bold text-lg">{user.name}</h3>
                      <p className="text-gray-400">{user.username}</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-green-400 font-bold text-lg">{formatNumber(user.totalGreetsEarned)}</div>
                    <div className="text-gray-400 text-sm">EARNED</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-400 font-bold text-lg">{formatNumber(user.totalGreetsSent)}</div>
                    <div className="text-gray-400 text-sm">SENT</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 font-bold text-lg">{user.streak} days 🔥</div>
                    <div className="text-gray-400 text-sm">STREAK</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard; 