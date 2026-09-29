import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AZ_305_DOMAIN_1_100_FLASHCARDS, Az305Flashcard } from '../data/az305Domain1FlashcardsData';
import { AZ_305_DOMAIN_2_100_FLASHCARDS } from '../data/az305Domain2FlashcardsData';
import { AZ_305_DOMAIN_3_100_FLASHCARDS } from '../data/az305Domain3FlashcardsData';
import { AZ_305_DOMAIN_4_100_FLASHCARDS } from '../data/az305Domain4FlashcardsData';

interface Az305LearningHubProps {
  initialMode?: 'flashcards' | 'blueprint';
  onNavigate?: (tab: string) => void;
}

export const AZ_305_METADATA = {
  code: 'AZ-305',
  title: 'Microsoft Certified: Azure Solutions Architect Expert',
  level: 'Expert',
  passingScore: '700 / 1000 (scaled score)',
  duration: '120 minutes (2 hours)',
  questionsCount: '40–60 questions (Case studies, scenario-based, drag-and-drop, hot areas)',
  domains: [
    { number: 1, name: 'Design Identity, Governance, and Monitoring Solutions', weight: '25–30%', cardsCount: 100, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30' },
    { number: 2, name: 'Design Data Storage Solutions', weight: '25–30%', cardsCount: 100, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    { number: 3, name: 'Design Business Continuity Solutions', weight: '10–15%', cardsCount: 100, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    { number: 4, name: 'Design Infrastructure Solutions', weight: '25–30%', cardsCount: 100, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  ],
};

export const Az305LearningHub: React.FC<Az305LearningHubProps> = ({
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
      ...AZ_305_DOMAIN_1_100_FLASHCARDS,
      ...AZ_305_DOMAIN_2_100_FLASHCARDS,
      ...AZ_305_DOMAIN_3_100_FLASHCARDS,
      ...AZ_305_DOMAIN_4_100_FLASHCARDS,
    ];
  }, []);

  // Filter cards by selected domain
  const domainFilteredCards = useMemo(() => {
    if (selectedDomain === 1) return AZ_305_DOMAIN_1_100_FLASHCARDS;
    if (selectedDomain === 2) return AZ_305_DOMAIN_2_100_FLASHCARDS;
    if (selectedDomain === 3) return AZ_305_DOMAIN_3_100_FLASHCARDS;
    if (selectedDomain === 4) return AZ_305_DOMAIN_4_100_FLASHCARDS;
    return allCardsPool;
  }, [selectedDomain, allCardsPool]);

  // Mastered / Review persistence via localStorage
  const [masteredCardIds, setMasteredCardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cloudor_az305_all_mastered');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviewCardIds, setReviewCardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cloudor_az305_all_review');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cloudor_az305_all_mastered', JSON.stringify(masteredCardIds));
    } catch (e) {
      console.error(e);
    }
  }, [masteredCardIds]);

  useEffect(() => {
    try {
      localStorage.setItem('cloudor_az305_all_review', JSON.stringify(reviewCardIds));
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
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.topic.toLowerCase().includes(q) ||
          c.question.toLowerCase().includes(q) ||
          c.answer.toLowerCase().includes(q) ||
          c.keyRule.toLowerCase().includes(q) ||
          c.examTip.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    if (isShuffled) {
      result = [...result].sort((a, b) => (Math.sin(a.id * 997) > Math.sin(b.id * 997) ? 1 : -1));
    }

    return result;
  }, [
    domainFilteredCards,
    selectedCategoryFilter,
    selectedDifficultyFilter,
    selectedStatusFilter,
    searchQuery,
    isShuffled,
    masteredCardIds,
    reviewCardIds,
  ]);

  // Reset index when filters change
  useEffect(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [selectedDomain, selectedCategoryFilter, selectedDifficultyFilter, selectedStatusFilter, searchQuery]);

  const currentCard: Az305Flashcard | undefined = filteredCards[currentCardIndex];

  // Navigation handlers
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
    (cardId: number) => {
      setMasteredCardIds((prev) => {
        if (prev.includes(cardId)) {
          return prev.filter((id) => id !== cardId);
        } else {
          return [...prev, cardId];
        }
      });
      setReviewCardIds((prev) => prev.filter((id) => id !== cardId));
    },
    []
  );

  const toggleReview = useCallback(
    (cardId: number) => {
      setReviewCardIds((prev) => {
        if (prev.includes(cardId)) {
          return prev.filter((id) => id !== cardId);
        } else {
          return [...prev, cardId];
        }
      });
      setMasteredCardIds((prev) => prev.filter((id) => id !== cardId));
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

  // Overall statistics
  const stats = useMemo(() => {
    const totalInPool = allCardsPool.length;
    const masteredCount = allCardsPool.filter((c) => masteredCardIds.includes(c.id)).length;
    const reviewCount = allCardsPool.filter((c) => reviewCardIds.includes(c.id)).length;
    const unreadCount = totalInPool - masteredCount - reviewCount;
    const masteredPct = Math.round((masteredCount / totalInPool) * 100);

    const domainBreakdown = [1, 2, 3, 4].map((dNum) => {
      const dCards = allCardsPool.filter((c) => c.domainNumber === dNum);
      const dMastered = dCards.filter((c) => masteredCardIds.includes(c.id)).length;
      return {
        domainNumber: dNum,
        total: dCards.length,
        mastered: dMastered,
        pct: Math.round((dMastered / dCards.length) * 100),
      };
    });

    return { totalInPool, masteredCount, reviewCount, unreadCount, masteredPct, domainBreakdown };
  }, [allCardsPool, masteredCardIds, reviewCardIds]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30">
      {/* Top Banner / Hero */}
      <div className="relative border-b border-slate-800 bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 px-4 py-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  Microsoft Azure Solutions Architect Expert
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  AZ-305 Expert Exam Suite
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  400 Deep Architecture Flashcards
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span className="p-2 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" />
                  </svg>
                </span>
                AZ-305 Solutions Architect Expert Mastery
              </h1>
              <p className="mt-1 text-sm text-slate-400 max-w-3xl">
                100 meticulously verified architecture flashcards per domain (400 total) covering Microsoft Entra ID, governance, monitoring, relational/NoSQL storage, business continuity, and infrastructure solutions.
              </p>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex items-center gap-2 self-start md:self-auto bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveView('flashcards')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeView === 'flashcards'
                    ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Study Flashcards (400)
              </button>
              <button
                onClick={() => setActiveView('blueprint')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeView === 'blueprint'
                    ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exam Blueprint & Weights
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
              <span className="text-xs text-slate-400 block font-medium">Mastered</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-emerald-400">{stats.masteredCount}</span>
                <span className="text-xs text-slate-500">/ 400 ({stats.masteredPct}%)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${stats.masteredPct}%` }} />
              </div>
            </div>

            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
              <span className="text-xs text-slate-400 block font-medium">Needs Review</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-amber-400">{stats.reviewCount}</span>
                <span className="text-xs text-slate-500">bookmarked</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${Math.round((stats.reviewCount / stats.totalInPool) * 100)}%` }} />
              </div>
            </div>

            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
              <span className="text-xs text-slate-400 block font-medium">Domain 1 (Identity/Gov)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-bold text-sky-400">{stats.domainBreakdown[0].mastered}</span>
                <span className="text-xs text-slate-500">/ 100 ({stats.domainBreakdown[0].pct}%)</span>
              </div>
            </div>

            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
              <span className="text-xs text-slate-400 block font-medium">Domain 2 (Data Storage)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-bold text-blue-400">{stats.domainBreakdown[1].mastered}</span>
                <span className="text-xs text-slate-500">/ 100 ({stats.domainBreakdown[1].pct}%)</span>
              </div>
            </div>

            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
              <span className="text-xs text-slate-400 block font-medium">Domain 3 (Continuity)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-bold text-emerald-400">{stats.domainBreakdown[2].mastered}</span>
                <span className="text-xs text-slate-500">/ 100 ({stats.domainBreakdown[2].pct}%)</span>
              </div>
            </div>

            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
              <span className="text-xs text-slate-400 block font-medium">Domain 4 (Infrastructure)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-bold text-purple-400">{stats.domainBreakdown[3].mastered}</span>
                <span className="text-xs text-slate-500">/ 100 ({stats.domainBreakdown[3].pct}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeView === 'flashcards' ? (
        <div className="max-w-7xl mx-auto w-full px-4 py-6 md:px-8 flex-1 flex flex-col">
          {/* Domain Selection Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-6 pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Target Domain:</span>
            {[
              { id: 1, label: 'Domain 1: Identity & Governance (100 Cards)', short: 'D1: Identity/Gov (100)', color: 'text-sky-400 border-sky-500' },
              { id: 2, label: 'Domain 2: Data Storage Solutions (100 Cards)', short: 'D2: Data Storage (100)', color: 'text-blue-400 border-blue-500' },
              { id: 3, label: 'Domain 3: Business Continuity (100 Cards)', short: 'D3: Continuity (100)', color: 'text-emerald-400 border-emerald-500' },
              { id: 4, label: 'Domain 4: Infrastructure Solutions (100 Cards)', short: 'D4: Infrastructure (100)', color: 'text-purple-400 border-purple-500' },
              { id: 'all', label: 'All Domains (400 Cards Combined)', short: 'All 4 Domains (400)', color: 'text-slate-200 border-slate-400' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedDomain(tab.id as any);
                  setSelectedCategoryFilter('all');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all border ${
                  selectedDomain === tab.id
                    ? `bg-slate-800 ${tab.color} shadow-sm shadow-sky-500/10`
                    : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.short}</span>
              </button>
            ))}
          </div>

          {/* Filtering Controls */}
          <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              {/* Category Filter */}
              <select
                aria-label="Filter by Sub-Objective Category"
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-sky-500 outline-none"
              >
                <option value="all">All Categories ({domainFilteredCards.length})</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Difficulty Filter */}
              <select
                aria-label="Filter by Difficulty"
                value={selectedDifficultyFilter}
                onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-sky-500 outline-none"
              >
                <option value="all">All Difficulties</option>
                <option value="Foundational">Foundational</option>
                <option value="Standard">Standard</option>
                <option value="Advanced">Advanced Architecture</option>
              </select>

              {/* Status Filter */}
              <select
                aria-label="Filter by Mastery Status"
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-sky-500 outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="mastered">Mastered Only</option>
                <option value="review">Review Bookmarked Only</option>
              </select>

              {/* Shuffle Button */}
              <button
                onClick={() => setIsShuffled((prev) => !prev)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                  isShuffled
                    ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                {isShuffled ? 'Shuffled' : 'Sequential'}
              </button>

              {/* Grid Overview Modal Button */}
              <button
                onClick={() => setShowGridModal(true)}
                className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750 hover:text-white flex items-center gap-1.5 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                All Cards Grid ({filteredCards.length})
              </button>
            </div>

            {/* Keyword Search */}
            <div className="relative min-w-[240px]">
              <input
                type="text"
                placeholder="Search topics, questions, rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-2 focus:ring-1 focus:ring-sky-500 outline-none"
              />
              <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Flashcard Canvas */}
          {filteredCards.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
              <svg className="w-12 h-12 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-bold text-slate-300">No flashcards match your current filter</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                Try loosening your category, difficulty, or search query filters to display more cards.
              </p>
              <button
                onClick={() => {
                  setSelectedCategoryFilter('all');
                  setSelectedDifficultyFilter('all');
                  setSelectedStatusFilter('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : currentCard ? (
            <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full">
              {/* Card Meta Header */}
              <div className="flex items-center justify-between px-2 mb-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-300">
                    Card #{currentCard.id}
                  </span>
                  <span>•</span>
                  <span className="text-sky-400 font-medium">{currentCard.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    currentCard.difficulty === 'Foundational' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    currentCard.difficulty === 'Standard' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30' :
                    'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                  }`}>
                    {currentCard.difficulty}
                  </span>
                  <span className="text-slate-500">
                    {currentCardIndex + 1} of {filteredCards.length}
                  </span>
                </div>
              </div>

              {/* Interactive Flip Card */}
              <div
                onClick={toggleFlip}
                className="relative min-h-[380px] md:min-h-[420px] bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 cursor-pointer shadow-xl hover:border-sky-500/40 transition-all flex flex-col justify-between select-none group"
              >
                {/* Status Indicator Badges */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-white bg-slate-800 px-3 py-1 rounded-md border border-slate-700">
                      {currentCard.topic}
                    </span>
                    {masteredCardIds.includes(currentCard.id) && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        ✓ Mastered
                      </span>
                    )}
                    {reviewCardIds.includes(currentCard.id) && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        ★ Marked for Review
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-1 group-hover:text-sky-400 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Click to Flip
                  </span>
                </div>

                {/* Card Body: Question vs Answer */}
                <div className="flex-1 flex flex-col justify-center my-4">
                  {!isFlipped ? (
                    <div>
                      <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-2">
                        Architectural Challenge / Question:
                      </span>
                      <h2 className="text-lg md:text-xl font-bold text-white leading-relaxed">
                        {currentCard.question}
                      </h2>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                          Comprehensive Solution:
                        </span>
                        <p className="text-sm md:text-base text-slate-200 leading-relaxed font-normal">
                          {currentCard.answer}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-sky-950/40 border border-sky-800/40">
                        <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider block mb-0.5">
                          Architectural Principle / Golden Rule:
                        </span>
                        <p className="text-xs text-sky-100 font-medium">
                          {currentCard.keyRule}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40">
                        <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-0.5">
                          AZ-305 Exam Tip:
                        </span>
                        <p className="text-xs text-amber-100">
                          {currentCard.examTip}
                        </p>
                      </div>

                      <div className="pt-2">
                        <a
                          href={currentCard.officialDocUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 underline font-medium"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Official Microsoft Learn Architecture Documentation
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls on Card */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMastered(currentCard.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                        masteredCardIds.includes(currentCard.id)
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      ✓ {masteredCardIds.includes(currentCard.id) ? 'Mastered' : 'Mark as Mastered (M)'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleReview(currentCard.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                        reviewCardIds.includes(currentCard.id)
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      ★ {reviewCardIds.includes(currentCard.id) ? 'Bookmarked' : 'Review Later (R)'}
                    </button>
                  </div>

                  <span className="hidden sm:inline text-[11px] text-slate-500">
                    Keyboard: Space to Flip • Arrows to Navigate
                  </span>
                </div>
              </div>

              {/* Navigation Bar */}
              <div className="flex items-center justify-between mt-4 px-2">
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 flex items-center gap-2 font-semibold text-xs md:text-sm transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous Card
                </button>

                {/* Progress Indicator Slider */}
                <div className="flex flex-col items-center gap-1 flex-1 max-w-xs mx-4">
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-blue-500 h-full rounded-full transition-all duration-200"
                      style={{ width: `${Math.round(((currentCardIndex + 1) / filteredCards.length) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Card {currentCardIndex + 1} of {filteredCards.length}
                  </span>
                </div>

                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold text-xs md:text-sm flex items-center gap-2 shadow-md shadow-sky-500/20 hover:from-sky-500 hover:to-blue-500 transition-all"
                >
                  Next Card
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        /* Blueprint View Tab */
        <div className="max-w-7xl mx-auto w-full px-4 py-8 md:px-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Domain breakdown */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                  Official AZ-305 Exam Blueprint & Domain Weights
                </h2>
                <p className="text-sm text-slate-400">
                  The Microsoft Certified: Azure Solutions Architect Expert (AZ-305) exam validates candidate ability to design cloud and hybrid solutions running on Microsoft Azure. Candidates must have advanced experience and knowledge of IT operations, including networking, virtualization, identity, security, business continuity, disaster recovery, data platforms, and governance.
                </p>
              </div>

              {/* Interactive Domain Cards */}
              <div className="space-y-4">
                {AZ_305_METADATA.domains.map((dom) => (
                  <div
                    key={dom.number}
                    onClick={() => setSelectedBlueprintDomain(dom.number as any)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      selectedBlueprintDomain === dom.number
                        ? 'bg-slate-900 border-sky-500 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/50'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${dom.bg} ${dom.color} border ${dom.border}`}>
                          Domain {dom.number} • {dom.weight}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          100 Dedicated Flashcards (Cards {(dom.number - 1) * 100 + 1}–{dom.number * 100})
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-300">
                        {stats.domainBreakdown[dom.number - 1].mastered}/100 Mastered ({stats.domainBreakdown[dom.number - 1].pct}%)
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-1">
                      {dom.name}
                    </h3>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-sky-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${stats.domainBreakdown[dom.number - 1].pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Detailed Breakdown for Selected Blueprint Domain */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  Key Sub-Objectives for Domain {selectedBlueprintDomain}: {AZ_305_METADATA.domains[selectedBlueprintDomain - 1].name}
                </h4>

                {selectedBlueprintDomain === 1 && (
                  <ul className="space-y-2 text-xs md:text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 font-bold">•</span>
                      <span><strong>Design Identity & Access Solutions:</strong> Microsoft Entra ID hybrid identities, Pass-Through Authentication vs Password Hash Sync, PIM just-in-time elevation, Conditional Access with Risk-based policies, Entra Verified ID, External Identities (B2B / B2C).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 font-bold">•</span>
                      <span><strong>Design Governance Solutions:</strong> Management Group hierarchies (max 6 levels), Azure Policy initiatives, custom Policy definitions, DenyAction effect, Azure Blueprints migration to Deployment Stacks, Cost Management budgets and anomaly alerts.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 font-bold">•</span>
                      <span><strong>Design Monitoring Solutions:</strong> Azure Monitor metrics, Log Analytics workspaces (centralized vs distributed), Application Insights distributed tracing, Azure Sentinel integration, Service Health alerts, and Prometheus/Grafana managed services.</span>
                    </li>
                  </ul>
                )}

                {selectedBlueprintDomain === 2 && (
                  <ul className="space-y-2 text-xs md:text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold">•</span>
                      <span><strong>Design Relational Storage:</strong> Azure SQL Database (DTU vs vCore, General Purpose vs Business Critical vs Hyperscale), Elastic Pools, Serverless auto-pause, Azure SQL Managed Instance (cross-db joins, SQL Agent), Azure Database for PostgreSQL Flexible Server.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold">•</span>
                      <span><strong>Design NoSQL Storage:</strong> Azure Cosmos DB (API for NoSQL, MongoDB, Cassandra, Gremlin), 5 consistency levels, partition key selection, Request Units (RU/s) autoscale vs serverless, multi-region writes, and Analytical Store with Synapse Link.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold">•</span>
                      <span><strong>Design Blob & File Storage:</strong> Azure Blob Storage access tiers (Hot, Cool, Cold, Archive), Lifecycle Management rules, Immutable Storage (WORM Legal Hold / Compliance), Data Lake Storage Gen2 (Hierarchical Namespace), Azure Files SMB/NFS, and Azure NetApp Files.</span>
                    </li>
                  </ul>
                )}

                {selectedBlueprintDomain === 3 && (
                  <ul className="space-y-2 text-xs md:text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Design High Availability (HA):</strong> Composite SLA calculations for serial vs parallel dependencies, Availability Zones (99.99%) vs Availability Sets (99.95%), regional pairs, and Chaos Studio resilience testing.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Design Azure Site Recovery (ASR):</strong> Azure-to-Azure VM replication, Recovery Plans with Automation runbooks, Test Failover drills (isolated VNets), failback procedures, and high-churn disk support.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Design Azure Backup:</strong> Recovery Services Vault vs Backup Vault, Instant Restore snapshot tier, Cross-Region Restore (CRR), Multi-User Authorization (MUA) with Resource Guard, and Locked Enhanced Soft Delete.</span>
                    </li>
                  </ul>
                )}

                {selectedBlueprintDomain === 4 && (
                  <ul className="space-y-2 text-xs md:text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">•</span>
                      <span><strong>Design Compute Solutions:</strong> Virtual Machines, Spot VMs, Burstable B-series, Azure App Service (plans, slots, ASEv3), Azure Functions (consumption, premium, durable functions), Azure Container Apps (Dapr & KEDA), and Azure Kubernetes Service (AKS).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">•</span>
                      <span><strong>Design Integration & Messaging:</strong> Azure API Management (tiers, policies, self-hosted gateway), Logic Apps Standard (single-tenant), Azure Service Bus (queues, topics, FIFO sessions, DLQ), Event Grid (pub/sub, MQTT broker), and Event Hubs.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">•</span>
                      <span><strong>Design Networking & Migration:</strong> Hub-and-spoke VNet topology, Virtual WAN Standard, Azure Firewall Premium (IDPS & TLS inspection), Private Endpoints, Azure Migrate (discovery, assessment, business case), DMS, and Azure VMware Solution (AVS).</span>
                    </li>
                  </ul>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedDomain(selectedBlueprintDomain);
                      setActiveView('flashcards');
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold text-xs flex items-center gap-2 hover:from-sky-500 hover:to-blue-500 transition-all shadow-md shadow-sky-500/20"
                  >
                    Study Domain {selectedBlueprintDomain} Flashcards (100 Cards)
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Col: Certification Requirements & Study Strategy */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Exam Quick Facts
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Exam Code:</span>
                    <span className="font-bold text-white">{AZ_305_METADATA.code}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Credential Level:</span>
                    <span className="font-bold text-sky-400">{AZ_305_METADATA.level}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Passing Score:</span>
                    <span className="font-bold text-emerald-400">{AZ_305_METADATA.passingScore}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Exam Duration:</span>
                    <span className="font-bold text-white">{AZ_305_METADATA.duration}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Question Format:</span>
                    <span className="font-bold text-right text-slate-200">{AZ_305_METADATA.questionsCount}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-sky-400 block">Prerequisite Note:</span>
                  <p>
                    Passing AZ-305 earns the <strong>Microsoft Certified: Azure Solutions Architect Expert</strong> certification provided you also hold an active <strong>Azure Administrator Associate (AZ-104)</strong> credential.
                  </p>
                </div>
              </div>

              {/* Cloudor Study Strategy */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950/40 border border-sky-500/20 space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Architectural Mastery Plan
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Review all 100 flashcards in Domain 1 and Domain 2 first (they comprise up to 60% of the exam). Focus heavily on:
                </p>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                  <li>PIM vs Conditional Access vs RBAC hierarchy</li>
                  <li>Cosmos DB consistency levels and partition key strategies</li>
                  <li>Azure SQL vCore tiers (Business Critical vs Hyperscale)</li>
                  <li>ASR Test Failover isolated networking rules</li>
                  <li>Hub-and-spoke VNet peering gateway transit constraints</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Modal */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 md:p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>AZ-305 Flashcards Grid</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    {filteredCards.length} Cards Loaded
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any card to jump immediately to that question.
                </p>
              </div>
              <button
                onClick={() => setShowGridModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {filteredCards.map((card, idx) => {
                const isMastered = masteredCardIds.includes(card.id);
                const isReview = reviewCardIds.includes(card.id);
                const isCurrent = idx === currentCardIndex;

                return (
                  <button
                    key={card.id}
                    onClick={() => {
                      setCurrentCardIndex(idx);
                      setIsFlipped(false);
                      setShowGridModal(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between h-24 ${
                      isCurrent
                        ? 'border-sky-500 bg-sky-950/40 ring-1 ring-sky-500'
                        : isMastered
                        ? 'border-emerald-600/40 bg-emerald-950/20 hover:border-emerald-500'
                        : isReview
                        ? 'border-amber-600/40 bg-amber-950/20 hover:border-amber-500'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] font-bold text-slate-300">
                        #{card.id}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold text-slate-400 bg-slate-800">
                        D{card.domainNumber}
                      </span>
                    </div>

                    <p className="text-[11px] font-medium text-slate-200 line-clamp-2 mt-1">
                      {card.topic}
                    </p>

                    <div className="flex items-center gap-1 mt-1">
                      {isMastered && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Mastered" />
                      )}
                      {isReview && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Marked for Review" />
                      )}
                      <span className="text-[9px] text-slate-500 ml-auto">
                        {card.difficulty}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Mastered
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Review
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-600" /> Unread
                </span>
              </div>
              <button
                onClick={() => setShowGridModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium"
              >
                Close Grid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
