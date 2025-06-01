import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
  };
}

interface QuestProgress {
  questId: string;
  completed: boolean;
  progress: number;
  requiredProgress: number;
}

const INITIAL_QUESTS: Quest[] = [
  {
    id: 'mention_10k',
    title: 'Influencer Quest',
    description: 'Mention someone with 10k+ followers',
    reward: {
      greetTokens: 100,
      xp: 50
    },
    requirements: {
      minFollowers: 10000
    }
  },
  {
    id: 'blue_badge',
    title: 'Blue Badge Quest',
    description: 'Get verified on X',
    reward: {
      greetTokens: 500,
      xp: 200
    },
    requirements: {
      hasBlueBadge: true
    }
  },
  {
    id: 'referral_chain',
    title: 'Referral Chain Quest',
    description: 'Get 3 people to join through your referral',
    reward: {
      greetTokens: 300,
      xp: 150
    },
    requirements: {
      referralCount: 3
    }
  }
];

export default function QuestSystem() {
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [progress, setProgress] = useState<Record<string, QuestProgress>>({});
  const [selectedQuest, setSelectedQuest] = useState<string | null>(null);

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

  return (
    <div className="w-full max-w-4xl mx-auto p-6 mt-[72px]">
      <h2 className="text-3xl font-bold text-white mb-6">GREET Quests</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quests.map((quest) => (
          <motion.div
            key={quest.id}
            className="bg-black/50 border border-green-500/30 rounded-lg p-4 cursor-pointer hover:border-green-500/60 transition-all"
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedQuest(quest.id)}
          >
            <h3 className="text-xl font-bold text-green-500 mb-2">{quest.title}</h3>
            <p className="text-gray-300 mb-4">{quest.description}</p>
            
            {progress[quest.id] && (
              <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{
                    width: `${(progress[quest.id].progress / progress[quest.id].requiredProgress) * 100}%`
                  }}
                />
              </div>
            )}
            
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Reward: {quest.reward.greetTokens} GREET</span>
              <span>{quest.reward.xp} XP</span>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedQuest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
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