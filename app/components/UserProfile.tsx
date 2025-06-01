import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface UserProfileProps {
  walletAddress: string;
}

interface SocialLink {
  platform: string;
  username: string;
  url: string;
  icon: string;
}

export default function UserProfile({ walletAddress }: UserProfileProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isTwitterConnected, setIsTwitterConnected] = useState(false);

  useEffect(() => {
    // Fetch user data including Twitter username
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/check?wallet=${walletAddress}`);
        const data = await response.json();
        if (data.twitter) {
          setTwitterUsername(data.twitter);
          
          // Fetch Twitter profile data
          const twitterResponse = await fetch(`/api/user/twitter-profile?username=${data.twitter}`);
          const twitterData = await twitterResponse.json();
          
          if (twitterData.profileImageUrl) {
            setProfileImageUrl(twitterData.profileImageUrl);
          }
          setIsVerified(twitterData.verified);
          
          setSocialLinks(prev => [...prev, {
            platform: 'X',
            username: data.twitter,
            url: `https://x.com/${data.twitter}`,
            icon: '/x-logo.svg'
          }]);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (walletAddress) {
      fetchUserData();
    }
  }, [walletAddress]);

  useEffect(() => {
    // Handle messages from the popup
    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type === 'TWITTER_AUTH_SUCCESS') {
        try {
          const response = await fetch('/api/user/link-twitter', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              walletAddress,
              twitterUsername: event.data.username,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to link Twitter account');
          }

          setIsTwitterConnected(true);
          setTwitterUsername(event.data.username);
          setSocialLinks(prev => [...prev, {
            platform: 'X',
            username: event.data.username,
            url: `https://x.com/${event.data.username}`,
            icon: '/x-logo.svg'
          }]);
          toast.success('Successfully connected X account!');
        } catch (error) {
          console.error('Error linking Twitter:', error);
          toast.error(error instanceof Error ? error.message : 'Failed to link Twitter account');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [walletAddress]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 bg-black/50 border border-green-500/20 rounded-lg px-4 py-2 hover:border-green-500/40 transition-colors"
      >
        {profileImageUrl ? (
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={profileImageUrl}
              alt={twitterUsername || 'Profile'}
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
          {walletAddress.substring(0, 6)}...{walletAddress.substring(-4)}
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
              {profileImageUrl ? (
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={profileImageUrl}
                    alt={twitterUsername || 'Profile'}
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
                <div className="text-green-500 font-mono text-sm">
                  {walletAddress.substring(0, 10)}...
                </div>
                {twitterUsername && (
                  <div className="flex items-center text-green-500/70 text-sm">
                    @{twitterUsername}
                    {isVerified && (
                      <svg className="w-4 h-4 ml-1 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                    )}
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
              
              {!twitterUsername && (
                <button
                  onClick={async () => {
                    try {
                      if (!walletAddress) {
                        toast.error('Wallet address is required');
                        return;
                      }

                      // Open Twitter OAuth in a popup
                      const width = 600;
                      const height = 600;
                      const left = window.screenX + (window.outerWidth - width) / 2;
                      const top = window.screenY + (window.outerHeight - height) / 2;
                      
                      // Encode the wallet address to handle special characters
                      const encodedWallet = encodeURIComponent(walletAddress);
                      const authUrl = `/api/auth/twitter?wallet=${encodedWallet}`;
                      
                      console.log('Opening Twitter auth with URL:', authUrl);
                      
                      const popup = window.open(
                        authUrl,
                        'Connect with X',
                        `width=${width},height=${height},left=${left},top=${top},popup=true`
                      );

                      if (!popup) {
                        toast.error('Popup was blocked. Please allow popups for this site.');
                        return;
                      }
                    } catch (error) {
                      console.error('Error connecting X:', error);
                      toast.error('Failed to connect X account');
                    }
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-black/50 border border-green-500/20 rounded-lg px-4 py-2 hover:border-green-500/40 transition-colors text-green-500"
                >
                  <Image
                    src="/x-logo.svg"
                    alt="X"
                    width={16}
                    height={16}
                    className="invert opacity-70"
                  />
                  <span>Connect X Account</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 