import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PDE_GCP_DOMAIN_1_100_FLASHCARDS } from '../data/pdeGcpDomain1FlashcardsData';
import { PDE_GCP_DOMAIN_2_100_FLASHCARDS } from '../data/pdeGcpDomain2FlashcardsData';
import { PDE_GCP_DOMAIN_3_100_FLASHCARDS } from '../data/pdeGcpDomain3FlashcardsData';
import { PDE_GCP_DOMAIN_4_100_FLASHCARDS } from '../data/pdeGcpDomain4FlashcardsData';
import { PDE_GCP_DOMAIN_5_100_FLASHCARDS } from '../data/pdeGcpDomain5FlashcardsData';
import { PdeGcpFlashcard } from '../data/pdeGcpTypes';

interface PdeGcpLearningHubProps {
  initialMode?: 'flashcards' | 'blueprint' | 'quiz';
  onNavigate?: (tab: string) => void;
}

export const PDE_GCP_METADATA = {
  code: 'PDE-GCP',
  title: 'Google Cloud Professional Data Engineer',
  level: 'Professional',
  passingScore: 'Pass / Fail (Scaled score benchmark ~70%)',
  duration: '120 minutes (2 hours)',
  questionsCount: '50–60 questions (multiple choice, multiple response, scenario case studies)',
  domains: [
    { number: 1, name: 'Designing data processing systems', weight: '22%', cardsCount: 100, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    { number: 2, name: 'Ingesting and processing the data', weight: '25%', cardsCount: 100, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30' },
    { number: 3, name: 'Storing the data and managing databases', weight: '20%', cardsCount: 100, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    { number: 4, name: 'Preparing and using data for analysis', weight: '15%', cardsCount: 100, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
    { number: 5, name: 'Maintaining and automating data workloads', weight: '18%', cardsCount: 100, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  ],
};

export const PdeGcpLearningHub: React.FC<PdeGcpLearningHubProps> = ({
  initialMode = 'flashcards',
  onNavigate,
}) => {
  const { language } = useLanguage();

  const [activeView, setActiveView] = useState<'flashcards' | 'blueprint' | 'quiz'>(initialMode);
  const [selectedDomain, setSelectedDomain] = useState<1 | 2 | 3 | 4 | 5 | 'all'>(1);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'mastered' | 'review'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [showGridModal, setShowGridModal] = useState<boolean>(false);
  const [selectedBlueprintDomain, setSelectedBlueprintDomain] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Quiz state
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);

  // Combined pool of all 500 cards across 5 domains
  const allCardsPool = useMemo(() => {
    return [
      ...PDE_GCP_DOMAIN_1_100_FLASHCARDS,
      ...PDE_GCP_DOMAIN_2_100_FLASHCARDS,
      ...PDE_GCP_DOMAIN_3_100_FLASHCARDS,
      ...PDE_GCP_DOMAIN_4_100_FLASHCARDS,
      ...PDE_GCP_DOMAIN_5_100_FLASHCARDS,
    ];
  }, []);

  // Local storage for progress tracking
  const [masteredCardIds, setMasteredCardIds] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('pde_gcp_mastered_card_ids');
      return saved ? new Set<number>(JSON.parse(saved)) : new Set<number>();
    } catch {
      return new Set<number>();
    }
  });

  const [reviewCardIds, setReviewCardIds] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('pde_gcp_review_card_ids');
      return saved ? new Set<number>(JSON.parse(saved)) : new Set<number>();
    } catch {
      return new Set<number>();
    }
  });

  const [bookmarkedCardIds, setBookmarkedCardIds] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('pde_gcp_bookmarked_card_ids');
      return saved ? new Set<number>(JSON.parse(saved)) : new Set<number>();
    } catch {
      return new Set<number>();
    }
  });

  // Persist progress
  useEffect(() => {
    try {
      localStorage.setItem('pde_gcp_mastered_card_ids', JSON.stringify(Array.from(masteredCardIds)));
    } catch {
      // ignore storage errors
    }
  }, [masteredCardIds]);

  useEffect(() => {
    try {
      localStorage.setItem('pde_gcp_review_card_ids', JSON.stringify(Array.from(reviewCardIds)));
    } catch {
      // ignore storage errors
    }
  }, [reviewCardIds]);

  useEffect(() => {
    try {
      localStorage.setItem('pde_gcp_bookmarked_card_ids', JSON.stringify(Array.from(bookmarkedCardIds)));
    } catch {
      // ignore storage errors
    }
  }, [bookmarkedCardIds]);

  // Filter cards based on domain, category, difficulty, status, search
  const filteredCards = useMemo(() => {
    let pool = allCardsPool;

    if (selectedDomain !== 'all') {
      pool = pool.filter((card) => card.domainNumber === selectedDomain);
    }

    if (selectedCategoryFilter !== 'all') {
      pool = pool.filter((card) => card.category === selectedCategoryFilter);
    }

    if (selectedDifficultyFilter !== 'all') {
      pool = pool.filter((card) => card.difficulty === selectedDifficultyFilter);
    }

    if (selectedStatusFilter === 'mastered') {
      pool = pool.filter((card) => masteredCardIds.has(card.id));
    } else if (selectedStatusFilter === 'review') {
      pool = pool.filter((card) => reviewCardIds.has(card.id));
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      pool = pool.filter(
        (card) =>
          card.topic.toLowerCase().includes(q) ||
          card.question.toLowerCase().includes(q) ||
          card.answer.toLowerCase().includes(q) ||
          card.keyRule.toLowerCase().includes(q) ||
          card.examTip.toLowerCase().includes(q) ||
          card.category.toLowerCase().includes(q)
      );
    }

    if (isShuffled) {
      // Deterministic shuffle based on card ID
      return [...pool].sort((a, b) => ((a.id * 97) % 100) - ((b.id * 97) % 100));
    }

    return pool;
  }, [
    allCardsPool,
    selectedDomain,
    selectedCategoryFilter,
    selectedDifficultyFilter,
    selectedStatusFilter,
    searchQuery,
    isShuffled,
    masteredCardIds,
    reviewCardIds,
  ]);

  // Current active card
  const activeCard: PdeGcpFlashcard | undefined = filteredCards[currentCardIndex];

  // Reset index on filter changes
  useEffect(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [
    selectedDomain,
    selectedCategoryFilter,
    selectedDifficultyFilter,
    selectedStatusFilter,
    searchQuery,
    isShuffled,
  ]);

  // Categories list for current domain
  const availableCategories = useMemo(() => {
    const pool = selectedDomain === 'all'
      ? allCardsPool
      : allCardsPool.filter((c) => c.domainNumber === selectedDomain);
    const set = new Set<string>();
    pool.forEach((c) => set.add(c.category));
    return Array.from(set).sort();
  }, [allCardsPool, selectedDomain]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeView !== 'flashcards') return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextCard();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevCard();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        if (activeCard) handleToggleMastered(activeCard.id);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        if (activeCard) handleToggleReview(activeCard.id);
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        if (activeCard) handleToggleBookmark(activeCard.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView, activeCard]);

  const handleNextCard = useCallback(() => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % filteredCards.length);
  }, [filteredCards.length]);

  const handlePrevCard = useCallback(() => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  }, [filteredCards.length]);

  const handleToggleMastered = (cardId: number) => {
    setMasteredCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
        // remove from review if mastered
        setReviewCardIds((r) => {
          const nr = new Set(r);
          nr.delete(cardId);
          return nr;
        });
      }
      return next;
    });
  };

  const handleToggleReview = (cardId: number) => {
    setReviewCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
        // remove from mastered if needs review
        setMasteredCardIds((m) => {
          const nm = new Set(m);
          nm.delete(cardId);
          return nm;
        });
      }
      return next;
    });
  };

  const handleToggleBookmark = (cardId: number) => {
    setBookmarkedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  // Generate quiz options for the active card
  const quizOptions = useMemo(() => {
    if (!activeCard) return [];
    const correct = activeCard.keyRule;

    // Pick 3 random alternative keyRules from other cards in the same domain
    const otherCards = allCardsPool.filter(
      (c) => c.id !== activeCard.id && c.domainNumber === activeCard.domainNumber
    );

    const shuffledOthers = [...otherCards].sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [correct, ...shuffledOthers.map((c) => c.keyRule)];

    // Deterministic shuffle based on card ID
    return options.sort((a, b) => (a.charCodeAt(0) % 7) - (b.charCodeAt(0) % 7));
  }, [activeCard, allCardsPool]);

  // Overall stats
  const totalMasteredCount = masteredCardIds.size;
  const totalReviewCount = reviewCardIds.size;
  const totalCardsCount = allCardsPool.length; // 500
  const progressPercent = Math.round((totalMasteredCount / totalCardsCount) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-blue-500/20 px-4 py-8 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Google Cloud
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Professional Level
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                500 Flashcards Suite
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                Google Cloud PDE (500 Cards)
              </span>
            </h1>
            <p className="mt-1 text-slate-300 text-sm sm:text-base max-w-2xl">
              {language === 'fr'
                ? 'Suite d\'apprentissage complète pour Google Cloud Professional Data Engineer (PDE) : 100 flashcards haute performance pour chacun des 5 domaines officiels.'
                : 'Comprehensive master suite for Google Cloud Professional Data Engineer (PDE): 100 high-yield flashcards across each of the 5 official exam domains.'}
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800 backdrop-blur-sm">
            <div className="text-center px-2">
              <div className="text-2xl font-black text-white">{totalCardsCount}</div>
              <div className="text-xs text-slate-400">Total Cards</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-2">
              <div className="text-2xl font-black text-emerald-400">{totalMasteredCount}</div>
              <div className="text-xs text-slate-400">Mastered</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-2">
              <div className="text-2xl font-black text-amber-400">{totalReviewCount}</div>
              <div className="text-xs text-slate-400">Needs Review</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-2">
              <div className="text-2xl font-black text-sky-400">{progressPercent}%</div>
              <div className="text-xs text-slate-400">Complete</div>
            </div>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="max-w-7xl mx-auto mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveView('flashcards')}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                activeView === 'flashcards'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🗂️ {language === 'fr' ? 'Cartes Mémoire' : 'Flashcards'} (500)
            </button>
            <button
              type="button"
              onClick={() => setActiveView('blueprint')}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                activeView === 'blueprint'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📐 {language === 'fr' ? 'Guide d\'Examen (5 Domaines)' : 'Exam Blueprint (5 Domains)'}
            </button>
            <button
              type="button"
              onClick={() => setActiveView('quiz')}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                activeView === 'quiz'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ {language === 'fr' ? 'Mode Quiz & Évaluation' : 'Quiz & Practice'}
            </button>
          </div>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('career-pathways')}
              className="text-xs text-slate-400 hover:text-blue-400 flex items-center gap-1 transition-colors"
            >
              ← {language === 'fr' ? 'Retour aux Certifications' : 'Back to Career Pathways'}
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        {activeView === 'flashcards' && (
          <div>
            {/* Domain Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
              <button
                type="button"
                onClick={() => setSelectedDomain('all')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedDomain === 'all'
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">All Domains</div>
                <div className="text-sm font-bold text-white mt-0.5">500 Cards</div>
                <div className="text-xs text-slate-400 mt-1">Full Curriculum</div>
              </button>

              {PDE_GCP_METADATA.domains.map((dom) => {
                const isSelected = selectedDomain === dom.number;
                return (
                  <button
                    key={dom.number}
                    type="button"
                    onClick={() => setSelectedDomain(dom.number as 1 | 2 | 3 | 4 | 5)}
                    className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? `${dom.bg} ${dom.border} shadow-md`
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold uppercase ${dom.color}`}>Domain {dom.number}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                        {dom.weight}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5 truncate">{dom.name}</div>
                    <div className="text-xs text-slate-400 mt-1">100 Cards</div>
                  </button>
                );
              })}
            </div>

            {/* Filter Bar */}
            <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'fr' ? 'Rechercher un concept (ex: BigQuery, Dataflow)...' : 'Search topic (e.g. BigQuery, Dataflow)...'}
                    className="w-56 sm:w-72 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Sub-Categories ({availableCategories.length})</option>
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
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Foundational">Foundational</option>
                  <option value="Standard">Standard</option>
                  <option value="Advanced">Advanced</option>
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="mastered">Mastered Only ({masteredCardIds.size})</option>
                  <option value="review">Needs Review ({reviewCardIds.size})</option>
                </select>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsShuffled((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isShuffled
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                  title="Shuffle deck order"
                >
                  🔀 {isShuffled ? 'Shuffled' : 'Shuffle'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowGridModal(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-950 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700"
                  title="Browse card list"
                >
                  ▦ {language === 'fr' ? 'Grille des Cartes' : 'Card Grid'} ({filteredCards.length})
                </button>
              </div>
            </div>

            {/* Flashcard Presentation Card */}
            {filteredCards.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center max-w-xl mx-auto">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {language === 'fr' ? 'Aucune carte ne correspond aux filtres' : 'No flashcards match filters'}
                </h3>
                <p className="text-slate-400 text-xs mb-4">
                  {language === 'fr'
                    ? 'Essayez de réinitialiser la recherche ou de changer de domaine.'
                    : 'Try clearing the search query or selecting a different category.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategoryFilter('all');
                    setSelectedDifficultyFilter('all');
                    setSelectedStatusFilter('all');
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              activeCard && (
                <div className="max-w-3xl mx-auto">
                  {/* Card Navigation Header */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-300 font-semibold">
                        Card {currentCardIndex + 1} of {filteredCards.length}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="font-mono text-slate-500">ID #{activeCard.id}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleBookmark(activeCard.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          bookmarkedCardIds.has(activeCard.id)
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                        title="Bookmark Card"
                      >
                        ★
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleReview(activeCard.id)}
                        className={`px-2 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                          reviewCardIds.has(activeCard.id)
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        Needs Review
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleMastered(activeCard.id)}
                        className={`px-2 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                          masteredCardIds.has(activeCard.id)
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        Mastered
                      </button>
                    </div>
                  </div>

                  {/* 3D Flip Card Container */}
                  <div
                    onClick={() => setIsFlipped((prev) => !prev)}
                    className="relative w-full cursor-pointer select-none perspective-1000 min-h-[380px]"
                  >
                    <div
                      className={`w-full min-h-[380px] rounded-2xl p-6 sm:p-8 border transition-all duration-300 flex flex-col justify-between ${
                        isFlipped
                          ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/60 border-blue-500/40 shadow-xl shadow-blue-500/10'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-lg'
                      }`}
                    >
                      {/* Top Metadata Badges */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Domain {activeCard.domainNumber}
                          </span>
                          <span className="text-xs text-slate-400 font-medium truncate max-w-[220px] sm:max-w-sm">
                            {activeCard.category}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                            activeCard.difficulty === 'Foundational'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : activeCard.difficulty === 'Standard'
                              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                              : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          }`}
                        >
                          {activeCard.difficulty}
                        </span>
                      </div>

                      {/* Card Body (Question or Answer) */}
                      <div className="my-auto py-6">
                        {!isFlipped ? (
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
                              {activeCard.topic}
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                              {activeCard.question}
                            </h2>
                            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
                              <span>Click card or press</span>
                              <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                                Space / Enter
                              </kbd>
                              <span>to reveal answer</span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                                {language === 'fr' ? 'Réponse Détaillée' : 'Detailed Solution'}
                              </div>
                              <p className="text-slate-100 text-sm sm:text-base leading-relaxed">
                                {activeCard.answer}
                              </p>
                            </div>

                            <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30">
                              <div className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                                <span>⚖️</span>
                                <span>{language === 'fr' ? 'Règle Clé / Formule d\'Or' : 'Key Architecture Rule'}</span>
                              </div>
                              <p className="text-xs text-blue-100 font-mono leading-relaxed">
                                {activeCard.keyRule}
                              </p>
                            </div>

                            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30">
                              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                                <span>💡</span>
                                <span>{language === 'fr' ? 'Astuce Examen PDE' : 'PDE Exam Tip'}</span>
                              </div>
                              <p className="text-xs text-amber-100 leading-relaxed">
                                {activeCard.examTip}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Footer */}
                      <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <span>Flip: Space</span>
                          <span>•</span>
                          <span>Next: →</span>
                        </div>
                        {isFlipped && activeCard.officialDocUrl && (
                          <a
                            href={activeCard.officialDocUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[11px]"
                          >
                            <span>Google Cloud Docs</span>
                            <span>↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-6">
                    <button
                      type="button"
                      onClick={handlePrevCard}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold hover:border-slate-700 flex items-center gap-2"
                    >
                      ← {language === 'fr' ? 'Précédente' : 'Previous'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsFlipped((prev) => !prev)}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20"
                      >
                        {isFlipped ? (language === 'fr' ? 'Masquer' : 'Flip to Question') : (language === 'fr' ? 'Afficher Réponse' : 'Flip to Answer')}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextCard}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold hover:border-slate-700 flex items-center gap-2"
                    >
                      {language === 'fr' ? 'Suivante' : 'Next'} →
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Blueprint View */}
        {activeView === 'blueprint' && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Domain Selector */}
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
              {PDE_GCP_METADATA.domains.map((dom) => (
                <button
                  key={dom.number}
                  type="button"
                  onClick={() => setSelectedBlueprintDomain(dom.number as 1 | 2 | 3 | 4 | 5)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedBlueprintDomain === dom.number
                      ? `${dom.bg} ${dom.border} ${dom.color}`
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Domain {dom.number} ({dom.weight})
                </button>
              ))}
            </div>

            {/* Selected Domain Guide */}
            {selectedBlueprintDomain === 1 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Domain 1 (22%)</span>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      Section 1: Designing data processing systems
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    100 Flashcards
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h3 className="font-bold text-white text-base">Key Architecture Pillars</h3>
                    <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
                      <li>Security & Compliance: BigQuery Column-Level Security via Dataplex Policy Tags.</li>
                      <li>Row-Level Security (RLS) policies with `SESSION_USER()` predicates.</li>
                      <li>Data Governance: Dataplex Lakes, Zones (Raw vs Curated), and attached storage Assets.</li>
                      <li>Reliability & Scalability: Zero-downtime database architectures across zones and regions.</li>
                      <li>Decoupling storage from compute across BigQuery, Dataproc, and Cloud Storage.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h3 className="font-bold text-white text-base">PDE Exam Rules of Thumb</h3>
                    <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
                      <li>Never grant raw table access when masking sensitive PII; attach Dataplex Policy Tags.</li>
                      <li>Use BigLake tables to enforce fine-grained access control on external Parquet files in GCS.</li>
                      <li>Always co-locate compute and storage in the exact same region to avoid egress fees.</li>
                      <li>Design architectures with high availability and disaster recovery meeting RTO/RPO SLAs.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedBlueprintDomain === 2 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Domain 2 (25%)</span>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      Section 2: Ingesting and processing the data
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    100 Flashcards
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h3 className="font-bold text-white text-base">Key Streaming & Batch Services</h3>
                    <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
                      <li>Cloud Pub/Sub: Ordering keys, dead-letter topics, exactly-once delivery, seek/replay.</li>
                      <li>Apache Beam / Dataflow: Sliding vs Tumbling vs Session windows, event-time watermarks.</li>
                      <li>Late data handling: `.withAllowedLateness()` and accumulating vs discarding triggers.</li>
                      <li>Cloud Dataproc: Ephemeral clusters, Serverless Spark, Enhanced Flexibility Mode (EFM).</li>
                      <li>Cloud Data Fusion: Visual drag-and-drop ETL, Wrangler data preparation, CDC replication.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h3 className="font-bold text-white text-base">Dataflow & Dataproc Exam Rules</h3>
                    <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
                      <li>Use Pub/Sub BigQuery Subscriptions for streaming with zero worker VM infrastructure.</li>
                      <li>Use Dataflow FlexRS (`--flexRSGoal=COST_OPTIMIZED`) for non-urgent batch jobs.</li>
                      <li>Always use ephemeral Dataproc clusters backed by Cloud Storage and Dataproc Metastore.</li>
                      <li>Broadcast joins prevent expensive network shuffles when joining large tables with small dimensions.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedBlueprintDomain === 3 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Domain 3 (20%)</span>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      Section 3: Storing the data and managing databases
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    100 Flashcards
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h3 className="font-bold text-white text-base">Key Storage Technologies</h3>
                    <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
                      <li>Cloud Bigtable: Tall/narrow tables, row key salting, reversed timestamps, Key Visualizer.</li>
                      <li>Cloud Spanner: TrueTime external consistency, interleaved tables, non-sequential keys.</li>
                      <li>BigQuery: Table partitioning, table clustering, active vs long-term storage, BI Engine.</li>
                      <li>Cloud Storage: Standard, Nearline, Coldline, Archive, Autoclass, and WORM Bucket Lock.</li>
                      <li>AlloyDB for PostgreSQL: Columnar engine (100x OLAP), decoupled storage (4x OLTP).</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h3 className="font-bold text-white text-base">Database Selection Matrix</h3>
                    <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
                      <li>Sub-10ms operational IoT/time-series: Cloud Bigtable.</li>
                      <li>Globally distributed relational SQL with ACID: Cloud Spanner.</li>
                      <li>Analytical SQL data warehouse for petabytes: BigQuery.</li>
                      <li>Managed regional relational database &lt;64 TB: Cloud SQL / AlloyDB.</li>
                      <li>Serverless mobile/web document store: Firestore Native Mode.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedBlueprintDomain === 4 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Domain 4 (15%)</span>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      Section 4: Preparing and using data for analysis
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    100 Flashcards
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h3 className="font-bold text-white text-base">BigQuery ML & Feature Engineering</h3>
                    <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
                      <li>BQML: `LINEAR_REG`, `LOGISTIC_REG`, `ARIMA_PLUS`, `KMEANS`, `AUTOML_CLASSIFIER`.</li>
                      <li>In-model preprocessing with `TRANSFORM` clause to eliminate training-serving skew.</li>
                      <li>Vector search in SQL via `ML.GENERATE_TEXT_EMBEDDING` and `VECTOR_SEARCH()`.</li>
                      <li>Vertex AI Feature Store: Point-in-time correct lookups preventing feature leakage.</li>
                      <li>Dataform: Dependency DAGs with `ref()`, incremental tables, and SQL assertions.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h3 className="font-bold text-white text-base">Looker & SQL Transformation Rules</h3>
                    <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
                      <li>Use `QUALIFY ROW_NUMBER() OVER(PARTITION BY id ORDER BY time DESC) = 1` for deduplication.</li>
                      <li>LookML centralizes semantic business definitions and eliminates fan-out errors.</li>
                      <li>Avoid `SELECT *` in BigQuery to prevent massive on-demand columnar scan bills.</li>
                      <li>Use `SAFE_` functions (`SAFE_CAST`) to prevent dirty data from aborting queries.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedBlueprintDomain === 5 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Domain 5 (18%)</span>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      Section 5: Maintaining and automating data workloads
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    100 Flashcards
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h3 className="font-bold text-white text-base">Cloud Composer & Orchestration</h3>
                    <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
                      <li>Cloud Composer (Airflow): Idempotent DAG tasks, `catchup=False`, zero top-level code.</li>
                      <li>Use `mode='reschedule'` on Airflow sensors to prevent worker slot pool deadlocks.</li>
                      <li>Always delete ephemeral Dataproc clusters using `trigger_rule=ALL_DONE`.</li>
                      <li>Store Airflow variables and secrets securely inside Google Secret Manager.</li>
                      <li>Use Deferrable Operators for long-running BigQuery/Dataflow jobs to free worker slots.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h3 className="font-bold text-white text-base">Monitoring, FinOps & Security</h3>
                    <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
                      <li>Alert on Pub/Sub `oldest_unacked_message_age` to detect stalled data pipelines.</li>
                      <li>Enforce `maximum_bytes_billed` on BigQuery queries to prevent accidental runaway bills.</li>
                      <li>Use BigQuery Reservations to isolate production pipelines from ad-hoc queries.</li>
                      <li>Implement CMEK with Cloud KMS for instant crypto-shredding and compliance.</li>
                      <li>VPC Service Controls perimeters block unauthorized data exfiltration to external buckets.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quiz Mode View */}
        {activeView === 'quiz' && activeCard && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    Domain {activeCard.domainNumber} Practice Question
                  </span>
                  <div className="text-xs text-slate-400 mt-0.5">{activeCard.category}</div>
                </div>
                <div className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-800 text-slate-200">
                  Score: {quizScore}
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white mb-6">
                {activeCard.question}
              </h3>

              <div className="space-y-3">
                {quizOptions.map((opt, idx) => {
                  const isSelected = quizSelectedOption === idx;
                  const isCorrect = opt === activeCard.keyRule;

                  let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700';

                  if (quizAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-100';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-100';
                    } else {
                      btnStyle = 'bg-slate-950/50 border-slate-850 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={quizAnswered}
                      onClick={() => {
                        setQuizSelectedOption(idx);
                        setQuizAnswered(true);
                        if (isCorrect) {
                          setQuizScore((prev) => prev + 1);
                        }
                      }}
                      className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all ${btnStyle}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-xs text-slate-500 mt-0.5">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {quizAnswered && (
                <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    {quizSelectedOption !== null && quizOptions[quizSelectedOption] === activeCard.keyRule ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        ✓ Correct! Great job.
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        ✗ Incorrect. See the golden rule above.
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setQuizAnswered(false);
                      setQuizSelectedOption(null);
                      handleNextCard();
                    }}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                  >
                    Next Question →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Grid Modal for Jumping Directly to Cards */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {language === 'fr' ? 'Parcourir les Flashcards' : 'Browse Flashcard Deck'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {filteredCards.length} cards matching current filters
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGridModal(false)}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
              {filteredCards.map((card, idx) => {
                const isCurrent = idx === currentCardIndex;
                const isMastered = masteredCardIds.has(card.id);
                const isReview = reviewCardIds.has(card.id);

                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => {
                      setCurrentCardIndex(idx);
                      setIsFlipped(false);
                      setShowGridModal(false);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs transition-all relative overflow-hidden ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-500/20 text-white font-bold ring-2 ring-blue-500/40'
                        : isMastered
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                        : isReview
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
                        : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 mb-1">
                      <span>#{card.id}</span>
                      <span>D{card.domainNumber}</span>
                    </div>
                    <div className="font-semibold text-slate-100 truncate line-clamp-2">
                      {card.topic}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowGridModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
