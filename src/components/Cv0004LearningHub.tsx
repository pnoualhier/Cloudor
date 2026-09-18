import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  CV0_004_EXAM_METADATA,
  CV0_004_DOMAIN_1_TASKS,
  SHARED_RESPONSIBILITY_COMPTIA_TABLE,
  DR_STRATEGIES_COMPTIA_TABLE,
  STORAGE_TYPES_COMPTIA_TABLE,
} from '../data/cv0004Domain1GuideData';
import {
  CV0_004_DOMAIN_2_TASKS,
  IAM_ACCESS_MODELS_COMPTIA_TABLE,
  ENCRYPTION_KEY_MODELS_COMPTIA_TABLE,
  NETWORK_SECURITY_CONTROLS_COMPTIA_TABLE,
  COMPLIANCE_FRAMEWORKS_COMPTIA_TABLE,
} from '../data/cv0004Domain2GuideData';
import {
  CV0_004_DOMAIN_3_TASKS,
  DEPLOYMENT_STRATEGIES_COMPTIA_TABLE,
  IAC_CONFIGURATION_MGMT_COMPTIA_TABLE,
  BACKUP_TYPES_CONSISTENCY_COMPTIA_TABLE,
  MONITORING_TELEMETRY_PILLARS_TABLE,
} from '../data/cv0004Domain3GuideData';
import {
  CV0_004_DOMAIN_1_100_FLASHCARDS,
  Cv0004Flashcard,
} from '../data/cv0004Domain1FlashcardsData';
import {
  CV0_004_DOMAIN_2_100_FLASHCARDS,
} from '../data/cv0004Domain2FlashcardsData';
import {
  CV0_004_DOMAIN_3_100_FLASHCARDS,
} from '../data/cv0004Domain3FlashcardsData';

interface Cv0004LearningHubProps {
  initialMode?: 'flashcards' | 'guide';
  onNavigate?: (tab: string) => void;
}

export const Cv0004LearningHub: React.FC<Cv0004LearningHubProps> = ({
  initialMode = 'flashcards',
  onNavigate,
}) => {
  const { language } = useLanguage();

  // Active view: 'flashcards' or 'guide'
  const [activeView, setActiveView] = useState<'flashcards' | 'guide'>(initialMode);

  // Selected Domain: 1 (Architecture), 2 (Security), 3 (Operations), or 'all' (300 Cards)
  // Default to Domain 3 as requested by user
  const [selectedDomain, setSelectedDomain] = useState<1 | 2 | 3 | 'all'>(3);

  // Guide domain view
  const [selectedGuideDomain, setSelectedGuideDomain] = useState<1 | 2 | 3>(3);

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'mastered' | 'review'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [showGridModal, setShowGridModal] = useState<boolean>(false);
  const [gridModalDomainFilter, setGridModalDomainFilter] = useState<1 | 2 | 3 | 'all'>(3);

  // Guide state
  const [selectedTaskId, setSelectedTaskId] = useState<string>('task-3-1');
  const [quickCheckAnswer, setQuickCheckAnswer] = useState<number | null>(null);
  const [showQuickCheckExplanation, setShowQuickCheckExplanation] = useState<boolean>(false);

  // Domain 2 Quick Check
  const [quickCheckD2Answer, setQuickCheckD2Answer] = useState<number | null>(null);
  const [showQuickCheckD2Explanation, setShowQuickCheckD2Explanation] = useState<boolean>(false);

  // Domain 3 Quick Check
  const [quickCheckD3Answer, setQuickCheckD3Answer] = useState<number | null>(null);
  const [showQuickCheckD3Explanation, setShowQuickCheckD3Explanation] = useState<boolean>(false);

  // Combined pool of all cards (300 cards total)
  const allCardsPool = useMemo(() => {
    return [
      ...CV0_004_DOMAIN_1_100_FLASHCARDS,
      ...CV0_004_DOMAIN_2_100_FLASHCARDS,
      ...CV0_004_DOMAIN_3_100_FLASHCARDS,
    ];
  }, []);

  // Active pool based on selectedDomain
  const activeDomainCards = useMemo(() => {
    if (selectedDomain === 1) return CV0_004_DOMAIN_1_100_FLASHCARDS;
    if (selectedDomain === 2) return CV0_004_DOMAIN_2_100_FLASHCARDS;
    if (selectedDomain === 3) return CV0_004_DOMAIN_3_100_FLASHCARDS;
    return allCardsPool;
  }, [selectedDomain, allCardsPool]);

  // LocalStorage persistence for all 200 Flashcards
  const [masteredCardIds, setMasteredCardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cloudor_cv0004_all_mastered');
      if (saved) return JSON.parse(saved);
      const oldD1 = localStorage.getItem('cloudor_cv0004_d1_mastered');
      return oldD1 ? JSON.parse(oldD1) : [];
    } catch {
      return [];
    }
  });

  const [reviewCardIds, setReviewCardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cloudor_cv0004_all_review');
      if (saved) return JSON.parse(saved);
      const oldD1 = localStorage.getItem('cloudor_cv0004_d1_review');
      return oldD1 ? JSON.parse(oldD1) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cloudor_cv0004_all_mastered', JSON.stringify(masteredCardIds));
    } catch (e) {
      console.error(e);
    }
  }, [masteredCardIds]);

  useEffect(() => {
    try {
      localStorage.setItem('cloudor_cv0004_all_review', JSON.stringify(reviewCardIds));
    } catch (e) {
      console.error(e);
    }
  }, [reviewCardIds]);

  // Categories list for filtering based on activeDomainCards
  const categories = useMemo(() => {
    const cats = Array.from(new Set(activeDomainCards.map((c) => c.category)));
    return ['all', ...cats];
  }, [activeDomainCards]);

  // Handle Domain Change
  const handleDomainChange = (domain: 1 | 2 | 3 | 'all') => {
    setSelectedDomain(domain);
    setSelectedCategoryFilter('all');
    setCurrentCardIndex(0);
    setIsFlipped(false);
    if (domain !== 'all') {
      setGridModalDomainFilter(domain);
    }
  };

  // Filter cards
  const filteredCards = useMemo(() => {
    let list = [...activeDomainCards];

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
          c.examTip.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    if (isShuffled) {
      list = [...list].sort((a, b) => ((a.id * 37) % 100) - ((b.id * 37) % 100));
    }

    return list;
  }, [
    activeDomainCards,
    selectedCategoryFilter,
    selectedDifficultyFilter,
    selectedStatusFilter,
    searchQuery,
    isShuffled,
    masteredCardIds,
    reviewCardIds,
  ]);

  // Current Card
  const currentCard: Cv0004Flashcard | undefined = filteredCards[currentCardIndex];

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

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const toggleMastered = useCallback((id: number) => {
    setMasteredCardIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
    setReviewCardIds((prev) => prev.filter((item) => item !== id));
  }, []);

  const toggleReview = useCallback((id: number) => {
    setReviewCardIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
    setMasteredCardIds((prev) => prev.filter((item) => item !== id));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowRight' || e.key === 'KeyD') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'KeyA') {
        e.preventDefault();
        handlePrev();
      } else if ((e.key === 'm' || e.key === 'M') && currentCard) {
        e.preventDefault();
        toggleMastered(currentCard.id);
      } else if ((e.key === 'r' || e.key === 'R') && currentCard) {
        e.preventDefault();
        toggleReview(currentCard.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrev, toggleMastered, toggleReview, currentCard]);

  // Reset progress
  const handleResetProgress = () => {
    if (
      window.confirm(
        language === 'fr'
          ? 'Êtes-vous sûr de vouloir réinitialiser la progression des fiches CV0-004 ?'
          : 'Are you sure you want to reset your CV0-004 flashcard progress?'
      )
    ) {
      setMasteredCardIds([]);
      setReviewCardIds([]);
    }
  };

  // Stats calculation for the active domain pool
  const totalCardsInActiveDomain = activeDomainCards.length;
  const masteredInActiveDomain = activeDomainCards.filter((c) => masteredCardIds.includes(c.id)).length;
  const reviewInActiveDomain = activeDomainCards.filter((c) => reviewCardIds.includes(c.id)).length;
  const masteryPercentage = totalCardsInActiveDomain > 0
    ? Math.round((masteredInActiveDomain / totalCardsInActiveDomain) * 100)
    : 0;

  // Jump Grid Modal filtered cards
  const gridModalCards = useMemo(() => {
    if (gridModalDomainFilter === 1) return CV0_004_DOMAIN_1_100_FLASHCARDS;
    if (gridModalDomainFilter === 2) return CV0_004_DOMAIN_2_100_FLASHCARDS;
    if (gridModalDomainFilter === 3) return CV0_004_DOMAIN_3_100_FLASHCARDS;
    return allCardsPool;
  }, [gridModalDomainFilter, allCardsPool]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#171b26] via-[#1c202c] to-[#12151e] border border-[#2e3442] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono-code font-bold bg-red-600/20 text-red-400 border border-red-500/30">
                CompTIA Cloud+ • CV0-004
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-mono-code bg-[#1f2937] text-amber-400 border border-amber-500/30">
                300 Cards Pool (D1 + D2 + D3)
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-mono-code bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                Passing: 750 / 900
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
              {selectedDomain === 3
                ? language === 'fr'
                  ? 'CompTIA Cloud+ (CV0-004) — Domaine 3 : Déploiement & Opérations'
                  : 'CompTIA Cloud+ (CV0-004) — Domain 3: Deployment & Operations'
                : selectedDomain === 2
                ? language === 'fr'
                  ? 'CompTIA Cloud+ (CV0-004) — Domaine 2 : Sécurité & Conformité'
                  : 'CompTIA Cloud+ (CV0-004) — Domain 2: Security & Compliance'
                : selectedDomain === 1
                ? language === 'fr'
                  ? 'CompTIA Cloud+ (CV0-004) — Domaine 1 : Architecture Cloud'
                  : 'CompTIA Cloud+ (CV0-004) — Domain 1: Cloud Architecture'
                : language === 'fr'
                ? 'CompTIA Cloud+ (CV0-004) — Hub Global (Domaines 1, 2 & 3)'
                : 'CompTIA Cloud+ (CV0-004) — Comprehensive Hub (Domains 1, 2 & 3)'}
            </h1>

            <p className="text-sm text-[#c7c4d7] max-w-3xl leading-relaxed">
              {selectedDomain === 3
                ? language === 'fr'
                  ? 'Maîtrisez les 100 fiches officielles du Domaine 3 (28% de l’examen — le plus lourd !) : IaC déclaratif (Terraform/Ansible), CI/CD (Blue/Green, Canary, Rolling), Kubernetes (Pods, Deployments, StatefulSets, DaemonSets, Helm), auto-scaling & cooldowns, extension de stockage en ligne, sauvegardes cohérentes (VSS), observabilité OpenTelemetry et FinOps.'
                  : 'Master all 100 official Domain 3 flashcards (28% exam weight — highest on exam!): Declarative IaC (Terraform, Ansible), CI/CD release strategies (Blue/Green, Canary, Rolling), Kubernetes (StatefulSets, DaemonSets, Helm), auto-scaling & cooldowns, online block expansion, app-consistent backups (VSS), distributed tracing (OpenTelemetry), and FinOps.'
                : selectedDomain === 2
                ? language === 'fr'
                  ? 'Maîtrisez les 100 fiches officielles du Domaine 2 (25% de l’examen) : IAM (RBAC, ABAC, FIDO2, SAML), chiffrement & KMS, sécurité réseau VPC/WAF/Zero Trust, durcissement CIS & CSPM/CWPP, conformité SOC 2, HIPAA, PCI-DSS et criminalistique cloud.'
                  : 'Master all 100 official Domain 2 flashcards (25% exam weight): IAM (RBAC, ABAC, FIDO2, SAML), encryption & KMS/CloudHSM, network security (SGs vs NACLs, WAF, ZTA), CIS baselines, CSPM/CWPP, SOC 2, HIPAA, PCI-DSS, and digital forensics.'
                : selectedDomain === 1
                ? language === 'fr'
                  ? 'Maîtrisez les 100 fiches officielles du Domaine 1 (23% de l’examen) : modèles de service (IaaS/PaaS/SaaS), stockage (Bloc, Fichier, Objet), virtualisation, réseaux VPC/SDN, haute disponibilité/DR, et optimisation économique.'
                  : 'Master all 100 official Domain 1 flashcards (23% exam weight): service models (IaaS/PaaS/SaaS), storage mechanics (Block/File/Object), hypervisors & containers, hybrid networking, disaster recovery tiers, and cloud economics.'
                : language === 'fr'
                ? 'Accédez au référentiel complet de 300 fiches couvrant les Domaines 1, 2 & 3 (76% du poids total de l’examen CV0-004).'
                : 'Access the complete 300-flashcard drill covering Domains 1, 2 & 3 (76% of the CV0-004 exam weight).'}
            </p>

            {/* Domain Switcher Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono-code text-xs">
              <span className="text-[#908fa0] mr-1 text-[11px] uppercase font-bold">
                {language === 'fr' ? 'Domaine Actif :' : 'Active Domain :'}
              </span>
              <button
                onClick={() => handleDomainChange(3)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedDomain === 3
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-1 ring-white/30'
                    : 'bg-[#0f131d] text-[#c7c4d7] hover:bg-[#262a35] hover:text-white border border-[#262a35]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">settings_suggest</span>
                <span>{language === 'fr' ? 'Domaine 3 : Opérations (100 Fiches • 28%)' : 'Domain 3: Operations (100 Cards • 28%)'}</span>
              </button>
              <button
                onClick={() => handleDomainChange(2)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedDomain === 2
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-1 ring-white/30'
                    : 'bg-[#0f131d] text-[#c7c4d7] hover:bg-[#262a35] hover:text-white border border-[#262a35]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">verified_user</span>
                <span>{language === 'fr' ? 'Domaine 2 : Sécurité (100 Fiches • 25%)' : 'Domain 2: Security (100 Cards • 25%)'}</span>
              </button>
              <button
                onClick={() => handleDomainChange(1)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedDomain === 1
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-1 ring-white/30'
                    : 'bg-[#0f131d] text-[#c7c4d7] hover:bg-[#262a35] hover:text-white border border-[#262a35]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">cloud</span>
                <span>{language === 'fr' ? 'Domaine 1 : Architecture (100 Fiches • 23%)' : 'Domain 1: Architecture (100 Cards • 23%)'}</span>
              </button>
              <button
                onClick={() => handleDomainChange('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedDomain === 'all'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-1 ring-white/30'
                    : 'bg-[#0f131d] text-[#c7c4d7] hover:bg-[#262a35] hover:text-white border border-[#262a35]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">layers</span>
                <span>{language === 'fr' ? 'Tous les Domaines (300 Fiches)' : 'All Domains (300 Cards)'}</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 bg-[#0a0e18] p-1 rounded-xl border border-[#262a35] shrink-0 font-mono-code text-xs">
            <button
              onClick={() => setActiveView('flashcards')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                activeView === 'flashcards'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg'
                  : 'text-[#908fa0] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">style</span>
              <span>
                {selectedDomain === 2
                  ? language === 'fr' ? '100 Fiches Domaine 2' : '100 D2 Flashcards'
                  : selectedDomain === 1
                  ? language === 'fr' ? '100 Fiches Domaine 1' : '100 D1 Flashcards'
                  : language === 'fr' ? '200 Fiches Complètes' : '200 Flashcards Drill'}
              </span>
            </button>
            <button
              onClick={() => setActiveView('guide')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                activeView === 'guide'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg'
                  : 'text-[#908fa0] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              <span>{language === 'fr' ? 'Guides d’Examen & Matrices' : 'Exam Guides & Matrices'}</span>
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-5 border-t border-[#262a35] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono-code">
          <div className="bg-[#0f131d]/60 p-3 rounded-xl border border-[#262a35]">
            <span className="text-[#908fa0] block">
              {language === 'fr' ? 'Fiches Maîtrisées' : 'Mastered Cards'}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-emerald-400">{masteredInActiveDomain}</span>
              <span className="text-[#908fa0]">/ {totalCardsInActiveDomain}</span>
            </div>
          </div>
          <div className="bg-[#0f131d]/60 p-3 rounded-xl border border-[#262a35]">
            <span className="text-[#908fa0] block">{language === 'fr' ? 'À Revoir' : 'Need Review'}</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-amber-400">{reviewInActiveDomain}</span>
              <span className="text-[#908fa0]">cards</span>
            </div>
          </div>
          <div className="bg-[#0f131d]/60 p-3 rounded-xl border border-[#262a35]">
            <span className="text-[#908fa0] block">{language === 'fr' ? 'Taux de Maîtrise' : 'Mastery Rate'}</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-[#4cd7f6]">{masteryPercentage}%</span>
              <span className="text-[#908fa0]">{masteryPercentage >= 80 ? 'Exam Ready' : 'In Progress'}</span>
            </div>
          </div>
          <div className="bg-[#0f131d]/60 p-3 rounded-xl border border-[#262a35]">
            <span className="text-[#908fa0] block">{language === 'fr' ? 'Examen CV0-004' : 'CV0-004 Pass Mark'}</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-white">750 / 900</span>
              <span className="text-[#908fa0]">(83.3%)</span>
            </div>
          </div>
        </div>

        <div className="w-full bg-[#0a0e18] h-2 rounded-full mt-4 overflow-hidden border border-[#262a35]">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-[#4cd7f6] to-red-500 transition-all duration-500"
            style={{ width: `${masteryPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: FLASHCARDS DRILL */}
      {/* ========================================================================= */}
      {activeView === 'flashcards' && (
        <div className="space-y-6">
          {/* Controls & Filter Bar */}
          <div className="p-4 rounded-xl bg-[#131722] border border-[#262a35] space-y-4">
            {/* Top row: Search, Category, Difficulty, Status */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#908fa0] text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentCardIndex(0);
                  }}
                  placeholder={
                    selectedDomain === 2
                      ? language === 'fr'
                        ? 'Rechercher IAM, RBAC, KMS, WAF, SOC 2, CIS, NACL, IMDSv2...'
                        : 'Search IAM, RBAC, KMS, WAF, SOC 2, CIS, NACL, IMDSv2...'
                      : language === 'fr'
                      ? 'Rechercher un concept, protocole, RTO, hyperviseur...'
                      : 'Search concept, protocol, hypervisor, RTO, SR-IOV...'
                  }
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#0a0e18] border border-[#262a35] text-xs text-white placeholder-[#606375] focus:outline-none focus:border-red-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-[#908fa0] hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </div>

              {/* Action buttons: Jump Grid, Shuffle, Reset */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowGridModal(true)}
                  className="px-3 py-2 rounded-lg bg-[#0a0e18] border border-[#262a35] text-xs font-mono-code text-[#dfe2f1] hover:text-white hover:border-[#3a3f50] transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Open card grid modal"
                >
                  <span className="material-symbols-outlined text-[16px]">grid_view</span>
                  <span>{language === 'fr' ? 'Grille' : 'Grid'}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-600/30 text-red-300 font-bold">
                    {filteredCards.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsShuffled((prev) => !prev);
                    setCurrentCardIndex(0);
                  }}
                  className={`px-3 py-2 rounded-lg border text-xs font-mono-code transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isShuffled
                      ? 'bg-amber-600/20 border-amber-500/40 text-amber-300'
                      : 'bg-[#0a0e18] border-[#262a35] text-[#dfe2f1] hover:text-white'
                  }`}
                  title="Shuffle cards"
                >
                  <span className="material-symbols-outlined text-[16px]">shuffle</span>
                  <span>{language === 'fr' ? 'Aléatoire' : 'Shuffle'}</span>
                </button>

                <button
                  onClick={handleResetProgress}
                  className="px-3 py-2 rounded-lg bg-[#0a0e18] border border-[#262a35] text-xs font-mono-code text-[#908fa0] hover:text-rose-400 hover:border-rose-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Reset progress"
                >
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                  <span className="hidden sm:inline">{language === 'fr' ? 'Reset' : 'Reset'}</span>
                </button>
              </div>
            </div>

            {/* Filter Pills row */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1e2330] text-xs font-mono-code">
              {/* Category selector */}
              <div className="flex items-center gap-1 bg-[#0a0e18] px-2.5 py-1 rounded-lg border border-[#262a35]">
                <span className="text-[#908fa0] text-[11px]">{language === 'fr' ? 'Sujet :' : 'Topic:'}</span>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => {
                    setSelectedCategoryFilter(e.target.value);
                    setCurrentCardIndex(0);
                  }}
                  className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
                >
                  <option value="all" className="bg-[#131722] text-white">
                    {language === 'fr' ? 'Tous les sous-domaines' : 'All Sub-domains'}
                  </option>
                  {categories
                    .filter((c) => c !== 'all')
                    .map((cat) => (
                      <option key={cat} value={cat} className="bg-[#131722] text-white">
                        {cat}
                      </option>
                    ))}
                </select>
              </div>

              {/* Difficulty selector */}
              <div className="flex items-center gap-1 bg-[#0a0e18] px-2.5 py-1 rounded-lg border border-[#262a35]">
                <span className="text-[#908fa0] text-[11px]">{language === 'fr' ? 'Niveau :' : 'Level:'}</span>
                <select
                  value={selectedDifficultyFilter}
                  onChange={(e) => {
                    setSelectedDifficultyFilter(e.target.value);
                    setCurrentCardIndex(0);
                  }}
                  className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
                >
                  <option value="all" className="bg-[#131722] text-white">
                    {language === 'fr' ? 'Toutes Difficultés' : 'All Levels'}
                  </option>
                  <option value="Foundational" className="bg-[#131722] text-white">
                    Foundational
                  </option>
                  <option value="Standard" className="bg-[#131722] text-white">
                    Standard
                  </option>
                  <option value="Advanced" className="bg-[#131722] text-white">
                    Advanced
                  </option>
                </select>
              </div>

              {/* Status filter buttons */}
              <div className="flex items-center gap-1 ml-auto">
                <button
                  onClick={() => {
                    setSelectedStatusFilter('all');
                    setCurrentCardIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    selectedStatusFilter === 'all'
                      ? 'bg-white/15 text-white font-bold'
                      : 'text-[#908fa0] hover:text-white'
                  }`}
                >
                  {language === 'fr' ? 'Toutes' : 'All'}
                </button>
                <button
                  onClick={() => {
                    setSelectedStatusFilter('mastered');
                    setCurrentCardIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                    selectedStatusFilter === 'mastered'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                      : 'text-[#908fa0] hover:text-emerald-300'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{language === 'fr' ? 'Maîtrisées' : 'Mastered'}</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedStatusFilter('review');
                    setCurrentCardIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                    selectedStatusFilter === 'review'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                      : 'text-[#908fa0] hover:text-amber-300'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>{language === 'fr' ? 'À Revoir' : 'Review'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Flashcard Viewer */}
          {filteredCards.length > 0 && currentCard ? (
            <div className="space-y-4">
              {/* Card Header & Position */}
              <div className="flex items-center justify-between text-xs font-mono-code text-[#908fa0]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#171b26] text-white border border-[#2e3442] font-bold">
                    Card #{currentCard.id}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                    {currentCard.domainName.split(':')[0]}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#131722] text-[#4cd7f6] border border-[#262a35]">
                    {currentCard.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded border ${
                      currentCard.difficulty === 'Foundational'
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                        : currentCard.difficulty === 'Standard'
                        ? 'bg-blue-950/40 text-blue-300 border-blue-500/30'
                        : 'bg-purple-950/40 text-purple-300 border-purple-500/30'
                    }`}
                  >
                    {currentCard.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span>
                    {currentCardIndex + 1} / {filteredCards.length}
                  </span>
                  {masteredCardIds.includes(currentCard.id) && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      <span>{language === 'fr' ? 'Maîtrisée' : 'Mastered'}</span>
                    </span>
                  )}
                  {reviewCardIds.includes(currentCard.id) && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">bookmark</span>
                      <span>{language === 'fr' ? 'À revoir' : 'Review'}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Card Container (Click to Flip) */}
              <div
                onClick={handleFlip}
                className={`relative min-h-[380px] sm:min-h-[340px] rounded-2xl p-6 sm:p-8 cursor-pointer transition-all duration-300 border shadow-2xl flex flex-col justify-between select-none ${
                  isFlipped
                    ? 'bg-gradient-to-br from-[#171b26] to-[#0f131d] border-red-500/40 ring-1 ring-red-500/30'
                    : 'bg-gradient-to-br from-[#131722] to-[#0a0e18] border-[#262a35] hover:border-[#3a3f50]'
                }`}
              >
                {/* Front Side: Question */}
                {!isFlipped ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono-code uppercase tracking-wider text-red-400 font-bold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">help</span>
                        <span>{language === 'fr' ? 'QUESTION D’EXAMEN CLOUD+' : 'CLOUD+ EXAM QUESTION'}</span>
                      </span>
                      <span className="text-xs font-mono-code text-[#606375] flex items-center gap-1">
                        <span>{language === 'fr' ? 'Cliquer ou Espace pour voir la réponse' : 'Click or Space to reveal answer'}</span>
                        <span className="material-symbols-outlined text-[16px]">flip</span>
                      </span>
                    </div>

                    <div className="pt-2">
                      <span className="text-xs font-mono-code text-[#908fa0] uppercase tracking-wide block mb-1">
                        {currentCard.topic}
                      </span>
                      <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed font-display">
                        {currentCard.question}
                      </h2>
                    </div>
                  </div>
                ) : (
                  /* Back Side: Answer, Key Rule, Exam Tip */
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-[#262a35] pb-2">
                      <span className="text-xs font-mono-code uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        <span>{language === 'fr' ? 'RÉPONSE OFFICIELLE CV0-004' : 'OFFICIAL CV0-004 ANSWER'}</span>
                      </span>
                      <span className="text-xs font-mono-code text-[#606375] flex items-center gap-1">
                        <span>{language === 'fr' ? 'Cliquer pour retourner' : 'Click to flip back'}</span>
                        <span className="material-symbols-outlined text-[16px]">flip</span>
                      </span>
                    </div>

                    {/* Detailed Answer */}
                    <p className="text-sm sm:text-base text-[#dfe2f1] leading-relaxed font-body whitespace-pre-line">
                      {currentCard.answer}
                    </p>

                    {/* Core Architectural Rule */}
                    <div className="p-3.5 rounded-xl bg-[#1e2330]/80 border border-[#313540] space-y-1">
                      <span className="text-[11px] font-mono-code text-[#4cd7f6] uppercase tracking-wide font-bold block">
                        {language === 'fr' ? 'Règle Architecturale Clé :' : 'Key Architectural Rule :'}
                      </span>
                      <p className="text-xs text-white font-medium">{currentCard.keyRule}</p>
                    </div>

                    {/* CompTIA Exam Tip */}
                    <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1">
                      <span className="text-[11px] font-mono-code text-amber-400 uppercase tracking-wide font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">school</span>
                        <span>{language === 'fr' ? 'Conseil pour l’Épreuve :' : 'CompTIA Exam Tip :'}</span>
                      </span>
                      <p className="text-xs text-[#f4dfc7] font-medium leading-relaxed">
                        {currentCard.examTip}
                      </p>
                    </div>
                  </div>
                )}

                {/* Bottom Card Footer: Action toggles */}
                <div className="pt-4 border-t border-[#1e2330] flex flex-wrap items-center justify-between gap-3 text-xs font-mono-code">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMastered(currentCard.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                        masteredCardIds.includes(currentCard.id)
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                          : 'bg-[#171b26] text-[#c7c4d7] border-[#2e3442] hover:text-emerald-300 hover:border-emerald-500/40'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      <span>
                        {masteredCardIds.includes(currentCard.id)
                          ? language === 'fr' ? 'Maîtrisée' : 'Mastered'
                          : language === 'fr' ? 'Marquer Maîtrisée [M]' : 'Mark Mastered [M]'}
                      </span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleReview(currentCard.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                        reviewCardIds.includes(currentCard.id)
                          ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-500/20'
                          : 'bg-[#171b26] text-[#c7c4d7] border-[#2e3442] hover:text-amber-300 hover:border-amber-500/40'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">bookmark</span>
                      <span>
                        {reviewCardIds.includes(currentCard.id)
                          ? language === 'fr' ? 'À revoir' : 'Marked Review'
                          : language === 'fr' ? 'À revoir [R]' : 'Need Review [R]'}
                      </span>
                    </button>
                  </div>

                  <a
                    href={currentCard.officialDocUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#908fa0] hover:text-white transition-colors flex items-center gap-1 hover:underline"
                  >
                    <span>CompTIA Official Guide</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                </div>
              </div>

              {/* Navigation Bar */}
              <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[#131722] border border-[#262a35] font-mono-code text-xs">
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-lg bg-[#0a0e18] border border-[#262a35] text-white hover:bg-[#1c202c] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>{language === 'fr' ? 'Précédente [←]' : 'Previous [←]'}</span>
                </button>

                <button
                  onClick={handleFlip}
                  className="px-5 py-2 rounded-lg bg-red-600/20 border border-red-500/40 text-red-300 hover:bg-red-600/30 transition-all font-bold flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">sync</span>
                  <span>{isFlipped ? (language === 'fr' ? 'Voir Question' : 'Show Question') : (language === 'fr' ? 'Révéler Réponse' : 'Reveal Answer')} [Espace]</span>
                </button>

                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-lg bg-[#0a0e18] border border-[#262a35] text-white hover:bg-[#1c202c] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{language === 'fr' ? 'Suivante [→]' : 'Next [→]'}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-[#131722] border border-[#262a35] space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#908fa0]">filter_alt_off</span>
              <h3 className="text-base font-bold text-white">
                {language === 'fr' ? 'Aucune fiche ne correspond à vos filtres' : 'No flashcards match your filter'}
              </h3>
              <p className="text-xs text-[#908fa0] max-w-md mx-auto">
                {language === 'fr'
                  ? 'Essayez de réinitialiser la recherche ou de sélectionner « Toutes » dans les options de filtre.'
                  : 'Try clearing your search query or selecting "All" in the status and topic filters.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategoryFilter('all');
                  setSelectedDifficultyFilter('all');
                  setSelectedStatusFilter('all');
                  setCurrentCardIndex(0);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-mono-code font-bold hover:bg-red-500 transition-colors cursor-pointer"
              >
                {language === 'fr' ? 'Réinitialiser tous les filtres' : 'Reset All Filters'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: EXAM GUIDE & COMPARISON MATRICES */}
      {/* ========================================================================= */}
      {activeView === 'guide' && (
        <div className="space-y-8">
          {/* Guide Domain Switcher */}
          <div className="p-4 rounded-xl bg-[#131722] border border-[#262a35] flex flex-wrap items-center justify-between gap-4 font-mono-code text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#908fa0] font-bold uppercase">{language === 'fr' ? 'Programme Officiel :' : 'Syllabus Domain :'}</span>
              <button
                onClick={() => {
                  setSelectedGuideDomain(3);
                  setSelectedTaskId('task-3-1');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedGuideDomain === 3
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-[#0f131d] text-[#c7c4d7] hover:bg-[#262a35] hover:text-white border border-[#262a35]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">settings_suggest</span>
                <span>{language === 'fr' ? 'Domaine 3 : Déploiement & Opérations (28%)' : 'Domain 3: Deployment & Operations (28%)'}</span>
              </button>
              <button
                onClick={() => {
                  setSelectedGuideDomain(2);
                  setSelectedTaskId('task-2-1');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedGuideDomain === 2
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-[#0f131d] text-[#c7c4d7] hover:bg-[#262a35] hover:text-white border border-[#262a35]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>{language === 'fr' ? 'Domaine 2 : Sécurité & Conformité (25%)' : 'Domain 2: Security & Compliance (25%)'}</span>
              </button>
              <button
                onClick={() => {
                  setSelectedGuideDomain(1);
                  setSelectedTaskId('task-1-1');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedGuideDomain === 1
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-[#0f131d] text-[#c7c4d7] hover:bg-[#262a35] hover:text-white border border-[#262a35]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">cloud</span>
                <span>{language === 'fr' ? 'Domaine 1 : Architecture Cloud (23%)' : 'Domain 1: Cloud Architecture (23%)'}</span>
              </button>
            </div>
            <span className="text-[#908fa0]">
              {selectedGuideDomain === 3
                ? '5 Sub-objectives • Cards 201–300'
                : selectedGuideDomain === 2
                ? '5 Sub-objectives • Cards 101–200'
                : '7 Sub-objectives • Cards 1–100'}
            </span>
          </div>

          {/* ========================================================================= */}
          {/* DOMAIN 3 GUIDE */}
          {/* ========================================================================= */}
          {selectedGuideDomain === 3 && (
            <div className="space-y-8">
              {/* Domain 3 Overview & Task Breakdown */}
              <div className="p-6 rounded-2xl bg-[#131722] border border-[#262a35] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                      <span className="material-symbols-outlined text-red-400">settings_suggest</span>
                      <span>
                        {language === 'fr'
                          ? 'Objectifs Officiels du Domaine 3 : Déploiement & Opérations'
                          : 'Official Domain 3 Objectives: Deployment & Operations'}
                      </span>
                    </h3>
                    <p className="text-xs text-[#908fa0] mt-0.5">
                      CompTIA Cloud+ (CV0-004) • 28% of Examination Weight • 5 Critical Sub-objectives (Highest Domain Weight)
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-lg text-xs font-mono-code font-bold bg-red-600/20 text-red-400 border border-red-500/40">
                    28% Exam Weight
                  </span>
                </div>

                {/* Task Tabs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                  {CV0_004_DOMAIN_3_TASKS.map((task) => {
                    const isSelected = selectedTaskId === task.id;
                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all space-y-2 ${
                          isSelected
                            ? 'bg-[#1c202c] border-red-500 shadow-md shadow-red-500/10'
                            : 'bg-[#0f131d] border-[#262a35] hover:border-[#3a3f50]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono-code text-[11px] font-bold text-red-400">
                            {task.weight}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono-code bg-[#0a0e18] text-[#908fa0] border border-[#262a35]">
                            {task.cardRange}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white font-display">{task.title}</h4>
                        <p className="text-xs text-[#c7c4d7] line-clamp-2">{task.subtitle}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Task Details */}
                {(() => {
                  const currentTask = CV0_004_DOMAIN_3_TASKS.find((t) => t.id === selectedTaskId);
                  if (!currentTask) return null;
                  return (
                    <div className="mt-4 p-5 rounded-xl bg-[#0f131d] border border-[#2e3442] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262a35] pb-3">
                        <div>
                          <h4 className="text-base font-bold text-white">{currentTask.title}</h4>
                          <p className="text-xs text-[#908fa0] mt-0.5">{currentTask.subtitle}</p>
                        </div>
                        <button
                          onClick={() => {
                            const cat =
                              currentTask.id === 'task-3-1'
                                ? '3.1 Deployment & Orchestration'
                                : currentTask.id === 'task-3-2'
                                ? '3.2 Maintain & Optimize'
                                : currentTask.id === 'task-3-3'
                                ? '3.3 Backup & Restore'
                                : currentTask.id === 'task-3-4'
                                ? '3.4 Monitoring & Performance'
                                : '3.5 Resource Lifecycle';
                            setSelectedDomain(3);
                            setSelectedCategoryFilter(cat);
                            setActiveView('flashcards');
                            setCurrentCardIndex(0);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono-code text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">play_circle</span>
                          <span>{language === 'fr' ? `Réviser (${currentTask.cardRange})` : `Drill (${currentTask.cardRange})`}</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-mono-code uppercase text-[#908fa0] font-bold">
                          {language === 'fr' ? 'Objectifs Spécifiques de l’Épreuve :' : 'Specific Exam Sub-Objectives :'}
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#dfe2f1]">
                          {currentTask.subObjectives.map((obj, i) => (
                            <li key={i} className="flex items-start gap-2 bg-[#171b26] p-2.5 rounded-lg border border-[#262a35]">
                              <span className="material-symbols-outlined text-red-400 text-[16px] shrink-0 mt-0.5">
                                check_circle
                              </span>
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-[#262a35]">
                        <span className="text-xs font-mono-code uppercase text-amber-400 font-bold flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">psychology</span>
                          <span>{language === 'fr' ? 'Point Clé à Retenir pour l’Examen :' : 'Key Exam Takeaway (CompTIA Core Rules) :'}</span>
                        </span>
                        <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30">
                          <p className="text-xs text-[#f1d7dc] leading-relaxed font-medium">
                            {currentTask.keyExamTakeaway}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Domain 3 Comparison Tables */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-400">table_chart</span>
                  <span>{language === 'fr' ? 'Matrices Comparatives Clés — Domaine 3 (Opérations)' : 'High-Yield Domain 3 Deployment & Operations Comparison Matrices'}</span>
                </h3>

                {/* Table 1: Deployment Strategies */}
                <div className="p-6 rounded-2xl bg-[#131722] border border-[#262a35] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white font-mono-code flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span>
                      <span>1. Cloud & CI/CD Deployment Strategies (Blue/Green vs Canary vs Rolling vs Recreate)</span>
                    </h4>
                    <span className="text-[11px] text-[#908fa0] font-mono-code">CompTIA Objective 3.1</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono-code">
                      <thead>
                        <tr className="border-b border-[#262a35] text-[#908fa0]">
                          <th className="py-2.5 px-3">Evaluation Criteria</th>
                          <th className="py-2.5 px-3 text-cyan-300">Blue/Green</th>
                          <th className="py-2.5 px-3 text-amber-300">Canary</th>
                          <th className="py-2.5 px-3 text-purple-300">Rolling Update</th>
                          <th className="py-2.5 px-3 text-rose-300">Recreate</th>
                          <th className="py-2.5 px-3 text-emerald-300">CompTIA Exam Rule</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e2330]">
                        {DEPLOYMENT_STRATEGIES_COMPTIA_TABLE.map((row, i) => (
                          <tr key={i} className="hover:bg-[#181d2a]">
                            <td className="py-2.5 px-3 font-semibold text-white">{row.criteria}</td>
                            <td className="py-2.5 px-3 text-[#dfe2f1]">{row.col1}</td>
                            <td className="py-2.5 px-3 text-[#dfe2f1]">{row.col2}</td>
                            <td className="py-2.5 px-3 text-[#dfe2f1]">{row.col3}</td>
                            <td className="py-2.5 px-3 text-[#dfe2f1]">{row.col4}</td>
                            <td className="py-2.5 px-3 text-emerald-400">{row.examHighlight}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table 2: IaC vs Config Management */}
                <div className="p-6 rounded-2xl bg-[#131722] border border-[#262a35] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white font-mono-code flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <span>2. Infrastructure as Code & Configuration Management (Terraform vs Ansible vs Puppet vs Custom Scripts)</span>
                    </h4>
                    <span className="text-[11px] text-[#908fa0] font-mono-code">CompTIA Objective 3.1 & 3.2</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono-code">
                      <thead>
                        <tr className="border-b border-[#262a35] text-[#908fa0]">
                          <th className="py-2.5 px-3">Criteria</th>
                          <th className="py-2.5 px-3 text-purple-300">Terraform / CloudFormation</th>
                          <th className="py-2.5 px-3 text-red-300">Ansible</th>
                          <th className="py-2.5 px-3 text-amber-300">Puppet / Chef</th>
                          <th className="py-2.5 px-3 text-blue-300">CLI / Custom Scripts</th>
                          <th className="py-2.5 px-3 text-emerald-300">CompTIA Exam Rule</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e2330]">
                        {IAC_CONFIGURATION_MGMT_COMPTIA_TABLE.map((row, i) => (
                          <tr key={i} className="hover:bg-[#181d2a]">
                            <td className="py-2.5 px-3 font-semibold text-white">{row.criteria}</td>
                            <td className="py-2.5 px-3 text-[#dfe2f1]">{row.col1}</td>
                            <td className="py-2.5 px-3 text-[#dfe2f1]">{row.col2}</td>
                            <td className="py-2.5 px-3 text-[#dfe2f1]">{row.col3}</td>
                            <td className="py-2.5 px-3 text-[#dfe2f1]">{row.col4}</td>
                            <td className="py-2.5 px-3 text-emerald-400">{row.examHighlight}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table 3: Backup Types & Consistency Levels */}
                <div className="p-6 rounded-2xl bg-[#131722] border border-[#262a35] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white font-mono-code flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>3. Cloud Backup Strategies & Consistency Levels (Full vs Incremental vs Differential vs Snapshot)</span>
                    </h4>
                    <span className="text-[11px] text-[#908fa0] font-mono-code">CompTIA Objective 3.3</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono-code">
                      <thead>
                        <tr className="border-b border-[#262a35] text-[#908fa0]">
                          <th className="py-2.5 px-3">Backup Attribute</th>
                          <th className="py-2.5 px-3 text-blue-300">Full Backup</th>
                          <th className="py-2.5 px-3 text-emerald-300">Incremental</th>
                          <th className="py-2.5 px-3 text-amber-300">Differential</th>
                          <th className="py-2.5 px-3 text-purple-300">Storage Snapshot</th>
                          <th className="py-2.5 px-3 text-cyan-300">CompTIA Exam Rule</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e2330]">
                        {BACKUP_TYPES_CONSISTENCY_COMPTIA_TABLE.map((row, i) => (
                          <tr key={i} className="hover:bg-[#181d2a]">
                            <td className="py-2.5 px-3 font-semibold text-white">{row.criteria}</td>
                            <td className="py-2.5 px-3 text-[#dfe2f1]">{row.col1}</td>
                            <td className="py-2.5 px-3 text-[#dfe2f1]">{row.col2}</td>
                            <td className="py-2.5 px-3 text-[#dfe2f1]">{row.col3}</td>
                            <td className="py-2.5 px-3 text-[#dfe2f1]">{row.col4}</td>
                            <td className="py-2.5 px-3 text-emerald-400">{row.examHighlight}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table 4: Observability Pillars */}
                <div className="p-6 rounded-2xl bg-[#131722] border border-[#262a35] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white font-mono-code flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      <span>4. Cloud Telemetry & Observability Architecture (Metrics vs Logs vs Traces vs Synthetics)</span>
                    </h4>
                    <span className="text-[11px] text-[#908fa0] font-mono-code">CompTIA Objective 3.4</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono-code">
                      <thead>
                        <tr className="border-b border-[#262a35] text-[#908fa0]">
                          <th className="py-2.5 px-3">Observability Dimension</th>
                          <th className="py-2.5 px-3 text-amber-300">Metrics</th>
                          <th className="py-2.5 px-3 text-blue-300">Logs</th>
                          <th className="py-2.5 px-3 text-purple-300">Distributed Traces</th>
                          <th className="py-2.5 px-3 text-cyan-300">Synthetic Canaries</th>
                          <th className="py-2.5 px-3 text-emerald-300">CompTIA Exam Rule</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e2330]">
                        {MONITORING_TELEMETRY_PILLARS_TABLE.map((row, i) => (
                          <tr key={i} className="hover:bg-[#181d2a]">
                            <td className="py-2.5 px-3 font-semibold text-white">{row.criteria}</td>
                            <td className="py-2.5 px-3 text-[#dfe2f1]">{row.col1}</td>
                            <td className="py-2.5 px-3 text-[#dfe2f1]">{row.col2}</td>
                            <td className="py-2.5 px-3 text-[#dfe2f1]">{row.col3}</td>
                            <td className="py-2.5 px-3 text-[#dfe2f1]">{row.col4}</td>
                            <td className="py-2.5 px-3 text-emerald-400">{row.examHighlight}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Domain 3 Quick Knowledge Check */}
              <div className="p-6 rounded-2xl bg-[#131722] border border-[#262a35] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <h4 className="text-sm font-bold text-white font-mono-code">
                      {language === 'fr' ? 'Question Pratique Domaine 3 — Opérations & Déploiement' : 'Domain 3 Deployment & Operations Quick Knowledge Check'}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-red-600/20 text-red-400 border border-red-500/30">
                    Exam Simulation • 28% Weight
                  </span>
                </div>

                <p className="text-sm text-white font-medium leading-relaxed">
                  A cloud operations team is preparing to deploy a new version of a critical retail checkout microservice. The organization mandates zero user downtime, testing against 10% of live consumer traffic in production, and an automated rollback if the HTTP 5xx error rate exceeds 0.5% during the first 15 minutes. Which deployment strategy and routing mechanism best satisfy these requirements?
                </p>

                <div className="space-y-2">
                  {[
                    {
                      id: 0,
                      text: 'A. In-place upgrade with scheduled maintenance window and manual VM snapshot reversion.',
                    },
                    {
                      id: 1,
                      text: 'B. Canary deployment utilizing Application Load Balancer weighted target groups and automated metric-alarm triggers.',
                    },
                    {
                      id: 2,
                      text: 'C. Recreate deployment with DNS round-robin record updates across spot instance pools.',
                    },
                    {
                      id: 3,
                      text: 'D. Big bang deployment with blue/green swap executed before health checks pass.',
                    },
                  ].map((opt) => {
                    const isSelected = quickCheckD3Answer === opt.id;
                    const isCorrect = opt.id === 1;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setQuickCheckD3Answer(opt.id);
                          setShowQuickCheckD3Explanation(true);
                        }}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-mono-code transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                              : 'bg-rose-950/40 border-rose-500 text-rose-200'
                            : 'bg-[#0f131d] border-[#262a35] text-[#dfe2f1] hover:bg-[#1a1e2a]'
                        }`}
                      >
                        <span>{opt.text}</span>
                        {isSelected && (
                          <span className="material-symbols-outlined text-[18px]">
                            {isCorrect ? 'check_circle' : 'cancel'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {showQuickCheckD3Explanation && (
                  <div className="p-4 rounded-xl bg-[#0f131d] border border-[#2e3442] space-y-2 animate-in fade-in">
                    <span className="text-xs font-mono-code font-bold text-emerald-400 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                      <span>{language === 'fr' ? 'Explication Officielle CompTIA :' : 'Official CompTIA Explanation :'}</span>
                    </span>
                    <p className="text-xs text-[#c7c4d7] leading-relaxed">
                      <strong>Option B is correct.</strong> A Canary deployment routes a small subset (e.g. 10%) of live production traffic to the new revision via ALB weighted target groups or service mesh weights. When paired with automated metric-alarm triggers (e.g., CloudWatch, Prometheus), any spike in HTTP 5xx errors or latency automatically scales traffic back to 0% with zero downtime. In-place (A) causes downtime, Recreate (C) terminates existing pods before starting new ones causing downtime, and Big bang (D) does not test against a live subset.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DOMAIN 2 GUIDE */}
          {/* ========================================================================= */}
          {selectedGuideDomain === 2 && (
            <div className="space-y-8">
              {/* Domain 2 Overview & Task Breakdown */}
              <div className="p-6 rounded-2xl bg-[#131722] border border-[#262a35] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                      <span className="material-symbols-outlined text-red-400">verified_user</span>
                      <span>
                        {language === 'fr'
                          ? 'Objectifs Officiels du Domaine 2 : Sécurité & Conformité'
                          : 'Official Domain 2 Objectives: Security & Compliance'}
                      </span>
                    </h3>
                    <p className="text-xs text-[#908fa0] mt-0.5">
                      CompTIA Cloud+ (CV0-004) • 25% of Examination Weight • 5 Critical Sub-objectives
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-lg text-xs font-mono-code font-bold bg-red-600/20 text-red-400 border border-red-500/40">
                    25% Exam Weight
                  </span>
                </div>

                {/* Task Tabs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                  {CV0_004_DOMAIN_2_TASKS.map((task) => {
                    const isSelected = selectedTaskId === task.id;
                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all space-y-2 ${
                          isSelected
                            ? 'bg-[#1c202c] border-red-500 shadow-md shadow-red-500/10'
                            : 'bg-[#0f131d] border-[#262a35] hover:border-[#3a3f50]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono-code text-[11px] font-bold text-red-400">
                            {task.weight}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono-code bg-[#0a0e18] text-[#908fa0] border border-[#262a35]">
                            {task.cardRange}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white font-display">{task.title}</h4>
                        <p className="text-xs text-[#c7c4d7] line-clamp-2">{task.subtitle}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Task Details */}
                {(() => {
                  const currentTask = CV0_004_DOMAIN_2_TASKS.find((t) => t.id === selectedTaskId);
                  if (!currentTask) return null;
                  return (
                    <div className="mt-4 p-5 rounded-xl bg-[#0f131d] border border-[#2e3442] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262a35] pb-3">
                        <div>
                          <h4 className="text-base font-bold text-white">{currentTask.title}</h4>
                          <p className="text-xs text-[#908fa0] mt-0.5">{currentTask.subtitle}</p>
                        </div>
                        <button
                          onClick={() => {
                            const cat =
                              currentTask.id === 'task-2-1'
                                ? '2.1 Identity & Access (IAM)'
                                : currentTask.id === 'task-2-2'
                                ? '2.2 Data Protection & Cryptography'
                                : currentTask.id === 'task-2-3'
                                ? '2.3 Cloud Network Security'
                                : currentTask.id === 'task-2-4'
                                ? '2.4 Vulnerability & Workload Hardening'
                                : '2.5 Compliance, Governance & Auditing';
                            setSelectedDomain(2);
                            setSelectedCategoryFilter(cat);
                            setActiveView('flashcards');
                            setCurrentCardIndex(0);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono-code text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">play_circle</span>
                          <span>{language === 'fr' ? `Réviser (${currentTask.cardRange})` : `Drill (${currentTask.cardRange})`}</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-mono-code uppercase text-[#908fa0] font-bold">
                          {language === 'fr' ? 'Objectifs Spécifiques de l’Épreuve :' : 'Specific Exam Sub-Objectives :'}
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#dfe2f1]">
                          {currentTask.subObjectives.map((obj, i) => (
                            <li key={i} className="flex items-start gap-2 bg-[#171b26] p-2.5 rounded-lg border border-[#262a35]">
                              <span className="material-symbols-outlined text-red-400 text-[16px] shrink-0 mt-0.5">
                                check_circle
                              </span>
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Key Takeaway */}
                      <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30">
                        <span className="text-red-400 font-mono-code text-xs font-bold block mb-1">
                          {language === 'fr' ? 'À retenir pour l’examen :' : 'Key Security Takeaway for Exam :'}
                        </span>
                        <p className="text-xs text-[#f1d7dc] leading-relaxed font-medium">
                          {currentTask.keyExamTakeaway}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Domain 2 Comparison Tables */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-400">table_chart</span>
                  <span>{language === 'fr' ? 'Matrices Comparatives Clés — Domaine 2' : 'High-Yield Domain 2 Security Comparison Matrices'}</span>
                </h3>

                {/* Table 1: IAM Access Models */}
                <div className="p-6 rounded-2xl bg-[#131722] border border-[#262a35] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white font-mono-code flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span>
                      <span>1. IAM Access Models (RBAC vs ABAC vs MAC vs DAC)</span>
                    </h4>
                    <span className="text-[11px] text-[#908fa0] font-mono-code">CompTIA Objective 2.1</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono-code">
                      <thead>
                        <tr className="border-b border-[#262a35] text-[#908fa0]">
                          <th className="py-2.5 px-3">Access Model</th>
                          <th className="py-2.5 px-3">Mechanism</th>
                          <th className="py-2.5 px-3">Flexibility</th>
                          <th className="py-2.5 px-3">Overhead</th>
                          <th className="py-2.5 px-3">Best Cloud Use Case</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e2330]">
                        {IAM_ACCESS_MODELS_COMPTIA_TABLE.map((row, i) => (
                          <tr key={i} className="hover:bg-[#181d2a]">
                            <td className="py-2.5 px-3 font-semibold text-white">{row.model}</td>
                            <td className="py-2.5 px-3 text-[#dfe2f1]">{row.mechanism}</td>
                            <td className="py-2.5 px-3 text-amber-400">{row.flexibility}</td>
                            <td className="py-2.5 px-3 text-[#908fa0]">{row.managementOverhead}</td>
                            <td className="py-2.5 px-3 text-emerald-300">{row.bestUseCase}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table 2: Encryption & Key Management */}
                <div className="p-6 rounded-2xl bg-[#131722] border border-[#262a35] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white font-mono-code flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <span>2. Cloud Data Encryption & Key Custodianship (Provider vs KMS vs BYOK vs HYOK)</span>
                    </h4>
                    <span className="text-[11px] text-[#908fa0] font-mono-code">CompTIA Objective 2.2</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono-code">
                      <thead>
                        <tr className="border-b border-[#262a35] text-[#908fa0]">
                          <th className="py-2.5 px-3">Key Model</th>
                          <th className="py-2.5 px-3">Key Custodian</th>
                          <th className="py-2.5 px-3">FIPS Level</th>
                          <th className="py-2.5 px-3">Customer Control</th>
                          <th className="py-2.5 px-3">Ideal Scenario</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e2330]">
                        {ENCRYPTION_KEY_MODELS_COMPTIA_TABLE.map((row, i) => (
                          <tr key={i} className="hover:bg-[#181d2a]">
                            <td className="py-2.5 px-3 font-semibold text-white">{row.model}</td>
                            <td className="py-2.5 px-3 text-amber-400">{row.keyCustodian}</td>
                            <td className="py-2.5 px-3 text-[#4cd7f6]">{row.fipsLevel}</td>
                            <td className="py-2.5 px-3 text-[#dfe2f1]">{row.customerControl}</td>
                            <td className="py-2.5 px-3 text-emerald-300">{row.idealFor}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table 3: Network Security Controls */}
                <div className="p-6 rounded-2xl bg-[#131722] border border-[#262a35] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white font-mono-code flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>3. Cloud Network Firewalls (Security Groups vs NACLs vs WAF vs NGFW)</span>
                    </h4>
                    <span className="text-[11px] text-[#908fa0] font-mono-code">CompTIA Objective 2.3</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono-code">
                      <thead>
                        <tr className="border-b border-[#262a35] text-[#908fa0]">
                          <th className="py-2.5 px-3">Security Control</th>
                          <th className="py-2.5 px-3">OSI Layer</th>
                          <th className="py-2.5 px-3">State Nature</th>
                          <th className="py-2.5 px-3">Bound Scope</th>
                          <th className="py-2.5 px-3">Rule Type & Capabilities</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e2330]">
                        {NETWORK_SECURITY_CONTROLS_COMPTIA_TABLE.map((row, i) => (
                          <tr key={i} className="hover:bg-[#181d2a]">
                            <td className="py-2.5 px-3 font-semibold text-white">{row.control}</td>
                            <td className="py-2.5 px-3 text-amber-400">{row.osiLayer}</td>
                            <td className="py-2.5 px-3 text-[#4cd7f6] font-medium">{row.nature}</td>
                            <td className="py-2.5 px-3 text-[#dfe2f1]">{row.scope}</td>
                            <td className="py-2.5 px-3 text-[#c7c4d7]">{row.ruleType}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table 4: Compliance Frameworks */}
                <div className="p-6 rounded-2xl bg-[#131722] border border-[#262a35] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white font-mono-code flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      <span>4. Regulatory Compliance Frameworks & Attestation Standards</span>
                    </h4>
                    <span className="text-[11px] text-[#908fa0] font-mono-code">CompTIA Objective 2.5</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono-code">
                      <thead>
                        <tr className="border-b border-[#262a35] text-[#908fa0]">
                          <th className="py-2.5 px-3">Framework</th>
                          <th className="py-2.5 px-3">Core Scope</th>
                          <th className="py-2.5 px-3">Target Audience</th>
                          <th className="py-2.5 px-3">Verification & Legal Penalties</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e2330]">
                        {COMPLIANCE_FRAMEWORKS_COMPTIA_TABLE.map((row, i) => (
                          <tr key={i} className="hover:bg-[#181d2a]">
                            <td className="py-2.5 px-3 font-semibold text-white">{row.framework}</td>
                            <td className="py-2.5 px-3 text-[#dfe2f1]">{row.scope}</td>
                            <td className="py-2.5 px-3 text-amber-300">{row.targetAudience}</td>
                            <td className="py-2.5 px-3 text-emerald-300">{row.verification}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Domain 2 Quick Knowledge Check */}
              <div className="p-6 rounded-2xl bg-[#131722] border border-[#262a35] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <h4 className="text-sm font-bold text-white font-mono-code">
                      {language === 'fr'
                        ? 'Question Pratique Domaine 2 — Vérification de Sécurité'
                        : 'Domain 2 Security & Compliance Quick Knowledge Check'}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-red-600/20 text-red-400 border border-red-500/30">
                    CompTIA PBQ Scenario
                  </span>
                </div>

                <p className="text-sm text-white font-medium leading-relaxed">
                  A security engineer is troubleshooting an HTTPS connection failure to virtual instances in a private subnet behind a Network Load Balancer. The Security Group allows inbound TCP port 443 from the load balancer. However, clients report connection timeouts. Upon review, the subnet Network ACL has an inbound rule permitting TCP port 443, but has no explicit outbound rules. Why are the connection responses failing?
                </p>

                <div className="space-y-2">
                  {[
                    {
                      id: 0,
                      text: 'A. Security Groups do not support Layer 4 TLS termination and must be replaced by a WAF.',
                    },
                    {
                      id: 1,
                      text: 'B. Network ACLs are stateless; outbound response traffic leaves on ephemeral ports (1024–65535) and is blocked without an explicit outbound rule.',
                    },
                    {
                      id: 2,
                      text: 'C. Security Groups are stateless and require an explicit outbound rule for port 443 to send replies.',
                    },
                    {
                      id: 3,
                      text: 'D. The instances must be assigned public IPv4 addresses and placed in an Internet Gateway routing table.',
                    },
                  ].map((opt) => {
                    const isSelected = quickCheckD2Answer === opt.id;
                    const isCorrect = opt.id === 1;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setQuickCheckD2Answer(opt.id);
                          setShowQuickCheckD2Explanation(true);
                        }}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-mono-code transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                              : 'bg-rose-950/40 border-rose-500 text-rose-200'
                            : 'bg-[#0f131d] border-[#262a35] text-[#dfe2f1] hover:bg-[#1a1e2a]'
                        }`}
                      >
                        <span>{opt.text}</span>
                        {isSelected && (
                          <span className="material-symbols-outlined text-[18px]">
                            {isCorrect ? 'check_circle' : 'cancel'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {showQuickCheckD2Explanation && (
                  <div className="p-4 rounded-xl bg-[#0f131d] border border-[#2e3442] space-y-2 animate-in fade-in">
                    <span className="text-xs font-mono-code font-bold text-emerald-400 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                      <span>{language === 'fr' ? 'Explication Officielle CompTIA :' : 'Official CompTIA Explanation :'}</span>
                    </span>
                    <p className="text-xs text-[#c7c4d7] leading-relaxed">
                      <strong>Option B is correct.</strong> Unlike Security Groups which are stateful (automatically permitting return traffic regardless of outbound rules), Network ACLs are stateless. When an inbound client request arrives on port 443, the response traffic is sent back on high ephemeral ports (typically 1024–65535). Because Network ACLs evaluate inbound and outbound rules independently, omitting an outbound rule for ephemeral ports results in all response packets being dropped at the subnet boundary.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DOMAIN 1 GUIDE */}
          {/* ========================================================================= */}
          {selectedGuideDomain === 1 && (
            <div className="space-y-8">
              {/* Domain 1 Task Breakdown */}
              <div className="p-6 rounded-2xl bg-[#131722] border border-[#262a35] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                      <span className="material-symbols-outlined text-red-400">cloud</span>
                      <span>
                        {language === 'fr'
                          ? 'Objectifs Officiels du Domaine 1 : Architecture Cloud'
                          : 'Official Domain 1 Objectives: Cloud Architecture'}
                      </span>
                    </h3>
                    <p className="text-xs text-[#908fa0] mt-0.5">
                      CompTIA Cloud+ (CV0-004) • 23% of Examination Weight • 7 Critical Objective Sub-tasks
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-lg text-xs font-mono-code font-bold bg-red-600/20 text-red-400 border border-red-500/40">
                    23% Exam Weight
                  </span>
                </div>

                {/* Task Tabs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                  {CV0_004_DOMAIN_1_TASKS.map((task) => {
                    const isSelected = selectedTaskId === task.id;
                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all space-y-2 ${
                          isSelected
                            ? 'bg-[#1c202c] border-red-500 shadow-md shadow-red-500/10'
                            : 'bg-[#0f131d] border-[#262a35] hover:border-[#3a3f50]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono-code text-[11px] font-bold text-red-400">
                            {task.weight}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono-code bg-[#0a0e18] text-[#908fa0] border border-[#262a35]">
                            {task.cardRange}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white font-display">{task.title}</h4>
                        <p className="text-xs text-[#c7c4d7] line-clamp-2">{task.subtitle}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Task Details */}
                {(() => {
                  const currentTask = CV0_004_DOMAIN_1_TASKS.find((t) => t.id === selectedTaskId);
                  if (!currentTask) return null;
                  return (
                    <div className="mt-4 p-5 rounded-xl bg-[#0f131d] border border-[#2e3442] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262a35] pb-3">
                        <div>
                          <h4 className="text-base font-bold text-white">{currentTask.title}</h4>
                          <p className="text-xs text-[#908fa0] mt-0.5">{currentTask.subtitle}</p>
                        </div>
                        <button
                          onClick={() => {
                            const cat =
                              currentTask.id === 'task-1-1'
                                ? '1.1 Cloud Models'
                                : currentTask.id === 'task-1-2'
                                ? '1.2 Cloud Storage'
                                : currentTask.id === 'task-1-3'
                                ? '1.3 Compute & Virtualization'
                                : currentTask.id === 'task-1-4'
                                ? '1.4 Cloud Networking'
                                : currentTask.id === 'task-1-5'
                                ? '1.5 HA & Disaster Recovery'
                                : currentTask.id === 'task-1-6'
                                ? '1.6 App & DB Architecture'
                                : '1.7 Economics & Sizing';
                            setSelectedDomain(1);
                            setSelectedCategoryFilter(cat);
                            setActiveView('flashcards');
                            setCurrentCardIndex(0);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono-code text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">play_circle</span>
                          <span>{language === 'fr' ? `Réviser (${currentTask.cardRange})` : `Drill (${currentTask.cardRange})`}</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-mono-code uppercase text-[#908fa0] font-bold">
                          {language === 'fr' ? 'Objectifs Spécifiques de l’Épreuve :' : 'Specific Exam Sub-Objectives :'}
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#dfe2f1]">
                          {currentTask.subObjectives.map((obj, i) => (
                            <li key={i} className="flex items-start gap-2 bg-[#171b26] p-2.5 rounded-lg border border-[#262a35]">
                              <span className="material-symbols-outlined text-red-400 text-[16px] shrink-0 mt-0.5">
                                check_circle
                              </span>
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Key Takeaway */}
                      <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30">
                        <span className="text-red-400 font-mono-code text-xs font-bold block mb-1">
                          {language === 'fr' ? 'À retenir pour l’examen :' : 'Key Architecture Takeaway for Exam :'}
                        </span>
                        <p className="text-xs text-[#f1d7dc] leading-relaxed font-medium">
                          {currentTask.keyExamTakeaway}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Domain 1 Comparison Tables */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-400">table_chart</span>
                  <span>{language === 'fr' ? 'Tableaux Comparatifs Stratégiques — Domaine 1' : 'High-Yield Domain 1 Architecture Comparison Matrices'}</span>
                </h3>

                {/* Table 1: Shared Responsibility Model */}
                <div className="p-6 rounded-2xl bg-[#131722] border border-[#262a35] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white font-mono-code flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span>
                      <span>1. Shared Responsibility Model Across Cloud Service Models</span>
                    </h4>
                    <span className="text-[11px] text-[#908fa0] font-mono-code">CompTIA Objective 1.1</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono-code">
                      <thead>
                        <tr className="border-b border-[#262a35] text-[#908fa0]">
                          <th className="py-2.5 px-3">Architecture Layer</th>
                          <th className="py-2.5 px-3">On-Premises</th>
                          <th className="py-2.5 px-3">IaaS</th>
                          <th className="py-2.5 px-3">PaaS</th>
                          <th className="py-2.5 px-3">SaaS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e2330]">
                        {SHARED_RESPONSIBILITY_COMPTIA_TABLE.map((row, i) => (
                          <tr key={i} className="hover:bg-[#181d2a]">
                            <td className="py-2.5 px-3 font-semibold text-white">{row.layer}</td>
                            <td className="py-2.5 px-3 text-red-400">{row.onPremise}</td>
                            <td className="py-2.5 px-3">
                              <span className={row.iaas === 'Customer' ? 'text-amber-400' : 'text-emerald-400'}>
                                {row.iaas}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className={row.paas === 'Customer' ? 'text-amber-400' : 'text-emerald-400'}>
                                {row.paas}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className={row.saas === 'Customer' ? 'text-amber-400' : 'text-emerald-400'}>
                                {row.saas}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table 2: Storage Types Comparison */}
                <div className="p-6 rounded-2xl bg-[#131722] border border-[#262a35] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white font-mono-code flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <span>2. Cloud Storage Technologies (Block vs File vs Object)</span>
                    </h4>
                    <span className="text-[11px] text-[#908fa0] font-mono-code">CompTIA Objective 1.2</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono-code">
                      <thead>
                        <tr className="border-b border-[#262a35] text-[#908fa0]">
                          <th className="py-2.5 px-3">Storage Type</th>
                          <th className="py-2.5 px-3">Namespace Structure</th>
                          <th className="py-2.5 px-3">Protocols</th>
                          <th className="py-2.5 px-3">Latency Profile</th>
                          <th className="py-2.5 px-3">Primary Exam Use Cases</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e2330]">
                        {STORAGE_TYPES_COMPTIA_TABLE.map((row, i) => (
                          <tr key={i} className="hover:bg-[#181d2a]">
                            <td className="py-2.5 px-3 font-semibold text-white">{row.type}</td>
                            <td className="py-2.5 px-3 text-[#dfe2f1]">{row.namespace}</td>
                            <td className="py-2.5 px-3 text-amber-400">{row.protocol}</td>
                            <td className="py-2.5 px-3 text-emerald-400">{row.latency}</td>
                            <td className="py-2.5 px-3 text-[#c7c4d7]">{row.idealUseCases}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table 3: Disaster Recovery Strategies */}
                <div className="p-6 rounded-2xl bg-[#131722] border border-[#262a35] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white font-mono-code flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>3. Disaster Recovery Strategies (RTO vs RPO vs Cost)</span>
                    </h4>
                    <span className="text-[11px] text-[#908fa0] font-mono-code">CompTIA Objective 1.5</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono-code">
                      <thead>
                        <tr className="border-b border-[#262a35] text-[#908fa0]">
                          <th className="py-2.5 px-3">DR Strategy</th>
                          <th className="py-2.5 px-3">Relative Cost</th>
                          <th className="py-2.5 px-3">RTO (Downtime)</th>
                          <th className="py-2.5 px-3">RPO (Data Loss)</th>
                          <th className="py-2.5 px-3">Key Characteristics</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e2330]">
                        {DR_STRATEGIES_COMPTIA_TABLE.map((row, i) => (
                          <tr key={i} className="hover:bg-[#181d2a]">
                            <td className="py-2.5 px-3 font-semibold text-white">{row.strategy}</td>
                            <td className="py-2.5 px-3 text-amber-400 font-bold">{row.cost}</td>
                            <td className="py-2.5 px-3 text-red-400">{row.rto}</td>
                            <td className="py-2.5 px-3 text-emerald-400">{row.rpo}</td>
                            <td className="py-2.5 px-3 text-[#c7c4d7]">{row.characteristics}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Domain 1 Quick Knowledge Check */}
              <div className="p-6 rounded-2xl bg-[#131722] border border-[#262a35] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <h4 className="text-sm font-bold text-white font-mono-code">
                      {language === 'fr' ? 'Question Pratique Domaine 1 — Architecture' : 'Domain 1 Architecture Quick Knowledge Check'}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-red-600/20 text-red-400 border border-red-500/30">
                    Exam Simulation
                  </span>
                </div>

                <p className="text-sm text-white font-medium leading-relaxed">
                  A company is architecting a mission-critical e-commerce application across multiple cloud VPCs. The application database requires synchronous data replication within the primary region, an RTO of under 15 minutes in the event of a regional disaster, and strict isolation preventing lateral network movement between internal microservices. Which combination of architecture choices best meets these requirements?
                </p>

                <div className="space-y-2">
                  {[
                    {
                      id: 0,
                      text: 'A. Single-AZ deployment with cold backup archives, VPC Peering, and Layer 4 load balancing.',
                    },
                    {
                      id: 1,
                      text: 'B. Multi-AZ deployment within the primary region, a Warm Standby DR strategy in a secondary region, and micro-segmentation via security groups.',
                    },
                    {
                      id: 2,
                      text: 'C. Ephemeral instance storage, Pilot Light DR with tape backup restoration, and open default subnet routing.',
                    },
                    {
                      id: 3,
                      text: 'D. Cross-continental synchronous replication on spot instances with an Internet Gateway in the private subnet.',
                    },
                  ].map((opt) => {
                    const isSelected = quickCheckAnswer === opt.id;
                    const isCorrect = opt.id === 1;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setQuickCheckAnswer(opt.id);
                          setShowQuickCheckExplanation(true);
                        }}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-mono-code transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                              : 'bg-rose-950/40 border-rose-500 text-rose-200'
                            : 'bg-[#0f131d] border-[#262a35] text-[#dfe2f1] hover:bg-[#1a1e2a]'
                        }`}
                      >
                        <span>{opt.text}</span>
                        {isSelected && (
                          <span className="material-symbols-outlined text-[18px]">
                            {isCorrect ? 'check_circle' : 'cancel'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {showQuickCheckExplanation && (
                  <div className="p-4 rounded-xl bg-[#0f131d] border border-[#2e3442] space-y-2 animate-in fade-in">
                    <span className="text-xs font-mono-code font-bold text-emerald-400 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                      <span>{language === 'fr' ? 'Explication Officielle CompTIA :' : 'Official CompTIA Explanation :'}</span>
                    </span>
                    <p className="text-xs text-[#c7c4d7] leading-relaxed">
                      <strong>Option B is correct.</strong> Multi-AZ provides synchronous database replication with sub-millisecond latency to survive a single datacenter failure. Warm Standby maintains a scaled-down running environment in the secondary region capable of meeting an RTO under 15 minutes. Micro-segmentation restricts east-west lateral movement between microservices.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CARD GRID SELECTOR (D1, D2, OR ALL) */}
      {/* ========================================================================= */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#131722] border border-[#2e3442] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#262a35] pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  {language === 'fr' ? 'Navigateur Rapide de Cartes — CompTIA CV0-004' : 'Card Jump Navigator — CompTIA CV0-004'}
                </h3>
                <p className="text-xs text-[#908fa0]">
                  {language === 'fr'
                    ? 'Cliquez sur n’importe quel numéro pour charger directement la fiche.'
                    : 'Click any number to jump directly to that flashcard.'}
                </p>
              </div>
              <button
                onClick={() => setShowGridModal(false)}
                className="p-1 rounded-lg text-[#908fa0] hover:text-white hover:bg-[#1c202c] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Domain Tabs */}
            <div className="flex items-center gap-2 font-mono-code text-xs">
              <button
                onClick={() => setGridModalDomainFilter(3)}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  gridModalDomainFilter === 3
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-[#0a0e18] text-[#908fa0] hover:text-white border border-[#262a35]'
                }`}
              >
                Domain 3: Operations (Cards 201–300)
              </button>
              <button
                onClick={() => setGridModalDomainFilter(2)}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  gridModalDomainFilter === 2
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-[#0a0e18] text-[#908fa0] hover:text-white border border-[#262a35]'
                }`}
              >
                Domain 2: Security (Cards 101–200)
              </button>
              <button
                onClick={() => setGridModalDomainFilter(1)}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  gridModalDomainFilter === 1
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-[#0a0e18] text-[#908fa0] hover:text-white border border-[#262a35]'
                }`}
              >
                Domain 1: Architecture (Cards 1–100)
              </button>
              <button
                onClick={() => setGridModalDomainFilter('all')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  gridModalDomainFilter === 'all'
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-[#0a0e18] text-[#908fa0] hover:text-white border border-[#262a35]'
                }`}
              >
                All Cards (1–300)
              </button>
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 font-mono-code text-xs">
              {gridModalCards.map((card) => {
                const isMastered = masteredCardIds.includes(card.id);
                const isReview = reviewCardIds.includes(card.id);
                const isCurrent = currentCard?.id === card.id;

                return (
                  <button
                    key={card.id}
                    onClick={() => {
                      // Ensure the main view domain matches the selected card
                      if (selectedDomain !== 'all' && selectedDomain !== card.domainNumber) {
                        setSelectedDomain(card.domainNumber as 1 | 2 | 3);
                      }

                      // Find index in filtered cards or reset filter
                      const foundIndex = filteredCards.findIndex((c) => c.id === card.id);
                      if (foundIndex !== -1) {
                        setCurrentCardIndex(foundIndex);
                      } else {
                        setSelectedCategoryFilter('all');
                        setSelectedStatusFilter('all');
                        setSearchQuery('');
                        // Calculate index in the active domain cards
                        const activeList =
                          card.domainNumber === 1
                            ? CV0_004_DOMAIN_1_100_FLASHCARDS
                            : card.domainNumber === 2
                            ? CV0_004_DOMAIN_2_100_FLASHCARDS
                            : CV0_004_DOMAIN_3_100_FLASHCARDS;
                        const idx = activeList.findIndex((c) => c.id === card.id);
                        setCurrentCardIndex(idx !== -1 ? idx : 0);
                      }
                      setIsFlipped(false);
                      setShowGridModal(false);
                    }}
                    className={`h-11 rounded-lg flex flex-col items-center justify-center border transition-all cursor-pointer ${
                      isCurrent
                        ? 'ring-2 ring-red-500 scale-105 z-10'
                        : ''
                    } ${
                      isMastered
                        ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/50'
                        : isReview
                        ? 'bg-amber-950/50 border-amber-500/50 text-amber-300 hover:bg-amber-900/50'
                        : 'bg-[#0f131d] border-[#262a35] text-[#dfe2f1] hover:bg-[#1c202c]'
                    }`}
                    title={`Card #${card.id} (D${card.domainNumber}): ${card.topic}`}
                  >
                    <span className="font-bold">#{card.id}</span>
                    <span className="text-[9px] text-[#908fa0] truncate w-full px-1 text-center">
                      {isMastered ? '✓' : isReview ? '★' : `D${card.domainNumber}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#262a35] text-xs font-mono-code">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                  <span>{language === 'fr' ? 'Maîtrisée' : 'Mastered'} ({masteredInActiveDomain})</span>
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
                  <span>{language === 'fr' ? 'À revoir' : 'Review'} ({reviewInActiveDomain})</span>
                </span>
                <span className="flex items-center gap-1.5 text-[#dfe2f1]">
                  <span className="w-2.5 h-2.5 rounded bg-[#1c202c] border border-[#262a35]"></span>
                  <span>{language === 'fr' ? 'Non classée' : 'Unsorted'} ({totalCardsInActiveDomain - masteredInActiveDomain - reviewInActiveDomain})</span>
                </span>
              </div>
              <button
                onClick={() => setShowGridModal(false)}
                className="px-4 py-1.5 rounded-lg bg-[#1c202c] text-white hover:bg-[#262a35] transition-colors cursor-pointer"
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
