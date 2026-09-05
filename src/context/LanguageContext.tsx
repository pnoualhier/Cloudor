import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'fr';

export interface Translations {
  // Brand & Header
  appName: string;
  careerPathways: string;
  studyDashboard: string;
  practiceExamLab: string;
  cheatsheetsPlayground: string;
  clfHub: string;
  searchPlaceholder: string;
  streakText: string;
  notificationsTitle: string;
  newCount: string;
  proMember: string;
  myDashboard: string;
  examSimActive: string;
  tierPro: string;
  renewed: string;

  // Career Pathways
  careerTitle: string;
  careerSubtitle: string;
  curatedTracksCount: string;
  exploreAllTracks: string;
  assessmentButton: string;
  searchTracksPlaceholder: string;
  filterAll: string;
  activeTarget: string;
  startPathway: string;
  prepTime: string;
  difficulty: string;
  certMatrixTitle: string;
  certMatrixSubtitle: string;

  // Dashboard
  targetExam: string;
  daysRemaining: string;
  readinessScore: string;
  primaryDomainMastery: string;
  mockExamAverage: string;
  studyStreak: string;
  handsOnLabs: string;
  officialSyllabus: string;
  launchSandbox: string;
  aiWeaknessRadar: string;
  recommendedDrill: string;
  secondaryTarget: string;
  switchGoal: string;
  officialPrepChecklist: string;
  upcomingMasterclass: string;
  studyGroupFeed: string;

  // Exam Lab
  mockExamTitle: string;
  timeRemaining: string;
  pauseTimer: string;
  resumeTimer: string;
  answeredCount: string;
  markReview: string;
  markedReview: string;
  strikethrough: string;
  previousQuestion: string;
  nextQuestion: string;
  explanationTitle: string;
  showExplanation: string;
  hideExplanation: string;
  quickJump: string;
  architectNotepad: string;
  passThreshold: string;

  // Cheatsheets
  cheatsheetTitle: string;
  cheatsheetSubtitle: string;
  section1Title: string;
  section2Title: string;
  section3Title: string;
  triggerFailover: string;
  failoverActive: string;
  pinnedCards: string;
  batchPin: string;
  unpinAll: string;
  searchCrossCloud: string;

  // Footer
  footerCopyright: string;
  footerTelemetry: string;
}

const translations: Record<Language, Translations> = {
  en: {
    appName: 'Cloudor',
    careerPathways: 'Career Pathways',
    studyDashboard: 'My Study Dashboard',
    practiceExamLab: 'Practice Exam Lab',
    cheatsheetsPlayground: 'Cheatsheets & Playground',
    clfHub: 'AWS CLF-C02 & 100 Flashcards',
    searchPlaceholder: 'Search specs, exams, labs...',
    streakText: '14d streak',
    notificationsTitle: 'Activity Radar',
    newCount: '3 New',
    proMember: 'Pro Member',
    myDashboard: 'My Dashboard',
    examSimActive: 'Exam Simulation #03',
    tierPro: 'Tier: Pro Cloud',
    renewed: 'Renewed',

    careerTitle: 'Certification Career Pathways',
    careerSubtitle: 'Production-engineered roadmaps aligned with official vendor blueprints. Select your target track to activate personalized syllabus tracking and simulation drills.',
    curatedTracksCount: '6 Curated Tracks',
    exploreAllTracks: 'Explore All',
    assessmentButton: 'Skill Assessment (15 Qs)',
    searchTracksPlaceholder: 'Search certifications, roles, skills...',
    filterAll: 'All Providers',
    activeTarget: 'Active Target',
    startPathway: 'Start Pathway',
    prepTime: 'Estimated Duration',
    difficulty: 'Difficulty',
    certMatrixTitle: 'Certification Alignment Matrix',
    certMatrixSubtitle: 'Side-by-side tier comparison across AWS, Azure, GCP, Kubernetes, and vendor-neutral foundational programs.',

    targetExam: 'Target Exam: AWS Solutions Architect Associate (SAA-C03)',
    daysRemaining: 'Days Remaining',
    readinessScore: 'Readiness Score',
    primaryDomainMastery: 'Domain Mastery',
    mockExamAverage: 'Sim Mock Score',
    studyStreak: 'Study Streak',
    handsOnLabs: 'Labs Completed',
    officialSyllabus: 'Official Exam Blueprint & Syllabus',
    launchSandbox: 'Launch AWS Sandbox Lab',
    aiWeaknessRadar: 'AI Weakness Radar & Adaptive Interventions',
    recommendedDrill: 'Recommended Practice Drill',
    secondaryTarget: 'Secondary Target',
    switchGoal: 'Switch Target',
    officialPrepChecklist: 'Official Readiness Checklist',
    upcomingMasterclass: 'Upcoming Live Masterclass',
    studyGroupFeed: 'Live Study Group Feed',

    mockExamTitle: 'AWS SAA-C03 • Full Simulation Mock #03',
    timeRemaining: 'Time Remaining',
    pauseTimer: 'Pause',
    resumeTimer: 'Resume',
    answeredCount: 'Answered',
    markReview: 'Flag for Review',
    markedReview: 'Flagged',
    strikethrough: 'Strikethrough Mode',
    previousQuestion: 'Previous Question',
    nextQuestion: 'Next Question',
    explanationTitle: 'Architecture Deep Dive & Solution Rationale',
    showExplanation: 'Show Architecture Rationale',
    hideExplanation: 'Hide Architecture Rationale',
    quickJump: 'Question Quick Jump',
    architectNotepad: "Architect's Scratchpad",
    passThreshold: 'Passing Threshold: 720 / 1000',

    cheatsheetTitle: 'Multi-Cloud Equivalency & Topology Playground',
    cheatsheetSubtitle: 'Translate architectural patterns seamlessly between AWS, Azure, Google Cloud, and Kubernetes. Inspect real-world 3-tier topologies and test failover mechanics.',
    section1Title: 'SECTION 01: Service Equivalency & Comparison Matrix',
    section2Title: 'SECTION 02: Interactive 3-Tier HA Topology Sandbox',
    section3Title: 'SECTION 03: High-Yield Exam Cram Sheets & Memory Aids',
    triggerFailover: 'Trigger Failover Route',
    failoverActive: 'Failover Active (AZ-1b Master)',
    pinnedCards: 'Pinned Cards',
    batchPin: 'Batch Pin Cards',
    unpinAll: 'Unpin All',
    searchCrossCloud: 'Search cross-cloud services...',

    footerCopyright: 'Cloudor Systems. Open Telemetry Enabled.',
    footerTelemetry: 'Cloudor Telemetry & Webhooks',
  },
  fr: {
    appName: 'Cloudor',
    careerPathways: 'Filières Métiers',
    studyDashboard: "Mon Tableau d'Étude",
    practiceExamLab: "Lab d'Examen Blanc",
    cheatsheetsPlayground: 'Fiches Mémos & Bac à Sable',
    clfHub: 'AWS CLF-C02 & 100 Flashcards',
    searchPlaceholder: 'Rechercher specs, examens, labs...',
    streakText: '14j consécutifs',
    notificationsTitle: "Radar d'Activité",
    newCount: '3 Nouveaux',
    proMember: 'Membre Pro',
    myDashboard: 'Mon Tableau de Bord',
    examSimActive: 'Simulation Examen #03',
    tierPro: 'Niveau : Pro Cloud',
    renewed: 'Renouvelé',

    careerTitle: 'Filières Certifiantes Cloud',
    careerSubtitle: "Parcours d'ingénierie calqués sur les programmes officiels des éditeurs. Sélectionnez votre filière cible pour activer le suivi de syllabus et les simulations adaptatives.",
    curatedTracksCount: '6 Filières Certifiantes',
    exploreAllTracks: 'Tout Explorer',
    assessmentButton: 'Test de Positionnement (15 Qs)',
    searchTracksPlaceholder: 'Rechercher certifications, rôles, compétences...',
    filterAll: 'Tous les Fournisseurs',
    activeTarget: 'Objectif Actif',
    startPathway: 'Commencer la Filière',
    prepTime: 'Durée Estimée',
    difficulty: 'Difficulté',
    certMatrixTitle: 'Matrice Comparative des Certifications',
    certMatrixSubtitle: 'Comparaison par niveaux entre AWS, Azure, GCP, Kubernetes et les fondamentaux agnostiques.',

    targetExam: 'Examen Cible : AWS Solutions Architect Associate (SAA-C03)',
    daysRemaining: 'Jours Restants',
    readinessScore: 'Score de Préparation',
    primaryDomainMastery: 'Maîtrise des Domaines',
    mockExamAverage: 'Moyenne Examens Blancs',
    studyStreak: 'Série Continue',
    handsOnLabs: 'Labs Pratiques Validés',
    officialSyllabus: "Programme Officiel de l'Examen",
    launchSandbox: 'Lancer le Lab Sandbox AWS',
    aiWeaknessRadar: 'Radar IA des Lacunes & Interventions Ciblées',
    recommendedDrill: "Exercice d'Entraînement Recommandé",
    secondaryTarget: 'Objectif Secondaire',
    switchGoal: "Changer d'Objectif",
    officialPrepChecklist: 'Checklist Officielle de Validation',
    upcomingMasterclass: 'Prochaine Masterclass en Direct',
    studyGroupFeed: "Flux du Groupe d'Étude",

    mockExamTitle: 'AWS SAA-C03 • Simulation Complète Examen Blanc #03',
    timeRemaining: 'Temps Restant',
    pauseTimer: 'Pause',
    resumeTimer: 'Reprendre',
    answeredCount: 'Répondues',
    markReview: 'Marquer pour Révision',
    markedReview: 'Marquée',
    strikethrough: 'Mode Radiation (Rayer)',
    previousQuestion: 'Question Précédente',
    nextQuestion: 'Question Suivante',
    explanationTitle: "Analyse Architecturale & Justification de l'Examen",
    showExplanation: "Afficher l'Explication Architecturale",
    hideExplanation: "Masquer l'Explication Architecturale",
    quickJump: 'Accès Rapide aux Questions',
    architectNotepad: "Bloc-notes de l'Architecte",
    passThreshold: 'Seuil de Réussite : 720 / 1000',

    cheatsheetTitle: 'Équivalences Multi-Cloud & Bac à Sable Topologique',
    cheatsheetSubtitle: 'Traduisez facilement les architectures entre AWS, Azure, Google Cloud et Kubernetes. Inspectez des topologies 3-tiers réelles et testez le basculement HA.',
    section1Title: 'SECTION 01 : Matrice de Correspondance des Services',
    section2Title: 'SECTION 02 : Bac à Sable Topologique 3-Tiers HA',
    section3Title: 'SECTION 03 : Fiches Mémos Haute Rentabilité & Mnémotechniques',
    triggerFailover: 'Déclencher le Basculement (Failover)',
    failoverActive: 'Basculement Actif (AZ-1b Maître)',
    pinnedCards: 'Fiches Épinglées',
    batchPin: 'Épingler Toutes les Fiches',
    unpinAll: 'Tout Désépingler',
    searchCrossCloud: 'Rechercher des services multi-cloud...',

    footerCopyright: 'Systèmes Cloudor. Télémesure Ouverte Activée.',
    footerTelemetry: 'Télémesure & Webhooks Cloudor',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('cloudor_lang');
    if (saved === 'fr' || saved === 'en') return saved;
    // Auto-detect browser language if french
    if (typeof navigator !== 'undefined' && navigator.language?.startsWith('fr')) {
      return 'fr';
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('cloudor_lang', lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
