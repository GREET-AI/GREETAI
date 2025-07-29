import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { action, username, questId, data } = await request.json();

    switch (action) {
      case 'get_profile':
        // Get user profile from database
        const user = await prisma.user.findFirst({
          where: { twitterUsername: username }
        });
        
        if (!user) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        
        return NextResponse.json({ 
          profile: {
            id: user.id,
            twitterUsername: user.twitterUsername,
            rank: user.rank,
            xp: user.xp,
            greetBalance: user.greetBalance,
            totalGreetEarned: user.totalGreetEarned,
            totalPostsMade: user.totalPostsMade,
            totalLaunches: user.totalLaunches,
            totalShills: user.totalShills,
            achievements: user.achievements,
            rankProgress: user.rankProgress
          }
        });

      case 'track_post':
        // Track X post (legacy - use track_post_with_link instead)
        const userForPost = await prisma.user.findFirst({
          where: { twitterUsername: username }
        });
        
        if (!userForPost) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        
        // Update user stats
        await prisma.user.update({
          where: { id: userForPost.id },
          data: {
            totalPostsMade: { increment: 1 },
            greetBalance: { increment: 15 }, // Base reward
            totalGreetEarned: { increment: 15 }
          }
        });
        
        return NextResponse.json({ 
          success: true,
          newBalance: userForPost.greetBalance + 15
        });

      case 'track_post_with_link':
        // Validate and track post with link using database
        const { postLink, postId, content, timestamp } = data;
        
        // Find user by wallet address or Twitter username
        const userForLink = await prisma.user.findFirst({
          where: {
            OR: [
              { twitterUsername: username },
              { pumpWallet: username } // In case username is actually wallet address
            ]
          }
        });
        
        if (!userForLink) {
          return NextResponse.json({ 
            success: false, 
            error: 'User not found' 
          });
        }

        // Check if link is already used (database constraint will also prevent this)
        const existingPost = await prisma.userPost.findUnique({
          where: { postLink }
        });
        
        if (existingPost) {
          return NextResponse.json({ 
            success: false, 
            error: 'This X post link has already been submitted' 
          });
        }

        // Validate X link format
        try {
          const url = new URL(postLink);
          if (!url.hostname.includes('twitter.com') && !url.hostname.includes('x.com')) {
            return NextResponse.json({ 
              success: false, 
              error: 'Only X (Twitter) links are allowed' 
            });
          }
          
          if (!url.pathname.includes('/status/')) {
            return NextResponse.json({ 
              success: false, 
              error: 'Please provide a direct link to your X post' 
            });
          }

          const statusMatch = url.pathname.match(/\/status\/(\d+)/);
          if (!statusMatch) {
            return NextResponse.json({ 
              success: false, 
              error: 'Invalid X post link format' 
            });
          }
        } catch (error) {
          return NextResponse.json({ 
            success: false, 
            error: 'Invalid URL format' 
          });
        }

        // Calculate reward based on content
        let reward = 15; // Base reward
        if (content.toLowerCase().includes('greet')) {
          reward += 5;
        }
        if (content.toLowerCase().includes('#greet')) {
          reward += 3;
        }

        // Store the post and update user balance in a transaction
        const result = await prisma.$transaction(async (tx) => {
          // Create the post record
          const newPost = await tx.userPost.create({
            data: {
              userId: userForLink.id,
              postId,
              postLink,
              content,
              reward,
              timestamp: new Date(timestamp)
            }
          });

          // Update user balance and stats
          const updatedUser = await tx.user.update({
            where: { id: userForLink.id },
            data: {
              greetBalance: { increment: reward },
              totalGreetEarned: { increment: reward },
              totalPostsMade: { increment: 1 }
            }
          });

          return { newPost, updatedUser };
        });
        
        return NextResponse.json({ 
          success: true,
          newBalance: result.updatedUser.greetBalance,
          reward,
          message: 'Post tracked successfully'
        });

      case 'get_greet_balance':
        // Get GREET balance from database
        const userForBalance = await prisma.user.findFirst({
          where: { twitterUsername: username }
        });
        
        if (!userForBalance) {
          return NextResponse.json({ balance: 0 });
        }
        
        return NextResponse.json({ 
          balance: userForBalance.greetBalance 
        });

      case 'get_user_posts':
        // Get user's posted links from database
        const userForPosts = await prisma.user.findFirst({
          where: { twitterUsername: username },
          include: {
            userPosts: {
              orderBy: { createdAt: 'desc' }
            }
          }
        });
        
        if (!userForPosts) {
          return NextResponse.json({ posts: [] });
        }
        
        return NextResponse.json({ 
          posts: userForPosts.userPosts 
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

      default:
        return NextResponse.json({ 
          error: 'Unknown action' 
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Quest API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 