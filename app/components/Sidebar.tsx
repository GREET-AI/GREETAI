import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';

// Technical SVG Icons
const Icons = {
  quests: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  send: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  launch: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  history: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  holdings: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  stats: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  leaderboard: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
};

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { disconnect } = useWallet();

  const sections = [
    { id: 'quests', label: 'Quests', icon: Icons.quests },
          { id: 'send', label: 'GREET', icon: Icons.send },
            { id: 'launchpad', label: 'Launchpad', icon: Icons.launch },
          { id: 'launched-tokens', label: 'Launched Tokens', icon: Icons.holdings },
    { id: 'history', label: 'History', icon: Icons.history },
          { id: 'holdings', label: 'Holdings & Stats', icon: Icons.holdings },
    { id: 'leaderboard', label: 'Leaderboard', icon: Icons.leaderboard }
  ];

  const handleLogout = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? '60px' : '240px' }}
      className="h-screen bg-[#0a0a0a] border-r border-green-500/20 fixed left-0 top-0 z-50 flex flex-col backdrop-blur-sm"
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center text-black hover:bg-green-400 transition-colors"
      >
        {isCollapsed ? '→' : '←'}
      </button>

      <div className="p-4">
        <Image 
          src="/GREET.png" 
          alt="GREET" 
          width={48} 
          height={48} 
          className="w-12 h-12 mx-auto mb-4 filter brightness-150"
        />
      </div>

      <nav className="flex-1">
        {sections.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full text-left p-4 hover:bg-green-500/5 transition-all flex items-center gap-3
              ${activeSection === item.id ? 'bg-green-500/10 border-r-2 border-green-500 text-green-400' : 'text-gray-400'}`}
          >
            {item.id === 'send' ? (
              <Image 
                src="/GREET.png" 
                alt="GREET" 
                width={20} 
                height={20} 
                className="w-5 h-5"
              />
            ) : (
              <span className="text-gray-400">{item.icon}</span>
            )}
            {!isCollapsed && (
              item.id === 'send' ? (
                <span 
                  className="font-chippunk font-bold tracking-wide"
                  style={{ textShadow: '0 2px 8px #00FF41, 0 4px 16px #00FF41' }}
                >
                  {item.label}
                </span>
              ) : (
                <span className="font-medium tracking-wide">{item.label}</span>
              )
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-green-500/20">
        {!isCollapsed && (
          <>
            <div className="text-xs text-green-500/50 text-center font-mono mb-2">
              GREET v1.0.0
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded flex items-center gap-2 justify-center transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Disconnect</span>
            </button>
          </>
        )}
        {isCollapsed && (
          <button
            onClick={handleLogout}
            className="w-full aspect-square flex items-center justify-center text-xl text-red-400 hover:bg-red-500/10 rounded transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
} 