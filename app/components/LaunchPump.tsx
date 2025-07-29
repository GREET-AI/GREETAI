'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

const LaunchPump = () => {
  const [coinName, setCoinName] = useState('');
  const [ticker, setTicker] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [telegram, setTelegram] = useState('');
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string>('');
  const coinNameInputRef = useRef<HTMLInputElement>(null);

  const scrollToCoinName = () => {
    coinNameInputRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'banner') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'image') {
          setImagePreviewUrl(e.target?.result as string);
        } else {
          setBannerPreviewUrl(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCoin = async () => {
    setIsLoading(true);
    // TODO: Implement pump.fun coin creation logic
    setTimeout(() => {
      setIsLoading(false);
      alert('Coin creation functionality for pump.fun will be implemented soon!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Hero Section - Pump.fun Style */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="relative overflow-hidden rounded-2xl border border-green-300/20 shadow-2xl">
          {/* Background Image */}
          <Image
            src="/pumpbanner.png"
            alt="Pump.fun Banner"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
          
          <div className="relative px-8 py-16 flex flex-col items-center text-center gap-6">
            {/* Logo and Title - Side by Side */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Image
                  src="/pumplogo.png"
                  alt="Pump.fun Logo"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full"
                />
              </div>
              <div>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                  PUMP.FUN
                </h1>
                <p className="text-xl md:text-2xl text-white/90">
                  The fastest Solana launchpad
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="text-3xl font-bold text-white">10,000+</div>
                <div className="text-base text-white/80">Tokens Launched</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="text-3xl font-bold text-white">$100M+</div>
                <div className="text-base text-white/80">Total Volume</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-base text-white/80">Auto Listing</div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={scrollToCoinName}
                className="px-10 py-4 bg-white text-green-600 font-bold rounded-xl text-lg hover:bg-gray-100 transition-colors"
              >
                🚀 Launch Your Token
              </button>
              <button className="px-10 py-4 bg-green-600 text-white font-bold rounded-xl text-lg hover:bg-green-500 transition-colors">
                📊 View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-3xl font-bold mb-2">⚡ Create a Token</h2>
              <p className="text-gray-400 mb-8">Fill in the token details to launch it on pump.fun</p>

              {/* Token Image Upload */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-4">Token Image (Max 5MB)</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                  {imagePreviewUrl ? (
                    <div className="flex flex-col items-center">
                      <Image
                        src={imagePreviewUrl}
                        alt="Token Preview"
                        width={100}
                        height={100}
                        className="w-24 h-24 rounded-full mb-4"
                      />
                      <p className="text-sm text-gray-400 mb-4">Image uploaded successfully</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">📷</span>
                      </div>
                      <p className="text-gray-400 mb-4">Click to upload or drag and drop</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'image')}
                    className="hidden"
                    id="token-image"
                  />
                  <label
                    htmlFor="token-image"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-green-500 transition-colors"
                  >
                    Choose File
                  </label>
                </div>
              </div>

              {/* Token Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Enter Token Name (max 32 chars)</label>
                <input
                  ref={coinNameInputRef}
                  type="text"
                  value={coinName}
                  onChange={(e) => setCoinName(e.target.value)}
                  placeholder="My Awesome Token"
                  maxLength={32}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                />
                {!coinName && <p className="text-red-500 text-sm mt-1">Token name is required</p>}
              </div>

              {/* Token Symbol */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">$ Enter Symbol (max 10 chars)</label>
                <input
                  type="text"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  placeholder="MAT"
                  maxLength={10}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                />
                {!ticker && <p className="text-red-500 text-sm mt-1">Symbol is required</p>}
              </div>

              {/* Token Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Token Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="The greatest token ever created"
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Optional Fields Toggle */}
              <div className="mb-6">
                <button
                  onClick={() => setShowSocialLinks(!showSocialLinks)}
                  className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-2"
                >
                  {showSocialLinks ? 'Hide options' : 'Show more options'} 
                  <span>{showSocialLinks ? '↑' : '↓'}</span>
                </button>
              </div>

              {/* Optional Fields */}
              {showSocialLinks && (
                <div className="space-y-6 mb-6">
                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Website</label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://mytoken.com"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                    />
                  </div>

                  {/* Telegram URL */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Telegram URL (Optional)</label>
                    <input
                      type="url"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      placeholder="https://t.me/MyToken"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>
              )}

              {/* Banner Upload */}
              <div className="mb-8">
                <button
                  onClick={() => setShowBanner(!showBanner)}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4"
                >
                  <span>add banner (optional)</span>
                  <span>{showBanner ? '^' : 'v'}</span>
                </button>
                
                {showBanner && (
                  <div>
                    <p className="text-gray-400 text-sm mb-4">
                      this will be shown on the coin page in addition to the coin image. images or animated gifs up to 5mb, 3:1 / 1500x500px original. You can only do this when creating the coin, and it cannot be changed later.
                    </p>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                      <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">📷</span>
                      </div>
                      <p className="text-gray-300 mb-4">upload file...</p>
                      <label className="inline-block bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600 transition-colors">
                        select file
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'banner')}
                          className="hidden"
                        />
                      </label>
                    </div>
                    
                    {/* Banner Requirements */}
                    <div className="grid grid-cols-2 gap-6 mt-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">file size and type</h4>
                        <p className="text-gray-400">image - max 4.3mb. &quot;.jpg&quot;, &quot;.gif&quot; or &quot;.png&quot; recommended</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">resolution and aspect ratio</h4>
                        <p className="text-gray-400">3:1 aspect ratio, 1500x500px recommended</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateCoin}
                disabled={isLoading || !coinName || !ticker}
                className="w-full bg-green-600 text-white py-4 px-8 rounded-lg font-bold text-lg hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Creating...' : 'Create Token'}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 sticky top-6">
              <h3 className="text-xl font-bold mb-6">Token Preview</h3>
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
                        className="w-16 h-16 rounded-full border-2 border-green-500/30"
                      />
                    </div>
                  )}
                  
                  <h4 className="text-lg font-medium text-white">{coinName || 'Token Name'}</h4>
                  <p className="text-sm text-gray-400">{ticker || 'TICKER'}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">pump.fun</span>
                    <span className="text-xs text-gray-400">$0</span>
                  </div>
                  {description && (
                    <p className="text-sm text-gray-400 mt-2">{description}</p>
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Platform:</span>
                    <span className="text-white">pump.fun</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network:</span>
                    <span className="text-white">Solana Mainnet</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-green-400">Ready to Launch</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Features:</span>
                    <span className="text-white">Auto Raydium Listing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchPump; 