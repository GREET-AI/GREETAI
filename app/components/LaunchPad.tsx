'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

type Platform = 'pump' | 'letsbonk';

const LaunchPad = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('pump');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string>('');
  const [showBanner, setShowBanner] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState<string>('1B');
  const [customSupply, setCustomSupply] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [timeUntilLaunch, setTimeUntilLaunch] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const tokenNameInputRef = useRef<HTMLInputElement>(null);

  // Countdown Timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const launchDate = new Date('2025-01-15T00:00:00Z').getTime(); // Set your launch date
      const distance = launchDate - now;

      if (distance > 0) {
        setTimeUntilLaunch({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const calculateDecimals = (supply: string): number => {
    if (supply.includes('T')) return 9;
    if (supply.includes('B')) return 6;
    if (supply.includes('M')) return 6;
    if (supply.includes('K')) return 3;
    return 6;
  };

  const handleSupplySelect = (supply: string) => {
    setSelectedSupply(supply);
    if (supply === 'Custom') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setCustomSupply('');
    }
  };

  const scrollToTokenName = () => {
    tokenNameInputRef.current?.scrollIntoView({
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

  const handleLaunchToken = async () => {
    if (!tokenName || !tokenSymbol) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Get actual user ID from authentication
      const userId = 'temp-user-id'; // This should come from your auth system
      
      const tokenData = {
        userId,
        name: tokenName,
        symbol: tokenSymbol,
        description,
        imageUrl: imagePreviewUrl,
        bannerUrl: bannerPreviewUrl,
        platform: selectedPlatform === 'pump' ? 'PUMP_FUN' : 'LETSBONK',
        website,
        twitterUrl: twitter,
        telegramUrl: telegram,
        totalSupply: selectedPlatform === 'letsbonk' ? (showCustomInput ? customSupply : selectedSupply) : undefined,
        decimals: selectedPlatform === 'letsbonk' ? currentDecimals : undefined
      };

      const response = await fetch('/api/tokens/launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tokenData),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Token "${tokenName}" ($${tokenSymbol}) has been launched successfully on ${selectedPlatform === 'pump' ? 'pump.fun' : 'LetsBonk.fun'}!`);
        
        // Reset form
        setTokenName('');
        setTokenSymbol('');
        setDescription('');
        setImagePreviewUrl('');
        setBannerPreviewUrl('');
        setWebsite('');
        setTwitter('');
        setTelegram('');
        setShowOptions(false);
        setShowBanner(false);
        if (selectedPlatform === 'letsbonk') {
          setSelectedSupply('1B');
          setCustomSupply('');
          setShowCustomInput(false);
        }
      } else {
        alert(`Failed to launch token: ${result.error}`);
      }
    } catch (error) {
      console.error('Launch error:', error);
      alert('Failed to launch token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentDecimals = showCustomInput ? calculateDecimals(customSupply) : calculateDecimals(selectedSupply);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">


      {/* Platform Selector */}
      <div className="max-w-7xl mx-auto mb-8">
         <div className="bg-gradient-to-r from-green-500/20 to-purple-500/20 border border-green-500/30 rounded-xl p-6 text-center">
           <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                 <Image
                   src="/GREET.png"
                   alt="GREET"
                   width={48}
                   height={48}
                   className="w-10 h-10"
                 />
               </div>
             <h1 className="text-4xl font-bold text-white font-chippunk" style={{ textShadow: '0 2px 8px #00FF41, 0 4px 16px #00FF41' }}>
               Launch Your Token on GREET
             </h1>
           </div>
           <p className="text-green-400 text-lg mb-6">Choose your preferred launchpad platform</p>
           
           <div className="flex gap-4 justify-center">
             <button
               onClick={() => setSelectedPlatform('pump')}
               className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${
                 selectedPlatform === 'pump'
                   ? 'bg-green-500 text-white shadow-lg'
                   : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
               }`}
             >
               <Image
                 src="/pumplogo.png"
                 alt="Pump.fun"
                 width={32}
                 height={32}
                 className="w-8 h-8 rounded-full"
               />
               <span className="font-semibold">Pump.fun</span>
             </button>
             <button
               onClick={() => setSelectedPlatform('letsbonk')}
               className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${
                 selectedPlatform === 'letsbonk'
                   ? 'bg-orange-500 text-white shadow-lg'
                   : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
               }`}
             >
               <Image
                 src="/letsbonk.png"
                 alt="LetsBonk"
                 width={32}
                 height={32}
                 className="w-8 h-8 rounded-full"
               />
               <span className="font-semibold">LetsBonk.fun</span>
             </button>
           </div>
         </div>
       </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-8">
        {selectedPlatform === 'pump' ? (
          // Pump.fun Hero
          <div className="relative overflow-hidden rounded-2xl border border-green-300/20 shadow-2xl">
            <Image
              src="/pumpbanner.png"
              alt="Pump.fun Banner"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30"></div>
            
            <div className="relative px-8 py-16 flex flex-col items-center text-center gap-6">
                                           <div className="flex items-center gap-4">
                <Image
                  src="/pumplogo.png"
                  alt="Pump.fun Logo"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                    PUMP.FUN
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90">
                    The fastest Solana launchpad
                  </p>
                </div>
              </div>
              
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
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={scrollToTokenName}
                  className="px-10 py-4 bg-white text-green-600 font-bold rounded-xl text-lg hover:bg-gray-100 transition-colors"
                >
                  🚀 Launch Your Token
                </button>
                <a 
                  href="https://pump.fun" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-10 py-4 bg-green-600 text-white font-bold rounded-xl text-lg hover:bg-green-500 transition-colors inline-flex items-center justify-center"
                >
                  🌐 Visit pump.fun
                </a>
              </div>
            </div>
          </div>
        ) : (
          // LetsBonk Hero
          <div className="relative overflow-hidden rounded-2xl border border-orange-300/20 shadow-2xl">
            <Image
              src="/BANNERS.png"
              alt="LetsBonk Banner"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30"></div>
            
            <div className="relative px-8 py-16 flex flex-col items-center text-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Image
                    src="/letsbonk.png"
                    alt="LetsBonk Logo"
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full"
                  />
                </div>
                <div>
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                    LETSBONK
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90">
                    The most degen Solana launchpad
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="text-3xl font-bold text-white">1,000+</div>
                  <div className="text-base text-white/80">Tokens Launched</div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="text-3xl font-bold text-white">$50M+</div>
                  <div className="text-base text-white/80">Total Volume</div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-base text-white/80">Auto Listing</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={scrollToTokenName}
                  className="px-10 py-4 bg-white text-orange-500 font-bold rounded-xl text-lg hover:bg-gray-100 transition-colors"
                >
                  🚀 Launch Your Token
                </button>
                <a 
                  href="https://letsbonk.fun" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-10 py-4 bg-orange-600 text-white font-bold rounded-xl text-lg hover:bg-orange-500 transition-colors inline-flex items-center justify-center"
                >
                  🌐 Visit letsbonk.fun
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content - Blurred and Disabled */}
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 blur-sm pointer-events-none opacity-50">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className={`rounded-2xl p-8 border ${
              selectedPlatform === 'pump' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-[#0a0a0a] border-orange-500/20'
            }`}>
              <h2 className="text-3xl font-bold mb-2">
                ⚡ Create a Token
              </h2>
              <p className="text-gray-400 mb-8">
                Fill in the token details to launch it on {selectedPlatform === 'pump' ? 'pump.fun' : 'LetsBonk.fun'}
              </p>

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
                    className={`px-6 py-3 rounded-lg cursor-pointer transition-colors ${
                      selectedPlatform === 'pump'
                        ? 'bg-green-600 text-white hover:bg-green-500'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    Choose File
                  </label>
                </div>
              </div>

              {/* Token Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Enter Token Name (max 32 chars)</label>
                <input
                  ref={tokenNameInputRef}
                  type="text"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  placeholder="My Awesome Token"
                  maxLength={32}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                />
                {!tokenName && <p className="text-red-500 text-sm mt-1">Token name is required</p>}
              </div>

              {/* Token Symbol */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">$ Enter Symbol (max 10 chars)</label>
                <input
                  type="text"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                  placeholder="MAT"
                  maxLength={10}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                />
                {!tokenSymbol && <p className="text-red-500 text-sm mt-1">Symbol is required</p>}
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
                  onClick={() => setShowOptions(!showOptions)}
                  className={`transition-colors flex items-center gap-2 ${
                    selectedPlatform === 'pump'
                      ? 'text-green-400 hover:text-green-300'
                      : 'text-orange-400 hover:text-orange-300'
                  }`}
                >
                  {showOptions ? 'Hide options' : 'Show more options'} 
                  <span>{showOptions ? '↑' : '↓'}</span>
                </button>
              </div>

                             {/* Optional Fields */}
               {showOptions && (
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

                   {/* Twitter URL */}
                   <div>
                     <label className="block text-sm font-medium mb-2">Twitter URL (Optional)</label>
                     <input
                       type="url"
                       value={twitter}
                       onChange={(e) => setTwitter(e.target.value)}
                       placeholder="https://x.com/MyToken"
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

               {/* Banner Upload (Pump.fun only) */}
               {selectedPlatform === 'pump' && (
                 <div className="mb-8">
                   <div className="flex items-center justify-between mb-4">
                     <label className="block text-sm font-medium">Add Banner (Optional)</label>
                     <button
                       onClick={() => setShowBanner(!showBanner)}
                       className={`text-sm transition-colors ${
                         selectedPlatform === 'pump'
                           ? 'text-green-400 hover:text-green-300'
                           : 'text-orange-400 hover:text-orange-300'
                       }`}
                     >
                       {showBanner ? 'Hide banner' : 'Add banner'}
                     </button>
                   </div>
                   
                   {showBanner && (
                     <div>
                       <p className="text-sm text-gray-400 mb-4">
                         This banner will be shown on the coin page. Supports images or animated GIFs up to 5MB. 
                         Recommended: 3:1 aspect ratio (1500x500px).
                       </p>
                       <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                         {bannerPreviewUrl ? (
                           <div className="flex flex-col items-center">
                             <Image
                               src={bannerPreviewUrl}
                               alt="Banner Preview"
                               width={300}
                               height={100}
                               className="w-full max-w-md h-32 object-cover rounded-lg mb-4"
                             />
                             <p className="text-sm text-gray-400 mb-4">Banner uploaded successfully</p>
                           </div>
                         ) : (
                           <div className="flex flex-col items-center">
                             <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                               <span className="text-2xl">🖼️</span>
                             </div>
                             <p className="text-gray-400 mb-4">upload file...</p>
                           </div>
                         )}
                         <input
                           type="file"
                           accept="image/*"
                           onChange={(e) => handleImageUpload(e, 'banner')}
                           className="hidden"
                           id="banner-upload"
                         />
                         <label
                           htmlFor="banner-upload"
                           className={`px-6 py-3 rounded-lg cursor-pointer transition-colors ${
                             selectedPlatform === 'pump'
                               ? 'bg-green-600 text-white hover:bg-green-500'
                               : 'bg-orange-500 text-white hover:bg-orange-600'
                           }`}
                         >
                           select file
                         </label>
                       </div>
                       
                       {/* File Requirements */}
                       <div className="grid grid-cols-2 gap-6 mt-4 text-sm">
                         <div>
                           <h4 className="font-medium mb-2">file size and type</h4>
                           <p className="text-gray-400">image - max 5mb. &quot;.jpg&quot;, &quot;.gif&quot; or &quot;.png&quot; recommended</p>
                         </div>
                         <div>
                           <h4 className="font-medium mb-2">resolution and aspect ratio</h4>
                           <p className="text-gray-400">image - 3:1 aspect ratio (1500x500px) recommended</p>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
               )}

              {/* Total Token Supply (LetsBonk only) */}
              {selectedPlatform === 'letsbonk' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-4">Total Token Supply</label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {['69M', '420M', '1B', '69B', '420B', '1T'].map((supply) => (
                      <button
                        key={supply}
                        onClick={() => handleSupplySelect(supply)}
                        className={`px-3 py-2 rounded transition-colors ${
                          selectedSupply === supply
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
                  
                  {showCustomInput && (
                    <input
                      type="text"
                      value={customSupply}
                      onChange={(e) => setCustomSupply(e.target.value)}
                      placeholder="Enter custom supply (e.g., 1000000)"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 mb-4"
                    />
                  )}
                </div>
              )}

              {/* Decimals (LetsBonk only) */}
              {selectedPlatform === 'letsbonk' && (
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-2">Decimals</label>
                  <input
                    type="number"
                    value={currentDecimals}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none"
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Decimals are automatically set based on your selected supply.
                  </p>
                </div>
              )}

              {/* Launch Button */}
              <button
                onClick={handleLaunchToken}
                disabled={isLoading || !tokenName || !tokenSymbol}
                className={`w-full py-4 px-8 rounded-lg font-bold text-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors ${
                  selectedPlatform === 'pump'
                    ? 'bg-green-600 text-white hover:bg-green-500'
                    : 'bg-orange-600 text-white hover:bg-orange-500'
                }`}
              >
                {isLoading ? 'Launching...' : 'Launch Token'}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl p-6 border sticky top-6 ${
              selectedPlatform === 'pump' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-[#0a0a0a] border-orange-500/20'
            }`}>
              <h3 className="text-xl font-bold mb-6">Token Preview</h3>
              <div className="space-y-4">
                                 <div>
                   {/* Banner Preview (Pump.fun only) */}
                   {selectedPlatform === 'pump' && bannerPreviewUrl && (
                     <div className="mb-4">
                       <Image
                         src={bannerPreviewUrl}
                         alt="Banner Preview"
                         width={300}
                         height={100}
                         className="w-full h-20 object-cover rounded-lg"
                       />
                     </div>
                   )}
                   
                   {/* Token Image in Preview */}
                   {imagePreviewUrl && (
                     <div className="mb-4 flex justify-center">
                       <Image 
                         src={imagePreviewUrl} 
                         alt="Token Preview" 
                         width={64} 
                         height={64} 
                         className={`w-16 h-16 rounded-full border-2 ${
                           selectedPlatform === 'pump'
                             ? 'border-green-500/30'
                             : 'border-orange-500/30'
                         }`}
                       />
                     </div>
                   )}
                   
                   <h4 className="text-lg font-medium text-white">{tokenName || 'Token Name'}</h4>
                   <p className="text-sm text-gray-400">{tokenSymbol || 'TICKER'}</p>
                   <div className="flex items-center gap-2">
                     <span className="text-xs text-gray-500">
                       {selectedPlatform === 'pump' ? 'pump.fun' : 'LetsBonk.fun'}
                     </span>
                     <span className="text-xs text-gray-400">$0</span>
                   </div>
                   {description && (
                     <p className="text-sm text-gray-400 mt-2">{description}</p>
                   )}
                   {selectedPlatform === 'letsbonk' && (
                     <div className="text-xs text-gray-500 mt-2">
                       <p>Supply: {showCustomInput ? customSupply || 'Custom' : selectedSupply}</p>
                       <p>Decimals: {currentDecimals}</p>
                     </div>
                   )}
                 </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Platform:</span>
                    <span className="text-white">
                      {selectedPlatform === 'pump' ? 'pump.fun' : 'LetsBonk.fun'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network:</span>
                    <span className="text-white">Solana Mainnet</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={`${
                      selectedPlatform === 'pump' ? 'text-green-400' : 'text-orange-400'
                    }`}>
                      Ready to Launch
                    </span>
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
        
        {/* Hero Section Overlay with Countdown */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-gradient-to-r from-green-500/20 to-purple-500/20 border border-green-500/30 rounded-xl p-8 text-center max-w-2xl backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-4xl font-bold text-white font-chippunk" style={{ textShadow: '0 2px 8px #00FF41, 0 4px 16px #00FF41' }}>
                🚀 GREET LAUNCHPAD 👻
              </h1>
            </div>
            <p className="text-green-400 text-lg mb-4">The most degen Solana launchpad is coming...</p>
            
            <div className="flex justify-center gap-4 mb-6">
              <div className="bg-black/50 rounded-lg p-3 min-w-[80px]">
                <div className="text-2xl font-bold text-green-400">{timeUntilLaunch.days}</div>
                <div className="text-xs text-gray-400">DAYS</div>
              </div>
              <div className="bg-black/50 rounded-lg p-3 min-w-[80px]">
                <div className="text-2xl font-bold text-green-400">{timeUntilLaunch.hours}</div>
                <div className="text-xs text-gray-400">HOURS</div>
              </div>
              <div className="bg-black/50 rounded-lg p-3 min-w-[80px]">
                <div className="text-2xl font-bold text-green-400">{timeUntilLaunch.minutes}</div>
                <div className="text-xs text-gray-400">MINUTES</div>
              </div>
              <div className="bg-black/50 rounded-lg p-3 min-w-[80px]">
                <div className="text-2xl font-bold text-green-400">{timeUntilLaunch.seconds}</div>
                <div className="text-xs text-gray-400">SECONDS</div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Coming Soon!</h3>
              <p className="text-gray-300 mb-4">
                Token creation will be available when GREET Launchpad goes live. 
                Complete quests to earn $GREET tokens in the meantime!
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <button 
                onClick={() => {
                  // Navigate to GREET section by reloading and setting active section
                  localStorage.setItem('greetActiveSection', 'send');
                  window.location.href = '/';
                }}
                className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-colors"
              >
                PRE-EARN
              </button>
              <span>•</span>
              <span>Earn $GREET tokens now!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchPad; 