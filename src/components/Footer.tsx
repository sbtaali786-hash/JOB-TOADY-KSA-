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
    <footer className="bg-blue-950 text-gray-300">
      {/* Top section with quick contacts */}
      <div className="border-b border-blue-900/50 bg-blue-950/40">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 md:grid-cols-3 lg:px-8">
          <div className="flex items-start space-x-3">
            <div className="rounded-lg bg-blue-900/50 p-2 text-blue-400">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Call / WhatsApp</p>
              <a href="tel:0508202459" className="text-sm font-bold text-white hover:text-blue-300 transition">
                0508202459
              </a>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="rounded-lg bg-blue-900/50 p-2 text-blue-400">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">General Inquiry</p>
              <a href="mailto:sbtservices7@sbtcabin.com" className="text-sm font-bold text-white hover:text-blue-300 transition">
                sbtservices7@sbtcabin.com
              </a>
            </div>
          </div>
          <div className="flex items-start space-x-3 sm:col-span-2 md:col-span-1">
            <div className="rounded-lg bg-blue-900/50 p-2 text-blue-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Service Coverage</p>
              <p className="text-sm font-bold text-white">Riyadh, Jubail, Dammam, Jeddah & NEOM (Saudi Arabia)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer contents */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Logo & About */}
          <div className="md:col-span-2">
            <div onClick={() => onNavigate('home')} className="flex cursor-pointer items-center space-x-2 text-white mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="block text-base font-extrabold tracking-tight">JOB TODAY KSA</span>
                <span className="block text-[9px] font-medium text-blue-400 uppercase tracking-widest">KSA Premium Recruitment</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4 max-w-sm">
              JOB TODAY KSA is a premier recruitment, technical staffing, and safety-personnel manpower supplier specializing in delivering certified personnel (HSE Officers, Engineers, WPRs) across industrial mega-projects in Saudi Arabia.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold bg-blue-900/30 w-fit px-3 py-1 rounded-full border border-blue-800/30">
              <ShieldCheck className="h-4 w-4" />
              <span>Ministry Approved Manpower Supporter</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-blue-400 transition">
                  Home Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('jobs')} className="hover:text-blue-400 transition">
                  Browse Jobs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('employers')} className="hover:text-blue-400 transition">
                  Employer Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-blue-400 transition">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-blue-400 transition">
                  Get In Touch
                </button>
              </li>
            </ul>
          </div>

          {/* Support Working Hours */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Business Hours</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-400 shrink-0" />
                <div>
                  <span className="block text-gray-200">Saturday – Thursday</span>
                  <span className="text-xs">08:00 AM – 06:00 PM</span>
                </div>
              </li>
              <li className="flex items-center gap-2 border-t border-blue-900/40 pt-2">
                <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
                <div>
                  <span className="block text-gray-200">Riyadh Head Office</span>
                  <span className="text-xs">Olaya District, Riyadh, KSA</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="border-t border-blue-900/40 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {currentYear} JOB TODAY KSA. All Rights Reserved.</p>
          <div className="flex space-x-6">
            <span>Powered by Supabase Security</span>
            <button onClick={() => onNavigate('login')} className="hover:text-blue-400 transition">
              Admin Area
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
