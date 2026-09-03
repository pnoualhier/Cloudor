import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface StudyDashboardViewProps {
  onNavigate: (tab: ActiveTab) => void;
  activeTrackId: string;
}

export const StudyDashboardView: React.FC<StudyDashboardViewProps> = ({
  onNavigate,
}) => {
  const { language } = useLanguage();
  const [activeGoal, setActiveGoal] = useState<'aws-saa' | 'azure-az900'>('aws-saa');
  const [expandedDomains, setExpandedDomains] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: false,
  });

  const [blueprintChecklist, setBlueprintChecklist] = useState<Record<string, boolean>>({
    bp1: true,
    bp2: true,
    bp3: false,
    bp4: true,
    bp5: false,
  });

  const [dailyCadence, setDailyCadence] = useState<Record<string, boolean>>({
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: true,
    sun: false,
  });

  const [showLabModal, setShowLabModal] = useState(false);
  const [showCalendarNotice, setShowCalendarNotice] = useState(false);

  const toggleDomain = (id: number) => {
    setExpandedDomains({ ...expandedDomains, [id]: !expandedDomains[id] });
  };

  const toggleChecklist = (id: string) => {
    setBlueprintChecklist({ ...blueprintChecklist, [id]: !blueprintChecklist[id] });
  };

  const toggleCadence = (day: string) => {
    setDailyCadence({ ...dailyCadence, [day]: !dailyCadence[day] });
  };

  const isAws = activeGoal === 'aws-saa';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Target Exam Cockpit Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#171b26] via-[#1c1f2a] to-[#171b26] border border-[#262a35] p-6 lg:p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono-code font-bold uppercase bg-[#ffb95f]/15 text-[#ffb95f] border border-[#ffb95f]/30">
                {isAws ? 'PRIMARY ACTIVE TARGET • SAA-C03' : 'PRIMARY ACTIVE TARGET • AZ-900'}
              </span>
              <span className="text-xs font-mono-code text-[#908fa0]">
                Target Exam Date: <strong className="text-[#dfe2f1]">Nov 18, 2024</strong> (32 Days Remaining)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              {isAws
                ? 'AWS Certified Solutions Architect – Associate'
                : 'Microsoft Azure Fundamentals'}
            </h1>
            <p className="text-xs sm:text-sm text-[#c7c4d7] max-w-2xl leading-relaxed">
              {isAws
                ? 'Master high availability, multi-region failover, VPC peering, and cost governance across 4 critical domains.'
                : 'Core cloud concepts, security, governance, and architecture components on Microsoft Azure.'}
            </p>

            {/* Direct Official Certification URL & Exam Guide Links */}
            <div className="flex items-center gap-2.5 pt-2 flex-wrap">
              <a
                href={
                  isAws
                    ? 'https://aws.amazon.com/certification/certified-solutions-architect-associate/'
                    : 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#262a35] hover:bg-[#8083ff] text-white text-xs font-mono-code font-bold flex items-center gap-1.5 border border-[#313540] transition-colors shadow-sm"
              >
                <span>{language === 'fr' ? 'Accéder au Programme Officiel' : 'Open Official Program URL'}</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>

              <a
                href={
                  isAws
                    ? 'https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf'
                    : 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#0a0e18] hover:bg-[#313540] text-[#4cd7f6] hover:text-white text-xs font-mono-code font-bold flex items-center gap-1.5 border border-[#262a35] transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">menu_book</span>
                <span>{language === 'fr' ? 'Guide d’Examen / Syllabus (PDF)' : 'Official Exam Guide (PDF)'}</span>
                <span className="material-symbols-outlined text-[13px]">open_in_new</span>
              </a>
            </div>
          </div>

          {/* Gauge & Actions */}
          <div className="flex items-center gap-6 shrink-0">
            {/* Circular Gauge */}
            <div className="flex items-center gap-4 bg-[#0a0e18]/80 p-3.5 rounded-2xl border border-[#262a35]">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#262a35]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#4cd7f6]"
                    strokeDasharray={isAws ? '78, 100' : '84, 100'}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-mono-code font-bold text-sm text-white">
                  {isAws ? '78%' : '84%'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono-code uppercase text-[#908fa0] block">Readiness Index</span>
                <span className="text-xs font-bold text-[#4cd7f6] block">Passing Probability: 91%</span>
              </div>
            </div>

            {/* Launch Action */}
            <button
              onClick={() => onNavigate('practice-exam-lab')}
              className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] hover:opacity-95 text-[#0f131d] font-bold text-xs shadow-xl transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">play_circle</span>
              <span>Continue Study Lab</span>
            </button>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#4cd7f6]/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* CLF-C02 Special Learning & Flashcards Spotlight */}
      <div className="rounded-2xl bg-gradient-to-r from-[#171b26] via-[#1f1a14] to-[#171b26] border border-[#ff9900]/30 p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-[#ff9900]/20 text-[#ffb95f] border border-[#ff9900]/40">
              AWS CLF-C02 FOCUS
            </span>
            <span className="text-xs font-mono-code text-[#4cd7f6]">
              {language === 'fr' ? 'Programme Officiel Domaine 1 & Jeu de 50 Flashcards' : 'Official Domain 1 Guide & 50 Exam Flashcards Deck'}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-display font-bold text-white">
            {language === 'fr'
              ? 'AWS Certified Cloud Practitioner (CLF-C02) : Domaine 1 & 50 Flashcards'
              : 'AWS Certified Cloud Practitioner (CLF-C02): Domain 1 & 50 Flashcards'}
          </h2>
          <p className="text-xs text-[#c7c4d7] leading-relaxed">
            {language === 'fr'
              ? 'Consultez le cours interactif du Domaine 1 (Cloud Concepts - 24% du blueprint), les 6 piliers Well-Architected, les 7 R de migration et entraînez-vous avec 50 flashcards annotées.'
              : 'Access the interactive Domain 1 guide (Cloud Concepts - 24% blueprint weight), the 6 Well-Architected pillars, 7 Rs migration matrix, and drill through 50 exam flashcards.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <a
            href="https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain1.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-[#0a0e18] hover:bg-[#262a35] text-xs font-mono-code text-[#dfe2f1] hover:text-white border border-[#262a35] flex items-center gap-1.5 transition-colors"
          >
            <span>{language === 'fr' ? 'Doc Officielle AWS' : 'Official AWS Doc'}</span>
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>

          <button
            onClick={() => onNavigate('clf-c02-hub')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff9900] to-[#ffb95f] hover:opacity-95 text-[#0f131d] font-bold text-xs font-mono-code flex items-center gap-2 shadow-lg transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">style</span>
            <span>{language === 'fr' ? 'Lancer les 50 Flashcards & Cours' : 'Launch 50 Flashcards & Hub'}</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#171b26] border border-[#262a35] space-y-2">
          <div className="flex items-center justify-between text-[#908fa0] text-xs font-mono-code">
            <span>DOMAIN MASTERY</span>
            <span className="text-emerald-400 font-bold">+3.2% W/W</span>
          </div>
          <div className="text-2xl font-mono-code font-bold text-white">77.5% Avg</div>
          <div className="w-full bg-[#0a0e18] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#4cd7f6] h-full rounded-full" style={{ width: '77.5%' }}></div>
          </div>
          <span className="text-[11px] text-[#908fa0] block">Target cutoff is 72.0%</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#171b26] border border-[#262a35] space-y-2">
          <div className="flex items-center justify-between text-[#908fa0] text-xs font-mono-code">
            <span>SIMULATION LABS</span>
            <span className="text-[#ffb95f] font-bold">MOCK #03 ACTIVE</span>
          </div>
          <div className="text-2xl font-mono-code font-bold text-white">810 / 1000 Pts</div>
          <div className="w-full bg-[#0a0e18] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#8083ff] h-full rounded-full" style={{ width: '81%' }}></div>
          </div>
          <span className="text-[11px] text-[#908fa0] block">Cutoff passing score: 720</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#171b26] border border-[#262a35] space-y-2">
          <div className="flex items-center justify-between text-[#908fa0] text-xs font-mono-code">
            <span>STUDY VELOCITY</span>
            <span className="text-[#ffb95f]">🔥 Streak</span>
          </div>
          <div className="text-2xl font-mono-code font-bold text-white">14 Days Active</div>
          <div className="w-full bg-[#0a0e18] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#ffb95f] h-full rounded-full" style={{ width: '92%' }}></div>
          </div>
          <span className="text-[11px] text-[#908fa0] block">42.5 hrs logged this month</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#171b26] border border-[#262a35] space-y-2">
          <div className="flex items-center justify-between text-[#908fa0] text-xs font-mono-code">
            <span>HANDS-ON LABS</span>
            <span className="text-[#4cd7f6]">Sandbox</span>
          </div>
          <div className="text-2xl font-mono-code font-bold text-white">18 / 24 Verified</div>
          <div className="w-full bg-[#0a0e18] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#03b5d3] h-full rounded-full" style={{ width: '75%' }}></div>
          </div>
          <span className="text-[11px] text-[#908fa0] block">6 Topology challenges remain</span>
        </div>
      </div>

      {/* Main Grid: Left Column (Next Priority + Syllabus + AI Weak Spots) | Right Column (Rail) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Next Priority Module Callout */}
          <div className="p-6 rounded-2xl bg-[#1c1f2a] border border-[#8083ff]/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ffb95f] animate-ping"></span>
                <span className="text-[11px] font-mono-code uppercase tracking-wider text-[#ffb95f] font-bold">
                  Next Recommended Module
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-display font-bold text-white">
                VPC Peering vs Transit Gateway (Complex Routing Topologies)
              </h3>
              <p className="text-xs text-[#c7c4d7]">
                Learn CIDR non-overlapping constraints, transitive routing limits, and route table propagation rules.
              </p>
            </div>
            <button
              onClick={() => setShowLabModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#8083ff] hover:bg-[#8083ff]/90 text-white font-bold text-xs shrink-0 flex items-center gap-2 shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">terminal</span>
              <span>Start Lab (20m)</span>
            </button>
          </div>

          {/* Exam Domain Syllabus */}
          <div className="rounded-2xl bg-[#171b26] border border-[#262a35] p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-display font-bold text-white">Official Curriculum & Domain Syllabus</h2>
                <p className="text-xs text-[#908fa0]">SAA-C03 AWS Official Examination Blueprint Breakdown</p>
              </div>
              <span className="text-xs font-mono-code text-[#4cd7f6]">4 Domains • 32 Lessons</span>
            </div>

            {/* Accordion Domains */}
            <div className="space-y-3">
              {/* Domain 1 */}
              <div className="rounded-xl bg-[#0a0e18] border border-[#262a35] overflow-hidden">
                <button
                  onClick={() => toggleDomain(1)}
                  className="w-full p-4 flex items-center justify-between hover:bg-[#1c1f2a] transition-colors"
                >
                  <div className="flex items-center gap-3 text-left">
                    <span className="w-6 h-6 rounded-lg bg-[#8083ff]/20 text-[#c0c1ff] font-mono-code text-xs font-bold flex items-center justify-center">
                      D1
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white">
                        Design Resilient Architectures (30% weight)
                      </h4>
                      <span className="text-[11px] font-mono-code text-[#908fa0]">8 of 10 completed • 80%</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#908fa0]">
                    {expandedDomains[1] ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {expandedDomains[1] && (
                  <div className="p-4 pt-0 border-t border-[#262a35]/60 space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#171b26] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
                        <span className="text-[#dfe2f1]">Multi-AZ RDS Aurora Failover & Decoupled Storage</span>
                      </div>
                      <span className="font-mono-code text-[11px] text-emerald-400">Mastered</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#171b26] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#ffb95f] text-[18px]">timelapse</span>
                        <span className="text-[#dfe2f1]">S3 Lifecycle Policies & Glacier Deep Archive Retrieval</span>
                      </div>
                      <button
                        onClick={() => onNavigate('cheatsheets-and-playground')}
                        className="font-mono-code text-[11px] text-[#4cd7f6] hover:underline"
                      >
                        Review Cheat
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Domain 2 */}
              <div className="rounded-xl bg-[#0a0e18] border border-[#262a35] overflow-hidden">
                <button
                  onClick={() => toggleDomain(2)}
                  className="w-full p-4 flex items-center justify-between hover:bg-[#1c1f2a] transition-colors"
                >
                  <div className="flex items-center gap-3 text-left">
                    <span className="w-6 h-6 rounded-lg bg-[#4cd7f6]/20 text-[#4cd7f6] font-mono-code text-xs font-bold flex items-center justify-center">
                      D2
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white">
                        Design High-Performing Architectures (28% weight)
                      </h4>
                      <span className="text-[11px] font-mono-code text-[#908fa0]">6 of 8 completed • 75%</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#908fa0]">
                    {expandedDomains[2] ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {expandedDomains[2] && (
                  <div className="p-4 pt-0 border-t border-[#262a35]/60 space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#171b26] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">play_circle</span>
                        <span className="text-[#dfe2f1]">Amazon ElastiCache for Redis Global Datastore</span>
                      </div>
                      <button
                        onClick={() => onNavigate('practice-exam-lab')}
                        className="font-mono-code text-[11px] text-[#8083ff] hover:underline"
                      >
                        Q25 Simulation Lab
                      </button>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#171b26] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#908fa0] text-[18px]">radio_button_unchecked</span>
                        <span className="text-[#dfe2f1]">Amazon CloudFront Lambda@Edge vs CloudFront Functions</span>
                      </div>
                      <span className="font-mono-code text-[11px] text-[#908fa0]">Queued</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Domain 3 */}
              <div className="rounded-xl bg-[#0a0e18] border border-[#262a35] overflow-hidden">
                <button
                  onClick={() => toggleDomain(3)}
                  className="w-full p-4 flex items-center justify-between hover:bg-[#1c1f2a] transition-colors"
                >
                  <div className="flex items-center gap-3 text-left">
                    <span className="w-6 h-6 rounded-lg bg-[#ffb95f]/20 text-[#ffb95f] font-mono-code text-xs font-bold flex items-center justify-center">
                      D3
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white">
                        Design Secure Applications & Architectures (24% weight)
                      </h4>
                      <span className="text-[11px] font-mono-code text-[#ffb4ab]">Weak Spot Detected • 54%</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#908fa0]">
                    {expandedDomains[3] ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {expandedDomains[3] && (
                  <div className="p-4 pt-0 border-t border-[#262a35]/60 space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#171b26] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#ffb4ab] text-[18px]">warning</span>
                        <span className="text-[#dfe2f1]">AWS KMS Envelope Encryption & Multi-Region Keys</span>
                      </div>
                      <span className="font-mono-code text-[11px] text-[#ffb4ab]">54% Accuracy</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Domain 4 */}
              <div className="rounded-xl bg-[#0a0e18] border border-[#262a35] overflow-hidden">
                <button
                  onClick={() => toggleDomain(4)}
                  className="w-full p-4 flex items-center justify-between hover:bg-[#1c1f2a] transition-colors"
                >
                  <div className="flex items-center gap-3 text-left">
                    <span className="w-6 h-6 rounded-lg bg-[#ca8100]/20 text-[#ffb95f] font-mono-code text-xs font-bold flex items-center justify-center">
                      D4
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white">
                        Design Cost-Optimized Architectures (18% weight)
                      </h4>
                      <span className="text-[11px] font-mono-code text-[#908fa0]">5 of 6 completed • 83%</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#908fa0]">
                    {expandedDomains[4] ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {expandedDomains[4] && (
                  <div className="p-4 pt-0 border-t border-[#262a35]/60 space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#171b26] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
                        <span className="text-[#dfe2f1]">EC2 Spot Fleets & Allocation Strategies</span>
                      </div>
                      <span className="font-mono-code text-[11px] text-emerald-400">Mastered</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Weak-Spot Interventions */}
          <div className="rounded-2xl bg-[#171b26] border border-[#262a35] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb4ab] text-[20px]">smart_toy</span>
                <h3 className="text-sm font-bold text-white">AI Diagnostic Weak-Spot Interventions</h3>
              </div>
              <span className="text-[11px] font-mono-code text-[#908fa0]">Auto-generated from 3 Practice Mocks</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0a0e18] border border-[#262a35] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono-code">
                  <span className="text-[#ffb4ab]">KMS Multi-Region Keys</span>
                  <span className="text-white font-bold">54% Acc</span>
                </div>
                <p className="text-[11px] text-[#c7c4d7]">
                  Struggling on cross-region envelope encryption vs customer managed replicas.
                </p>
                <button
                  onClick={() => onNavigate('practice-exam-lab')}
                  className="text-xs font-mono-code text-[#4cd7f6] hover:underline pt-1 inline-flex items-center gap-1"
                >
                  <span>Launch 10-Question Targeted Drill</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#0a0e18] border border-[#262a35] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono-code">
                  <span className="text-[#ffb95f]">S3 Lifecycle Transition Dates</span>
                  <span className="text-white font-bold">68% Acc</span>
                </div>
                <p className="text-[11px] text-[#c7c4d7]">
                  Confusion on 30-day minimum block rules before moving to Standard-IA.
                </p>
                <button
                  onClick={() => onNavigate('cheatsheets-and-playground')}
                  className="text-xs font-mono-code text-[#4cd7f6] hover:underline pt-1 inline-flex items-center gap-1"
                >
                  <span>Open S3 Cram Sheet</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Rail (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Secondary Goal Card */}
          <div className="rounded-2xl bg-[#171b26] border border-[#262a35] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#908fa0]">
                Secondary Goal Track
              </span>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#4cd7f6]/10 text-[#4cd7f6]">
                AZURE
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Microsoft Azure Fundamentals (AZ-900)</h4>
            <div className="flex items-center justify-between text-xs font-mono-code text-[#dfe2f1]">
              <span>Current Progress: 84%</span>
              <span className="text-emerald-400 font-bold">Exam Ready</span>
            </div>
            <button
              onClick={() => setActiveGoal(isAws ? 'azure-az900' : 'aws-saa')}
              className="w-full py-2 rounded-xl bg-[#262a35] hover:bg-[#313540] text-xs font-mono-code text-[#dfe2f1] transition-colors"
            >
              {isAws ? 'Switch to AZ-900 Target' : 'Switch back to SAA-C03'}
            </button>
          </div>

          {/* 7-Day Study Cadence */}
          <div className="rounded-2xl bg-[#171b26] border border-[#262a35] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white font-mono-code uppercase">7-Day Study Cadence</h4>
              <span className="text-xs font-mono-code text-[#ffb95f]">6/7 Complete</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {[
                { key: 'mon', label: 'M' },
                { key: 'tue', label: 'T' },
                { key: 'wed', label: 'W' },
                { key: 'thu', label: 'T' },
                { key: 'fri', label: 'F' },
                { key: 'sat', label: 'S' },
                { key: 'sun', label: 'S' },
              ].map((d) => {
                const done = dailyCadence[d.key];
                return (
                  <button
                    key={d.key}
                    onClick={() => toggleCadence(d.key)}
                    className={`py-2 rounded-lg text-xs font-mono-code font-bold transition-all ${
                      done
                        ? 'bg-[#8083ff] text-white shadow-sm'
                        : 'bg-[#0a0e18] text-[#908fa0] border border-[#262a35]'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Official Blueprint Checklist */}
          <div className="rounded-2xl bg-[#171b26] border border-[#262a35] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white font-mono-code uppercase">Blueprint Checklist</h4>
              <span className="text-xs font-mono-code text-[#4cd7f6]">3 of 5</span>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { id: 'bp1', text: 'Configure Multi-AZ Aurora DB Subnet Groups' },
                { id: 'bp2', text: 'Configure Route 53 Weighted & Latency Records' },
                { id: 'bp3', text: 'Draft AWS Organizations Service Control Policy' },
                { id: 'bp4', text: 'Provision S3 Cross-Region Replication with KMS' },
                { id: 'bp5', text: 'Establish Direct Connect + VPN Failover Gateway' },
              ].map((item) => {
                const checked = blueprintChecklist[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0a0e18] border border-[#262a35] cursor-pointer hover:border-[#464554] transition-colors"
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center ${
                        checked ? 'bg-[#4cd7f6] text-[#0f131d]' : 'border border-[#908fa0]'
                      }`}
                    >
                      {checked && <span className="material-symbols-outlined text-[14px] font-bold">check</span>}
                    </div>
                    <span className={`text-xs ${checked ? 'text-[#908fa0] line-through' : 'text-[#dfe2f1]'}`}>
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lead Architect AMA Live Stream Card */}
          <div className="rounded-2xl bg-[#171b26] border border-[#262a35] p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#ffb4ab]">
                Upcoming Masterclass
              </span>
            </div>
            <div className="flex items-center gap-3">
              <img
                alt="Marcus Vance Avatar"
                className="w-10 h-10 rounded-full object-cover border border-[#4cd7f6]"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <h5 className="text-xs font-bold text-white">Marcus Vance</h5>
                <p className="text-[11px] text-[#908fa0]">Principal Solutions Architect</p>
              </div>
            </div>
            <p className="text-xs text-[#c7c4d7]">
              &ldquo;Deconstructing Complex VPC Peering & Transit Gateway Exam Traps&rdquo;
            </p>
            <div className="text-[11px] font-mono-code text-[#4cd7f6]">
              Tomorrow • 18:00 UTC (45 min)
            </div>
            <button
              onClick={() => {
                setShowCalendarNotice(true);
                setTimeout(() => setShowCalendarNotice(false), 3500);
              }}
              className="w-full py-2 rounded-xl bg-[#262a35] hover:bg-[#313540] text-xs font-mono-code text-[#dfe2f1] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
              <span>{showCalendarNotice ? 'Added to Calendar!' : 'Add to Google Calendar'}</span>
            </button>
          </div>

          {/* Study Group Pulse */}
          <div className="rounded-2xl bg-[#171b26] border border-[#262a35] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white font-mono-code uppercase">Study Group Pulse</h4>
              <span className="text-[10px] font-mono-code text-emerald-400">● 14 Online</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0a0e18]">
                <img
                  alt="Elena R"
                  className="w-6 h-6 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[#dfe2f1] font-medium truncate">Elena R. scored 860/1000</p>
                  <p className="text-[10px] text-[#908fa0]">Completed Mock Test #03 • 12m ago</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0a0e18]">
                <img
                  alt="Dev Patel"
                  className="w-6 h-6 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[#dfe2f1] font-medium truncate">Dev Patel pinned CKA Imperatives</p>
                  <p className="text-[10px] text-[#908fa0]">Kubernetes etcd snapshot • 45m ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Lab Modal */}
      {showLabModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c1f2a] border border-[#313540] rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#262a35]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">cloud_sync</span>
                <h3 className="font-display font-bold text-white text-base">AWS Sandbox Lab Environment</h3>
              </div>
              <button
                onClick={() => setShowLabModal(false)}
                className="p-1 rounded-lg hover:bg-[#262a35] text-[#908fa0] hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-5 space-y-4 font-mono-code text-xs">
              <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35] text-[#4cd7f6]">
                <code>$ aws ec2 create-transit-gateway --description &quot;Prod TGW Hub&quot;</code>
                <div className="text-[#908fa0] text-[11px] mt-1">
                  &gt; Provisioning isolated transit route table across Account-A (10.0.0.0/16) and Account-B (172.16.0.0/16)...
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#171b26] border border-[#262a35] text-[#dfe2f1] space-y-2">
                <p className="font-bold text-white">Lab Objectives:</p>
                <p>1. Attach VPC-Prod and VPC-Shared to the AWS Transit Gateway.</p>
                <p>2. Configure non-overlapping CIDR block entries in Route Tables.</p>
                <p>3. Verify ICMP traceroute packets between private subnets without public internet egress.</p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-400">
                <span>Sandbox Status: ACTIVE (Ephemeral Session 59m remaining)</span>
                <span className="font-bold">200 OK</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowLabModal(false)}
                className="px-4 py-2 rounded-lg bg-[#262a35] text-xs font-semibold text-[#dfe2f1]"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setShowLabModal(false);
                  onNavigate('cheatsheets-and-playground');
                }}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] text-xs font-bold text-[#0f131d] shadow-md"
              >
                Inspect Topology in Playground
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
