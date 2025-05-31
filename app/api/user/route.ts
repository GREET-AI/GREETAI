import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../generated/prisma'
import crypto from 'crypto'

const prisma = new PrismaClient()

// Generate a unique referral code
function generateReferralCode(): string {
  return `GREET${crypto.randomBytes(4).toString('hex').toUpperCase()}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { twitterUsername, pumpWallet, referralCode } = body

    // Validate input
    if (!twitterUsername || !pumpWallet) {
      return NextResponse.json(
        { error: 'Twitter username and pump wallet are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { twitterUsername },
          { pumpWallet }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Find referrer if referral code provided
    let referrerId = null
    if (referralCode) {
      const referrer = await prisma.user.findFirst({
        where: { referralCode }
      })
      if (referrer) {
        referrerId = referrer.id
      }
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        twitterUsername,
        pumpWallet,
        referralCode: generateReferralCode(),
        referredBy: referrerId
      }
    })

    // If user was referred, create reward for referrer
    if (referrerId) {
      await prisma.reward.create({
        data: {
          userId: referrerId,
          amount: 100, // Base referral reward
          rewardType: 'REFERRAL_L1',
          status: 'PENDING'
        }
      })
    }

    return NextResponse.json(newUser)
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 