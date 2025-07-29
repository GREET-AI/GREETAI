import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function LaunchToken() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenImage, setTokenImage] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [selectedSupply, setSelectedSupply] = useState<string>('1B');
  const [customSupply, setCustomSupply] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  // Ref for smooth scrolling
  const tokenNameInputRef = useRef<HTMLInputElement>(null);
  
  // Scroll to token name input
  const scrollToTokenName = () => {
    tokenNameInputRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  };
  
  // Calculate decimals based on token supply
  const calculateDecimals = (supply: string): number => {
    if (supply.includes('T')) return 9; // Trillion
    if (supply.includes('B')) return 6; // Billion
    if (supply.includes('M')) return 6; // Million
    if (supply.includes('K')) return 3; // Thousand
    return 6; // Default
  };
  
  // Handle supply selection
  const handleSupplySelect = (supply: string) => {
    if (supply === 'Custom') {
      setShowCustomInput(true);
      setSelectedSupply('Custom');
    } else {
      setShowCustomInput(false);
      setSelectedSupply(supply);
      setCustomSupply('');
    }
  };
  
  // Get current decimals
  const currentDecimals = showCustomInput ? 6 : calculateDecimals(selectedSupply);
  
  // Update image preview when file is selected
  useEffect(() => {
    if (tokenImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(tokenImage);
    } else {
      setImagePreviewUrl('');
    }
  }, [tokenImage]);

  const handleLaunch = async () => {
    if (!publicKey || !tokenImage) {
      toast.error('Please connect your wallet and select a token image');
      return;
    }
    
    if (!tokenName || !tokenSymbol) {
      toast.error('Please fill in token name and symbol');
      return;
    }
    
    setIsLoading(true);
    
    try {
      toast.loading('Launching token on LetsBonk.fun...');

      // Upload image to IPFS first
      const formData = new FormData();
      formData.append('file', tokenImage);
      
      const ipfsResponse = await fetch('/api/ipfs', {
        method: 'POST',
        body: formData
      });
      
      let imageUrl = '';
      if (ipfsResponse.ok) {
        const ipfsData = await ipfsResponse.json();
        imageUrl = ipfsData.url || '';
      }

      // Launch token on LetsBonk
      const launchResponse = await fetch('/api/letsbonk/launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenName,
          tokenSymbol,
          description,
          website,
          telegram,
          imageUrl,
          walletAddress: publicKey.toString()
        })
      });

      const launchData = await launchResponse.json();

      if (launchData.success) {
        toast.success('Token launched successfully! 🚀', {
          description: launchData.message,
          action: {
            label: 'View on LetsBonk',
            onClick: () => window.open('https://letsbonk.fun', '_blank')
          }
        });

        // Reset form
        setTokenName('');
        setTokenSymbol('');
        setDescription('');
        setWebsite('');
        setTelegram('');
        setTokenImage(null);
        setImagePreviewUrl('');
      } else {
        toast.error('Failed to launch token', {
          description: launchData.error || 'Unknown error occurred'
        });
      }

    } catch (error) {
      console.error("Launch failed:", error);
      toast.error('Failed to launch token', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section - Unified Design */}
      <div className="relative mb-8">
        <div className="relative overflow-hidden rounded-2xl border border-orange-300/20 shadow-2xl">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image 
              src="/BANNERS.png" 
              alt="Background" 
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
          
          {/* Content */}
          <div className="relative z-10 px-8 py-16 text-center">
            <div className="max-w-4xl mx-auto">
              {/* Logo and Title */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl p-3">
                  <Image 
                    src="/letsbonk.png" 
                    alt="LetsBonk" 
                    width={56} 
                    height={56} 
                    className="w-14 h-14"
                  />
                </div>
                <div>
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-3">LETSBONK</h1>
                  <p className="text-orange-100 text-xl md:text-2xl">The most degen Solana launchpad</p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 hover:bg-white/25 transition-all duration-300 transform hover:scale-105 border border-white/10">
                  <div className="text-3xl font-bold text-white mb-2">1,000+</div>
                  <div className="text-orange-100 text-base">Tokens Launched</div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 hover:bg-white/25 transition-all duration-300 transform hover:scale-105 border border-white/10">
                  <div className="text-3xl font-bold text-white mb-2">$50M+</div>
                  <div className="text-orange-100 text-base">Total Volume</div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 hover:bg-white/25 transition-all duration-300 transform hover:scale-105 border border-white/10">
                  <div className="text-3xl font-bold text-white mb-2">24/7</div>
                  <div className="text-orange-100 text-base">Auto Listing</div>
                </div>
              </div>
              
              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button 
                  onClick={scrollToTokenName}
                  className="bg-white text-orange-500 px-10 py-4 rounded-xl font-bold hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 shadow-xl text-lg"
                >
                  🚀 Launch Your Token
                </button>
                <button className="bg-orange-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-xl text-lg">
                  📊 View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="bg-[#0a0a0a] border border-orange-500/20 rounded-lg overflow-hidden backdrop-blur-sm">
            <div className="border-b border-orange-500/20 p-6">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h2 className="text-xl font-medium text-orange-400">Create a Token</h2>
              </div>
              <p className="mt-2 text-sm text-gray-400">Fill in the token details to launch it on LetsBonk.fun (Launch on Bonk)</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Token Image */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Token Image (Max 5MB)</label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-orange-500/50 transition-colors">
                  {imagePreviewUrl ? (
                    <div className="space-y-2">
                      <Image src={imagePreviewUrl} alt="Preview" width={64} height={64} className="w-16 h-16 mx-auto rounded-full" />
                      <p className="text-sm text-gray-400">{tokenImage?.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-16 h-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-400">Click to upload token image</p>
                    </div>
                  )}
                  <label className="mt-4 inline-block bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-600 transition-colors">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setTokenImage(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Token Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Enter Token Name (max 32 chars)</label>
                  <input
                    ref={tokenNameInputRef}
                    type="text"
                    placeholder="My Awesome Token"
                    maxLength={32}
                    className="w-full bg-black/50 border border-gray-800 rounded p-2 text-white focus:border-orange-500 focus:outline-none"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                  />
                  {!tokenName && <p className="text-red-500 text-xs mt-1">Token name is required</p>}
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">$ Enter Symbol (max 10 chars)</label>
                  <input
                    type="text"
                    placeholder="MAT"
                    maxLength={10}
                    className="w-full bg-black/50 border border-gray-800 rounded p-2 text-white focus:border-orange-500 focus:outline-none"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value)}
                  />
                  {!tokenSymbol && <p className="text-red-500 text-xs mt-1">Symbol is required</p>}
                </div>
              </div>

              {/* Token Description */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Token Description</label>
                <div className="relative">
                  <textarea
                    placeholder="The greatest token ever created"
                    rows={3}
                    className="w-full bg-black/50 border border-gray-800 rounded p-2 text-white focus:border-orange-500 focus:outline-none resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div className="absolute top-2 left-2">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Show more options */}
              <div>
                <button 
                  onClick={() => setShowOptions(!showOptions)}
                  className="text-orange-400 text-sm hover:text-orange-300 transition-colors"
                >
                  {showOptions ? 'Hide options ↑' : 'Show more options ↓'}
                </button>
              </div>

              {/* Optional Fields */}
              {showOptions && (
                <div className="space-y-4">
                  {/* Website */}
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Website</label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://mytoken.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full bg-black/50 border border-gray-800 rounded p-2 pl-8 text-white focus:border-orange-500 focus:outline-none"
                      />
                      <div className="absolute top-2 left-2">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Twitter URL */}
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Twitter URL (Optional)</label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://x.com/MyToken"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        className="w-full bg-black/50 border border-gray-800 rounded p-2 pl-8 text-white focus:border-orange-500 focus:outline-none"
                      />
                      <div className="absolute top-2 left-2">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Telegram URL */}
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Telegram URL (Optional)</label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://t.me/MyToken"
                        value={telegram}
                        onChange={(e) => setTelegram(e.target.value)}
                        className="w-full bg-black/50 border border-gray-800 rounded p-2 pl-8 text-white focus:border-orange-500 focus:outline-none"
                      />
                      <div className="absolute top-2 left-2">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Platform Selection */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Platform</label>
                <select className="w-full bg-black/50 border border-gray-800 rounded p-2 text-white focus:border-orange-500 focus:outline-none">
                  <option value="letsbonk-memes">Letsbonk memes</option>
                  <option value="letsbonk-tech">Letsbonk tech</option>
                </select>
              </div>

              {/* Decimals */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Decimals</label>
                <input
                  type="number"
                  value={currentDecimals}
                  className="w-full bg-black/50 border border-gray-800 rounded p-2 text-white focus:border-orange-500 focus:outline-none"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-calculated based on token supply
                </p>
              </div>

              {/* Total Token Supply */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Total Token Supply</label>
                <div className="grid grid-cols-3 gap-2">
                  {['69M', '420M', '1B', '69B', '420B', '1T'].map((supply) => (
                    <button
                      key={supply}
                      onClick={() => handleSupplySelect(supply)}
                      className={`px-3 py-2 rounded transition-colors ${
                        selectedSupply === supply 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                      }`}
                    >
                      {supply}
                    </button>
                  ))}
                  <button 
                    onClick={() => handleSupplySelect('Custom')}
                    className={`px-3 py-2 rounded transition-colors ${
                      selectedSupply === 'Custom' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-green-600 text-white hover:bg-green-500'
                    }`}
                  >
                    Custom
                  </button>
                </div>
                
                {/* Custom Supply Input */}
                {showCustomInput && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Enter custom supply (e.g., 1000000)"
                      value={customSupply}
                      onChange={(e) => setCustomSupply(e.target.value)}
                      className="w-full bg-black/50 border border-gray-800 rounded p-2 text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Buy Amount (Optional) */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Buy Amount (Optional)</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full bg-black/50 border border-gray-800 rounded p-2 pr-12 text-white focus:border-orange-500 focus:outline-none"
                  />
                  <span className="absolute right-2 top-2 text-gray-400 text-sm">SOL</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Must be less than Token Amount to protect against snipers.</p>
                <p className="text-xs text-gray-400">≈ 0 {tokenSymbol || 'tokens'}</p>
              </div>

              {/* Slippage */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Slippage (%)</label>
                <input
                  type="number"
                  placeholder="0.5"
                  step="0.1"
                  className="w-full bg-black/50 border border-gray-800 rounded p-2 text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="bg-black/20 px-6 py-4 border-t border-orange-500/20">
              <div className="flex gap-3">
                <button className="flex-1 bg-gray-600 text-white py-2.5 px-4 rounded-md font-medium hover:bg-gray-500 transition-colors">
                  Cancel
                </button>
                <button className="flex-1 bg-gray-600 text-white py-2.5 px-4 rounded-md font-medium hover:bg-gray-500 transition-colors">
                  Back
                </button>
                <button
                  onClick={handleLaunch}
                  disabled={isLoading || !tokenName || !tokenSymbol || !tokenImage}
                  className="flex-1 bg-orange-500 text-white py-2.5 px-4 rounded-md font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors relative"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Token...
                    </span>
                  ) : (
                    'Create Token'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="w-80">
          <div className="bg-[#0a0a0a] border border-orange-500/20 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-lg font-medium text-white mb-4">Token Preview</h3>
            
            <div className="space-y-4">
              <div>
                {/* Token Image in Preview */}
                {imagePreviewUrl && (
                  <div className="mb-4 flex justify-center">
                    <Image 
                      src={imagePreviewUrl} 
                      alt="Token Preview" 
                      width={64} 
                      height={64} 
                      className="w-16 h-16 rounded-full border-2 border-orange-500/30"
                    />
                  </div>
                )}
                
                <h4 className="text-lg font-medium text-white">{tokenName || 'Token Name'}</h4>
                <p className="text-sm text-gray-400">{tokenSymbol || 'TICKER'}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">LetsBonk.fun</span>
                  <span className="text-xs text-gray-400">$0</span>
                </div>
                {description && (
                  <p className="text-sm text-gray-400 mt-2">{description}</p>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  <p>Supply: {showCustomInput ? customSupply || 'Custom' : selectedSupply}</p>
                  <p>Decimals: {currentDecimals}</p>
                </div>
              </div>

              {/* Social Links */}
              {(website || telegram) && (
                <div className="flex gap-2">
                  {website && (
                    <a href={website} target="_blank" rel="noopener noreferrer" className="p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
                      <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </a>
                  )}
                  {telegram && (
                    <a href={telegram} target="_blank" rel="noopener noreferrer" className="p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
                      <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </a>
                  )}
                </div>
              )}

              <div className="text-xs text-gray-500">
                <p>Platform: LetsBonk.fun</p>
                <p>Network: Solana Mainnet</p>
                <p>Status: Ready to Launch</p>
                <p>Features: Auto Raydium Listing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 