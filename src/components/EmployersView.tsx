/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Users, Briefcase, Award, Phone, Mail, CheckCircle2, MessageSquare, HardHat, FileText, Sparkles } from 'lucide-react';

interface EmployersViewProps {
  onNavigate: (page: string) => void;
}

export default function EmployersView({ onNavigate }: EmployersViewProps) {
  const services = [
    {
      title: 'Safety Staff & HSE Supply',
      description: 'We supply certified, ministry-approved and Aramco/SABIC compliant Safety personnel including HSE Officers, HSE Engineers, Safety Supervisors, and Safety Managers.',
      badge: 'Popular',
      items: [
        'NEBOSH / OSHA Certified Officers',
        'Aramco Approved Work Permit Receivers (WPR)',
        'Comprehensive onsite hazard control oversight',
        'Zero-Harm compliance managers'
      ],
      icon: ShieldCheck,
      color: 'bg-blue-50 text-blue-600 border-blue-100'
    },
    {
      title: 'Technical & Site Engineering',
      description: 'Skilled technical specialists, site civil engineers, and quality assurance inspectors equipped for complex structural layouts and high-speed mega projects.',
      badge: 'Highly Demand',
      items: [
        'SCE registered Site Engineers',
        'Certified QA/QC Inspector (Civil/Mech)',
        'Experienced Civil Supervisors',
        'Accurate Document Controllers'
      ],
      icon: HardHat,
      color: 'bg-amber-50 text-amber-600 border-amber-100'
    },
    {
      title: 'Skilled Trades & Technical Crew',
      description: 'Rapid mobilization of highly expert field workers for plant shutdowns, mechanical installations, electrical routing, and pipe fitting workloads.',
      badge: 'Bulk Supply',
      items: [
        'Industrial Electricians',
        'Certified Pipe Fitters',
        'Mechanical Technicians',
        'Store Keepers and Yard Superintendents'
      ],
      icon: Users,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    {
      title: 'Office Administration Support',
      description: 'Qualified secretarial, clerical, and administrative office support staff fluent in bilingual correspondence (Arabic & English) to manage corporate workflow.',
      badge: 'Flexible',
      items: [
        'Bilingual Admin Assistants',
        'Experienced Procurement Officers',
        'Data Entry Operators',
        'Office coordinators'
      ],
      icon: Briefcase,
      color: 'bg-purple-50 text-purple-600 border-purple-100'
    }
  ];

  return (
    <div className="bg-gray-50/40">
      {/* Intro Banner */}
      <section className="bg-blue-950 py-16 text-white text-center md:text-left relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-900 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-800">
              <Sparkles className="h-3 w-3" />
              <span>KSA Manpower Solutions</span>
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl mt-3">
              Certified Safety & Technical Staffing
            </h1>
            <p className="mt-4 text-sm text-gray-300 md:text-base leading-relaxed">
              JOB TODAY KSA specializes in providing vetted, compliant technical support and industrial manpower to project sites across Riyadh, Jubail, NEOM, and Jeddah. Streamline your hiring workflow and reduce risk.
            </p>
            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
              <button
                onClick={() => onNavigate('contact')}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition"
              >
                Request Quotation
              </button>
              <a
                href="https://wa.me/966508202459"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition"
              >
                <MessageSquare className="h-4 w-4" />
                <span>WhatsApp Recruiting Manager</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl tracking-tight">Our Dedicated Recruitment Pillars</h2>
          <p className="mt-2 text-sm text-gray-600 max-w-xl mx-auto">
            From single-candidate placements to full on-site crew mobilization, we supply fully compliant and certified personnel.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {services.map((srv, idx) => {
            const IconComponent = srv.icon;
            return (
              <div key={idx} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`rounded-xl p-2.5 border ${srv.color} shrink-0`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-blue-950 mb-2">{srv.title}</h3>
                  <p className="text-xs text-gray-500 mb-6 leading-relaxed">{srv.description}</p>

                  <ul className="space-y-2 text-xs text-gray-600">
                    {srv.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Compliance Block */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="rounded-2xl bg-blue-50 border border-blue-100/50 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="rounded-full bg-blue-100 px-3 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-widest">
                KSA Labor Regulations
              </span>
              <h3 className="text-xl font-bold text-blue-950 mt-2 mb-3">100% Qiwa & Ajeer Compliant Sponsorship</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                JOB TODAY KSA manages legal requirements strictly. We handle all labor contracts, sponsorship details, GOSI, Iqama issues, and mobilization permits via Qiwa and Ajeer, allowing corporate partners to outsource liability and enjoy zero compliance risks.
              </p>
            </div>
            <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 p-3 rounded-xl shadow-sm">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>Request Sample Commercial Invoice</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-white bg-blue-600 p-3 rounded-xl shadow-sm hover:bg-blue-700 cursor-pointer text-center justify-center transition" onClick={() => onNavigate('contact')}>
                <span>Initiate Hiring Call</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Numbers */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="text-xl font-extrabold text-blue-950">Supply Urgency? Sourcing within 48 Hours</h2>
          <p className="text-xs text-gray-500 mt-1 mb-8">Speak directly with our mobilizations manager regarding industrial shutdown or urgent structural site work.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:0508202459" className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm">
              <Phone className="h-4 w-4 text-blue-600" />
              <span>Call: 0508202459</span>
            </a>
            <a href="mailto:sbtservices7@sbtcabin.com" className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm">
              <Mail className="h-4 w-4 text-blue-600" />
              <span>Email: sbtservices7@sbtcabin.com</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
