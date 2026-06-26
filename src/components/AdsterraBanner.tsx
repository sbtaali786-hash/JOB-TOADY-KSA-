/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

export default function AdsterraBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const currentContainer = containerRef.current;
    currentContainer.innerHTML = '';

    // Set up the required Adsterra global options for the iframe format
    (window as any).atOptions = {
      'key' : '5877167',
      'format' : 'iframe',
      'height' : 90,
      'width' : 728,
      'params' : {}
    };

    // Create the script element to invoke/render the ad unit
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//www.highperformanceformat.com/5877167/invoke.js';
    script.async = true;

    // Append the script element inside our wrapper container
    currentContainer.appendChild(script);

    return () => {
      if (currentContainer) {
        currentContainer.innerHTML = '';
      }
      try {
        delete (window as any).atOptions;
      } catch (e) {
        // Safe fallback if deletion is restricted
        (window as any).atOptions = undefined;
      }
    };
  }, []);

  return (
    <section className="py-6 bg-slate-50 border-y border-slate-100">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Sponsored Advertisement
          </span>
          {/* Scroll container wrapper to ensure mobile users can view the full banner without layout overflow issues */}
          <div className="w-full overflow-x-auto flex justify-center py-2">
            <div 
              ref={containerRef} 
              className="inline-block"
              style={{ width: '728px', minHeight: '90px', textAlign: 'center' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

