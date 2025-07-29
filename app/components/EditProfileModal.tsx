'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
  currentProfile: {
    displayName: string | null;
    bio: string | null;
    twitterUsername: string;
    customLinks: any[] | null;
  };
}

export default function EditProfileModal({ isOpen, onClose, walletAddress, currentProfile }: EditProfileModalProps) {
  const [displayName, setDisplayName] = useState(currentProfile.displayName || '');
  const [bio, setBio] = useState(currentProfile.bio || '');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const customLinks = [];
    if (instagram) {
      customLinks.push({
        platform: 'Instagram',
        url: instagram.startsWith('https://') ? instagram : `https://instagram.com/${instagram.replace('@', '')}`
      });
    }
    if (tiktok) {
      customLinks.push({
        platform: 'TikTok',
        url: tiktok.startsWith('https://') ? tiktok : `https://tiktok.com/@${tiktok.replace('@', '')}`
      });
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: walletAddress,
          displayName,
          bio,
          customLinks
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success('Profile updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-black border border-green-500 p-6 rounded-lg w-[480px] max-w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-chippunk text-green-500">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-green-500 hover:text-green-400 text-xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-green-500 text-sm mb-2">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter display name"
              className="w-full bg-black/50 border border-green-500/20 rounded p-2 text-green-500"
            />
          </div>

          <div>
            <label className="block text-green-500 text-sm mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              className="w-full bg-black/50 border border-green-500/20 rounded p-2 text-green-500 h-24 resize-none"
            />
          </div>

          <div className="border-t border-green-500/20 pt-4">
            <h3 className="text-green-500 font-medium mb-4">Social Links</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-green-500 text-sm mb-2">Instagram</label>
                <div className="relative">
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@username or profile URL"
                    className="w-full bg-black/50 border border-green-500/20 rounded p-2 pl-8 text-green-500"
                  />
                  <Image
                    src="/instagram-logo.svg"
                    alt="Instagram"
                    width={16}
                    height={16}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-70"
                  />
                </div>
              </div>

              <div>
                <label className="block text-green-500 text-sm mb-2">TikTok</label>
                <div className="relative">
                  <input
                    type="text"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    placeholder="@username or profile URL"
                    className="w-full bg-black/50 border border-green-500/20 rounded p-2 pl-8 text-green-500"
                  />
                  <Image
                    src="/tiktok-logo.svg"
                    alt="TikTok"
                    width={16}
                    height={16}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-70"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-green-500 text-green-500 rounded hover:bg-green-500/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-green-500 text-black rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 