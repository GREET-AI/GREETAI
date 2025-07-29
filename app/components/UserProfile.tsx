import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import EditProfileModal from './EditProfileModal';
import { RANKS, RankConfig, getCurrentRank, calculateProgress } from '../config/ranks';

interface UserProfileProps {
  walletAddress: string;
}

interface SocialLink {
  platform: string;
  username: string;
  url: string;
  icon: string;
}

interface UserProfileData {
  id: string;
  twitterUsername: string;
  displayName: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  customLinks: any[] | null;
  isProfileComplete: boolean;
  rank: string;
  xp: number;
  achievements: any[] | null;
}

export default function UserProfile({ walletAddress }: UserProfileProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // Fetch user profile data
    const fetchUserData = async () => {
      try {
        // Fetch profile data
        const profileResponse = await fetch(`/api/user/profile?wallet=${walletAddress}`);
        const profileData = await profileResponse.json();
        
        if (profileResponse.ok) {
          setProfileData(profileData);
          
          // If we have a Twitter username, fetch additional Twitter data
          if (profileData.twitterUsername) {
            const twitterResponse = await fetch(`/api/user/twitter-profile?username=${profileData.twitterUsername}`);
            const twitterData = await twitterResponse.json();
            
            if (twitterResponse.ok) {
              setIsVerified(twitterData.verified);
            }
          }

          // Set up social links
          const links: SocialLink[] = [];
          
          // Add Twitter/X link if available
          if (profileData.twitterUsername) {
            links.push({
              platform: 'X',
              username: profileData.twitterUsername,
              url: `https://x.com/${profileData.twitterUsername}`,
              icon: '/x-logo.svg'
            });
          }

          // Add custom links if available
          if (profileData.customLinks) {
            profileData.customLinks.forEach((link: any) => {
              links.push({
                platform: link.platform,
                username: link.url.split('/').pop() || link.url,
                url: link.url,
                icon: `/${link.platform.toLowerCase()}-logo.svg`
              });
            });
          }

          setSocialLinks(links);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile data');
      }
    };

    if (walletAddress) {
      fetchUserData();
    }
  }, [walletAddress]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 bg-black/50 border border-green-500/20 rounded-lg px-4 py-2 hover:border-green-500/40 transition-colors"
      >
        {profileData?.profileImageUrl ? (
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={profileData.profileImageUrl}
              alt={profileData.displayName || profileData.twitterUsername || 'Profile'}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <span className="text-green-500 font-mono text-sm">
              {walletAddress.substring(0, 2)}
            </span>
          </div>
        )}
        <span className="text-green-500 font-mono text-sm">
          {profileData?.displayName || walletAddress.substring(0, 6)}...{walletAddress.substring(-4)}
        </span>
        <svg
          className={`w-4 h-4 text-green-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full right-0 mt-2 w-64 bg-black border border-green-500/20 rounded-lg shadow-xl z-50"
        >
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              {profileData?.profileImageUrl ? (
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={profileData.profileImageUrl}
                    alt={profileData.displayName || profileData.twitterUsername || 'Profile'}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-500 font-mono">
                    {walletAddress.substring(0, 2)}
                  </span>
                </div>
              )}
              <div>
                <div className="text-green-500 font-medium">
                  {profileData?.displayName || profileData?.twitterUsername || walletAddress.substring(0, 10)}...
                </div>
                {profileData?.rank && (
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-base">{RANKS.find(r => r.title === profileData.rank)?.emoji}</span>
                    <span style={{ color: RANKS.find(r => r.title === profileData.rank)?.color }}>
                      {profileData.rank}
                    </span>
                  </div>
                )}
                {profileData?.twitterUsername && (
                  <div className="flex items-center text-green-500/70 text-sm">
                    @{profileData.twitterUsername}
                    {isVerified && (
                      <svg className="w-4 h-4 ml-1 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                    )}
                  </div>
                )}
                {profileData?.bio && (
                  <p className="text-green-500/70 text-sm mt-2">
                    {profileData.bio}
                  </p>
                )}
                {profileData?.rank && profileData.rank !== 'Founder' && (
                  <div className="mt-2">
                    <div className="text-xs text-green-500/70 mb-1">
                      {RANKS.find(r => r.title === profileData.rank)?.callout}
                    </div>
                    <div className="w-full h-1 bg-green-500/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${calculateProgress(profileData.xp)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-green-500/70 hover:text-green-500 transition-colors"
                >
                  <Image
                    src={link.icon}
                    alt={link.platform}
                    width={16}
                    height={16}
                    className="invert opacity-70"
                  />
                  <span>@{link.username}</span>
                </a>
              ))}

              <button
                onClick={() => setShowEditModal(true)}
                className="w-full mt-4 flex items-center justify-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2 hover:bg-green-500/20 transition-colors text-green-500"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {showEditModal && profileData && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          walletAddress={walletAddress}
          currentProfile={profileData}
        />
      )}
    </div>
  );
} 