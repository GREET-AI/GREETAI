'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface GreetActivity {
  id: string;
  type: 'greet' | 'x-post' | 'influencer';
  user: {
    name: string;
    username: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  token?: string;
  amount?: number;
}

const LiveGreetHistory = () => {
  const [activities, setActivities] = useState<GreetActivity[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'greets' | 'x-posts' | 'influencers'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate live data
    const mockActivities: GreetActivity[] = [
      {
        id: '1',
        type: 'greet',
        user: { name: 'CryptoWhale', username: '@cryptowhale', avatar: '/boy.png' },
        content: 'Just sent 1000 GREET to @degenmaster! LFG! 🚀',
        timestamp: '2 minutes ago',
        engagement: { likes: 45, shares: 12, comments: 8 },
        token: 'GREET',
        amount: 1000
      },
      {
        id: '2',
        type: 'x-post',
        user: { name: 'DegenMaster', username: '@degenmaster', avatar: '/boy.png' },
        content: 'GREET is the future of social interaction! Just received 1000 GREET from @cryptowhale! This is how we build the community! 💚',
        timestamp: '5 minutes ago',
        engagement: { likes: 128, shares: 34, comments: 23 }
      },
      {
        id: '3',
        type: 'influencer',
        user: { name: 'SolanaInfluencer', username: '@solana_influencer', avatar: '/boy.png' },
        content: 'BREAKING: GREET platform is revolutionizing social interaction! The viral mechanics are insane! 🚀',
        timestamp: '8 minutes ago',
        engagement: { likes: 567, shares: 89, comments: 45 }
      },
      {
        id: '4',
        type: 'greet',
        user: { name: 'ApeTrader', username: '@apetrader', avatar: '/boy.png' },
        content: 'Sent 500 GREET to @newuser! Welcome to the family! 💪',
        timestamp: '12 minutes ago',
        engagement: { likes: 23, shares: 5, comments: 3 },
        token: 'GREET',
        amount: 500
      },
      {
        id: '5',
        type: 'x-post',
        user: { name: 'NewUser', username: '@newuser', avatar: '/boy.png' },
        content: 'Just joined GREET and received my first 500 GREET from @apetrader! This community is amazing! 🔥',
        timestamp: '15 minutes ago',
        engagement: { likes: 67, shares: 12, comments: 9 }
      }
    ];

    setActivities(mockActivities);
    setIsLoading(false);
  }, []);

  const filteredActivities = activities.filter(activity => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'greets') return activity.type === 'greet';
    if (selectedFilter === 'x-posts') return activity.type === 'x-post';
    if (selectedFilter === 'influencers') return activity.type === 'influencer';
    return true;
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'greet': return '💸';
      case 'x-post': return '📱';
      case 'influencer': return '🌟';
      default: return '📝';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'greet': return 'text-green-400';
      case 'x-post': return 'text-blue-400';
      case 'influencer': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="bg-gradient-to-r from-green-500/20 to-purple-500/20 border border-green-500/30 rounded-xl p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-400">Loading live GREET activity...</p>
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
            Live GREET History
          </h1>
        </div>
        <p className="text-green-400 text-lg mb-6">Track all GREET activity, X posts, and influencer movements in real-time</p>
        
        {/* Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-black/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{activities.length}</div>
            <div className="text-sm text-gray-400">Total Activities</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {activities.filter(a => a.type === 'greet').length}
            </div>
            <div className="text-sm text-gray-400">GREET Transactions</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {activities.filter(a => a.type === 'x-post').length}
            </div>
            <div className="text-sm text-gray-400">X Posts</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {activities.filter(a => a.type === 'influencer').length}
            </div>
            <div className="text-sm text-gray-400">Influencer Posts</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedFilter === 'all'
                ? 'bg-green-500 text-white'
                : 'bg-black/50 text-gray-300 hover:bg-black/70'
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setSelectedFilter('greets')}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedFilter === 'greets'
                ? 'bg-green-500 text-white'
                : 'bg-black/50 text-gray-300 hover:bg-black/70'
            }`}
          >
            💸 GREET Transactions
          </button>
          <button
            onClick={() => setSelectedFilter('x-posts')}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedFilter === 'x-posts'
                ? 'bg-green-500 text-white'
                : 'bg-black/50 text-gray-300 hover:bg-black/70'
            }`}
          >
            📱 X Posts
          </button>
          <button
            onClick={() => setSelectedFilter('influencers')}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedFilter === 'influencers'
                ? 'bg-green-500 text-white'
                : 'bg-black/50 text-gray-300 hover:bg-black/70'
            }`}
          >
            🌟 Influencers
          </button>
        </div>
      </div>

      {/* X-Style Posts Feed */}
      <div className="max-w-2xl mx-auto space-y-0">
        {filteredActivities.map((activity) => (
          <div key={activity.id} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors cursor-pointer">
            <div className="p-4">
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {activity.user.avatar ? (
                    <Image
                      src={activity.user.avatar}
                      alt={activity.user.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white hover:underline">{activity.user.name}</span>
                    <span className="text-gray-500">{activity.user.username}</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500 text-sm">{activity.timestamp}</span>
                    {activity.type === 'greet' && (
                      <>
                        <span className="text-gray-500">·</span>
                        <span className="text-green-400 text-sm font-medium">💸 GREET Transaction</span>
                      </>
                    )}
                  </div>
                  
                  {/* Post Content */}
                  <div className="text-white text-base leading-6 mb-3">
                    {activity.content}
                  </div>
                  
                  {/* GREET Amount (if applicable) */}
                  {activity.token && activity.amount && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-green-400 font-medium">Amount Sent:</span>
                        <span className="text-green-400 font-bold text-lg">{activity.amount} {activity.token}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Engagement Actions */}
                  <div className="flex items-center justify-between max-w-md">
                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors group">
                      <div className="w-5 h-5 flex items-center justify-center group-hover:bg-blue-400/20 rounded-full transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.12 14.7A1 1 0 0 0 8 15v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-.12-.5L13 12.5V9a1 1 0 0 0-2 0v3.5l-2.88 2.2z"/>
                        </svg>
                      </div>
                      <span className="text-sm">{formatNumber(activity.engagement.comments)}</span>
                    </button>
                    
                    <button className="flex items-center gap-2 text-gray-500 hover:text-green-400 transition-colors group">
                      <div className="w-5 h-5 flex items-center justify-center group-hover:bg-green-400/20 rounded-full transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </div>
                      <span className="text-sm">{formatNumber(activity.engagement.likes)}</span>
                    </button>
                    
                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors group">
                      <div className="w-5 h-5 flex items-center justify-center group-hover:bg-blue-400/20 rounded-full transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                        </svg>
                      </div>
                      <span className="text-sm">{formatNumber(activity.engagement.shares)}</span>
                    </button>
                    
                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors group">
                      <div className="w-5 h-5 flex items-center justify-center group-hover:bg-blue-400/20 rounded-full transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-6 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0-2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveGreetHistory; 