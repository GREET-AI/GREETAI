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
    verified?: boolean;
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
  const [error, setError] = useState<string | null>(null);
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);

  useEffect(() => {
    const fetchTwitterPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/twitter/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch Twitter posts');
        }
        
        const data = await response.json();
        
        if (data.posts && data.posts.length > 0) {
          // Add verification status to posts
          const postsWithVerification = data.posts.map((post: any) => ({
            ...post,
            user: {
              ...post.user,
              verified: post.user.username.toLowerCase().includes('greet') || post.user.username.toLowerCase().includes('ai')
            }
          }));
          setActivities(postsWithVerification);
        } else {
          // Fallback to some sample posts if no Twitter posts are available
          setActivities([
            {
              id: '1',
              type: 'x-post',
              user: { 
                name: 'GREET', 
                username: '@GREET', 
                avatar: '/GREET.png',
                verified: true
              },
              content: 'Welcome to GREET! The future of social interaction is here! 🚀💚',
              timestamp: 'Just now',
              engagement: { likes: 0, shares: 0, comments: 0 }
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching Twitter posts:', err);
        setError('Failed to load Twitter posts');
        // Fallback to sample data
        setActivities([
          {
            id: '1',
            type: 'x-post',
            user: { 
              name: 'GREET', 
              username: '@GREET', 
              avatar: '/GREET.png',
              verified: true
            },
            content: 'Welcome to GREET! The future of social interaction is here! 🚀💚',
            timestamp: 'Just now',
            engagement: { likes: 0, shares: 0, comments: 0 }
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTwitterPosts();
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

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <p className="text-gray-400 text-sm">Showing sample data</p>
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
          <div 
            key={activity.id} 
            className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors cursor-pointer relative"
            onMouseEnter={() => setHoveredPost(activity.id)}
            onMouseLeave={() => setHoveredPost(null)}
          >
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
                    {activity.user.verified && (
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/>
                      </svg>
                    )}
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
                    <button 
                      className="flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors group"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Link to Twitter post
                        if (activity.type === 'x-post') {
                          window.open(`https://twitter.com/${activity.user.username.replace('@', '')}/status/${activity.id}`, '_blank');
                        }
                      }}
                    >
                      <div className="w-5 h-5 flex items-center justify-center group-hover:bg-blue-400/20 rounded-full transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.12 14.7A1 1 0 0 0 8 15v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-.12-.5L13 12.5V9a1 1 0 0 0-2 0v3.5l-2.88 2.2z"/>
                        </svg>
                      </div>
                      <span className="text-sm">{formatNumber(activity.engagement.comments)}</span>
                    </button>
                    
                    <button 
                      className="flex items-center gap-2 text-gray-500 hover:text-green-400 transition-colors group"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Link to Twitter post
                        if (activity.type === 'x-post') {
                          window.open(`https://twitter.com/${activity.user.username.replace('@', '')}/status/${activity.id}`, '_blank');
                        }
                      }}
                    >
                      <div className="w-5 h-5 flex items-center justify-center group-hover:bg-green-400/20 rounded-full transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </div>
                      <span className="text-sm">{formatNumber(activity.engagement.likes)}</span>
                    </button>
                    
                    <button 
                      className="flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors group"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Link to Twitter post
                        if (activity.type === 'x-post') {
                          window.open(`https://twitter.com/${activity.user.username.replace('@', '')}/status/${activity.id}`, '_blank');
                        }
                      }}
                    >
                      <div className="w-5 h-5 flex items-center justify-center group-hover:bg-blue-400/20 rounded-full transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                        </svg>
                      </div>
                      <span className="text-sm">{formatNumber(activity.engagement.shares)}</span>
                    </button>
                    
                    <button 
                      className="flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors group"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Link to Twitter post
                        if (activity.type === 'x-post') {
                          window.open(`https://twitter.com/${activity.user.username.replace('@', '')}/status/${activity.id}`, '_blank');
                        }
                      }}
                    >
                      <div className="w-5 h-5 flex items-center justify-center group-hover:bg-blue-400/20 rounded-full transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-6 8c1.66 0 3-1.34 3-3s1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0-2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hover Preview for X Posts */}
            {hoveredPost === activity.id && activity.type === 'x-post' && (
              <div className="absolute top-full left-0 right-0 z-50 bg-black/95 border border-gray-700 rounded-lg p-4 shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src={activity.user.avatar || '/GREET.png'}
                    alt={activity.user.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-white text-sm">{activity.user.name}</span>
                      {activity.user.verified && (
                        <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/>
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-400 text-xs">{activity.user.username}</span>
                  </div>
                </div>
                <div className="text-white text-sm mb-3">{activity.content}</div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Posted {activity.timestamp}</span>
                  <div className="flex items-center gap-4">
                    <span>❤️ {formatNumber(activity.engagement.likes)}</span>
                    <span>🔄 {formatNumber(activity.engagement.shares)}</span>
                    <span>💬 {formatNumber(activity.engagement.comments)}</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-blue-400">
                  Click to view on X
                </div>
              </div>
            )}
            
            {/* Clickable overlay for the entire post */}
            <div 
              className="absolute inset-0 cursor-pointer"
              onClick={() => {
                if (activity.type === 'x-post') {
                  window.open(`https://twitter.com/${activity.user.username.replace('@', '')}/status/${activity.id}`, '_blank');
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveGreetHistory; 