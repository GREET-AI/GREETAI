import { NextResponse } from 'next/server';

// Mock-Daten für die Entwicklung
const mockUserProfiles: Record<string, any> = {
  default: {
    username: 'default_user',
    followersCount: 1500,
    hasBlueBadge: false,
    joinDate: new Date('2023-01-01'),
    totalPosts: 0,
    greetPosts: 0,
    hashtagUsage: 0
  }
};

const mockQuestProgress: Record<string, any> = {
  first_greet_post: {
    questId: 'first_greet_post',
    completed: false,
    progress: 0,
    requiredProgress: 1
  },
  greet_hashtag: {
    questId: 'greet_hashtag',
    completed: false,
    progress: 0,
    requiredProgress: 5
  },
  mention_10k: {
    questId: 'mention_10k',
    completed: false,
    progress: 1500,
    requiredProgress: 10000
  },
  blue_badge: {
    questId: 'blue_badge',
    completed: false,
    progress: 0,
    requiredProgress: 1
  },
  referral_chain: {
    questId: 'referral_chain',
    completed: false,
    progress: 0,
    requiredProgress: 3
  },
  launch_hype: {
    questId: 'launch_hype',
    completed: false,
    progress: 0,
    requiredProgress: 10
  }
};

// Mock GREET Token Balance
let mockGreetBalance = 0;

export async function POST(request: Request) {
  try {
    const { action, username, questId, data } = await request.json();

    switch (action) {
      case 'get_profile':
        // Mock Profildaten zurückgeben
        return NextResponse.json({ 
          profile: mockUserProfiles[username] || mockUserProfiles.default 
        });

      case 'track_post':
        // Mock: Track X post
        const userProfile = mockUserProfiles[username] || mockUserProfiles.default;
        userProfile.totalPosts += 1;
        
        // Check if post contains GREET content
        if (data?.content?.toLowerCase().includes('greet')) {
          userProfile.greetPosts += 1;
          mockGreetBalance += 10; // Small reward for GREET post
        }
        
        // Check hashtag usage
        if (data?.content?.toLowerCase().includes('#greet')) {
          userProfile.hashtagUsage += 1;
          mockGreetBalance += 5; // Small reward for hashtag
        }
        
        return NextResponse.json({ 
          success: true,
          newBalance: mockGreetBalance,
          greetPosts: userProfile.greetPosts,
          hashtagUsage: userProfile.hashtagUsage
        });

      case 'check_mention':
        // Mock: 50% Chance auf erfolgreiche Mention
        return NextResponse.json({ 
          success: Math.random() > 0.5 
        });

      case 'check_community':
        // Mock: Community-Check ist immer erfolgreich
        return NextResponse.json({ 
          success: true 
        });

      case 'track_referral':
        // Mock Referral-Daten
        return NextResponse.json({ 
          referral: {
            directReferral: true,
            indirectReferral: false,
            chainLength: 1
          }
        });

      case 'get_progress':
        // Mock Quest-Fortschritt zurückgeben
        return NextResponse.json({ 
          progress: mockQuestProgress[questId] || {
            questId,
            completed: false,
            progress: 0,
            requiredProgress: 100
          }
        });

      case 'get_greet_balance':
        // Mock GREET Token Balance
        return NextResponse.json({ 
          balance: mockGreetBalance,
          earned: mockGreetBalance
        });

      case 'claim_reward':
        // Mock: Claim quest reward
        const quest = mockQuestProgress[questId];
        if (quest && !quest.completed) {
          quest.completed = true;
          // Add reward based on quest type
          const rewardAmount = getQuestReward(questId);
          mockGreetBalance += rewardAmount;
          return NextResponse.json({ 
            success: true,
            reward: rewardAmount,
            newBalance: mockGreetBalance
          });
        }
        return NextResponse.json({ 
          success: false,
          error: 'Quest not completed or already claimed'
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in quests API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getQuestReward(questId: string): number {
  const rewards: Record<string, number> = {
    'first_greet_post': 50,
    'greet_hashtag': 100,
    'mention_10k': 200,
    'blue_badge': 500,
    'referral_chain': 300,
    'launch_hype': 1000
  };
  return rewards[questId] || 0;
} 