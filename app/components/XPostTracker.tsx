'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Image from 'next/image';

interface GreetPost {
  id: string;
  content: string;
  category: 'launch' | 'community' | 'hype' | 'ai' | 'solana' | 'countdown';
  difficulty: 'easy' | 'medium' | 'hard';
  reward: number;
  hashtags: string[];
}

const GREET_POSTS: GreetPost[] = [
  // Launch Posts
  {
    id: 'launch_1',
    content: '🚀 GREET launchpad is coming! The most degen Solana launchpad will revolutionize token launches! @AIGreet #GREET #Solana #Launchpad',
    category: 'launch',
    difficulty: 'easy',
    reward: 15,
    hashtags: ['#GREET', '#Solana', '#Launchpad']
  },
  {
    id: 'launch_2',
    content: '🔥 GREET is about to change the game! The most epic Solana launchpad launch is just around the corner! @AIGreet #GREET #Web3 #Innovation',
    category: 'launch',
    difficulty: 'easy',
    reward: 15,
    hashtags: ['#GREET', '#Web3', '#Innovation']
  },
  {
    id: 'launch_3',
    content: '⚡ GREET launchpad countdown is ON! Get ready for the most degen token launch experience on Solana! @AIGreet #GREET #Countdown #Solana',
    category: 'launch',
    difficulty: 'easy',
    reward: 15,
    hashtags: ['#GREET', '#Countdown', '#Solana']
  },
  
  // Community Posts
  {
    id: 'community_1',
    content: '👥 The GREET community is growing fast! Join the most degen launchpad community on Solana! @AIGreet #GREET #Community #Solana',
    category: 'community',
    difficulty: 'easy',
    reward: 15,
    hashtags: ['#GREET', '#Community', '#Solana']
  },
  {
    id: 'community_2',
    content: '🌟 GREET community is absolutely amazing! The energy here is unmatched! @AIGreet #GREET #Community #Vibes',
    category: 'community',
    difficulty: 'easy',
    reward: 15,
    hashtags: ['#GREET', '#Community', '#Vibes']
  },
  {
    id: 'community_3',
    content: '💎 GREET community is pure diamond hands! The most loyal degen community on Solana! @AIGreet #GREET #DiamondHands #Solana',
    category: 'community',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#DiamondHands', '#Solana']
  },
  
  // Hype Posts
  {
    id: 'hype_1',
    content: '🔥 GREET is going to be HUGE! This launchpad will dominate Solana! @AIGreet #GREET #Huge #Solana',
    category: 'hype',
    difficulty: 'easy',
    reward: 15,
    hashtags: ['#GREET', '#Huge', '#Solana']
  },
  {
    id: 'hype_2',
    content: '🚀 GREET launchpad will be the biggest thing on Solana! Mark my words! @AIGreet #GREET #Biggest #Solana',
    category: 'hype',
    difficulty: 'easy',
    reward: 15,
    hashtags: ['#GREET', '#Biggest', '#Solana']
  },
  {
    id: 'hype_3',
    content: '⚡ GREET is the future of token launches! Nothing will be the same after GREET! @AIGreet #GREET #Future #Revolution',
    category: 'hype',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#Future', '#Revolution']
  },
  
  // AI Posts
  {
    id: 'ai_1',
    content: '🤖 GREET AI is absolutely mind-blowing! The most advanced AI launchpad on Solana! @AIGreet #GREET #AI #Solana',
    category: 'ai',
    difficulty: 'easy',
    reward: 15,
    hashtags: ['#GREET', '#AI', '#Solana']
  },
  {
    id: 'ai_2',
    content: '🧠 GREET AI technology is revolutionary! This will change how we think about token launches! @AIGreet #GREET #AI #Technology',
    category: 'ai',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#AI', '#Technology']
  },
  {
    id: 'ai_3',
    content: '💡 GREET AI innovation is next level! The future of DeFi is here! @AIGreet #GREET #AI #Innovation #DeFi',
    category: 'ai',
    difficulty: 'hard',
    reward: 25,
    hashtags: ['#GREET', '#AI', '#Innovation', '#DeFi']
  },
  
  // Solana Posts
  {
    id: 'solana_1',
    content: '🌞 GREET on Solana is going to be epic! The fastest blockchain meets the best launchpad! @AIGreet #GREET #Solana #Fastest',
    category: 'solana',
    difficulty: 'easy',
    reward: 15,
    hashtags: ['#GREET', '#Solana', '#Fastest']
  },
  {
    id: 'solana_2',
    content: '⚡ Solana + GREET = Unstoppable! The perfect combination for the future of DeFi! @AIGreet #GREET #Solana #DeFi',
    category: 'solana',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#Solana', '#DeFi']
  },
  {
    id: 'solana_3',
    content: '🔥 GREET will make Solana the ultimate DeFi destination! The revolution starts here! @AIGreet #GREET #Solana #Revolution',
    category: 'solana',
    difficulty: 'hard',
    reward: 25,
    hashtags: ['#GREET', '#Solana', '#Revolution']
  },
  
  // Countdown Posts
  {
    id: 'countdown_1',
    content: '⏰ GREET launch countdown: The most degen Solana launchpad is almost here! @AIGreet #GREET #Countdown #Solana',
    category: 'countdown',
    difficulty: 'easy',
    reward: 15,
    hashtags: ['#GREET', '#Countdown', '#Solana']
  },
  {
    id: 'countdown_2',
    content: '🎯 GREET launch is approaching! Get ready for the most epic token launch on Solana! @AIGreet #GREET #Launch #Solana',
    category: 'countdown',
    difficulty: 'easy',
    reward: 15,
    hashtags: ['#GREET', '#Launch', '#Solana']
  },
  {
    id: 'countdown_3',
    content: '🚀 GREET launchpad countdown is LIVE! The future of token launches is coming! @AIGreet #GREET #Countdown #Future',
    category: 'countdown',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#Countdown', '#Future']
  },
  
  // Advanced Posts with @AIGreet mentions
  {
    id: 'advanced_1',
    content: '🔥 @AIGreet is absolutely crushing it! The most innovative AI launchpad on Solana! #GREET #AI #Innovation',
    category: 'ai',
    difficulty: 'hard',
    reward: 30,
    hashtags: ['#GREET', '#AI', '#Innovation']
  },
  {
    id: 'advanced_2',
    content: '🚀 @AIGreet community is the most degen community on Solana! Pure diamond hands! #GREET #Community #DiamondHands',
    category: 'community',
    difficulty: 'hard',
    reward: 30,
    hashtags: ['#GREET', '#Community', '#DiamondHands']
  },
  {
    id: 'advanced_3',
    content: '⚡ @AIGreet technology is revolutionary! This will change the entire DeFi landscape! #GREET #Technology #DeFi',
    category: 'ai',
    difficulty: 'hard',
    reward: 30,
    hashtags: ['#GREET', '#Technology', '#DeFi']
  }
];

export default function XPostTracker() {
  const [greetBalance, setGreetBalance] = useState(0);
  const [postedIds, setPostedIds] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState<string | null>(null);

  useEffect(() => {
    // Load current balance
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const response = await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_greet_balance',
          username: 'current_user'
        })
      });
      const data = await response.json();
      if (data.balance !== undefined) {
        setGreetBalance(data.balance);
      }
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  const handlePost = async (post: GreetPost) => {
    if (postedIds.includes(post.id)) {
      toast.error('You already posted this!');
      return;
    }

    setIsPosting(post.id);

    try {
      // First, create the actual post on Twitter
      const twitterResponse = await fetch('/api/user/post-to-twitter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: post.content
        })
      });

      const twitterData = await twitterResponse.json();

      if (twitterData.success) {
        // Verify the post was actually created by checking if it exists
        const verifyResponse = await fetch('/api/user/verify-tweet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tweetId: twitterData.tweetId,
            expectedContent: post.content
          })
        });

        const verifyData = await verifyResponse.json();

        if (verifyData.verified) {
          // Only then track the post for rewards
          const response = await fetch('/api/quests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'track_post',
              username: 'current_user',
              data: { content: post.content, tweetId: twitterData.tweetId }
            })
          });

          const data = await response.json();

          if (data.success) {
            setGreetBalance(data.newBalance);
            setPostedIds(prev => [...prev, post.id]);
            
            toast.success(`Posted to X successfully! +${post.reward} $GREET earned! 🎉`, {
              description: `Total balance: ${data.newBalance} $GREET`
            });
          }
        } else {
          toast.error('Post verification failed. Please try again.');
        }
      } else {
        toast.error('Failed to post to X: ' + (twitterData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error posting:', error);
      toast.error('Failed to post to X');
    } finally {
      setIsPosting(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'launch': return '🚀';
      case 'community': return '👥';
      case 'hype': return '🔥';
      case 'ai': return '🤖';
      case 'solana': return '🌞';
      case 'countdown': return '⏰';
      default: return '📱';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-green-300';
      case 'hard': return 'text-green-200';
      default: return 'text-green-400';
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-900/20 border border-green-600/50';
      case 'medium': return 'bg-green-800/25 border border-green-500/60';
      case 'hard': return 'bg-green-700/30 border border-green-400/70';
      default: return 'bg-green-900/20 border border-green-600/50';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-500/20 to-purple-500/20 border border-green-500/30 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <h1 className="text-4xl font-bold text-white font-chippunk" style={{ textShadow: '0 2px 8px #00FF41, 0 4px 16px #00FF41' }}>Send GREET</h1>
          </div>
          <p className="text-green-400 text-lg mb-4">Share GREET content on X and earn $GREET tokens!</p>
          
          {/* Wallet Display */}
          <div className="bg-black/50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{greetBalance}</div>
                <div className="text-sm text-gray-400">$GREET Earned</div>
              </div>
              <div className="text-gray-400">|</div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-300">{postedIds.length}</div>
                <div className="text-sm text-gray-400">Posts Made</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <span className="px-2 py-1 bg-green-500/20 rounded-full text-green-400">PRE-EARN</span>
            <span>•</span>
            <span>Click any post to share and earn!</span>
          </div>
        </div>
      </div>

      {/* GREET Posts Grid */}
      <h2 className="text-3xl font-bold text-white mb-6 font-chippunk" style={{ textShadow: '0 2px 8px #00FF41, 0 4px 16px #00FF41' }}>GREET Posts</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GREET_POSTS.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.05,
              type: "spring",
              stiffness: 100
            }}
            className={`${getDifficultyBg(post.difficulty)} rounded-lg p-4 cursor-pointer relative overflow-hidden group`}
            whileHover={{ 
              scale: 1.02,
              rotateY: 2,
              boxShadow: "0 10px 20px rgba(0, 255, 65, 0.2)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePost(post)}
          >
            {/* Difficulty Badge */}
            <motion.div 
              className="absolute top-2 right-2"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${getDifficultyColor(post.difficulty)} bg-black/50 border border-current/20`}>
                {post.difficulty.toUpperCase()}
              </span>
            </motion.div>

            {/* Category Icon */}
            <motion.div 
              className="mb-3"
              whileHover={{ scale: 1.2, rotate: 10 }}
              animate={{ 
                y: [0, -3, 0],
                transition: { 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }
              }}
            >
              <span className="text-2xl">{getCategoryIcon(post.category)}</span>
            </motion.div>

            {/* Post Content */}
            <div className="mb-4">
              <p className="text-gray-300 text-sm leading-relaxed">{post.content}</p>
            </div>

            {/* Hashtags */}
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {post.hashtags.map((hashtag, idx) => (
                  <span key={idx} className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded-full">
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>

                         {/* Reward and Post Button */}
             <motion.div 
               className="flex justify-between items-center"
               whileHover={{ scale: 1.05 }}
             >
               <motion.span 
                 className="text-green-400 font-bold"
                 whileHover={{ 
                   scale: 1.1,
                   textShadow: '0 0 8px #00FF41'
                 }}
               >
                 +{post.reward} <span className="font-chippunk">$GREET</span>
               </motion.span>
               
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={(e) => {
                   e.stopPropagation();
                   const encodedText = encodeURIComponent(post.content);
                   const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
                   window.open(twitterUrl, '_blank');
                   handlePost(post);
                 }}
                 className="bg-green-500 hover:bg-green-400 text-black font-bold px-3 py-1 rounded text-xs transition-colors"
               >
                 Post on X
               </motion.button>
             </motion.div>

            {/* Post Status */}
            {postedIds.includes(post.id) && (
              <motion.div 
                className="absolute top-2 left-2"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 200,
                  delay: 0.5
                }}
              >
                <span className="text-green-400 text-2xl">✅</span>
              </motion.div>
            )}

            {/* Loading State */}
            {isPosting === post.id && (
              <motion.div 
                className="absolute inset-0 bg-black/50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-green-400">
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Tips Section */}
      <div className="mt-8">
        <div className="bg-green-900/20 border border-green-600/50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-400 mb-4 font-chippunk">💡 Tips to Earn More</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-green-400">•</span>
                <span>Include &quot;GREET&quot; in your post for +10 $GREET</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-green-400">•</span>
                <span>Use #GREET hashtag for +5 $GREET bonus</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-green-400">•</span>
                <span>Mention @AIGreet for extra rewards</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-green-400">•</span>
                <span>Harder posts give bigger rewards</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 