import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SAP_C02_DOMAIN_1_100_FLASHCARDS, SapC02Flashcard } from '../data/sapC02Domain1FlashcardsData';
import { SAP_C02_DOMAIN_2_100_FLASHCARDS } from '../data/sapC02Domain2FlashcardsData';
import { SAP_C02_DOMAIN_3_100_FLASHCARDS } from '../data/sapC02Domain3FlashcardsData';
import { SAP_C02_DOMAIN_4_100_FLASHCARDS } from '../data/sapC02Domain4FlashcardsData';

interface SapC02LearningHubProps {
  initialMode?: 'flashcards' | 'blueprint';
  onNavigate?: (tab: string) => void;
}

export const SAP_C02_METADATA = {
  code: 'SAP-C02',
  title: 'AWS Certified Solutions Architect – Professional',
  level: 'Professional',
  passingScore: '750 / 1000 (scaled score)',
  duration: '180 minutes (3 hours)',
  questionsCount: '75 questions (scenario-based, multi-step architecture questions)',
  domains: [
    { number: 1, name: 'Design Solutions for Organizational Complexity', weight: '26%', cardsCount: 100, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    { number: 2, name: 'Design for New Solutions', weight: '29%', cardsCount: 100, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    { number: 3, name: 'Continuous Improvement for Existing Solutions', weight: '25%', cardsCount: 100, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
    { number: 4, name: 'Accelerate Workload Migration and Modernization', weight: '20%', cardsCount: 100, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  ],
};

export const SapC02LearningHub: React.FC<SapC02LearningHubProps> = ({
  initialMode = 'flashcards',
  onNavigate,
}) => {
  const { language } = useLanguage();

  const [activeView, setActiveView] = useState<'flashcards' | 'blueprint'>(initialMode);
  const [selectedDomain, setSelectedDomain] = useState<1 | 2 | 3 | 4 | 'all'>(1);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'mastered' | 'review'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [showGridModal, setShowGridModal] = useState<boolean>(false);
  const [selectedBlueprintDomain, setSelectedBlueprintDomain] = useState<1 | 2 | 3 | 4>(1);

  // Combined pool of all 400 cards across 4 domains
  const allCardsPool = useMemo(() => {
    return [
      ...SAP_C02_DOMAIN_1_100_FLASHCARDS,
      ...SAP_C02_DOMAIN_2_100_FLASHCARDS,
      ...SAP_C02_DOMAIN_3_100_FLASHCARDS,
      ...SAP_C02_DOMAIN_4_100_FLASHCARDS,
    ];
  }, []);

  // Filter cards by selected domain
  const domainFilteredCards = useMemo(() => {
    if (selectedDomain === 1) return SAP_C02_DOMAIN_1_100_FLASHCARDS;
    if (selectedDomain === 2) return SAP_C02_DOMAIN_2_100_FLASHCARDS;
    if (selectedDomain === 3) return SAP_C02_DOMAIN_3_100_FLASHCARDS;
    if (selectedDomain === 4) return SAP_C02_DOMAIN_4_100_FLASHCARDS;
    return allCardsPool;
  }, [selectedDomain, allCardsPool]);

  // Mastered / Review persistence via localStorage
  const [masteredCardIds, setMasteredCardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cloudor_sapc02_all_mastered');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviewCardIds, setReviewCardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cloudor_sapc02_all_review');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cloudor_sapc02_all_mastered', JSON.stringify(masteredCardIds));
    } catch (e) {
      console.error(e);
    }
  }, [masteredCardIds]);

  useEffect(() => {
    try {
      localStorage.setItem('cloudor_sapc02_all_review', JSON.stringify(reviewCardIds));
    } catch (e) {
      console.error(e);
    }
  }, [reviewCardIds]);

  // Available categories for currently active domain
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    domainFilteredCards.forEach((c) => cats.add(c.category));
    return Array.from(cats).sort();
  }, [domainFilteredCards]);

  // Full filtering pipeline
  const filteredCards = useMemo(() => {
    let result = [...domainFilteredCards];

    if (selectedCategoryFilter !== 'all') {
      result = result.filter((c) => c.category === selectedCategoryFilter);
    }

    if (selectedDifficultyFilter !== 'all') {
      result = result.filter((c) => c.difficulty === selectedDifficultyFilter);
    }

    if (selectedStatusFilter === 'mastered') {
      result = result.filter((c) => masteredCardIds.includes(c.id));
    } else if (selectedStatusFilter === 'review') {
      result = result.filter((c) => reviewCardIds.includes(c.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.question.toLowerCase().includes(q) ||
          c.answer.toLowerCase().includes(q) ||
          c.keyRule.toLowerCase().includes(q) ||
          c.examTip.toLowerCase().includes(q) ||
          c.topic.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    if (isShuffled) {
      const shuffled = [...result];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    return result;
  }, [
    domainFilteredCards,
    selectedCategoryFilter,
    selectedDifficultyFilter,
    selectedStatusFilter,
    masteredCardIds,
    reviewCardIds,
    searchQuery,
    isShuffled,
  ]);

  // Reset index & flip when filters change
  useEffect(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [selectedDomain, selectedCategoryFilter, selectedDifficultyFilter, selectedStatusFilter, searchQuery, isShuffled]);

  const currentCard: SapC02Flashcard | undefined = filteredCards[currentCardIndex];

  const handleNext = useCallback(() => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % filteredCards.length);
  }, [filteredCards.length]);

  const handlePrev = useCallback(() => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  }, [filteredCards.length]);

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const toggleMastered = useCallback(
    (id: number) => {
      setMasteredCardIds((prev) => {
        if (prev.includes(id)) {
          return prev.filter((item) => item !== id);
        } else {
          setReviewCardIds((rPrev) => rPrev.filter((item) => item !== id));
          return [...prev, id];
        }
      });
    },
    []
  );

  const toggleReview = useCallback(
    (id: number) => {
      setReviewCardIds((prev) => {
        if (prev.includes(id)) {
          return prev.filter((item) => item !== id);
        } else {
          setMasteredCardIds((mPrev) => mPrev.filter((item) => item !== id));
          return [...prev, id];
        }
      });
    },
    []
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showGridModal) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        toggleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.code === 'KeyM' && currentCard) {
        e.preventDefault();
        toggleMastered(currentCard.id);
      } else if (e.code === 'KeyR' && currentCard) {
        e.preventDefault();
        toggleReview(currentCard.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFlip, handleNext, handlePrev, toggleMastered, toggleReview, currentCard, showGridModal]);

  // Overall stats
  const totalMasteredCount = useMemo(() => {
    return allCardsPool.filter((c) => masteredCardIds.includes(c.id)).length;
  }, [allCardsPool, masteredCardIds]);

  const domainMasteredCounts = useMemo(() => {
    return {
      1: SAP_C02_DOMAIN_1_100_FLASHCARDS.filter((c) => masteredCardIds.includes(c.id)).length,
      2: SAP_C02_DOMAIN_2_100_FLASHCARDS.filter((c) => masteredCardIds.includes(c.id)).length,
      3: SAP_C02_DOMAIN_3_100_FLASHCARDS.filter((c) => masteredCardIds.includes(c.id)).length,
      4: SAP_C02_DOMAIN_4_100_FLASHCARDS.filter((c) => masteredCardIds.includes(c.id)).length,
    };
  }, [masteredCardIds]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#161b26] via-[#10141e] to-[#0b0e15] border border-amber-500/20 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              AWS Professional Certification • 400 Scenario Flashcards
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              AWS Solutions Architect – <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">Professional (SAP-C02)</span>
            </h1>
            <p className="text-[#94a3b8] text-sm sm:text-base leading-relaxed">
              Master all 4 exam domains with 100 scenario-based architectural flashcards per domain (400 total). Covers complex multi-account governance, multi-region disaster recovery, hybrid Direct Connect, deep container & serverless decoupling, and petabyte-scale migration cutovers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => setActiveView('flashcards')}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                activeView === 'flashcards'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-amber-500/25'
                  : 'bg-[#1e2433] hover:bg-[#252d3f] text-[#cbd5e1] border border-white/10'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              400 Flashcards Hub
            </button>

            <button
              onClick={() => setActiveView('blueprint')}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                activeView === 'blueprint'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-amber-500/25'
                  : 'bg-[#1e2433] hover:bg-[#252d3f] text-[#cbd5e1] border border-white/10'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exam Blueprint Guide
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SAP_C02_METADATA.domains.map((dom) => {
            const mastered = domainMasteredCounts[dom.number as 1 | 2 | 3 | 4];
            const pct = Math.round((mastered / dom.cardsCount) * 100);
            return (
              <div
                key={dom.number}
                onClick={() => {
                  setSelectedDomain(dom.number as 1 | 2 | 3 | 4);
                  setActiveView('flashcards');
                }}
                className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                  selectedDomain === dom.number && activeView === 'flashcards'
                    ? `${dom.bg} ${dom.border} shadow-lg shadow-black/40 ring-1 ring-amber-400/50`
                    : 'bg-[#121620]/80 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-[#94a3b8]">D{dom.number} ({dom.weight})</span>
                  <span className={`font-bold ${dom.color}`}>{mastered} / {dom.cardsCount}</span>
                </div>
                <div className="text-xs font-semibold text-white truncate mb-2" title={dom.name}>
                  {dom.name}
                </div>
                <div className="w-full bg-[#1e2433] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeView === 'flashcards' ? (
        <div className="space-y-6">
          {/* Domain Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
            <button
              onClick={() => setSelectedDomain('all')}
              className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedDomain === 'all'
                  ? 'bg-amber-500 text-white font-bold shadow-lg shadow-amber-500/25'
                  : 'bg-[#181d2a] text-[#94a3b8] hover:text-white hover:bg-[#202738]'
              }`}
            >
              <span>All 400 Flashcards</span>
              <span className="px-2 py-0.5 rounded-full bg-black/30 text-xs font-mono">{totalMasteredCount}/400</span>
            </button>

            {SAP_C02_METADATA.domains.map((dom) => (
              <button
                key={dom.number}
                onClick={() => setSelectedDomain(dom.number as 1 | 2 | 3 | 4)}
                className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedDomain === dom.number
                    ? 'bg-amber-500 text-white font-bold shadow-lg shadow-amber-500/25'
                    : 'bg-[#181d2a] text-[#94a3b8] hover:text-white hover:bg-[#202738]'
                }`}
              >
                <span>D{dom.number}: {dom.name.split(' ')[0]} ({dom.weight})</span>
                <span className="px-2 py-0.5 rounded-full bg-black/30 text-xs font-mono">
                  {domainMasteredCounts[dom.number as 1 | 2 | 3 | 4]}/100
                </span>
              </button>
            ))}
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-[#141923] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="relative w-full md:w-80">
              <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search question, rule, tip, topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0c1017] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-[#64748b] focus:outline-none focus:border-amber-400 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94a3b8] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
              {/* Category Filter */}
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-[#0c1017] border border-white/10 rounded-xl text-xs sm:text-sm text-[#cbd5e1] focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Categories</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Difficulty Filter */}
              <select
                value={selectedDifficultyFilter}
                onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
                className="px-3 py-2 bg-[#0c1017] border border-white/10 rounded-xl text-xs sm:text-sm text-[#cbd5e1] focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Difficulties</option>
                <option value="Foundational">Foundational</option>
                <option value="Standard">Standard</option>
                <option value="Advanced">Advanced</option>
              </select>

              {/* Status Filter */}
              <div className="flex items-center rounded-xl bg-[#0c1017] border border-white/10 p-1">
                <button
                  onClick={() => setSelectedStatusFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedStatusFilter === 'all' ? 'bg-amber-500 text-white' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  All ({filteredCards.length})
                </button>
                <button
                  onClick={() => setSelectedStatusFilter('mastered')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedStatusFilter === 'mastered' ? 'bg-emerald-500 text-white' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Mastered
                </button>
                <button
                  onClick={() => setSelectedStatusFilter('review')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedStatusFilter === 'review' ? 'bg-rose-500 text-white' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Review
                </button>
              </div>

              {/* Shuffle button */}
              <button
                onClick={() => setIsShuffled((prev) => !prev)}
                title="Shuffle flashcards"
                className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
                  isShuffled
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-[#0c1017] border-white/10 text-[#94a3b8] hover:text-white hover:bg-[#1a2130]'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">Shuffle</span>
              </button>

              {/* Grid Overview Modal Trigger */}
              <button
                onClick={() => setShowGridModal(true)}
                title="View All Cards in Grid"
                className="px-3 py-2 bg-[#0c1017] hover:bg-[#1a2130] border border-white/10 rounded-xl text-xs sm:text-sm text-[#cbd5e1] hover:text-white transition-all flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="hidden sm:inline">Grid Overview</span>
              </button>
            </div>
          </div>

          {/* Flashcard Main Display Area */}
          {filteredCards.length > 0 && currentCard ? (
            <div className="space-y-4">
              {/* Card Meta Banner */}
              <div className="flex items-center justify-between text-xs text-[#94a3b8] px-2 font-mono">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 font-bold border border-amber-500/30">
                    Card #{currentCard.id}
                  </span>
                  <span className="text-[#cbd5e1] font-semibold">{currentCard.domainName.split(':')[0]}</span>
                  <span className="text-[#64748b]">•</span>
                  <span>{currentCard.category}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      currentCard.difficulty === 'Advanced'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                        : currentCard.difficulty === 'Standard'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {currentCard.difficulty}
                  </span>
                  <span>
                    {currentCardIndex + 1} of {filteredCards.length}
                  </span>
                </div>
              </div>

              {/* 3D Interactive Card Flip Container */}
              <div
                onClick={toggleFlip}
                className="relative min-h-[360px] sm:min-h-[420px] w-full cursor-pointer select-none rounded-3xl bg-gradient-to-br from-[#161c29] via-[#10141e] to-[#0a0d13] border-2 border-white/10 hover:border-amber-500/40 p-6 sm:p-10 shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Top Badge Indicators */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-[#94a3b8] border border-white/10">
                      {currentCard.topic}
                    </span>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleMastered(currentCard.id)}
                      className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                        masteredCardIds.includes(currentCard.id)
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                          : 'bg-white/5 hover:bg-white/10 text-[#94a3b8]'
                      }`}
                      title="Mark as Mastered (Press M)"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="hidden sm:inline">Mastered</span>
                    </button>

                    <button
                      onClick={() => toggleReview(currentCard.id)}
                      className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                        reviewCardIds.includes(currentCard.id)
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                          : 'bg-white/5 hover:bg-white/10 text-[#94a3b8]'
                      }`}
                      title="Mark for Review (Press R)"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="hidden sm:inline">Review</span>
                    </button>
                  </div>
                </div>

                {/* Card Content Front/Back */}
                {!isFlipped ? (
                  /* FRONT: Scenario Question */
                  <div className="my-auto py-8">
                    <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Architectural Scenario Question:
                    </div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-snug">
                      {currentCard.question}
                    </div>
                    <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#94a3b8] font-mono group-hover:text-amber-400 transition-colors">
                      <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Click card or press [Space] to reveal architectural solution
                    </div>
                  </div>
                ) : (
                  /* BACK: Solution, Key Rule, Exam Tip, Official Doc */
                  <div className="my-auto py-4 space-y-4">
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Target Architecture & Answer:
                      </div>
                      <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed">
                        {currentCard.answer}
                      </p>
                    </div>

                    {/* Key Architectural Rule */}
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-200">
                      <span className="font-bold text-amber-400 uppercase tracking-wide mr-1.5 font-mono">
                        Key Rule:
                      </span>
                      {currentCard.keyRule}
                    </div>

                    {/* Pro Exam Tip */}
                    <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs sm:text-sm text-purple-200">
                      <span className="font-bold text-purple-400 uppercase tracking-wide mr-1.5 font-mono">
                        SAP-C02 Exam Tip:
                      </span>
                      {currentCard.examTip}
                    </div>

                    {/* Official Documentation Link */}
                    <div className="pt-2 flex items-center justify-between text-xs" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={currentCard.officialDocUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-mono underline underline-offset-4"
                      >
                        Official AWS Documentation
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>

                      <span className="text-[#64748b] font-mono text-[11px]">
                        Click card or press [Space] to flip back
                      </span>
                    </div>
                  </div>
                )}

                {/* Footer Progress inside Card */}
                <div className="flex items-center justify-between text-xs text-[#64748b] pt-4 border-t border-white/5 font-mono">
                  <span>Shortcut keys: [← / →] Prev/Next • [Space] Flip • [M] Mastered • [R] Review</span>
                  <span>SAP-C02 Professional</span>
                </div>
              </div>

              {/* Navigation Controls Bar */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  onClick={handlePrev}
                  className="px-6 py-3 bg-[#181d2a] hover:bg-[#202738] border border-white/10 hover:border-amber-400/40 rounded-xl text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous Card
                </button>

                {/* Jump to Card dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#94a3b8] hidden sm:inline font-mono">Jump:</span>
                  <select
                    value={currentCardIndex}
                    onChange={(e) => {
                      setIsFlipped(false);
                      setCurrentCardIndex(Number(e.target.value));
                    }}
                    className="px-3 py-2 bg-[#121622] border border-white/10 rounded-xl text-xs sm:text-sm text-white font-mono"
                  >
                    {filteredCards.map((c, idx) => (
                      <option key={c.id} value={idx}>
                        #{c.id} - {c.topic.substring(0, 32)}...
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold text-sm transition-all flex items-center gap-2 rounded-xl shadow-lg shadow-amber-500/25"
                >
                  Next Card
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            /* Empty state when filters return 0 cards */
            <div className="text-center py-20 bg-[#121622] rounded-3xl border border-white/10 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto text-2xl">
                🔍
              </div>
              <h3 className="text-xl font-bold text-white">No flashcards found</h3>
              <p className="text-sm text-[#94a3b8] max-w-md mx-auto">
                No cards match your current search query or filter combination. Try resetting your filters to view cards.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategoryFilter('all');
                  setSelectedDifficultyFilter('all');
                  setSelectedStatusFilter('all');
                }}
                className="px-6 py-2.5 bg-amber-500 text-white font-semibold text-xs rounded-xl shadow-lg hover:bg-amber-400"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        /* EXAM BLUEPRINT & GUIDE VIEW */
        <div className="space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
            {SAP_C02_METADATA.domains.map((dom) => (
              <button
                key={dom.number}
                onClick={() => setSelectedBlueprintDomain(dom.number as 1 | 2 | 3 | 4)}
                className={`px-5 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all flex items-center gap-2.5 ${
                  selectedBlueprintDomain === dom.number
                    ? 'bg-amber-500 text-white font-bold shadow-lg shadow-amber-500/25'
                    : 'bg-[#181d2a] text-[#94a3b8] hover:text-white hover:bg-[#202738]'
                }`}
              >
                <span>Domain {dom.number}: {dom.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-black/30 text-xs font-mono">{dom.weight}</span>
              </button>
            ))}
          </div>

          {/* Blueprint Domain Content Card */}
          <div className="bg-[#141923] border border-white/10 rounded-3xl p-8 space-y-8 shadow-2xl">
            {selectedBlueprintDomain === 1 && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-6">
                  <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase mb-2">
                    Domain 1 • 26% Examination Weight • 100 Flashcards
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    Design Solutions for Organizational Complexity
                  </h2>
                  <p className="text-sm text-[#94a3b8] mt-2">
                    Focuses on multi-account AWS Organizations architectures, cross-account security boundaries, centralized networking with Transit Gateway and Direct Connect, IAM Identity Center federation, and multi-account compliance monitoring.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-[#0f131d] border border-white/10 space-y-3">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <span className="text-amber-400 font-mono">1.1</span> Multi-Account Governance & Security
                    </h3>
                    <ul className="text-xs text-[#cbd5e1] space-y-2 list-disc list-inside">
                      <li>AWS Control Tower Account Factory & Guardrails (Preventive SCPs and Detective AWS Config rules)</li>
                      <li>Service Control Policies (SCPs) vs Resource Control Policies (RCPs)</li>
                      <li>Backup Vault Lock Compliance Mode & AWS Organizations policies</li>
                      <li>Delegated Administrator architecture for GuardDuty, Security Hub, and Macie</li>
                      <li>Cross-account KMS CMK sharing, Key Grants, and External ID confusion mitigation</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0f131d] border border-white/10 space-y-3">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <span className="text-amber-400 font-mono">1.2</span> Enterprise Hybrid & Inter-VPC Networking
                    </h3>
                    <ul className="text-xs text-[#cbd5e1] space-y-2 list-disc list-inside">
                      <li>AWS Transit Gateway route domains, appliance mode, and cross-account RAM sharing</li>
                      <li>Transit Gateway Multicast, inter-region peering, and MTU 8500 jumbo frame routing</li>
                      <li>AWS Network Firewall centralized inspection architectures with symmetric routing</li>
                      <li>Route 53 Resolver Private Hosted Zone VPC association across thousands of accounts</li>
                      <li>Direct Connect Gateway (DXGW) with Transit VIF and BGP routing controls</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0f131d] border border-white/10 space-y-3">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <span className="text-amber-400 font-mono">1.3</span> Centralized Observability & Threat Detection
                    </h3>
                    <ul className="text-xs text-[#cbd5e1] space-y-2 list-disc list-inside">
                      <li>CloudTrail Organization Trails with encrypted S3 log archive and tamper validation</li>
                      <li>Amazon GuardDuty automated threat remediation with EventBridge and Lambda</li>
                      <li>Amazon Security Hub Cross-Region Aggregation and automated finding ingestion</li>
                      <li>AWS CloudTrail Lake SQL queries for multi-account forensics and compliance audits</li>
                      <li>Amazon Detective multi-account graph analysis for root cause investigations</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0f131d] border border-white/10 space-y-3">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <span className="text-amber-400 font-mono">1.4</span> Identity Federation & Enterprise Directory
                    </h3>
                    <ul className="text-xs text-[#cbd5e1] space-y-2 list-disc list-inside">
                      <li>IAM Identity Center (AWS SSO) SAML 2.0 and SCIM directory synchronization with Okta/Azure AD</li>
                      <li>AWS Directory Service Managed Microsoft AD two-way transitive forest trusts</li>
                      <li>AD Connector proxy for on-premises Active Directory credential validation</li>
                      <li>IAM Session Policies and Attribute-Based Access Control (ABAC) with principal tags</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedDomain(1);
                      setActiveView('flashcards');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-sm rounded-xl shadow-lg hover:from-amber-400 hover:to-orange-500"
                  >
                    Study Domain 1 Flashcards (100 Cards) →
                  </button>
                </div>
              </div>
            )}

            {selectedBlueprintDomain === 2 && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-6">
                  <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase mb-2">
                    Domain 2 • 29% Examination Weight • 100 Flashcards
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    Design for New Solutions
                  </h2>
                  <p className="text-sm text-[#94a3b8] mt-2">
                    Focuses on high-availability and business continuity (multi-region active-active), deployment strategies (Canary/Linear, AppSpec hooks, CloudFormation drift), high-performance computing (EFA, FSx for Lustre), and serverless decoupled microservices.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-[#0f131d] border border-white/10 space-y-3">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <span className="text-emerald-400 font-mono">2.1</span> Deployment Automation & CI/CD
                    </h3>
                    <ul className="text-xs text-[#cbd5e1] space-y-2 list-disc list-inside">
                      <li>CodeDeploy Canary, Linear, and AllAtOnce traffic shifting configurations</li>
                      <li>BeforeAllowTraffic and AfterAllowTraffic AppSpec lifecycle hooks for ECS and Lambda</li>
                      <li>Cross-account CodePipeline with shared KMS CMKs and S3 artifact buckets</li>
                      <li>CloudFormation Change Sets, Stack Policies, and Drift Detection</li>
                      <li>AWS AppConfig feature flags with automated CloudWatch alarm rollbacks</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0f131d] border border-white/10 space-y-3">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <span className="text-emerald-400 font-mono">2.2</span> Multi-Region Disaster Recovery
                    </h3>
                    <ul className="text-xs text-[#cbd5e1] space-y-2 list-disc list-inside">
                      <li>Amazon Aurora Global Database storage-layer replication with managed failover</li>
                      <li>DynamoDB Global Tables active-active multi-region replication and conflict resolution</li>
                      <li>Route 53 Application Recovery Controller (ARC) Routing Controls and Safety Rules</li>
                      <li>AWS Elastic Disaster Recovery (AWS DRS) continuous block replication</li>
                      <li>S3 Multi-Region Access Points (MRAP) with automated failover controls</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0f131d] border border-white/10 space-y-3">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <span className="text-emerald-400 font-mono">2.3</span> High-Performance Computing (HPC)
                    </h3>
                    <ul className="text-xs text-[#cbd5e1] space-y-2 list-disc list-inside">
                      <li>Elastic Fabric Adapter (EFA) OS-bypass networking for tightly coupled MPI</li>
                      <li>AWS ParallelCluster orchestration with Slurm scheduler and cluster placement groups</li>
                      <li>Amazon FSx for Lustre Data Repository Association (DRA) with Amazon S3</li>
                      <li>CloudFront Functions vs Lambda@Edge edge computing trade-offs</li>
                      <li>S3 prefix partitioning for 100,000+ GETs/second throughput</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0f131d] border border-white/10 space-y-3">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <span className="text-emerald-400 font-mono">2.4</span> Serverless & Asynchronous Decoupling
                    </h3>
                    <ul className="text-xs text-[#cbd5e1] space-y-2 list-disc list-inside">
                      <li>Step Functions Saga Pattern for distributed transactional rollbacks</li>
                      <li>Step Functions Standard vs Express Workflows and Distributed Map state</li>
                      <li>SQS FIFO MessageDeduplicationId and MessageGroupId partition scaling</li>
                      <li>Kinesis Data Streams Enhanced Fan-Out (EFO) with dedicated 2 MB/s pipes</li>
                      <li>API Gateway usage plans, throttling tiers, and VPC Link private integrations</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedDomain(2);
                      setActiveView('flashcards');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm rounded-xl shadow-lg hover:from-emerald-400 hover:to-teal-500"
                  >
                    Study Domain 2 Flashcards (100 Cards) →
                  </button>
                </div>
              </div>
            )}

            {selectedBlueprintDomain === 3 && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-6">
                  <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase mb-2">
                    Domain 3 • 25% Examination Weight • 100 Flashcards
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    Continuous Improvement for Existing Solutions
                  </h2>
                  <p className="text-sm text-[#94a3b8] mt-2">
                    Focuses on troubleshooting database and network bottlenecks, operational self-healing (SSM Automation, CloudWatch Composite Alarms), chaos engineering (AWS FIS), cost optimization (Graviton, Compute Optimizer, S3 Storage Lens), and monolith refactoring.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-[#0f131d] border border-white/10 space-y-3">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <span className="text-cyan-400 font-mono">3.1</span> Performance Troubleshooting & Caching
                    </h3>
                    <ul className="text-xs text-[#cbd5e1] space-y-2 list-disc list-inside">
                      <li>RDS Performance Insights and Average Active Sessions (AAS) diagnosis</li>
                      <li>DynamoDB Accelerator (DAX) microsecond in-memory caching vs ElastiCache</li>
                      <li>Amazon RDS Proxy for connection pool multiplexing with Lambda</li>
                      <li>EBS VolumeQueueLength and gp3 IOPS/throughput decoupling</li>
                      <li>AWS X-Ray distributed tracing and Service Map bottleneck isolation</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0f131d] border border-white/10 space-y-3">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <span className="text-cyan-400 font-mono">3.2</span> Cost Optimization & Rightsizing
                    </h3>
                    <ul className="text-xs text-[#cbd5e1] space-y-2 list-disc list-inside">
                      <li>AWS Graviton processor migrations for up to 40% price/performance improvement</li>
                      <li>S3 Storage Lens advanced analytics for incomplete uploads and old versions</li>
                      <li>EBS gp2 to gp3 automated in-place volume conversions</li>
                      <li>Compute Savings Plans vs EC2 Instance Savings Plans</li>
                      <li>DynamoDB On-Demand mode vs Provisioned Capacity with Auto Scaling</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0f131d] border border-white/10 space-y-3">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <span className="text-cyan-400 font-mono">3.3</span> Operational Excellence & Chaos Engineering
                    </h3>
                    <ul className="text-xs text-[#cbd5e1] space-y-2 list-disc list-inside">
                      <li>AWS Fault Injection Service (FIS) chaos experiments with automated stop conditions</li>
                      <li>Route 53 ARC Readiness Checks to audit DR capacity and service quotas</li>
                      <li>CloudWatch Composite Alarms and Metric Math error rate ratios</li>
                      <li>Systems Manager Automation runbooks for automated incident self-healing</li>
                      <li>AWS Systems Manager State Manager for fleet-wide drift remediation</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0f131d] border border-white/10 space-y-3">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <span className="text-cyan-400 font-mono">3.4</span> Security Posture & Vulnerability Remediation
                    </h3>
                    <ul className="text-xs text-[#cbd5e1] space-y-2 list-disc list-inside">
                      <li>AWS Config automated remediation actions with Systems Manager</li>
                      <li>IAM Access Analyzer Policy Validation and CloudTrail Policy Generation</li>
                      <li>Amazon Inspector v2 continuous container image scanning in ECR</li>
                      <li>VPC Flow Logs enriched field formatting and Athena exfiltration querying</li>
                      <li>KMS key disabling procedures during suspected cryptographic compromise</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedDomain(3);
                      setActiveView('flashcards');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm rounded-xl shadow-lg hover:from-cyan-400 hover:to-blue-500"
                  >
                    Study Domain 3 Flashcards (100 Cards) →
                  </button>
                </div>
              </div>
            )}

            {selectedBlueprintDomain === 4 && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-6">
                  <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold uppercase mb-2">
                    Domain 4 • 20% Examination Weight • 100 Flashcards
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    Accelerate Workload Migration and Modernization
                  </h2>
                  <p className="text-sm text-[#94a3b8] mt-2">
                    Focuses on enterprise cloud migration assessments (7 Rs, Application Discovery Service, Migration Evaluator), continuous server replication (AWS MGN), database replication & conversion (AWS DMS, SCT), hybrid data transport (Direct Connect, DataSync, Snow Family), and post-migration cutovers.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-[#0f131d] border border-white/10 space-y-3">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <span className="text-purple-400 font-mono">4.1</span> Discovery, Assessment & 7 Rs Strategy
                    </h3>
                    <ul className="text-xs text-[#cbd5e1] space-y-2 list-disc list-inside">
                      <li>The 7 Rs of cloud migration: Rehost, Replatform, Repurchase, Refactor, Retain, Retire, Relocate</li>
                      <li>AWS Application Discovery Service: Agentless Collector vs Discovery Agent dependency mapping</li>
                      <li>AWS Migration Evaluator (TSO Logic) business case and actual TCO projection</li>
                      <li>AWS Migration Hub centralized tracking across MGN, DMS, and third-party tools</li>
                      <li>AWS Migration Hub Strategy Recommendations for automated modernization paths</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0f131d] border border-white/10 space-y-3">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <span className="text-purple-400 font-mono">4.2</span> Hybrid Data Transfer & Storage Gateway
                    </h3>
                    <ul className="text-xs text-[#cbd5e1] space-y-2 list-disc list-inside">
                      <li>Direct Connect Private VIF, Public VIF, Transit VIF, and Direct Connect Gateway</li>
                      <li>Direct Connect MACsec Layer 2 line-rate encryption vs IPsec VPN tunnels</li>
                      <li>AWS DataSync accelerated file streaming with automated checksum verification</li>
                      <li>AWS Snow Family: Snowcone, Snowball Edge (Storage vs Compute), and Snowmobile</li>
                      <li>AWS Storage Gateway: S3 File Gateway, FSx File Gateway, Volume Gateway, Tape Gateway</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0f131d] border border-white/10 space-y-3">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <span className="text-purple-400 font-mono">4.3</span> Server & Database Migration (MGN / DMS / SCT)
                    </h3>
                    <ul className="text-xs text-[#cbd5e1] space-y-2 list-disc list-inside">
                      <li>AWS Application Migration Service (MGN) continuous block replication to staging subnets</li>
                      <li>MGN Launch Templates and SSM post-launch automation scripts</li>
                      <li>AWS DMS Full Load + Change Data Capture (CDC) with minimal cutover downtime</li>
                      <li>AWS Schema Conversion Tool (SCT) for heterogeneous database conversions</li>
                      <li>AWS DMS LOB mode tuning (Limited vs Full LOB) and multi-threaded parallel extraction</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0f131d] border border-white/10 space-y-3">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <span className="text-purple-400 font-mono">4.4</span> Cutover Orchestration & Modernization
                    </h3>
                    <ul className="text-xs text-[#cbd5e1] space-y-2 list-disc list-inside">
                      <li>Zero-downtime DNS cutover planning with TTL pre-lowering and Route 53 weighted shift</li>
                      <li>AWS App2Container (A2C) automated containerization for Java and .NET web applications</li>
                      <li>AWS Porting Assistant for .NET code modernization to Linux containers</li>
                      <li>VMware Cloud on AWS (VMC on AWS) live vMotion without VM hypervisor conversion</li>
                      <li>AWS Mainframe Modernization: Replatform (Micro Focus) vs Automated Refactor (Blu Age)</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedDomain(4);
                      setActiveView('flashcards');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold text-sm rounded-xl shadow-lg hover:from-purple-400 hover:to-indigo-500"
                  >
                    Study Domain 4 Flashcards (100 Cards) →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid Overview Modal */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-5xl max-h-[85vh] bg-[#121622] border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Flashcards Grid Overview ({filteredCards.length} Cards)
                </h3>
                <p className="text-xs text-[#94a3b8] mt-1">
                  Click any card to jump directly to it in the flashcard study view.
                </p>
              </div>

              <button
                onClick={() => setShowGridModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pr-1">
              {filteredCards.map((card, idx) => {
                const isMastered = masteredCardIds.includes(card.id);
                const isReview = reviewCardIds.includes(card.id);
                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      setCurrentCardIndex(idx);
                      setIsFlipped(false);
                      setShowGridModal(false);
                    }}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-3 ${
                      idx === currentCardIndex
                        ? 'bg-amber-500/10 border-amber-500/50 ring-2 ring-amber-400/40'
                        : isMastered
                        ? 'bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-400'
                        : isReview
                        ? 'bg-rose-500/5 border-rose-500/30 hover:border-rose-400'
                        : 'bg-[#181d2a] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#94a3b8] mb-1.5">
                        <span className="font-bold text-amber-300">#{card.id}</span>
                        <div className="flex items-center gap-1.5">
                          {isMastered && <span className="text-emerald-400 font-bold">✓ Mastered</span>}
                          {isReview && <span className="text-rose-400 font-bold">⚠ Review</span>}
                          <span className="text-slate-400">D{card.domainNumber}</span>
                        </div>
                      </div>
                      <h4 className="text-xs font-semibold text-white line-clamp-2">
                        {card.topic}
                      </h4>
                    </div>

                    <p className="text-[11px] text-[#94a3b8] line-clamp-3">
                      {card.question}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#94a3b8] font-mono">
              <span>Showing {filteredCards.length} cards based on active filters</span>
              <button
                onClick={() => setShowGridModal(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-xl text-xs"
              >
                Back to Study Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
