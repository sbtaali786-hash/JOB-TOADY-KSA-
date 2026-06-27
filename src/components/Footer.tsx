/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Briefcase, MapPin, Mail, Phone, Clock, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-gray-400 py-12 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div onClick={() => onNavigate('home')} className="flex cursor-pointer items-center space-x-2 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="block text-base font-extrabold tracking-tight text-white">JOB TODAY KSA</span>
              <span className="block text-[9px] font-medium text-blue-400 uppercase tracking-widest">KSA Premium Recruitment</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex space-x-6 text-sm">
            <button onClick={() => onNavigate('home')} className="hover:text-white transition cursor-pointer font-medium">
              Home
            </button>
            <button onClick={() => onNavigate('jobs')} className="hover:text-white transition cursor-pointer font-medium">
              Jobs
            </button>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} JOB TODAY KSA. All Rights Reserved.</p>
          <div className="flex space-x-4 items-center">
            <span>Powered by Supabase Security</span>
            <span className="text-slate-700">•</span>
            <button 
              onClick={() => onNavigate('admin')} 
              className="text-slate-500 hover:text-blue-400 font-semibold cursor-pointer transition-colors duration-150"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
