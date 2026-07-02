/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Check, AlertCircle } from 'lucide-react';
import { db } from '../supabase';

export default function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !subject || !message) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await db.submitContactMessage({
        name,
        email,
        phone,
        subject,
        message
      });
      setSuccess(true);
      // reset form
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error(err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50/40">
      {/* Intro section */}
      <section className="bg-blue-950 py-16 text-white text-center md:text-left relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Get In Touch</span>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mt-2">
              Contact JOB TODAY KSA
            </h1>
            <p className="mt-4 text-sm text-gray-300 leading-relaxed">
              Have questions regarding manpower supply, commercial invoicing, or active job postings? Fill in the form or call our Riyadh regional office directly.
            </p>
          </div>
        </div>
      </section>

      {/* Main grids */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          
          {/* Contact Details Column */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-blue-950 border-b border-gray-100 pb-3">Company Coordinates</h2>
            
            <div className="space-y-6">
              
              {/* Phone info */}
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Direct Phone & WhatsApp</h3>
                  <span className="text-sm font-extrabold text-blue-950 block mt-1 select-all font-mono">
                    0508202459
                  </span>
                  <span className="text-xs text-gray-400 block mt-0.5 font-medium">
                    (Direct Recruitment Desk / Inquiry Support)
                  </span>
                </div>
              </div>

              {/* Email info */}
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Correspondence</h3>
                  <a href="mailto:sbtservices7@sbtcabin.com" className="text-sm font-bold text-blue-950 hover:text-blue-600 transition block mt-0.5">
                    sbtservices7@sbtcabin.com
                  </a>
                </div>
              </div>

              {/* Coverage area */}
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Service Coverage Area</h3>
                  <p className="text-xs text-gray-600 leading-relaxed mt-0.5">
                    All major regions in Saudi Arabia, including Riyadh (HQ), Dammam, Al Jubail, Yanbu, Jeddah, and remote sectors like NEOM.
                  </p>
                </div>
              </div>

              {/* Working hours */}
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Support Business Hours</h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Saturday – Thursday <br />
                    08:00 AM – 06:00 PM (Friday Off)
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-lg font-bold text-blue-950 mb-6">Send an Online Inquiry</h2>

              {success && (
                <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-700 font-semibold flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Message sent successfully! Our representative will review and contact you shortly.</span>
                </div>
              )}

              {error && (
                <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-600 font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abdullah Ahmed"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. manager@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Phone / WhatsApp <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0508202459"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Subject <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Manpower supply request"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Message / Inquiry Details <span className="text-red-500">*</span></label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Provide details of your required trades, site location, timeline, or candidate qualifications..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow hover:bg-blue-700 transition disabled:bg-blue-300 cursor-pointer"
                >
                  {submitting ? 'Sending Message...' : 'Send Online Inquiry'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* Map Placeholder Block */}
      <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 text-center">Head Office Map Location</h2>
        <div className="rounded-2xl border border-gray-100 bg-white p-2 shadow-sm overflow-hidden h-72 relative">
          <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center p-4 text-center">
            <MapPin className="h-8 w-8 text-blue-600 mb-2 animate-bounce" />
            <h3 className="text-sm font-bold text-gray-800">Olaya District, Riyadh, Saudi Arabia</h3>
            <p className="text-xs text-gray-400 mt-1">JOB TODAY KSA Regional Head Office</p>
            <p className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded mt-4 border border-blue-100 font-semibold">Near Kingdom Centre Metro Area</p>
          </div>
        </div>
      </section>
    </div>
  );
}
