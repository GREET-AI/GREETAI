import { NextResponse } from 'next/server';

// Mock-Daten für die Entwicklung
const mockUserProfiles: Record<string, any> = {
  default: {
    username: 'default_user',
    followersCount: 1500,
    hasBlueBadge: false,
    joinDate: new Date('2023-01-01')
  }
};

const mockQuestProgress: Record<string, any> = {
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
  }
};

export async function POST(request: Request) {
  try {
    const { action, username, questId, data } = await request.json();

    switch (action) {
      case 'get_profile':
        // Mock Profildaten zurückgeben
        return NextResponse.json({ 
          profile: mockUserProfiles[username] || mockUserProfiles.default 
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

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in quests API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 