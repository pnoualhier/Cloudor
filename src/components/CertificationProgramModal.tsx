import React, { useState } from 'react';
import { RecommendedCert } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CertificationProgramModalProps {
  cert: RecommendedCert | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectAsTarget?: (certCode: string) => void;
  onNavigate?: (tab: any) => void;
}

export const CertificationProgramModal: React.FC<CertificationProgramModalProps> = ({
  cert,
  isOpen,
  onClose,
  onSelectAsTarget,
  onNavigate,
}) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !cert) return null;

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cert.url) {
      navigator.clipboard.writeText(cert.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const getProviderBadge = (provider: string) => {
    switch (provider) {
      case 'AWS':
        return { bg: 'bg-[#ff9900]/20 text-[#ffb95f] border-[#ff9900]/30', label: 'AWS' };
      case 'AZURE':
        return { bg: 'bg-[#0089d6]/20 text-[#4cd7f6] border-[#0089d6]/30', label: 'Azure' };
      case 'GCP':
        return { bg: 'bg-[#4285f4]/20 text-[#8ab4f8] border-[#4285f4]/30', label: 'Google Cloud' };
      case 'K8S':
        return { bg: 'bg-[#326ce5]/20 text-[#8083ff] border-[#326ce5]/30', label: 'Kubernetes / CNCF' };
      case 'ISC2':
        return { bg: 'bg-[#00a887]/20 text-[#5eead4] border-[#00a887]/30', label: 'ISC²' };
      case 'COMPTIA':
        return { bg: 'bg-[#ff0000]/20 text-[#ff8080] border-[#ff0000]/30', label: 'CompTIA' };
      default:
        return { bg: 'bg-[#262a35] text-[#dfe2f1] border-[#313540]', label: provider };
    }
  };

  const badgeStyle = getProviderBadge(cert.provider);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0e18]/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-[#171b26] border border-[#313540] shadow-2xl shadow-black/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-[#262a35] flex items-start justify-between gap-4 bg-[#1c1f2a]/60">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono-code font-bold uppercase border ${badgeStyle.bg}`}>
                {badgeStyle.label}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#0a0e18] border border-[#262a35] font-mono-code text-[11px] text-[#4cd7f6] font-bold">
                {cert.code}
              </span>
              <span className="text-[11px] font-mono-code text-[#908fa0]">
                {language === 'fr' ? 'Programme Officiel' : 'Official Certification Program'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
              {cert.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#262a35] hover:bg-[#313540] text-[#908fa0] hover:text-white flex items-center justify-center transition-colors shrink-0"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Overview Description */}
          {cert.description && (
            <div className="p-4 rounded-xl bg-[#0a0e18] border border-[#262a35]">
              <div className="text-[11px] font-mono-code text-[#908fa0] uppercase tracking-wider mb-1">
                {language === 'fr' ? 'Aperçu du Programme' : 'Program Overview'}
              </div>
              <p className="text-xs sm:text-sm text-[#dfe2f1] leading-relaxed">
                {cert.description}
              </p>
            </div>
          )}

          {/* Key Exam Specification Telemetry */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35] space-y-1">
              <span className="text-[10px] font-mono-code uppercase text-[#908fa0] block">
                {language === 'fr' ? 'Durée de l’Épreuve' : 'Exam Duration'}
              </span>
              <span className="text-xs font-mono-code font-bold text-white block">
                {cert.examDuration || '90–130 Minutes'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35] space-y-1">
              <span className="text-[10px] font-mono-code uppercase text-[#908fa0] block">
                {language === 'fr' ? 'Format & Questions' : 'Format / Questions'}
              </span>
              <span className="text-xs font-mono-code font-bold text-white block truncate">
                {cert.questionsCount || '50–65 Questions'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35] space-y-1">
              <span className="text-[10px] font-mono-code uppercase text-[#908fa0] block">
                {language === 'fr' ? 'Score de Réussite' : 'Passing Score'}
              </span>
              <span className="text-xs font-mono-code font-bold text-emerald-400 block">
                {cert.passingScore || '700–750 / 1000'}
              </span>
            </div>
          </div>

          {/* Official Syllabus Domains */}
          {cert.domains && cert.domains.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono-code uppercase font-bold text-white tracking-wider">
                  {language === 'fr' ? 'Pondération des Domaines du Programme' : 'Official Blueprint Domain Weights'}
                </h4>
                <span className="text-[11px] font-mono-code text-[#4cd7f6]">
                  {cert.domains.length} {language === 'fr' ? 'domaines' : 'domains'}
                </span>
              </div>

              <div className="space-y-2.5">
                {cert.domains.map((dom, idx) => {
                  const numWeight = parseInt(dom.weight) || 25;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35] space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#dfe2f1]">
                          <span className="font-mono-code text-[#908fa0] mr-2">D{idx + 1}.</span>
                          {dom.name}
                        </span>
                        <span className="font-mono-code font-bold text-[#4cd7f6] shrink-0 ml-2">
                          {dom.weight}
                        </span>
                      </div>
                      <div className="w-full bg-[#171b26] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] h-full rounded-full"
                          style={{ width: `${Math.min(100, Math.max(15, numWeight * 2.2))}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Direct URL Link Box */}
          <div className="p-4 rounded-xl bg-[#0a0e18] border border-[#262a35] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono-code text-[#908fa0] text-[11px] uppercase tracking-wider">
                {language === 'fr' ? 'URL Officielle du Fournisseur' : 'Official Vendor Program URL'}
              </span>
              <button
                onClick={handleCopyUrl}
                className="text-[11px] font-mono-code text-[#4cd7f6] hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? (language === 'fr' ? 'Copié !' : 'Copied!') : (language === 'fr' ? 'Copier le lien' : 'Copy link')}</span>
              </button>
            </div>
            <a
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-code text-xs text-[#8083ff] hover:text-white underline break-all flex items-center gap-1.5 group"
            >
              <span>{cert.url}</span>
              <span className="material-symbols-outlined text-[14px] shrink-0 group-hover:translate-x-0.5 transition-transform">
                open_in_new
              </span>
            </a>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-[#262a35] bg-[#1c1f2a]/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-auto flex items-center gap-2">
            {onSelectAsTarget && (
              <button
                onClick={() => {
                  onSelectAsTarget(cert.code);
                  onClose();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#262a35] hover:bg-[#313540] text-xs font-mono-code font-bold text-[#dfe2f1] flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#ffb95f]">flag</span>
                <span>{language === 'fr' ? 'Définir comme Cible' : 'Set as Study Target'}</span>
              </button>
            )}
          </div>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2.5">
            {cert.code === 'CLF-C02' && onNavigate && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigate('clf-c02-hub');
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#ff9900]/20 hover:bg-[#ff9900] text-[#ffb95f] hover:text-[#0f131d] text-xs font-mono-code font-bold flex items-center justify-center gap-1.5 transition-all border border-[#ff9900]/40"
              >
                <span className="material-symbols-outlined text-[16px]">style</span>
                <span>{language === 'fr' ? 'Domaine 1 & 50 Flashcards' : 'Domain 1 & 50 Flashcards'}</span>
              </button>
            )}

            {cert.programUrl && (
              <a
                href={cert.programUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#262a35] hover:bg-[#313540] text-xs font-mono-code font-bold text-[#dfe2f1] flex items-center justify-center gap-1.5 transition-colors border border-[#313540]"
              >
                <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">menu_book</span>
                <span>{language === 'fr' ? 'Guide d’Examen (PDF) ↗' : 'Exam Guide (PDF) ↗'}</span>
              </a>
            )}

            <a
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] hover:opacity-95 text-[#0f131d] font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all"
            >
              <span>{language === 'fr' ? 'Accéder au Programme Officiel' : 'Open Official Program'}</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
