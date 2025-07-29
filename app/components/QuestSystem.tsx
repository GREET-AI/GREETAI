import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: {
    greetTokens: number;
    xp: number;
  };
  requirements: {
    minFollowers?: number;
    hasBlueBadge?: boolean;
    referralCount?: number;
    postCount?: number;
    hashtagCount?: number;
  };
  type: 'social' | 'referral' | 'engagement' | 'launch';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
}

interface QuestProgress {
  questId: string;
  completed: boolean;
  progress: number;
  requiredProgress: number;
}

const INITIAL_QUESTS: Quest[] = [
  {
    id: 'first_greet_post',
    title: 'First GREET Post',
    description: 'Post your first GREET-related content on X',
    reward: {
      greetTokens: 1000,
      xp: 100
    },
    requirements: {
      postCount: 1
    },
    type: 'social',
    difficulty: 'easy'
  },
  {
    id: 'greet_hashtag',
    title: 'GREET Hashtag Warrior',
    description: 'Use #GREET in 5 different posts',
    reward: {
      greetTokens: 2000,
      xp: 200
    },
    requirements: {
      hashtagCount: 5
    },
    type: 'social',
    difficulty: 'easy'
  },
  {
    id: 'mention_10k',
    title: 'Influencer Quest',
    description: 'Mention someone with 10k+ followers',
    reward: {
      greetTokens: 5000,
      xp: 500
    },
    requirements: {
      minFollowers: 10000
    },
    type: 'social',
    difficulty: 'medium'
  },
  {
    id: 'blue_badge',
    title: 'Blue Badge Quest',
    description: 'Get verified on X',
    reward: {
      greetTokens: 10000,
      xp: 1000
    },
    requirements: {
      hasBlueBadge: true
    },
    type: 'social',
    difficulty: 'hard'
  },
  {
    id: 'referral_chain',
    title: 'Referral Chain Quest',
    description: 'Get 3 people to join through your referral',
    reward: {
      greetTokens: 7500,
      xp: 750
    },
    requirements: {
      referralCount: 3
    },
    type: 'referral',
    difficulty: 'medium'
  },
  {
    id: 'launch_hype',
    title: 'Launch Hype Master',
    description: 'Create 10 posts about GREET launch',
    reward: {
      greetTokens: 25000,
      xp: 2500
    },
    requirements: {
      postCount: 10
    },
    type: 'launch',
    difficulty: 'legendary'
  }
];

export default function QuestSystem() {
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [progress, setProgress] = useState<Record<string, QuestProgress>>({});
  const [selectedQuest, setSelectedQuest] = useState<string | null>(null);
  const [timeUntilLaunch, setTimeUntilLaunch] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown Timer
  useEffect(() => {
    const launchDate = new Date('2025-08-04T13:00:00Z'); // August 4th, 3 PM German time (1 PM UTC)
    // If the date has passed, set it to next year
    const now = new Date();
    if (launchDate.getTime() <= now.getTime()) {
      launchDate.setFullYear(launchDate.getFullYear() + 1);
    }
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = launchDate.getTime() - now.getTime();
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeUntilLaunch({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Load quest progress for all quests
    const loadProgress = async () => {
      const progressData: Record<string, QuestProgress> = {};
      for (const quest of quests) {
        try {
          const response = await fetch('/api/quests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'get_progress',
              questId: quest.id,
              username: 'current_user' // This should be replaced with actual username
            })
          });
          const data = await response.json();
          progressData[quest.id] = data.progress;
        } catch (error) {
          console.error(`Error loading progress for quest ${quest.id}:`, error);
        }
      }
      setProgress(progressData);
    };

    loadProgress();
  }, [quests]);

  const getDifficultyColor = (difficulty: string) => {
    // Cleaner approach - all difficulty badges use green with different opacities
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-green-300';
      case 'hard': return 'text-green-200';
      case 'legendary': return 'text-green-100';
      default: return 'text-green-400';
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    // Darker green tones for quest cards
    switch (difficulty) {
      case 'easy': return 'bg-green-900/20 border border-green-600/50';
      case 'medium': return 'bg-green-800/25 border border-green-500/60';
      case 'hard': return 'bg-green-700/30 border border-green-400/70';
      case 'legendary': return 'bg-green-600/35 border border-green-300/80';
      default: return 'bg-green-900/20 border border-green-600/50';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Launch Countdown */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-500/20 to-purple-500/20 border border-green-500/30 rounded-xl p-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 font-chippunk" style={{ textShadow: '0 2px 8px #00FF41, 0 4px 16px #00FF41' }}>🚀 GREET LAUNCHPAD</h1>
          <p className="text-green-400 text-lg mb-4">The most degen Solana launchpad is coming...</p>
          
          <div className="flex justify-center gap-4 mb-4">
            <div className="bg-black/50 rounded-lg p-3 min-w-[80px]">
              <div className="text-2xl font-bold text-green-400">{timeUntilLaunch.days}</div>
              <div className="text-xs text-gray-400">DAYS</div>
            </div>
            <div className="bg-black/50 rounded-lg p-3 min-w-[80px]">
              <div className="text-2xl font-bold text-green-400">{timeUntilLaunch.hours}</div>
              <div className="text-xs text-gray-400">HOURS</div>
            </div>
            <div className="bg-black/50 rounded-lg p-3 min-w-[80px]">
              <div className="text-2xl font-bold text-green-400">{timeUntilLaunch.minutes}</div>
              <div className="text-xs text-gray-400">MINUTES</div>
            </div>
            <div className="bg-black/50 rounded-lg p-3 min-w-[80px]">
              <div className="text-2xl font-bold text-green-400">{timeUntilLaunch.seconds}</div>
              <div className="text-xs text-gray-400">SECONDS</div>
            </div>
          </div>
          
                              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                      <span className="px-2 py-1 bg-green-500/20 rounded-full text-green-400">PRE-EARN</span>
                      <span>•</span>
                      <span>Earn $GREET tokens now!</span>
                    </div>
        </div>
      </div>

      {/* GREET Token Info */}
      <div className="mb-6">
        <div className="bg-black/30 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-green-400">$GREET Token</h3>
              <p className="text-gray-400 text-sm">Earn tokens by completing quests and posting on X</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">$0.00</div>
              <div className="text-xs text-gray-400">Launch Price</div>
            </div>
          </div>
        </div>
      </div>

      {/* THE FIRST SELF-SHILLING LAUNCHPAD Banner */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative overflow-hidden bg-gradient-to-r from-green-600/20 via-purple-600/20 to-green-600/20 border border-green-500/40 rounded-xl p-6"
          whileHover={{ scale: 1.02 }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-purple-500/5 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl animate-ping"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Image 
                  src="/GREET.png" 
                  alt="GREET" 
                  width={48} 
                  height={48} 
                  className="w-12 h-12 animate-bounce"
                />
                <div>
                  <h2 className="text-2xl font-bold text-white font-chippunk" style={{ textShadow: '0 2px 8px #00FF41, 0 4px 16px #00FF41' }}>
                    THE FIRST SELF-SHILLING LAUNCHPAD
                  </h2>
                  <p className="text-green-400 text-sm">Revolution in Token Economics</p>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-400">🚀</div>
                  <div className="text-xs text-gray-400">REVOLUTIONARY</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-black/30 rounded-lg p-3 border border-green-500/20">
                <div className="text-green-400 font-bold mb-1">Endless Circle</div>
                <div className="text-xs text-gray-300">Launch → Promote → Grow → Reward → Repeat</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3 border border-green-500/20">
                <div className="text-green-400 font-bold mb-1">Self-Sustaining</div>
                <div className="text-xs text-gray-300">Every success story fuels the next launch</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3 border border-green-500/20">
                <div className="text-green-400 font-bold mb-1">Community Power</div>
                <div className="text-xs text-gray-300">The entire community promotes every token</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-gray-300 text-sm max-w-2xl">
                What if a platform could promote itself? GREET is the world's first self-sustaining launchpad ecosystem where success breeds success in an endless virtuous cycle.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 to-green-600 text-black font-bold px-6 py-3 rounded-lg hover:from-green-400 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                onClick={() => {
                  localStorage.setItem('greetActiveSection', 'how-it-works');
                  window.location.href = '/';
                }}
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <h2 className="text-3xl font-bold text-white mb-6 font-chippunk" style={{ textShadow: '0 2px 8px #00FF41, 0 4px 16px #00FF41' }}>GREET Quests</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quests.map((quest, index) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            className={`${getDifficultyBg(quest.difficulty)} rounded-lg p-4 cursor-pointer relative overflow-hidden group`}
            whileHover={{ 
              scale: 1.05,
              rotateY: 5,
              boxShadow: "0 20px 40px rgba(0, 255, 65, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedQuest(quest.id)}
          >
            {/* Difficulty Badge */}
            <motion.div 
              className="absolute top-2 right-2"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${getDifficultyColor(quest.difficulty)} bg-black/50 border border-current/20`}>
                {quest.difficulty.toUpperCase()}
              </span>
            </motion.div>

            {/* Quest Type Icon */}
            <motion.div 
              className="mb-3"
              whileHover={{ scale: 1.2, rotate: 10 }}
              animate={{ 
                y: [0, -5, 0],
                transition: { 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }
              }}
            >
              {quest.type === 'social' && (
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              )}
              {quest.type === 'referral' && (
                <Image 
                  src="/GREET.png" 
                  alt="GREET" 
                  width={24} 
                  height={24} 
                  className="w-6 h-6"
                />
              )}
              {quest.type === 'engagement' && (
                <Image 
                  src="/GREET.png" 
                  alt="GREET" 
                  width={24} 
                  height={24} 
                  className="w-6 h-6"
                />
              )}
              {quest.type === 'launch' && (
                <Image 
                  src="/GREET.png" 
                  alt="GREET" 
                  width={24} 
                  height={24} 
                  className="w-6 h-6"
                />
              )}
            </motion.div>

            <h3 className="text-xl font-bold text-white mb-2 font-chippunk">{quest.title}</h3>
            <p className="text-gray-300 mb-4 text-sm">{quest.description}</p>
            
            {progress[quest.id] && (
              <div className="mb-3">
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-green-400 to-green-500 h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${Math.min((progress[quest.id].progress / progress[quest.id].requiredProgress) * 100, 100)}%`
                    }}
                    transition={{ 
                      duration: 1, 
                      delay: 0.5,
                      ease: "easeOut"
                    }}
                  />
                </div>
                <motion.p 
                  className="text-xs text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {progress[quest.id].progress} / {progress[quest.id].requiredProgress}
                </motion.p>
              </div>
            )}
            
            <div className="mb-2">
              <p className="text-xs text-gray-500 font-medium">Rewards:</p>
            </div>
            <motion.div 
              className="flex justify-between items-center text-sm"
              whileHover={{ scale: 1.05 }}
            >
              <motion.span 
                className="text-green-400 font-bold"
                whileHover={{ 
                  scale: 1.1,
                  textShadow: "0 0 8px #00FF41"
                }}
              >
                {quest.reward.greetTokens} <span className="font-chippunk">$GREET</span>
              </motion.span>
              <motion.span 
                className="text-gray-400"
                whileHover={{ 
                  scale: 1.1,
                  color: "#FFD700"
                }}
              >
                {quest.reward.xp} XP
              </motion.span>
            </motion.div>

            {/* Completion Status */}
            {progress[quest.id]?.completed && (
              <motion.div 
                className="absolute top-2 left-2"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  delay: 0.5
                }}
              >
                <span className="text-green-400 text-2xl">✅</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-green-800/30 border border-green-600/50 rounded-lg p-4 text-center hover:bg-green-700/40 transition-colors"
            onClick={() => {
              // Navigate to GREET section
              localStorage.setItem('greetActiveSection', 'send');
              window.location.href = '/';
            }}
          >
            <div className="mb-2 flex justify-center">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
            <div className="font-bold text-green-300">Send GREET</div>
            <div className="text-sm text-gray-300">Share GREET content</div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-green-700/25 border border-green-500/40 rounded-lg p-4 text-center hover:bg-green-600/35 transition-colors"
            onClick={() => {
              // Show referral info modal or navigate to referral section
              alert('Referral system coming soon! Invite friends to earn bonus GREET tokens! 🚀');
            }}
          >
            <div className="mb-2 flex justify-center">
              <Image 
                src="/GREET.png" 
                alt="GREET" 
                width={32} 
                height={32} 
                className="w-8 h-8"
              />
            </div>
            <div className="font-bold text-green-200">Invite Friends</div>
            <div className="text-sm text-gray-300">Earn referral rewards</div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-green-600/20 border border-green-400/30 rounded-lg p-4 text-center hover:bg-green-500/25 transition-colors"
            onClick={() => {
              // Navigate to Launchpad section
              localStorage.setItem('greetActiveSection', 'launchpad');
              window.location.href = '/';
            }}
          >
            <div className="mb-2 flex justify-center">
              <Image 
                src="/GREET.png" 
                alt="GREET" 
                width={32} 
                height={32} 
                className="w-8 h-8"
              />
            </div>
            <div className="font-bold text-green-100">Launch Prep</div>
            <div className="text-sm text-gray-300">Get ready for launch</div>
          </motion.button>
        </div>
      </div>

      {selectedQuest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedQuest(null)}
        >
          <div
            className="bg-black border border-green-500/30 rounded-lg p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-green-500 mb-4">
              {quests.find(q => q.id === selectedQuest)?.title}
            </h3>
            <p className="text-gray-300 mb-4">
              {quests.find(q => q.id === selectedQuest)?.description}
            </p>
            {progress[selectedQuest] && (
              <div className="mb-4">
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{
                      width: `${(progress[selectedQuest].progress / progress[selectedQuest].requiredProgress) * 100}%`
                    }}
                  />
                </div>
                <p className="text-sm text-gray-400">
                  Progress: {progress[selectedQuest].progress} / {progress[selectedQuest].requiredProgress}
                </p>
              </div>
            )}
            <button
              className="w-full bg-green-500 text-black font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors"
              onClick={() => setSelectedQuest(null)}
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
} 