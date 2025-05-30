import { NextResponse } from 'next/server';
import { TwitterService } from '@/app/services/twitter';

export async function POST(request: Request) {
  try {
    const { action, username, questId, data } = await request.json();

    switch (action) {
      case 'get_profile':
        const profile = await TwitterService.getUserProfile(username);
        return NextResponse.json({ profile });

      case 'check_mention':
        const { mentioned } = data;
        const mentionResult = await TwitterService.checkMentionQuest(username, mentioned);
        return NextResponse.json({ success: mentionResult });

      case 'check_community':
        const { communityId } = data;
        const communityResult = await TwitterService.checkCommunityJoinQuest(username, communityId);
        return NextResponse.json({ success: communityResult });

      case 'track_referral':
        const { referred } = data;
        const referralResult = await TwitterService.trackReferralChain(username, referred);
        return NextResponse.json({ referral: referralResult });

      case 'get_progress':
        const progress = await TwitterService.getQuestProgress(username, questId);
        return NextResponse.json({ progress });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in quests API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 