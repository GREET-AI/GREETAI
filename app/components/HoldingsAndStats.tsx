'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface WalletData {
  greetBalance: number;
  greetPot: number;
  solBalance: number;
  portfolioValue: number;
}

const HoldingsAndStats = () => {
  const [walletData, setWalletData] = useState<WalletData>({
    greetBalance: 0,
    greetPot: 0,
    solBalance: 0,
    portfolioValue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get wallet address from localStorage or window object
        let currentWallet = walletAddress;
        if (!currentWallet) {
          // Try to get from localStorage
          const storedWallet = localStorage.getItem('walletAddress');
          if (storedWallet) {
            currentWallet = storedWallet;
            setWalletAddress(storedWallet);
          } else {
            // For demo purposes, use a placeholder wallet
            currentWallet = 'CtFt3qqBRBTy7d7qGVbpidqagcUgaVczmkvcTXcs2T8u';
            setWalletAddress(currentWallet);
          }
        }

        // Fetch balance data from our API
        const response = await fetch('/api/solana/balance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress: currentWallet
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch wallet data');
        }

        const result = await response.json();
        
        if (result.success) {
          setWalletData(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch wallet data');
        }

      } catch (err) {
        console.error('Error fetching wallet data:', err);
        setError('Failed to load wallet data');
        // Keep using 0 data
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, [walletAddress]);

  const getTier = (balance: number) => {
    if (balance >= 50000000) return 'Diamond';
    if (balance >= 10000000) return 'Gold';
    if (balance >= 5000000) return 'Silver';
    if (balance >= 1000000) return 'Bronze';
    return 'Free';
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Diamond': return 'text-blue-400';
      case 'Gold': return 'text-yellow-400';
      case 'Silver': return 'text-gray-400';
      case 'Bronze': return 'text-orange-400';
      default: return 'text-gray-500';
    }
  };

  const currentTier = getTier(walletData.greetBalance);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="bg-gradient-to-r from-green-500/20 to-purple-500/20 border border-green-500/30 rounded-xl p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-400">Loading your holdings...</p>
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
            Holdings & Stats
          </h1>
        </div>
        <p className="text-green-400 text-lg mb-6">Your GREET portfolio and performance metrics</p>
        
        {/* Wallet Address Display */}
        {walletAddress && (
          <div className="bg-black/30 rounded-lg p-3 mb-4">
            <p className="text-gray-400 text-sm mb-1">Connected Wallet:</p>
            <p className="text-green-400 font-mono text-sm break-all">
              {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
            <p className="text-gray-400 text-xs mt-1">Showing 0 values</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Holdings Section */}
        <div className="space-y-6">
          <div className="bg-black/30 border border-green-500/30 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              💎 Your Holdings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <Image
                      src="/GREET.png"
                      alt="GREET"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">GREET Balance</h3>
                    <p className="text-gray-400 text-sm">Your token holdings</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">{walletData.greetBalance.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">GREET</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">$</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">GREET Pot</h3>
                    <p className="text-gray-400 text-sm">Community rewards pool</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">{walletData.greetPot.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">SOL</div>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold">Your Tier</h3>
                  <span className={`font-bold ${getTierColor(currentTier)}`}>
                    {currentTier}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min((walletData.greetBalance / 50000000) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  {walletData.greetBalance.toLocaleString()} / 50,000,000 GREET to Diamond
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="space-y-6">
          <div className="bg-black/30 border border-green-500/30 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              📊 Performance Stats
            </h2>
            
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">Stats will be available when GREET token is live</p>
              <p className="text-gray-500 text-sm mt-2">Rank, streak, and other metrics will be calculated from real GREET token activity</p>
            </div>
          </div>

          <div className="bg-black/30 border border-green-500/30 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              🚀 Activity Metrics
            </h2>
            
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">Activity tracking will be available when GREET token is live</p>
              <p className="text-gray-500 text-sm mt-2">Launches, shills, and other metrics will be tracked from real GREET transactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoldingsAndStats; 