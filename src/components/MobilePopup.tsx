
import React, { useState, useEffect } from 'react';
import { X, Monitor, Smartphone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const MobilePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if popup has been shown in this session
    const hasShownPopup = sessionStorage.getItem('simulix-mobile-popup-shown');
    
    if (isMobile && !hasShownPopup) {
      // Add a small delay for better UX
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  const closePopup = () => {
    setShowPopup(false);
    // Mark as shown in session storage
    sessionStorage.setItem('simulix-mobile-popup-shown', 'true');
  };

  if (!showPopup || !isMobile) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-fade-in">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={closePopup}
      />
      
      {/* Popup content */}
      <div className="relative glass-panel rounded-2xl p-6 max-w-sm w-full mx-4 animate-scale-in shadow-2xl border-2 border-accent/30">
        {/* Close button */}
        <button
          onClick={closePopup}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent/20 transition-colors duration-200 group"
          aria-label="Close popup"
        >
          <X className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
        </button>

        {/* Header with icon and gradient text */}
        <div className="text-center mb-6 pr-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-accent/30 to-blue-500/30 rounded-2xl flex items-center justify-center">
                <Monitor className="h-8 w-8 text-accent" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-orange-500/40 to-red-500/40 rounded-lg flex items-center justify-center">
                <Smartphone className="h-3 w-3 text-orange-300" />
              </div>
            </div>
          </div>
          
          <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-accent via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Best Viewed on Desktop
          </h2>
        </div>

        {/* Message content */}
        <div className="text-center space-y-4">
          <p className="text-foreground/90 leading-relaxed">
            For the best experience, please open <span className="font-semibold text-accent">Simulix</span> on a desktop or laptop.
          </p>
          
          <div className="glass-panel p-4 rounded-xl border border-accent/20">
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you're on mobile, try rotating your phone to <span className="font-medium text-accent">landscape mode</span> to view all visualizations and plots properly.
            </p>
          </div>

          {/* Action button */}
          <button
            onClick={closePopup}
            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-accent/30 to-blue-500/30 hover:from-accent/40 hover:to-blue-500/40 rounded-xl transition-all duration-300 font-medium text-foreground border border-accent/30 hover:border-accent/40 group"
          >
            <span className="group-hover:scale-105 transition-transform duration-200 inline-block">
              Got it, thanks!
            </span>
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-1 -left-1 w-8 h-8 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-sm"></div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-tl from-blue-500/20 to-transparent rounded-full blur-sm"></div>
      </div>
    </div>
  );
};

export default MobilePopup;
