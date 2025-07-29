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
  // Original Posts (keeping some)
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
  },

  // NEW: Crypto Influencer Posts - Bonk Community
  {
    id: 'bonk_1',
    content: '🐕 @BonkCapitalSOL @bjoernbonk @BONKRadio GREET is the next BONK! The most degen AI launchpad on Solana! @AIGreet #GREET #BONK #Solana #Degen',
    category: 'community',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#BONK', '#Solana', '#Degen']
  },
  {
    id: 'bonk_2',
    content: '🚀 @BonkArmy @BonkBros @BonkBeast GREET launchpad will make BONK look like child\'s play! @AIGreet #GREET #BONK #Launchpad #Solana',
    category: 'hype',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#BONK', '#Launchpad', '#Solana']
  },
  {
    id: 'bonk_3',
    content: '💎 @BonkBlitz @BonkBoom @BonkBuster GREET community has diamond hands like BONK! @AIGreet #GREET #BONK #DiamondHands #Community',
    category: 'community',
    difficulty: 'easy',
    reward: 15,
    hashtags: ['#GREET', '#BONK', '#DiamondHands', '#Community']
  },

  // Pump.fun Influencers
  {
    id: 'pump_1',
    content: '🔥 @Kevpumpfun @PumpFunHype @PumpFunGuru GREET will dominate Pump.fun! The most advanced AI launchpad! @AIGreet #GREET #PumpFun #AI #Solana',
    category: 'launch',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#PumpFun', '#AI', '#Solana']
  },
  {
    id: 'pump_2',
    content: '⚡ @PumpFunPro @PumpFunMaster @PumpFunAddict GREET technology is next level! Pump.fun won\'t know what hit them! @AIGreet #GREET #PumpFun #Technology',
    category: 'ai',
    difficulty: 'hard',
    reward: 25,
    hashtags: ['#GREET', '#PumpFun', '#Technology']
  },
  {
    id: 'pump_3',
    content: '🚀 @PumpFunViral @PumpFunFever @PumpFunPulse GREET will go viral on Pump.fun! The future is here! @AIGreet #GREET #PumpFun #Viral #Future',
    category: 'hype',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#PumpFun', '#Viral', '#Future']
  },

  // LetsBonk.fun Influencers
  {
    id: 'letsbonk_1',
    content: '🔥 @LetsBonkVibes @LetsBonkBoss @LetsBonkKing GREET will revolutionize LetsBonk.fun! The most degen AI launchpad! @AIGreet #GREET #LetsBonk #AI #Degen',
    category: 'launch',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#LetsBonk', '#AI', '#Degen']
  },
  {
    id: 'letsbonk_2',
    content: '⚡ @LetsBonkLife @LetsBonkWave @LetsBonkHype GREET community is the most loyal on LetsBonk.fun! @AIGreet #GREET #LetsBonk #Community #Loyal',
    category: 'community',
    difficulty: 'easy',
    reward: 15,
    hashtags: ['#GREET', '#LetsBonk', '#Community', '#Loyal']
  },
  {
    id: 'letsbonk_3',
    content: '🚀 @LetsBonkRiser @LetsBonkKing GREET will be the biggest thing on LetsBonk.fun! @AIGreet #GREET #LetsBonk #Biggest #Solana',
    category: 'hype',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#LetsBonk', '#Biggest', '#Solana']
  },

  // Solana Ecosystem Influencers
  {
    id: 'solana_ecosystem_1',
    content: '🌞 @SolanaLegend @SolanaWhale @SolanaElite GREET is the future of Solana! The most innovative launchpad! @AIGreet #GREET #Solana #Innovation #Future',
    category: 'solana',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#Solana', '#Innovation', '#Future']
  },
  {
    id: 'solana_ecosystem_2',
    content: '⚡ @SolanaSniper @SolanaTraderX @SolanaChaser GREET will be the most profitable launchpad on Solana! @AIGreet #GREET #Solana #Profitable #Trading',
    category: 'solana',
    difficulty: 'hard',
    reward: 25,
    hashtags: ['#GREET', '#Solana', '#Profitable', '#Trading']
  },
  {
    id: 'solana_ecosystem_3',
    content: '🔥 @SolanaMaverick @SolanaPioneer @SolanaVanguard GREET is pioneering the future of Solana DeFi! @AIGreet #GREET #Solana #Pioneer #DeFi',
    category: 'solana',
    difficulty: 'hard',
    reward: 25,
    hashtags: ['#GREET', '#Solana', '#Pioneer', '#DeFi']
  },

  // DeFi & Trading Influencers
  {
    id: 'defi_1',
    content: '💎 @DeFiDynamo @DeFiDegenX @DeFiFinestt GREET will dominate DeFi! The most advanced AI launchpad! @AIGreet #GREET #DeFi #AI #Advanced',
    category: 'ai',
    difficulty: 'hard',
    reward: 25,
    hashtags: ['#GREET', '#DeFi', '#AI', '#Advanced']
  },
  {
    id: 'defi_2',
    content: '🚀 @CryptoGuruX @CryptoHustlerX @CryptoVibeZ GREET is the next big thing in crypto! The most innovative launchpad! @AIGreet #GREET #Crypto #Innovation #NextBigThing',
    category: 'hype',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#Crypto', '#Innovation', '#NextBigThing']
  },
  {
    id: 'defi_3',
    content: '⚡ @TokenTitan @TokenBlaze @TokenRush GREET tokens will be the most valuable on Solana! @AIGreet #GREET #Tokens #Valuable #Solana',
    category: 'launch',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#Tokens', '#Valuable', '#Solana']
  },

  // Memecoin Influencers
  {
    id: 'memecoin_1',
    content: '🔥 @MemecoinMania @MemeLordSol @MemecoinMogul GREET will be the biggest memecoin launchpad! @AIGreet #GREET #Memecoin #Launchpad #Biggest',
    category: 'hype',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#Memecoin', '#Launchpad', '#Biggest']
  },
  {
    id: 'memecoin_2',
    content: '🚀 @MemeCoinHunter @MemeCoinVibe @MemeCoinWizard GREET community is the most degen memecoin community! @AIGreet #GREET #Memecoin #Degen #Community',
    category: 'community',
    difficulty: 'easy',
    reward: 15,
    hashtags: ['#GREET', '#Memecoin', '#Degen', '#Community']
  },
  {
    id: 'memecoin_3',
    content: '💎 @MemeCoinRiser @MemeCoinBlaze GREET will make memecoins go viral! The future of memecoin launches! @AIGreet #GREET #Memecoin #Viral #Future',
    category: 'hype',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#Memecoin', '#Viral', '#Future']
  },

  // Technical & Innovation Posts
  {
    id: 'tech_1',
    content: '🧠 @0xSharples @aeyakovenko @JupiterExchange GREET AI technology is revolutionary! The most advanced launchpad on Solana! @AIGreet #GREET #AI #Technology #Revolutionary',
    category: 'ai',
    difficulty: 'hard',
    reward: 30,
    hashtags: ['#GREET', '#AI', '#Technology', '#Revolutionary']
  },
  {
    id: 'tech_2',
    content: '⚡ @RaydiumProtocol @SolportTom @solportskg GREET will integrate with the best Solana protocols! @AIGreet #GREET #Solana #Protocols #Integration',
    category: 'solana',
    difficulty: 'hard',
    reward: 25,
    hashtags: ['#GREET', '#Solana', '#Protocols', '#Integration']
  },
  {
    id: 'tech_3',
    content: '🚀 @MoonPay @DeRonin_ @0xMoei GREET will make token launches accessible to everyone! @AIGreet #GREET #Accessible #Everyone #Launchpad',
    category: 'launch',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#Accessible', '#Everyone', '#Launchpad']
  },

  // Community & Social Posts
  {
    id: 'social_1',
    content: '👥 @Zun2025 @0xAbhiP @TimHaldorsson GREET community is the most diverse and inclusive on Solana! @AIGreet #GREET #Community #Diverse #Inclusive',
    category: 'community',
    difficulty: 'easy',
    reward: 15,
    hashtags: ['#GREET', '#Community', '#Diverse', '#Inclusive']
  },
  {
    id: 'social_2',
    content: '🌟 @OxJoshyy @CryptoUsopp @PixOnChain GREET brings together the best minds in crypto! @AIGreet #GREET #Crypto #BestMinds #Community',
    category: 'community',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#Crypto', '#BestMinds', '#Community']
  },
  {
    id: 'social_3',
    content: '💎 @DeFiMinty @farmercist_eth @tobific GREET community has the strongest hands in DeFi! @AIGreet #GREET #DeFi #StrongHands #Community',
    category: 'community',
    difficulty: 'easy',
    reward: 15,
    hashtags: ['#GREET', '#DeFi', '#StrongHands', '#Community']
  },

  // Trading & Analysis Posts
  {
    id: 'trading_1',
    content: '📈 @splinter0n @cryptoleon_xyz @zaimiriQ GREET will be the most profitable launchpad for traders! @AIGreet #GREET #Trading #Profitable #Launchpad',
    category: 'launch',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#Trading', '#Profitable', '#Launchpad']
  },
  {
    id: 'trading_2',
    content: '🎯 @Deebs_DeFi @ripchillpill @banditxbt GREET analysis: This will be the biggest launchpad on Solana! @AIGreet #GREET #Analysis #Biggest #Solana',
    category: 'hype',
    difficulty: 'hard',
    reward: 25,
    hashtags: ['#GREET', '#Analysis', '#Biggest', '#Solana']
  },
  {
    id: 'trading_3',
    content: '🚀 @connectwithveee @cysic_xyz @YuujiLux GREET will make everyone rich! The most degen launchpad! @AIGreet #GREET #Rich #Degen #Launchpad',
    category: 'hype',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#Rich', '#Degen', '#Launchpad']
  },

  // Innovation & Future Posts
  {
    id: 'innovation_1',
    content: '🔮 @BoxMrChen @OxTochi @WY_mask GREET is the future of token launches! Revolutionary technology! @AIGreet #GREET #Future #Revolutionary #Technology',
    category: 'ai',
    difficulty: 'hard',
    reward: 30,
    hashtags: ['#GREET', '#Future', '#Revolutionary', '#Technology']
  },
  {
    id: 'innovation_2',
    content: '⚡ @Emma_H_E5 @xiaoyubtc @wanghebbf GREET will change how we think about DeFi! @AIGreet #GREET #DeFi #Change #Innovation',
    category: 'ai',
    difficulty: 'hard',
    reward: 25,
    hashtags: ['#GREET', '#DeFi', '#Change', '#Innovation']
  },
  {
    id: 'innovation_3',
    content: '🚀 @0xrudylu @Crypto_He @zerokn0wledge_ GREET knowledge is power! The most informed community! @AIGreet #GREET #Knowledge #Power #Community',
    category: 'community',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#Knowledge', '#Power', '#Community']
  },

  // More Degen Posts
  {
    id: 'degen_1',
    content: '🔥 @SuPeRjOeMaNiTo @pumatheuma @0xDexDuck GREET is pure degen energy! The most insane launchpad! @AIGreet #GREET #Degen #Energy #Insane',
    category: 'hype',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#Degen', '#Energy', '#Insane']
  },
  {
    id: 'degen_2',
    content: '💎 @walirttt @MogeYuu28 @msjojos GREET community has diamond hands like no other! @AIGreet #GREET #DiamondHands #Community #NoOther',
    category: 'community',
    difficulty: 'easy',
    reward: 15,
    hashtags: ['#GREET', '#DiamondHands', '#Community', '#NoOther']
  },
  {
    id: 'degen_3',
    content: '🚀 @C2Dougie @Tradermomike @Spicy_Rich GREET will make us all millionaires! The most degen launchpad! @AIGreet #GREET #Millionaires #Degen #Launchpad',
    category: 'hype',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#Millionaires', '#Degen', '#Launchpad']
  },

  // Technical Expertise Posts
  {
    id: 'expertise_1',
    content: '🧠 @Eyenidim @CryptoBeast2030 @cryptohdaily GREET AI is the most advanced technology in crypto! @AIGreet #GREET #AI #Advanced #Technology',
    category: 'ai',
    difficulty: 'hard',
    reward: 30,
    hashtags: ['#GREET', '#AI', '#Advanced', '#Technology']
  },
  {
    id: 'expertise_2',
    content: '⚡ @etcjitender @t1mmy_w3b @NFTreeProj3ct GREET will revolutionize Web3! The most innovative platform! @AIGreet #GREET #Web3 #Revolutionary #Innovative',
    category: 'ai',
    difficulty: 'hard',
    reward: 25,
    hashtags: ['#GREET', '#Web3', '#Revolutionary', '#Innovative']
  },
  {
    id: 'expertise_3',
    content: '🚀 @CryptoSer23 @Shoehorn1984 @BritWashed GREET is the future of crypto! The most forward-thinking platform! @AIGreet #GREET #Crypto #Future #ForwardThinking',
    category: 'hype',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#Crypto', '#Future', '#ForwardThinking']
  },

  // Community Building Posts
  {
    id: 'community_build_1',
    content: '👥 @4lexx07 @ThaScalpStation @CTPigeon GREET community is the most supportive in crypto! @AIGreet #GREET #Community #Supportive #Crypto',
    category: 'community',
    difficulty: 'easy',
    reward: 15,
    hashtags: ['#GREET', '#Community', '#Supportive', '#Crypto']
  },
  {
    id: 'community_build_2',
    content: '🌟 @ztherookie @thetrevorlahey @Sith_AG GREET brings together the best traders and builders! @AIGreet #GREET #Traders #Builders #Community',
    category: 'community',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#Traders', '#Builders', '#Community']
  },
  {
    id: 'community_build_3',
    content: '💎 @bigray0x @morsyxbt @Defi_Scribbler GREET community has the strongest conviction! @AIGreet #GREET #Community #Conviction #Strong',
    category: 'community',
    difficulty: 'easy',
    reward: 15,
    hashtags: ['#GREET', '#Community', '#Conviction', '#Strong']
  },

  // DeFi Innovation Posts
  {
    id: 'defi_innovation_1',
    content: '🔥 @_Quivira @DeFi_Finestt @SaneraGermaine GREET will dominate DeFi! The most innovative protocols! @AIGreet #GREET #DeFi #Innovative #Protocols',
    category: 'ai',
    difficulty: 'hard',
    reward: 25,
    hashtags: ['#GREET', '#DeFi', '#Innovative', '#Protocols']
  },
  {
    id: 'defi_innovation_2',
    content: '⚡ @0xgeek_x @craigscoinpurse @AlphaWolfPRMR GREET technology is next level! The future of DeFi! @AIGreet #GREET #Technology #NextLevel #DeFi',
    category: 'ai',
    difficulty: 'hard',
    reward: 30,
    hashtags: ['#GREET', '#Technology', '#NextLevel', '#DeFi']
  },
  {
    id: 'defi_innovation_3',
    content: '🚀 @natashalfawn @SailorManCrypto @NDIDI_GRAM GREET will make DeFi accessible to everyone! @AIGreet #GREET #DeFi #Accessible #Everyone',
    category: 'launch',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#DeFi', '#Accessible', '#Everyone']
  },

  // More Influencer Integration Posts
  {
    id: 'influencer_1',
    content: '🔥 @sandraaleow @morganacash @0xMistBlade GREET is the most talked about launchpad! @AIGreet #GREET #TalkedAbout #Launchpad #Hype',
    category: 'hype',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#TalkedAbout', '#Launchpad', '#Hype']
  },
  {
    id: 'influencer_2',
    content: '⚡ @SolanaCoach @bittybitbit86 @greenytrades GREET will be the most profitable for traders! @AIGreet #GREET #Profitable #Traders #Solana',
    category: 'solana',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#Profitable', '#Traders', '#Solana']
  },
  {
    id: 'influencer_3',
    content: '🚀 @RiddlerNFT @doodlifts @crypto_adair GREET community is the most creative in crypto! @AIGreet #GREET #Creative #Community #Crypto',
    category: 'community',
    difficulty: 'easy',
    reward: 15,
    hashtags: ['#GREET', '#Creative', '#Community', '#Crypto']
  },

  // Final Degen Posts
  {
    id: 'final_degen_1',
    content: '🔥 @slingdeez @brad_or_bradley @eat_insanity GREET is pure insanity! The most degen launchpad ever! @AIGreet #GREET #Insanity #Degen #Launchpad',
    category: 'hype',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#Insanity', '#Degen', '#Launchpad']
  },
  {
    id: 'final_degen_2',
    content: '💎 @0xAmberCT @0xAndrewMoh @defikadic GREET community has the strongest hands! Diamond hands forever! @AIGreet #GREET #StrongestHands #DiamondHands #Forever',
    category: 'community',
    difficulty: 'easy',
    reward: 15,
    hashtags: ['#GREET', '#StrongestHands', '#DiamondHands', '#Forever']
  },
  {
    id: 'final_degen_3',
    content: '🚀 @grebbycrypto @Mikesi30 @Boboafrica1 GREET will make Africa the crypto capital! @AIGreet #GREET #Africa #CryptoCapital #Global',
    category: 'hype',
    difficulty: 'medium',
    reward: 20,
    hashtags: ['#GREET', '#Africa', '#CryptoCapital', '#Global']
  },

  // Ultimate GREET Posts
  {
    id: 'ultimate_1',
    content: '🔥 @Web3Niels @eli5_defi GREET will make DeFi simple for everyone! The most user-friendly launchpad! @AIGreet #GREET #DeFi #UserFriendly #Simple',
    category: 'ai',
    difficulty: 'hard',
    reward: 30,
    hashtags: ['#GREET', '#DeFi', '#UserFriendly', '#Simple']
  },
  {
    id: 'ultimate_2',
    content: '⚡ @WuBlockchain @bonk_fun GREET is the most innovative launchpad in the world! @AIGreet #GREET #Innovative #Launchpad #World',
    category: 'ai',
    difficulty: 'hard',
    reward: 30,
    hashtags: ['#GREET', '#Innovative', '#Launchpad', '#World']
  },
  {
    id: 'ultimate_3',
    content: '🚀 @MartinezOnChain @GeraldFMonkey GREET will change the crypto world forever! @AIGreet #GREET #Change #Crypto #Forever',
    category: 'hype',
    difficulty: 'hard',
    reward: 30,
    hashtags: ['#GREET', '#Change', '#Crypto', '#Forever']
  }
];

export default function XPostTracker() {
  const [greetBalance, setGreetBalance] = useState(0);
  const [postedIds, setPostedIds] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState<string | null>(null);
  const [showLinkInput, setShowLinkInput] = useState<string | null>(null);
  const [postLink, setPostLink] = useState('');
  const [linkError, setLinkError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState<string>('');

  useEffect(() => {
    // Get user identifier from localStorage or wallet
    const getCurrentUser = () => {
      // Try to get wallet address from localStorage
      const walletAddress = localStorage.getItem('walletAddress');
      if (walletAddress) {
        setUserIdentifier(walletAddress);
        return walletAddress;
      }
      
      // Fallback to Twitter username if available
      const twitterUsername = localStorage.getItem('twitterUsername');
      if (twitterUsername) {
        setUserIdentifier(twitterUsername);
        return twitterUsername;
      }
      
      // Default fallback
      return 'current_user';
    };

    const identifier = getCurrentUser();
    setUserIdentifier(identifier);
    
    // Load current balance
    loadBalance(identifier);
  }, []);

  const loadBalance = async (identifier: string) => {
    try {
      const response = await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_greet_balance',
          username: identifier
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

  // Validate X post link
  const validateXLink = (link: string): { isValid: boolean; error?: string } => {
    const trimmedLink = link.trim();
    
    // Check if empty
    if (!trimmedLink) {
      return { isValid: false, error: 'Please enter a link' };
    }

    // Check if it's a valid URL
    try {
      const url = new URL(trimmedLink);
      
      // Check if it's from X/Twitter
      if (!url.hostname.includes('twitter.com') && !url.hostname.includes('x.com')) {
        return { isValid: false, error: 'Only X (Twitter) links are allowed' };
      }

      // Check if it's a status/post link
      if (!url.pathname.includes('/status/')) {
        return { isValid: false, error: 'Please provide a direct link to your X post' };
      }

      // Extract status ID and validate format
      const statusMatch = url.pathname.match(/\/status\/(\d+)/);
      if (!statusMatch) {
        return { isValid: false, error: 'Invalid X post link format' };
      }

      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: 'Please enter a valid URL' };
    }
  };

  const handlePost = async (post: GreetPost) => {
    if (postedIds.includes(post.id)) {
      toast.error('You already posted this!');
      return;
    }

    setIsPosting(post.id);

    try {
      // Open Twitter in new tab with pre-filled content
      const encodedText = encodeURIComponent(post.content);
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
      window.open(twitterUrl, '_blank');

      // Show link input modal after a short delay
      setTimeout(() => {
        setShowLinkInput(post.id);
        setIsPosting(null);
        setLinkError('');
        setPostLink('');
      }, 1000);

    } catch (error) {
      console.error('Error posting:', error);
      setIsPosting(null);
    }
  };

  const handleLinkSubmit = async (post: GreetPost) => {
    // Validate link
    const validation = validateXLink(postLink);
    if (!validation.isValid) {
      setLinkError(validation.error || 'Invalid link');
      return;
    }

    setIsSubmitting(true);
    setLinkError('');

    try {
      // Track the post for rewards with link validation
      const response = await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'track_post_with_link',
          username: userIdentifier,
          data: { 
            content: post.content, 
            postLink: postLink.trim(),
            postId: post.id,
            timestamp: new Date().toISOString()
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setGreetBalance(data.newBalance);
        setPostedIds(prev => [...prev, post.id]);
        
        toast.success(`Post tracked successfully! +${post.reward} $GREET earned! 🎉`, {
          description: `Total balance: ${data.newBalance} $GREET`
        });

        // Close modal and reset
        setShowLinkInput(null);
        setPostLink('');
        setLinkError('');
      } else {
        setLinkError(data.error || 'Failed to track post. Please try again.');
      }
    } catch (error) {
      console.error('Error tracking post:', error);
      setLinkError('Failed to track post. Please try again.');
    } finally {
      setIsSubmitting(false);
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

      {/* Link Input Modal */}
      {showLinkInput && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 border border-green-500/30 rounded-xl p-6 max-w-md w-full mx-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Post Your X Link</h3>
              <p className="text-gray-400 text-sm">
                Paste the link to your X post below to earn rewards!
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-green-400 text-sm font-medium mb-2">
                  X Post Link
                </label>
                <input
                  type="url"
                  value={postLink}
                  onChange={(e) => {
                    setPostLink(e.target.value);
                    if (linkError) setLinkError('');
                  }}
                  placeholder="https://twitter.com/username/status/..."
                  className={`w-full bg-black/50 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none ${
                    linkError ? 'border-red-500' : 'border-gray-600 focus:border-green-500'
                  }`}
                />
                {linkError && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                    <span>⚠️</span>
                    {linkError}
                  </p>
                )}
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-400 text-xs">ℹ️</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    <p className="font-medium text-green-400 mb-1">Beta Version - Help Train Our Algorithm!</p>
                    <p className="text-gray-400">
                      All posts are tracked and analyzed to improve our reward system. 
                      Your link submissions help us train the algorithm for better GREET token distribution.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowLinkInput(null);
                    setPostLink('');
                    setLinkError('');
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const currentPost = GREET_POSTS.find(p => p.id === showLinkInput);
                    if (currentPost) {
                      handleLinkSubmit(currentPost);
                    }
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-400 text-black font-medium py-3 px-4 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Submit & Earn'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 