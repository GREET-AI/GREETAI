'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface GreetGhostProps {
  message: string;
  isVisible: boolean;
  onClose?: () => void;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export default function GreetGhost({ 
  message, 
  isVisible, 
  onClose, 
  autoHide = true, 
  autoHideDelay = 5000 
}: GreetGhostProps) {
  const [isTyping, setIsTyping] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState('');

  useEffect(() => {
    if (isVisible && message) {
      setIsTyping(true);
      setDisplayedMessage('');
      
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedMessage(message.slice(0, i + 1));
        i++;
        if (i === message.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [isVisible, message]);

  useEffect(() => {
    if (isVisible && autoHide && !isTyping) {
      const timer = setTimeout(() => {
        onClose?.();
      }, autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHide, autoHideDelay, isTyping, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <div className="relative">
            {/* GREET Avatar */}
            <div className="absolute -top-8 -left-4 z-10">
              <Image 
                src="/GREET.png" 
                alt="GREET Ghost" 
                width={48} 
                height={48} 
                className="w-12 h-12 object-contain animate-float"
              />
            </div>
            
            {/* Chat Bubble */}
            <div className="bg-green-900/90 border-2 border-green-400 rounded-2xl p-4 ml-8 shadow-[0_0_16px_2px_#00FF41] relative">
              {/* GREET Label */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-300 font-bold text-xs font-chippunk" style={{ textShadow: '0 2px 8px #00FF41, 0 4px 16px #00FF41' }}>
                  GREET:
                </span>
                {isTyping && (
                  <span className="inline-block animate-pulse text-green-100">...</span>
                )}
              </div>
              
              {/* Message */}
              <div className="text-green-100 text-sm leading-relaxed font-tech">
                {displayedMessage}
                {isTyping && (
                  <span className="inline-block animate-pulse">|</span>
                )}
              </div>
              
              {/* Arrow pointing to avatar */}
              <div className="absolute -left-2 top-4 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-green-400"></div>
              
              {/* Close button */}
              {onClose && (
                <button
                  onClick={onClose}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 