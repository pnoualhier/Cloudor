import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MLS_C01_DOMAIN_1_100_FLASHCARDS } from '../data/mlsC01Domain1FlashcardsData';
import { MLS_C01_DOMAIN_2_100_FLASHCARDS } from '../data/mlsC01Domain2FlashcardsData';
import { MLS_C01_DOMAIN_3_100_FLASHCARDS } from '../data/mlsC01Domain3FlashcardsData';
import { MLS_C01_DOMAIN_4_100_FLASHCARDS } from '../data/mlsC01Domain4FlashcardsData';
import { MlsC01Flashcard } from '../data/mlsC01Types';

interface MlsC01LearningHubProps {
  initialMode?: 'flashcards' | 'blueprint' | 'quiz';
  onNavigate?: (tab: string) => void;
}

export const MLS_C01_METADATA = {
  code: 'MLS-C01',
  title: 'AWS Certified Machine Learning – Specialty',
  level: 'Specialty',
  passingScore: '750 / 1000 (Scaled scoring benchmark ~75%)',
  duration: '180 minutes (3 hours)',
  questionsCount: '65 questions (multiple choice, multiple response, scenario case studies)',
  domains: [
    { number: 1, name: 'Data Engineering', weight: '20%', cardsCount: 100, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    { number: 2, name: 'Exploratory Data Analysis', weight: '24%', cardsCount: 100, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    { number: 3, name: 'Modeling', weight: '36%', cardsCount: 100, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
    { number: 4, name: 'Machine Learning Implementation and Operations', weight: '20%', cardsCount: 100, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  ],
};

export const MlsC01LearningHub: React.FC<MlsC01LearningHubProps> = ({
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

  // Combined pool of all 400 cards across 4 domains (100 per domain)
  const allCardsPool = useMemo(() => {
    return [
      ...MLS_C01_DOMAIN_1_100_FLASHCARDS,
      ...MLS_C01_DOMAIN_2_100_FLASHCARDS,
      ...MLS_C01_DOMAIN_3_100_FLASHCARDS,
      ...MLS_C01_DOMAIN_4_100_FLASHCARDS,
    ];
  }, []);

  // Local storage for progress tracking
  const [masteredCardIds, setMasteredCardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('mls_c01_mastered_card_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviewCardIds, setReviewCardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('mls_c01_review_card_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mls_c01_mastered_card_ids', JSON.stringify(masteredCardIds));
    } catch {
      // ignore
    }
  }, [masteredCardIds]);

  useEffect(() => {
    try {
      localStorage.setItem('mls_c01_review_card_ids', JSON.stringify(reviewCardIds));
    } catch {
      // ignore
    }
  }, [reviewCardIds]);

  // Filtered cards based on active domain and filters
  const filteredCards = useMemo(() => {
    let list = allCardsPool;

    if (selectedDomain !== 'all') {
      list = list.filter((c) => c.domainNumber === selectedDomain);
    }

    if (selectedCategoryFilter !== 'all') {
      list = list.filter((c) => c.category === selectedCategoryFilter);
    }

    if (selectedDifficultyFilter !== 'all') {
      list = list.filter((c) => c.difficulty === selectedDifficultyFilter);
    }

    if (selectedStatusFilter === 'mastered') {
      list = list.filter((c) => masteredCardIds.includes(c.id));
    } else if (selectedStatusFilter === 'review') {
      list = list.filter((c) => reviewCardIds.includes(c.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.question.toLowerCase().includes(q) ||
          c.answer.toLowerCase().includes(q) ||
          c.topic.toLowerCase().includes(q) ||
          c.keyRule.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    if (isShuffled) {
      // deterministic pseudo-random shuffle per filter change
      return [...list].sort((a, b) => ((a.id * 17) % 31) - ((b.id * 17) % 31));
    }

    return list;
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

  // Reset index when filter changes
  useEffect(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [
    selectedDomain,
    selectedCategoryFilter,
    selectedDifficultyFilter,
    selectedStatusFilter,
    searchQuery,
  ]);

  const currentCard = filteredCards[currentCardIndex] || filteredCards[0];

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
          setReviewCardIds((rev) => rev.filter((item) => item !== id));
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
          setMasteredCardIds((mast) => mast.filter((item) => item !== id));
          return [...prev, id];
        }
      });
    },
    []
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeView !== 'flashcards') return;
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      if (e.code === 'Space') {
        e.preventDefault();
        toggleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'm' || e.key === 'M') {
        if (currentCard) toggleMastered(currentCard.id);
      } else if (e.key === 'r' || e.key === 'R') {
        if (currentCard) toggleReview(currentCard.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView, toggleFlip, handleNext, handlePrev, toggleMastered, toggleReview, currentCard]);

  // Categories list for selected domain
  const availableCategories = useMemo(() => {
    const domainCards =
      selectedDomain === 'all'
        ? allCardsPool
        : allCardsPool.filter((c) => c.domainNumber === selectedDomain);
    const catSet = new Set<string>();
    domainCards.forEach((c) => catSet.add(c.category));
    return Array.from(catSet);
  }, [allCardsPool, selectedDomain]);

  // Blueprint domain items
  const blueprintCards = useMemo(() => {
    return allCardsPool.filter((c) => c.domainNumber === selectedBlueprintDomain);
  }, [allCardsPool, selectedBlueprintDomain]);

  // Quiz questions generation
  const quizQuestions = useMemo(() => {
    const list = selectedDomain === 'all'
      ? allCardsPool
      : allCardsPool.filter((c) => c.domainNumber === selectedDomain);

    return list.slice(0, 20).map((card, idx) => {
      const otherAnswers = allCardsPool
        .filter((c) => c.id !== card.id && c.domainNumber === card.domainNumber)
        .slice(0, 10)
        .map((c) => c.answer);

      const distractors = otherAnswers.slice(0, 3);
      while (distractors.length < 3) {
        distractors.push('Alternative configuration or option not applicable in this AWS architecture scenario.');
      }

      const options = [card.answer, ...distractors].sort((a, b) => (a.length % 5) - (b.length % 5));
      const correctIndex = options.indexOf(card.answer);

      return {
        id: card.id,
        question: card.question,
        topic: card.topic,
        keyRule: card.keyRule,
        options,
        correctIndex,
        userSelected: null as number | null,
      };
    });
  }, [allCardsPool, selectedDomain]);

  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const currentQuizItem = quizQuestions[currentQuizIndex] || quizQuestions[0];

  const handleQuizAnswer = (optionIdx: number) => {
    if (quizAnswered) return;
    setQuizSelectedOption(optionIdx);
    setQuizAnswered(true);
    if (optionIdx === currentQuizItem.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleQuizNext = () => {
    setQuizAnswered(false);
    setQuizSelectedOption(null);
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
    }
  };

  const resetQuiz = () => {
    setQuizScore(0);
    setQuizAnswered(false);
    setQuizSelectedOption(null);
    setCurrentQuizIndex(0);
  };

  // Domain badge colors
  const getDomainTheme = (num: number) => {
    switch (num) {
      case 1:
        return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', fill: 'bg-amber-500' };
      case 2:
        return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', fill: 'bg-emerald-500' };
      case 3:
        return { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', fill: 'bg-purple-500' };
      case 4:
        return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', fill: 'bg-blue-500' };
      default:
        return { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/30', fill: 'bg-gray-500' };
    }
  };

  const currentTheme = currentCard ? getDomainTheme(currentCard.domainNumber) : getDomainTheme(1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8 font-sans">
      {/* Top Banner / Breadcrumb */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-bold uppercase rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 tracking-wider">
              {MLS_C01_METADATA.code}
            </span>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>{MLS_C01_METADATA.title}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  400 Flashcards (100 / Domain)
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'fr'
                  ? 'Suite officielle de révision intensive par cartes mémoires, blueprint et quiz'
                  : 'Official intensive revision suite with flashcards, blueprint, and quiz'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveView('flashcards')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeView === 'flashcards'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {language === 'fr' ? 'Cartes Flash (400)' : 'Flashcards (400)'}
            </button>
            <button
              onClick={() => setActiveView('blueprint')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeView === 'blueprint'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {language === 'fr' ? 'Guide Blueprint' : 'Exam Blueprint'}
            </button>
            <button
              onClick={() => setActiveView('quiz')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeView === 'quiz'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {language === 'fr' ? 'Mode Quiz' : 'Quiz Mode'}
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-4 bg-slate-900/60 rounded-xl p-3 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs text-slate-300">
            <div>
              <span className="text-slate-400">{language === 'fr' ? 'Total Cartes :' : 'Total Cards:'}</span>{' '}
              <span className="font-bold text-white">{allCardsPool.length}</span>
            </div>
            <div>
              <span className="text-slate-400">{language === 'fr' ? 'Maîtrisées :' : 'Mastered:'}</span>{' '}
              <span className="font-bold text-emerald-400">{masteredCardIds.length}</span>
              <span className="text-slate-500 text-[10px] ml-1">
                ({Math.round((masteredCardIds.length / allCardsPool.length) * 100)}%)
              </span>
            </div>
            <div>
              <span className="text-slate-400">{language === 'fr' ? 'À Revoir :' : 'To Review:'}</span>{' '}
              <span className="font-bold text-amber-400">{reviewCardIds.length}</span>
            </div>
          </div>

          <div className="flex-1 max-w-md w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${(masteredCardIds.length / allCardsPool.length) * 100}%` }}
              title="Mastered"
            />
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${(reviewCardIds.length / allCardsPool.length) * 100}%` }}
              title="Review"
            />
          </div>

          <button
            onClick={() => setShowGridModal(true)}
            className="text-xs text-purple-400 hover:text-purple-300 underline font-medium"
          >
            {language === 'fr' ? 'Grille des 400 Cartes' : 'View 400 Cards Grid'}
          </button>
        </div>
      </div>

      {/* FLASHCARDS VIEW */}
      {activeView === 'flashcards' && (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Domain Tabs & Filters Bar */}
          <div className="space-y-3">
            {/* 4 Domains Filter Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <button
                onClick={() => setSelectedDomain('all')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                  selectedDomain === 'all'
                    ? 'bg-slate-800 border-amber-500/60 text-white shadow'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold">{language === 'fr' ? 'Tous les Domaines' : 'All Domains'}</div>
                <div className="text-[10px] text-slate-500">400 {language === 'fr' ? 'cartes' : 'cards'} (100%)</div>
              </button>

              {MLS_C01_METADATA.domains.map((dom) => {
                const isSelected = selectedDomain === dom.number;
                return (
                  <button
                    key={dom.number}
                    onClick={() => setSelectedDomain(dom.number as 1 | 2 | 3 | 4)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                      isSelected
                        ? `${dom.bg} ${dom.border} ${dom.color} shadow-md`
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>D{dom.number} ({dom.weight})</span>
                      <span className="text-[10px] opacity-75">{dom.cardsCount} cards</span>
                    </div>
                    <div className="text-[10px] truncate text-slate-300 mt-0.5" title={dom.name}>
                      {dom.name}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sub-Filters: Category, Difficulty, Status, Search */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center gap-3 text-xs">
              {/* Category Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">{language === 'fr' ? 'Catégorie :' : 'Category:'}</span>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-amber-500 outline-none max-w-xs truncate"
                >
                  <option value="all">{language === 'fr' ? 'Toutes les catégories' : 'All categories'}</option>
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">{language === 'fr' ? 'Niveau :' : 'Level:'}</span>
                <select
                  value={selectedDifficultyFilter}
                  onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                >
                  <option value="all">{language === 'fr' ? 'Tous niveaux' : 'All levels'}</option>
                  <option value="Foundational">Foundational</option>
                  <option value="Standard">Standard</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">{language === 'fr' ? 'Statut :' : 'Status:'}</span>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value as 'all' | 'mastered' | 'review')}
                  className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                >
                  <option value="all">{language === 'fr' ? 'Toutes' : 'All'}</option>
                  <option value="mastered">{language === 'fr' ? 'Maîtrisées' : 'Mastered'}</option>
                  <option value="review">{language === 'fr' ? 'À Revoir' : 'To Review'}</option>
                </select>
              </div>

              {/* Search Box */}
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder={language === 'fr' ? 'Rechercher concept, mot-clé, Algo, S3, XGBoost...' : 'Search concept, keyword, Algo, S3, XGBoost...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg px-3 py-1 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* Shuffle Button */}
              <button
                onClick={() => setIsShuffled((prev) => !prev)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                  isShuffled
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title="Shuffle card order"
              >
                {isShuffled ? '🔀 Shuffled' : '➡️ Ordered'}
              </button>
            </div>
          </div>

          {/* Flashcard Main Area */}
          {filteredCards.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              <p className="text-base font-semibold text-white mb-1">
                {language === 'fr' ? 'Aucune carte trouvée' : 'No cards found'}
              </p>
              <p className="text-xs text-slate-500 mb-4">
                {language === 'fr'
                  ? 'Essayez de réinitialiser vos filtres ou termes de recherche.'
                  : 'Try resetting your filters or search keywords.'}
              </p>
              <button
                onClick={() => {
                  setSelectedCategoryFilter('all');
                  setSelectedDifficultyFilter('all');
                  setSelectedStatusFilter('all');
                  setSearchQuery('');
                  setSelectedDomain('all');
                }}
                className="px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-500"
              >
                {language === 'fr' ? 'Réinitialiser les Filtres' : 'Reset Filters'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Card Counter & Action Badges */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">
                    {language === 'fr' ? 'Carte' : 'Card'} {currentCardIndex + 1} / {filteredCards.length}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${currentTheme.bg} ${currentTheme.color} border ${currentTheme.border}`}>
                    D{currentCard.domainNumber} • {currentCard.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleMastered(currentCard.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                      masteredCardIds.includes(currentCard.id)
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    ✓ {masteredCardIds.includes(currentCard.id) ? (language === 'fr' ? 'Maîtrisée' : 'Mastered') : (language === 'fr' ? 'Marquer Maîtrisée (M)' : 'Mark Mastered (M)')}
                  </button>
                  <button
                    onClick={() => toggleReview(currentCard.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                      reviewCardIds.includes(currentCard.id)
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    ★ {reviewCardIds.includes(currentCard.id) ? (language === 'fr' ? 'À Revoir' : 'Reviewing') : (language === 'fr' ? 'À Revoir (R)' : 'Review Later (R)')}
                  </button>
                </div>
              </div>

              {/* 3D Interactive Flip Card */}
              <div
                onClick={toggleFlip}
                className="group relative w-full min-h-[360px] md:min-h-[400px] cursor-pointer select-none perspective-1000"
              >
                <div
                  className={`w-full h-full min-h-[360px] md:min-h-[400px] rounded-2xl p-6 md:p-8 border transition-all duration-500 shadow-2xl flex flex-col justify-between ${
                    isFlipped
                      ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border-indigo-500/40'
                      : 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top card metadata */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400 text-xs">#{currentCard.id}</span>
                        <span className="font-semibold text-slate-300">{currentCard.topic}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {currentCard.difficulty}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {isFlipped ? (language === 'fr' ? 'RÉPONSE' : 'ANSWER') : (language === 'fr' ? 'QUESTION' : 'QUESTION')}
                        </span>
                      </div>
                    </div>

                    {/* Question or Answer Content */}
                    {!isFlipped ? (
                      <div className="py-4 md:py-6">
                        <h2 className="text-lg md:text-2xl font-bold text-white leading-relaxed">
                          {currentCard.question}
                        </h2>
                        <p className="text-xs text-slate-400 mt-4 italic">
                          {language === 'fr'
                            ? 'Cliquez ou appuyez sur Espace pour révéler la réponse et les règles d’examen...'
                            : 'Click or press Space to reveal answer and exam rules...'}
                        </p>
                      </div>
                    ) : (
                      <div className="py-2 md:py-4 space-y-4">
                        <div className="text-sm md:text-base text-slate-100 leading-relaxed whitespace-pre-line">
                          {currentCard.answer}
                        </div>

                        {/* Key Rule Box */}
                        <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs leading-relaxed">
                          <span className="font-bold text-purple-300 block mb-0.5">
                            ⚡ {language === 'fr' ? 'Règle Clé d’Architecture :' : 'Key Architecture Rule:'}
                          </span>
                          {currentCard.keyRule}
                        </div>

                        {/* Official Exam Tip Box */}
                        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
                          <span className="font-bold text-amber-300 block mb-0.5">
                            🎯 {language === 'fr' ? 'Piège & Astuce Examen MLS-C01 :' : 'MLS-C01 Exam Tip & Trap:'}
                          </span>
                          {currentCard.examTip}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[11px] text-slate-400">
                      {isFlipped
                        ? (language === 'fr' ? 'Cliquez pour voir la question' : 'Click to flip back')
                        : (language === 'fr' ? 'Espace pour retourner' : 'Spacebar to flip')}
                    </span>

                    <a
                      href={currentCard.officialDocUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-amber-400 hover:text-amber-300 text-xs font-medium flex items-center gap-1 underline"
                    >
                      <span>AWS Documentation ↗</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  onClick={handlePrev}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <span>←</span>
                  <span>{language === 'fr' ? 'Précédente' : 'Previous'}</span>
                </button>

                <div className="text-xs text-slate-400 hidden sm:block">
                  {language === 'fr'
                    ? 'Astuce : utilisez Flèches ← → pour naviguer, Espace pour retourner'
                    : 'Shortcut: use ← → arrows to navigate, Space to flip'}
                </div>

                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-500 text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-amber-600/20 transition-all"
                >
                  <span>{language === 'fr' ? 'Suivante' : 'Next'}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* BLUEPRINT VIEW */}
      {activeView === 'blueprint' && (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Exam Summary Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">
              {language === 'fr'
                ? 'Blueprint Officiel de l’Examen AWS Certified Machine Learning – Specialty (MLS-C01)'
                : 'AWS Certified Machine Learning – Specialty (MLS-C01) Official Exam Blueprint'}
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed mb-6">
              {language === 'fr'
                ? 'L’examen valide votre expertise avancée pour concevoir, implémenter, déployer et maintenir des solutions de Machine Learning hautement optimisées, sécurisées et fiables sur Amazon Web Services.'
                : 'The exam validates advanced expertise in designing, implementing, deploying, and maintaining high-performance, secure, and cost-optimized ML solutions on AWS.'}
            </p>

            {/* Spec Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block mb-1">{language === 'fr' ? 'Format & Durée' : 'Format & Duration'}</span>
                <span className="font-bold text-white text-sm">{MLS_C01_METADATA.duration}</span>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block mb-1">{language === 'fr' ? 'Nombre de Questions' : 'Questions Count'}</span>
                <span className="font-bold text-white text-sm">{MLS_C01_METADATA.questionsCount}</span>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block mb-1">{language === 'fr' ? 'Score de Réussite' : 'Passing Score'}</span>
                <span className="font-bold text-emerald-400 text-sm">{MLS_C01_METADATA.passingScore}</span>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block mb-1">{language === 'fr' ? 'Cartes Implémentées' : 'Implemented Cards'}</span>
                <span className="font-bold text-amber-400 text-sm">400 Flashcards (100 / Domain)</span>
              </div>
            </div>
          </div>

          {/* Domain Breakdown Selector */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {MLS_C01_METADATA.domains.map((dom) => {
              const isSelected = selectedBlueprintDomain === dom.number;
              return (
                <div
                  key={dom.number}
                  onClick={() => setSelectedBlueprintDomain(dom.number as 1 | 2 | 3 | 4)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? `${dom.bg} ${dom.border} ring-2 ring-amber-500/50`
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Domain {dom.number}
                    </span>
                    <span className={`text-sm font-black ${dom.color}`}>{dom.weight}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">{dom.name}</h3>
                  <p className="text-[11px] text-slate-400">100 {language === 'fr' ? 'cartes mémoires dédiées' : 'dedicated flashcards'}</p>
                </div>
              );
            })}
          </div>

          {/* Detailed domain topic listing */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Domain {selectedBlueprintDomain} : {MLS_C01_METADATA.domains.find((d) => d.number === selectedBlueprintDomain)?.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'fr'
                    ? '100 Flashcards couvrant l’ensemble des compétences ciblées par le guide officiel'
                    : '100 Flashcards covering all target skills in the official exam guide'}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedDomain(selectedBlueprintDomain);
                  setActiveView('flashcards');
                }}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                {language === 'fr' ? 'Réviser ces 100 Cartes' : 'Study these 100 Cards'}
              </button>
            </div>

            {/* List of cards in this domain */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
              {blueprintCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => {
                    setSelectedDomain(card.domainNumber);
                    const idx = allCardsPool.findIndex((c) => c.id === card.id);
                    if (idx !== -1) setCurrentCardIndex(idx);
                    setActiveView('flashcards');
                  }}
                  className="p-3 bg-slate-800/40 hover:bg-slate-800 rounded-xl border border-slate-700/60 hover:border-amber-500/40 cursor-pointer transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-amber-400">#{card.id}</span>
                    <span className="text-slate-400">{card.topic}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-300">
                      {card.difficulty}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-white line-clamp-2">{card.question}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-1 italic">{card.keyRule}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QUIZ VIEW */}
      {activeView === 'quiz' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {language === 'fr' ? 'Simulation Quiz MLS-C01' : 'MLS-C01 Quiz Simulation'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'fr'
                    ? 'Questions à choix multiples générées à partir des flashcards officielles'
                    : 'Multiple-choice questions dynamically generated from official flashcards'}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-slate-400">{language === 'fr' ? 'Score :' : 'Score:'}</span>{' '}
                  <span className="font-bold text-emerald-400 text-sm">{quizScore}</span> / {quizQuestions.length}
                </div>
                <button
                  onClick={resetQuiz}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                >
                  {language === 'fr' ? 'Recommencer' : 'Restart'}
                </button>
              </div>
            </div>

            {/* Quiz Question Card */}
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  Question {currentQuizIndex + 1} / {quizQuestions.length}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {currentQuizItem.topic}
                </span>
              </div>

              <h3 className="text-base md:text-lg font-bold text-white leading-relaxed">
                {currentQuizItem.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuizItem.options.map((option, idx) => {
                  let btnStyle = 'bg-slate-800/70 border-slate-700 text-slate-200 hover:bg-slate-800';
                  if (quizAnswered) {
                    if (idx === currentQuizItem.correctIndex) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-semibold';
                    } else if (idx === quizSelectedOption) {
                      btnStyle = 'bg-red-500/20 border-red-500 text-red-200';
                    } else {
                      btnStyle = 'bg-slate-900 border-slate-800 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={quizAnswered}
                      onClick={() => handleQuizAnswer(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${btnStyle}`}
                    >
                      <span className="font-bold mr-2 text-slate-400">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Explanation */}
              {quizAnswered && (
                <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2 text-xs">
                  <div className="font-bold flex items-center gap-2">
                    {quizSelectedOption === currentQuizItem.correctIndex ? (
                      <span className="text-emerald-400">✓ {language === 'fr' ? 'Excellente réponse !' : 'Correct answer!'}</span>
                    ) : (
                      <span className="text-red-400">✗ {language === 'fr' ? 'Réponse incorrecte' : 'Incorrect answer'}</span>
                    )}
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    <span className="font-bold text-amber-300">{language === 'fr' ? 'Règle Clé :' : 'Key Rule:'}</span>{' '}
                    {currentQuizItem.keyRule}
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleQuizNext}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg text-xs"
                    >
                      {currentQuizIndex < quizQuestions.length - 1
                        ? (language === 'fr' ? 'Question Suivante →' : 'Next Question →')
                        : (language === 'fr' ? 'Terminer le Quiz' : 'Finish Quiz')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grid Modal: All 400 Cards Navigator */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">
                  {language === 'fr' ? 'Grille des 400 Cartes MLS-C01' : 'MLS-C01 400 Cards Navigator'}
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'fr'
                    ? 'Cliquez sur une carte pour y accéder directement'
                    : 'Click any card to jump directly to it'}
                </p>
              </div>
              <button
                onClick={() => setShowGridModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-16 lg:grid-cols-20 gap-2">
                {allCardsPool.map((c) => {
                  const isMastered = masteredCardIds.includes(c.id);
                  const isReview = reviewCardIds.includes(c.id);
                  let badgeColor = 'bg-slate-800 text-slate-400 border-slate-700';
                  if (isMastered) badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
                  else if (isReview) badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/50';

                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedDomain(c.domainNumber);
                        const idx = allCardsPool.findIndex((card) => card.id === c.id);
                        if (idx !== -1) setCurrentCardIndex(idx);
                        setShowGridModal(false);
                        setActiveView('flashcards');
                      }}
                      className={`h-9 rounded-lg border text-xs font-mono font-bold flex flex-col items-center justify-center transition-all hover:scale-105 hover:border-amber-400 ${badgeColor}`}
                      title={`#${c.id} - D${c.domainNumber} : ${c.topic}`}
                    >
                      <span>{c.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> {language === 'fr' ? 'Maîtrisée' : 'Mastered'}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500" /> {language === 'fr' ? 'À Revoir' : 'Review'}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-slate-800" /> {language === 'fr' ? 'Non vue' : 'Unseen'}
                </span>
              </div>
              <button
                onClick={() => setShowGridModal(false)}
                className="px-3 py-1 bg-slate-800 text-white rounded-lg text-xs"
              >
                {language === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
