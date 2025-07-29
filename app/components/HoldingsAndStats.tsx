'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const HoldingsAndStats = () => {
  const [greetBalance, setGreetBalance] = useState(1250000);
  const [greetPot, setGreetPot] = useState(45000);
  const [userRank, setUserRank] = useState(42);
  const [userStreak, setUserStreak] = useState(7);
  const [userPower, setUserPower] = useState(850);
  const [potentialReward, setPotentialReward] = useState(2.5);
  const [totalLaunches, setTotalLaunches] = useState(3);
  const [totalShills, setTotalShills] = useState(15);

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
                  <div className="text-2xl font-bold text-green-400">{greetBalance.toLocaleString()}</div>
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
                  <div className="text-2xl font-bold text-purple-400">{greetPot.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">SOL</div>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold">Your Tier</h3>
                  <span className="text-blue-400 font-bold">
                    {greetBalance >= 50000000 ? 'Diamond' : 
                     greetBalance >= 10000000 ? 'Gold' :
                     greetBalance >= 5000000 ? 'Silver' :
                     greetBalance >= 1000000 ? 'Bronze' : 'Free'}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min((greetBalance / 50000000) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  {greetBalance.toLocaleString()} / 50,000,000 GREET to Diamond
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
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Current Rank</div>
                <div className="text-2xl font-bold text-green-400">#{userRank}</div>
                <div className="text-xs text-gray-500 mt-1">Global leaderboard</div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Greet Streak</div>
                <div className="text-2xl font-bold text-blue-400">{userStreak} days 🔥</div>
                <div className="text-xs text-gray-500 mt-1">Daily activity</div>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Greet Power</div>
                <div className="text-2xl font-bold text-purple-400">{userPower} ⚡</div>
                <div className="text-xs text-gray-500 mt-1">Influence score</div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Potential Reward</div>
                <div className="text-2xl font-bold text-yellow-400">{potentialReward.toFixed(2)} SOL</div>
                <div className="text-xs text-gray-500 mt-1">Next distribution</div>
              </div>
            </div>
          </div>

          <div className="bg-black/30 border border-green-500/30 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              🚀 Activity Metrics
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <h3 className="text-white font-semibold">Total Launches</h3>
                    <p className="text-gray-400 text-sm">Tokens launched</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-400">{totalLaunches}</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📢</span>
                  <div>
                    <h3 className="text-white font-semibold">Total Shills</h3>
                    <p className="text-gray-400 text-sm">Successful promotions</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-400">{totalShills}</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💎</span>
                  <div>
                    <h3 className="text-white font-semibold">Portfolio Value</h3>
                    <p className="text-gray-400 text-sm">Total holdings</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-purple-400">{(greetBalance * 0.001).toFixed(2)} SOL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-black/30 border border-green-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 hover:bg-green-500/30 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">💸</div>
              <div className="text-white font-semibold">Send GREET</div>
              <div className="text-gray-400 text-sm">Share with friends</div>
            </div>
          </button>
          <button className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 hover:bg-blue-500/30 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">🚀</div>
              <div className="text-white font-semibold">Launch Token</div>
              <div className="text-gray-400 text-sm">Create new token</div>
            </div>
          </button>
          <button className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 hover:bg-purple-500/30 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-white font-semibold">View Leaderboard</div>
              <div className="text-gray-400 text-sm">Check rankings</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HoldingsAndStats; 