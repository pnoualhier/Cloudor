import React, { useState } from 'react';
import { useSystemUpdate } from '../context/SystemUpdateContext';
import { useLanguage } from '../context/LanguageContext';

export const SystemSettingsModal: React.FC = () => {
  const { language } = useLanguage();
  const {
    currentVersion,
    releaseDate,
    buildCommit,
    channel,
    status,
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
    isSettingsOpen,
    setIsSettingsOpen,
    simulateNewVersionAvailable,
    clearCacheAndRefresh,
  } = useSystemUpdate();

  const [activeTab, setActiveTab] = useState<'updates' | 'storage' | 'diagnostics'>('updates');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  if (!isSettingsOpen) return null;

  // Format remaining countdown mm:ss
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleManualCheck = async () => {
    setActionFeedback(null);
    await checkForUpdates(true);
  };

  const handleForceUpdate = async () => {
    setActionFeedback(
      language === 'fr'
        ? 'Purge du cache et mise à jour forcée en cours...'
        : 'Purging cache & forcing update synchronization...'
    );
    await forceUpdate();
    setTimeout(() => setActionFeedback(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#131722] border border-[#262a35] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262a35] bg-[#0f131d]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8083ff]/30 to-[#4cd7f6]/30 border border-[#8083ff]/40 flex items-center justify-center text-[#4cd7f6]">
              <span className="material-symbols-outlined text-[22px]">settings_system_daydream</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                <span>{language === 'fr' ? 'Paramètres Système & Mises à Jour' : 'System Settings & Updates'}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-[#8083ff]/20 text-[#c0c1ff] border border-[#8083ff]/40">
                  {currentVersion}
                </span>
              </h2>
              <p className="text-xs text-[#908fa0]">
                {language === 'fr'
                  ? 'Gestion du cycle de vie, mises à jour en tâche de fond & métriques logicielles'
                  : 'Lifecycle management, background update daemon & software telemetry'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsOpen(false)}
            className="w-8 h-8 rounded-lg bg-[#1c202c] hover:bg-[#262a35] text-[#908fa0] hover:text-white flex items-center justify-center transition-colors"
            title={language === 'fr' ? 'Fermer' : 'Close'}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#262a35] bg-[#0f131d]/60 text-xs font-mono-code">
          <button
            onClick={() => setActiveTab('updates')}
            className={`pb-2.5 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'updates'
                ? 'border-[#4cd7f6] text-[#4cd7f6]'
                : 'border-transparent text-[#908fa0] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">sync</span>
            <span>{language === 'fr' ? 'Mises à Jour Logicielles' : 'Software Updates'}</span>
            {pendingUpdate && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`pb-2.5 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'storage'
                ? 'border-[#4cd7f6] text-[#4cd7f6]'
                : 'border-transparent text-[#908fa0] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">database</span>
            <span>{language === 'fr' ? 'Stockage & Cache Hors-Ligne' : 'Offline Cache & Storage'}</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`pb-2.5 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'diagnostics'
                ? 'border-[#4cd7f6] text-[#4cd7f6]'
                : 'border-transparent text-[#908fa0] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">terminal</span>
            <span>{language === 'fr' ? 'Télémétrie & Environnement' : 'Telemetry & Runtime'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#dfe2f1]">
          {activeTab === 'updates' && (
            <div className="space-y-5">
              {/* Release Metadata Card */}
              <div className="p-4 rounded-xl bg-[#0a0e18] border border-[#262a35] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1c202c]">
                  <div>
                    <span className="text-[11px] font-mono-code uppercase tracking-wider text-[#908fa0]">
                      {language === 'fr' ? 'Version Active du Système' : 'Active System Release'}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xl font-bold font-mono-code text-white">{currentVersion}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {channel}
                      </span>
                      <span className="text-xs font-mono-code text-[#908fa0]">
                        #{buildCommit}
                      </span>
                    </div>
                  </div>

                  {/* Status Indicator Pill */}
                  <div className="flex items-center gap-2">
                    {status === 'checking' && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-code bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                        {language === 'fr' ? 'Vérification...' : 'Checking...'}
                      </span>
                    )}
                    {status === 'downloading' && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-code bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                        <span className="material-symbols-outlined text-[14px] animate-spin">refresh</span>
                        {language === 'fr' ? `Préparation (${downloadProgress}%)` : `Preparing (${downloadProgress}%)`}
                      </span>
                    )}
                    {status === 'ready' && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-code bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        {language === 'fr' ? 'Mise à jour prête' : 'Update Ready'}
                      </span>
                    )}
                    {(status === 'idle' || status === 'up-to-date') && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-code bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        {language === 'fr' ? 'À jour' : 'Up to date'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Key Spec Grid: Release Date & Last Checked */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Release Date */}
                  <div className="p-3 rounded-lg bg-[#131722] border border-[#1f2430]">
                    <div className="flex items-center gap-1.5 text-[#908fa0] mb-1">
                      <span className="material-symbols-outlined text-[16px] text-[#8083ff]">calendar_today</span>
                      <span className="font-mono-code uppercase text-[10px] tracking-wider">
                        {language === 'fr' ? 'Date de Publication' : 'Release Date'}
                      </span>
                    </div>
                    <p className="font-mono-code font-bold text-white text-sm">
                      {releaseDate}
                    </p>
                  </div>

                  {/* Last Checked */}
                  <div className="p-3 rounded-lg bg-[#131722] border border-[#1f2430]">
                    <div className="flex items-center justify-between gap-1.5 text-[#908fa0] mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">history</span>
                        <span className="font-mono-code uppercase text-[10px] tracking-wider">
                          {language === 'fr' ? 'Dernière Vérification' : 'Last Checked'}
                        </span>
                      </div>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    </div>
                    <p className="font-mono-code font-bold text-[#4cd7f6] text-sm">
                      {lastCheckedFormatted}
                    </p>
                  </div>
                </div>

                {/* Action Buttons: Check for Updates & Force Update */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  {/* Check for Updates */}
                  <button
                    onClick={handleManualCheck}
                    disabled={status === 'checking' || status === 'downloading'}
                    className={`w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-mono-code font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      status === 'checking' || status === 'downloading'
                        ? 'bg-[#1c202c] text-[#908fa0] cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] text-[#0f131d] hover:brightness-110 shadow-lg shadow-[#8083ff]/15'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        status === 'checking' ? 'animate-spin' : ''
                      }`}
                    >
                      sync
                    </span>
                    <span>
                      {status === 'checking'
                        ? language === 'fr'
                          ? 'Vérification en cours...'
                          : 'Checking for Updates...'
                        : language === 'fr'
                        ? 'Vérifier les Mises à Jour'
                        : 'Check for Updates'}
                    </span>
                  </button>

                  {/* Force Update */}
                  <button
                    onClick={handleForceUpdate}
                    disabled={status === 'checking' || status === 'downloading'}
                    className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-mono-code font-bold transition-all flex items-center justify-center gap-2 bg-[#1c202c] hover:bg-[#262a35] text-[#dfe2f1] hover:text-white border border-[#313540] hover:border-[#4cd7f6]/40 cursor-pointer"
                    title={
                      language === 'fr'
                        ? 'Purge tous les caches du navigateur, réinitialise les artefacts et force le rechargement immédiat'
                        : 'Purges all browser caches, resets assets manifest, and forces immediate build synchronization'
                    }
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#ffb95f]">bolt</span>
                    <span>{language === 'fr' ? 'Forcer la Mise à Jour' : 'Force Update'}</span>
                  </button>
                </div>

                {/* Status message banner */}
                {(statusMessage || actionFeedback) && (
                  <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] text-xs font-mono-code text-[#c7c4d7] flex items-center gap-2 animate-in fade-in">
                    <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">info</span>
                    <span className="truncate">{actionFeedback || statusMessage}</span>
                  </div>
                )}
              </div>

              {/* Automatic Background Updates Engine Card */}
              <div className="p-4 rounded-xl bg-[#0a0e18] border border-[#262a35] space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-[#8083ff]">autorenew</span>
                      <h3 className="text-sm font-bold text-white font-display">
                        {language === 'fr' ? 'Mises à Jour Automatiques en Arrière-Plan' : 'Automatic Background Updates'}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-[#8083ff]/15 text-[#c0c1ff] border border-[#8083ff]/30">
                        {language === 'fr' ? 'Démon Périodique' : 'Periodic Daemon'}
                      </span>
                    </div>
                    <p className="text-xs text-[#908fa0] leading-relaxed">
                      {language === 'fr'
                        ? 'Vérifie et prépare automatiquement les nouvelles versions en arrière-plan sans interrompre vos sessions d’examen et de révision.'
                        : 'Periodically checks and prepares new versions automatically in the background without interrupting your active study or exam simulations.'}
                    </p>
                  </div>

                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={automaticUpdatesEnabled}
                      onChange={(e) => setAutomaticUpdatesEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#1f2430] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8083ff]"></div>
                  </label>
                </div>

                {/* Interval and Countdown Settings */}
                {automaticUpdatesEnabled ? (
                  <div className="p-3 rounded-lg bg-[#131722] border border-[#1f2430] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[#908fa0] font-mono-code">
                        {language === 'fr' ? 'Fréquence de vérification :' : 'Check frequency:'}
                      </span>
                      <select
                        value={checkIntervalMinutes}
                        onChange={(e) => setCheckIntervalMinutes(Number(e.target.value))}
                        className="bg-[#0a0e18] border border-[#262a35] text-white rounded-lg px-2.5 py-1 font-mono-code text-xs focus:outline-none focus:border-[#4cd7f6]"
                      >
                        <option value={2}>{language === 'fr' ? 'Toutes les 2 minutes' : 'Every 2 minutes'}</option>
                        <option value={5}>{language === 'fr' ? 'Toutes les 5 minutes (Recommandé)' : 'Every 5 minutes (Recommended)'}</option>
                        <option value={15}>{language === 'fr' ? 'Toutes les 15 minutes' : 'Every 15 minutes'}</option>
                        <option value={30}>{language === 'fr' ? 'Toutes les 30 minutes' : 'Every 30 minutes'}</option>
                        <option value={60}>{language === 'fr' ? 'Toutes les heures' : 'Every 1 hour'}</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 font-mono-code">
                      <span className="text-[#908fa0]">
                        {language === 'fr' ? 'Prochaine vérification :' : 'Next check in:'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#0a0e18] border border-[#262a35] text-[#4cd7f6] font-bold">
                        {formatCountdown(nextCheckSecondsRemaining)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-mono-code text-amber-300 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                    <span>
                      {language === 'fr'
                        ? 'Les vérifications automatiques sont désactivées. Utilisez "Vérifier les Mises à Jour" manuellement.'
                        : 'Automatic checks are disabled. Please use "Check for Updates" manually.'}
                    </span>
                  </div>
                )}
              </div>

              {/* Prepared Update Section (When new update is ready or pending) */}
              {pendingUpdate && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#172033] to-[#0f172a] border border-[#4cd7f6]/40 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">rocket_launch</span>
                      <div>
                        <h4 className="text-sm font-bold text-white font-display">
                          {language === 'fr'
                            ? `Nouvelle Version Prête : ${pendingUpdate.version}`
                            : `New Version Ready: ${pendingUpdate.version}`}
                        </h4>
                        <p className="text-[11px] text-[#908fa0] font-mono-code">
                          {language === 'fr'
                            ? `Téléchargée et préparée en arrière-plan • Taille : ${pendingUpdate.size}`
                            : `Downloaded and prepared in background • Size: ${pendingUpdate.size}`}
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-mono-code font-bold bg-[#4cd7f6]/20 text-[#4cd7f6] border border-[#4cd7f6]/40 animate-pulse">
                      {language === 'fr' ? 'Prête à installer' : 'Ready to apply'}
                    </span>
                  </div>

                  {/* Changelog highlights */}
                  <div className="p-3 rounded-lg bg-[#0a0e18]/80 border border-[#262a35] text-xs space-y-1.5 font-mono-code">
                    <span className="text-[11px] font-bold text-[#c0c1ff] uppercase tracking-wider block mb-1">
                      {language === 'fr' ? 'Notes de Version :' : 'Release Highlights:'}
                    </span>
                    {(language === 'fr' ? pendingUpdate.changelogFr : pendingUpdate.changelog).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[#c7c4d7]">
                        <span className="text-[#4cd7f6] font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={applyUpdate}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-mono-code font-bold bg-gradient-to-r from-[#4cd7f6] to-[#8083ff] text-[#0f131d] hover:brightness-110 shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                    <span>
                      {language === 'fr'
                        ? `Appliquer la Version ${pendingUpdate.version} & Redémarrer`
                        : `Apply Release ${pendingUpdate.version} & Restart`}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0a0e18] border border-[#262a35] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#4cd7f6]">sd_storage</span>
                  <h3 className="text-sm font-bold text-white font-display">
                    {language === 'fr' ? 'Cache d’Actifs & Stockage Local' : 'Asset Caches & Local Storage'}
                  </h3>
                </div>
                <p className="text-xs text-[#908fa0] leading-relaxed">
                  {language === 'fr'
                    ? 'L’application précharge les fiches CLF-C02 (450), AZ-900 (300) et les simulations d’examen en mémoire locale pour garantir un fonctionnement hors-ligne instantané.'
                    : 'The app preloads the CLF-C02 (450), AZ-900 (300) and exam simulation datasets into local client cache to provide instant offline-capable performance.'}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs font-mono-code">
                  <div className="p-2.5 rounded-lg bg-[#131722] border border-[#1f2430]">
                    <span className="text-[10px] text-[#908fa0] block">Service Worker Cache</span>
                    <span className="text-white font-bold text-sm">18.4 MB</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#131722] border border-[#1f2430]">
                    <span className="text-[10px] text-[#908fa0] block">Flashcards DB</span>
                    <span className="text-[#4cd7f6] font-bold text-sm">750 Cards</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#131722] border border-[#1f2430] col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-[#908fa0] block">Telemetry Buffer</span>
                    <span className="text-emerald-400 font-bold text-sm">Synced (0 pending)</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  <button
                    onClick={clearCacheAndRefresh}
                    className="w-full sm:w-1/2 py-2 px-3 rounded-lg bg-[#1c202c] hover:bg-[#262a35] text-xs font-mono-code text-[#dfe2f1] hover:text-white border border-[#313540] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-amber-400">delete_sweep</span>
                    <span>{language === 'fr' ? 'Purger le Cache Client' : 'Flush Client Cache'}</span>
                  </button>

                  <button
                    onClick={simulateNewVersionAvailable}
                    className="w-full sm:w-1/2 py-2 px-3 rounded-lg bg-[#8083ff]/20 hover:bg-[#8083ff]/30 text-xs font-mono-code text-[#c0c1ff] border border-[#8083ff]/40 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    title={
                      language === 'fr'
                        ? 'Simule la détection et préparation en tâche de fond d’une nouvelle version'
                        : 'Simulates discovering and preparing a new release in the background'
                    }
                  >
                    <span className="material-symbols-outlined text-[16px]">experiment</span>
                    <span>{language === 'fr' ? 'Tester M.A.J en Arrière-Plan' : 'Simulate Background Update'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'diagnostics' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0a0e18] border border-[#262a35] space-y-3 font-mono-code text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#1f2430]">
                  <span className="text-[#908fa0]">Container Host</span>
                  <span className="text-white">Cloud Run / europe-west2</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#1f2430]">
                  <span className="text-[#908fa0]">Reverse Proxy Ingress</span>
                  <span className="text-[#4cd7f6]">nginx:3000 (TLS 1.3)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#1f2430]">
                  <span className="text-[#908fa0]">Build Commit SHA</span>
                  <span className="text-white">{buildCommit}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#1f2430]">
                  <span className="text-[#908fa0]">Software Channel</span>
                  <span className="text-emerald-400 uppercase">{channel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#908fa0]">HMR Status</span>
                  <span className="text-[#908fa0]">Disabled (Production Stable Mode)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3.5 border-t border-[#262a35] bg-[#0f131d] flex items-center justify-between text-xs text-[#908fa0]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-mono-code">Cloudor Live Engine {currentVersion}</span>
          </div>

          <button
            onClick={() => setIsSettingsOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-[#1c202c] hover:bg-[#262a35] text-white font-mono-code font-bold transition-colors cursor-pointer"
          >
            {language === 'fr' ? 'Fermer' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
