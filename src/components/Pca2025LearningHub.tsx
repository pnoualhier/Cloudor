import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PCA_2025_DOMAIN_1_100_FLASHCARDS, Pca2025Flashcard } from '../data/pca2025Domain1FlashcardsData';
import { PCA_2025_DOMAIN_2_100_FLASHCARDS } from '../data/pca2025Domain2FlashcardsData';
import { PCA_2025_DOMAIN_3_100_FLASHCARDS } from '../data/pca2025Domain3FlashcardsData';
import { PCA_2025_DOMAIN_4_100_FLASHCARDS } from '../data/pca2025Domain4FlashcardsData';
import { PCA_2025_DOMAIN_5_100_FLASHCARDS } from '../data/pca2025Domain5FlashcardsData';
import { PCA_2025_DOMAIN_6_100_FLASHCARDS } from '../data/pca2025Domain6FlashcardsData';

interface Pca2025LearningHubProps {
  initialMode?: 'flashcards' | 'blueprint';
  onNavigate?: (tab: string) => void;
}

export const PCA_2025_METADATA = {
  code: 'PCA-2025',
  title: 'Google Cloud Certified Professional Cloud Architect',
  level: 'Professional',
  passingScore: 'Pass / Fail (Scaled score ~70%+)',
  duration: '120 minutes (2 hours)',
  questionsCount: '50–60 questions (Case studies: EHR Healthcare, TerramEarth, Mountkirk Games, Helicopter Racing League)',
  domains: [
    { number: 1, name: 'Designing and planning a cloud solution architecture', weight: '25%', cardsCount: 100, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    { number: 2, name: 'Managing and provisioning a solution infrastructure', weight: '22%', cardsCount: 100, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    { number: 3, name: 'Designing for security and compliance', weight: '18%', cardsCount: 100, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
    { number: 4, name: 'Analyzing and optimizing technical and business processes', weight: '18%', cardsCount: 100, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    { number: 5, name: 'Managing implementations of Google Cloud', weight: '12.5%', cardsCount: 100, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
    { number: 6, name: 'Ensuring solution and operations reliability', weight: '12.5%', cardsCount: 100, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  ],
};

export const Pca2025LearningHub: React.FC<Pca2025LearningHubProps> = ({
  initialMode = 'flashcards',
  onNavigate,
}) => {
  const { language } = useLanguage();

  const [activeView, setActiveView] = useState<'flashcards' | 'blueprint'>(initialMode);
  const [selectedDomain, setSelectedDomain] = useState<1 | 2 | 3 | 4 | 5 | 6 | 'all'>(1);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'mastered' | 'review'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [showGridModal, setShowGridModal] = useState<boolean>(false);
  const [selectedBlueprintDomain, setSelectedBlueprintDomain] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Combined pool of all 600 cards across 6 domains
  const allCardsPool = useMemo(() => {
    return [
      ...PCA_2025_DOMAIN_1_100_FLASHCARDS,
      ...PCA_2025_DOMAIN_2_100_FLASHCARDS,
      ...PCA_2025_DOMAIN_3_100_FLASHCARDS,
      ...PCA_2025_DOMAIN_4_100_FLASHCARDS,
      ...PCA_2025_DOMAIN_5_100_FLASHCARDS,
      ...PCA_2025_DOMAIN_6_100_FLASHCARDS,
    ];
  }, []);

  // Filter cards by selected domain
  const domainFilteredCards = useMemo(() => {
    if (selectedDomain === 1) return PCA_2025_DOMAIN_1_100_FLASHCARDS;
    if (selectedDomain === 2) return PCA_2025_DOMAIN_2_100_FLASHCARDS;
    if (selectedDomain === 3) return PCA_2025_DOMAIN_3_100_FLASHCARDS;
    if (selectedDomain === 4) return PCA_2025_DOMAIN_4_100_FLASHCARDS;
    if (selectedDomain === 5) return PCA_2025_DOMAIN_5_100_FLASHCARDS;
    if (selectedDomain === 6) return PCA_2025_DOMAIN_6_100_FLASHCARDS;
    return allCardsPool;
  }, [selectedDomain, allCardsPool]);

  // Mastered / Review persistence via localStorage
  const [masteredCardIds, setMasteredCardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cloudor_pca2025_all_mastered');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviewCardIds, setReviewCardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cloudor_pca2025_all_review');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cloudor_pca2025_all_mastered', JSON.stringify(masteredCardIds));
    } catch (e) {
      console.error(e);
    }
  }, [masteredCardIds]);

  useEffect(() => {
    try {
      localStorage.setItem('cloudor_pca2025_all_review', JSON.stringify(reviewCardIds));
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

  const currentCard: Pca2025Flashcard | undefined = filteredCards[currentCardIndex];

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

    const domainBreakdown = [1, 2, 3, 4, 5, 6].map((dNum) => {
      const dCards = allCardsPool.filter((c) => c.domainNumber === dNum);
      const dMastered = dCards.filter((c) => masteredCardIds.includes(c.id)).length;
      return {
        domainNumber: dNum,
        total: dCards.length,
        mastered: dMastered,
        pct: Math.round((dMastered / dCards.length) * 100),
      };
    });

    return {
      totalInPool,
      masteredCount,
      reviewCount,
      unreadCount,
      masteredPct,
      domainBreakdown,
    };
  }, [allCardsPool, masteredCardIds, reviewCardIds]);

  return (
    <div className="min-h-screen bg-[#07090e] text-[#dfe2f1] pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#0d1322] via-[#0f192c] to-[#0d1322] border border-[#232f48] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-2 z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono-code font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                {PCA_2025_METADATA.code}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-mono-code font-bold bg-[#4285f4]/20 text-[#7baaf7] border border-[#4285f4]/30">
                Google Cloud Certified
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-mono-code bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {language === 'fr' ? '600 Cartes Pro (100 / Domaine)' : '600 Pro Flashcards (100 / Domain)'}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-mono-code bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                4 Case Studies
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
              {PCA_2025_METADATA.title}
            </h1>
            <p className="text-sm text-[#90a2c7] max-w-3xl">
              {language === 'fr'
                ? 'Préparation de niveau expert pour Google Cloud PCA-2025 avec 100 flashcards dédiées par domaine couvrant Spanner, GKE, BigQuery, VPC Service Controls, Architecture Hybride et les 4 Case Studies officiels.'
                : 'Production-grade architecture suite for Google Cloud PCA-2025 with 100 dedicated scenario flashcards per domain covering Spanner, GKE, BigQuery, VPC Service Controls, Hybrid Interconnect, SRE reliability, and all 4 official Case Studies.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 z-10">
            <div className="flex bg-[#0a0e18] p-1 rounded-xl border border-[#263553]">
              <button
                type="button"
                onClick={() => setActiveView('flashcards')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code font-bold transition-all flex items-center gap-1.5 ${
                  activeView === 'flashcards'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-[#90a2c7] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">style</span>
                {language === 'fr' ? 'Cartes Mémos' : 'Flashcards'}
              </button>
              <button
                type="button"
                onClick={() => setActiveView('blueprint')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code font-bold transition-all flex items-center gap-1.5 ${
                  activeView === 'blueprint'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-[#90a2c7] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                {language === 'fr' ? 'Guide Blueprint' : 'Exam Blueprint'}
              </button>
            </div>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('career-pathways')}
                className="p-2 rounded-xl bg-[#0a0e18] hover:bg-[#162238] border border-[#263553] text-[#90a2c7] hover:text-white transition-all"
                title={language === 'fr' ? 'Retour aux parcours' : 'Back to Pathways'}
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Progress Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3.5 rounded-xl bg-[#0d1322] border border-[#232f48] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono-code text-[#798eb4] uppercase tracking-wider block">
                {language === 'fr' ? 'Maîtrisées' : 'Mastered'}
              </span>
              <span className="text-xl font-display font-bold text-emerald-400">
                {stats.masteredCount} <span className="text-xs text-[#798eb4]">/ 600</span>
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0d1322] border border-[#232f48] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono-code text-[#798eb4] uppercase tracking-wider block">
                {language === 'fr' ? 'À Réviser' : 'Need Review'}
              </span>
              <span className="text-xl font-display font-bold text-amber-400">
                {stats.reviewCount} <span className="text-xs text-[#798eb4]">/ 600</span>
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <span className="material-symbols-outlined text-[20px]">bookmark</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0d1322] border border-[#232f48] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono-code text-[#798eb4] uppercase tracking-wider block">
                {language === 'fr' ? 'Score de Préparation' : 'Readiness Score'}
              </span>
              <span className="text-xl font-display font-bold text-blue-400">
                {stats.masteredPct}%
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0d1322] border border-[#232f48] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono-code text-[#798eb4] uppercase tracking-wider block">
                {language === 'fr' ? 'Format Examen' : 'Exam Format'}
              </span>
              <span className="text-sm font-display font-bold text-white block truncate">
                120 Min • 50-60 Qs
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <span className="material-symbols-outlined text-[20px]">timer</span>
            </div>
          </div>
        </div>
      </div>

      {activeView === 'flashcards' && (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Domain Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedDomain(1)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono-code font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                selectedDomain === 1
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-sm'
                  : 'bg-[#0d1322] text-[#8699bd] border-[#232f48] hover:border-[#384b72]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>D1: Solution Architecture (100)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDomain(2)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono-code font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                selectedDomain === 2
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                  : 'bg-[#0d1322] text-[#8699bd] border-[#232f48] hover:border-[#384b72]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>D2: Infrastructure Provisioning (100)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDomain(3)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono-code font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                selectedDomain === 3
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
                  : 'bg-[#0d1322] text-[#8699bd] border-[#232f48] hover:border-[#384b72]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span>D3: Security & Compliance (100)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDomain(4)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono-code font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                selectedDomain === 4
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                  : 'bg-[#0d1322] text-[#8699bd] border-[#232f48] hover:border-[#384b72]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>D4: Processes & FinOps (100)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDomain(5)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono-code font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                selectedDomain === 5
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-sm'
                  : 'bg-[#0d1322] text-[#8699bd] border-[#232f48] hover:border-[#384b72]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span>D5: Implementation & Migration (100)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDomain(6)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono-code font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                selectedDomain === 6
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                  : 'bg-[#0d1322] text-[#8699bd] border-[#232f48] hover:border-[#384b72]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>D6: Reliability & SRE (100)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDomain('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono-code font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                selectedDomain === 'all'
                  ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                  : 'bg-[#0d1322] text-[#8699bd] border-[#232f48] hover:border-[#384b72]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">all_inclusive</span>
              <span>{language === 'fr' ? 'Toutes (600 Cartes)' : 'All (600 Cards)'}</span>
            </button>
          </div>

          {/* Filters & Control Bar */}
          <div className="p-4 rounded-xl bg-[#0d1322] border border-[#232f48] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
              {/* Search Bar */}
              <div className="relative min-w-[200px] flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#6d82aa]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'fr' ? 'Rechercher Spanner, GKE, VPC...' : 'Search Spanner, GKE, VPC, HIPAA...'}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#07090e] border border-[#232f48] text-xs text-white placeholder-[#5a6d91] focus:outline-none focus:border-blue-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5a6d91] hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[15px]">close</span>
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-[#07090e] border border-[#232f48] text-xs text-[#b7c6e6] focus:outline-none focus:border-blue-500"
              >
                <option value="all">{language === 'fr' ? 'Toutes Catégories' : 'All Categories'}</option>
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
                className="px-2.5 py-1.5 rounded-lg bg-[#07090e] border border-[#232f48] text-xs text-[#b7c6e6] focus:outline-none focus:border-blue-500"
              >
                <option value="all">{language === 'fr' ? 'Toutes Difficultés' : 'All Difficulties'}</option>
                <option value="Foundational">Foundational</option>
                <option value="Standard">Standard</option>
                <option value="Advanced">Advanced</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value as 'all' | 'mastered' | 'review')}
                className="px-2.5 py-1.5 rounded-lg bg-[#07090e] border border-[#232f48] text-xs text-[#b7c6e6] focus:outline-none focus:border-blue-500"
              >
                <option value="all">{language === 'fr' ? 'Tous Statuts' : 'All Statuses'}</option>
                <option value="mastered">{language === 'fr' ? 'Maîtrisées' : 'Mastered'}</option>
                <option value="review">{language === 'fr' ? 'À Réviser' : 'Need Review'}</option>
              </select>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Shuffle Toggle */}
              <button
                type="button"
                onClick={() => setIsShuffled((prev) => !prev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-code font-bold transition-all flex items-center gap-1.5 border ${
                  isShuffled
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-[#07090e] text-[#798eb4] border-[#232f48] hover:text-white'
                }`}
                title={language === 'fr' ? 'Mélanger les cartes' : 'Shuffle cards'}
              >
                <span className="material-symbols-outlined text-[16px]">shuffle</span>
                <span>{isShuffled ? 'Shuffled' : 'Shuffle'}</span>
              </button>

              {/* Grid Matrix Modal Trigger */}
              <button
                type="button"
                onClick={() => setShowGridModal(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono-code font-bold bg-[#07090e] text-blue-400 border border-blue-500/30 hover:bg-blue-500/10 transition-all flex items-center gap-1.5"
                title={language === 'fr' ? 'Afficher la grille des 600 cartes' : 'Show 600-Card Matrix Grid'}
              >
                <span className="material-symbols-outlined text-[16px]">grid_view</span>
                <span>{language === 'fr' ? 'Grille' : 'Grid'}</span>
              </button>
            </div>
          </div>

          {/* Flashcard Presentation Area */}
          {filteredCards.length > 0 && currentCard ? (
            <div className="space-y-4">
              {/* Card Container with 3D Flip */}
              <div
                onClick={toggleFlip}
                className="min-h-[460px] w-full rounded-2xl cursor-pointer select-none transition-all duration-300 relative group"
                style={{ perspective: '1200px' }}
              >
                <div
                  className={`w-full min-h-[460px] rounded-2xl border transition-all duration-500 relative p-6 sm:p-8 flex flex-col justify-between shadow-2xl ${
                    isFlipped
                      ? 'bg-[#0d1628] border-blue-500/40 shadow-blue-500/10'
                      : 'bg-[#0a0f1d] border-[#232f48] group-hover:border-[#384b72]'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Top Metadata Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1c273e] pb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse"></span>
                      <span className="text-xs font-mono-code font-bold text-blue-400">
                        Card #{currentCard.id} / 600
                      </span>
                      <span className="text-xs font-mono-code text-[#677b9f]">
                        • {currentCard.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase tracking-wider ${
                          currentCard.difficulty === 'Foundational'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : currentCard.difficulty === 'Standard'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {currentCard.difficulty}
                      </span>

                      {masteredCardIds.includes(currentCard.id) && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">check</span>
                          Mastered
                        </span>
                      )}

                      {reviewCardIds.includes(currentCard.id) && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">bookmark</span>
                          Review
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body Content */}
                  <div className="py-6 flex-1 flex flex-col justify-center">
                    {!isFlipped ? (
                      /* FRONT: TOPIC & QUESTION */
                      <div className="space-y-4">
                        <div className="text-xs font-mono-code font-bold text-blue-400 uppercase tracking-wider">
                          Topic: {currentCard.topic}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-white leading-relaxed">
                          {currentCard.question}
                        </h2>
                        <div className="pt-4 flex items-center gap-2 text-xs font-mono-code text-[#677b9f]">
                          <span className="material-symbols-outlined text-[16px] animate-bounce">
                            touch_app
                          </span>
                          <span>
                            {language === 'fr'
                              ? 'Cliquez n’importe où (ou Espace) pour révéler la solution d’architecture'
                              : 'Click anywhere (or Space) to reveal architectural solution & key rules'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* BACK: ANSWER, KEY RULE, EXAM TIP, OFFICIAL DOC */
                      <div className="space-y-4">
                        <div>
                          <span className="text-[11px] font-mono-code font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                            Architectural Solution:
                          </span>
                          <p className="text-sm sm:text-base text-[#dce4f7] leading-relaxed">
                            {currentCard.answer}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#091122] border border-blue-500/30 space-y-1">
                          <span className="text-[11px] font-mono-code font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">verified</span>
                            Key Architectural Rule:
                          </span>
                          <p className="text-xs text-[#a9bedd] font-medium leading-relaxed">
                            {currentCard.keyRule}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#1a140a] border border-amber-500/30 space-y-1">
                          <span className="text-[11px] font-mono-code font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">lightbulb</span>
                            PCA-2025 Exam Trap / Tip:
                          </span>
                          <p className="text-xs text-[#edd4ad] font-medium leading-relaxed">
                            {currentCard.examTip}
                          </p>
                        </div>

                        {currentCard.officialDocUrl && (
                          <div className="pt-1">
                            <a
                              href={currentCard.officialDocUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 text-xs font-mono-code text-blue-400 hover:text-blue-300 underline"
                            >
                              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                              Official Google Cloud Architecture Guide
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom Controls Bar */}
                  <div className="border-t border-[#1c273e] pt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMastered(currentCard.id);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono-code font-bold transition-all flex items-center gap-1.5 border ${
                          masteredCardIds.includes(currentCard.id)
                            ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                            : 'bg-[#091122] text-[#8699bd] border-[#232f48] hover:border-emerald-500 hover:text-emerald-300'
                        }`}
                        title="Shortcut: M"
                      >
                        <span className="material-symbols-outlined text-[15px]">check_circle</span>
                        <span>{masteredCardIds.includes(currentCard.id) ? 'Mastered [M]' : 'Mark Mastered [M]'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleReview(currentCard.id);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono-code font-bold transition-all flex items-center gap-1.5 border ${
                          reviewCardIds.includes(currentCard.id)
                            ? 'bg-amber-600 text-white border-amber-400 shadow-sm'
                            : 'bg-[#091122] text-[#8699bd] border-[#232f48] hover:border-amber-500 hover:text-amber-300'
                        }`}
                        title="Shortcut: R"
                      >
                        <span className="material-symbols-outlined text-[15px]">bookmark</span>
                        <span>{reviewCardIds.includes(currentCard.id) ? 'Review List [R]' : 'Need Review [R]'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrev();
                        }}
                        className="p-2 rounded-lg bg-[#091122] hover:bg-[#13223e] border border-[#232f48] text-[#8699bd] hover:text-white transition-all flex items-center justify-center"
                        title="Previous (Left Arrow)"
                      >
                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                      </button>

                      <span className="text-xs font-mono-code text-[#798eb4] px-2">
                        {currentCardIndex + 1} / {filteredCards.length}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext();
                        }}
                        className="p-2 rounded-lg bg-[#091122] hover:bg-[#13223e] border border-[#232f48] text-[#8699bd] hover:text-white transition-all flex items-center justify-center"
                        title="Next (Right Arrow)"
                      >
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keyboard Shortcuts Helper */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono-code text-[#5a6d91] py-2">
                <span>[Space]: Flip Card</span>
                <span>[← / →]: Prev / Next</span>
                <span>[M]: Toggle Mastered</span>
                <span>[R]: Toggle Review</span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-[#0d1322] border border-[#232f48] space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#5a6d91]">filter_alt_off</span>
              <h3 className="text-lg font-display font-bold text-white">No flashcards match your current filters</h3>
              <p className="text-xs text-[#798eb4] max-w-md mx-auto">
                Try resetting search keywords, category filters, or selecting "All Domains" to view the complete 600-card suite.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategoryFilter('all');
                  setSelectedDifficultyFilter('all');
                  setSelectedStatusFilter('all');
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono-code font-bold transition-all"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Blueprint Mode View */}
      {activeView === 'blueprint' && (
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Blueprint Domain Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {PCA_2025_METADATA.domains.map((dom) => (
              <button
                key={dom.number}
                type="button"
                onClick={() => setSelectedBlueprintDomain(dom.number as 1 | 2 | 3 | 4 | 5 | 6)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  selectedBlueprintDomain === dom.number
                    ? `${dom.bg} ${dom.border} shadow-lg shadow-blue-500/10`
                    : 'bg-[#0d1322] border-[#232f48] hover:border-[#384b72]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-mono-code font-bold ${dom.color}`}>
                    Domain {dom.number}
                  </span>
                  <span className="text-[10px] font-mono-code text-[#798eb4]">
                    {dom.weight}
                  </span>
                </div>
                <h4 className="text-xs font-display font-bold text-white line-clamp-2">
                  {dom.name}
                </h4>
                <div className="mt-2 text-[10px] font-mono-code text-[#798eb4]">
                  {dom.cardsCount} Flashcards
                </div>
              </button>
            ))}
          </div>

          {/* Blueprint Detail Content */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1322] border border-[#232f48] space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1c273e] pb-6">
              <div>
                <span className="text-xs font-mono-code text-blue-400 font-bold uppercase tracking-wider block mb-1">
                  Official GCP Exam Guide Objective Breakdown
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                  Section {selectedBlueprintDomain}: {PCA_2025_METADATA.domains[selectedBlueprintDomain - 1].name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedDomain(selectedBlueprintDomain);
                  setActiveView('flashcards');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono-code font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
              >
                <span className="material-symbols-outlined text-[16px]">style</span>
                <span>Launch Domain {selectedBlueprintDomain} Deck (100 Cards)</span>
              </button>
            </div>

            {/* Sub-objectives breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedBlueprintDomain === 1 && (
                <>
                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-blue-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">domain</span>
                      1.1 Designing for Business Requirements & Case Studies
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      Mapping business objectives to GCP cloud architectures. Deep mastery of the 4 official case studies: EHR Healthcare (HIPAA regulatory compliance, hybrid interconnect), TerramEarth (global IoT telemetry stream processing at 20M vehicle scale), Mountkirk Games (global real-time multiplayer backend on GKE & Spanner), and Helicopter Racing League (AI video analytics, live streaming via Media CDN).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-blue-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">dns</span>
                      1.2 Designing for Technical Requirements & High Availability
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      Architecting for low RTO/RPO disaster recovery, Anycast Global External Application Load Balancers, Cloud Spanner TrueTime external consistency, Cloud Bigtable time-series row key design, and multi-region active-active deployments.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-blue-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">memory</span>
                      1.3 Compute Architecture Design
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      Architectural trade-offs between GKE Autopilot vs Standard, Cloud Run serverless containers with concurrency, Compute Engine Sole-Tenant Nodes for BYOL licensing, Confidential VMs, and Anthos Service Mesh.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-blue-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">hub</span>
                      1.4 Storage, Databases & Migration Strategy
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      Definitive database flowchart: Spanner vs Cloud SQL vs AlloyDB vs Bigtable vs Firestore vs BigQuery. Migration methodology, Database Migration Service (DMS), Storage Transfer Service, and Transfer Appliance.
                    </p>
                  </div>
                </>
              )}

              {selectedBlueprintDomain === 2 && (
                <>
                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-emerald-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">router</span>
                      2.1 Configuring Network Topologies
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      VPC secondary ranges for GKE, Cloud Router dynamic BGP routing and MED priorities, Private Service Connect (PSC) endpoints and service attachments, Cloud NAT dynamic port allocation, and Network Intelligence Center.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-emerald-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">storage</span>
                      2.2 Storage & Data Provisioning
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      Cloud Spanner interleaved tables, covering indexes with STORING, Cloud SQL HA synchronous failover mechanics, Bigtable Key Visualizer heatmaps, BigQuery table clones/snapshots, and Cloud Storage Turbo Replication.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-emerald-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">settings_system_daydream</span>
                      2.3 Compute Systems Provisioning
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      GKE Pod Disruption Budgets (PDB), node taints and tolerations, resource requests vs limits (OOMKilled prevention), Cloud Run minimum instances, Direct VPC Egress, and Compute Engine golden image families.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-emerald-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">code</span>
                      2.4 Infrastructure as Code (IaC) & Automation
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      Google Cloud Infrastructure Manager, Terraform state locking in Cloud Storage, Cloud Foundation Toolkit (CFT) blueprints, Config Connector CRDs, drift detection, and Service Account Impersonation.
                    </p>
                  </div>
                </>
              )}

              {selectedBlueprintDomain === 3 && (
                <>
                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-rose-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">badge</span>
                      3.1 Identity & Access Management (IAM)
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      Resource hierarchy policy inheritance, IAM Conditions, IAM Deny policies, Workload Identity Federation (AWS/Azure/GitHub), Cloud Identity Directory Sync (GCDS), BeyondCorp Enterprise, and IAP TCP forwarding.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-rose-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">enhanced_encryption</span>
                      3.2 Data Protection & Cryptography
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      Envelope encryption (DEK vs KEK), Customer-Managed Encryption Keys (CMEK), Cloud External Key Manager (Cloud EKM) with Key Access Justifications (KAJ), Cloud HSM FIPS 140-2 Level 3, and Sensitive Data Protection (DLP).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-rose-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">security</span>
                      3.3 Network Security & Perimeter Defense
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      VPC Service Controls dry-run mode, ingress/egress rules, Access Levels, Cloud IDS intrusion detection, Cloud Armor WAF OWASP Top 10 rules, and Secure Web Proxy.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-rose-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">policy</span>
                      3.4 Compliance, Governance & Audit Logging
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      Organization Policies (boolean & list constraints), Security Command Center (Event Threat Detection, Container Threat Detection, Security Health Analytics), Cloud Audit Logs, and HIPAA/PCI-DSS regulatory frameworks.
                    </p>
                  </div>
                </>
              )}

              {selectedBlueprintDomain === 4 && (
                <>
                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-amber-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">speed</span>
                      4.1 Technical Process Optimization
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      CI/CD with Cloud Build, Artifact Registry, and Cloud Deploy. Deployment strategies (Canary, Blue-Green, Rolling updates). Software supply chain security (SLSA Level 3, Binary Authorization). Disaster recovery GameDays and Chaos Engineering.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-amber-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">attach_money</span>
                      4.2 FinOps & Cost Governance
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      Detailed billing export to BigQuery, Resource-Based vs Spend-Based Committed Use Discounts (CUDs), Sustained Use Discounts (SUDs), Active Assist Recommender API, programmatic budget alerts with Pub/Sub, and Carbon Footprint analytics.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-amber-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">account_tree</span>
                      4.3 SRE Practices & Process Modernization
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      Blameless post-mortem culture, symptom-based alerting, multi-window burn rate alerts, toil reduction, and API lifecycle management via Apigee and API Gateway.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-amber-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">dataset</span>
                      4.4 Data Governance & Dataplex
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      Dataplex Data Mesh architecture, raw vs curated zone separation, automated schema discovery, Data Lineage tracking, Business Glossaries, and auto data quality rules.
                    </p>
                  </div>
                </>
              )}

              {selectedBlueprintDomain === 5 && (
                <>
                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-purple-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">developer_mode</span>
                      5.1 Advising Development & Ops Teams
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      Application modernization (12-Factor App), microservice protocols (gRPC over HTTP/2 vs REST), Eventarc CloudEvents event routing, cursor-based pagination, idempotency keys, and local emulators for Spanner/PubSub.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-purple-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">terminal</span>
                      5.2 Interacting Programmatically with Google Cloud
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      Application Default Credentials (ADC) resolution order, Google Cloud Client Libraries vs API Client Libraries, Instance Metadata Server token acquisition, `gcloud storage` vs legacy `gsutil`, and Pub/Sub StreamingPull.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-purple-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">move_down</span>
                      5.3 Workload Migration Execution & Tooling
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      Database Migration Service (DMS) continuous replication and promote workflows, Migrate to Virtual Machines test cloning and OS adaptation, Migrate to Containers containerization, and Storage Transfer Service checksum validation.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-purple-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">groups</span>
                      5.4 Migration Factory & CCoE Governance
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      Establishing a Cloud Center of Excellence (CCoE), migration wave planning, cutover execution checklists, and post-cutover rollback strategies using reverse CDC replication.
                    </p>
                  </div>
                </>
              )}

              {selectedBlueprintDomain === 6 && (
                <>
                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-cyan-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">monitoring</span>
                      6.1 Monitoring, Logging & Observability
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      Google Cloud Ops Agent, Monitoring Query Language (MQL) ratio alerts, Managed Service for Prometheus (GMP), Log Analytics with BigQuery SQL, Cloud Trace distributed waterfall tracing, and Cloud Profiler production flame graphs.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-cyan-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">autorenew</span>
                      6.2 Deployments, Auto-Healing & Reliability
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      Kubernetes Liveness vs Readiness vs Startup probes, Managed Instance Group autohealing policies, Predictive Autoscaling, GKE pause pod overprovisioning, and graceful SIGTERM connection draining.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-cyan-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">support_agent</span>
                      6.3 Incident Management & Customer Care
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      Customer Care tiers (Standard, Enhanced, Premium 15-min SLA), Personalized Service Health API, proactive quota alerting, Incident Command roles, and post-mortem action item governance.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2a40] space-y-2">
                    <h3 className="text-sm font-display font-bold text-cyan-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                      6.4 Ultimate SRE Architecture Reference
                    </h3>
                    <p className="text-xs text-[#90a2c7] leading-relaxed">
                      Active-Active cross-region GKE Autopilot clusters, Cloud Spanner multi-region external consistency, Cloud DNS routing policies, and the five architectural pillars of enterprise cloud reliability.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grid Modal Matrix (All 600 Cards Quick Jump) */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="w-full max-w-5xl max-h-[85vh] rounded-2xl bg-[#0d1322] border border-[#232f48] shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-[#1c273e] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400">grid_view</span>
                  PCA-2025 Complete 600-Card Matrix
                </h3>
                <p className="text-xs text-[#798eb4]">
                  Click any card to jump directly to it in study mode.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGridModal(false)}
                className="p-2 rounded-xl bg-[#07090e] hover:bg-[#1a253a] border border-[#232f48] text-[#798eb4] hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)] space-y-6">
              {[1, 2, 3, 4, 5, 6].map((domNum) => {
                const domCards = allCardsPool.filter((c) => c.domainNumber === domNum);
                return (
                  <div key={domNum} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono-code">
                      <span className="font-bold text-blue-300">
                        Domain {domNum}: {PCA_2025_METADATA.domains[domNum - 1].name}
                      </span>
                      <span className="text-[#677b9f]">100 Cards</span>
                    </div>

                    <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-20 gap-1.5">
                      {domCards.map((card) => {
                        const isMastered = masteredCardIds.includes(card.id);
                        const isReview = reviewCardIds.includes(card.id);
                        return (
                          <button
                            key={card.id}
                            type="button"
                            onClick={() => {
                              setSelectedDomain(card.domainNumber);
                              const idx = filteredCards.findIndex((c) => c.id === card.id);
                              if (idx !== -1) {
                                setCurrentCardIndex(idx);
                              } else {
                                setSelectedCategoryFilter('all');
                                setSelectedDifficultyFilter('all');
                                setSelectedStatusFilter('all');
                                setSearchQuery('');
                                setTimeout(() => {
                                  setCurrentCardIndex((card.id - 1) % 100);
                                }, 50);
                              }
                              setShowGridModal(false);
                            }}
                            className={`h-9 rounded font-mono-code text-xs font-bold transition-all border flex items-center justify-center ${
                              isMastered
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30'
                                : isReview
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                                : 'bg-[#07090e] text-[#8699bd] border-[#1e2a40] hover:border-blue-500 hover:text-white'
                            }`}
                            title={`Card #${card.id}: ${card.topic}`}
                          >
                            {card.id}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
