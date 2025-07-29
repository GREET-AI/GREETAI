export interface RankConfig {
  title: string;
  requiredXP: number;
  color: string;
  emoji: string;
  perks: string[];
  callout: string;
}

export const RANKS: RankConfig[] = [
  {
    title: "Deadass Rookie",
    requiredXP: 0,
    color: "#4F4F4F",
    emoji: "🥶",
    perks: ["Basic launch access", "Standard shill tools"],
    callout: "fr fr just starting"
  },
  {
    title: "No Cap Novice",
    requiredXP: 100,
    color: "#7CBA3B",
    emoji: "⚡",
    perks: ["Enhanced shill reach", "+5% GREET rewards"],
    callout: "real talk making moves"
  },
  {
    title: "Bussin' Believer",
    requiredXP: 300,
    color: "#5D8AA8",
    emoji: "🔥",
    perks: ["Priority queue", "+10% GREET rewards", "Custom shill templates"],
    callout: "straight up climbing"
  },
  {
    title: "Trenches Trader",
    requiredXP: 700,
    color: "#9966CC",
    emoji: "💪",
    perks: ["Early launch access", "+15% GREET rewards", "Advanced analytics"],
    callout: "in the mud grinding"
  },
  {
    title: "Rizz Raider",
    requiredXP: 1500,
    color: "#FFD700",
    emoji: "🌟",
    perks: ["VIP launch slots", "+20% GREET rewards", "Custom badge"],
    callout: "got that alpha fr"
  },
  {
    title: "Sheesh Shiller",
    requiredXP: 3000,
    color: "#FF6B6B",
    emoji: "🚀",
    perks: ["Premium features", "+25% GREET rewards", "Exclusive groups"],
    callout: "no skips detected"
  },
  {
    title: "Devious Degen",
    requiredXP: 6000,
    color: "#FF1493",
    emoji: "😈",
    perks: ["Master features", "+35% GREET rewards", "Private alpha"],
    callout: "actually valid moves"
  },
  {
    title: "Gyatt General",
    requiredXP: 12000,
    color: "#9400D3",
    emoji: "👑",
    perks: ["Elite perks", "+50% GREET rewards", "Direct listing"],
    callout: "goes actually hard"
  },
  {
    title: "Skibidi Sigma",
    requiredXP: 25000,
    color: "#00FFFF",
    emoji: "💎",
    perks: ["God mode features", "+75% GREET rewards", "Instant launch"],
    callout: "real ones know fr fr"
  },
  {
    title: "Trenches Titan",
    requiredXP: 50000,
    color: "#FF4500",
    emoji: "⚔️",
    perks: ["Legendary status", "+100% GREET rewards", "Custom perks"],
    callout: "absolutely based god"
  },
  {
    title: "Founder",
    requiredXP: Infinity,
    color: "#FFD700",
    emoji: "🐐",
    perks: ["Everything unlocked", "Custom multiplier", "God mode"],
    callout: "literally him fr fr"
  }
];

export const getNextRank = (currentXP: number): RankConfig | null => {
  return RANKS.find(rank => rank.requiredXP > currentXP) || null;
};

export const getCurrentRank = (currentXP: number): RankConfig => {
  return RANKS.reverse().find(rank => currentXP >= rank.requiredXP) || RANKS[0];
};

export const calculateProgress = (currentXP: number): number => {
  const currentRank = getCurrentRank(currentXP);
  const nextRank = getNextRank(currentXP);
  
  if (!nextRank) return 100;
  
  const xpForNextRank = nextRank.requiredXP - currentRank.requiredXP;
  const xpProgress = currentXP - currentRank.requiredXP;
  
  return Math.min(100, Math.floor((xpProgress / xpForNextRank) * 100));
}; 