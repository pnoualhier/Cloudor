import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AZ_204_DOMAIN_1_100_FLASHCARDS } from '../data/az204Domain1FlashcardsData';
import { AZ_204_DOMAIN_2_100_FLASHCARDS } from '../data/az204Domain2FlashcardsData';
import { AZ_204_DOMAIN_3_100_FLASHCARDS } from '../data/az204Domain3FlashcardsData';
import { AZ_204_DOMAIN_4_100_FLASHCARDS } from '../data/az204Domain4FlashcardsData';
import { AZ_204_DOMAIN_5_100_FLASHCARDS } from '../data/az204Domain5FlashcardsData';
import { Az204Flashcard } from '../data/az204Types';

interface Az204LearningHubProps {
  initialMode?: 'flashcards' | 'blueprint' | 'quiz';
  onNavigate?: (tab: string) => void;
}

export const AZ_204_METADATA = {
  code: 'AZ-204',
  title: 'Microsoft Certified: Azure Developer Associate',
  level: 'Associate',
  passingScore: '700 / 1000 (scaled score)',
  duration: '120 minutes (2 hours)',
  questionsCount: '40–60 questions (multiple choice, multiple response, scenario case studies, code completions)',
  domains: [
    { number: 1, name: 'Develop Azure compute solutions', weight: '25–30%', cardsCount: 100, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30' },
    { number: 2, name: 'Develop for Azure storage', weight: '15–20%', cardsCount: 100, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    { number: 3, name: 'Implement Azure security', weight: '20–25%', cardsCount: 100, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    { number: 4, name: 'Monitor, troubleshoot, and optimize Azure solutions', weight: '15–20%', cardsCount: 100, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
    { number: 5, name: 'Connect to and consume Azure services and third-party services', weight: '15–20%', cardsCount: 100, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  ],
};

export const Az204LearningHub: React.FC<Az204LearningHubProps> = ({
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
      ...AZ_204_DOMAIN_1_100_FLASHCARDS,
      ...AZ_204_DOMAIN_2_100_FLASHCARDS,
      ...AZ_204_DOMAIN_3_100_FLASHCARDS,
      ...AZ_204_DOMAIN_4_100_FLASHCARDS,
      ...AZ_204_DOMAIN_5_100_FLASHCARDS,
    ];
  }, []);

  // Filter cards by selected domain
  const domainFilteredCards = useMemo(() => {
    if (selectedDomain === 1) return AZ_204_DOMAIN_1_100_FLASHCARDS;
    if (selectedDomain === 2) return AZ_204_DOMAIN_2_100_FLASHCARDS;
    if (selectedDomain === 3) return AZ_204_DOMAIN_3_100_FLASHCARDS;
    if (selectedDomain === 4) return AZ_204_DOMAIN_4_100_FLASHCARDS;
    if (selectedDomain === 5) return AZ_204_DOMAIN_5_100_FLASHCARDS;
    return allCardsPool;
  }, [selectedDomain, allCardsPool]);

  // Extract unique categories for current domain pool
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    domainFilteredCards.forEach(c => set.add(c.category));
    return Array.from(set).sort();
  }, [domainFilteredCards]);

  // Mastered & review tracking stored in localStorage
  const [masteredIds, setMasteredIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('az204_mastered_card_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviewIds, setReviewIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('az204_review_card_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleMastered = useCallback((id: number) => {
    setMasteredIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('az204_mastered_card_ids', JSON.stringify(next));
      return next;
    });
    setReviewIds(prev => {
      const next = prev.filter(x => x !== id);
      localStorage.setItem('az204_review_card_ids', JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleReview = useCallback((id: number) => {
    setReviewIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('az204_review_card_ids', JSON.stringify(next));
      return next;
    });
  }, []);

  // Filter cards by category, difficulty, status, search
  const visibleCards = useMemo(() => {
    let result = [...domainFilteredCards];

    if (selectedCategoryFilter !== 'all') {
      result = result.filter(c => c.category === selectedCategoryFilter);
    }

    if (selectedDifficultyFilter !== 'all') {
      result = result.filter(c => c.difficulty === selectedDifficultyFilter);
    }

    if (selectedStatusFilter === 'mastered') {
      result = result.filter(c => masteredIds.includes(c.id));
    } else if (selectedStatusFilter === 'review') {
      result = result.filter(c => reviewIds.includes(c.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        c =>
          c.question.toLowerCase().includes(q) ||
          c.answer.toLowerCase().includes(q) ||
          c.topic.toLowerCase().includes(q) ||
          c.keyRule.toLowerCase().includes(q) ||
          c.examTip.toLowerCase().includes(q)
      );
    }

    if (isShuffled) {
      // Deterministic pseudorandom sort for stability
      result = [...result].sort((a, b) => ((a.id * 37) % 100) - ((b.id * 37) % 100));
    }

    return result;
  }, [
    domainFilteredCards,
    selectedCategoryFilter,
    selectedDifficultyFilter,
    selectedStatusFilter,
    searchQuery,
    masteredIds,
    reviewIds,
    isShuffled,
  ]);

  // Keep card index valid
  useEffect(() => {
    if (currentCardIndex >= visibleCards.length) {
      setCurrentCardIndex(0);
    }
  }, [visibleCards.length, currentCardIndex]);

  const currentCard: Az204Flashcard | undefined = visibleCards[currentCardIndex];

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setCurrentCardIndex(prev => (prev > 0 ? prev - 1 : visibleCards.length - 1));
  }, [visibleCards.length]);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentCardIndex(prev => (prev < visibleCards.length - 1 ? prev + 1 : 0));
  }, [visibleCards.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showGridModal) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(f => !f);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyN') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyP') {
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
  }, [handleNext, handlePrev, showGridModal, currentCard, toggleMastered, toggleReview]);

  // Quiz state setup: sample 10 cards
  const quizCards = useMemo(() => {
    const pool = domainFilteredCards;
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  }, [domainFilteredCards, activeView]);

  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);

  // Generate 4 options for current quiz question
  const currentQuizOptions = useMemo(() => {
    if (!quizCards[currentQuizIndex]) return [];
    const correct = quizCards[currentQuizIndex];
    const others = allCardsPool.filter(c => c.id !== correct.id);
    const distractors = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    const combined = [correct, ...distractors].sort(() => 0.5 - Math.random());
    return combined;
  }, [quizCards, currentQuizIndex, allCardsPool]);

  const handleQuizAnswer = (selectedIndex: number) => {
    if (quizAnswered) return;
    setQuizSelectedOption(selectedIndex);
    setQuizAnswered(true);
    if (currentQuizOptions[selectedIndex]?.id === quizCards[currentQuizIndex]?.id) {
      setQuizScore(s => s + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    setQuizAnswered(false);
    setQuizSelectedOption(null);
    setCurrentQuizIndex(i => i + 1);
  };

  const handleResetQuiz = () => {
    setQuizScore(0);
    setQuizAnswered(false);
    setQuizSelectedOption(null);
    setCurrentQuizIndex(0);
  };

  const domainColors: Record<number, { text: string; bg: string; border: string }> = {
    1: { text: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30' },
    2: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    3: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    4: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
    5: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 p-4 md:p-8">
      {/* Top Banner & Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#0078d4]/20 text-[#70baff] border border-[#0078d4]/40">
                {AZ_204_METADATA.code} • {AZ_204_METADATA.level}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs bg-slate-800 text-slate-300 border border-slate-700">
                500 High-Yield Flashcards (100 / Domain)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Official 2025 Blueprint
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {language === 'fr'
                ? 'Hub de Maîtrise Azure Developer Associate (AZ-204)'
                : 'Azure Developer Associate (AZ-204) Mastery Hub'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {language === 'fr'
                ? '500 flashcards expertes couvrant l’intégralité des 5 domaines d’examen officiels Microsoft Azure.'
                : '500 high-yield flashcards covering all 5 official Microsoft Azure Developer Associate exam domains.'}
            </p>
          </div>

          {/* Quick Stats & View Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveView('flashcards')}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  activeView === 'flashcards'
                    ? 'bg-[#0078d4] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🗂️ {language === 'fr' ? 'Flashcards' : 'Flashcards'} (500)
              </button>
              <button
                type="button"
                onClick={() => setActiveView('blueprint')}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  activeView === 'blueprint'
                    ? 'bg-[#0078d4] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📋 {language === 'fr' ? 'Plan d’Examen' : 'Exam Blueprint'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveView('quiz');
                  handleResetQuiz();
                }}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  activeView === 'quiz'
                    ? 'bg-[#0078d4] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚡ {language === 'fr' ? 'Quiz Rapide' : 'Practice Quiz'}
              </button>
            </div>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
              >
                ← {language === 'fr' ? 'Retour Dashboard' : 'Back to Dashboard'}
              </button>
            )}
          </div>
        </div>

        {/* Domain Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-4">
          <button
            type="button"
            onClick={() => {
              setSelectedDomain('all');
              setSelectedCategoryFilter('all');
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className={`p-2.5 rounded-lg border text-left transition ${
              selectedDomain === 'all'
                ? 'bg-[#0078d4]/20 border-[#0078d4] text-white ring-1 ring-[#0078d4]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-[11px] font-semibold text-slate-400">All Domains</div>
            <div className="text-xs font-bold truncate text-slate-200">Full 500 Suite</div>
            <div className="text-[10px] text-slate-500 mt-0.5">500 Cards</div>
          </button>

          {AZ_204_METADATA.domains.map(d => {
            const isSelected = selectedDomain === d.number;
            const cColor = domainColors[d.number];
            return (
              <button
                key={d.number}
                type="button"
                onClick={() => {
                  setSelectedDomain(d.number as 1 | 2 | 3 | 4 | 5);
                  setSelectedCategoryFilter('all');
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                }}
                className={`p-2.5 rounded-lg border text-left transition ${
                  isSelected
                    ? `${cColor.bg} ${cColor.border} text-white ring-1 ring-current`
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className={`text-[11px] font-semibold ${cColor.text}`}>
                  Domain {d.number} • {d.weight}
                </div>
                <div className="text-xs font-bold truncate text-slate-200">{d.name}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{d.cardsCount} Cards</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        {/* VIEW 1: FLASHCARDS INTERACTIVE DECK */}
        {activeView === 'flashcards' && (
          <div>
            {/* Filter & Search Bar */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 md:p-4 mb-6 shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* Search query */}
                <div className="lg:col-span-2 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => {
                      setSearchQuery(e.target.value);
                      setCurrentCardIndex(0);
                    }}
                    placeholder={
                      language === 'fr'
                        ? 'Rechercher par concept, service, règle clé...'
                        : 'Search by concept, service, key rule...'
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0078d4]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-xs text-slate-500 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category filter */}
                <div>
                  <select
                    value={selectedCategoryFilter}
                    onChange={e => {
                      setSelectedCategoryFilter(e.target.value);
                      setCurrentCardIndex(0);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#0078d4]"
                  >
                    <option value="all">
                      {language === 'fr' ? 'Toutes Catégories' : 'All Categories'} ({availableCategories.length})
                    </option>
                    {availableCategories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty filter */}
                <div>
                  <select
                    value={selectedDifficultyFilter}
                    onChange={e => {
                      setSelectedDifficultyFilter(e.target.value);
                      setCurrentCardIndex(0);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#0078d4]"
                  >
                    <option value="all">{language === 'fr' ? 'Toutes Difficultés' : 'All Difficulties'}</option>
                    <option value="Foundational">Foundational</option>
                    <option value="Standard">Standard</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                {/* Mastery status & Tools */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedStatusFilter}
                    onChange={e => {
                      setSelectedStatusFilter(e.target.value as 'all' | 'mastered' | 'review');
                      setCurrentCardIndex(0);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#0078d4]"
                  >
                    <option value="all">{language === 'fr' ? 'Tous Statuts' : 'All Status'}</option>
                    <option value="mastered">
                      ⭐ {language === 'fr' ? 'Maîtrisées' : 'Mastered'} ({masteredIds.length})
                    </option>
                    <option value="review">
                      🚩 {language === 'fr' ? 'À Revoir' : 'Needs Review'} ({reviewIds.length})
                    </option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setIsShuffled(s => !s)}
                    title={isShuffled ? 'Unshuffle' : 'Shuffle cards'}
                    className={`p-2 rounded-lg border text-xs transition ${
                      isShuffled
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    🔀
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowGridModal(true)}
                    title="View card grid"
                    className="p-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white text-xs transition"
                  >
                    ⊞
                  </button>
                </div>
              </div>

              {/* Status bar */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
                <div>
                  {visibleCards.length > 0 ? (
                    <span>
                      {language === 'fr' ? 'Carte' : 'Card'}{' '}
                      <strong className="text-white font-mono">{currentCardIndex + 1}</strong>{' '}
                      {language === 'fr' ? 'sur' : 'of'}{' '}
                      <strong className="text-white font-mono">{visibleCards.length}</strong>
                      {visibleCards.length < domainFilteredCards.length && (
                        <span className="text-slate-500 ml-2">
                          (filtré sur {domainFilteredCards.length})
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-amber-400">
                      {language === 'fr' ? 'Aucune carte ne correspond au filtre' : 'No cards match filter'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-[11px]">
                  <span>
                    ⭐ {masteredIds.length} / 500 {language === 'fr' ? 'maîtrisées' : 'mastered'}
                  </span>
                  <span>
                    🚩 {reviewIds.length} {language === 'fr' ? 'à revoir' : 'to review'}
                  </span>
                  <span className="hidden md:inline text-slate-500">
                    ⌨️ Espace: Tourner • ← / → : Naviguer • M: Maîtrisé • R: Revoir
                  </span>
                </div>
              </div>
            </div>

            {/* Flashcard Component */}
            {currentCard ? (
              <div className="flex flex-col items-center">
                {/* 3D Flip Card Container */}
                <div
                  tabIndex={0}
                  onClick={() => setIsFlipped(f => !f)}
                  className="w-full max-w-4xl min-h-[380px] md:min-h-[440px] cursor-pointer focus:outline-none group perspective"
                >
                  <div
                    className={`relative w-full h-full rounded-2xl p-6 md:p-8 transition-all duration-300 border shadow-2xl flex flex-col justify-between ${
                      isFlipped
                        ? 'bg-slate-900 border-[#0078d4]/40 shadow-[#0078d4]/10'
                        : 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Card Top Metadata Bar */}
                    <div>
                      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              domainColors[currentCard.domainNumber]?.bg
                            } ${domainColors[currentCard.domainNumber]?.text} border ${
                              domainColors[currentCard.domainNumber]?.border
                            }`}
                          >
                            Domain {currentCard.domainNumber}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {currentCard.category}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs text-slate-300 font-semibold">
                            {currentCard.topic}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                              currentCard.difficulty === 'Foundational'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : currentCard.difficulty === 'Standard'
                                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            }`}
                          >
                            {currentCard.difficulty}
                          </span>
                          <span className="text-xs font-mono text-slate-500">#{currentCard.id}</span>
                        </div>
                      </div>

                      {/* FRONT FACE (Question) */}
                      {!isFlipped ? (
                        <div className="my-auto py-6">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-[#70baff] mb-2">
                            QUESTION / SCENARIO
                          </div>
                          <h2 className="text-lg md:text-2xl font-bold text-white leading-relaxed">
                            {currentCard.question}
                          </h2>
                          <div className="mt-8 flex items-center text-xs text-slate-500 group-hover:text-slate-300 transition">
                            <span>👆 {language === 'fr' ? 'Cliquer pour révéler la réponse officielle et la règle clé' : 'Click or press Space to reveal verified answer & exam tip'}</span>
                          </div>
                        </div>
                      ) : (
                        /* BACK FACE (Answer + Key Rule + Exam Tip) */
                        <div className="my-auto py-2 space-y-4">
                          <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
                              VERIFIED ANSWER / SOLUTION
                            </div>
                            <p className="text-sm md:text-base text-slate-100 leading-relaxed font-normal">
                              {currentCard.answer}
                            </p>
                          </div>

                          {/* Key Rule Box */}
                          <div className="bg-slate-950/80 border border-amber-500/30 rounded-lg p-3 text-xs">
                            <span className="font-bold text-amber-400 uppercase tracking-wide mr-2">
                              ⚡ Key Rule:
                            </span>
                            <span className="text-slate-200">{currentCard.keyRule}</span>
                          </div>

                          {/* Exam Tip Box */}
                          <div className="bg-slate-950/80 border border-[#0078d4]/30 rounded-lg p-3 text-xs">
                            <span className="font-bold text-[#70baff] uppercase tracking-wide mr-2">
                              🎯 Exam Tip:
                            </span>
                            <span className="text-slate-200">{currentCard.examTip}</span>
                          </div>

                          {/* Official Doc Link */}
                          {currentCard.officialDocUrl && (
                            <div className="text-right pt-1">
                              <a
                                href={currentCard.officialDocUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="text-xs text-[#70baff] hover:underline inline-flex items-center gap-1"
                              >
                                📖 Microsoft Learn Documentation ↗
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Bottom Actions Bar */}
                    <div
                      className="pt-4 mt-6 border-t border-slate-800 flex items-center justify-between"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleMastered(currentCard.id)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
                            masteredIds.includes(currentCard.id)
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
                          }`}
                        >
                          ⭐ {masteredIds.includes(currentCard.id) ? 'Mastered' : 'Mark Mastered (M)'}
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleReview(currentCard.id)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
                            reviewIds.includes(currentCard.id)
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
                          }`}
                        >
                          🚩 {reviewIds.includes(currentCard.id) ? 'Flagged' : 'Flag Review (R)'}
                        </button>
                      </div>

                      <div className="text-xs text-slate-500">
                        {isFlipped ? (
                          <span className="text-emerald-400">Answer view</span>
                        ) : (
                          <span className="text-sky-400">Question view</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Navigation Controls */}
                <div className="flex items-center gap-4 mt-6">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg border border-slate-700 text-xs font-semibold shadow transition flex items-center gap-2"
                  >
                    ← Previous
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFlipped(f => !f)}
                    className="px-6 py-2 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded-lg font-bold text-xs shadow-lg transition flex items-center gap-2"
                  >
                    🔄 {isFlipped ? 'Show Question' : 'Flip Card'} (Space)
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg border border-slate-700 text-xs font-semibold shadow transition flex items-center gap-2"
                  >
                    Next →
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
                <p className="text-slate-400 mb-4">
                  {language === 'fr'
                    ? 'Aucune carte ne correspond aux filtres actuels.'
                    : 'No flashcards match the selected filters.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategoryFilter('all');
                    setSelectedDifficultyFilter('all');
                    setSelectedStatusFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-lg bg-[#0078d4] text-white text-xs font-semibold"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: EXAM BLUEPRINT & DOMAIN BREAKDOWNS */}
        {activeView === 'blueprint' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-2">
                Official AZ-204 Examination Blueprint & Domain Weightings
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                The Microsoft Certified: Azure Developer Associate exam evaluates professional competencies across 5 domains.
                Each domain in this Hub contains exactly 100 deep-dive flashcards (500 total).
              </p>

              {/* Domain Switcher */}
              <div className="flex flex-wrap gap-2 mb-6">
                {AZ_204_METADATA.domains.map(d => (
                  <button
                    key={d.number}
                    type="button"
                    onClick={() => setSelectedBlueprintDomain(d.number as 1 | 2 | 3 | 4 | 5)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition ${
                      selectedBlueprintDomain === d.number
                        ? 'bg-[#0078d4] text-white border-[#0078d4]'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Domain {d.number} ({d.weight})
                  </button>
                ))}
              </div>

              {/* Selected Domain Deep Dive */}
              {selectedBlueprintDomain === 1 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-sky-500/10 border border-sky-500/30">
                    <h3 className="text-base font-bold text-sky-400">
                      Domain 1: Develop Azure compute solutions (25–30%) — 100 Flashcards
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Highest weighted domain on the exam. Covers App Service, Azure Functions, Azure Container Instances (ACI), Azure Container Apps (ACA), and Azure Kubernetes Service (AKS).
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <h4 className="font-bold text-white mb-2">1.1 Implement Azure App Service Web Apps</h4>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        <li>App Service Plans (Free, Basic, Standard, Premium v3, Isolated v2)</li>
                        <li>Deployment Slots, Auto-Swap, and traffic percentage routing</li>
                        <li>App Service scaling (scale up vs scale out, metrics autoscale)</li>
                        <li>Continuous deployment via GitHub Actions & Azure DevOps</li>
                        <li>Custom domains, SSL bindings, and App Service Certificates</li>
                      </ul>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <h4 className="font-bold text-white mb-2">1.2 Implement Azure Functions & Serverless</h4>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        <li>Hosting plans: Consumption, Premium (pre-warmed), Dedicated</li>
                        <li>Triggers & Bindings (Blob, Queue, Cosmos, Service Bus, Event Grid)</li>
                        <li>Durable Functions patterns (Chaining, Fan-out/Fan-in, Async HTTP)</li>
                        <li>Function app settings, `host.json`, and scale controllers</li>
                        <li>Custom handlers and Docker containerized Functions</li>
                      </ul>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <h4 className="font-bold text-white mb-2">1.3 Implement Containerized Solutions (ACI & ACA)</h4>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        <li>Azure Container Registry (ACR) build tasks and webhook triggers</li>
                        <li>Azure Container Instances (ACI) restart policies and volume mounts</li>
                        <li>Azure Container Apps (ACA) environments, revisions, and traffic splits</li>
                        <li>KEDA autoscaling rules (HTTP, Azure Queue, CPU) in ACA</li>
                        <li>Dapr integration for service invocation and state stores</li>
                      </ul>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <h4 className="font-bold text-white mb-2">1.4 Exam Preparation Strategy</h4>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        <li>Memorize `host.json` vs `local.settings.json` differences</li>
                        <li>Know exactly when to choose ACA vs AKS vs ACI</li>
                        <li>Understand deployment slot configuration stickiness (`slotSetting`)</li>
                        <li>Master Durable Functions orchestrator determinism constraints</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {selectedBlueprintDomain === 2 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <h3 className="text-base font-bold text-blue-400">
                      Domain 2: Develop for Azure storage (15–20%) — 100 Flashcards
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Focuses on Azure Cosmos DB (NoSQL API) data modeling, consistency levels, change feed, and Azure Blob / Queue Storage SDK operations.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <h4 className="font-bold text-white mb-2">2.1 Azure Cosmos DB (NoSQL API)</h4>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        <li>5 Consistency Levels: Strong, Bounded Staleness, Session, Consistent Prefix, Eventual</li>
                        <li>Partition Key selection: Cardinality, 20 GB logical partition limit, synthetic keys</li>
                        <li>Change Feed Push (processor) vs Pull model with lease containers</li>
                        <li>Indexing policies: Included/excluded paths and composite indexes for ORDER BY</li>
                        <li>Stored Procedures, Triggers (Pre/Post), and UDFs in JavaScript</li>
                      </ul>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <h4 className="font-bold text-white mb-2">2.2 Azure Blob Storage</h4>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        <li>Access Tiers: Hot, Cool, Cold, Archive (rehydration Standard vs High)</li>
                        <li>Blob metadata vs searchable Blob Index Tags (`FindBlobsByTags`)</li>
                        <li>Blob Leases (15-60s or infinite) for distributed locking</li>
                        <li>Lifecycle Management rules (tiering and auto-deletion)</li>
                        <li>Blob Versioning, Soft Delete, and WORM Immutability policies</li>
                      </ul>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <h4 className="font-bold text-white mb-2">2.3 Azure Queue Storage</h4>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        <li>64 KB max message size and Claim-Check pattern</li>
                        <li>Visibility Timeout, `PopReceipt`, and DequeueCount</li>
                        <li>Poison message routing after `maxDequeueCount`</li>
                        <li>Base64 message encoding requirements in Azure SDK</li>
                      </ul>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <h4 className="font-bold text-white mb-2">2.4 Exam Preparation Strategy</h4>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        <li>Memorize RU calculation: 1 RU = 1 point read of 1 KB item</li>
                        <li>Session consistency is the default; uses `SessionToken`</li>
                        <li>`ReadItemAsync` (point read) is always cheaper than `SELECT * WHERE id = ...`</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {selectedBlueprintDomain === 3 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <h3 className="text-base font-bold text-emerald-400">
                      Domain 3: Implement Azure security (20–25%) — 100 Flashcards
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Critical domain evaluating Microsoft Entra ID authentication, MSAL, Managed Identities, Azure Key Vault, and Azure App Configuration.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <h4 className="font-bold text-white mb-2">3.1 Microsoft Entra ID & MSAL</h4>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        <li>OAuth 2.0 flows: Auth Code + PKCE, Client Credentials, On-Behalf-Of (OBO), Device Code</li>
                        <li>MSAL token acquisition: `AcquireTokenSilent` with fallback to `AcquireTokenInteractive`</li>
                        <li>Claims: `scp` (delegated scopes) vs `roles` (app roles)</li>
                        <li>JWT validation: Signature, Expiry (`exp`), Audience (`aud`), Issuer (`iss`)</li>
                        <li>The `/.default` scope for static permissions in client credentials</li>
                      </ul>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <h4 className="font-bold text-white mb-2">3.2 Managed Identities & Key Vault</h4>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        <li>System-Assigned vs User-Assigned Managed Identity</li>
                        <li>`DefaultAzureCredential` execution chain and local dev fallbacks</li>
                        <li>Key Vault objects: Secrets (text), Keys (HSM), Certificates (X.509)</li>
                        <li>App Service Key Vault references (`@Microsoft.KeyVault(...)`)</li>
                        <li>Key Vault Soft Delete and Purge Protection</li>
                      </ul>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <h4 className="font-bold text-white mb-2">3.3 Azure App Configuration</h4>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        <li>Dynamic configuration refresh using Sentinel Keys</li>
                        <li>Feature Flags, Feature Filters (Targeting, TimeWindow, Percentage)</li>
                        <li>Key Vault references stored inside App Configuration</li>
                        <li>Labels for partitioning environments (Dev, Staging, Prod)</li>
                      </ul>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <h4 className="font-bold text-white mb-2">3.4 Exam Preparation Strategy</h4>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        <li>Always catch `MsalUiRequiredException` specifically</li>
                        <li>Never store client secrets in SPAs or mobile apps; use PKCE</li>
                        <li>Prefer User Delegation SAS over Service/Account SAS</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {selectedBlueprintDomain === 4 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <h3 className="text-base font-bold text-purple-400">
                      Domain 4: Monitor, troubleshoot, and optimize Azure solutions (15–20%) — 100 Flashcards
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Covers Application Insights, KQL log analysis, Azure Cache for Redis, Azure CDN, and transient fault handling with Polly.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <h4 className="font-bold text-white mb-2">4.1 Application Insights & KQL</h4>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        <li>`TelemetryClient`: `TrackEvent`, `TrackMetric`, `TrackTrace`, `TrackException`</li>
                        <li>Telemetry Initializers (`ITelemetryInitializer`) vs Processors (`ITelemetryProcessor`)</li>
                        <li>Sampling: Adaptive (auto), Fixed-rate, Ingestion</li>
                        <li>KQL operators: `where`, `project`, `extend`, `summarize`, `top`, `join` on `operation_Id`</li>
                        <li>Live Metrics Stream (QuickPulse) vs Application Map</li>
                      </ul>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <h4 className="font-bold text-white mb-2">4.2 Azure Cache for Redis</h4>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        <li>Tiers: Basic, Standard (failover), Premium (clustering, persistence, VNet)</li>
                        <li>Eviction policies: `volatile-lru`, `allkeys-lru`, `noeviction`</li>
                        <li>Cache-Aside pattern (Lazy Loading) with TTL</li>
                        <li>`ConnectionMultiplexer` singleton lifecycle and ThreadPool starvation</li>
                        <li>`IDistributedCache` integration in ASP.NET Core</li>
                      </ul>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <h4 className="font-bold text-white mb-2">4.3 Azure CDN & Front Door</h4>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        <li>Query string caching: Ignore, Bypass, Cache every unique URL</li>
                        <li>Purging edge assets: Single URL vs Wildcard `/*`</li>
                        <li>Controlling TTL with `s-maxage` and `max-age` HTTP headers</li>
                        <li>Dynamic Site Acceleration (DSA) and TCP pre-warming</li>
                      </ul>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <h4 className="font-bold text-white mb-2">4.4 Resilience & Transient Faults</h4>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        <li>Polly retry policy with exponential backoff and randomized jitter</li>
                        <li>Circuit Breaker pattern states: Closed, Open, Half-Open</li>
                        <li>Handling HTTP 429 and extracting `Retry-After` header</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {selectedBlueprintDomain === 5 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <h3 className="text-base font-bold text-amber-400">
                      Domain 5: Connect to and consume Azure services and third-party services (15–20%) — 100 Flashcards
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Covers Azure API Management (APIM), Azure Event Grid, Azure Event Hubs, and Azure Service Bus messaging.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <h4 className="font-bold text-white mb-2">5.1 Azure API Management (APIM)</h4>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        <li>Policy sections: &lt;inbound&gt;, &lt;backend&gt;, &lt;outbound&gt;, &lt;on-error&gt;</li>
                        <li>Key policies: &lt;rate-limit-by-key&gt;, &lt;validate-jwt&gt;, &lt;rewrite-uri&gt;, &lt;mock-response&gt;</li>
                        <li>Policy inheritance and the &lt;base /&gt; element placement</li>
                        <li>Products (Open vs Protected), Subscriptions, and Subscription Keys</li>
                        <li>Revisions (private safe updates) vs Versions (public breaking changes)</li>
                      </ul>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <h4 className="font-bold text-white mb-2">5.2 Azure Event Grid</h4>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        <li>Reactive discrete state eventing with push delivery</li>
                        <li>Webhook validation handshake (`validationCode` / `validationUrl`)</li>
                        <li>Event Grid schema vs CloudEvents v1.0 standard schema</li>
                        <li>Filtering: Event types, subject prefix/suffix, advanced filters</li>
                        <li>Dead-lettering unhandled events to Azure Blob Storage</li>
                      </ul>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <h4 className="font-bold text-white mb-2">5.3 Azure Event Hubs</h4>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        <li>High-throughput streaming log with Partitions and Consumer Groups</li>
                        <li>`EventProcessorClient` with Blob Storage checkpointing</li>
                        <li>Event Hubs Capture (time/size windows to Avro in Blob/ADLS)</li>
                        <li>Throughput Units (TUs) and Auto-Inflate feature</li>
                      </ul>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <h4 className="font-bold text-white mb-2">5.4 Azure Service Bus</h4>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        <li>`ReceiveAndDelete` vs `PeekLock` (`CompleteMessageAsync`, `Abandon`, `DeadLetter`)</li>
                        <li>Message Sessions for strict First-In, First-Out (FIFO) ordering</li>
                        <li>Duplicate Detection (`MessageId` and time window)</li>
                        <li>Subscription SQL and Correlation rule filters</li>
                        <li>Claim-Check pattern for payloads exceeding size limits</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: PRACTICE QUIZ MODE */}
        {activeView === 'quiz' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div>
                  <span className="text-xs font-semibold text-[#70baff] uppercase tracking-wider">
                    AZ-204 Practice Drill
                  </span>
                  <h2 className="text-xl font-bold text-white">
                    Question {currentQuizIndex + 1} of {quizCards.length}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Current Score:</span>
                  <div className="text-lg font-bold text-emerald-400 font-mono">
                    {quizScore} / {currentQuizIndex + (quizAnswered ? 1 : 0)}
                  </div>
                </div>
              </div>

              {currentQuizIndex < quizCards.length ? (
                <div>
                  {/* Question */}
                  <div className="mb-6">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold mb-2 ${
                        domainColors[quizCards[currentQuizIndex]?.domainNumber]?.bg
                      } ${domainColors[quizCards[currentQuizIndex]?.domainNumber]?.text}`}
                    >
                      Domain {quizCards[currentQuizIndex]?.domainNumber} • {quizCards[currentQuizIndex]?.category}
                    </span>
                    <h3 className="text-base md:text-lg font-semibold text-white leading-relaxed">
                      {quizCards[currentQuizIndex]?.question}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-3 mb-6">
                    {currentQuizOptions.map((opt, idx) => {
                      const isCorrect = opt.id === quizCards[currentQuizIndex]?.id;
                      const isSelected = quizSelectedOption === idx;

                      let btnStyle =
                        'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700';

                      if (quizAnswered) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 ring-1 ring-rose-500';
                        } else {
                          btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600';
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={quizAnswered}
                          onClick={() => handleQuizAnswer(idx)}
                          className={`w-full p-4 rounded-xl border text-left text-xs md:text-sm transition flex items-start gap-3 ${btnStyle}`}
                        >
                          <span className="font-mono font-bold text-slate-400">
                            {String.fromCharCode(65 + idx)}.
                          </span>
                          <span className="flex-1">{opt.answer}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Answer Explanation & Next Question */}
                  {quizAnswered && (
                    <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs">
                        <div className="font-bold text-amber-400 mb-1">⚡ Key Rule:</div>
                        <p className="text-slate-300">{quizCards[currentQuizIndex]?.keyRule}</p>
                        <div className="font-bold text-[#70baff] mt-2 mb-1">🎯 Exam Tip:</div>
                        <p className="text-slate-300">{quizCards[currentQuizIndex]?.examTip}</p>
                      </div>

                      <div className="flex justify-end">
                        {currentQuizIndex < quizCards.length - 1 ? (
                          <button
                            type="button"
                            onClick={handleNextQuizQuestion}
                            className="px-6 py-2.5 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded-lg font-bold text-xs shadow transition"
                          >
                            Next Question →
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setCurrentQuizIndex(quizCards.length)}
                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shadow transition"
                          >
                            View Results 🏁
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Quiz Complete Screen */
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">
                    {quizScore >= 7 ? '🎉' : '📚'}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    You scored{' '}
                    <strong className="text-white text-lg font-mono">{quizScore}</strong> out of{' '}
                    <strong className="text-white text-lg font-mono">{quizCards.length}</strong>{' '}
                    ({Math.round((quizScore / quizCards.length) * 100)}%)
                  </p>

                  <div className="flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleResetQuiz}
                      className="px-5 py-2.5 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded-lg font-bold text-xs transition"
                    >
                      🔄 Retake Quiz
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveView('flashcards')}
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold text-xs border border-slate-700 transition"
                    >
                      🗂️ Back to Flashcards
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Card Browser Grid */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 md:p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">AZ-204 Card Browser</h3>
                <p className="text-xs text-slate-400">
                  Showing {visibleCards.length} cards. Click any card to jump directly to it.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGridModal(false)}
                className="text-slate-400 hover:text-white text-lg p-2"
              >
                ✕
              </button>
            </div>

            {/* Modal Card Grid */}
            <div className="p-4 md:p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {visibleCards.map((card, idx) => (
                <div
                  key={card.id}
                  onClick={() => {
                    setCurrentCardIndex(idx);
                    setIsFlipped(false);
                    setShowGridModal(false);
                  }}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition ${
                    idx === currentCardIndex
                      ? 'bg-[#0078d4]/20 border-[#0078d4] text-white ring-1 ring-[#0078d4]'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="font-mono">#{card.id}</span>
                    <span className={domainColors[card.domainNumber]?.text}>
                      Domain {card.domainNumber}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-100 line-clamp-1 mb-1">
                    {card.topic}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2">{card.question}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
