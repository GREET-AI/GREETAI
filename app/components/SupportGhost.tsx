'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface SupportGhostProps {
  currentPage: string;
}

const SupportGhost: React.FC<SupportGhostProps> = ({ currentPage }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Show ghost after a short delay when page changes
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000); // Slightly later than PageGreetGhost

    return () => clearTimeout(timer);
  }, [currentPage]);

  const getPageMessage = (page: string) => {
    const messages = {
      'dashboard': {
        title: 'Welcome to your GREET Dashboard! 👻',
        message: `This is your command center where you can track your progress, view your rank, and see your achievements. Complete quests to earn XP and climb the ranks! 

⏰ **GREET Token Launch Countdown**: Earn $GREET tokens by being active before the official launch!`,
        tips: [
          'Complete daily quests to earn XP',
          'Check your rank progress',
          'View your achievements',
          'Track your social engagement'
        ]
      },
      'launchpad': {
        title: 'GREET Launchpad - Launch Your Token! 🚀',
        message: `Choose between Pump.fun and LetsBonk.fun to launch your token. Upload images, set metadata, and preview your token before launch.

⏰ **GREET Token Launch Countdown**: Launch tokens and earn $GREET rewards!`,
        tips: [
          'Upload high-quality token images',
          'Add social media links',
          'Preview your token before launch',
          'Choose the right platform for your token'
        ]
      },
      'launched-tokens': {
        title: 'Launched Tokens - Track Your Success! 📊',
        message: `View all tokens launched through GREET. Monitor their performance, market data, and track your success as a token launcher.

⏰ **GREET Token Launch Countdown**: Successful launches earn you $GREET tokens!`,
        tips: [
          'Filter tokens by platform',
          'Monitor market performance',
          'Track holder growth',
          'View launch statistics'
        ]
      },
      'quests': {
        title: 'Quest System - Complete Missions! 🎯',
        message: `Complete quests to earn XP, climb ranks, and unlock achievements. Each quest brings you closer to the GREET token launch.

⏰ **GREET Token Launch Countdown**: Complete quests to earn $GREET tokens!`,
        tips: [
          'Complete daily quests',
          'Earn XP for ranking up',
          'Unlock achievements',
          'Track your progress'
        ]
      },
      'x-post-tracker': {
        title: 'X Post Tracker - Monitor Your Posts! 📱',
        message: `Track your X (Twitter) posts and their performance. Monitor engagement, likes, and viral potential.

⏰ **GREET Token Launch Countdown**: Viral posts earn you $GREET tokens!`,
        tips: [
          'Monitor post performance',
          'Track engagement metrics',
          'Analyze viral potential',
          'Optimize your content'
        ]
      },
      'send': {
        title: 'Send GREET - Share the Future! 💸',
        message: `Send GREET tokens to other users. Build connections and share the future of social interaction.

⏰ **GREET Token Launch Countdown**: Send tokens and earn rewards!`,
        tips: [
          'Send tokens to friends',
          'Build your network',
          'Track transactions',
          'Earn referral rewards'
        ]
      },
      'holdings': {
        title: 'Holdings - Your Token Portfolio! 💎',
        message: `View your token holdings and portfolio performance. Track your investments and earnings.

⏰ **GREET Token Launch Countdown**: Hold tokens to earn $GREET rewards!`,
        tips: [
          'Monitor your portfolio',
          'Track token performance',
          'View earnings',
          'Manage your holdings'
        ]
      },
      'history': {
        title: 'History - Your GREET Journey! 📜',
        message: `View your complete GREET journey. Track all your activities, transactions, and achievements.

⏰ **GREET Token Launch Countdown**: Your history determines your $GREET rewards!`,
        tips: [
          'Review your activities',
          'Track achievements',
          'Monitor progress',
          'View transaction history'
        ]
      }
    };

    return messages[page as keyof typeof messages] || {
      title: 'Welcome to GREET! 👻',
      message: `This is the GREET platform where you can launch tokens, complete quests, and earn rewards.

⏰ **GREET Token Launch Countdown**: Stay active to earn $GREET tokens!`,
      tips: ['Explore different sections', 'Complete quests', 'Launch tokens', 'Build your network']
    };
  };

  const pageInfo = getPageMessage(currentPage);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <AnimatePresence>
        {!isMinimized ? (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            className="bg-gradient-to-r from-green-500/20 to-purple-500/20 border border-green-500/30 rounded-xl p-6 w-80 backdrop-blur-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <Image
                    src="/GREET.png"
                    alt="GREET"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{pageInfo.title}</h3>
                  <p className="text-green-400 text-sm">Support Ghost</p>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="text-green-400 hover:text-green-300 text-xl"
              >
                ×
              </button>
            </div>

            {/* Message */}
            <div className="text-white text-sm leading-relaxed mb-4">
              {pageInfo.message.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-3">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tips */}
            <div className="bg-black/30 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-2">💡 Quick Tips:</h4>
              <ul className="text-white/80 text-sm space-y-1">
                {pageInfo.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Countdown Reminder */}
            <div className="mt-4 p-3 bg-gradient-to-r from-green-500/10 to-purple-500/10 border border-green-500/20 rounded-lg">
              <div className="text-center">
                <p className="text-green-400 font-semibold text-sm">⏰ GREET Token Launch</p>
                <p className="text-white/80 text-xs">Stay active to earn $GREET tokens!</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsMinimized(false)}
            className="bg-gradient-to-r from-green-500/20 to-purple-500/20 border border-green-500/30 rounded-full p-3 hover:scale-110 transition-all"
          >
            <Image
              src="/GREET.png"
              alt="GREET Support"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupportGhost; 