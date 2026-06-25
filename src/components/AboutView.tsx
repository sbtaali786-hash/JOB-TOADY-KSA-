/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Target, Eye, ShieldCheck, HeartHandshake, Award, Users } from 'lucide-react';

export default function AboutView() {
  const values = [
    {
      title: 'Zero-Harm Commitment',
      description: 'Safety is in our DNA. We pre-screen candidates specifically on KSA and Aramco occupational safety regulations to guarantee hazard-free worksites.',
      icon: ShieldCheck,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Reliability & Trust',
      description: 'JOB TODAY KSA represents consistent support. We keep lines open, respond rapidly to urgent crew mobilizations, and stand by our service SLA.',
      icon: HeartHandshake,
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      title: 'SCE & NEOSH Compliance',
      description: 'All supplied engineers are registered in the Saudi Council of Engineers (SCE), and HSE supervisors hold verified NEBOSH and OSHA IDs.',
      icon: Award,
      color: 'text-amber-600 bg-amber-50'
    },
    {
      title: 'Saudi Vision 2030 Support',
      description: 'Empowering domestic construction growth. We assist national developments by supplying elite logistics, safety, and administrative personnel.',
      icon: Users,
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  return (
    <div>
      {/* Visual Header */}
      <section className="bg-blue-950 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        <div className="relative mx-auto max-w-7xl px-4 text-center md:text-left lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">About Us</span>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mt-2">
              Corporate Manpower Supporter
            </h1>
            <p className="mt-4 text-sm text-gray-300 leading-relaxed">
              Founded in Saudi Arabia, JOB TODAY KSA delivers elite safety and technical support talent. We specialize in rapid, compliant, and reliable staffing pipelines for high-demand mega projects.
            </p>
          </div>
        </div>
      </section>

      {/* Main Mission & Vision */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          
          {/* Mission Card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm relative overflow-hidden border-l-4 border-l-blue-600">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-6 font-bold">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-blue-950">Our Mission</h2>
            <p className="mt-3 text-xs text-gray-500 leading-relaxed">
              To supply premier, certified occupational safety and engineering talent to industrial corporations throughout Saudi Arabia, ensuring client project compliance, zero-harm environments, and efficient workflow execution.
            </p>
          </div>

          {/* Vision Card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm relative overflow-hidden border-l-4 border-l-emerald-600">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-6 font-bold">
              <Eye className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-blue-950">Our Vision</h2>
            <p className="mt-3 text-xs text-gray-500 leading-relaxed">
              To be the most trusted safety recruitment brand in the Kingdom of Saudi Arabia, renowned for our strict compliance, verified credentials, rapid mobilization capabilities, and unwavering support of the Saudi Vision 2030.
            </p>
          </div>

        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl tracking-tight">Our Core Operational Values</h2>
            <p className="mt-2 text-sm text-gray-500">The parameters that drive our screening, sourcing, and client support pipelines.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const IconComp = v.icon;
              return (
                <div key={i} className="text-center md:text-left">
                  <div className={`mx-auto md:mx-0 flex h-10 w-10 items-center justify-center rounded-lg ${v.color} mb-4 font-bold`}>
                    <IconComp className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{v.title}</h3>
                  <p className="mt-2 text-xs text-gray-500 leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brief History Block */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center md:text-left">
        <h2 className="text-2xl font-bold text-blue-950 mb-4">JOB TODAY KSA: Industrial Partners</h2>
        <div className="space-y-4 text-xs text-gray-500 leading-relaxed">
          <p>
            JOB TODAY KSA was established to cater to the growing demand for highly skilled labor, technical personnel, and dedicated on-site HSE (Health, Safety, and Environment) supervisors. Over the years, we have built a reputational stronghold in Riyadh and the Eastern Province by supplying talent with extreme speed and legal safety under the KSA labor laws.
          </p>
          <p>
            By managing legal affairs, visa sponsorships, residency details (Iqama updates, medical coverage), and transport details on our side, we let our clients focus entirely on engineering and construction progress, minimizing overhead administrative costs.
          </p>
        </div>
      </section>
    </div>
  );
}
