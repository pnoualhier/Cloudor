import React, { useState } from 'react';
import { ActiveTab, Provider } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSearch: () => void;
  selectedProviderFilter?: Provider;
  setSelectedProviderFilter?: (p: Provider) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  selectedProviderFilter = 'all',
  setSelectedProviderFilter,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems: Array<{ id: ActiveTab; label: string; badge?: string }> = [
    { id: 'career-pathways', label: t.careerPathways },
    { id: 'my-study-dashboard', label: t.studyDashboard },
    { id: 'practice-exam-lab', label: t.practiceExamLab },
    { id: 'cheatsheets-and-playground', label: t.cheatsheetsPlayground },
    { id: 'clf-c02-hub', label: t.clfHub, badge: '300 Cards' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f131d]/90 backdrop-blur-xl border-b border-[#262a35] shadow-[0_1px_12px_rgba(0,0,0,0.4)]">
      <div className="h-16 w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand + Environment + Nav Links */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('my-study-dashboard')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8083ff] to-[#4cd7f6] flex items-center justify-center text-[#0f131d] font-bold shadow-md group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px] text-white">cloud_done</span>
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-[#dfe2f1] group-hover:text-white transition-colors">
              {t.appName}
            </span>
          </div>

          {/* Breadcrumb Spec */}
          <div className="hidden xl:flex items-center gap-1 text-[#c7c4d7] font-mono-code text-xs">
            <span className="hover:text-white cursor-pointer transition-colors">core</span>
            <span className="text-[#908fa0]">/</span>
            <span className="text-[#4cd7f6] font-medium">prod-cloud</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#262a35] text-white shadow-sm ring-1 ring-white/10'
                      : 'text-[#c7c4d7] hover:bg-[#1c1f2a] hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono-code font-bold bg-[#ff9900]/20 text-[#ffb95f] border border-[#ff9900]/40">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Provider Badges */}
          <div className="hidden 2xl:flex items-center gap-1 bg-[#0a0e18] p-1 rounded-lg border border-[#262a35]">
            {(['aws', 'azure', 'gcp', 'k8s'] as const).map((p) => {
              const colors: Record<string, string> = {
                aws: 'text-[#ffb95f] hover:bg-[#ffb95f]/15',
                azure: 'text-[#4cd7f6] hover:bg-[#4cd7f6]/15',
                gcp: 'text-[#c0c1ff] hover:bg-[#c0c1ff]/15',
                k8s: 'text-[#dfe2f1] hover:bg-white/10',
              };
              const isSelected = selectedProviderFilter === p;
              return (
                <button
                  key={p}
                  onClick={() => setSelectedProviderFilter && setSelectedProviderFilter(p)}
                  className={`px-2 py-0.5 rounded font-mono-code text-[11px] font-bold uppercase transition-all ${colors[p]} ${
                    isSelected ? 'bg-white/15 ring-1 ring-white/20' : ''
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* Instant Language Switcher (FR / EN) */}
          <div
            id="lang-switcher"
            className="flex items-center bg-[#0a0e18] p-0.5 rounded-lg border border-[#262a35] font-mono-code text-xs shadow-inner"
            title={language === 'en' ? 'Basculer en français' : 'Switch to English'}
          >
            <button
              id="lang-btn-fr"
              onClick={() => setLanguage('fr')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                language === 'fr'
                  ? 'bg-[#8083ff] text-white shadow-sm ring-1 ring-white/20'
                  : 'text-[#908fa0] hover:text-[#dfe2f1] hover:bg-[#171b26]'
              }`}
              aria-label="Français"
            >
              <span>FR</span>
            </button>
            <button
              id="lang-btn-en"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                language === 'en'
                  ? 'bg-[#8083ff] text-white shadow-sm ring-1 ring-white/20'
                  : 'text-[#908fa0] hover:text-[#dfe2f1] hover:bg-[#171b26]'
              }`}
              aria-label="English"
            >
              <span>EN</span>
            </button>
          </div>

          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-2 bg-[#0a0e18] hover:bg-[#171b26] text-[#908fa0] px-3 py-1.5 rounded-lg border border-[#262a35] text-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#908fa0]">search</span>
            <span>{t.searchPlaceholder}</span>
            <kbd className="font-mono-code text-[10px] px-1.5 py-0.5 rounded bg-[#1c1f2a] text-[#c7c4d7] border border-[#313540]">
              ⌘K
            </kbd>
          </button>

          {/* Streak Flame */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#171b26] border border-[#ffb95f]/20 cursor-pointer hover:border-[#ffb95f]/50 transition-colors"
            title={language === 'fr' ? '14 jours consécutifs ! Terminez un lab pour continuer.' : '14-day study streak! Complete a 15-minute lab to keep it going.'}
          >
            <span className="text-sm leading-none">🔥</span>
            <span className="font-mono-code text-xs font-bold text-[#ffb95f]">{t.streakText}</span>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-[#171b26] text-[#c7c4d7] hover:bg-[#1c1f2a] hover:text-white transition-colors"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4cd7f6] ring-2 ring-[#0f131d]"></span>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#1c1f2a] border border-[#313540] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
                  <span className="text-xs font-semibold uppercase text-white font-mono-code">{t.notificationsTitle}</span>
                  <span className="text-[11px] text-[#4cd7f6] font-mono-code">{t.newCount}</span>
                </div>
                <div className="space-y-2 mt-2">
                  <div className="p-2 rounded-lg bg-[#0a0e18] hover:bg-[#171b26] text-xs transition-colors cursor-pointer">
                    <p className="text-[#dfe2f1] font-medium">Elena R. {language === 'fr' ? 'a obtenu 860/1000' : 'scored 860/1000'}</p>
                    <p className="text-[11px] text-[#908fa0] mt-0.5">
                      {language === 'fr' ? 'Examen blanc #4 terminé • il y a 18m' : 'Mock Exam #4 completed • 18m ago'}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#0a0e18] hover:bg-[#171b26] text-xs transition-colors cursor-pointer">
                    <p className="text-[#dfe2f1] font-medium">{language === 'fr' ? 'Demain : AMA Lead Architect' : 'Tomorrow: Lead Architect AMA'}</p>
                    <p className="text-[11px] text-[#ffb95f] mt-0.5">Marcus Vance @ 18:00 UTC</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#0a0e18] hover:bg-[#171b26] text-xs transition-colors cursor-pointer">
                    <p className="text-[#dfe2f1] font-medium">{language === 'fr' ? 'Nouvelle fiche CKA ajoutée' : 'New CKA Imperative Cheat added'}</p>
                    <p className="text-[11px] text-[#908fa0] mt-0.5">{t.cheatsheetsPlayground}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-1 cursor-pointer group"
            >
              <img
                alt="Alex Chen Profile"
                className="w-8 h-8 rounded-full object-cover border border-[#4cd7f6]/40 group-hover:border-[#4cd7f6] transition-colors"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-[#dfe2f1] group-hover:text-white leading-tight">
                  Alex Chen
                </span>
                <span className="font-mono-code text-[10px] text-[#c0c1ff] uppercase tracking-wider leading-tight">
                  {t.proMember}
                </span>
              </div>
              <span className="material-symbols-outlined text-[#908fa0] text-[18px]">expand_more</span>
            </div>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#1c1f2a] border border-[#313540] shadow-2xl p-3 z-50">
                <div className="pb-2 border-b border-[#262a35]">
                  <p className="text-xs font-bold text-white">Alex Chen</p>
                  <p className="text-[11px] text-[#908fa0] font-mono-code">pnoualhier@gmail.com</p>
                </div>
                <div className="py-2 space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('my-study-dashboard');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-[#262a35] text-[#dfe2f1] flex items-center justify-between"
                  >
                    <span>{t.myDashboard}</span>
                    <span className="font-mono-code text-[10px] text-[#4cd7f6]">78% {language === 'fr' ? 'Prêt' : 'Readiness'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('practice-exam-lab');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-[#262a35] text-[#dfe2f1] flex items-center justify-between"
                  >
                    <span>{t.examSimActive}</span>
                    <span className="font-mono-code text-[10px] text-[#ffb95f]">{language === 'fr' ? 'En cours' : 'Active'}</span>
                  </button>
                </div>
                <div className="pt-2 border-t border-[#262a35] flex items-center justify-between text-[11px] text-[#908fa0]">
                  <span>{t.tierPro}</span>
                  <span className="text-[#4cd7f6]">{t.renewed}</span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#171b26] text-[#dfe2f1] hover:bg-[#1c1f2a]"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 bg-[#0f131d] border-b border-[#262a35] space-y-2 animate-in slide-in-from-top-2">
          {/* Language Switcher in Mobile Drawer */}
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#171b26] border border-[#262a35]">
            <span className="text-xs text-[#c7c4d7] font-mono-code">
              {language === 'fr' ? 'Langue de l’interface :' : 'Interface Language:'}
            </span>
            <div className="flex items-center bg-[#0a0e18] p-0.5 rounded-lg border border-[#262a35] font-mono-code text-xs">
              <button
                onClick={() => setLanguage('fr')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  language === 'fr'
                    ? 'bg-[#8083ff] text-white'
                    : 'text-[#908fa0] hover:text-[#dfe2f1]'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-[#8083ff] text-white'
                    : 'text-[#908fa0] hover:text-[#dfe2f1]'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                  isActive ? 'bg-[#262a35] text-white' : 'text-[#c7c4d7] hover:bg-[#1c1f2a]'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
