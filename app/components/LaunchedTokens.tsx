'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Token {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  imageUrl?: string;
  bannerUrl?: string;
  platform: string;
  status: string;
  launchDate: string;
  liveDate?: string;
  marketCap?: number;
  price?: number;
  volume24h?: number;
  holders?: number;
  website?: string;
  twitterUrl?: string;
  telegramUrl?: string;
  user: {
    id: string;
    twitterUsername: string;
    displayName?: string;
    profileImageUrl?: string;
  };
}

const LaunchedTokens = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    fetchTokens();
  }, [selectedPlatform, selectedStatus]);

  const fetchTokens = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (selectedPlatform !== 'all') params.append('platform', selectedPlatform);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      
      const response = await fetch(`/api/tokens?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setTokens(data.data);
      } else {
        setError('Failed to fetch tokens');
      }
    } catch (err) {
      setError('Failed to fetch tokens');
      console.error('Error fetching tokens:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE': return 'text-green-400';
      case 'LAUNCHING': return 'text-yellow-400';
      case 'PENDING': return 'text-gray-400';
      case 'FAILED': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'PUMP_FUN':
        return <Image src="/pumplogo.png" alt="Pump.fun" width={24} height={24} className="w-6 h-6 rounded-full" />;
      case 'LETSBONK':
        return <Image src="/letsbonk.png" alt="LetsBonk" width={24} height={24} className="w-6 h-6 rounded-full" />;
      default:
        return <span className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-xs">?</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNumber = (num?: number) => {
    if (!num) return 'N/A';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="bg-gradient-to-r from-green-500/20 to-purple-500/20 border border-green-500/30 rounded-xl p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-400">Loading launched tokens...</p>
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
            Launched Tokens
          </h1>
        </div>
        <p className="text-green-400 text-lg mb-6">All tokens launched through GREET launchpad</p>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-black/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{tokens.length}</div>
            <div className="text-sm text-gray-400">Total Tokens</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {tokens.filter(t => t.status === 'LIVE').length}
            </div>
            <div className="text-sm text-gray-400">Live Tokens</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {tokens.filter(t => t.platform === 'PUMP_FUN').length}
            </div>
            <div className="text-sm text-gray-400">Pump.fun</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {tokens.filter(t => t.platform === 'LETSBONK').length}
            </div>
            <div className="text-sm text-gray-400">LetsBonk</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 justify-center">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-white"
          >
            <option value="all">All Platforms</option>
            <option value="PUMP_FUN">Pump.fun</option>
            <option value="LETSBONK">LetsBonk</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-white"
          >
            <option value="all">All Status</option>
            <option value="LIVE">Live</option>
            <option value="LAUNCHING">Launching</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center mb-8">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Tokens Grid */}
      {tokens.length === 0 ? (
        <div className="bg-black/30 border border-green-500/30 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold text-white mb-2">No tokens launched yet</h2>
          <p className="text-gray-400">Be the first to launch a token through GREET!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokens.map((token) => (
            <div key={token.id} className="bg-black/30 border border-green-500/30 rounded-xl p-6 hover:border-green-500/50 transition-colors">
              {/* Token Header */}
              <div className="flex items-start justify-between mb-4">
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
                    <h3 className="text-lg font-bold text-white">{token.name}</h3>
                    <p className="text-gray-400">${token.symbol}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getPlatformIcon(token.platform)}
                  <span className={`text-sm font-semibold ${getStatusColor(token.status)}`}>
                    {token.status}
                  </span>
                </div>
              </div>

              {/* Token Description */}
              {token.description && (
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{token.description}</p>
              )}

              {/* Market Data */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400">Market Cap</p>
                  <p className="text-sm font-semibold text-white">{formatNumber(token.marketCap)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Price</p>
                  <p className="text-sm font-semibold text-white">{token.price ? `$${token.price.toFixed(6)}` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Volume 24h</p>
                  <p className="text-sm font-semibold text-white">{formatNumber(token.volume24h)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Holders</p>
                  <p className="text-sm font-semibold text-white">{token.holders?.toLocaleString() || 'N/A'}</p>
                </div>
              </div>

              {/* Launcher Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {token.user.profileImageUrl ? (
                    <Image
                      src={token.user.profileImageUrl}
                      alt={token.user.displayName || token.user.twitterUsername}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-xs">👤</span>
                    </div>
                  )}
                  <span className="text-sm text-gray-400">
                    by {token.user.displayName || `@${token.user.twitterUsername}`}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(token.launchDate)}
                </span>
              </div>

              {/* Social Links */}
              <div className="flex gap-2">
                {token.website && (
                  <a
                    href={token.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 text-sm"
                  >
                    🌐
                  </a>
                )}
                {token.twitterUrl && (
                  <a
                    href={token.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 text-sm"
                  >
                    🐦
                  </a>
                )}
                {token.telegramUrl && (
                  <a
                    href={token.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 text-sm"
                  >
                    📱
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LaunchedTokens; 