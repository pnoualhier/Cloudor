import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SAA_C03_DOMAIN_1_100_FLASHCARDS, SaaC03Flashcard } from '../data/saaC03Domain1FlashcardsData';
import { SAA_C03_DOMAIN_2_100_FLASHCARDS } from '../data/saaC03Domain2FlashcardsData';
import { SAA_C03_DOMAIN_3_100_FLASHCARDS } from '../data/saaC03Domain3FlashcardsData';
import { SAA_C03_DOMAIN_4_100_FLASHCARDS } from '../data/saaC03Domain4FlashcardsData';

interface SaaC03LearningHubProps {
  initialMode?: 'flashcards' | 'blueprint';
  onNavigate?: (tab: string) => void;
}

export const SAA_C03_METADATA = {
  code: 'SAA-C03',
  title: 'AWS Certified Solutions Architect – Associate',
  level: 'Associate',
  passingScore: '720 / 1000 (scaled score)',
  duration: '130 minutes',
  questionsCount: '65 questions (multiple choice or multiple response)',
  domains: [
    { number: 1, name: 'Design Secure Architectures', weight: '30%', cardsCount: 100, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    { number: 2, name: 'Design Resilient Architectures', weight: '26%', cardsCount: 100, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    { number: 3, name: 'Design High-Performing Architectures', weight: '24%', cardsCount: 100, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
    { number: 4, name: 'Design Cost-Optimized Architectures', weight: '20%', cardsCount: 100, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  ],
};

export const SaaC03LearningHub: React.FC<SaaC03LearningHubProps> = ({
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

  // Combined pool of all 400 cards
  const allCardsPool = useMemo(() => {
    return [
      ...SAA_C03_DOMAIN_1_100_FLASHCARDS,
      ...SAA_C03_DOMAIN_2_100_FLASHCARDS,
      ...SAA_C03_DOMAIN_3_100_FLASHCARDS,
      ...SAA_C03_DOMAIN_4_100_FLASHCARDS,
    ];
  }, []);

  // Filter cards by selected domain
  const domainFilteredCards = useMemo(() => {
    if (selectedDomain === 1) return SAA_C03_DOMAIN_1_100_FLASHCARDS;
    if (selectedDomain === 2) return SAA_C03_DOMAIN_2_100_FLASHCARDS;
    if (selectedDomain === 3) return SAA_C03_DOMAIN_3_100_FLASHCARDS;
    if (selectedDomain === 4) return SAA_C03_DOMAIN_4_100_FLASHCARDS;
    return allCardsPool;
  }, [selectedDomain, allCardsPool]);

  // Mastered / Review persistence via localStorage
  const [masteredCardIds, setMasteredCardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cloudor_saac03_all_mastered');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviewCardIds, setReviewCardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cloudor_saac03_all_review');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cloudor_saac03_all_mastered', JSON.stringify(masteredCardIds));
    } catch (e) {
      console.error(e);
    }
  }, [masteredCardIds]);

  useEffect(() => {
    try {
      localStorage.setItem('cloudor_saac03_all_review', JSON.stringify(reviewCardIds));
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

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.question.toLowerCase().includes(q) ||
          c.answer.toLowerCase().includes(q) ||
          c.topic.toLowerCase().includes(q) ||
          c.keyRule.toLowerCase().includes(q) ||
          c.examTip.toLowerCase().includes(q) ||
          c.id.toString() === q
      );
    }

    if (isShuffled) {
      // Deterministic pseudo-random shuffle based on IDs
      result = [...result].sort((a, b) => ((a.id * 17) % 31) - ((b.id * 17) % 31));
    }

    return result;
  }, [
    domainFilteredCards,
    selectedCategoryFilter,
    selectedDifficultyFilter,
    selectedStatusFilter,
    searchQuery,
    masteredCardIds,
    reviewCardIds,
    isShuffled,
  ]);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [selectedDomain, selectedCategoryFilter, selectedDifficultyFilter, selectedStatusFilter, searchQuery, isShuffled]);

  const activeCard: SaaC03Flashcard | undefined = filteredCards[currentCardIndex];

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

  const toggleMastered = (id: number) => {
    setMasteredCardIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setReviewCardIds((prev) => prev.filter((item) => item !== id));
  };

  const toggleReview = (id: number) => {
    setReviewCardIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.key === 'ArrowRight' || e.key === 'l' || e.key === 'j') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'h' || e.key === 'k') {
        handlePrev();
      } else if ((e.key === 'm' || e.key === 'M') && activeCard) {
        toggleMastered(activeCard.id);
      } else if ((e.key === 'r' || e.key === 'R') && activeCard) {
        toggleReview(activeCard.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, activeCard]);

  // Overall Mastery stats
  const totalMasteredCount = useMemo(() => {
    return allCardsPool.filter((c) => masteredCardIds.includes(c.id)).length;
  }, [allCardsPool, masteredCardIds]);

  const domainMasteryCounts = useMemo(() => {
    return {
      d1: SAA_C03_DOMAIN_1_100_FLASHCARDS.filter((c) => masteredCardIds.includes(c.id)).length,
      d2: SAA_C03_DOMAIN_2_100_FLASHCARDS.filter((c) => masteredCardIds.includes(c.id)).length,
      d3: SAA_C03_DOMAIN_3_100_FLASHCARDS.filter((c) => masteredCardIds.includes(c.id)).length,
      d4: SAA_C03_DOMAIN_4_100_FLASHCARDS.filter((c) => masteredCardIds.includes(c.id)).length,
    };
  }, [masteredCardIds]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#121624] via-[#1a1f33] to-[#0d101b] border border-[#2a3048] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#ff9900]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-[#4cd7f6]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono-code font-bold bg-[#ff9900]/20 text-[#ffb95f] border border-[#ff9900]/40">
                AWS CERTIFIED
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-mono-code font-bold bg-[#262a38] text-white border border-white/10">
                SAA-C03 • 400 FLASHCARDS
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-mono-code bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                100 Cards / Domain
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              AWS Solutions Architect – Associate (SAA-C03) Mastery Hub
            </h1>

            <p className="text-sm text-[#9da3be] max-w-3xl leading-relaxed">
              Complete exam-grade mastery system featuring 400 deep-dive flashcards aligned to all 4 domains of the official SAA-C03 blueprint. Includes architectural key rules, scenario traps, and direct AWS documentation references.
            </p>
          </div>

          {/* Quick Metrics & Mode Switch */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0b0e17] border border-[#262a38]">
              <button
                onClick={() => setActiveView('flashcards')}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                  activeView === 'flashcards'
                    ? 'bg-[#ff9900] text-black font-bold shadow-md'
                    : 'text-[#9da3be] hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-base">style</span>
                <span>400 Flashcards</span>
              </button>

              <button
                onClick={() => setActiveView('blueprint')}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                  activeView === 'blueprint'
                    ? 'bg-[#ff9900] text-black font-bold shadow-md'
                    : 'text-[#9da3be] hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-base">menu_book</span>
                <span>Architectural Blueprint</span>
              </button>
            </div>

            {/* Overall Progress Gauge */}
            <div className="flex items-center gap-3 bg-[#0a0d16]/80 px-4 py-2.5 rounded-xl border border-[#222738]">
              <div className="w-10 h-10 rounded-full border-2 border-emerald-500/40 flex items-center justify-center font-mono-code font-bold text-xs text-emerald-400">
                {Math.round((totalMasteredCount / 400) * 100)}%
              </div>
              <div className="text-xs">
                <div className="text-white font-medium">Overall Progress</div>
                <div className="text-[#8c92ae]">{totalMasteredCount} of 400 Mastered</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Domain Cards Overview Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#22273a]">
          {SAA_C03_METADATA.domains.map((dom) => {
            const isSelected = selectedDomain === dom.number;
            const masteredCount =
              dom.number === 1 ? domainMasteryCounts.d1 :
              dom.number === 2 ? domainMasteryCounts.d2 :
              dom.number === 3 ? domainMasteryCounts.d3 : domainMasteryCounts.d4;

            return (
              <button
                key={dom.number}
                onClick={() => {
                  setSelectedDomain(dom.number as 1 | 2 | 3 | 4);
                  setSelectedCategoryFilter('all');
                }}
                className={`p-3 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'bg-[#1b2236] border-[#ff9900] ring-1 ring-[#ff9900]/30 shadow-lg'
                    : 'bg-[#0f1422] border-[#222738] hover:border-[#38405b] hover:bg-[#141b2c]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-[11px] font-mono-code font-bold ${dom.color}`}>
                    Domain {dom.number} ({dom.weight})
                  </span>
                  <span className="text-[10px] text-[#7d84a0] font-mono-code">100 Cards</span>
                </div>
                <div className="text-xs font-semibold text-white line-clamp-1 mb-2">
                  {dom.name}
                </div>
                {/* Progress bar */}
                <div className="w-full bg-[#1e2436] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(masteredCount / 100) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#7d84a0] mt-1 font-mono-code">
                  <span>Mastery:</span>
                  <span className="text-emerald-400 font-bold">{masteredCount}/100</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {activeView === 'flashcards' && (
        <div className="space-y-6">
          {/* Controls Bar: Domain Selector, Category Filter, Search, Grid Button */}
          <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 p-4 rounded-xl bg-[#121624] border border-[#23293d]">
            {/* Domain Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => {
                  setSelectedDomain('all');
                  setSelectedCategoryFilter('all');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedDomain === 'all'
                    ? 'bg-[#ff9900] text-black font-bold shadow-sm'
                    : 'bg-[#181e30] text-[#9da3be] hover:text-white hover:bg-[#20273f]'
                }`}
              >
                All 400 Cards
              </button>

              {[1, 2, 3, 4].map((dNum) => (
                <button
                  key={dNum}
                  onClick={() => {
                    setSelectedDomain(dNum as 1 | 2 | 3 | 4);
                    setSelectedCategoryFilter('all');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedDomain === dNum
                      ? 'bg-[#ff9900] text-black font-bold shadow-sm'
                      : 'bg-[#181e30] text-[#9da3be] hover:text-white hover:bg-[#20273f]'
                  }`}
                >
                  Domain {dNum} (100)
                </button>
              ))}
            </div>

            {/* Filters, Search, Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Category dropdown */}
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-[#181e30] border border-[#2d344d] text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#ff9900]"
              >
                <option value="all">All Categories ({domainFilteredCards.length})</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Difficulty filter */}
              <select
                value={selectedDifficultyFilter}
                onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
                className="bg-[#181e30] border border-[#2d344d] text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#ff9900]"
              >
                <option value="all">All Difficulties</option>
                <option value="Foundational">Foundational</option>
                <option value="Standard">Standard</option>
                <option value="Advanced">Advanced</option>
              </select>

              {/* Status filter */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
                className="bg-[#181e30] border border-[#2d344d] text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#ff9900]"
              >
                <option value="all">All Statuses</option>
                <option value="mastered">Mastered</option>
                <option value="review">Needs Review</option>
              </select>

              {/* Search */}
              <div className="relative min-w-[180px]">
                <input
                  type="text"
                  placeholder="Search 400 cards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#181e30] border border-[#2d344d] text-white text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#ff9900]"
                />
                <span className="material-symbols-outlined text-[#7a819b] text-sm absolute left-2.5 top-2">
                  search
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 text-[#7a819b] hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Shuffle button */}
              <button
                onClick={() => setIsShuffled((s) => !s)}
                title="Toggle Shuffle"
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                  isShuffled
                    ? 'bg-[#ff9900]/20 text-[#ffb95f] border-[#ff9900]/50'
                    : 'bg-[#181e30] text-[#9da3be] border-[#2d344d] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">shuffle</span>
                <span className="hidden sm:inline">Shuffle</span>
              </button>

              {/* Grid Matrix View Modal Button */}
              <button
                onClick={() => setShowGridModal(true)}
                className="px-3 py-1.5 rounded-lg bg-[#242b42] text-white border border-[#3b4466] hover:bg-[#2e3754] text-xs font-medium flex items-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-sm">grid_view</span>
                <span>Matrix (400)</span>
              </button>
            </div>
          </div>

          {/* Flashcard Viewer */}
          {filteredCards.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#121624] border border-[#23293d]">
              <span className="material-symbols-outlined text-4xl text-[#7a819b] mb-2">search_off</span>
              <h3 className="text-lg font-bold text-white mb-1">No matching cards found</h3>
              <p className="text-sm text-[#7a819b] max-w-md mx-auto mb-4">
                No cards match your active filter criteria. Try resetting search or selecting all domains.
              </p>
              <button
                onClick={() => {
                  setSelectedDomain('all');
                  setSelectedCategoryFilter('all');
                  setSelectedDifficultyFilter('all');
                  setSelectedStatusFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#ff9900] text-black text-xs font-bold rounded-lg hover:bg-[#ffb03a]"
              >
                Reset All Filters
              </button>
            </div>
          ) : activeCard ? (
            <div className="space-y-4">
              {/* Progress & Card Index Header */}
              <div className="flex items-center justify-between text-xs text-[#9da3be]">
                <div className="flex items-center gap-2">
                  <span className="font-mono-code font-bold text-white">
                    Card {currentCardIndex + 1} of {filteredCards.length}
                  </span>
                  <span className="text-[#4e5572]">•</span>
                  <span className="px-2 py-0.5 rounded bg-[#1e2436] text-[#ffb95f] font-mono-code">
                    Card #{activeCard.id}
                  </span>
                  <span className="text-[#4e5572]">•</span>
                  <span className="text-[#9da3be]">{activeCard.category}</span>
                </div>

                <div className="flex items-center gap-2 font-mono-code">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    activeCard.difficulty === 'Foundational' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    activeCard.difficulty === 'Standard' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                    'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                  }`}>
                    {activeCard.difficulty}
                  </span>
                  <span className="text-[#656d8e]">Press Space to Flip</span>
                </div>
              </div>

              {/* The Interactive 3D Card */}
              <div
                onClick={() => setIsFlipped((f) => !f)}
                className="min-h-[380px] sm:min-h-[420px] rounded-2xl p-6 sm:p-8 cursor-pointer select-none transition-all duration-200 border relative overflow-hidden bg-gradient-to-b from-[#141829] to-[#0e121f] border-[#293047] hover:border-[#ff9900]/40 shadow-xl flex flex-col justify-between group"
              >
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#ff9900]/10 to-transparent pointer-events-none" />

                {/* Top Card Bar */}
                <div className="flex items-center justify-between gap-4 border-b border-[#21273b] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ff9900] text-xl">
                      {isFlipped ? 'task_alt' : 'help'}
                    </span>
                    <span className="text-xs font-mono-code font-bold tracking-wider uppercase text-[#ffb95f]">
                      {isFlipped ? 'SOLUTION & ARCHITECTURE RULE' : 'EXAM SCENARIO PROMPT'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleReview(activeCard.id)}
                      title="Flag for Review (Shortcut: R)"
                      className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                        reviewCardIds.includes(activeCard.id)
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-[#181d2e] text-[#7e85a2] border-[#293047] hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">bookmark</span>
                      <span className="hidden sm:inline">Review</span>
                    </button>

                    <button
                      onClick={() => toggleMastered(activeCard.id)}
                      title="Mark as Mastered (Shortcut: M)"
                      className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                        masteredCardIds.includes(activeCard.id)
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
                          : 'bg-[#181d2e] text-[#7e85a2] border-[#293047] hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <span className="hidden sm:inline">
                        {masteredCardIds.includes(activeCard.id) ? 'Mastered' : 'Mark Mastered'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Card Main Body */}
                <div className="py-6 my-auto">
                  {!isFlipped ? (
                    <div className="space-y-4">
                      <div className="text-xs font-mono-code text-[#4cd7f6] uppercase tracking-wider">
                        {activeCard.topic}
                      </div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-display font-medium text-white leading-relaxed">
                        {activeCard.question}
                      </h2>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="text-xs font-mono-code text-emerald-400 uppercase tracking-wider">
                        {activeCard.topic} • Verified Answer
                      </div>

                      <p className="text-sm sm:text-base text-[#e2e5f5] leading-relaxed">
                        {activeCard.answer}
                      </p>

                      <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 text-xs text-amber-200">
                        <div className="font-bold font-mono-code text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">architecture</span>
                          <span>Architectural Key Rule</span>
                        </div>
                        {activeCard.keyRule}
                      </div>

                      <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 text-xs text-cyan-200">
                        <div className="font-bold font-mono-code text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">verified</span>
                          <span>Exam Scenario Tip</span>
                        </div>
                        {activeCard.examTip}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Card Bar */}
                <div className="border-t border-[#21273b] pt-4 flex items-center justify-between text-xs text-[#7e85a2]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#ff9900]">sync</span>
                    <span className="group-hover:text-white transition-colors">
                      {isFlipped ? 'Click card or Space to view Question' : 'Click card or Space to Reveal Answer'}
                    </span>
                  </div>

                  {activeCard.officialDocUrl && isFlipped && (
                    <a
                      href={activeCard.officialDocUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#4cd7f6] hover:underline flex items-center gap-1 font-mono-code text-[11px]"
                    >
                      <span>AWS Documentation</span>
                      <span className="material-symbols-outlined text-xs">open_in_new</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Navigation Bar */}
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#121624] border border-[#23293d]">
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-lg bg-[#181d2e] border border-[#2d344d] hover:bg-[#20263c] text-white text-xs font-medium flex items-center gap-2 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  <span>Previous (← / H)</span>
                </button>

                <div className="flex items-center gap-3">
                  {/* Quick card jumper slider/indicator */}
                  <span className="text-xs font-mono-code text-[#9da3be]">
                    {currentCardIndex + 1} / {filteredCards.length}
                  </span>
                </div>

                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-lg bg-[#ff9900] hover:bg-[#ffb03a] text-black text-xs font-bold flex items-center gap-2 transition-all shadow-md"
                >
                  <span>Next (→ / L)</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Architectural Blueprint View */}
      {activeView === 'blueprint' && (
        <div className="space-y-6">
          {/* Blueprint Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#121624] border border-[#23293d]">
            {SAA_C03_METADATA.domains.map((dom) => (
              <button
                key={dom.number}
                onClick={() => setSelectedBlueprintDomain(dom.number as 1 | 2 | 3 | 4)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                  selectedBlueprintDomain === dom.number
                    ? 'bg-[#ff9900] text-black font-bold shadow-md'
                    : 'bg-[#181e30] text-[#9da3be] hover:text-white hover:bg-[#20273f]'
                }`}
              >
                <span>Domain {dom.number}: {dom.name} ({dom.weight})</span>
              </button>
            ))}
          </div>

          {/* Domain 1 Blueprint Reference Tables */}
          {selectedBlueprintDomain === 1 && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#121624] border border-[#23293d] space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400">shield</span>
                  <span>AWS KMS Encryption & Key Types Comparison</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#282f45] text-[#9da3be]">
                        <th className="py-2.5 px-3">KMS Key Type</th>
                        <th className="py-2.5 px-3">Creation & Ownership</th>
                        <th className="py-2.5 px-3">Key Rotation</th>
                        <th className="py-2.5 px-3">Key Policy & Cross-Account</th>
                        <th className="py-2.5 px-3">Cost Model</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2436] text-[#dfe2f1]">
                      <tr>
                        <td className="py-3 px-3 font-bold text-amber-300">AWS Owned Key</td>
                        <td className="py-3 px-3">Owned by AWS internal services</td>
                        <td className="py-3 px-3">Managed automatically by AWS</td>
                        <td className="py-3 px-3">Cannot view or modify policy</td>
                        <td className="py-3 px-3 font-mono-code text-emerald-400">Free</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-amber-300">AWS Managed Key (aws/s3, aws/ebs)</td>
                        <td className="py-3 px-3">Created by AWS in user account</td>
                        <td className="py-3 px-3">Automatic annual (every 1 year)</td>
                        <td className="py-3 px-3">Cannot share cross-account</td>
                        <td className="py-3 px-3 font-mono-code text-emerald-400">Free key; pay for API requests</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-amber-300">Customer Managed Key (CMK)</td>
                        <td className="py-3 px-3">Created and owned by customer</td>
                        <td className="py-3 px-3">Automatic (every 1 yr) or manual</td>
                        <td className="py-3 px-3 font-bold text-cyan-300">Full control; supports cross-account</td>
                        <td className="py-3 px-3 font-mono-code text-[#ffb95f]">$1/month/key + API requests</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-amber-300">Multi-Region KMS Keys</td>
                        <td className="py-3 px-3">Primary in one region, replicated to others</td>
                        <td className="py-3 px-3">Rotated from primary region</td>
                        <td className="py-3 px-3">Decrypt data in secondary region without cross-region API</td>
                        <td className="py-3 px-3 font-mono-code text-[#ffb95f]">$1/month per region</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#121624] border border-[#23293d] space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400">lock</span>
                  <span>AWS Network Security Controls: Security Groups vs NACLs</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#282f45] text-[#9da3be]">
                        <th className="py-2.5 px-3">Feature</th>
                        <th className="py-2.5 px-3">Security Groups (SG)</th>
                        <th className="py-2.5 px-3">Network Access Control Lists (NACL)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2436] text-[#dfe2f1]">
                      <tr>
                        <td className="py-3 px-3 font-bold text-white">Attachment Level</td>
                        <td className="py-3 px-3">Elastic Network Interface (ENI / Instance)</td>
                        <td className="py-3 px-3">Subnet level (applies to all instances in subnet)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-white">Statefulness</td>
                        <td className="py-3 px-3 font-bold text-emerald-400">STATEFUL (return traffic automatically allowed)</td>
                        <td className="py-3 px-3 font-bold text-amber-400">STATELESS (inbound & outbound evaluated separately)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-white">Allow vs Deny Rules</td>
                        <td className="py-3 px-3">ALLOW rules only (implicit deny all else)</td>
                        <td className="py-3 px-3 font-bold text-cyan-300">ALLOW and explicit DENY rules (by IP CIDR)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-white">Rule Processing Order</td>
                        <td className="py-3 px-3">All rules evaluated before deciding</td>
                        <td className="py-3 px-3">Numbered order (lowest number evaluated first)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Domain 2 Blueprint Reference Tables */}
          {selectedBlueprintDomain === 2 && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#121624] border border-[#23293d] space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400">dynamic_form</span>
                  <span>AWS Disaster Recovery (DR) Strategies Spectrum</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#282f45] text-[#9da3be]">
                        <th className="py-2.5 px-3">Strategy</th>
                        <th className="py-2.5 px-3">RTO (Recovery Time)</th>
                        <th className="py-2.5 px-3">RPO (Data Loss)</th>
                        <th className="py-2.5 px-3">Architecture & Operating State</th>
                        <th className="py-2.5 px-3">Relative Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2436] text-[#dfe2f1]">
                      <tr>
                        <td className="py-3 px-3 font-bold text-emerald-300">Backup and Restore</td>
                        <td className="py-3 px-3 text-amber-400">Hours to Days</td>
                        <td className="py-3 px-3 text-amber-400">Hours to 24 hrs</td>
                        <td className="py-3 px-3">Data backed up to S3/Glacier. Rebuild entire infrastructure after disaster.</td>
                        <td className="py-3 px-3 font-mono-code text-emerald-400">$ (Lowest)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-emerald-300">Pilot Light</td>
                        <td className="py-3 px-3 text-cyan-300">Tens of minutes</td>
                        <td className="py-3 px-3 text-cyan-300">Minutes</td>
                        <td className="py-3 px-3">Core database replicated and running. Compute instances launched from AMIs on failover.</td>
                        <td className="py-3 px-3 font-mono-code text-cyan-400">$$</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-emerald-300">Warm Standby</td>
                        <td className="py-3 px-3 text-emerald-400">Minutes</td>
                        <td className="py-3 px-3 text-emerald-400">Seconds to minutes</td>
                        <td className="py-3 px-3">Scaled-down fleet of all services running 24/7. Auto-scales to 100% capacity on failover.</td>
                        <td className="py-3 px-3 font-mono-code text-amber-400">$$$</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-emerald-300">Multi-Site Active/Active</td>
                        <td className="py-3 px-3 text-emerald-400 font-bold">Near Zero</td>
                        <td className="py-3 px-3 text-emerald-400 font-bold">Near Zero</td>
                        <td className="py-3 px-3">Full production capacity running across multiple regions simultaneously. Route 53 / Anycast routing.</td>
                        <td className="py-3 px-3 font-mono-code text-rose-400">$$$$ (Highest)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#121624] border border-[#23293d] space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400">cable</span>
                  <span>AWS Decoupling: SQS vs SNS vs EventBridge vs Kinesis</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#282f45] text-[#9da3be]">
                        <th className="py-2.5 px-3">Service</th>
                        <th className="py-2.5 px-3">Model</th>
                        <th className="py-2.5 px-3">Delivery Model</th>
                        <th className="py-2.5 px-3">Data Retention</th>
                        <th className="py-2.5 px-3">Key Differentiator</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2436] text-[#dfe2f1]">
                      <tr>
                        <td className="py-3 px-3 font-bold text-emerald-300">Amazon SQS</td>
                        <td className="py-3 px-3">Queue (Point-to-Point)</td>
                        <td className="py-3 px-3">Consumer Poll</td>
                        <td className="py-3 px-3">1 min to 14 days (default 4d)</td>
                        <td className="py-3 px-3">Worker pool buffer, message visibility timeout, DLQ</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-emerald-300">Amazon SNS</td>
                        <td className="py-3 px-3">Topic (Pub/Sub)</td>
                        <td className="py-3 px-3">Push to subscribers</td>
                        <td className="py-3 px-3">Zero retention (ephemeral)</td>
                        <td className="py-3 px-3">Fanout pattern to multiple SQS queues, SMS, email, Lambda</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-emerald-300">Amazon EventBridge</td>
                        <td className="py-3 px-3">Event Bus</td>
                        <td className="py-3 px-3">Push to 20+ targets</td>
                        <td className="py-3 px-3">Optional Archive & Replay</td>
                        <td className="py-3 px-3">SaaS integrations (Zendesk, Datadog), Schema Registry, JSON rule matching</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-emerald-300">Amazon Kinesis Data Streams</td>
                        <td className="py-3 px-3">Streaming Shards</td>
                        <td className="py-3 px-3">Consumer Poll or Push (Enhanced Fan-Out)</td>
                        <td className="py-3 px-3">24 hours to 365 days</td>
                        <td className="py-3 px-3">Massive real-time analytics, ordered stream ingestion, KCL checkpointing</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Domain 3 Blueprint Reference Tables */}
          {selectedBlueprintDomain === 3 && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#121624] border border-[#23293d] space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-400">storage</span>
                  <span>Amazon EBS Volume Types Comparison Matrix</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#282f45] text-[#9da3be]">
                        <th className="py-2.5 px-3">Volume Type</th>
                        <th className="py-2.5 px-3">Max IOPS</th>
                        <th className="py-2.5 px-3">Max Throughput</th>
                        <th className="py-2.5 px-3">Boot Volume?</th>
                        <th className="py-2.5 px-3">Primary Use Case</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2436] text-[#dfe2f1]">
                      <tr>
                        <td className="py-3 px-3 font-bold text-cyan-300">gp3 (General Purpose SSD)</td>
                        <td className="py-3 px-3">16,000 IOPS</td>
                        <td className="py-3 px-3">1,000 MB/s</td>
                        <td className="py-3 px-3 font-bold text-emerald-400">Yes</td>
                        <td className="py-3 px-3">Recommended default; 20% cheaper than gp2, independent IOPS scaling</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-cyan-300">io2 Block Express (SSD)</td>
                        <td className="py-3 px-3 font-bold text-cyan-400">256,000 IOPS</td>
                        <td className="py-3 px-3 font-bold text-cyan-400">4,000 MB/s</td>
                        <td className="py-3 px-3 font-bold text-emerald-400">Yes</td>
                        <td className="py-3 px-3">Sub-millisecond mission-critical SAN databases (SAP HANA, Oracle, MS SQL)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-cyan-300">st1 (Throughput Optimized HDD)</td>
                        <td className="py-3 px-3">500 IOPS</td>
                        <td className="py-3 px-3">500 MB/s</td>
                        <td className="py-3 px-3 font-bold text-rose-400">No</td>
                        <td className="py-3 px-3">Streaming big data, Kafka, data warehousing, sequential log processing</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-cyan-300">sc1 (Cold HDD)</td>
                        <td className="py-3 px-3">250 IOPS</td>
                        <td className="py-3 px-3">250 MB/s</td>
                        <td className="py-3 px-3 font-bold text-rose-400">No</td>
                        <td className="py-3 px-3">Lowest-cost block storage for infrequently accessed sequential archives</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#121624] border border-[#23293d] space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-400">folder_shared</span>
                  <span>AWS Shared File Systems: EFS vs FSx Flavors</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#282f45] text-[#9da3be]">
                        <th className="py-2.5 px-3">Service</th>
                        <th className="py-2.5 px-3">Protocol</th>
                        <th className="py-2.5 px-3">OS Compatibility</th>
                        <th className="py-2.5 px-3">Key Features</th>
                        <th className="py-2.5 px-3">Target Workload</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2436] text-[#dfe2f1]">
                      <tr>
                        <td className="py-3 px-3 font-bold text-cyan-300">Amazon EFS</td>
                        <td className="py-3 px-3">NFSv4</td>
                        <td className="py-3 px-3">Linux</td>
                        <td className="py-3 px-3">Multi-AZ, serverless elastic scaling, lifecycle to IA/Archive</td>
                        <td className="py-3 px-3">Web serving, container shared storage, CMS (WordPress)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-cyan-300">FSx for Windows File Server</td>
                        <td className="py-3 px-3">SMB (2.0 to 3.1.1)</td>
                        <td className="py-3 px-3">Windows & Linux</td>
                        <td className="py-3 px-3">Native NTFS ACLs, Active Directory, DFS Namespaces, Deduplication</td>
                        <td className="py-3 px-3">Windows corporate file shares, ERPs, home directories</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-cyan-300">FSx for Lustre</td>
                        <td className="py-3 px-3">POSIX Lustre</td>
                        <td className="py-3 px-3">Linux</td>
                        <td className="py-3 px-3">Sub-millisecond, hundreds of GB/s, direct bidirectional S3 integration</td>
                        <td className="py-3 px-3">HPC, machine learning training, financial modeling, video rendering</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-cyan-300">FSx for NetApp ONTAP</td>
                        <td className="py-3 px-3">NFS, SMB, iSCSI</td>
                        <td className="py-3 px-3">Multi-OS</td>
                        <td className="py-3 px-3">SnapMirror, hardware compression, deduplication, auto-tiering to S3</td>
                        <td className="py-3 px-3">Enterprise multi-protocol migrations, NetApp lift-and-shift</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Domain 4 Blueprint Reference Tables */}
          {selectedBlueprintDomain === 4 && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#121624] border border-[#23293d] space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-400">payments</span>
                  <span>Amazon S3 Storage Classes Cost & Retrieval Matrix</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#282f45] text-[#9da3be]">
                        <th className="py-2.5 px-3">Storage Class</th>
                        <th className="py-2.5 px-3">Retrieval Time</th>
                        <th className="py-2.5 px-3">Min Duration</th>
                        <th className="py-2.5 px-3">Retrieval Fee</th>
                        <th className="py-2.5 px-3">AZ Durability</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2436] text-[#dfe2f1]">
                      <tr>
                        <td className="py-3 px-3 font-bold text-purple-300">S3 Standard</td>
                        <td className="py-3 px-3 text-emerald-400">Milliseconds</td>
                        <td className="py-3 px-3">None</td>
                        <td className="py-3 px-3 font-mono-code text-emerald-400">None</td>
                        <td className="py-3 px-3">3+ AZs (11 9s)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-purple-300">S3 Intelligent-Tiering</td>
                        <td className="py-3 px-3 text-emerald-400">Milliseconds (Auto)</td>
                        <td className="py-3 px-3">None</td>
                        <td className="py-3 px-3 font-mono-code text-emerald-400 font-bold">Zero retrieval fee</td>
                        <td className="py-3 px-3">3+ AZs (11 9s)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-purple-300">S3 Standard-IA</td>
                        <td className="py-3 px-3 text-emerald-400">Milliseconds</td>
                        <td className="py-3 px-3">30 days</td>
                        <td className="py-3 px-3 text-amber-400">Per GB retrieved</td>
                        <td className="py-3 px-3">3+ AZs (11 9s)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-purple-300">S3 One Zone-IA</td>
                        <td className="py-3 px-3 text-emerald-400">Milliseconds</td>
                        <td className="py-3 px-3">30 days</td>
                        <td className="py-3 px-3 text-amber-400">Per GB retrieved</td>
                        <td className="py-3 px-3 text-rose-400">1 AZ only (data loss on AZ outage)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-purple-300">S3 Glacier Instant Retrieval</td>
                        <td className="py-3 px-3 text-emerald-400">Milliseconds</td>
                        <td className="py-3 px-3">90 days</td>
                        <td className="py-3 px-3 text-amber-400">Per GB retrieved</td>
                        <td className="py-3 px-3">3+ AZs (11 9s)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-purple-300">S3 Glacier Flexible Retrieval</td>
                        <td className="py-3 px-3 text-cyan-300">1-5m (Exp) / 3-5h (Std) / 5-12h (Bulk Free)</td>
                        <td className="py-3 px-3">90 days</td>
                        <td className="py-3 px-3 text-emerald-400">Bulk is Free</td>
                        <td className="py-3 px-3">3+ AZs (11 9s)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-purple-300">S3 Glacier Deep Archive</td>
                        <td className="py-3 px-3 text-amber-400">12 hours (Std) / 48 hours (Bulk)</td>
                        <td className="py-3 px-3">180 days</td>
                        <td className="py-3 px-3 text-purple-400">Lowest cloud storage cost</td>
                        <td className="py-3 px-3">3+ AZs (11 9s)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#121624] border border-[#23293d] space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-400">lan</span>
                  <span>AWS Network Data Transfer Pricing Golden Rules</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#181d2e] border border-[#262c40] space-y-2">
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <span>100% FREE Data Transfer Scenarios</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-[#dfe2f1]">
                      <li>Data transferred IN to AWS from the public internet.</li>
                      <li>Data transfer between EC2 instances in the SAME AZ using private IPs.</li>
                      <li>Data transfer from AWS origins (S3, EC2, ALB) to Amazon CloudFront.</li>
                      <li>Gateway VPC Endpoints for S3 and DynamoDB (no hourly, no processing fee).</li>
                      <li>First 100 GB per month of data transfer out to the internet globally.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-[#181d2e] border border-[#262c40] space-y-2">
                    <div className="font-bold text-amber-400 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">warning</span>
                      <span>PAID / High-Cost Data Transfer Pitfalls</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-[#dfe2f1]">
                      <li>Cross-AZ data transfer: Billed in BOTH directions ($0.01/GB in and out = $0.02/GB total).</li>
                      <li>Public / Elastic IP between instances in the same AZ: Incurs data transfer fees! Always use private IP.</li>
                      <li>NAT Gateways: Billed hourly per AZ PLUS $0.045/GB data processing fees.</li>
                      <li>Interface VPC Endpoints (PrivateLink): Billed hourly per AZ PLUS $0.01/GB data processing.</li>
                      <li>Inter-Region VPC Peering: Billed standard inter-region egress rates.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid Matrix Modal for Fast 400-Card Jumping */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121624] border border-[#2d344d] rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#252b3f] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ff9900]">grid_view</span>
                  <span>SAA-C03 400-Card Navigator Matrix</span>
                </h3>
                <p className="text-xs text-[#8c92ae]">
                  Jump instantly to any card across all 4 domains. Color coded by mastery status.
                </p>
              </div>

              <button
                onClick={() => setShowGridModal(false)}
                className="w-8 h-8 rounded-lg bg-[#1a2034] text-[#8c92ae] hover:text-white flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Domain Tabs */}
            <div className="px-5 py-3 border-b border-[#252b3f] bg-[#0c0f18] flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedDomain('all');
                }}
                className={`px-3 py-1 rounded-md text-xs font-medium ${
                  selectedDomain === 'all'
                    ? 'bg-[#ff9900] text-black font-bold'
                    : 'bg-[#181d2e] text-[#8c92ae] hover:text-white'
                }`}
              >
                All 400 Cards
              </button>
              {[1, 2, 3, 4].map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setSelectedDomain(d as 1 | 2 | 3 | 4);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-medium ${
                    selectedDomain === d
                      ? 'bg-[#ff9900] text-black font-bold'
                      : 'bg-[#181d2e] text-[#8c92ae] hover:text-white'
                  }`}
                >
                  Domain {d} (100)
                </button>
              ))}
            </div>

            {/* Matrix Grid */}
            <div className="p-5 overflow-y-auto flex-1">
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {domainFilteredCards.map((card, idx) => {
                  const isMastered = masteredCardIds.includes(card.id);
                  const isReview = reviewCardIds.includes(card.id);
                  const isCurrent = activeCard?.id === card.id;

                  return (
                    <button
                      key={card.id}
                      onClick={() => {
                        const targetIdx = filteredCards.findIndex((c) => c.id === card.id);
                        if (targetIdx !== -1) {
                          setCurrentCardIndex(targetIdx);
                        } else {
                          // Clear filters to show this card
                          setSelectedCategoryFilter('all');
                          setSelectedDifficultyFilter('all');
                          setSelectedStatusFilter('all');
                          setSearchQuery('');
                          const newIdx = domainFilteredCards.findIndex((c) => c.id === card.id);
                          setCurrentCardIndex(newIdx !== -1 ? newIdx : 0);
                        }
                        setIsFlipped(false);
                        setShowGridModal(false);
                      }}
                      className={`h-11 rounded-lg border text-xs font-mono-code font-bold flex flex-col items-center justify-center transition-all ${
                        isCurrent
                          ? 'border-[#ff9900] ring-2 ring-[#ff9900]/50 bg-[#ff9900]/20 text-white'
                          : isMastered
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
                          : isReview
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500/25'
                          : 'bg-[#161c2d] border-[#293047] text-[#8c92ae] hover:text-white hover:border-[#3d4766]'
                      }`}
                      title={`#${card.id}: ${card.topic}`}
                    >
                      <span>#{card.id}</span>
                      <span className="text-[9px] opacity-70">D{card.domainNumber}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Legend */}
            <div className="p-4 border-t border-[#252b3f] bg-[#0c0f18] flex items-center justify-between text-xs text-[#8c92ae]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>Mastered</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Review</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4e5572]" />
                  <span>Unseen / Unmarked</span>
                </span>
              </div>
              <span>Total: {domainFilteredCards.length} cards</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
