/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, Briefcase, Phone, MessageSquare } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, data?: any) => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
}

export default function Header({ currentPage, onNavigate, isAdminLoggedIn, onLogout }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'employers', label: 'Employers' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
      {/* Top Bar for Contact info */}
      <div className="hidden bg-blue-900 px-4 py-2 text-xs text-white sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-blue-300" />
              <span>Call / WhatsApp: 0508202459</span>
            </span>
            <span>Email: sbtservices7@sbtcabin.com</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="rounded bg-blue-800 px-2 py-0.5 text-[10px] font-semibold text-blue-100 uppercase tracking-wider">
              KSA Recruitment Support
            </span>
            <a 
              href="https://wa.me/966508202459" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-200 hover:text-white transition"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Direct WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        {/* Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex cursor-pointer items-center space-x-2 text-blue-950 hover:opacity-90 transition"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-200">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-lg font-extrabold tracking-tight text-blue-900 leading-none">JOB TODAY KSA</span>
            <span className="block text-[10px] font-medium text-gray-500 uppercase tracking-widest">Premier Recruitment</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center space-x-8 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`text-sm font-semibold tracking-wide transition duration-150 border-b-2 py-1 ${
                currentPage === item.id || (item.id === 'jobs' && currentPage === 'job-details')
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:border-gray-200 hover:text-blue-900'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          {isAdminLoggedIn ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('admin')}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  currentPage === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={onLogout}
                className="text-xs font-semibold text-red-600 hover:text-red-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className={`rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-blue-900 ${
                currentPage === 'login' ? 'bg-gray-100 border-gray-300 text-blue-900' : ''
              }`}
            >
              Admin Portal
            </button>
          )}

          <a
            href="https://wa.me/966508202459"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-100 transition duration-150"
          >
            WhatsApp Us
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-3 md:hidden">
          <a
            href="https://wa.me/966508202459"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-emerald-600 p-2 text-white hover:bg-emerald-700 transition"
          >
            <MessageSquare className="h-4 w-4" />
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg border border-gray-100 p-2 text-gray-700 hover:bg-gray-50 transition focus:outline-none"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-inner md:hidden">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpen(false);
                }}
                className={`text-left text-sm font-semibold py-1.5 ${
                  currentPage === item.id ? 'text-blue-600' : 'text-gray-600 hover:text-blue-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <div className="border-t border-gray-100 pt-3">
              {isAdminLoggedIn ? (
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setIsOpen(false);
                    }}
                    className="rounded-lg bg-blue-600 py-2 text-center text-sm font-bold text-white hover:bg-blue-700"
                  >
                    Admin Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="text-center text-sm font-semibold text-red-600 hover:text-red-700 py-1"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onNavigate('login');
                    setIsOpen(false);
                  }}
                  className="w-full rounded-lg border border-gray-200 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Admin Portal
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
