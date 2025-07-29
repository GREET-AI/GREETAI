'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Image from 'next/image';

interface TokenData {
  id: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  priceUSD?: number;
  amountUSD?: number;
  amount?: number;
  timestamp?: string;
  marketAddress?: string;
  tradeType?: string;
  baseAmount?: string;
  quoteAmount?: string;
  liquidityUSD?: number;
  dex?: string;
  method?: string;
  signer?: string;
  programAddress?: string;
  type: 'trading' | 'liquidity' | 'launch';
  lastActivity: string;
}

export default function LetsBonkTokens() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'featured' | 'trades' | 'pools' | 'launches'>('featured');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTokens();
    // Refresh every 30 seconds
    const interval = setInterval(fetchTokens, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/letsbonk/tokens?action=${activeTab}&limit=20`);
      const data = await response.json();
      
      if (data.success) {
        // Ensure data.data is an array
        const tokenArray = Array.isArray(data.data) ? data.data : [];
        setTokens(tokenArray);
      } else {
        toast.error('Failed to fetch token data');
        setTokens([]);
      }
    } catch (error) {
      console.error('Error fetching tokens:', error);
      toast.error('Failed to fetch token data');
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTokens = (tokens || []).filter(token =>
    token.tokenName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.tokenSymbol?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number) => {
    if (price < 0.000001) return `$${price.toExponential(2)}`;
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toFixed(0);
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getTokenIcon = (tokenName: string) => {
    // Generate a simple icon based on token name
    const firstChar = tokenName.charAt(0).toUpperCase();
    return (
      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
        {firstChar}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header Section - Unified Design */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-500 relative overflow-hidden rounded-2xl border border-orange-300/20 shadow-2xl">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 px-8 py-16 text-center">
            <div className="max-w-4xl mx-auto">
              {/* Logo and Title */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl p-3">
                  <span className="text-orange-500 font-bold text-2xl">LB</span>
                </div>
                <div>
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-3">LetsBonk Tokens</h1>
                  <p className="text-orange-100 text-xl md:text-2xl">The hottest tokens on Solana&apos;s favorite launchpad!</p>
                </div>
              </div>
              
              {/* Live Data Indicator */}
              <div className="flex items-center justify-center gap-3 text-lg text-orange-100">
                <span className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl border border-white/10">LIVE DATA</span>
                <span>•</span>
                <span>Auto-refresh every 30s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/50 border border-gray-800 rounded-lg p-3 pl-10 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
              />
              <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex gap-2">
            {[
              { key: 'featured', label: 'Featured', icon: '⭐' },
              { key: 'trades', label: 'Latest Trades', icon: '📈' },
              { key: 'pools', label: 'Liquidity Pools', icon: '💧' },
              { key: 'launches', label: 'Recent Launches', icon: '🚀' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Token Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            </motion.div>
          ))
        ) : filteredTokens.length > 0 ? (
          filteredTokens.map((token, index) => (
            <motion.div
              key={token.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-orange-500/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-3">
                {getTokenIcon(token.tokenName)}
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg group-hover:text-orange-400 transition-colors">
                    {token.tokenName}
                  </h3>
                  <p className="text-gray-400 text-sm">{token.tokenSymbol}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    token.type === 'trading' ? 'bg-green-500/20 text-green-400' :
                    token.type === 'liquidity' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {token.type}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {token.priceUSD && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Price:</span>
                    <span className="text-white font-medium">{formatPrice(token.priceUSD)}</span>
                  </div>
                )}
                
                {token.amountUSD && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Volume:</span>
                    <span className="text-white font-medium">{formatAmount(token.amountUSD)}</span>
                  </div>
                )}

                {token.liquidityUSD && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Liquidity:</span>
                    <span className="text-white font-medium">{formatAmount(token.liquidityUSD)}</span>
                  </div>
                )}

                {token.timestamp && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Time:</span>
                    <span className="text-gray-300 text-sm">{formatTime(token.timestamp)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-700">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>CA: {token.tokenAddress?.substring(0, 8)}...</span>
                    <span className="text-orange-400">LetsBonk</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No tokens found</div>
            <div className="text-gray-500 text-sm">Try adjusting your search or filters</div>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="mt-8 text-center">
        <button
          onClick={fetchTokens}
          disabled={loading}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  );
} 