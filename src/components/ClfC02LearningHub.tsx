import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  CLF_C02_DOMAIN_1_METADATA,
  CLF_C02_DOMAIN_1_TASKS,
  WELL_ARCHITECTED_PILLARS,
  MIGRATION_7_RS,
} from '../data/clfC02Domain1Data';
import { CLF_C02_50_FLASHCARDS, ClfC02Flashcard } from '../data/clfC02FlashcardsData';

interface ClfC02LearningHubProps {
  initialMode?: 'domain1' | 'flashcards';
  onNavigate?: (tab: string) => void;
}

export const ClfC02LearningHub: React.FC<ClfC02LearningHubProps> = ({
  initialMode = 'domain1',
}) => {
  const { language } = useLanguage();

  // Primary mode: 'domain1' (Official Learning Guide) vs 'flashcards' (50 Flashcards)
  const [activeView, setActiveView] = useState<'domain1' | 'flashcards'>(initialMode);

  // Domain 1 state
  const [selectedTaskId, setSelectedTaskId] = useState<string>('task-1-1');
  const [selectedPillarIndex, setSelectedPillarIndex] = useState<number>(0);
  const [quickCheckAnswer, setQuickCheckAnswer] = useState<number | null>(null);
  const [showQuickCheckExplanation, setShowQuickCheckExplanation] = useState<boolean>(false);

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<number | 'all'>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'mastered' | 'review'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isShuffled, setIsShuffled] = useState<boolean>(false);

  // Mastery tracking (persisted in localStorage)
  const [masteredCardIds, setMasteredCardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cloudor_clf_c02_mastered');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviewCardIds, setReviewCardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cloudor_clf_c02_review');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save mastery changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cloudor_clf_c02_mastered', JSON.stringify(masteredCardIds));
    } catch {
      // ignore
    }
  }, [masteredCardIds]);

  useEffect(() => {
    try {
      localStorage.setItem('cloudor_clf_c02_review', JSON.stringify(reviewCardIds));
    } catch {
      // ignore
    }
  }, [reviewCardIds]);

  // Filtered flashcards list
  const filteredCards = useMemo(() => {
    let cards = [...CLF_C02_50_FLASHCARDS];

    // Domain filter
    if (selectedDomainFilter !== 'all') {
      cards = cards.filter((c) => c.domainNumber === selectedDomainFilter);
    }

    // Status filter
    if (selectedStatusFilter === 'mastered') {
      cards = cards.filter((c) => masteredCardIds.includes(c.id));
    } else if (selectedStatusFilter === 'review') {
      cards = cards.filter((c) => reviewCardIds.includes(c.id));
    }

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      cards = cards.filter(
        (c) =>
          c.question.toLowerCase().includes(query) ||
          c.answer.toLowerCase().includes(query) ||
          c.topic.toLowerCase().includes(query) ||
          c.keyRule.toLowerCase().includes(query)
      );
    }

    return cards;
  }, [selectedDomainFilter, selectedStatusFilter, searchQuery, masteredCardIds, reviewCardIds]);

  // Ensure current index stays in bounds
  useEffect(() => {
    if (currentCardIndex >= filteredCards.length) {
      setCurrentCardIndex(0);
    }
    setIsFlipped(false);
  }, [filteredCards.length, currentCardIndex]);

  const currentCard: ClfC02Flashcard | undefined = filteredCards[currentCardIndex];

  // Navigation handlers
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

  const toggleMastered = useCallback(
    (cardId: number) => {
      setMasteredCardIds((prev) =>
        prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]
      );
      // Remove from review if mastered
      setReviewCardIds((prev) => prev.filter((id) => id !== cardId));
    },
    []
  );

  const toggleReview = useCallback(
    (cardId: number) => {
      setReviewCardIds((prev) =>
        prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]
      );
      // Remove from mastered if flagged for review
      setMasteredCardIds((prev) => prev.filter((id) => id !== cardId));
    },
    []
  );

  // Keyboard navigation for flashcards
  useEffect(() => {
    if (activeView !== 'flashcards') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextCard();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevCard();
      } else if (e.key.toLowerCase() === 'm' && currentCard) {
        e.preventDefault();
        toggleMastered(currentCard.id);
      } else if (e.key.toLowerCase() === 'r' && currentCard) {
        e.preventDefault();
        toggleReview(currentCard.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView, handleNextCard, handlePrevCard, currentCard, toggleMastered, toggleReview]);

  const currentTask = CLF_C02_DOMAIN_1_TASKS.find((t) => t.id === selectedTaskId) || CLF_C02_DOMAIN_1_TASKS[0];
  const activePillar = WELL_ARCHITECTED_PILLARS[selectedPillarIndex];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Hub Switcher */}
      <div className="relative overflow-hidden rounded-2xl bg-[#171b26] border border-[#262a35] p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#ff9900]/10 via-[#4cd7f6]/5 to-transparent blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono-code font-bold bg-[#ff9900]/20 text-[#ffb95f] border border-[#ff9900]/40">
                AWS CERTIFIED
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-[#0a0e18] border border-[#262a35] text-[11px] font-mono-code text-[#4cd7f6] font-bold">
                CLF-C02
              </span>
              <span className="text-xs font-mono-code text-[#908fa0]">
                {language === 'fr' ? 'Programme Officiel & Flashcards' : 'Official Curriculum & Flashcard Deck'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight">
              AWS Certified Cloud Practitioner (CLF-C02)
            </h1>

            <p className="text-sm sm:text-base text-[#c7c4d7] leading-relaxed">
              {language === 'fr'
                ? "Maîtrisez le Domaine 1 (Cloud Concepts - 24% de l'examen) basé sur la documentation officielle AWS, et entraînez-vous sur le jeu complet des 50 Flashcards couvrant l'ensemble du blueprint."
                : "Master Domain 1 (Cloud Concepts - 24% of exam) based directly on the official AWS documentation, and test your retention with 50 comprehensive exam flashcards across all 4 domains."}
            </p>

            <div className="pt-1 flex items-center gap-3 flex-wrap">
              <a
                href={CLF_C02_DOMAIN_1_METADATA.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono-code text-[#8083ff] hover:text-white underline transition-colors"
              >
                <span>{language === 'fr' ? 'Documentation Officielle AWS (Domaine 1)' : 'Official AWS Guide URL (Domain 1)'}</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
              <span className="text-[#464554]">•</span>
              <span className="text-xs font-mono-code text-[#908fa0]">
                {language === 'fr' ? 'Examen : 65 Qs • 90 min • Score : 700/1000' : 'Exam: 65 Qs • 90 mins • Passing: 700/1000'}
              </span>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-[#0a0e18] p-1.5 rounded-xl border border-[#262a35] gap-1 shrink-0">
            <button
              onClick={() => setActiveView('domain1')}
              className={`px-4 py-2.5 rounded-lg text-xs font-mono-code font-bold transition-all flex items-center justify-center gap-2 ${
                activeView === 'domain1'
                  ? 'bg-gradient-to-r from-[#ff9900] to-[#ffb95f] text-[#0f131d] shadow-md'
                  : 'text-[#c7c4d7] hover:text-white hover:bg-[#171b26]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              <span>{language === 'fr' ? 'Domaine 1 : Cloud Concepts (24%)' : 'Domain 1: Cloud Concepts (24%)'}</span>
            </button>

            <button
              onClick={() => setActiveView('flashcards')}
              className={`px-4 py-2.5 rounded-lg text-xs font-mono-code font-bold transition-all flex items-center justify-center gap-2 ${
                activeView === 'flashcards'
                  ? 'bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] text-[#0f131d] shadow-md'
                  : 'text-[#c7c4d7] hover:text-white hover:bg-[#171b26]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">style</span>
              <span>{language === 'fr' ? '50 Flashcards CLF-C02' : '50 CLF-C02 Flashcards'}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/30 text-white font-mono-code">
                50
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: DOMAIN 1 CLOUD CONCEPTS INTERACTIVE CURRICULUM                     */}
      {/* ========================================================================= */}
      {activeView === 'domain1' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Domain 1 Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35] space-y-1">
              <span className="text-[10px] font-mono-code uppercase text-[#908fa0]">
                {language === 'fr' ? 'Poids dans l’examen' : 'Exam Blueprint Weight'}
              </span>
              <div className="text-xl sm:text-2xl font-mono-code font-extrabold text-[#ffb95f]">
                {CLF_C02_DOMAIN_1_METADATA.examWeight}
              </div>
              <span className="text-[11px] text-[#908fa0]">
                {language === 'fr' ? '~15 questions notées' : '~15 scored questions'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35] space-y-1">
              <span className="text-[10px] font-mono-code uppercase text-[#908fa0]">
                {language === 'fr' ? 'Énoncés de Tâches' : 'Task Statements'}
              </span>
              <div className="text-xl sm:text-2xl font-mono-code font-extrabold text-[#4cd7f6]">
                4 Tâches
              </div>
              <span className="text-[11px] text-[#908fa0]">
                {language === 'fr' ? 'Tâche 1.1 à Tâche 1.4' : 'Task 1.1 through 1.4'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35] space-y-1">
              <span className="text-[10px] font-mono-code uppercase text-[#908fa0]">
                {language === 'fr' ? 'Piliers Well-Architected' : 'Well-Architected Pillars'}
              </span>
              <div className="text-xl sm:text-2xl font-mono-code font-extrabold text-[#8083ff]">
                6 Piliers
              </div>
              <span className="text-[11px] text-[#908fa0]">
                {language === 'fr' ? 'Inclut la Durabilité' : 'Includes Sustainability'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35] space-y-1">
              <span className="text-[10px] font-mono-code uppercase text-[#908fa0]">
                {language === 'fr' ? 'Stratégies de Migration' : 'Migration Strategies'}
              </span>
              <div className="text-xl sm:text-2xl font-mono-code font-extrabold text-[#5eead4]">
                Les 7 R
              </div>
              <span className="text-[11px] text-[#908fa0]">
                {language === 'fr' ? 'AWS CAF (6 perspectives)' : 'AWS CAF (6 perspectives)'}
              </span>
            </div>
          </div>

          {/* Task Statements Selector */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262a35] pb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-display font-bold text-white">
                  {language === 'fr' ? 'Énoncés de Tâches Officiels du Domaine 1' : 'Official Domain 1 Task Statements'}
                </h2>
                <p className="text-xs text-[#908fa0] mt-0.5">
                  {language === 'fr'
                    ? 'Sélectionnez une tâche pour inspecter ses concepts clés, pièges d’examen et points de vérification.'
                    : 'Select a task statement to explore core concepts, exam traps, and architectural principles.'}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedDomainFilter(1);
                  setActiveView('flashcards');
                }}
                className="px-3.5 py-2 rounded-xl bg-[#262a35] hover:bg-[#8083ff] text-xs font-mono-code font-bold text-[#dfe2f1] hover:text-white transition-all flex items-center gap-1.5 self-start sm:self-auto border border-[#313540]"
              >
                <span className="material-symbols-outlined text-[15px] text-[#ffb95f]">style</span>
                <span>{language === 'fr' ? 'Tester sur les 15 Flashcards Domaine 1' : 'Drill Domain 1 Flashcards (15)'}</span>
              </button>
            </div>

            {/* Task Statement Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {CLF_C02_DOMAIN_1_TASKS.map((task) => {
                const isSelected = selectedTaskId === task.id;
                return (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`p-3.5 rounded-xl text-left transition-all border ${
                      isSelected
                        ? 'bg-[#1c1f2a] border-[#ff9900] shadow-lg shadow-[#ff9900]/10'
                        : 'bg-[#0a0e18] border-[#262a35] hover:border-[#464554]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono-code text-[11px] font-bold text-[#ffb95f]">
                        {task.code}
                      </span>
                      <span className="text-[10px] font-mono-code text-[#908fa0]">
                        {task.weight}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-white line-clamp-2 leading-snug">
                      {task.title}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Task Statement Content */}
            <div className="pt-2 space-y-6">
              <div className="p-4 rounded-xl bg-[#0a0e18] border border-[#262a35] space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#ff9900]/20 text-[#ffb95f] font-mono-code font-bold text-[11px]">
                      {currentTask.code}
                    </span>
                    <h3 className="text-base sm:text-lg font-display font-bold text-white">
                      {currentTask.title}
                    </h3>
                  </div>
                  <a
                    href={currentTask.officialDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono-code text-[#4cd7f6] hover:underline flex items-center gap-1"
                  >
                    <span>{language === 'fr' ? 'Lien doc AWS ↗' : 'AWS Documentation ↗'}</span>
                  </a>
                </div>
                <p className="text-xs sm:text-sm text-[#c7c4d7]">
                  {currentTask.shortDesc}
                </p>
              </div>

              {/* Subtopics Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {currentTask.subtopics.map((sub, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-5 rounded-xl bg-[#0a0e18] border border-[#262a35] space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-display font-bold text-white">
                          {sub.title}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-[#171b26] text-[#8083ff] border border-[#262a35]">
                          {sub.badge}
                        </span>
                      </div>

                      <p className="text-xs text-[#dfe2f1] leading-relaxed">
                        {sub.summary}
                      </p>

                      <ul className="space-y-1.5 pt-1">
                        {sub.keyPoints.map((pt, pIdx) => (
                          <li
                            key={pIdx}
                            className="text-xs text-[#c7c4d7] flex items-start gap-2 leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb95f] shrink-0 mt-1.5"></span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {sub.examTrap && (
                      <div className="p-3 rounded-lg bg-[#262a35]/60 border border-[#ff9900]/30 text-xs text-[#ffb95f] space-y-1">
                        <div className="flex items-center gap-1 font-mono-code text-[11px] font-bold">
                          <span className="material-symbols-outlined text-[14px]">warning</span>
                          <span>{language === 'fr' ? 'PIÈGE D’EXAMEN CLF-C02' : 'CLF-C02 EXAM TRAP ALERT'}</span>
                        </div>
                        <p className="text-[11px] text-[#dfe2f1] leading-relaxed">
                          {sub.examTrap}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Feature: Well-Architected 6 Pillars Inspector */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262a35] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-[#8083ff]/20 text-[#8083ff] border border-[#8083ff]/30 font-bold">
                    TASK 1.2 DEEP DIVE
                  </span>
                  <h3 className="text-lg font-display font-bold text-white">
                    {language === 'fr' ? 'Inspecteur des 6 Piliers Well-Architected' : 'The 6 Well-Architected Pillars Inspector'}
                  </h3>
                </div>
                <p className="text-xs text-[#908fa0] mt-1">
                  {language === 'fr'
                    ? 'Chaque question d’examen Well-Architected fait référence à l’un de ces 6 piliers officiels.'
                    : 'Understand the distinct focus, keywords, and design principles of all 6 architectural pillars.'}
                </p>
              </div>

              <a
                href="https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono-code text-[#4cd7f6] hover:underline flex items-center gap-1"
              >
                <span>{language === 'fr' ? 'Framework Guide (AWS) ↗' : 'Framework Guide (AWS) ↗'}</span>
              </a>
            </div>

            {/* Pillars Grid Selection */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {WELL_ARCHITECTED_PILLARS.map((pillar, idx) => {
                const isSelected = selectedPillarIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedPillarIndex(idx)}
                    className={`p-3 rounded-xl flex flex-col items-center text-center gap-2 transition-all border ${
                      isSelected
                        ? 'bg-[#1c1f2a] border-[#4cd7f6] shadow-md shadow-[#4cd7f6]/10 scale-102'
                        : 'bg-[#0a0e18] border-[#262a35] hover:border-[#464554]'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${pillar.bg} ${pillar.border} border`}
                    >
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={{ color: pillar.color }}
                      >
                        {pillar.icon}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-white leading-tight">
                      {pillar.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Pillar Details Card */}
            <div className="p-5 rounded-xl bg-[#0a0e18] border border-[#262a35] space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${activePillar.bg} ${activePillar.border} border`}
                  >
                    <span
                      className="material-symbols-outlined text-[22px]"
                      style={{ color: activePillar.color }}
                    >
                      {activePillar.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-display font-bold text-white">
                      {activePillar.name} Pillar
                    </h4>
                    <span className="text-xs text-[#908fa0]">
                      {activePillar.focus}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-md bg-[#171b26] border border-[#262a35] text-[11px] font-mono-code text-[#4cd7f6]">
                  {language === 'fr' ? 'Pillier Clé pour CLF-C02' : 'Key Exam Focus'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono-code uppercase text-[#908fa0] tracking-wider block mb-2">
                  {language === 'fr' ? 'Mots-Clés Déclencheurs à Repérer dans l’Énoncé :' : 'Exam Question Trigger Keywords:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {activePillar.examKeywords.map((kw, kwIdx) => (
                    <span
                      key={kwIdx}
                      className="px-2.5 py-1 rounded-lg bg-[#171b26] border border-[#262a35] text-xs font-mono-code text-[#dfe2f1]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Feature: 7 Rs of Cloud Migration Matrix */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262a35] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-[#5eead4]/20 text-[#5eead4] border border-[#5eead4]/30 font-bold">
                    TASK 1.3 MATRIX
                  </span>
                  <h3 className="text-lg font-display font-bold text-white">
                    {language === 'fr' ? 'Les 7 Stratégies de Migration Cloud (Les 7 R)' : 'The 7 Rs Cloud Migration Matrix'}
                  </h3>
                </div>
                <p className="text-xs text-[#908fa0] mt-1">
                  {language === 'fr'
                    ? 'Rehost, Relocate, Replatform, Refactor, Repurchase, Retain, Retire.'
                    : 'Decision criteria, implementation speed, and target AWS tool pairings.'}
                </p>
              </div>

              <a
                href="https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-strategies/welcome.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono-code text-[#4cd7f6] hover:underline flex items-center gap-1"
              >
                <span>{language === 'fr' ? 'Stratégies de Migration AWS ↗' : 'AWS Migration Strategies ↗'}</span>
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#262a35] text-[10px] font-mono-code text-[#908fa0] uppercase tracking-wider">
                    <th className="pb-3 px-3">{language === 'fr' ? 'Stratégie (R)' : 'Strategy (R)'}</th>
                    <th className="pb-3 px-3">{language === 'fr' ? 'Définition & Approche' : 'Definition & Approach'}</th>
                    <th className="pb-3 px-3">{language === 'fr' ? 'Effort' : 'Effort'}</th>
                    <th className="pb-3 px-3">{language === 'fr' ? 'Délai' : 'Time'}</th>
                    <th className="pb-3 px-3">{language === 'fr' ? 'Outil AWS Typique' : 'Typical AWS Tool'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262a35]/60 font-body">
                  {MIGRATION_7_RS.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#0a0e18]/60 transition-colors">
                      <td className="py-3 px-3 font-mono-code font-bold text-white whitespace-nowrap">
                        {row.name}
                      </td>
                      <td className="py-3 px-3 text-[#dfe2f1] max-w-sm leading-relaxed">
                        {row.strategy}
                      </td>
                      <td className="py-3 px-3 font-mono-code text-xs">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.effort === 'Low'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : row.effort === 'Medium' || row.effort === 'Low-Medium'
                              ? 'bg-amber-500/20 text-amber-400'
                              : row.effort === 'High'
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-zinc-700/30 text-zinc-400'
                          }`}
                        >
                          {row.effort}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono-code text-[#908fa0] whitespace-nowrap">
                        {row.time}
                      </td>
                      <td className="py-3 px-3 font-mono-code text-[#4cd7f6] whitespace-nowrap">
                        {row.tool}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Domain 1 Quick Knowledge Check Drill */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#262a35] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#ffb95f]">quiz</span>
                <h3 className="text-sm font-mono-code font-bold uppercase tracking-wider text-white">
                  {language === 'fr' ? 'Mini Quiz de Validation Domaine 1 (Question Typique)' : 'Domain 1 Scenario Drill (Sample Question)'}
                </h3>
              </div>
              <span className="text-[11px] font-mono-code text-[#4cd7f6]">
                {language === 'fr' ? 'Question d’Évaluation' : 'Instant Feedback'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0a0e18] border border-[#262a35] space-y-3">
              <p className="text-xs sm:text-sm font-medium text-white leading-relaxed">
                {language === 'fr'
                  ? 'Une entreprise souhaite migrer sa base de données relationnelle Oracle sur AWS sans avoir à gérer les correctifs de sécurité du système d’exploitation hôte, tout en minimisant la réécriture du code applicatif. Quelle stratégie de migration des 7 R et quel service AWS correspondent le mieux à ce besoin ?'
                  : 'A company wants to migrate an on-premises Oracle database to AWS without having to manage host operating system security patching, while avoiding rewriting application code. Which 7 Rs migration strategy and AWS service best fit this requirement?'}
              </p>

              <div className="space-y-2">
                {[
                  {
                    id: 0,
                    text: 'A. Rehost vers Amazon EC2 avec Amazon EBS gp3',
                    correct: false,
                    hint: 'Sur EC2 (IaaS), le client est toujours responsable de l’installation des correctifs du système d’exploitation hôte.',
                  },
                  {
                    id: 1,
                    text: 'B. Replatform vers Amazon RDS for Oracle',
                    correct: true,
                    hint: 'Correct ! Replatform (Lift, tinker, and shift) transfère la gestion de l’OS et des sauvegardes à AWS sans réécriture de code applicatif.',
                  },
                  {
                    id: 2,
                    text: 'C. Refactor vers Amazon DynamoDB',
                    correct: false,
                    hint: 'DynamoDB est une base NoSQL clé-valeur qui nécessiterait une refonte complète du schéma et du code de l’application.',
                  },
                  {
                    id: 3,
                    text: 'D. Retain avec AWS Outposts sur site',
                    correct: false,
                    hint: 'Retain conserve l’infrastructure sur site sans exploiter la gestion automatisée du cloud AWS.',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setQuickCheckAnswer(opt.id);
                      setShowQuickCheckExplanation(true);
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                      quickCheckAnswer === opt.id
                        ? opt.correct
                          ? 'bg-emerald-500/20 border-emerald-500 text-white font-semibold'
                          : 'bg-rose-500/20 border-rose-500 text-white font-semibold'
                        : 'bg-[#171b26] border-[#262a35] hover:border-[#464554] text-[#dfe2f1]'
                    }`}
                  >
                    <span>{opt.text}</span>
                    {quickCheckAnswer === opt.id && (
                      <span className="material-symbols-outlined text-[16px] shrink-0 ml-2">
                        {opt.correct ? 'check_circle' : 'cancel'}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {showQuickCheckExplanation && (
                <div className="p-3.5 rounded-lg bg-[#1c1f2a] border border-[#313540] text-xs text-[#dfe2f1] space-y-1">
                  <div className="font-mono-code text-[11px] font-bold text-emerald-400">
                    {language === 'fr' ? 'Explication de la réponse B (Replatform) :' : 'Explanation for Option B (Replatform):'}
                  </div>
                  <p className="leading-relaxed">
                    {language === 'fr'
                      ? 'Replatform consiste à effectuer des optimisations ciblées pour tirer parti des services gérés (comme Amazon RDS) sans modifier la logique applicative. AWS gère automatiquement l’OS, le matériel et les sauvegardes automatiques.'
                      : 'Replatforming optimizes workloads with managed services (such as Amazon RDS) without modifying application code. AWS manages OS patching, backups, and underlying hardware.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: 50 INTERACTIVE CLF-C02 FLASHCARDS DECK                            */}
      {/* ========================================================================= */}
      {activeView === 'flashcards' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Deck Controls & Filters */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-5 space-y-4">
            {/* Top Row: Mastery Progress Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262a35] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display font-bold text-lg sm:text-xl text-white">
                    {language === 'fr' ? 'Jeu des 50 Flashcards CLF-C02' : '50 CLF-C02 Flashcards Deck'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono-code bg-[#0a0e18] border border-[#262a35] text-[#4cd7f6] font-bold">
                    {filteredCards.length} {language === 'fr' ? 'cartes affichées' : 'cards filtered'}
                  </span>
                </div>
                <p className="text-xs text-[#908fa0]">
                  {language === 'fr'
                    ? 'Raccourcis : [Espace] Retourner • [← / →] Précédent/Suivant • [M] Maîtrisé • [R] À Réviser'
                    : 'Keyboard: [Space] Flip • [← / →] Prev/Next • [M] Toggle Mastered • [R] Flag Review'}
                </p>
              </div>

              {/* Progress Summary */}
              <div className="flex items-center gap-4 text-xs font-mono-code">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="text-[#908fa0]">{language === 'fr' ? 'Maîtrisées :' : 'Mastered:'}</span>
                  <span className="font-bold text-white">
                    {masteredCardIds.length} / 50
                  </span>
                  <span className="text-emerald-400 font-bold">
                    ({Math.round((masteredCardIds.length / 50) * 100)}%)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span className="text-[#908fa0]">{language === 'fr' ? 'À Réviser :' : 'Review:'}</span>
                  <span className="font-bold text-amber-400">
                    {reviewCardIds.length}
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (confirm(language === 'fr' ? 'Réinitialiser la progression ?' : 'Reset all mastery progress?')) {
                      setMasteredCardIds([]);
                      setReviewCardIds([]);
                    }
                  }}
                  className="text-[11px] text-[#908fa0] hover:text-white underline ml-2"
                >
                  {language === 'fr' ? 'Réinitialiser' : 'Reset'}
                </button>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Domain Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono-code">
                <button
                  onClick={() => setSelectedDomainFilter('all')}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    selectedDomainFilter === 'all'
                      ? 'bg-[#8083ff] text-white font-bold'
                      : 'bg-[#0a0e18] text-[#c7c4d7] hover:bg-[#262a35]'
                  }`}
                >
                  {language === 'fr' ? 'Tous les Domaines (50)' : 'All Domains (50)'}
                </button>

                <button
                  onClick={() => setSelectedDomainFilter(1)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    selectedDomainFilter === 1
                      ? 'bg-[#ff9900] text-[#0f131d] font-bold'
                      : 'bg-[#0a0e18] text-[#c7c4d7] hover:bg-[#262a35]'
                  }`}
                >
                  D1: Concepts (15)
                </button>

                <button
                  onClick={() => setSelectedDomainFilter(2)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    selectedDomainFilter === 2
                      ? 'bg-[#4cd7f6] text-[#0f131d] font-bold'
                      : 'bg-[#0a0e18] text-[#c7c4d7] hover:bg-[#262a35]'
                  }`}
                >
                  D2: Sécurité (15)
                </button>

                <button
                  onClick={() => setSelectedDomainFilter(3)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    selectedDomainFilter === 3
                      ? 'bg-[#5eead4] text-[#0f131d] font-bold'
                      : 'bg-[#0a0e18] text-[#c7c4d7] hover:bg-[#262a35]'
                  }`}
                >
                  D3: Technologies (13)
                </button>

                <button
                  onClick={() => setSelectedDomainFilter(4)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    selectedDomainFilter === 4
                      ? 'bg-[#34d399] text-[#0f131d] font-bold'
                      : 'bg-[#0a0e18] text-[#c7c4d7] hover:bg-[#262a35]'
                  }`}
                >
                  D4: Facturation (7)
                </button>
              </div>

              {/* Search & Status Filters */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-60">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-[#908fa0]">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'fr' ? 'Filtrer questions...' : 'Search flashcards...'}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0a0e18] border border-[#262a35] text-xs text-white placeholder-[#908fa0] focus:outline-none focus:border-[#8083ff]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#908fa0] hover:text-white"
                    >
                      ×
                    </button>
                  )}
                </div>

                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#0a0e18] border border-[#262a35] text-xs font-mono-code text-[#dfe2f1] focus:outline-none"
                >
                  <option value="all">{language === 'fr' ? 'Tous Statuts' : 'All Statuses'}</option>
                  <option value="mastered">{language === 'fr' ? 'Maîtrisées Uniquement' : 'Mastered Only'}</option>
                  <option value="review">{language === 'fr' ? 'À Réviser Uniquement' : 'Needs Review Only'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Flashcard Component */}
          {currentCard ? (
            <div className="space-y-4">
              {/* Card Header Info */}
              <div className="flex items-center justify-between text-xs font-mono-code">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#171b26] border border-[#262a35] text-[#ffb95f] font-bold">
                    Card #{currentCard.id} of 50
                  </span>
                  <span className="text-[#908fa0] hidden sm:inline">
                    {currentCard.taskStatement}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleReview(currentCard.id)}
                    className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 ${
                      reviewCardIds.includes(currentCard.id)
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-[#171b26] border-[#262a35] text-[#908fa0] hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {reviewCardIds.includes(currentCard.id) ? 'bookmark_added' : 'bookmark_border'}
                    </span>
                    <span>{language === 'fr' ? 'À réviser' : 'Review'}</span>
                  </button>

                  <button
                    onClick={() => toggleMastered(currentCard.id)}
                    className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 ${
                      masteredCardIds.includes(currentCard.id)
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-[#171b26] border-[#262a35] text-[#908fa0] hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {masteredCardIds.includes(currentCard.id) ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>{language === 'fr' ? 'Maîtrisé' : 'Mastered'}</span>
                  </button>
                </div>
              </div>

              {/* The Interactive Flip Card Box */}
              <div
                onClick={() => setIsFlipped((f) => !f)}
                className="cursor-pointer select-none rounded-2xl bg-[#171b26] border border-[#313540] hover:border-[#8083ff]/60 p-6 sm:p-10 shadow-2xl transition-all duration-300 min-h-[360px] flex flex-col justify-between relative group"
              >
                {/* Top of Card */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono-code font-bold bg-[#0a0e18] border border-[#262a35] text-[#4cd7f6]">
                        {currentCard.domainName}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono-code bg-[#1c1f2a] border border-[#262a35] text-[#dfe2f1]">
                        {currentCard.topic}
                      </span>
                      <span className="text-[10px] font-mono-code text-[#908fa0]">
                        {currentCard.difficulty}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-md bg-[#0a0e18] border border-[#262a35] text-[11px] font-mono-code text-[#908fa0] group-hover:text-white transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">sync</span>
                    <span>{isFlipped ? (language === 'fr' ? 'Voir Question' : 'View Question') : (language === 'fr' ? 'Cliquer pour Révéler' : 'Click to Flip')}</span>
                  </span>
                </div>

                {/* Center of Card: Question or Answer */}
                <div className="my-6">
                  {!isFlipped ? (
                    /* FRONT OF CARD (Question) */
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <span className="text-[11px] font-mono-code uppercase tracking-wider text-[#908fa0]">
                        {language === 'fr' ? 'QUESTION / DÉFI CONCEPTUEL :' : 'QUESTION / CONCEPT DRILL:'}
                      </span>
                      <h3 className="text-lg sm:text-2xl font-display font-semibold text-white leading-snug">
                        {currentCard.question}
                      </h3>
                    </div>
                  ) : (
                    /* BACK OF CARD (Verified Answer + Concept + Trap) */
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-mono-code uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          <span>{language === 'fr' ? 'RÉPONSE VALIDÉE & FONDEMENTS AWS :' : 'VERIFIED ANSWER & AWS BLUEPRINT:'}</span>
                        </span>
                        <div className="text-sm sm:text-base text-[#dfe2f1] whitespace-pre-line leading-relaxed">
                          {currentCard.answer}
                        </div>
                      </div>

                      {/* Key Rule Box */}
                      <div className="p-3.5 rounded-xl bg-[#0a0e18] border border-[#262a35] space-y-1 text-xs">
                        <span className="font-mono-code text-[11px] text-[#4cd7f6] uppercase font-bold block">
                          {language === 'fr' ? 'Règle Clé d’Architecture :' : 'Architectural Rule of Thumb:'}
                        </span>
                        <p className="text-[#dfe2f1] leading-relaxed">
                          {currentCard.keyRule}
                        </p>
                      </div>

                      {/* Exam Tip Box */}
                      <div className="p-3.5 rounded-xl bg-[#262a35]/60 border border-[#ff9900]/30 space-y-1 text-xs">
                        <span className="font-mono-code text-[11px] text-[#ffb95f] uppercase font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">lightbulb</span>
                          <span>{language === 'fr' ? 'Astuce d’Examen CLF-C02 :' : 'CLF-C02 Exam Tip / Trap Alert:'}</span>
                        </span>
                        <p className="text-[#dfe2f1] leading-relaxed">
                          {currentCard.examTip}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom of Card */}
                <div className="flex items-center justify-between pt-4 border-t border-[#262a35] text-xs text-[#908fa0]">
                  <span className="font-mono-code text-[11px]">
                    {language === 'fr' ? 'AWS Certified Cloud Practitioner' : 'AWS Certified Cloud Practitioner'}
                  </span>

                  {isFlipped && (
                    <a
                      href={currentCard.officialDocUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-mono-code text-[11px] text-[#8083ff] hover:text-white underline flex items-center gap-1"
                    >
                      <span>{language === 'fr' ? 'Documentation AWS associée' : 'Official AWS Doc Reference'}</span>
                      <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Navigation Controls Bar */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrevCard}
                  className="px-4 py-2.5 rounded-xl bg-[#171b26] hover:bg-[#262a35] border border-[#262a35] text-xs font-mono-code font-bold text-[#dfe2f1] flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>{language === 'fr' ? 'Carte Précédente' : 'Previous Card'}</span>
                </button>

                {/* Central Flip Trigger */}
                <button
                  onClick={() => setIsFlipped((f) => !f)}
                  className="px-5 py-2.5 rounded-xl bg-[#262a35] hover:bg-[#313540] text-xs font-mono-code font-bold text-white flex items-center gap-2 border border-[#313540] transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">flip</span>
                  <span>{isFlipped ? (language === 'fr' ? 'Masquer Réponse' : 'Hide Answer') : (language === 'fr' ? 'Afficher Réponse' : 'Show Answer')}</span>
                </button>

                <button
                  onClick={handleNextCard}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff9900] to-[#ffb95f] hover:opacity-90 text-[#0f131d] text-xs font-mono-code font-bold flex items-center gap-1.5 transition-all shadow-md"
                >
                  <span>{language === 'fr' ? 'Carte Suivante' : 'Next Card'}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

              {/* Quick Jump 50-Cards Grid */}
              <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-5 space-y-3 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">grid_view</span>
                    <span className="text-xs font-mono-code font-bold text-white uppercase tracking-wider">
                      {language === 'fr' ? 'Sélecteur Rapide des 50 Cartes' : 'Quick Jump Grid (50 Cards)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono-code">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-emerald-500"></span>
                      <span className="text-[#908fa0]">{language === 'fr' ? 'Maîtrisé' : 'Mastered'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-amber-500"></span>
                      <span className="text-[#908fa0]">{language === 'fr' ? 'Révision' : 'Review'}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-25 gap-1.5">
                  {filteredCards.map((card, idx) => {
                    const isCurrent = idx === currentCardIndex;
                    const isMastered = masteredCardIds.includes(card.id);
                    const isReview = reviewCardIds.includes(card.id);

                    return (
                      <button
                        key={card.id}
                        onClick={() => {
                          setCurrentCardIndex(idx);
                          setIsFlipped(false);
                        }}
                        className={`h-8 rounded-lg font-mono-code text-xs font-bold flex items-center justify-center transition-all ${
                          isCurrent
                            ? 'ring-2 ring-white scale-110 shadow-lg font-extrabold z-10'
                            : ''
                        } ${
                          isMastered
                            ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                            : isReview
                            ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                            : 'bg-[#0a0e18] text-[#908fa0] hover:text-white border border-[#262a35] hover:border-[#464554]'
                        }`}
                        title={`Card #${card.id}: ${card.topic}`}
                      >
                        {card.id}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Empty Filter State */
            <div className="p-12 text-center rounded-2xl bg-[#171b26] border border-[#262a35] space-y-3">
              <span className="material-symbols-outlined text-[36px] text-[#908fa0]">style</span>
              <h3 className="text-base font-bold text-white">
                {language === 'fr' ? 'Aucune flashcard ne correspond à ce filtre' : 'No flashcards matched your filter'}
              </h3>
              <p className="text-xs text-[#908fa0] max-w-sm mx-auto">
                {language === 'fr'
                  ? 'Essayez de réinitialiser la recherche ou de sélectionner un autre domaine.'
                  : 'Try clearing your search query or choosing another domain category.'}
              </p>
              <button
                onClick={() => {
                  setSelectedDomainFilter('all');
                  setSelectedStatusFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-[#262a35] hover:bg-[#313540] text-xs font-mono-code text-white transition-colors"
              >
                {language === 'fr' ? 'Réinitialiser les Filtres' : 'Reset Filters'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
