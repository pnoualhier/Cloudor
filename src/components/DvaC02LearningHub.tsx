import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DVA_C02_DOMAIN_1_100_FLASHCARDS } from '../data/dvaC02Domain1FlashcardsData';
import { DVA_C02_DOMAIN_2_100_FLASHCARDS } from '../data/dvaC02Domain2FlashcardsData';
import { DVA_C02_DOMAIN_3_100_FLASHCARDS } from '../data/dvaC02Domain3FlashcardsData';
import { DVA_C02_DOMAIN_4_100_FLASHCARDS } from '../data/dvaC02Domain4FlashcardsData';
import { DvaC02Flashcard } from '../data/dvaC02Types';

interface DvaC02LearningHubProps {
  initialMode?: 'flashcards' | 'blueprint' | 'quiz';
  onNavigate?: (tab: string) => void;
}

export const DVA_C02_METADATA = {
  code: 'DVA-C02',
  title: 'AWS Certified Developer – Associate',
  level: 'Associate',
  passingScore: '720 / 1000 (scaled score)',
  duration: '130 minutes (2 hours 10 mins)',
  questionsCount: '65 questions (multiple choice and multiple response)',
  domains: [
    { number: 1, name: 'Development with AWS Services', weight: '32%', cardsCount: 100, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    { number: 2, name: 'Security', weight: '26%', cardsCount: 100, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
    { number: 3, name: 'Deployment', weight: '24%', cardsCount: 100, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30' },
    { number: 4, name: 'Troubleshooting and Optimization', weight: '18%', cardsCount: 100, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  ],
};

export const DvaC02LearningHub: React.FC<DvaC02LearningHubProps> = ({
  initialMode = 'flashcards',
  onNavigate,
}) => {
  const { language } = useLanguage();

  const [activeView, setActiveView] = useState<'flashcards' | 'blueprint' | 'quiz'>(initialMode);
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

  // Quiz state
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);

  // Combined pool of all 400 cards across 4 domains
  const allCardsPool = useMemo(() => {
    return [
      ...DVA_C02_DOMAIN_1_100_FLASHCARDS,
      ...DVA_C02_DOMAIN_2_100_FLASHCARDS,
      ...DVA_C02_DOMAIN_3_100_FLASHCARDS,
      ...DVA_C02_DOMAIN_4_100_FLASHCARDS,
    ];
  }, []);

  // Filter cards by selected domain
  const domainFilteredCards = useMemo(() => {
    if (selectedDomain === 1) return DVA_C02_DOMAIN_1_100_FLASHCARDS;
    if (selectedDomain === 2) return DVA_C02_DOMAIN_2_100_FLASHCARDS;
    if (selectedDomain === 3) return DVA_C02_DOMAIN_3_100_FLASHCARDS;
    if (selectedDomain === 4) return DVA_C02_DOMAIN_4_100_FLASHCARDS;
    return allCardsPool;
  }, [selectedDomain, allCardsPool]);

  // Mastered / Review persistence via localStorage
  const [masteredCardIds, setMasteredCardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cloudor_dvac02_all_mastered');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviewCardIds, setReviewCardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cloudor_dvac02_all_review');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cloudor_dvac02_all_mastered', JSON.stringify(masteredCardIds));
    } catch (e) {
      console.error(e);
    }
  }, [masteredCardIds]);

  useEffect(() => {
    try {
      localStorage.setItem('cloudor_dvac02_all_review', JSON.stringify(reviewCardIds));
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
    setQuizAnswered(false);
    setQuizSelectedOption(null);
  }, [selectedDomain, selectedCategoryFilter, selectedDifficultyFilter, selectedStatusFilter, searchQuery, isShuffled]);

  const currentCard: DvaC02Flashcard | undefined = filteredCards[currentCardIndex];

  const handleNext = useCallback(() => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setQuizAnswered(false);
    setQuizSelectedOption(null);
    setCurrentCardIndex((prev) => (prev + 1) % filteredCards.length);
  }, [filteredCards.length]);

  const handlePrev = useCallback(() => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setQuizAnswered(false);
    setQuizSelectedOption(null);
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
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        toggleFlip();
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        handlePrev();
      } else if (e.code === 'KeyK' && currentCard) {
        e.preventDefault();
        toggleMastered(currentCard.id);
      } else if (e.code === 'KeyS' && currentCard) {
        e.preventDefault();
        toggleReview(currentCard.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFlip, handleNext, handlePrev, toggleMastered, toggleReview, currentCard]);

  // Quiz Mode Options Generator
  const quizOptions = useMemo(() => {
    if (!currentCard) return [];
    const correct = currentCard.keyRule;
    const others = allCardsPool
      .filter((c) => c.id !== currentCard.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((c) => c.keyRule);

    const pool = [correct, ...others].sort(() => Math.random() - 0.5);
    return pool;
  }, [currentCard, allCardsPool]);

  // Progress metrics
  const totalCards = 400;
  const masteredCount = masteredCardIds.length;
  const reviewCount = reviewCardIds.length;
  const progressPercent = Math.min(100, Math.round((masteredCount / totalCards) * 100));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#121622] via-[#1a1f2e] to-[#0f131d] border border-amber-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono-code text-xs font-bold border border-amber-500/40">
                AWS CERTIFIED
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#1e2333] text-sky-400 font-mono-code text-xs border border-[#2b3247]">
                DVA-C02
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono-code text-xs font-bold border border-emerald-500/40">
                {language === 'fr' ? '400 Cartes Mémos' : '400 Flashcards'}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#dfe2f1] tracking-tight">
              AWS Certified Developer – Associate
            </h1>
            
            <p className="text-sm md:text-base text-[#9fa4b8] max-w-2xl leading-relaxed">
              {language === 'fr'
                ? 'Maîtrisez les 4 domaines officiels du DVA-C02 avec 100 cartes mémos par domaine, règles d’or architecturales, pièges d’examen, et quiz interactif.'
                : 'Master all 4 official DVA-C02 domains with 100 high-yield flashcards per domain, key architectural rules, exam traps, and interactive practice quiz.'}
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 p-4 rounded-xl bg-[#141824]/80 border border-[#262c3e]">
            <div className="text-left md:text-right">
              <div className="text-xs text-[#8f94a6] font-mono-code uppercase">
                {language === 'fr' ? 'Progression Globale' : 'Mastery Progress'}
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono-code">
                {masteredCount} / 400 <span className="text-xs text-[#8f94a6]">({progressPercent}%)</span>
              </div>
            </div>
            <div className="w-32 bg-[#1c2234] rounded-full h-2.5 overflow-hidden border border-[#2b3247]">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-[#262c3e] pb-3">
          <button
            type="button"
            onClick={() => setActiveView('flashcards')}
            className={`px-4 py-2 rounded-lg font-mono-code text-xs font-bold transition-all flex items-center gap-2 ${
              activeView === 'flashcards'
                ? 'bg-amber-500 text-[#0f131d] shadow-md shadow-amber-500/20'
                : 'bg-[#181d2c] text-[#a9b0c6] hover:bg-[#20273a] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">style</span>
            <span>{language === 'fr' ? 'Mode Flashcards (400)' : 'Flashcards Deck (400)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('quiz')}
            className={`px-4 py-2 rounded-lg font-mono-code text-xs font-bold transition-all flex items-center gap-2 ${
              activeView === 'quiz'
                ? 'bg-amber-500 text-[#0f131d] shadow-md shadow-amber-500/20'
                : 'bg-[#181d2c] text-[#a9b0c6] hover:bg-[#20273a] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">quiz</span>
            <span>{language === 'fr' ? 'Mode Quiz Pratique' : 'Practice Quiz Mode'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('blueprint')}
            className={`px-4 py-2 rounded-lg font-mono-code text-xs font-bold transition-all flex items-center gap-2 ${
              activeView === 'blueprint'
                ? 'bg-amber-500 text-[#0f131d] shadow-md shadow-amber-500/20'
                : 'bg-[#181d2c] text-[#a9b0c6] hover:bg-[#20273a] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">schema</span>
            <span>{language === 'fr' ? 'Blueprint & Objectifs' : 'Exam Blueprint & Objectives'}</span>
          </button>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('career-pathways')}
              className="ml-auto px-3 py-1.5 rounded-lg bg-[#181d2c] text-[#8f94a6] hover:text-white hover:bg-[#22283b] text-xs font-mono-code flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[15px]">arrow_back</span>
              <span>{language === 'fr' ? 'Retour aux Parcours' : 'Back to Pathways'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main View: FLASHCARDS or QUIZ */}
      {activeView !== 'blueprint' && (
        <div className="space-y-6">
          {/* Domain Filter Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <button
              type="button"
              onClick={() => setSelectedDomain('all')}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                selectedDomain === 'all'
                  ? 'bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-500/10'
                  : 'bg-[#141824] border-[#222738] hover:border-[#343b52] text-[#8f94a6]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code font-bold uppercase text-[#8f94a6]">
                  {language === 'fr' ? 'TOUS LES DOMAINES' : 'ALL DOMAINS'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-[#1f2537] text-white">
                  400
                </span>
              </div>
              <div className="font-bold text-sm text-[#dfe2f1] mt-2">
                {language === 'fr' ? 'Suite Complète DVA-C02' : 'Full DVA-C02 Suite'}
              </div>
            </button>

            {DVA_C02_METADATA.domains.map((dom) => (
              <button
                key={dom.number}
                type="button"
                onClick={() => setSelectedDomain(dom.number as 1 | 2 | 3 | 4)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedDomain === dom.number
                    ? `${dom.bg} ${dom.border} shadow-lg`
                    : 'bg-[#141824] border-[#222738] hover:border-[#343b52] text-[#8f94a6]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono-code font-bold ${dom.color}`}>
                    D{dom.number} • {dom.weight}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-[#1f2537] text-white">
                    100
                  </span>
                </div>
                <div className="font-medium text-xs text-[#dfe2f1] line-clamp-2 mt-2" title={dom.name}>
                  {dom.name}
                </div>
              </button>
            ))}
          </div>

          {/* Controls & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#141824] border border-[#222738]">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'fr' ? 'Rechercher (service, règle, question)...' : 'Search flashcards (service, rule, question)...'}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0f131d] border border-[#2b3247] text-xs text-white focus:outline-none focus:border-amber-400 font-body placeholder:text-gray-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Filter by Category */}
            {availableCategories.length > 1 && (
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#0f131d] border border-[#2b3247] text-xs text-[#dfe2f1] font-mono-code focus:outline-none focus:border-amber-400 max-w-[200px]"
              >
                <option value="all">{language === 'fr' ? 'Toutes Catégories' : 'All Categories'}</option>
                {availableCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}

            {/* Filter by Difficulty */}
            <select
              value={selectedDifficultyFilter}
              onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#0f131d] border border-[#2b3247] text-xs text-[#dfe2f1] font-mono-code focus:outline-none focus:border-amber-400"
            >
              <option value="all">{language === 'fr' ? 'Toute Difficulté' : 'All Difficulties'}</option>
              <option value="Foundational">Foundational</option>
              <option value="Standard">Standard</option>
              <option value="Advanced">Advanced</option>
            </select>

            {/* Filter by Status (Mastered / Review) */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg bg-[#0f131d] border border-[#2b3247] text-xs text-[#dfe2f1] font-mono-code focus:outline-none focus:border-amber-400"
            >
              <option value="all">{language === 'fr' ? 'Tous les statuts' : 'All Status'}</option>
              <option value="mastered">{language === 'fr' ? 'Maîtrisées' : 'Mastered'} ({masteredCount})</option>
              <option value="review">{language === 'fr' ? 'À Réviser' : 'Review Queue'} ({reviewCount})</option>
            </select>

            {/* Shuffle & Grid View */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsShuffled((prev) => !prev)}
                title={isShuffled ? 'Disable Shuffle' : 'Enable Shuffle'}
                className={`p-2 rounded-lg border text-xs transition-all ${
                  isShuffled
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-[#0f131d] border-[#2b3247] text-gray-400 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">shuffle</span>
              </button>

              <button
                type="button"
                onClick={() => setShowGridModal(true)}
                title="View All Cards Grid"
                className="p-2 rounded-lg bg-[#0f131d] border border-[#2b3247] text-gray-400 hover:text-white transition-all text-xs flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">grid_view</span>
                <span className="hidden sm:inline font-mono-code text-[11px]">{filteredCards.length}</span>
              </button>
            </div>
          </div>

          {/* Flashcard View */}
          {activeView === 'flashcards' && (
            <div className="space-y-4">
              {filteredCards.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#141824] border border-[#222738] space-y-3">
                  <span className="material-symbols-outlined text-4xl text-gray-500">search_off</span>
                  <div className="text-base text-gray-300 font-medium">
                    {language === 'fr' ? 'Aucune carte ne correspond aux critères.' : 'No flashcards match your current filters.'}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategoryFilter('all');
                      setSelectedDifficultyFilter('all');
                      setSelectedStatusFilter('all');
                    }}
                    className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono-code font-bold hover:bg-amber-500 hover:text-black transition-all"
                  >
                    {language === 'fr' ? 'Réinitialiser les filtres' : 'Reset All Filters'}
                  </button>
                </div>
              ) : (
                currentCard && (
                  <div className="space-y-4">
                    {/* Navigation Bar Above Card */}
                    <div className="flex items-center justify-between text-xs text-[#8f94a6] font-mono-code px-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#1b2030] text-amber-300 border border-[#282f44]">
                          #{currentCard.id} / 400
                        </span>
                        <span>
                          {language === 'fr' ? 'Carte' : 'Card'} {currentCardIndex + 1} of {filteredCards.length}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="hidden sm:inline text-gray-500">
                          {language === 'fr' ? 'Espace pour retourner • Flèches pour naviguer' : 'Space to flip • Arrows to navigate'}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => toggleMastered(currentCard.id)}
                            className={`px-2.5 py-1 rounded-md text-xs font-mono-code flex items-center gap-1 transition-all ${
                              masteredCardIds.includes(currentCard.id)
                                ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/30'
                                : 'bg-[#191e2e] text-[#8f94a6] hover:text-white border border-[#282f44]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            <span>{language === 'fr' ? 'Maîtrisée' : 'Mastered'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleReview(currentCard.id)}
                            className={`px-2.5 py-1 rounded-md text-xs font-mono-code flex items-center gap-1 transition-all ${
                              reviewCardIds.includes(currentCard.id)
                                ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/30'
                                : 'bg-[#191e2e] text-[#8f94a6] hover:text-white border border-[#282f44]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[14px]">star</span>
                            <span>{language === 'fr' ? 'À réviser' : 'Star'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Interactive 3D Flip Card */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={toggleFlip}
                      className="cursor-pointer group perspective-1000 min-h-[380px] sm:min-h-[340px]"
                    >
                      <div
                        className={`relative w-full min-h-[380px] sm:min-h-[340px] rounded-2xl border transition-all duration-300 p-6 md:p-8 flex flex-col justify-between shadow-2xl ${
                          isFlipped
                            ? 'bg-[#151a27] border-amber-500/50 shadow-amber-500/5'
                            : 'bg-gradient-to-br from-[#121622] to-[#181d2a] border-[#293046] hover:border-amber-400/50'
                        }`}
                      >
                        {/* Top Badges inside card */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#22283b]">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[11px] font-mono-code font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              D{currentCard.domainNumber}
                            </span>
                            <span className="text-xs text-[#8f94a6] font-mono-code">
                              {currentCard.category}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase ${
                                currentCard.difficulty === 'Advanced'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : currentCard.difficulty === 'Standard'
                                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {currentCard.difficulty}
                            </span>
                            <span className="text-xs text-gray-500 font-mono-code">
                              {isFlipped ? (language === 'fr' ? 'RÉPONSE' : 'ANSWER') : (language === 'fr' ? 'QUESTION' : 'QUESTION')}
                            </span>
                          </div>
                        </div>

                        {/* Middle Content: Question or Answer */}
                        <div className="my-auto py-6">
                          {!isFlipped ? (
                            <div className="space-y-4">
                              <div className="text-xs font-mono-code uppercase text-amber-400/80 font-bold">
                                {currentCard.topic}
                              </div>
                              <h3 className="text-lg md:text-xl font-bold text-[#dfe2f1] leading-relaxed">
                                {currentCard.question}
                              </h3>
                              <p className="text-xs text-gray-500 italic">
                                {language === 'fr' ? 'Cliquez ou appuyez sur Espace pour révéler la réponse et la règle clé...' : 'Click or press Space to reveal architectural answer & key exam rules...'}
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4 animate-fadeIn">
                              <div className="text-xs font-mono-code uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[15px]">verified</span>
                                <span>{language === 'fr' ? 'Réponse Architecturale' : 'Architectural Answer'}</span>
                              </div>
                              <p className="text-sm md:text-base text-[#dfe2f1] leading-relaxed">
                                {currentCard.answer}
                              </p>

                              {/* Key Rule Box */}
                              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                                <div className="text-[11px] font-mono-code font-bold uppercase text-amber-300 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[14px]">key</span>
                                  <span>{language === 'fr' ? 'Règle d’Or AWS (Key Rule)' : 'AWS Golden Rule'}</span>
                                </div>
                                <div className="text-xs text-[#d5d8e8] font-medium leading-normal">
                                  {currentCard.keyRule}
                                </div>
                              </div>

                              {/* Exam Tip Box */}
                              <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/25 space-y-1">
                                <div className="text-[11px] font-mono-code font-bold uppercase text-sky-300 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[14px]">lightbulb</span>
                                  <span>{language === 'fr' ? 'Piège d’Examen (Exam Tip)' : 'Exam Tip & Gotcha'}</span>
                                </div>
                                <div className="text-xs text-[#d5d8e8] font-medium leading-normal">
                                  {currentCard.examTip}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Bottom Actions Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#22283b] text-xs">
                          {currentCard.officialDocUrl && (
                            <a
                              href={currentCard.officialDocUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-amber-400 hover:text-amber-300 font-mono-code text-[11px] flex items-center gap-1 hover:underline"
                            >
                              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                              <span>{language === 'fr' ? 'Doc Officielle AWS' : 'AWS Official Doc'}</span>
                            </a>
                          )}

                          <div className="ml-auto flex items-center gap-2">
                            <span className="text-gray-500 font-mono-code text-[11px]">
                              {isFlipped ? (language === 'fr' ? 'Cliquer pour retourner' : 'Click to flip back') : (language === 'fr' ? 'Cliquer pour voir la réponse' : 'Click to see answer')}
                            </span>
                            <span className="material-symbols-outlined text-gray-400 text-[18px]">
                              sync
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Carousel Navigation Controls */}
                    <div className="flex items-center justify-between gap-4 pt-2">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="px-5 py-2.5 rounded-xl bg-[#141824] hover:bg-[#1f2537] border border-[#2b3247] text-[#dfe2f1] font-mono-code text-xs font-bold flex items-center gap-2 transition-all shadow-md"
                      >
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        <span>{language === 'fr' ? 'Précédente' : 'Previous'}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        {filteredCards.slice(Math.max(0, currentCardIndex - 2), Math.min(filteredCards.length, currentCardIndex + 3)).map((card, idx) => {
                          const actualIdx = filteredCards.indexOf(card);
                          const isCur = actualIdx === currentCardIndex;
                          return (
                            <button
                              key={card.id}
                              type="button"
                              onClick={() => {
                                setIsFlipped(false);
                                setCurrentCardIndex(actualIdx);
                              }}
                              className={`w-7 h-7 rounded-lg text-[11px] font-mono-code transition-all ${
                                isCur
                                  ? 'bg-amber-500 text-black font-bold'
                                  : 'bg-[#151a27] text-gray-400 hover:text-white border border-[#252c40]'
                              }`}
                            >
                              {actualIdx + 1}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono-code text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
                      >
                        <span>{language === 'fr' ? 'Suivante' : 'Next'}</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* Quiz Mode View */}
          {activeView === 'quiz' && currentCard && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="p-6 md:p-8 rounded-2xl bg-[#141824] border border-[#293046] shadow-xl space-y-6">
                <div className="flex items-center justify-between text-xs font-mono-code border-b border-[#22283b] pb-4">
                  <span className="text-amber-400 font-bold">
                    {language === 'fr' ? 'QUESTION PRATIQUE DVA-C02' : 'DVA-C02 PRACTICE QUESTION'} #{currentCard.id}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#1c2234] text-gray-300">
                    {currentCard.category}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold text-[#dfe2f1] leading-relaxed">
                    {currentCard.question}
                  </h3>
                  <div className="text-xs text-gray-400 italic">
                    {language === 'fr' ? 'Sélectionnez la règle d’or architecturale correcte :' : 'Select the correct architectural golden rule:'}
                  </div>
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-2.5">
                  {quizOptions.map((opt, idx) => {
                    const isSelected = quizSelectedOption === idx;
                    const isCorrect = opt === currentCard.keyRule;

                    let btnStyle = 'bg-[#0f131d] border-[#262c3e] hover:border-amber-400/50 text-[#dfe2f1]';
                    if (quizAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                      } else {
                        btnStyle = 'bg-[#0f131d]/50 border-[#22283b] text-gray-500 opacity-60';
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
                        className={`w-full p-4 rounded-xl border text-left text-xs md:text-sm transition-all flex items-start gap-3 ${btnStyle}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono-code shrink-0 mt-0.5">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Answer Explanation Box */}
                {quizAnswered && (
                  <div className="p-4 rounded-xl bg-[#181e2e] border border-amber-500/30 space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2 text-xs font-mono-code font-bold uppercase text-amber-400">
                      <span className="material-symbols-outlined text-[16px]">info</span>
                      <span>{language === 'fr' ? 'Explication Détaillée' : 'Detailed Explanation'}</span>
                    </div>
                    <p className="text-xs md:text-sm text-[#dfe2f1] leading-relaxed">
                      {currentCard.answer}
                    </p>
                    <div className="pt-2 border-t border-[#2a324b] text-xs text-sky-300 font-medium">
                      💡 {currentCard.examTip}
                    </div>
                  </div>
                )}

                {/* Quiz Bottom Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-[#22283b]">
                  <div className="text-xs font-mono-code text-gray-400">
                    {language === 'fr' ? 'Score de session :' : 'Session Score:'}{' '}
                    <span className="text-amber-400 font-bold">{quizScore}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono-code text-xs font-bold flex items-center gap-2 transition-all shadow-md"
                  >
                    <span>{language === 'fr' ? 'Question Suivante' : 'Next Question'}</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main View: BLUEPRINT */}
      {activeView === 'blueprint' && (
        <div className="space-y-8">
          {/* Blueprint Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#141824] border border-[#262c3e] space-y-2">
              <div className="text-xs font-mono-code text-gray-400 uppercase">
                {language === 'fr' ? 'Code d’Examen' : 'Exam Code'}
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono-code">DVA-C02</div>
              <div className="text-xs text-gray-400">Associate Level Certification</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#141824] border border-[#262c3e] space-y-2">
              <div className="text-xs font-mono-code text-gray-400 uppercase">
                {language === 'fr' ? 'Score de Réussite' : 'Passing Score'}
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono-code">720 / 1000</div>
              <div className="text-xs text-gray-400">Scaled score (Compensatory)</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#141824] border border-[#262c3e] space-y-2">
              <div className="text-xs font-mono-code text-gray-400 uppercase">
                {language === 'fr' ? 'Durée' : 'Duration'}
              </div>
              <div className="text-2xl font-black text-sky-400 font-mono-code">130 Min</div>
              <div className="text-xs text-gray-400">65 total questions (50 scored)</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#141824] border border-[#262c3e] space-y-2">
              <div className="text-xs font-mono-code text-gray-400 uppercase">
                {language === 'fr' ? 'Couverture Flashcards' : 'Flashcard Coverage'}
              </div>
              <div className="text-2xl font-black text-purple-400 font-mono-code">400 Cards</div>
              <div className="text-xs text-gray-400">100 cards per domain (100% complete)</div>
            </div>
          </div>

          {/* Blueprint Domains Tabs */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 border-b border-[#22283b] pb-3">
              {DVA_C02_METADATA.domains.map((dom) => (
                <button
                  key={dom.number}
                  type="button"
                  onClick={() => setSelectedBlueprintDomain(dom.number as 1 | 2 | 3 | 4)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono-code font-bold transition-all flex items-center gap-2 ${
                    selectedBlueprintDomain === dom.number
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-[#141824] text-gray-400 hover:text-white border border-[#22283b]'
                  }`}
                >
                  <span>D{dom.number}: {dom.weight}</span>
                </button>
              ))}
            </div>

            {/* Selected Domain Blueprint Detail */}
            {selectedBlueprintDomain === 1 && (
              <div className="p-6 md:p-8 rounded-2xl bg-[#141824] border border-amber-500/30 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono-code font-bold text-amber-400 uppercase">
                      DOMAINE 1 • 32% DU SCORE
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                      Development with AWS Services (100 Flashcards)
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono-code text-xs border border-amber-500/40">
                    Cards 1 to 100
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#10141f] border border-[#22283b] space-y-2">
                    <div className="font-bold text-amber-300 font-mono-code">1.1 Serverless Compute (AWS Lambda)</div>
                    <p className="text-gray-400 leading-relaxed">
                      Synchronous vs asynchronous invocations, Event Source Mappings, batching, Provisioned vs Reserved concurrency, execution context reuse, /tmp ephemeral storage, SnapStart for Java, layers, container images.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#10141f] border border-[#22283b] space-y-2">
                    <div className="font-bold text-amber-300 font-mono-code">1.2 Amazon API Gateway</div>
                    <p className="text-gray-400 leading-relaxed">
                      REST vs HTTP vs WebSocket APIs, Lambda Proxy (AWS_PROXY) integration, VTL mapping templates, throttling, stage variables, caching, CORS preflight, binary media types.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#10141f] border border-[#22283b] space-y-2">
                    <div className="font-bold text-amber-300 font-mono-code">1.3 Amazon DynamoDB</div>
                    <p className="text-gray-400 leading-relaxed">
                      Primary keys (PK/SK), RCUs and WCUs calculation, eventually vs strongly consistent reads, Query vs Scan, GSIs vs LSIs, DynamoDB Streams, optimistic locking, DAX, TTL, single-table design.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#10141f] border border-[#22283b] space-y-2">
                    <div className="font-bold text-amber-300 font-mono-code">1.4 Messaging & Streaming (SQS, SNS, Kinesis, EventBridge)</div>
                    <p className="text-gray-400 leading-relaxed">
                      SQS Standard vs FIFO, Visibility Timeout, Dead-Letter Queues, SNS Fan-Out with filter policies, Kinesis shards & Enhanced Fan-Out, EventBridge custom buses, Pipes, and API Destinations.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedBlueprintDomain === 2 && (
              <div className="p-6 md:p-8 rounded-2xl bg-[#141824] border border-rose-500/30 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono-code font-bold text-rose-400 uppercase">
                      DOMAINE 2 • 26% DU SCORE
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                      Security (100 Flashcards)
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-mono-code text-xs border border-rose-500/40">
                    Cards 101 to 200
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#10141f] border border-[#22283b] space-y-2">
                    <div className="font-bold text-rose-300 font-mono-code">2.1 Authentication & IAM</div>
                    <p className="text-gray-400 leading-relaxed">
                      IAM policy evaluation logic, explicit deny, permissions boundaries, IMDSv2 vs IMDSv1, cross-account roles with ExternalId, STS AssumeRole, ABAC with tag condition keys.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#10141f] border border-[#22283b] space-y-2">
                    <div className="font-bold text-rose-300 font-mono-code">2.2 API Gateway Security & Authorizers</div>
                    <p className="text-gray-400 leading-relaxed">
                      Cognito User Pool Authorizers, Lambda Token & Request authorizers, policy caching, SigV4 signing with AWS_IAM, mutual TLS (mTLS), and API resource policies.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#10141f] border border-[#22283b] space-y-2">
                    <div className="font-bold text-rose-300 font-mono-code">2.3 Cryptography & AWS KMS</div>
                    <p className="text-gray-400 leading-relaxed">
                      Customer Managed vs AWS Managed keys, Envelope Encryption with GenerateDataKey, KMS key policies, Encryption Context, asymmetric keys, key rotation, S3 Bucket Keys.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#10141f] border border-[#22283b] space-y-2">
                    <div className="font-bold text-rose-300 font-mono-code">2.4 Secrets & Parameter Management</div>
                    <p className="text-gray-400 leading-relaxed">
                      AWS Secrets Manager automatic rotation lifecycle, client-side caching, Systems Manager Parameter Store Standard vs Advanced, SecureString parameters, and KMS integration.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedBlueprintDomain === 3 && (
              <div className="p-6 md:p-8 rounded-2xl bg-[#141824] border border-sky-500/30 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono-code font-bold text-sky-400 uppercase">
                      DOMAINE 3 • 24% DU SCORE
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                      Deployment (100 Flashcards)
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 font-mono-code text-xs border border-sky-500/40">
                    Cards 201 to 300
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#10141f] border border-[#22283b] space-y-2">
                    <div className="font-bold text-sky-300 font-mono-code">3.1 CI/CD & AWS Developer Tools</div>
                    <p className="text-gray-400 leading-relaxed">
                      CodeBuild buildspec.yml phases, caching in S3, CodeDeploy lifecycle hooks for EC2, Lambda, and ECS, traffic shifting (Canary vs Linear), CodePipeline stages, and CodeArtifact.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#10141f] border border-[#22283b] space-y-2">
                    <div className="font-bold text-sky-300 font-mono-code">3.2 Serverless Application Model (SAM)</div>
                    <p className="text-gray-400 leading-relaxed">
                      SAM syntax (AWS::Serverless-2016-10-31), policy templates, sam build, sam local invoke/start-api, sam deploy, DeploymentPreference traffic shifting.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#10141f] border border-[#22283b] space-y-2">
                    <div className="font-bold text-sky-300 font-mono-code">3.3 Infrastructure as Code (CloudFormation & CDK)</div>
                    <p className="text-gray-400 leading-relaxed">
                      Intrinsic functions (!Ref, !GetAtt, !Sub, !Join), DeletionPolicy, Change Sets, StackSets, Drift Detection, CDK Constructs (L1, L2, L3), and cdk deploy workflow.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#10141f] border border-[#22283b] space-y-2">
                    <div className="font-bold text-sky-300 font-mono-code">3.4 Elastic Beanstalk & ECS Deployments</div>
                    <p className="text-gray-400 leading-relaxed">
                      Beanstalk deployment policies (All at Once, Rolling, Rolling with Addl Batch, Immutable, CNAME swap), .ebextensions, ECS rolling updates (minimumHealthyPercent) and blue/green.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedBlueprintDomain === 4 && (
              <div className="p-6 md:p-8 rounded-2xl bg-[#141824] border border-emerald-500/30 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono-code font-bold text-emerald-400 uppercase">
                      DOMAINE 4 • 18% DU SCORE
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                      Troubleshooting and Optimization (100 Flashcards)
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono-code text-xs border border-emerald-500/40">
                    Cards 301 to 400
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#10141f] border border-[#22283b] space-y-2">
                    <div className="font-bold text-emerald-300 font-mono-code">4.1 Distributed Tracing (AWS X-Ray)</div>
                    <p className="text-gray-400 leading-relaxed">
                      Segments vs subsegments, annotations (indexed) vs metadata (non-indexed), trace header propagation (X-Amzn-Trace-Id), sampling rules (reservoir & fixed rate), X-Ray daemon.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#10141f] border border-[#22283b] space-y-2">
                    <div className="font-bold text-emerald-300 font-mono-code">4.2 Monitoring & Logging (CloudWatch)</div>
                    <p className="text-gray-400 leading-relaxed">
                      Standard vs high-resolution metrics, metric filters, Embedded Metric Format (EMF), Logs Insights syntax, Composite Alarms, Synthetics Canaries, Container/Lambda Insights.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#10141f] border border-[#22283b] space-y-2">
                    <div className="font-bold text-emerald-300 font-mono-code">4.3 Root Cause Analysis & Error Codes</div>
                    <p className="text-gray-400 leading-relaxed">
                      API Gateway 502 vs 504, DynamoDB ProvisionedThroughputExceededException, Lambda 429 throttles & cold starts, SQS poison pills, ECS exit code 137 (OOM), S3 403 Access Denied.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#10141f] border border-[#22283b] space-y-2">
                    <div className="font-bold text-emerald-300 font-mono-code">4.4 Performance & Cost Optimization</div>
                    <p className="text-gray-400 leading-relaxed">
                      Lambda Power Tuning, S3 prefix partitioning & byte-range fetches, S3 Transfer Acceleration, RDS Proxy connection pooling, DynamoDB On-Demand vs Provisioned, Graviton (ARM64).
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid Modal */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141824] border border-[#2b3247] rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 md:p-6 border-b border-[#22283b] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {language === 'fr' ? 'Grille des Cartes Mémos DVA-C02' : 'DVA-C02 Flashcards Grid'}
                </h3>
                <p className="text-xs text-gray-400">
                  {language === 'fr'
                    ? `${filteredCards.length} cartes sélectionnées • Cliquez sur une carte pour y accéder`
                    : `${filteredCards.length} cards matching current filters • Click any card to jump to it`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGridModal(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1f2537]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
              {filteredCards.map((card, idx) => {
                const isCur = idx === currentCardIndex;
                const isMast = masteredCardIds.includes(card.id);
                const isRev = reviewCardIds.includes(card.id);

                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => {
                      setCurrentCardIndex(idx);
                      setIsFlipped(false);
                      setShowGridModal(false);
                    }}
                    className={`p-3 rounded-xl border text-center font-mono-code text-xs transition-all relative flex flex-col items-center justify-center gap-1 ${
                      isCur
                        ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20'
                        : isMast
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : isRev
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                        : 'bg-[#0f131d] border-[#22283b] text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <span className="font-bold">#{card.id}</span>
                    <span className="text-[10px] opacity-75">D{card.domainNumber}</span>
                    {isMast && (
                      <span className="material-symbols-outlined text-[12px] text-emerald-400 absolute top-1 right-1">
                        check
                      </span>
                    )}
                    {isRev && (
                      <span className="material-symbols-outlined text-[12px] text-amber-400 absolute top-1 right-1">
                        star
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
