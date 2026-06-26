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
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
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
              className={`text-sm font-semibold tracking-wide transition duration-150 border-b-2 py-1 cursor-pointer ${
                currentPage === item.id || (item.id === 'jobs' && currentPage === 'job-details')
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:border-gray-200 hover:text-blue-900'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          {isAdminLoggedIn && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('admin')}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                  currentPage === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={onLogout}
                className="text-xs font-semibold text-red-600 hover:text-red-700 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-3 md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg border border-gray-100 p-2 text-gray-700 hover:bg-gray-50 transition focus:outline-none cursor-pointer"
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
                className={`text-left text-sm font-semibold py-1.5 cursor-pointer ${
                  currentPage === item.id ? 'text-blue-600' : 'text-gray-600 hover:text-blue-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {isAdminLoggedIn && (
              <div className="border-t border-gray-100 pt-3">
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setIsOpen(false);
                    }}
                    className="rounded-lg bg-blue-600 py-2 text-center text-sm font-bold text-white hover:bg-blue-700 cursor-pointer"
                  >
                    Admin Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="text-center text-sm font-semibold text-red-600 hover:text-red-700 py-1 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
