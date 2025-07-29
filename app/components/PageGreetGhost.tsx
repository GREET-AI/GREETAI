'use client';

import { useState, useEffect } from 'react';
import GreetGhost from './GreetGhost';

interface PageGreetGhostProps {
  currentPage: string;
  isRegisterModalOpen?: boolean;
}

const PageGreetGhost: React.FC<PageGreetGhostProps> = ({ currentPage, isRegisterModalOpen = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Don't show ghost if register modal is open
    if (isRegisterModalOpen) {
      setIsVisible(false);
      return;
    }

    // Show ghost after a short delay when page changes
    const timer = setTimeout(() => {
      const pageMessages = {
        'dashboard': "YO ANON! 🔥 WELCOME TO GREET AI! I'M YOUR PERSONAL GUIDE THROUGH THE MOST DEGEN SOCIAL PLATFORM! GAS UP AND GET READY TO DOMINATE! Your dashboard is your command center - track your progress, view your rank, and become a GREET legend! LFG! 🚀💚",
        'launchpad': "YO ANON! 🚀 READY TO LAUNCH SOME TOKENS? I'M HERE TO GUIDE YOU THROUGH THE MOST DEGEN LAUNCHPAD! Choose between Pump.fun and LetsBonk.fun - upload images, set metadata, and preview your token! LAUNCHPAD GOES LIVE AFTER GREET TOKEN LAUNCH! ⏰💚",
        'launched-tokens': "YO ANON! 📊 CHECKING OUT YOUR LAUNCHED TOKENS? I'M HERE TO HELP YOU TRACK YOUR SUCCESS! Monitor performance, market data, and see your tokens dominate! 💚",
        'quests': "YO ANON! 🎯 QUEST TIME! I'M YOUR PERSONAL QUEST MASTER! Complete missions, earn XP, and climb the ranks to become a GREET legend! 💚",
        'x-post-tracker': "YO ANON! 📱 TRACKING YOUR X POSTS? I'M HERE TO HELP YOU ANALYZE YOUR VIRAL POTENTIAL! Let's make your posts go viral! 💚",
        'send': "YO ANON! 💸 SEND GREETS AND EARN $GREET! I'M HERE TO HELP YOU BUILD CONNECTIONS AND EARN REWARDS! Share the future of social interaction and get paid for it! 💚",
        'holdings': "YO ANON! 💎 CHECKING YOUR HOLDINGS & STATS? I'M HERE TO HELP YOU MANAGE YOUR PORTFOLIO AND TRACK YOUR PERFORMANCE! 💚",
        'history': "YO ANON! 📜 LIVE GREET HISTORY! I'M HERE TO SHOW YOU ALL GREETS, X POSTS, AND INFLUENCER ACTIVITY! Track the viral movement in real-time! 💚"
      };

      const pageMessage = pageMessages[currentPage as keyof typeof pageMessages] || 
        "YO ANON! 🔥 WELCOME TO GREET AI! I'M YOUR PERSONAL GUIDE THROUGH THE MOST DEGEN PLATFORM! Stay active to earn $GREET tokens! 💚";

      setMessage(pageMessage);
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentPage, isRegisterModalOpen]);

  return (
    <GreetGhost
      message={message}
      isVisible={isVisible}
      onClose={() => setIsVisible(false)}
      autoHide={true}
      autoHideDelay={8000}
    />
  );
};

export default PageGreetGhost; 