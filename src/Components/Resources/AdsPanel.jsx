// AdPanel.jsx - Complete AdSense component with all functionality merged
import React, { useEffect, useRef, useState } from 'react';

const AdPanel = ({ 
  adClient = "ca-pub-YOUR_ACTUAL_PUBLISHER_ID", 
  adSlots = ["YOUR_ACTUAL_AD_SLOT_ID_1", "YOUR_ACTUAL_AD_SLOT_ID_2"], // Array of ad slots
  isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost'
}) => {
  // Script loading state
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  // Ad loading states - now arrays for multiple ads
  const insRefs = useRef([]);
  const [adsLoaded, setAdsLoaded] = useState({});
  const [adsLoading, setAdsLoading] = useState({});

  // Load AdSense script
  useEffect(() => {
    // Skip script loading in development mode
    if (isDevelopment) {
      setScriptLoaded(true);
      return;
    }

    const scriptId = 'adsbygoogle-script';

    // Check if script already exists
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    // Check if adsbygoogle is already available
    if (window.adsbygoogle) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    
    script.onload = () => {
      setScriptLoaded(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load AdSense script');
    };

    document.head.appendChild(script);
  }, [adClient, isDevelopment]);

  // Load ads when script is ready
  useEffect(() => {
    if (!scriptLoaded || isDevelopment) return;

    const loadAd = (adSlot, index) => {
      const element = insRefs.current[index];
      if (!element || adsLoaded[adSlot] || adsLoading[adSlot]) return;

      // Multiple checks to prevent duplicate ads
      if (element.innerHTML !== "" && element.innerHTML.trim() !== "") {
        setAdsLoaded(prev => ({...prev, [adSlot]: true}));
        return;
      }

      if (element.getAttribute("data-ad-status") === "filled") {
        setAdsLoaded(prev => ({...prev, [adSlot]: true}));
        return;
      }

      if (element.querySelector('iframe')) {
        setAdsLoaded(prev => ({...prev, [adSlot]: true}));
        return;
      }

      if (typeof window.adsbygoogle === 'undefined') {
        console.warn('AdSense script not loaded yet');
        return;
      }

      try {
        setAdsLoading(prev => ({...prev, [adSlot]: true}));
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        
        // Check if ad loaded successfully after delay
        setTimeout(() => {
          if (element && 
              (element.innerHTML !== "" || 
               element.querySelector('iframe') ||
               element.getAttribute("data-ad-status") === "filled")) {
            setAdsLoaded(prev => ({...prev, [adSlot]: true}));
          }
          setAdsLoading(prev => ({...prev, [adSlot]: false}));
        }, 1000);
        
      } catch (e) {
        console.error("AdSense error:", e);
        setAdsLoading(prev => ({...prev, [adSlot]: false}));
      }
    };

    // Load all ads with small delays between them
    adSlots.forEach((adSlot, index) => {
      setTimeout(() => loadAd(adSlot, index), index * 200);
    });
    
  }, [scriptLoaded, adClient, adSlots, adsLoaded, adsLoading, isDevelopment]);

  // Render mock ad in development
  const renderMockAd = (adSlot, index) => (
    <div key={`mock-${index}`} className="text-center mb-6 last:mb-0">
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50"
        style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div className="text-center">
          <div className="text-gray-400 mb-2 text-xl">📱</div>
          <div className="text-sm text-gray-500 font-medium">Mock Advertisement #{index + 1}</div>
          <div className="text-xs text-gray-400 mt-2">
            Client: {adClient}<br/>
            Slot: {adSlot}
          </div>
          <div className="text-xs text-green-600 mt-2">Development Mode</div>
        </div>
      </div>
    </div>
  );

  // Render real AdSense ad
  const renderRealAd = (adSlot, index) => (
    <div key={`real-${index}`} className="text-center mb-6 last:mb-0">
      <ins
        ref={el => insRefs.current[index] = el}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );

  // Render loading placeholder
  const renderLoading = (index) => (
    <div key={`loading-${index}`} className="h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-6 last:mb-0">
      <div className="text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mx-auto mb-2"></div>
        <div className="text-sm text-gray-500">Loading ad #{index + 1}...</div>
      </div>
    </div>
  );

  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-24">
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-xl transform transition-all duration-300 hover:shadow-2xl">
          <h3 className="text-lg font-semibold text-slate-700 mb-4 text-center">
            {isDevelopment ? 'Sponsored (Dev)' : 'Sponsored'}
          </h3>
          
          {isDevelopment ? (
            renderMockAd()
          ) : scriptLoaded ? (
            renderRealAd()
          ) : (
            renderLoading()
          )}
          
          <div className="text-center mt-4">
            <p className="text-sm text-slate-400">Advertisement</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdPanel;