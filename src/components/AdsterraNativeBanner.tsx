/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';

export default function AdsterraNativeBanner() {
  useEffect(() => {
    // 1. Create script element
    const script = document.createElement('script');
    script.src = 'https://undergocutlery.com/a73bfcc22984758c5363c728bdb709b6/invoke.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.id = 'adsterra-native-script';

    // Append script to document head
    document.head.appendChild(script);

    // 2. Safe cleanup logic on unmount to prevent duplicate widgets or stray DOM artifacts
    return () => {
      const existingScript = document.getElementById('adsterra-native-script');
      if (existingScript) {
        existingScript.remove();
      }
      
      const container = document.getElementById('container-a73bfcc22984758c5363c728bdb709b6');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <section className="py-8 bg-white border-t border-slate-150">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
            Sponsored Partner Ad
          </span>
          
          {/* Responsive placeholder to contain the native banner with zero visual layout shift */}
          <div className="w-full overflow-hidden flex justify-center">
            <div 
              id="container-a73bfcc22984758c5363c728bdb709b6" 
              className="w-full text-center"
              style={{ minHeight: '120px', margin: '10px 0' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
