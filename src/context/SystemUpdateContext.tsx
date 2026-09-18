import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLanguage } from './LanguageContext';

export type UpdateStatus = 'idle' | 'checking' | 'downloading' | 'ready' | 'up-to-date' | 'error';

export interface VersionInfo {
  version: string;
  releaseDate: string;
  releaseDateFr: string;
  buildCommit: string;
  channel: 'production' | 'beta';
  size: string;
  changelog: string[];
  changelogFr: string[];
}

export interface SystemUpdateContextType {
  // Version & Release info
  currentVersion: string;
  releaseDate: string;
  buildCommit: string;
  channel: 'production' | 'beta';
  
  // Update state
  status: UpdateStatus;
  lastChecked: Date | null;
  lastCheckedFormatted: string;
  pendingUpdate: VersionInfo | null;
  downloadProgress: number;
  statusMessage: string;
  
  // Background configuration
  automaticUpdatesEnabled: boolean;
  setAutomaticUpdatesEnabled: (enabled: boolean) => void;
  checkIntervalMinutes: number;
  setCheckIntervalMinutes: (minutes: number) => void;
  nextCheckSecondsRemaining: number;
  
  // Actions
  checkForUpdates: (manual?: boolean) => Promise<void>;
  forceUpdate: () => Promise<void>;
  applyUpdate: () => void;
  dismissUpdateToast: () => void;
  showUpdateToast: boolean;
  
  // UI controls
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  simulateNewVersionAvailable: () => void;
  clearCacheAndRefresh: () => Promise<void>;
}

const STORAGE_KEYS = {
  CURRENT_VERSION: 'cloudor_sys_version',
  RELEASE_DATE: 'cloudor_sys_release_date',
  LAST_CHECKED: 'cloudor_sys_last_checked',
  AUTO_UPDATES: 'cloudor_sys_auto_updates',
  INTERVAL: 'cloudor_sys_interval',
  PENDING_UPDATE: 'cloudor_sys_pending_update',
};

// Initial base release
const BASE_VERSION: VersionInfo = {
  version: 'v2.4.2',
  releaseDate: 'September 8, 2026 • 07:30 UTC',
  releaseDateFr: '8 septembre 2026 • 07:30 UTC',
  buildCommit: '8a49c2e',
  channel: 'production',
  size: '14.8 MB',
  changelog: [
    'Complete AWS CLF-C02 450-card curriculum with full 400 deck view & exam simulation',
    'Microsoft Azure AZ-900 300-card multi-domain curriculum and study syllabus',
    'Interactive 3-tier multi-cloud topology sandbox with real-time failover simulator',
    'OpenTelemetry and background asset preloading performance enhancements',
  ],
  changelogFr: [
    'Suite complète AWS CLF-C02 de 450 flashcards avec sélecteur 400 cartes et examen blanc',
    'Programme Microsoft Azure AZ-900 de 300 flashcards multi-domaines et syllabus officiel',
    'Bac à sable topologique 3-tiers multi-cloud avec simulateur de basculement HA en direct',
    'Télémesure OpenTelemetry et préchargement d’actifs en tâche de fond optimisés',
  ],
};

// Next upcoming release prepared during background check
const UPCOMING_VERSION: VersionInfo = {
  version: 'v2.4.3',
  releaseDate: 'September 8, 2026 • 07:45 UTC',
  releaseDateFr: '8 septembre 2026 • 07:45 UTC',
  buildCommit: '9e3bf14',
  channel: 'production',
  size: '16.2 MB',
  changelog: [
    'Automatic background update engine with periodic integrity verification',
    'High-efficiency offline cache synchronizer with force update flush capabilities',
    'Enhanced bilingual quick-search indexing for multi-cloud exam cram sheets',
    'Low-latency domain mastery tracking with zero-downtime client migrations',
  ],
  changelogFr: [
    'Moteur de mises à jour automatiques en arrière-plan avec vérification périodique',
    'Synchroniseur de cache hors-ligne haute efficacité avec purge forcée',
    'Indexation de recherche rapide bilingue améliorée pour les fiches mémos multi-cloud',
    'Suivi de maîtrise des domaines à très faible latence avec migration client sans interruption',
  ],
};

const SystemUpdateContext = createContext<SystemUpdateContextType | undefined>(undefined);

export const SystemUpdateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();

  const [currentVersion, setCurrentVersion] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_VERSION) || BASE_VERSION.version;
  });

  const [releaseDate, setReleaseDate] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.RELEASE_DATE) || BASE_VERSION.releaseDate;
  });

  const [buildCommit, setBuildCommit] = useState<string>(BASE_VERSION.buildCommit);
  const [channel] = useState<'production' | 'beta'>(BASE_VERSION.channel);

  const [lastChecked, setLastChecked] = useState<Date | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LAST_CHECKED);
    if (saved) {
      const parsed = new Date(saved);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    }
    return new Date();
  });

  const [status, setStatus] = useState<UpdateStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [showUpdateToast, setShowUpdateToast] = useState<boolean>(false);

  const [pendingUpdate, setPendingUpdate] = useState<VersionInfo | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PENDING_UPDATE);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [automaticUpdatesEnabled, setAutoUpdates] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTO_UPDATES);
    return saved !== null ? saved === 'true' : true; // default true
  });

  const [checkIntervalMinutes, setCheckInterval] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INTERVAL);
    return saved ? parseInt(saved, 10) || 5 : 5; // default 5 minutes
  });

  const [nextCheckSecondsRemaining, setNextCheckSecondsRemaining] = useState<number>(
    checkIntervalMinutes * 60
  );

  const setAutomaticUpdatesEnabled = (enabled: boolean) => {
    setAutoUpdates(enabled);
    localStorage.setItem(STORAGE_KEYS.AUTO_UPDATES, String(enabled));
    if (enabled) {
      setNextCheckSecondsRemaining(checkIntervalMinutes * 60);
    }
  };

  const setCheckIntervalMinutes = (minutes: number) => {
    setCheckInterval(minutes);
    localStorage.setItem(STORAGE_KEYS.INTERVAL, String(minutes));
    setNextCheckSecondsRemaining(minutes * 60);
  };

  // Format the last checked date
  const formatLastChecked = useCallback((date: Date | null, lang: 'en' | 'fr'): string => {
    if (!date) return lang === 'fr' ? 'Jamais vérifié' : 'Never checked';
    
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 20) {
      return lang === 'fr' ? "À l'instant" : 'Just now';
    }
    if (diffSeconds < 60) {
      return lang === 'fr' ? `Il y a ${diffSeconds}s` : `${diffSeconds}s ago`;
    }
    if (diffSeconds < 3600) {
      const mins = Math.floor(diffSeconds / 60);
      return lang === 'fr' ? `Il y a ${mins} min` : `${mins} min ago`;
    }

    return date.toLocaleTimeString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, []);

  const [lastCheckedFormatted, setLastCheckedFormatted] = useState<string>('Just now');

  useEffect(() => {
    setLastCheckedFormatted(formatLastChecked(lastChecked, language));
    const timer = setInterval(() => {
      setLastCheckedFormatted(formatLastChecked(lastChecked, language));
    }, 15000);
    return () => clearInterval(timer);
  }, [lastChecked, language, formatLastChecked]);

  // Core update check implementation
  const checkForUpdates = useCallback(async (manual = false) => {
    if (status === 'checking' || status === 'downloading') return;

    setStatus('checking');
    setStatusMessage(
      language === 'fr'
        ? 'Connexion au serveur de distribution Cloudor & vérification des signatures...'
        : 'Connecting to Cloudor distribution servers & verifying signatures...'
    );

    // Simulate realistic network roundtrip to check manifest
    await new Promise((resolve) => setTimeout(resolve, manual ? 1200 : 800));

    const checkTime = new Date();
    setLastChecked(checkTime);
    localStorage.setItem(STORAGE_KEYS.LAST_CHECKED, checkTime.toISOString());
    setNextCheckSecondsRemaining(checkIntervalMinutes * 60);

    // If current version is still BASE_VERSION, prepare UPCOMING_VERSION
    if (currentVersion === BASE_VERSION.version) {
      setStatus('downloading');
      setStatusMessage(
        language === 'fr'
          ? `Nouvelle version détectée (${UPCOMING_VERSION.version}). Téléchargement et préparation en arrière-plan...`
          : `New version detected (${UPCOMING_VERSION.version}). Downloading and preparing in background...`
      );

      // Simulate incremental background package download
      for (let p = 15; p <= 100; p += 25) {
        await new Promise((r) => setTimeout(r, manual ? 300 : 400));
        setDownloadProgress(p);
      }

      setPendingUpdate(UPCOMING_VERSION);
      localStorage.setItem(STORAGE_KEYS.PENDING_UPDATE, JSON.stringify(UPCOMING_VERSION));
      setStatus('ready');
      setStatusMessage(
        language === 'fr'
          ? `Mise à jour ${UPCOMING_VERSION.version} prête. Préparée en arrière-plan avec succès.`
          : `Update ${UPCOMING_VERSION.version} ready. Successfully prepared in background.`
      );
      setShowUpdateToast(true);
    } else {
      // Already running latest version
      setStatus('up-to-date');
      setStatusMessage(
        language === 'fr'
          ? 'Cloudor est à jour. Vous disposez de la dernière version de production.'
          : 'Cloudor is up to date. You are running the latest production build.'
      );
      // Auto clear message after 4s
      setTimeout(() => {
        setStatus((s) => (s === 'up-to-date' ? 'idle' : s));
      }, 4000);
    }
  }, [status, currentVersion, language, checkIntervalMinutes]);

  // Force Update function: flushes all caches, invalidates stale resources, prepares the newest version immediately
  const forceUpdate = useCallback(async () => {
    setStatus('checking');
    setStatusMessage(
      language === 'fr'
        ? 'Purge forcée des caches, réinitialisation des artefacts et synchronisation...'
        : 'Forcing cache purge, resetting local artifacts, and synchronizing latest build...'
    );

    try {
      // Attempt browser cache storage purge if available
      if (typeof window !== 'undefined' && 'caches' in window) {
        const cacheKeys = await window.caches.keys();
        await Promise.all(cacheKeys.map((key) => window.caches.delete(key)));
      }
    } catch {
      // Non-blocking in sandboxed environments
    }

    // Simulate aggressive fetch of latest assets
    setStatus('downloading');
    for (let p = 20; p <= 100; p += 20) {
      await new Promise((r) => setTimeout(r, 200));
      setDownloadProgress(p);
    }

    const checkTime = new Date();
    setLastChecked(checkTime);
    localStorage.setItem(STORAGE_KEYS.LAST_CHECKED, checkTime.toISOString());

    // Update version directly to UPCOMING_VERSION or refresh current
    const targetVersion = UPCOMING_VERSION.version;
    const targetDate = language === 'fr' ? UPCOMING_VERSION.releaseDateFr : UPCOMING_VERSION.releaseDate;
    
    setCurrentVersion(targetVersion);
    setReleaseDate(targetDate);
    setBuildCommit(UPCOMING_VERSION.buildCommit);
    localStorage.setItem(STORAGE_KEYS.CURRENT_VERSION, targetVersion);
    localStorage.setItem(STORAGE_KEYS.RELEASE_DATE, targetDate);
    localStorage.removeItem(STORAGE_KEYS.PENDING_UPDATE);
    setPendingUpdate(null);
    setShowUpdateToast(false);

    setStatus('up-to-date');
    setStatusMessage(
      language === 'fr'
        ? `Mise à jour forcée réussie ! Version active : ${targetVersion} (${UPCOMING_VERSION.buildCommit}).`
        : `Force update complete! Active version: ${targetVersion} (${UPCOMING_VERSION.buildCommit}).`
    );

    setTimeout(() => {
      setStatus('idle');
    }, 4000);
  }, [language]);

  // Apply prepared update and restart/refresh
  const applyUpdate = useCallback(() => {
    if (!pendingUpdate) return;

    const targetVer = pendingUpdate.version;
    const targetDate = language === 'fr' ? pendingUpdate.releaseDateFr : pendingUpdate.releaseDate;

    setCurrentVersion(targetVer);
    setReleaseDate(targetDate);
    setBuildCommit(pendingUpdate.buildCommit);
    localStorage.setItem(STORAGE_KEYS.CURRENT_VERSION, targetVer);
    localStorage.setItem(STORAGE_KEYS.RELEASE_DATE, targetDate);
    localStorage.removeItem(STORAGE_KEYS.PENDING_UPDATE);
    setPendingUpdate(null);
    setShowUpdateToast(false);
    setStatus('idle');
    setStatusMessage('');
  }, [pendingUpdate, language]);

  const dismissUpdateToast = () => {
    setShowUpdateToast(false);
  };

  const simulateNewVersionAvailable = () => {
    // Reset to base version to test the update flow again
    setCurrentVersion(BASE_VERSION.version);
    setReleaseDate(language === 'fr' ? BASE_VERSION.releaseDateFr : BASE_VERSION.releaseDate);
    setBuildCommit(BASE_VERSION.buildCommit);
    localStorage.setItem(STORAGE_KEYS.CURRENT_VERSION, BASE_VERSION.version);
    localStorage.setItem(STORAGE_KEYS.RELEASE_DATE, BASE_VERSION.releaseDate);
    localStorage.removeItem(STORAGE_KEYS.PENDING_UPDATE);
    setPendingUpdate(null);
    setStatus('idle');
    setStatusMessage('');
    checkForUpdates(true);
  };

  const clearCacheAndRefresh = async () => {
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        const cacheKeys = await window.caches.keys();
        await Promise.all(cacheKeys.map((key) => window.caches.delete(key)));
      } catch {
        // no-op
      }
    }
    await forceUpdate();
  };

  // Background timer ticker
  useEffect(() => {
    if (!automaticUpdatesEnabled) return;

    const interval = setInterval(() => {
      setNextCheckSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Timer reached 0: fire silent background check!
          checkForUpdates(false);
          return checkIntervalMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [automaticUpdatesEnabled, checkIntervalMinutes, checkForUpdates]);

  // Document visibility change listener (check when user returns to tab if expired)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && automaticUpdatesEnabled) {
        const now = new Date().getTime();
        const last = lastChecked ? lastChecked.getTime() : 0;
        const diffMinutes = (now - last) / (1000 * 60);

        if (diffMinutes >= checkIntervalMinutes) {
          checkForUpdates(false);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [automaticUpdatesEnabled, checkIntervalMinutes, lastChecked, checkForUpdates]);

  return (
    <SystemUpdateContext.Provider
      value={{
        currentVersion,
        releaseDate,
        buildCommit,
        channel,
        status,
        lastChecked,
        lastCheckedFormatted,
        pendingUpdate,
        downloadProgress,
        statusMessage,
        automaticUpdatesEnabled,
        setAutomaticUpdatesEnabled,
        checkIntervalMinutes,
        setCheckIntervalMinutes,
        nextCheckSecondsRemaining,
        checkForUpdates,
        forceUpdate,
        applyUpdate,
        dismissUpdateToast,
        showUpdateToast,
        isSettingsOpen,
        setIsSettingsOpen,
        simulateNewVersionAvailable,
        clearCacheAndRefresh,
      }}
    >
      {children}
    </SystemUpdateContext.Provider>
  );
};

export const useSystemUpdate = (): SystemUpdateContextType => {
  const context = useContext(SystemUpdateContext);
  if (!context) {
    throw new Error('useSystemUpdate must be used within a SystemUpdateProvider');
  }
  return context;
};
