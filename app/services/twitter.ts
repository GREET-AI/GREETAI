import { TwitterApi, TweetV2, UserV2 } from 'twitter-api-v2';

// Twitter API Client
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

export interface GreetMessage {
  text: string;
  media?: string; // URL to media (GIF, image, etc.)
  recipient?: string; // Twitter handle of recipient
}

export interface UserProfile {
  username: string;
  followersCount: number;
  hasBlueBadge: boolean;
  joinDate: Date;
}

export interface QuestProgress {
  questId: string;
  completed: boolean;
  progress: number;
  requiredProgress: number;
}

export class TwitterService {
  static async postGreet(greet: GreetMessage) {
    try {
      let tweetText = greet.text;
      
      // Add recipient if specified
      if (greet.recipient) {
        tweetText = `@${greet.recipient} ${tweetText}`;
      }

      // Add hashtags
      tweetText += '\n\n#GREET #Solana #Web3';

      // Post tweet
      const tweet = await client.v2.tweet(tweetText);

      // If there's media, add it to the tweet
      if (greet.media) {
        // Upload media and add to tweet
        // This would need to be implemented based on the media type
      }

      return tweet;
    } catch (error) {
      console.error('Error posting greet:', error);
      throw error;
    }
  }

  static async getGreetStats(username: string) {
    try {
      const user = await client.v2.userByUsername(username);
      const tweets = await client.v2.userTimeline(user.data.id, {
        'tweet.fields': ['public_metrics', 'created_at'],
        max_results: 100,
      });

      const tweetData = tweets.data.data || [];

      return {
        totalGreets: tweetData.length,
        engagement: tweetData.reduce((acc, tweet) => {
          return acc + (tweet.public_metrics?.like_count || 0) + 
                       (tweet.public_metrics?.retweet_count || 0);
        }, 0),
        lastGreet: tweetData[0]?.created_at,
      };
    } catch (error) {
      console.error('Error getting greet stats:', error);
      throw error;
    }
  }

  static async getUserProfile(username: string): Promise<UserProfile> {
    try {
      const user = await client.v2.userByUsername(username, {
        'user.fields': ['public_metrics', 'verified', 'created_at']
      });

      return {
        username: user.data.username,
        followersCount: user.data.public_metrics?.followers_count || 0,
        hasBlueBadge: user.data.verified || false,
        joinDate: new Date(user.data.created_at!)
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  static async checkMentionQuest(mentioner: string, mentioned: string): Promise<boolean> {
    try {
      const tweets = await client.v2.userMentionTimeline(mentioner, {
        'tweet.fields': ['created_at'],
        max_results: 100,
      });

      const tweetData = tweets.data.data || [];

      return tweetData.some((tweet: TweetV2) => 
        tweet.text.includes(`@${mentioned}`) && 
        new Date(tweet.created_at!).getTime() > Date.now() - 24 * 60 * 60 * 1000 // Within last 24h
      );
    } catch (error) {
      console.error('Error checking mention quest:', error);
      throw error;
    }
  }

  static async checkCommunityJoinQuest(username: string, communityId: string): Promise<boolean> {
    try {
      // Note: This requires additional Twitter API endpoints that might need to be requested
      // Diese Methode ist noch nicht implementiert in twitter-api-v2
      // Wir sollten sie entweder entfernen oder anders implementieren
      return false;
    } catch (error) {
      console.error('Error checking community join quest:', error);
      throw error;
    }
  }

  static async trackReferralChain(referrer: string, referred: string): Promise<{
    directReferral: boolean;
    indirectReferral: boolean;
    chainLength: number;
  }> {
    try {
      // This would need to be implemented with a database to track the referral chain
      // For now, we'll return a mock implementation
      return {
        directReferral: true,
        indirectReferral: false,
        chainLength: 1
      };
    } catch (error) {
      console.error('Error tracking referral chain:', error);
      throw error;
    }
  }

  static async getQuestProgress(username: string, questId: string): Promise<QuestProgress> {
    try {
      const user = await this.getUserProfile(username);
      
      // Example quest progress calculation
      let progress = 0;
      let requiredProgress = 0;
      let completed = false;

      switch (questId) {
        case 'mention_10k':
          progress = user.followersCount;
          requiredProgress = 10000;
          completed = user.followersCount >= 10000;
          break;
        case 'blue_badge':
          progress = user.hasBlueBadge ? 1 : 0;
          requiredProgress = 1;
          completed = user.hasBlueBadge;
          break;
        // Add more quest types here
      }

      return {
        questId,
        completed,
        progress,
        requiredProgress
      };
    } catch (error) {
      console.error('Error getting quest progress:', error);
      throw error;
    }
  }
} 