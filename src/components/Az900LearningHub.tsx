import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  AZ900_DOMAIN_1_METADATA,
  AZ900_DOMAIN_1_TASKS,
  SHARED_RESPONSIBILITY_TABLE,
} from '../data/az900Domain1GuideData';
import {
  AZ900_DOMAIN_2_METADATA,
  AZ900_DOMAIN_2_TASKS,
  STORAGE_TIERS_COMPARISON_TABLE,
  STORAGE_REDUNDANCY_COMPARISON_TABLE,
} from '../data/az900Domain2GuideData';
import {
  AZ900_DOMAIN_3_METADATA,
  AZ900_DOMAIN_3_TASKS,
  COST_MANAGEMENT_TOOLS_COMPARISON_TABLE,
  GOVERNANCE_AND_MONITORING_TABLE,
} from '../data/az900Domain3GuideData';
import {
  AZ900_DOMAIN_1_100_FLASHCARDS,
  Az900Flashcard,
} from '../data/az900Domain1FlashcardsData';
import { AZ900_DOMAIN_2_100_FLASHCARDS } from '../data/az900Domain2FlashcardsData';
import { AZ900_DOMAIN_3_100_FLASHCARDS } from '../data/az900Domain3FlashcardsData';

interface Az900LearningHubProps {
  initialMode?: 'guide' | 'flashcards';
  onNavigate?: (tab: string) => void;
}

type Az900Deck = 'domain1_100' | 'domain2_100' | 'domain3_100' | 'all_300';

export const Az900LearningHub: React.FC<Az900LearningHubProps> = ({
  initialMode = 'flashcards',
  onNavigate,
}) => {
  const { language } = useLanguage();

  // Mode: 'flashcards' vs 'guide'
  const [activeView, setActiveView] = useState<'flashcards' | 'guide'>(initialMode);

  // Active Deck: Domain 1 (100 Cards) vs Domain 2 (100 Cards) vs Domain 3 (100 Cards) vs All (300 Cards)
  const [activeDeck, setActiveDeck] = useState<Az900Deck>('domain3_100');

  // Guide active domain: 1 vs 2 vs 3
  const [guideDomain, setGuideDomain] = useState<1 | 2 | 3>(3);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('task-3-1');

  // Flashcards UI state
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'mastered' | 'review'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // LocalStorage persistence for AZ-900 Domain 1 (100 Cards)
  const [masteredD1CardIds, setMasteredD1CardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cloudor_az900_d1_mastered');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviewD1CardIds, setReviewD1CardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cloudor_az900_d1_review');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // LocalStorage persistence for AZ-900 Domain 2 (100 Cards)
  const [masteredD2CardIds, setMasteredD2CardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cloudor_az900_d2_mastered');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviewD2CardIds, setReviewD2CardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cloudor_az900_d2_review');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // LocalStorage persistence for AZ-900 Domain 3 (100 Cards)
  const [masteredD3CardIds, setMasteredD3CardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cloudor_az900_d3_mastered');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviewD3CardIds, setReviewD3CardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cloudor_az900_d3_review');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cloudor_az900_d1_mastered', JSON.stringify(masteredD1CardIds));
    } catch (e) {
      console.error(e);
    }
  }, [masteredD1CardIds]);

  useEffect(() => {
    try {
      localStorage.setItem('cloudor_az900_d1_review', JSON.stringify(reviewD1CardIds));
    } catch (e) {
      console.error(e);
    }
  }, [reviewD1CardIds]);

  useEffect(() => {
    try {
      localStorage.setItem('cloudor_az900_d2_mastered', JSON.stringify(masteredD2CardIds));
    } catch (e) {
      console.error(e);
    }
  }, [masteredD2CardIds]);

  useEffect(() => {
    try {
      localStorage.setItem('cloudor_az900_d2_review', JSON.stringify(reviewD2CardIds));
    } catch (e) {
      console.error(e);
    }
  }, [reviewD2CardIds]);

  useEffect(() => {
    try {
      localStorage.setItem('cloudor_az900_d3_mastered', JSON.stringify(masteredD3CardIds));
    } catch (e) {
      console.error(e);
    }
  }, [masteredD3CardIds]);

  useEffect(() => {
    try {
      localStorage.setItem('cloudor_az900_d3_review', JSON.stringify(reviewD3CardIds));
    } catch (e) {
      console.error(e);
    }
  }, [reviewD3CardIds]);

  // Reset category filter and card index when deck switches
  useEffect(() => {
    setSelectedCategoryFilter('all');
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [activeDeck]);

  // When switching guide domain, set default selected task
  useEffect(() => {
    if (guideDomain === 1) {
      setSelectedTaskId('task-1-1');
    } else if (guideDomain === 2) {
      setSelectedTaskId('task-2-1');
    } else {
      setSelectedTaskId('task-3-1');
    }
  }, [guideDomain]);

  // Raw cards for current active deck
  const currentDeckCards = useMemo(() => {
    if (activeDeck === 'domain1_100') {
      return AZ900_DOMAIN_1_100_FLASHCARDS;
    }
    if (activeDeck === 'domain2_100') {
      return AZ900_DOMAIN_2_100_FLASHCARDS;
    }
    if (activeDeck === 'domain3_100') {
      return AZ900_DOMAIN_3_100_FLASHCARDS;
    }
    // all_300
    return [
      ...AZ900_DOMAIN_1_100_FLASHCARDS,
      ...AZ900_DOMAIN_2_100_FLASHCARDS,
      ...AZ900_DOMAIN_3_100_FLASHCARDS,
    ];
  }, [activeDeck]);

  // Card mastery check helper
  const isCardMastered = useCallback(
    (card: Az900Flashcard) => {
      if (card.domainNumber === 1) {
        return masteredD1CardIds.includes(card.id);
      }
      if (card.domainNumber === 2) {
        return masteredD2CardIds.includes(card.id);
      }
      return masteredD3CardIds.includes(card.id);
    },
    [masteredD1CardIds, masteredD2CardIds, masteredD3CardIds]
  );

  const isCardReview = useCallback(
    (card: Az900Flashcard) => {
      if (card.domainNumber === 1) {
        return reviewD1CardIds.includes(card.id);
      }
      if (card.domainNumber === 2) {
        return reviewD2CardIds.includes(card.id);
      }
      return reviewD3CardIds.includes(card.id);
    },
    [reviewD1CardIds, reviewD2CardIds, reviewD3CardIds]
  );

  // Filtered cards
  const filteredCards = useMemo(() => {
    return currentDeckCards.filter((card) => {
      // Category filter
      if (selectedCategoryFilter !== 'all') {
        if (selectedCategoryFilter === 'domain1' && card.domainNumber !== 1) return false;
        if (selectedCategoryFilter === 'domain2' && card.domainNumber !== 2) return false;
        if (selectedCategoryFilter === 'domain3' && card.domainNumber !== 3) return false;
        if (selectedCategoryFilter === '1.1' && !card.category.startsWith('1.1')) return false;
        if (selectedCategoryFilter === '1.2' && !card.category.startsWith('1.2')) return false;
        if (selectedCategoryFilter === '1.3' && !card.category.startsWith('1.3')) return false;
        if (selectedCategoryFilter === '2.1' && !card.category.startsWith('2.1')) return false;
        if (selectedCategoryFilter === '2.2' && !card.category.startsWith('2.2')) return false;
        if (selectedCategoryFilter === '2.3' && !card.category.startsWith('2.3')) return false;
        if (selectedCategoryFilter === '2.4' && !card.category.startsWith('2.4')) return false;
        if (selectedCategoryFilter === '3.1' && !card.category.startsWith('3.1')) return false;
        if (selectedCategoryFilter === '3.2' && !card.category.startsWith('3.2')) return false;
        if (selectedCategoryFilter === '3.3' && !card.category.startsWith('3.3')) return false;
        if (selectedCategoryFilter === '3.4' && !card.category.startsWith('3.4')) return false;
      }

      // Status filter
      if (selectedStatusFilter === 'mastered' && !isCardMastered(card)) return false;
      if (selectedStatusFilter === 'review' && !isCardReview(card)) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTopic = card.topic.toLowerCase().includes(query);
        const matchesQuestion = card.question.toLowerCase().includes(query);
        const matchesAnswer = card.answer.toLowerCase().includes(query);
        const matchesRule = card.keyRule.toLowerCase().includes(query);
        const matchesCategory = card.category.toLowerCase().includes(query);
        if (!matchesTopic && !matchesQuestion && !matchesAnswer && !matchesRule && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [currentDeckCards, selectedCategoryFilter, selectedStatusFilter, searchQuery, isCardMastered, isCardReview]);

  // Keep index within bounds
  useEffect(() => {
    if (currentCardIndex >= filteredCards.length) {
      setCurrentCardIndex(0);
    }
    setIsFlipped(false);
  }, [filteredCards.length, currentCardIndex]);

  const activeCard: Az900Flashcard | undefined = filteredCards[currentCardIndex];

  // Actions
  const handleToggleFlip = () => setIsFlipped((prev) => !prev);

  const handleNextCard = useCallback(() => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1 < filteredCards.length ? prev + 1 : 0));
  }, [filteredCards.length]);

  const handlePrevCard = useCallback(() => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 >= 0 ? prev - 1 : Math.max(0, filteredCards.length - 1)));
  }, [filteredCards.length]);

  const handleToggleMastered = useCallback(() => {
    if (!activeCard) return;
    if (activeCard.domainNumber === 1) {
      setMasteredD1CardIds((prev) => {
        if (prev.includes(activeCard.id)) {
          return prev.filter((id) => id !== activeCard.id);
        } else {
          setReviewD1CardIds((r) => r.filter((id) => id !== activeCard.id));
          return [...prev, activeCard.id];
        }
      });
    } else if (activeCard.domainNumber === 2) {
      setMasteredD2CardIds((prev) => {
        if (prev.includes(activeCard.id)) {
          return prev.filter((id) => id !== activeCard.id);
        } else {
          setReviewD2CardIds((r) => r.filter((id) => id !== activeCard.id));
          return [...prev, activeCard.id];
        }
      });
    } else {
      setMasteredD3CardIds((prev) => {
        if (prev.includes(activeCard.id)) {
          return prev.filter((id) => id !== activeCard.id);
        } else {
          setReviewD3CardIds((r) => r.filter((id) => id !== activeCard.id));
          return [...prev, activeCard.id];
        }
      });
    }
  }, [activeCard]);

  const handleToggleReview = useCallback(() => {
    if (!activeCard) return;
    if (activeCard.domainNumber === 1) {
      setReviewD1CardIds((prev) => {
        if (prev.includes(activeCard.id)) {
          return prev.filter((id) => id !== activeCard.id);
        } else {
          setMasteredD1CardIds((m) => m.filter((id) => id !== activeCard.id));
          return [...prev, activeCard.id];
        }
      });
    } else if (activeCard.domainNumber === 2) {
      setReviewD2CardIds((prev) => {
        if (prev.includes(activeCard.id)) {
          return prev.filter((id) => id !== activeCard.id);
        } else {
          setMasteredD2CardIds((m) => m.filter((id) => id !== activeCard.id));
          return [...prev, activeCard.id];
        }
      });
    } else {
      setReviewD3CardIds((prev) => {
        if (prev.includes(activeCard.id)) {
          return prev.filter((id) => id !== activeCard.id);
        } else {
          setMasteredD3CardIds((m) => m.filter((id) => id !== activeCard.id));
          return [...prev, activeCard.id];
        }
      });
    }
  }, [activeCard]);

  const handleResetProgress = () => {
    const deckLabel =
      activeDeck === 'domain1_100'
        ? language === 'fr' ? 'Domaine 1 (100 cartes)' : 'Domain 1 (100 cards)'
        : activeDeck === 'domain2_100'
        ? language === 'fr' ? 'Domaine 2 (100 cartes)' : 'Domain 2 (100 cards)'
        : activeDeck === 'domain3_100'
        ? language === 'fr' ? 'Domaine 3 (100 cartes)' : 'Domain 3 (100 cards)'
        : language === 'fr' ? 'l’ensemble des 300 cartes' : 'all 300 cards';

    const confirmMsg =
      language === 'fr'
        ? `Réinitialiser votre progression pour ${deckLabel} ?`
        : `Reset your mastery progress for ${deckLabel}?`;

    if (window.confirm(confirmMsg)) {
      if (activeDeck === 'domain1_100') {
        setMasteredD1CardIds([]);
        setReviewD1CardIds([]);
        localStorage.removeItem('cloudor_az900_d1_mastered');
        localStorage.removeItem('cloudor_az900_d1_review');
      } else if (activeDeck === 'domain2_100') {
        setMasteredD2CardIds([]);
        setReviewD2CardIds([]);
        localStorage.removeItem('cloudor_az900_d2_mastered');
        localStorage.removeItem('cloudor_az900_d2_review');
      } else if (activeDeck === 'domain3_100') {
        setMasteredD3CardIds([]);
        setReviewD3CardIds([]);
        localStorage.removeItem('cloudor_az900_d3_mastered');
        localStorage.removeItem('cloudor_az900_d3_review');
      } else {
        setMasteredD1CardIds([]);
        setReviewD1CardIds([]);
        setMasteredD2CardIds([]);
        setReviewD2CardIds([]);
        setMasteredD3CardIds([]);
        setReviewD3CardIds([]);
        localStorage.removeItem('cloudor_az900_d1_mastered');
        localStorage.removeItem('cloudor_az900_d1_review');
        localStorage.removeItem('cloudor_az900_d2_mastered');
        localStorage.removeItem('cloudor_az900_d2_review');
        localStorage.removeItem('cloudor_az900_d3_mastered');
        localStorage.removeItem('cloudor_az900_d3_review');
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeView !== 'flashcards') return;
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleToggleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextCard();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevCard();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleToggleMastered();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleToggleReview();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView, handleNextCard, handlePrevCard, handleToggleMastered, handleToggleReview]);

  // Statistics for current deck
  const totalDeckCards = currentDeckCards.length;
  const currentDeckMasteredCount = useMemo(() => {
    if (activeDeck === 'domain1_100') return masteredD1CardIds.length;
    if (activeDeck === 'domain2_100') return masteredD2CardIds.length;
    if (activeDeck === 'domain3_100') return masteredD3CardIds.length;
    return masteredD1CardIds.length + masteredD2CardIds.length + masteredD3CardIds.length;
  }, [activeDeck, masteredD1CardIds.length, masteredD2CardIds.length, masteredD3CardIds.length]);

  const currentDeckReviewCount = useMemo(() => {
    if (activeDeck === 'domain1_100') return reviewD1CardIds.length;
    if (activeDeck === 'domain2_100') return reviewD2CardIds.length;
    if (activeDeck === 'domain3_100') return reviewD3CardIds.length;
    return reviewD1CardIds.length + reviewD2CardIds.length + reviewD3CardIds.length;
  }, [activeDeck, reviewD1CardIds.length, reviewD2CardIds.length, reviewD3CardIds.length]);

  const masteredPercent = Math.round((currentDeckMasteredCount / totalDeckCards) * 100);

  // Active guide task data
  const currentGuideTasks =
    guideDomain === 1
      ? AZ900_DOMAIN_1_TASKS
      : guideDomain === 2
      ? AZ900_DOMAIN_2_TASKS
      : AZ900_DOMAIN_3_TASKS;
  const activeTaskData = currentGuideTasks.find((t) => t.id === selectedTaskId) || currentGuideTasks[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Hero */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#0d1e38] via-[#102a4e] to-[#0f131d] border border-[#0078d4]/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0078d4]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md bg-[#0078d4]/20 border border-[#0078d4]/50 text-[#70baff] text-xs font-mono-code font-bold tracking-wider uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0078d4] animate-pulse"></span>
                MICROSOFT AZURE AZ-900
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#262a35] text-[#dfe2f1] text-xs font-mono-code">
                {activeDeck === 'domain1_100'
                  ? language === 'fr' ? 'Pondération D1 : 25–30%' : 'D1 Weight: 25–30%'
                  : activeDeck === 'domain2_100'
                  ? language === 'fr' ? 'Pondération D2 : 35–40%' : 'D2 Weight: 35–40%'
                  : activeDeck === 'domain3_100'
                  ? language === 'fr' ? 'Pondération D3 : 30–35%' : 'D3 Weight: 30–35%'
                  : language === 'fr' ? 'Couverture Examen AZ-900 : 100%' : 'Full AZ-900 Coverage: 100%'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#0078d4]/20 text-[#70baff] text-xs font-mono-code font-bold">
                {activeDeck === 'all_300' ? '300 FLASHCARDS' : '100 FLASHCARDS'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              {activeDeck === 'domain1_100'
                ? language === 'fr'
                  ? 'Microsoft Azure Fundamentals (AZ-900) : 100 Flashcards Domaine 1'
                  : 'Microsoft Azure Fundamentals (AZ-900): 100 Domain 1 Flashcards'
                : activeDeck === 'domain2_100'
                ? language === 'fr'
                  ? 'Microsoft Azure Fundamentals (AZ-900) : 100 Flashcards Domaine 2'
                  : 'Microsoft Azure Fundamentals (AZ-900): 100 Domain 2 Flashcards'
                : activeDeck === 'domain3_100'
                ? language === 'fr'
                  ? 'Microsoft Azure Fundamentals (AZ-900) : 100 Flashcards Domaine 3'
                  : 'Microsoft Azure Fundamentals (AZ-900): 100 Domain 3 Flashcards'
                : language === 'fr'
                ? 'Microsoft Azure Fundamentals (AZ-900) : 300 Flashcards (Domaines 1, 2 & 3)'
                : 'Microsoft Azure Fundamentals (AZ-900): 300 Flashcards (Domains 1, 2 & 3)'}
            </h1>

            <p className="text-sm sm:text-base text-[#c7c4d7] leading-relaxed">
              {activeDeck === 'domain3_100'
                ? language === 'fr'
                  ? "Maîtrisez l'intégralité du Domaine 3 (Gestion et gouvernance d'Azure - 30 à 35% du blueprint) : Facturation, Cost Management, Budgets, TCO, Pricing Calculator, Réservations, Azure Hybrid Benefit, Azure Policy, Verrous de ressources (CanNotDelete vs ReadOnly), Azure Blueprints, Purview, Service Trust Portal, Portal, PowerShell, CLI, Bicep, ARM, Cloud Shell, Azure Arc, Azure Advisor, Azure Monitor, Log Analytics et Azure Service Health."
                  : "Master the entire Domain 3 (Azure management and governance - 30 to 35% of official blueprint): Cost Management, Budgets, Pricing Calculator, TCO, Reserved Instances, Azure Hybrid Benefit, Azure Policy, Resource Locks, Azure Blueprints, Purview, Service Trust Portal, Azure Portal, PowerShell, CLI, Bicep, ARM, Cloud Shell, Azure Arc, Azure Advisor, Azure Monitor, Log Analytics, and Azure Service Health."
                : activeDeck === 'domain2_100'
                ? language === 'fr'
                  ? "Maîtrisez le Domaine 2 (Décrire l'architecture et les services Azure - 35 à 40% du blueprint) : Régions, Zones de Disponibilité, Hiérarchie ARM/Bicep, VMs, VMSS, AVD, Conteneurs (ACI/AKS), Functions, VNets, Bastion, ExpressRoute, Stockage Blob (Chaud/Froid/Archive), Redondance (LRS/ZRS/GRS), Entra ID, RBAC et Sentinel."
                  : "Master Domain 2 (Describe Azure architecture and services - 35 to 40% of official blueprint): Regions, Availability Zones, ARM/Bicep hierarchy, VMs, VMSS, AVD, Containers (ACI/AKS), Functions, VNets, Bastion, ExpressRoute, Blob Storage (Hot/Cool/Archive), Redundancy (LRS/ZRS/GRS), Entra ID, RBAC, and Sentinel."
                : activeDeck === 'domain1_100'
                ? language === 'fr'
                  ? "Maîtrisez l'intégralité du Domaine 1 (Décrire les concepts du cloud - 25 à 30% du blueprint) : Cloud computing, responsabilité partagée, modèles public/privé/hybride, CapEx vs OpEx, HA, scalabilité et matrice IaaS / PaaS / SaaS."
                  : "Master the entire Domain 1 (Describe cloud concepts - 25 to 30% of official blueprint): Cloud computing, shared responsibility model, public/private/hybrid, CapEx vs OpEx, HA, scalability, and IaaS / PaaS / SaaS matrix."
                : language === 'fr'
                ? "Jeu complet de 300 flashcards couvrant 100% de l'examen officiel AZ-900 : concepts du cloud (D1), architecture et services Azure (D2), ainsi que gestion et gouvernance (D3)."
                : "Complete 300-card flashcard set covering 100% of the official AZ-900 blueprint: cloud concepts (D1), Azure architecture & services (D2), and Azure management & governance (D3)."}
            </p>

            <div className="pt-2 flex items-center gap-3 flex-wrap text-xs text-[#908fa0]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#0078d4]">verified</span>
                {language === 'fr' ? 'Score de passage : 700 / 1000' : 'Passing score: 700 / 1000'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#0078d4]">timer</span>
                {language === 'fr' ? 'Durée de l’examen : 45 min (35–45 Qs)' : 'Exam time: 45 min (35–45 Qs)'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#0078d4]">menu_book</span>
                <a
                  href="https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#70baff] hover:underline"
                >
                  {language === 'fr' ? 'Guide officiel Microsoft Learn ↗' : 'Official Microsoft Learn Guide ↗'}
                </a>
              </span>
            </div>
          </div>

          {/* Quick return button */}
          {onNavigate && (
            <button
              onClick={() => onNavigate('career-pathways')}
              className="px-4 py-2 rounded-xl bg-[#171b26] hover:bg-[#262a35] text-[#dfe2f1] text-xs font-mono-code font-bold flex items-center gap-2 border border-[#262a35] transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>{language === 'fr' ? 'Retour aux Filières' : 'Back to Pathways'}</span>
            </button>
          )}
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-5 border-t border-[#0078d4]/20 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
          <div className="sm:col-span-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono-code">
              <span className="text-[#dfe2f1] font-bold">
                {language === 'fr' ? 'Progression du Jeu Actif' : 'Active Deck Mastery Progress'} : {masteredPercent}%
              </span>
              <span className="text-[#908fa0]">
                {currentDeckMasteredCount} / {totalDeckCards} {language === 'fr' ? 'cartes maîtrisées' : 'cards mastered'}
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#171b26] overflow-hidden flex border border-[#262a35]">
              <div
                style={{ width: `${masteredPercent}%` }}
                className="h-full bg-gradient-to-r from-[#0078d4] to-[#50e6ff] transition-all duration-500"
              />
              <div
                style={{ width: `${Math.round((currentDeckReviewCount / totalDeckCards) * 100)}%` }}
                className="h-full bg-[#f59e0b] transition-all duration-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 text-xs font-mono-code">
            <span className="px-2 py-1 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30">
              {currentDeckMasteredCount} {language === 'fr' ? 'Maîtrisées' : 'Mastered'}
            </span>
            <span className="px-2 py-1 rounded bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30">
              {currentDeckReviewCount} {language === 'fr' ? 'À revoir' : 'Review'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Deck & View Selector Bar */}
      <div className="bg-[#171b26] p-3 sm:p-4 rounded-2xl border border-[#262a35] space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Deck Selectors */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-xs font-mono-code text-[#908fa0] uppercase tracking-wider font-bold shrink-0 mr-1">
              {language === 'fr' ? 'JEU DE CARTES :' : 'FLASHCARD DECK:'}
            </span>

            <button
              onClick={() => {
                setActiveDeck('domain1_100');
                setGuideDomain(1);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-mono-code font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeDeck === 'domain1_100'
                  ? 'bg-gradient-to-r from-[#0078d4] to-[#2b88d8] text-white shadow-lg shadow-[#0078d4]/20 ring-1 ring-[#50e6ff]'
                  : 'bg-[#0a0e18] text-[#c7c4d7] hover:bg-[#262a35]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">cloud</span>
              <span>{language === 'fr' ? '100 Cartes D1 (Concepts)' : '100 Cards D1 (Concepts)'}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/40 text-[#70baff] font-mono-code font-bold">
                25–30%
              </span>
            </button>

            <button
              onClick={() => {
                setActiveDeck('domain2_100');
                setGuideDomain(2);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-mono-code font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeDeck === 'domain2_100'
                  ? 'bg-gradient-to-r from-[#0078d4] to-[#2b88d8] text-white shadow-lg shadow-[#0078d4]/20 ring-1 ring-[#50e6ff]'
                  : 'bg-[#0a0e18] text-[#c7c4d7] hover:bg-[#262a35]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">account_tree</span>
              <span>{language === 'fr' ? '100 Cartes D2 (Services & Archi)' : '100 Cards D2 (Architecture & Services)'}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/40 text-[#70baff] font-mono-code font-bold">
                35–40%
              </span>
            </button>

            <button
              onClick={() => {
                setActiveDeck('domain3_100');
                setGuideDomain(3);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-mono-code font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeDeck === 'domain3_100'
                  ? 'bg-gradient-to-r from-[#0078d4] to-[#2b88d8] text-white shadow-lg shadow-[#0078d4]/20 ring-1 ring-[#50e6ff]'
                  : 'bg-[#0a0e18] text-[#c7c4d7] hover:bg-[#262a35]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">gavel</span>
              <span>{language === 'fr' ? '100 Cartes D3 (Gouvernance & Coûts)' : '100 Cards D3 (Governance & Costs)'}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/40 text-[#70baff] font-mono-code font-bold">
                30–35%
              </span>
            </button>

            <button
              onClick={() => {
                setActiveDeck('all_300');
              }}
              className={`px-3 py-2 rounded-xl text-xs font-mono-code font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeDeck === 'all_300'
                  ? 'bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] text-[#0f131d] shadow-lg font-extrabold'
                  : 'bg-[#0a0e18] text-[#c7c4d7] hover:bg-[#262a35]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">layers</span>
              <span>{language === 'fr' ? 'Tous les Domaines (300)' : 'All Domains (300)'}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/30 text-white font-mono-code font-bold">
                100%
              </span>
            </button>
          </div>

          {/* Mode Switcher: Flashcards vs Guide */}
          <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
            <button
              onClick={() => setActiveView('flashcards')}
              className={`px-3 py-2 rounded-xl text-xs font-mono-code font-bold flex items-center gap-1.5 transition-all ${
                activeView === 'flashcards'
                  ? 'bg-[#262a35] text-white border border-[#0078d4]/40 shadow-inner'
                  : 'text-[#908fa0] hover:text-white hover:bg-[#0a0e18]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">style</span>
              <span>{language === 'fr' ? 'Flashcards' : 'Flashcards'}</span>
            </button>

            <button
              onClick={() => setActiveView('guide')}
              className={`px-3 py-2 rounded-xl text-xs font-mono-code font-bold flex items-center gap-1.5 transition-all ${
                activeView === 'guide'
                  ? 'bg-[#262a35] text-white border border-[#0078d4]/40 shadow-inner'
                  : 'text-[#908fa0] hover:text-white hover:bg-[#0a0e18]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              <span>{language === 'fr' ? 'Guide d’Étude & Synthèse' : 'Study Guide & Syllabus'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: INTERACTIVE FLASHCARDS                                            */}
      {/* ========================================================================= */}
      {activeView === 'flashcards' && (
        <div className="space-y-6">
          {/* Sub-Task / Category Filter Tabs */}
          <div className="bg-[#171b26] p-4 rounded-2xl border border-[#262a35] space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-xs font-mono-code text-[#908fa0] font-bold">
                {language === 'fr' ? 'FILTRER PAR SOUS-TÂCHE OFFICIELLE :' : 'FILTER BY OFFICIAL SUB-TASK:'}
              </span>

              {/* Status Filter buttons */}
              <div className="flex items-center gap-1.5 text-xs font-mono-code">
                <button
                  onClick={() => setSelectedStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectedStatusFilter === 'all'
                      ? 'bg-[#262a35] text-white font-bold'
                      : 'text-[#908fa0] hover:bg-[#1c202d]'
                  }`}
                >
                  {language === 'fr' ? 'Toutes' : 'All'}
                </button>
                <button
                  onClick={() => setSelectedStatusFilter('mastered')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectedStatusFilter === 'mastered'
                      ? 'bg-[#10b981]/20 text-[#10b981] font-bold border border-[#10b981]/40'
                      : 'text-[#908fa0] hover:bg-[#1c202d]'
                  }`}
                >
                  {language === 'fr' ? 'Maîtrisées' : 'Mastered'} ({currentDeckMasteredCount})
                </button>
                <button
                  onClick={() => setSelectedStatusFilter('review')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectedStatusFilter === 'review'
                      ? 'bg-[#f59e0b]/20 text-[#f59e0b] font-bold border border-[#f59e0b]/40'
                      : 'text-[#908fa0] hover:bg-[#1c202d]'
                  }`}
                >
                  {language === 'fr' ? 'À revoir' : 'Review'} ({currentDeckReviewCount})
                </button>
              </div>
            </div>

            {/* Category Pill Buttons Adaptive to Deck */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono-code scrollbar-thin">
              <button
                onClick={() => setSelectedCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-[#0078d4] text-white font-bold shadow'
                    : 'bg-[#0a0e18] text-[#c7c4d7] hover:bg-[#262a35]'
                }`}
              >
                {language === 'fr' ? `Toutes les Cartes (${totalDeckCards})` : `All Cards (${totalDeckCards})`}
              </button>

              {/* Domain 1 Filter Pills */}
              {(activeDeck === 'domain1_100' || activeDeck === 'all_300') && (
                <>
                  <button
                    onClick={() => setSelectedCategoryFilter('1.1')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategoryFilter === '1.1'
                        ? 'bg-[#0078d4] text-white font-bold shadow'
                        : 'bg-[#0a0e18] text-[#c7c4d7] hover:bg-[#262a35]'
                    }`}
                    title="1.1 Cloud Computing, Shared Responsibility & Cloud Models"
                  >
                    1.1 : {language === 'fr' ? 'Concepts Cloud & Modèles' : 'Cloud Concepts & Models'} (33)
                  </button>

                  <button
                    onClick={() => setSelectedCategoryFilter('1.2')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategoryFilter === '1.2'
                        ? 'bg-[#0078d4] text-white font-bold shadow'
                        : 'bg-[#0a0e18] text-[#c7c4d7] hover:bg-[#262a35]'
                    }`}
                    title="1.2 Benefits of Cloud Computing (HA, Scalability, Elasticity, Agility, Predictability)"
                  >
                    1.2 : {language === 'fr' ? 'Avantages Cloud & Scalabilité' : 'Cloud Benefits & Scalability'} (33)
                  </button>

                  <button
                    onClick={() => setSelectedCategoryFilter('1.3')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategoryFilter === '1.3'
                        ? 'bg-[#0078d4] text-white font-bold shadow'
                        : 'bg-[#0a0e18] text-[#c7c4d7] hover:bg-[#262a35]'
                    }`}
                    title="1.3 Cloud Service Types (IaaS, PaaS, SaaS & Responsibility Matrix)"
                  >
                    1.3 : {language === 'fr' ? 'Types de Services IaaS/PaaS/SaaS' : 'Service Types IaaS/PaaS/SaaS'} (34)
                  </button>
                </>
              )}

              {/* Domain 2 Filter Pills */}
              {(activeDeck === 'domain2_100' || activeDeck === 'all_300') && (
                <>
                  <button
                    onClick={() => setSelectedCategoryFilter('2.1')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategoryFilter === '2.1'
                        ? 'bg-[#0078d4] text-white font-bold shadow'
                        : 'bg-[#0a0e18] text-[#c7c4d7] hover:bg-[#262a35]'
                    }`}
                    title="2.1 Core Architectural Components (Regions, AZs, Management Groups, ARM, Bicep)"
                  >
                    2.1 : {language === 'fr' ? 'Composants Architecturaux (25)' : 'Core Architecture (25)'}
                  </button>

                  <button
                    onClick={() => setSelectedCategoryFilter('2.2')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategoryFilter === '2.2'
                        ? 'bg-[#0078d4] text-white font-bold shadow'
                        : 'bg-[#0a0e18] text-[#c7c4d7] hover:bg-[#262a35]'
                    }`}
                    title="2.2 Compute and Networking Services (VMs, VMSS, App Service, AVD, Containers, VNets, Bastion, ExpressRoute)"
                  >
                    2.2 : {language === 'fr' ? 'Calcul & Réseau Azure (25)' : 'Compute & Networking (25)'}
                  </button>

                  <button
                    onClick={() => setSelectedCategoryFilter('2.3')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategoryFilter === '2.3'
                        ? 'bg-[#0078d4] text-white font-bold shadow'
                        : 'bg-[#0a0e18] text-[#c7c4d7] hover:bg-[#262a35]'
                    }`}
                    title="2.3 Storage Services (Blobs, Tiers, Files, Queues, Tables, LRS/ZRS/GRS, Data Box)"
                  >
                    2.3 : {language === 'fr' ? 'Stockage Azure & Niveaux (25)' : 'Storage Services & Tiers (25)'}
                  </button>

                  <button
                    onClick={() => setSelectedCategoryFilter('2.4')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategoryFilter === '2.4'
                        ? 'bg-[#0078d4] text-white font-bold shadow'
                        : 'bg-[#0a0e18] text-[#c7c4d7] hover:bg-[#262a35]'
                    }`}
                    title="2.4 Identity, Access and Security (Entra ID, RBAC, Zero Trust, Defender, Sentinel)"
                  >
                    2.4 : {language === 'fr' ? 'Identité & Sécurité (25)' : 'Identity & Security (25)'}
                  </button>
                </>
              )}

              {/* Domain 3 Filter Pills */}
              {(activeDeck === 'domain3_100' || activeDeck === 'all_300') && (
                <>
                  <button
                    onClick={() => setSelectedCategoryFilter('3.1')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategoryFilter === '3.1'
                        ? 'bg-[#0078d4] text-white font-bold shadow'
                        : 'bg-[#0a0e18] text-[#c7c4d7] hover:bg-[#262a35]'
                    }`}
                    title="3.1 Describe Cost Management in Azure (Pricing Calculator, TCO, Budgets, Cost Alerts, Reserved Instances, Hybrid Benefit)"
                  >
                    3.1 : {language === 'fr' ? 'Gestion des Coûts & Facturation (25)' : 'Cost Management & Billing (25)'}
                  </button>

                  <button
                    onClick={() => setSelectedCategoryFilter('3.2')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategoryFilter === '3.2'
                        ? 'bg-[#0078d4] text-white font-bold shadow'
                        : 'bg-[#0a0e18] text-[#c7c4d7] hover:bg-[#262a35]'
                    }`}
                    title="3.2 Describe Features and Tools for Governance and Compliance (Azure Policy, Resource Locks, Service Trust Portal, Purview)"
                  >
                    3.2 : {language === 'fr' ? 'Gouvernance & Conformité (25)' : 'Governance & Compliance (25)'}
                  </button>

                  <button
                    onClick={() => setSelectedCategoryFilter('3.3')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategoryFilter === '3.3'
                        ? 'bg-[#0078d4] text-white font-bold shadow'
                        : 'bg-[#0a0e18] text-[#c7c4d7] hover:bg-[#262a35]'
                    }`}
                    title="3.3 Describe Features and Tools for Managing and Deploying Resources (Portal, Cloud Shell, PowerShell, CLI, ARM, Bicep, Arc)"
                  >
                    3.3 : {language === 'fr' ? 'Déploiement & Gestion des Ressources (25)' : 'Manage & Deploy Resources (25)'}
                  </button>

                  <button
                    onClick={() => setSelectedCategoryFilter('3.4')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategoryFilter === '3.4'
                        ? 'bg-[#0078d4] text-white font-bold shadow'
                        : 'bg-[#0a0e18] text-[#c7c4d7] hover:bg-[#262a35]'
                    }`}
                    title="3.4 Describe Monitoring Tools in Azure (Azure Advisor, Azure Monitor, Log Analytics, Application Insights, Azure Service Health)"
                  >
                    3.4 : {language === 'fr' ? 'Outils de Surveillance & Monitoring (25)' : 'Monitoring Tools (25)'}
                  </button>
                </>
              )}
            </div>

            {/* Search filter */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#908fa0]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'fr'
                    ? 'Rechercher un concept (ex: Availability Zones, Hot tier, GRS, ExpressRoute, Entra ID, RBAC, Sentinel...)'
                    : 'Search concept (e.g. Availability Zones, Hot tier, GRS, ExpressRoute, Entra ID, RBAC, Sentinel...)'
                }
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0a0e18] border border-[#262a35] text-xs font-mono-code text-[#dfe2f1] placeholder-[#908fa0] focus:outline-none focus:border-[#0078d4]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#908fa0] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Flashcard Component */}
          {filteredCards.length > 0 && activeCard ? (
            <div className="space-y-4">
              {/* Card Header Info */}
              <div className="flex items-center justify-between text-xs font-mono-code text-[#908fa0]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#0078d4]/20 text-[#70baff] font-bold border border-[#0078d4]/30">
                    D{activeCard.domainNumber} • CARD #{activeCard.id}
                  </span>
                  <span className="hidden sm:inline">{activeCard.category}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      activeCard.difficulty === 'Foundational'
                        ? 'bg-[#10b981]/20 text-[#10b981]'
                        : activeCard.difficulty === 'Standard'
                        ? 'bg-[#0078d4]/20 text-[#70baff]'
                        : 'bg-[#ff9900]/20 text-[#ffb95f]'
                    }`}
                  >
                    {activeCard.difficulty}
                  </span>
                  <span>
                    {currentCardIndex + 1} / {filteredCards.length}
                  </span>
                </div>
              </div>

              {/* Main Interactive Flip Card */}
              <div
                onClick={handleToggleFlip}
                className={`relative min-h-[340px] sm:min-h-[380px] rounded-2xl p-6 sm:p-8 cursor-pointer transition-all duration-300 border shadow-xl flex flex-col justify-between select-none ${
                  isFlipped
                    ? 'bg-[#111927] border-[#0078d4]/50 shadow-[#0078d4]/10'
                    : 'bg-gradient-to-br from-[#171b26] to-[#121620] border-[#262a35] hover:border-[#0078d4]/50'
                }`}
              >
                {/* Top Badge on Card */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-code font-bold text-[#70baff] uppercase tracking-wider">
                      {activeCard.topic}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCardMastered(activeCard) && (
                      <span className="px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 text-[11px] font-mono-code flex items-center gap-1 font-bold">
                        <span className="material-symbols-outlined text-[13px]">check_circle</span>
                        {language === 'fr' ? 'Maîtrisée' : 'Mastered'}
                      </span>
                    )}

                    {isCardReview(activeCard) && (
                      <span className="px-2 py-0.5 rounded bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40 text-[11px] font-mono-code flex items-center gap-1 font-bold">
                        <span className="material-symbols-outlined text-[13px]">flag</span>
                        {language === 'fr' ? 'À revoir' : 'Review'}
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded bg-[#262a35] text-[#908fa0] text-[10px] font-mono-code">
                      {isFlipped
                        ? language === 'fr'
                          ? 'RÉPONSE'
                          : 'ANSWER'
                        : language === 'fr'
                        ? 'QUESTION'
                        : 'QUESTION'}
                    </span>
                  </div>
                </div>

                {/* Card Content: Question (Front) or Answer (Back) */}
                <div className="my-auto py-6">
                  {!isFlipped ? (
                    <div className="space-y-4 text-center sm:text-left">
                      <p className="text-lg sm:text-xl md:text-2xl font-display font-medium text-white leading-relaxed">
                        {activeCard.question}
                      </p>
                      <p className="text-xs font-mono-code text-[#908fa0] flex items-center justify-center sm:justify-start gap-1">
                        <span className="material-symbols-outlined text-[16px] text-[#0078d4]">touch_app</span>
                        <span>
                          {language === 'fr'
                            ? 'Cliquez ou appuyez sur [Espace] pour révéler la réponse'
                            : 'Click or press [Space] to reveal answer'}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="text-sm sm:text-base text-[#dfe2f1] leading-relaxed whitespace-pre-line">
                        {activeCard.answer}
                      </div>

                      {/* Key Architectural Rule */}
                      <div className="p-3 rounded-xl bg-[#0078d4]/10 border border-[#0078d4]/30 space-y-1">
                        <span className="text-[10px] font-mono-code text-[#70baff] font-bold uppercase tracking-wider flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">lightbulb</span>
                          {language === 'fr' ? 'Règle Clé d’Examen AZ-900 :' : 'Key AZ-900 Exam Rule:'}
                        </span>
                        <p className="text-xs text-[#dfe2f1] leading-relaxed">{activeCard.keyRule}</p>
                      </div>

                      {/* Exam Tip / Trap Alert */}
                      <div className="p-3 rounded-xl bg-[#ff9900]/10 border border-[#ff9900]/30 space-y-1">
                        <span className="text-[10px] font-mono-code text-[#ffb95f] font-bold uppercase tracking-wider flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">warning</span>
                          {language === 'fr' ? 'Piège d’Examen / Conseil Microsoft :' : 'Exam Trap Alert / Microsoft Tip:'}
                        </span>
                        <p className="text-xs text-[#dfe2f1] leading-relaxed">{activeCard.examTip}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Microsoft Learn Link & Instructions */}
                <div className="pt-4 border-t border-[#262a35] flex items-center justify-between flex-wrap gap-2 text-xs font-mono-code text-[#908fa0]">
                  <span className="flex items-center gap-1 text-[11px]">
                    <span className="material-symbols-outlined text-[14px]">keyboard</span>
                    [Espace] Retourner • [← / →] Préc / Suiv • [M] Maîtriser • [R] À revoir
                  </span>

                  <a
                    href={activeCard.officialDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#70baff] hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>Microsoft Learn</span>
                    <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                  </a>
                </div>
              </div>

              {/* Controls Bar: Prev, Next, Mastered, Review */}
              <div className="flex items-center justify-between gap-3 flex-wrap bg-[#171b26] p-3 rounded-2xl border border-[#262a35]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevCard}
                    className="px-4 py-2 rounded-xl bg-[#262a35] hover:bg-[#313540] text-[#dfe2f1] text-xs font-mono-code font-bold flex items-center gap-1.5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    <span>{language === 'fr' ? 'Précédente' : 'Previous'}</span>
                  </button>

                  <button
                    onClick={handleNextCard}
                    className="px-4 py-2 rounded-xl bg-[#0078d4] hover:bg-[#2b88d8] text-white text-xs font-mono-code font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#0078d4]/20"
                  >
                    <span>{language === 'fr' ? 'Suivante' : 'Next'}</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleReview}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono-code font-bold flex items-center gap-1.5 transition-all border ${
                      isCardReview(activeCard)
                        ? 'bg-[#f59e0b] text-[#0f131d] border-[#f59e0b]'
                        : 'bg-[#262a35] hover:bg-[#313540] text-[#f59e0b] border-[#f59e0b]/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">flag</span>
                    <span>
                      {isCardReview(activeCard)
                        ? language === 'fr'
                          ? 'Signalée à revoir [R]'
                          : 'Flagged for Review [R]'
                        : language === 'fr'
                        ? 'Marquer à revoir [R]'
                        : 'Mark for Review [R]'}
                    </span>
                  </button>

                  <button
                    onClick={handleToggleMastered}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono-code font-bold flex items-center gap-1.5 transition-all border ${
                      isCardMastered(activeCard)
                        ? 'bg-[#10b981] text-[#0f131d] border-[#10b981]'
                        : 'bg-[#262a35] hover:bg-[#313540] text-[#10b981] border-[#10b981]/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>
                      {isCardMastered(activeCard)
                        ? language === 'fr'
                          ? 'Maîtrisée [M]'
                          : 'Mastered [M]'
                        : language === 'fr'
                        ? 'Marquer Maîtrisée [M]'
                        : 'Mark as Mastered [M]'}
                    </span>
                  </button>

                  <button
                    onClick={handleResetProgress}
                    className="p-2 rounded-xl text-xs font-mono-code text-[#908fa0] hover:text-[#ffb4ab] hover:bg-[#262a35] transition-colors"
                    title={language === 'fr' ? 'Réinitialiser la progression de ce jeu' : 'Reset progress for this deck'}
                  >
                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                  </button>
                </div>
              </div>

              {/* Quick Jump Grid */}
              <div className="bg-[#171b26] p-4 rounded-2xl border border-[#262a35] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono-code">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#0078d4]">grid_view</span>
                    {language === 'fr'
                      ? `Sélecteur Rapide : ${filteredCards.length} Cartes Disponibles`
                      : `Quick Jump Grid: ${filteredCards.length} Available Cards`}
                  </span>
                  <div className="flex items-center gap-3 text-[11px] text-[#908fa0]">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#0078d4]"></span>
                      {language === 'fr' ? 'Active' : 'Active'}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#10b981]"></span>
                      {language === 'fr' ? 'Maîtrisée' : 'Mastered'}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#f59e0b]"></span>
                      {language === 'fr' ? 'À revoir' : 'Review'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-10 sm:grid-cols-20 gap-1 sm:gap-1.5 max-h-56 overflow-y-auto pr-1">
                  {filteredCards.map((card, idx) => {
                    const isMastered = isCardMastered(card);
                    const isReview = isCardReview(card);
                    const isActive = idx === currentCardIndex;

                    let bgClass = 'bg-[#0a0e18] text-[#908fa0] hover:bg-[#262a35]';
                    if (isActive) {
                      bgClass = 'bg-[#0078d4] text-white font-bold ring-2 ring-[#50e6ff] scale-105';
                    } else if (isMastered) {
                      bgClass = 'bg-[#10b981]/30 text-[#10b981] border border-[#10b981]/50';
                    } else if (isReview) {
                      bgClass = 'bg-[#f59e0b]/30 text-[#f59e0b] border border-[#f59e0b]/50';
                    }

                    return (
                      <button
                        key={`${card.domainNumber}-${card.id}`}
                        onClick={() => {
                          setCurrentCardIndex(idx);
                          setIsFlipped(false);
                        }}
                        className={`h-8 rounded-lg text-[11px] font-mono-code transition-all flex items-center justify-center ${bgClass}`}
                        title={`D${card.domainNumber} #${card.id}: ${card.topic}`}
                      >
                        {card.id}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#171b26] p-12 rounded-2xl border border-[#262a35] text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#908fa0]">filter_alt_off</span>
              <h3 className="text-base font-bold text-white">
                {language === 'fr' ? 'Aucune carte ne correspond aux filtres' : 'No flashcards match filters'}
              </h3>
              <p className="text-xs text-[#908fa0]">
                {language === 'fr'
                  ? 'Essayez de réinitialiser vos filtres ou votre terme de recherche.'
                  : 'Try resetting your category or search term to see more cards.'}
              </p>
              <button
                onClick={() => {
                  setSelectedCategoryFilter('all');
                  setSelectedStatusFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-[#0078d4] text-white text-xs font-mono-code font-bold inline-block"
              >
                {language === 'fr' ? 'Réinitialiser les Filtres' : 'Reset Filters'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: OFFICIAL STUDY GUIDE & BLUEPRINT                                   */}
      {/* ========================================================================= */}
      {activeView === 'guide' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Guide Domain Switcher */}
          <div className="flex items-center gap-2 border-b border-[#262a35] pb-4">
            <button
              onClick={() => setGuideDomain(1)}
              className={`px-4 py-2 rounded-xl text-xs font-mono-code font-bold flex items-center gap-2 transition-all ${
                guideDomain === 1
                  ? 'bg-[#0078d4] text-white shadow-md'
                  : 'bg-[#171b26] text-[#c7c4d7] hover:bg-[#262a35]'
              }`}
            >
              <span>{language === 'fr' ? 'Guide Domaine 1 (Concepts Cloud)' : 'Guide Domain 1 (Cloud Concepts)'}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/40 text-[#70baff]">25–30%</span>
            </button>

            <button
              onClick={() => setGuideDomain(2)}
              className={`px-4 py-2 rounded-xl text-xs font-mono-code font-bold flex items-center gap-2 transition-all ${
                guideDomain === 2
                  ? 'bg-[#0078d4] text-white shadow-md'
                  : 'bg-[#171b26] text-[#c7c4d7] hover:bg-[#262a35]'
              }`}
            >
              <span>{language === 'fr' ? 'Guide Domaine 2 (Architecture & Services)' : 'Guide Domain 2 (Architecture & Services)'}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/40 text-[#70baff]">35–40%</span>
            </button>

            <button
              onClick={() => setGuideDomain(3)}
              className={`px-4 py-2 rounded-xl text-xs font-mono-code font-bold flex items-center gap-2 transition-all ${
                guideDomain === 3
                  ? 'bg-[#0078d4] text-white shadow-md'
                  : 'bg-[#171b26] text-[#c7c4d7] hover:bg-[#262a35]'
              }`}
            >
              <span>{language === 'fr' ? 'Guide Domaine 3 (Gouvernance & Coûts)' : 'Guide Domain 3 (Governance & Costs)'}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/40 text-[#70baff]">30–35%</span>
            </button>
          </div>

          {/* Blueprint Structure Overview */}
          <div className={`grid grid-cols-1 md:grid-cols-${guideDomain === 1 ? '3' : '4'} gap-4`}>
            {currentGuideTasks.map((task) => {
              const isSelected = task.id === selectedTaskId;
              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-[#102a4e]/60 border-[#0078d4] shadow-lg shadow-[#0078d4]/10'
                      : 'bg-[#171b26] border-[#262a35] hover:border-[#0078d4]/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono-code text-[#70baff] font-bold mb-2">
                    <span>{task.weight}</span>
                    {isSelected && <span className="material-symbols-outlined text-[16px]">check_circle</span>}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    {language === 'fr' ? task.titleFr : task.titleEn}
                  </h3>
                  <p className="text-xs text-[#908fa0] line-clamp-2">
                    {language === 'fr' ? task.descriptionFr : task.descriptionEn}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Task Breakdown */}
          <div className="bg-[#171b26] p-6 sm:p-8 rounded-2xl border border-[#262a35] space-y-6">
            <div className="border-b border-[#262a35] pb-4">
              <span className="text-xs font-mono-code text-[#70baff] font-bold uppercase tracking-wider">
                {language === 'fr' ? 'TÂCHE SÉLECTIONNÉE' : 'ACTIVE SUB-TASK'}
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
                {language === 'fr' ? activeTaskData.titleFr : activeTaskData.titleEn}
              </h2>
              <p className="text-xs sm:text-sm text-[#c7c4d7] mt-1">
                {language === 'fr' ? activeTaskData.descriptionFr : activeTaskData.descriptionEn}
              </p>
            </div>

            {/* Key Concepts List */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono-code font-bold text-white uppercase tracking-wider">
                {language === 'fr' ? 'CONCEPTS CLÉS D’EXAMEN' : 'CORE EXAM CONCEPTS'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeTaskData.keyConcepts.map((concept, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#0a0e18] border border-[#262a35] space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-[#dfe2f1]">
                        {language === 'fr' ? concept.nameFr : concept.nameEn}
                      </h4>
                      <p className="text-xs text-[#c7c4d7] leading-relaxed">
                        {language === 'fr' ? concept.summaryFr : concept.summaryEn}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#0078d4]/10 border border-[#0078d4]/30 text-[11px] text-[#70baff]">
                      <span className="font-bold block mb-0.5">
                        {language === 'fr' ? 'Astuce d’Examen :' : 'Exam Tip:'}
                      </span>
                      <span>{language === 'fr' ? concept.examTipFr : concept.examTipEn}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reference Tables */}
          {guideDomain === 1 ? (
            /* Official Shared Responsibility Matrix Table (Domain 1) */
            <div className="bg-[#171b26] p-6 sm:p-8 rounded-2xl border border-[#262a35] space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-mono-code text-[#70baff] font-bold uppercase tracking-wider">
                  {language === 'fr' ? 'MATRICE DE RÉFÉRENCE DOMAINE 1' : 'DOMAIN 1 REFERENCE MATRIX'}
                </span>
                <h3 className="text-lg font-display font-bold text-white">
                  {language === 'fr'
                    ? 'Matrice Officielle de Responsabilité Partagée (Microsoft vs Client)'
                    : 'Official Shared Responsibility Matrix (Microsoft vs. Customer)'}
                </h3>
                <p className="text-xs text-[#908fa0]">
                  {language === 'fr'
                    ? 'Cette matrice génère en moyenne 3 à 5 questions sur chaque session de l’examen AZ-900.'
                    : 'This matrix accounts for an average of 3 to 5 questions on every AZ-900 exam session.'}
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#262a35]">
                <table className="w-full text-left text-xs font-mono-code">
                  <thead className="bg-[#0a0e18] text-[#dfe2f1] border-b border-[#262a35]">
                    <tr>
                      <th className="p-3">
                        {language === 'fr' ? 'Couche Technologique' : 'Architectural Layer'}
                      </th>
                      <th className="p-3">On-Premises</th>
                      <th className="p-3">IaaS (VMs)</th>
                      <th className="p-3">PaaS (App Service / SQL)</th>
                      <th className="p-3">SaaS (M365)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#262a35] bg-[#111622]">
                    {SHARED_RESPONSIBILITY_TABLE.map((row, i) => (
                      <tr key={i} className="hover:bg-[#171b26] transition-colors">
                        <td className="p-3 font-medium text-white">
                          {language === 'fr' ? row.layerFr : row.layerEn}
                        </td>
                        <td className="p-3 text-[#ffb95f] font-bold">{row.onPrem}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.iaas === 'Customer'
                                ? 'bg-[#ff9900]/20 text-[#ffb95f]'
                                : 'bg-[#0078d4]/20 text-[#70baff]'
                            }`}
                          >
                            {row.iaas}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.paas === 'Customer'
                                ? 'bg-[#ff9900]/20 text-[#ffb95f]'
                                : row.paas === 'Shared'
                                ? 'bg-[#8083ff]/20 text-[#c0c1ff]'
                                : 'bg-[#0078d4]/20 text-[#70baff]'
                            }`}
                          >
                            {row.paas}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.saas === 'Customer'
                                ? 'bg-[#ff9900]/20 text-[#ffb95f]'
                                : 'bg-[#0078d4]/20 text-[#70baff]'
                            }`}
                          >
                            {row.saas}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : guideDomain === 2 ? (
            /* Official Storage Tiers & Redundancy Matrices (Domain 2) */
            <div className="space-y-6">
              {/* Storage Access Tiers Table */}
              <div className="bg-[#171b26] p-6 sm:p-8 rounded-2xl border border-[#262a35] space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono-code text-[#70baff] font-bold uppercase tracking-wider">
                    {language === 'fr' ? 'RÉFÉRENCE STOCKAGE BLOB D2' : 'D2 BLOB STORAGE REFERENCE'}
                  </span>
                  <h3 className="text-lg font-display font-bold text-white">
                    {language === 'fr'
                      ? 'Comparatif des Niveaux d’Accès du Stockage Blob (Chaud, Froid, Très Froid, Archive)'
                      : 'Blob Storage Access Tiers Comparison (Hot, Cool, Cold, Archive)'}
                  </h3>
                  <p className="text-xs text-[#908fa0]">
                    {language === 'fr'
                      ? 'Niveaux d’accès, latence, durée de rétention minimale et profil de coût.'
                      : 'Access tiers, latency, minimum retention periods, and cost trade-offs.'}
                  </p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#262a35]">
                  <table className="w-full text-left text-xs font-mono-code">
                    <thead className="bg-[#0a0e18] text-[#dfe2f1] border-b border-[#262a35]">
                      <tr>
                        <th className="p-3">{language === 'fr' ? 'Niveau' : 'Tier'}</th>
                        <th className="p-3">{language === 'fr' ? 'Fréquence d’Accès' : 'Access Frequency'}</th>
                        <th className="p-3">{language === 'fr' ? 'Rétention Minimale' : 'Min Retention'}</th>
                        <th className="p-3">{language === 'fr' ? 'Latence de Récupération' : 'Retrieval Latency'}</th>
                        <th className="p-3">{language === 'fr' ? 'Coût Stockage' : 'Storage Cost'}</th>
                        <th className="p-3">{language === 'fr' ? 'Coût Accès' : 'Access Cost'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262a35] bg-[#111622]">
                      {STORAGE_TIERS_COMPARISON_TABLE.map((row, i) => (
                        <tr key={i} className="hover:bg-[#171b26] transition-colors">
                          <td className="p-3 font-bold text-white">
                            <span className="px-2 py-0.5 rounded bg-[#0078d4]/20 text-[#70baff] border border-[#0078d4]/30">
                              {language === 'fr' ? row.nameFr : row.tier}
                            </span>
                          </td>
                          <td className="p-3 text-[#dfe2f1]">{language === 'fr' ? row.accessFreqFr : row.accessFreqEn}</td>
                          <td className="p-3 text-[#ffb95f] font-bold">{row.minRetention}</td>
                          <td className="p-3 text-[#dfe2f1]">{language === 'fr' ? row.latencyFr : row.latencyEn}</td>
                          <td className="p-3 font-bold text-[#c0c1ff]">{row.storageCost}</td>
                          <td className="p-3 font-bold text-[#ffb95f]">{row.accessCost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Storage Redundancy Options Table */}
              <div className="bg-[#171b26] p-6 sm:p-8 rounded-2xl border border-[#262a35] space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono-code text-[#70baff] font-bold uppercase tracking-wider">
                    {language === 'fr' ? 'RÉFÉRENCE REDONDANCE STOCKAGE D2' : 'D2 STORAGE REDUNDANCY REFERENCE'}
                  </span>
                  <h3 className="text-lg font-display font-bold text-white">
                    {language === 'fr'
                      ? 'Options de Réplication et Résilience du Stockage Azure (LRS, ZRS, GRS, GZRS)'
                      : 'Azure Storage Replication & Resilience Options (LRS, ZRS, GRS, GZRS)'}
                  </h3>
                  <p className="text-xs text-[#908fa0]">
                    {language === 'fr'
                      ? 'Nombre de copies, répartition géographique, durabilité et types de sinistres couverts.'
                      : 'Data copies, geographic dispersion, durability ratings, and disaster tolerance.'}
                  </p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#262a35]">
                  <table className="w-full text-left text-xs font-mono-code">
                    <thead className="bg-[#0a0e18] text-[#dfe2f1] border-b border-[#262a35]">
                      <tr>
                        <th className="p-3">{language === 'fr' ? 'Option' : 'Code'}</th>
                        <th className="p-3">{language === 'fr' ? 'Nom' : 'Name'}</th>
                        <th className="p-3">{language === 'fr' ? 'Copies' : 'Copies'}</th>
                        <th className="p-3">{language === 'fr' ? 'Emplacements Physiques' : 'Physical Locations'}</th>
                        <th className="p-3">{language === 'fr' ? 'Durabilité Annuelle' : 'Yearly Durability'}</th>
                        <th className="p-3">{language === 'fr' ? 'Tolérance aux Pannes' : 'Fault Tolerance'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262a35] bg-[#111622]">
                      {STORAGE_REDUNDANCY_COMPARISON_TABLE.map((row, i) => (
                        <tr key={i} className="hover:bg-[#171b26] transition-colors">
                          <td className="p-3 font-bold text-white">
                            <span className="px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40">
                              {row.code}
                            </span>
                          </td>
                          <td className="p-3 text-white font-medium">{language === 'fr' ? row.nameFr : row.nameEn}</td>
                          <td className="p-3 font-bold text-[#ffb95f]">{row.copies}</td>
                          <td className="p-3 text-[#dfe2f1]">{language === 'fr' ? row.locationsFr : row.locationsEn}</td>
                          <td className="p-3 text-[#70baff] font-bold">{row.durability}</td>
                          <td className="p-3 text-[#dfe2f1]">{language === 'fr' ? row.resilienceFr : row.resilienceEn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* Official Cost Tools & Governance Matrices (Domain 3) */
            <div className="space-y-6">
              {/* Cost Management Tools Table */}
              <div className="bg-[#171b26] p-6 sm:p-8 rounded-2xl border border-[#262a35] space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono-code text-[#70baff] font-bold uppercase tracking-wider">
                    {language === 'fr' ? 'RÉFÉRENCE OUTILS DE COÛT D3' : 'D3 COST MANAGEMENT TOOLS REFERENCE'}
                  </span>
                  <h3 className="text-lg font-display font-bold text-white">
                    {language === 'fr'
                      ? 'Comparatif des Outils de Coût Azure (Pricing Calculator vs TCO vs Cost Management vs Advisor)'
                      : 'Azure Cost Management Tools Comparison (Pricing Calculator vs TCO vs Cost Management vs Advisor)'}
                  </h3>
                  <p className="text-xs text-[#908fa0]">
                    {language === 'fr'
                      ? 'Objectifs, types d’entrées, utilisateurs cibles et pièges fréquents à l’examen AZ-900.'
                      : 'Primary objectives, input criteria, target audiences, and classic AZ-900 exam traps.'}
                  </p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#262a35]">
                  <table className="w-full text-left text-xs font-mono-code">
                    <thead className="bg-[#0a0e18] text-[#dfe2f1] border-b border-[#262a35]">
                      <tr>
                        <th className="p-3">{language === 'fr' ? 'Outil' : 'Tool'}</th>
                        <th className="p-3">{language === 'fr' ? 'Objectif Principal' : 'Primary Purpose'}</th>
                        <th className="p-3">{language === 'fr' ? 'Données d’Entrée' : 'Required Inputs'}</th>
                        <th className="p-3">{language === 'fr' ? 'Public Cible' : 'Target Audience'}</th>
                        <th className="p-3">{language === 'fr' ? 'Piège d’Examen' : 'Key Exam Trap'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262a35] bg-[#111622]">
                      {COST_MANAGEMENT_TOOLS_COMPARISON_TABLE.map((row, i) => (
                        <tr key={i} className="hover:bg-[#171b26] transition-colors">
                          <td className="p-3 font-bold text-white">
                            <span className="px-2 py-0.5 rounded bg-[#0078d4]/20 text-[#70baff] border border-[#0078d4]/30">
                              {language === 'fr' ? row.toolFr : row.toolEn}
                            </span>
                          </td>
                          <td className="p-3 text-[#dfe2f1]">{language === 'fr' ? row.purposeFr : row.purposeEn}</td>
                          <td className="p-3 text-[#ffb95f]">{language === 'fr' ? row.inputFr : row.inputEn}</td>
                          <td className="p-3 text-[#c0c1ff]">{language === 'fr' ? row.primaryAudienceFr : row.primaryAudienceEn}</td>
                          <td className="p-3 text-[#10b981]">{language === 'fr' ? row.keyExamTrapFr : row.keyExamTrapEn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Governance and Monitoring Matrix */}
              <div className="bg-[#171b26] p-6 sm:p-8 rounded-2xl border border-[#262a35] space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono-code text-[#70baff] font-bold uppercase tracking-wider">
                    {language === 'fr' ? 'RÉFÉRENCE GOUVERNANCE ET OBSERVABILITÉ D3' : 'D3 GOVERNANCE & OBSERVABILITY REFERENCE'}
                  </span>
                  <h3 className="text-lg font-display font-bold text-white">
                    {language === 'fr'
                      ? 'Comparatif Stratégique de Gouvernance et Contrôle (Azure Policy, Verrous, RBAC, Purview, Monitor)'
                      : 'Strategic Governance & Compliance Matrix (Azure Policy, Locks, RBAC, Purview, Monitor)'}
                  </h3>
                  <p className="text-xs text-[#908fa0]">
                    {language === 'fr'
                      ? 'Différences cruciales entre autorisation d’action (RBAC), conformité de ressource (Policy) et protection contre suppression (Verrous).'
                      : 'Crucial distinctions between user permissions (RBAC), resource compliance (Policy), and deletion protection (Locks).'}
                  </p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#262a35]">
                  <table className="w-full text-left text-xs font-mono-code">
                    <thead className="bg-[#0a0e18] text-[#dfe2f1] border-b border-[#262a35]">
                      <tr>
                        <th className="p-3">{language === 'fr' ? 'Outil' : 'Tool'}</th>
                        <th className="p-3">{language === 'fr' ? 'Périmètre & Foyer' : 'Focus Area'}</th>
                        <th className="p-3">{language === 'fr' ? 'Mécanisme d’Action' : 'Mechanism'}</th>
                        <th className="p-3">{language === 'fr' ? 'Cas d’Usage Classique' : 'Classic Use Cases'}</th>
                        <th className="p-3">{language === 'fr' ? 'Gestion des Exceptions' : 'Override Rules'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262a35] bg-[#111622]">
                      {GOVERNANCE_AND_MONITORING_TABLE.map((row, i) => (
                        <tr key={i} className="hover:bg-[#171b26] transition-colors">
                          <td className="p-3 font-bold text-white">
                            <span className="px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40">
                              {language === 'fr' ? row.toolFr : row.toolEn}
                            </span>
                          </td>
                          <td className="p-3 text-white font-medium">{language === 'fr' ? row.focusFr : row.focusEn}</td>
                          <td className="p-3 text-[#dfe2f1]">{language === 'fr' ? row.mechanismFr : row.mechanismEn}</td>
                          <td className="p-3 text-[#70baff]">{language === 'fr' ? row.commonUseCasesFr : row.commonUseCasesEn}</td>
                          <td className="p-3 text-[#ffb95f]">{language === 'fr' ? row.overriddenByFr : row.overriddenByEn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
