import React, { useState, useEffect } from 'react';
import { ActiveTab, ExamQuestion } from '../types';
import { INITIAL_EXAM_QUESTIONS } from '../data/mockData';

interface PracticeExamLabViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const PracticeExamLabView: React.FC<PracticeExamLabViewProps> = ({ onNavigate }) => {
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(25);
  const [questions, setQuestions] = useState<ExamQuestion[]>(INITIAL_EXAM_QUESTIONS);
  const [showExplanation, setShowExplanation] = useState<boolean>(true);
  const [timerSeconds, setTimerSeconds] = useState<number>(6138); // ~01:42:18
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [scratchpad, setScratchpad] = useState<string>(
    '# SAA-C03 Note:\n- Global Datastore = cross-region replication < 1s latency\n- DAX = single region only!\n- Memcached = NO multi-region replication'
  );
  const [questionFilter, setQuestionFilter] = useState<'all' | 'flagged' | 'unanswered'>('all');
  const [showEndExamModal, setShowEndExamModal] = useState<boolean>(false);

  // Timer effect
  useEffect(() => {
    if (isTimerPaused) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerPaused]);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Find or generate active question
  let currentQ = questions.find((q) => q.id === currentQuestionId);
  if (!currentQ) {
    // Generate fallback dummy question for any of the 65 indices
    currentQ = {
      id: currentQuestionId,
      domain: `DOMAIN ${(currentQuestionId % 4) + 1}: RESILIENT ARCHITECTURES (${20 + (currentQuestionId % 5) * 2}%)`,
      estimatedTime: '2m 00s',
      stem: `An enterprise workload on AWS requires high availability and cross-availability-zone load balancing for question #${currentQuestionId}. The architecture must minimize latency for distributed clients while preventing single-points-of-failure.`,
      subStem: 'Which architectural pattern is best suited according to the AWS Well-Architected Framework?',
      options: [
        { id: 'A', text: 'Deploy across multiple Availability Zones with an Application Load Balancer.' },
        { id: 'B', text: 'Deploy an EC2 instance in a single AZ with scheduled snapshot backups to S3.' },
        { id: 'C', text: 'Configure a Network Load Balancer with static Elastic IPs and cross-zone routing enabled.' },
        { id: 'D', text: 'Provision an Amazon CloudFront distribution pointing directly to private IP instances.' },
      ],
      correctOption: 'A',
      correctExplanation: 'Multi-AZ deployment behind an Application Load Balancer is the standard AWS recommended architecture for high availability and automatic health-check based failover.',
      distractorExplanations: {
        B: 'Single AZ introduces a severe Single Point of Failure.',
        C: 'NLB operates at Layer 4, which is unnecessary unless extreme TCP throughput or static IPs are strictly required.',
        D: 'CloudFront cannot directly target private IP addresses inside a VPC without public DNS or VPC origins.',
      },
      referenceDoc: 'Ref: AWS Well-Architected Reliability Pillar',
      selectedOption: undefined,
      flagged: false,
    };
  }

  const handleSelectOption = (optId: 'A' | 'B' | 'C' | 'D') => {
    const updated = questions.map((q) => {
      if (q.id === currentQuestionId) {
        return { ...q, selectedOption: optId };
      }
      return q;
    });
    if (!questions.some((q) => q.id === currentQuestionId)) {
      setQuestions([...questions, { ...currentQ!, selectedOption: optId }]);
    } else {
      setQuestions(updated);
    }
  };

  const handleToggleEliminate = (optId: 'A' | 'B' | 'C' | 'D', e: React.MouseEvent) => {
    e.stopPropagation();
    const currElim = currentQ?.eliminatedOptions || [];
    const newElim = currElim.includes(optId)
      ? currElim.filter((o) => o !== optId)
      : [...currElim, optId];

    const updated = questions.map((q) => {
      if (q.id === currentQuestionId) {
        return { ...q, eliminatedOptions: newElim };
      }
      return q;
    });
    if (!questions.some((q) => q.id === currentQuestionId)) {
      setQuestions([...questions, { ...currentQ!, eliminatedOptions: newElim }]);
    } else {
      setQuestions(updated);
    }
  };

  const handleToggleFlag = () => {
    const isFlagged = !currentQ?.flagged;
    const updated = questions.map((q) => {
      if (q.id === currentQuestionId) {
        return { ...q, flagged: isFlagged };
      }
      return q;
    });
    if (!questions.some((q) => q.id === currentQuestionId)) {
      setQuestions([...questions, { ...currentQ!, flagged: isFlagged }]);
    } else {
      setQuestions(updated);
    }
  };

  // 65 questions summary calculations
  const totalQuestions = 65;
  const answeredCount = questions.filter((q) => q.selectedOption !== undefined).length + (currentQ.selectedOption ? 0 : 0);
  const flaggedCount = questions.filter((q) => q.flagged).length;
  const unansweredCount = totalQuestions - Math.max(answeredCount, 24);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Benchmark Exam Ribbon */}
      <div className="rounded-2xl bg-[#171b26] border border-[#262a35] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#8083ff]/15 text-[#8083ff] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#ffb95f] font-bold">
                OFFICIAL BENCHMARK SIMULATION • TEST #03
              </span>
              <span className="text-[#313540]">|</span>
              <span className="text-[11px] font-mono-code text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Telemetry Synced</span>
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-display font-bold text-white">
              AWS Solutions Architect Associate (SAA-C03) Exam Lab
            </h2>
          </div>
        </div>

        {/* Timer, Flag, and End Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Real-time Countdown Timer */}
          <div className="flex items-center gap-2 bg-[#0a0e18] px-3.5 py-2 rounded-xl border border-[#262a35]">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">timer</span>
            <span className="font-mono-code text-xs sm:text-sm font-bold text-white tracking-wider">
              {formatTimer(timerSeconds)}
            </span>
            <button
              onClick={() => setIsTimerPaused(!isTimerPaused)}
              className="ml-1 text-[#908fa0] hover:text-white transition-colors"
              title={isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isTimerPaused ? 'play_arrow' : 'pause'}
              </span>
            </button>
          </div>

          {/* Flag For Review */}
          <button
            onClick={handleToggleFlag}
            className={`px-3.5 py-2 rounded-xl border text-xs font-mono-code flex items-center gap-1.5 transition-all ${
              currentQ?.flagged
                ? 'bg-[#ffb95f]/15 border-[#ffb95f] text-[#ffb95f]'
                : 'bg-[#262a35] border-[#313540] text-[#dfe2f1] hover:text-[#ffb95f]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {currentQ?.flagged ? 'flag' : 'outlined_flag'}
            </span>
            <span>{currentQ?.flagged ? 'Flagged' : 'Flag for Review'}</span>
          </button>

          {/* End Exam Button */}
          <button
            onClick={() => setShowEndExamModal(true)}
            className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-200 text-xs font-bold font-mono-code transition-all"
          >
            End Exam
          </button>
        </div>
      </div>

      {/* Progress Bar & Legend */}
      <div className="rounded-xl bg-[#171b26] border border-[#262a35] p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono-code">
          <span className="text-[#dfe2f1] font-semibold">
            Question {currentQuestionId} of 65 answered ({Math.round((24 / 65) * 100)}% Complete)
          </span>
          <div className="flex items-center gap-4 text-[11px] text-[#908fa0]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#8083ff]"></span>
              <span>Answered (24)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ffb95f]"></span>
              <span>Flagged ({flaggedCount})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#313540]"></span>
              <span>Unanswered (39)</span>
            </span>
          </div>
        </div>

        {/* Bar */}
        <div className="w-full bg-[#0a0e18] h-2 rounded-full overflow-hidden flex">
          <div className="bg-[#8083ff] h-full" style={{ width: '37%' }}></div>
          <div className="bg-[#ffb95f] h-full" style={{ width: '6%' }}></div>
          <div className="bg-[#1c1f2a] h-full" style={{ width: '57%' }}></div>
        </div>
      </div>

      {/* Main Grid: Left Question + Explanations | Right Question Jump Grid & Scratchpad */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 cols: Active Question stem, options, explanation */}
        <div className="lg:col-span-8 space-y-6">
          {/* Question Card */}
          <div className="rounded-2xl bg-[#171b26] border border-[#262a35] p-6 lg:p-8 space-y-6">
            {/* Header info */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-[#262a35]">
              <div className="flex items-center gap-3">
                <span className="font-mono-code text-sm font-bold text-white">
                  QUESTION {currentQuestionId} OF 65
                </span>
                <span className="text-[#313540]">|</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#4cd7f6]/10 text-[#4cd7f6] text-[10px] font-mono-code font-bold">
                  {currentQ?.domain}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono-code text-[#908fa0]">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span>{currentQ?.estimatedTime}</span>
              </div>
            </div>

            {/* Question Stem */}
            <div className="space-y-3">
              <p className="text-sm sm:text-base text-[#dfe2f1] font-body leading-relaxed">
                {currentQ?.stem}
              </p>
              {currentQ?.subStem && (
                <p className="text-sm font-bold text-white font-body leading-relaxed pt-1">
                  {currentQ?.subStem}
                </p>
              )}
            </div>

            {/* Multiple Choice Options (A, B, C, D) */}
            <div className="space-y-3 pt-2">
              {currentQ?.options.map((opt) => {
                const isSelected = currentQ?.selectedOption === opt.id;
                const isEliminated = currentQ?.eliminatedOptions?.includes(opt.id);

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-4 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all flex items-start gap-3 relative group ${
                      isSelected
                        ? 'bg-[#8083ff]/15 border-[#8083ff] text-white shadow-sm ring-1 ring-[#8083ff]/40'
                        : isEliminated
                        ? 'bg-[#0a0e18]/40 border-[#262a35] text-[#908fa0] line-through opacity-60'
                        : 'bg-[#0a0e18] border-[#262a35] text-[#c7c4d7] hover:border-[#464554] hover:bg-[#1c1f2a]'
                    }`}
                  >
                    {/* Choice Letter Radio */}
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 font-mono-code text-xs font-bold transition-colors ${
                        isSelected
                          ? 'border-[#8083ff] bg-[#8083ff] text-white'
                          : 'border-[#464554] bg-[#171b26] text-[#dfe2f1] group-hover:border-[#908fa0]'
                      }`}
                    >
                      {opt.id}
                    </div>

                    {/* Option Text */}
                    <span className="flex-1 leading-relaxed pr-10">{opt.text}</span>

                    {/* Strikethrough Distractor Eliminator Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleEliminate(opt.id, e)}
                      title={isEliminated ? 'Restore option' : 'Eliminate distractor'}
                      className={`absolute right-3 top-3.5 p-1 rounded hover:bg-[#262a35] text-xs font-mono-code transition-colors ${
                        isEliminated ? 'text-red-400 font-bold' : 'text-[#908fa0] hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">strikethrough_s</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Question Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#262a35] flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <button
                  disabled={currentQuestionId <= 1}
                  onClick={() => setCurrentQuestionId(Math.max(1, currentQuestionId - 1))}
                  className="px-4 py-2 rounded-xl bg-[#262a35] hover:bg-[#313540] disabled:opacity-30 text-xs font-mono-code text-[#dfe2f1] flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => handleSelectOption(undefined as unknown as 'A')}
                  className="px-3 py-2 rounded-xl bg-transparent hover:bg-[#262a35] text-xs font-mono-code text-[#908fa0] hover:text-white"
                >
                  Clear Selection
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-mono-code flex items-center gap-1.5 transition-all ${
                    showExplanation
                      ? 'bg-[#4cd7f6]/15 border-[#4cd7f6] text-[#4cd7f6]'
                      : 'bg-[#262a35] border-[#313540] text-[#dfe2f1] hover:text-[#4cd7f6]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span>{showExplanation ? 'Hide Explanation & Topology' : 'Show Explanation & Topology'}</span>
                </button>

                <button
                  disabled={currentQuestionId >= 65}
                  onClick={() => setCurrentQuestionId(Math.min(65, currentQuestionId + 1))}
                  className="px-5 py-2 rounded-xl bg-[#8083ff] hover:bg-[#8083ff]/90 disabled:opacity-30 text-xs font-bold font-mono-code text-white flex items-center gap-1.5 shadow-md"
                >
                  <span>Next</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Explanation & Cross-Region Architecture Map */}
          {showExplanation && (
            <div className="rounded-2xl bg-[#171b26] border border-[#262a35] p-6 lg:p-8 space-y-6 animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#262a35]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">hub</span>
                  <h3 className="text-base font-display font-bold text-white">
                    Architectural Deep Dive & Cross-Region Topology
                  </h3>
                </div>
                <span className="font-mono-code text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold">
                  Correct Answer: Option {currentQ?.correctOption}
                </span>
              </div>

              {/* Rationale Text */}
              <div className="p-4 rounded-xl bg-[#0a0e18] border border-[#262a35] space-y-2">
                <h4 className="text-xs font-bold text-white font-mono-code uppercase">
                  Why Option {currentQ?.correctOption} is the Optimal Architecture:
                </h4>
                <p className="text-xs text-[#dfe2f1] leading-relaxed font-body">
                  {currentQ?.correctExplanation}
                </p>
                <div className="text-[11px] font-mono-code text-[#4cd7f6] pt-1">
                  {currentQ?.referenceDoc}
                </div>
              </div>

              {/* Interactive Cross-Region SVG Diagram */}
              <div className="p-4 rounded-xl bg-[#0a0e18] border border-[#262a35] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono-code uppercase text-[#908fa0]">
                    Topology: Amazon ElastiCache for Redis Global Datastore Flow
                  </span>
                  <span className="text-[10px] font-mono-code text-[#4cd7f6]">
                    Replication Lag: &lt; 1000ms
                  </span>
                </div>

                <div className="w-full bg-[#171b26] rounded-xl p-4 border border-[#262a35] overflow-x-auto">
                  <svg className="w-full min-w-[560px] h-48" viewBox="0 0 600 160">
                    <defs>
                      <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8083ff" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.8" />
                      </linearGradient>
                      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#4cd7f6" />
                      </marker>
                    </defs>

                    {/* Route 53 Header */}
                    <rect x="230" y="8" width="140" height="32" rx="6" fill="#0f131d" stroke="#8083ff" strokeWidth="1.5" />
                    <text x="300" y="28" fill="#c0c1ff" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                      Route 53 (LBR)
                    </text>

                    {/* Connection Lines from Route 53 to Regions */}
                    <path d="M 270 40 L 120 75" fill="none" stroke="#464554" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d="M 330 40 L 480 75" fill="none" stroke="#464554" strokeWidth="1.5" strokeDasharray="3 3" />

                    {/* Primary Region Box (us-east-1) */}
                    <rect x="20" y="65" width="220" height="85" rx="8" fill="#0a0e18" stroke="#4cd7f6" strokeWidth="1.5" />
                    <text x="32" y="82" fill="#4cd7f6" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                      REGION A: us-east-1 (Primary)
                    </text>
                    <rect x="35" y="92" width="85" height="46" rx="4" fill="#1c1f2a" stroke="#313540" />
                    <text x="77" y="112" fill="#dfe2f1" fontSize="10" textAnchor="middle">App / Web</text>
                    <text x="77" y="126" fill="#908fa0" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">EC2 Fleets</text>

                    <rect x="135" y="92" width="90" height="46" rx="4" fill="#ca8100" fillOpacity="0.2" stroke="#ffb95f" />
                    <text x="180" y="112" fill="#ffb95f" fontSize="10" fontWeight="bold" textAnchor="middle">Primary Redis</text>
                    <text x="180" y="126" fill="#ffb95f" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">Read/Write Cluster</text>

                    {/* Cross-Region Replication Arrow */}
                    <path d="M 225 115 L 365 115" fill="none" stroke="#4cd7f6" strokeWidth="2" markerEnd="url(#arrow)" />
                    <text x="295" y="108" fill="#4cd7f6" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                      Sync Replication &lt; 1s
                    </text>

                    {/* Secondary Region Box (us-west-2) */}
                    <rect x="360" y="65" width="220" height="85" rx="8" fill="#0a0e18" stroke="#313540" strokeWidth="1.5" />
                    <text x="372" y="82" fill="#908fa0" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                      REGION B: us-west-2 (Standby)
                    </text>
                    <rect x="375" y="92" width="90" height="46" rx="4" fill="#03b5d3" fillOpacity="0.15" stroke="#4cd7f6" />
                    <text x="420" y="112" fill="#4cd7f6" fontSize="10" fontWeight="bold" textAnchor="middle">Replica Redis</text>
                    <text x="420" y="126" fill="#4cd7f6" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">Fast Local Reads</text>

                    <rect x="480" y="92" width="85" height="46" rx="4" fill="#1c1f2a" stroke="#313540" />
                    <text x="522" y="112" fill="#dfe2f1" fontSize="10" textAnchor="middle">Standby App</text>
                    <text x="522" y="126" fill="#908fa0" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">Auto-Promotion</text>
                  </svg>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white font-mono-code uppercase">
                  Service Decision Matrix (Exam Rationale)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono-code">
                    <thead>
                      <tr className="border-b border-[#262a35] text-[#908fa0] text-[10px]">
                        <th className="py-2 px-3">Service</th>
                        <th className="py-2 px-3">Sub-ms Latency</th>
                        <th className="py-2 px-3">Multi-Region Replication</th>
                        <th className="py-2 px-3">Operational Complexity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262a35] text-[#dfe2f1]">
                      <tr className="bg-emerald-950/20">
                        <td className="py-2 px-3 font-bold text-emerald-400">ElastiCache Global Datastore</td>
                        <td className="py-2 px-3 text-emerald-400">Yes (&lt; 1ms local read)</td>
                        <td className="py-2 px-3 text-emerald-400">Native Fully-Managed</td>
                        <td className="py-2 px-3 text-emerald-400">Minimal (Managed Failover)</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-[#ffb4ab]">Memcached</td>
                        <td className="py-2 px-3 text-white">Yes</td>
                        <td className="py-2 px-3 text-[#ffb4ab]">No (Single Cluster Only)</td>
                        <td className="py-2 px-3 text-[#ffb4ab]">High (Manual Mirroring)</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-[#ffb95f]">DynamoDB + DAX</td>
                        <td className="py-2 px-3 text-white">Yes (Microsecond)</td>
                        <td className="py-2 px-3 text-[#ffb95f]">Single-Region DAX only</td>
                        <td className="py-2 px-3 text-[#ffb95f]">High (Custom Lambda sync)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 4 cols: Question Jump Grid, Scratchpad, Domain Weighting */}
        <div className="lg:col-span-4 space-y-6">
          {/* 65-Question Grid Navigator */}
          <div className="rounded-2xl bg-[#171b26] border border-[#262a35] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white font-mono-code uppercase">Question Jump Grid</h4>
              <span className="text-[11px] font-mono-code text-[#4cd7f6]">65 Questions</span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#0a0e18] p-1 rounded-xl border border-[#262a35]">
              {(['all', 'flagged', 'unanswered'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setQuestionFilter(f)}
                  className={`flex-1 py-1 text-[11px] font-mono-code rounded-lg capitalize transition-all ${
                    questionFilter === f
                      ? 'bg-[#262a35] text-white shadow-sm'
                      : 'text-[#908fa0] hover:text-[#dfe2f1]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Grid of 65 numbers */}
            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-1.5 max-h-64 overflow-y-auto pr-1">
              {Array.from({ length: 65 }, (_, i) => i + 1).map((num) => {
                const isCurrent = num === currentQuestionId;
                const found = questions.find((q) => q.id === num);
                const isAnswered = (found?.selectedOption !== undefined) || (num <= 24 && !found?.selectedOption);
                const isFlagged = found?.flagged || num === 3 || num === 12;

                if (questionFilter === 'flagged' && !isFlagged) return null;
                if (questionFilter === 'unanswered' && isAnswered) return null;

                return (
                  <button
                    key={num}
                    onClick={() => setCurrentQuestionId(num)}
                    className={`h-8 rounded-lg text-[11px] font-mono-code font-semibold transition-all relative flex items-center justify-center ${
                      isCurrent
                        ? 'bg-[#8083ff] text-white ring-2 ring-white shadow-md'
                        : isFlagged
                        ? 'bg-[#ca8100]/20 text-[#ffb95f] border border-[#ffb95f]'
                        : isAnswered
                        ? 'bg-[#1c1f2a] text-[#dfe2f1] border border-[#4cd7f6]/40'
                        : 'bg-[#0a0e18] text-[#908fa0] border border-[#262a35] hover:border-[#464554]'
                    }`}
                  >
                    <span>{num}</span>
                    {isFlagged && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffb95f] absolute top-1 right-1"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Architect's Scratchpad */}
          <div className="rounded-2xl bg-[#171b26] border border-[#262a35] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">edit_note</span>
                <h4 className="text-xs font-bold text-white font-mono-code uppercase">Architect&apos;s Scratchpad</h4>
              </div>
              <button
                onClick={() => setScratchpad('')}
                className="text-[10px] font-mono-code text-[#908fa0] hover:text-white"
              >
                Clear
              </button>
            </div>

            <textarea
              value={scratchpad}
              onChange={(e) => setScratchpad(e.target.value)}
              rows={4}
              placeholder="Jot down CIDR math, storage formulas, or port mappings..."
              className="w-full bg-[#0a0e18] border border-[#262a35] rounded-xl p-3 text-xs font-mono-code text-[#dfe2f1] placeholder-[#908fa0] focus:border-[#4cd7f6] outline-none transition-colors resize-none"
            />
            <div className="flex items-center justify-between text-[10px] font-mono-code text-[#908fa0]">
              <span>Auto-saved to session state</span>
              <span>{scratchpad.length} chars</span>
            </div>
          </div>

          {/* Domain Weighting Progress */}
          <div className="rounded-2xl bg-[#171b26] border border-[#262a35] p-5 space-y-3">
            <h4 className="text-xs font-bold text-white font-mono-code uppercase">Domain Weighting</h4>
            <div className="space-y-2 text-xs font-mono-code">
              <div>
                <div className="flex justify-between text-[11px] text-[#908fa0]">
                  <span>1. Resilient (30%)</span>
                  <span className="text-[#4cd7f6]">80% Score</span>
                </div>
                <div className="w-full bg-[#0a0e18] h-1.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-[#4cd7f6] h-full rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-[#908fa0]">
                  <span>2. High-Performing (28%)</span>
                  <span className="text-[#8083ff]">84% Score</span>
                </div>
                <div className="w-full bg-[#0a0e18] h-1.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-[#8083ff] h-full rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-[#908fa0]">
                  <span>3. Secure (24%)</span>
                  <span className="text-[#ffb4ab]">58% Score</span>
                </div>
                <div className="w-full bg-[#0a0e18] h-1.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-[#ffb4ab] h-full rounded-full" style={{ width: '58%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-[#908fa0]">
                  <span>4. Cost-Optimized (18%)</span>
                  <span className="text-emerald-400">86% Score</span>
                </div>
                <div className="w-full bg-[#0a0e18] h-1.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '86%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* End Exam Confirmation Modal */}
      {showEndExamModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c1f2a] border border-[#313540] rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[28px]">assessment</span>
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-white">End Simulation Exam #03?</h3>
                <p className="text-xs text-[#c7c4d7] mt-1">
                  You have answered <strong className="text-white">24</strong> out of 65 questions. {unansweredCount} questions remain unanswered.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35] text-left text-xs font-mono-code space-y-1">
                <div className="flex justify-between text-[#dfe2f1]">
                  <span>Projected Raw Score:</span>
                  <span className="font-bold text-emerald-400">810 / 1000 (Pass)</span>
                </div>
                <div className="flex justify-between text-[#908fa0]">
                  <span>Passing Cutoff:</span>
                  <span>720 Pts (72%)</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowEndExamModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#262a35] hover:bg-[#313540] text-xs font-semibold text-[#dfe2f1]"
                >
                  Return to Exam
                </button>
                <button
                  onClick={() => {
                    setShowEndExamModal(false);
                    onNavigate('my-study-dashboard');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] text-xs font-bold text-[#0f131d] shadow-md"
                >
                  Submit & View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
