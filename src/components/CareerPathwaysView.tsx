import React, { useState } from 'react';
import { ActiveTab, Provider, CertificationPathway, RecommendedCert } from '../types';
import { PATHWAY_CARDS, COMPARATIVE_MATRIX_ROWS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { CertificationProgramModal } from './CertificationProgramModal';

interface CareerPathwaysViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onSelectTrack: (trackId: string) => void;
  onOpenAssessment: () => void;
}

export const CareerPathwaysView: React.FC<CareerPathwaysViewProps> = ({
  onNavigate,
  onSelectTrack,
  onOpenAssessment,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<Provider>('all');
  const [matrixSearch, setMatrixSearch] = useState('');
  const [activePathwayId, setActivePathwayId] = useState<string>('cloud-architect');
  const [activatedNotice, setActivatedNotice] = useState<string | null>(null);
  const [selectedCertForModal, setSelectedCertForModal] = useState<RecommendedCert | null>(null);
  const { language } = useLanguage();

  const providersList: Array<{ id: Provider; label: string }> = [
    { id: 'all', label: language === 'fr' ? 'Tous les Fournisseurs' : 'All Providers' },
    { id: 'aws', label: 'AWS' },
    { id: 'azure', label: 'Azure' },
    { id: 'gcp', label: 'GCP' },
    { id: 'k8s', label: 'K8s' },
    { id: 'comptia', label: 'CompTIA' },
  ];

  const filteredCards = PATHWAY_CARDS.filter((card) => {
    if (selectedProvider === 'all') return true;
    return card.providers.includes(selectedProvider);
  });

  const filteredMatrix = COMPARATIVE_MATRIX_ROWS.filter((row) => {
    if (!matrixSearch.trim()) return true;
    const q = matrixSearch.toLowerCase();
    return (
      row.goal.toLowerCase().includes(q) ||
      row.certifications.toLowerCase().includes(q) ||
      row.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleStartPathway = (pathway: CertificationPathway) => {
    setActivePathwayId(pathway.id);
    onSelectTrack(pathway.id);
    setActivatedNotice(
      language === 'fr'
        ? `« ${pathway.title} » activé comme parcours d'étude principal !`
        : `Activated "${pathway.title}" as primary study track!`
    );
    setTimeout(() => {
      setActivatedNotice(null);
    }, 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notice */}
      {activatedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1f2a] border border-[#4cd7f6] text-[#dfe2f1] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">task_alt</span>
          <span className="text-xs font-semibold">{activatedNotice}</span>
          <button
            onClick={() => onNavigate('my-study-dashboard')}
            className="text-xs font-bold text-[#4cd7f6] underline hover:text-white"
          >
            {language === 'fr' ? 'Voir le Tableau de Bord' : 'Go to Dashboard'}
          </button>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#171b26] via-[#1c1f2a] to-[#171b26] border border-[#262a35] p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#4cd7f6]"></span>
            <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#4cd7f6] font-semibold">
              {language === 'fr' ? 'Matrice Active : Édition Q2 2025' : 'Active Matrix: Q2 2025 Edition'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            {language === 'fr' ? 'Parcours Professionnels Multi-Cloud' : 'Role-Based Multi-Cloud Career Pathways'}
          </h1>
          <p className="text-xs sm:text-sm text-[#c7c4d7] mt-2 leading-relaxed">
            {language === 'fr'
              ? 'Cursus structuré par rôles pour acquérir une polyvalence cross-cloud. Cartographiez votre progression depuis les infrastructures fondamentales jusqu’à la maîtrise architecturale avancée.'
              : 'Role-based curriculum designed for cross-provider fluency. Map your progression from foundational infrastructure to specialized multi-cloud architectural mastery.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onOpenAssessment}
            className="px-4 py-2.5 rounded-xl bg-[#262a35] hover:bg-[#313540] text-xs font-bold text-[#dfe2f1] border border-[#313540] flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">quiz</span>
            <span>{language === 'fr' ? 'Évaluation des Compétences (15 Qs)' : 'Skill Assessment (15 Qs)'}</span>
          </button>
          <button
            onClick={() => onNavigate('cheatsheets-and-playground')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] hover:opacity-90 text-xs font-bold text-[#0f131d] flex items-center gap-2 shadow-lg transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">schema</span>
            <span>{language === 'fr' ? 'Bac à Sable Topologique' : 'Interactive Topology Sandbox'}</span>
          </button>
        </div>

        {/* Decorative background grid pattern */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#8083ff]/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Provider Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#262a35] pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {providersList.map((p) => {
            const isSelected = selectedProvider === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProvider(p.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono-code transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#262a35] text-white ring-1 ring-white/10 shadow-sm'
                    : 'text-[#908fa0] hover:text-[#dfe2f1] hover:bg-[#171b26]'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="text-xs font-mono-code text-[#908fa0]">
          {language === 'fr'
            ? `Affichage de ${filteredCards.length} sur 6 Parcours Métiers`
            : `Showing ${filteredCards.length} of 6 Career Goals`}
        </div>
      </div>

      {/* 6 Pathways Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCards.map((pathway) => {
          const isActive = activePathwayId === pathway.id;

          const badgeStyles = {
            entry: 'bg-[#4cd7f6]/10 text-[#4cd7f6] border-[#4cd7f6]/20',
            popular: 'bg-[#ffb95f]/10 text-[#ffb95f] border-[#ffb95f]/20',
            code: 'bg-[#8083ff]/10 text-[#c0c1ff] border-[#8083ff]/20',
            growth: 'bg-[#03b5d3]/10 text-[#4cd7f6] border-[#03b5d3]/20',
            security: 'bg-[#93000a]/20 text-[#ffb4ab] border-[#93000a]/40',
            devops: 'bg-[#ffb95f]/15 text-[#ffddb8] border-[#ffb95f]/30',
          }[pathway.badgeType];

          return (
            <div
              key={pathway.id}
              className={`rounded-2xl bg-[#171b26] border p-6 flex flex-col justify-between transition-all duration-200 relative group ${
                isActive
                  ? 'border-[#8083ff] shadow-[0_0_24px_rgba(128,131,255,0.15)] ring-1 ring-[#8083ff]/40'
                  : 'border-[#262a35] hover:border-[#313540] hover:bg-[#1c1f2a]'
              }`}
            >
              <div>
                {/* Header Sub & Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 font-mono-code text-xs text-[#908fa0]">
                    <span className="text-[#dfe2f1] font-semibold">{pathway.goalNumber}</span>
                    <span>•</span>
                    <span>{pathway.goalSub}</span>
                  </div>
                  <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded-full border ${badgeStyles}`}>
                    {pathway.badge}
                  </span>
                </div>

                {/* Title & Duration */}
                <h3 className="text-xl font-display font-bold text-white group-hover:text-[#4cd7f6] transition-colors">
                  {pathway.title}
                </h3>
                <p className="text-xs font-mono-code text-[#908fa0] mt-0.5">{pathway.timeEstimate}</p>

                {/* Description */}
                <p className="text-xs text-[#c7c4d7] mt-3 leading-relaxed">
                  {pathway.description}
                </p>

                {/* Recommended Certs List with Direct URL Access */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#908fa0] block">
                      {language === 'fr' ? 'Certifications Visées & Programmes :' : 'Target Certifications & Blueprints:'}
                    </span>
                    <span className="text-[10px] font-mono-code text-[#4cd7f6]">
                      {language === 'fr' ? 'Cliquez pour ouvrir' : 'Click to inspect'}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {pathway.recommendedCerts.map((cert, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-2.5 rounded-xl bg-[#0a0e18] border border-[#262a35] hover:border-[#464554] transition-all group/cert flex items-center justify-between gap-2"
                      >
                        <div
                          className="min-w-0 flex-1 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCertForModal(cert);
                          }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] shrink-0"></span>
                            <span className="text-[#dfe2f1] group-hover/cert:text-white font-medium text-xs truncate block">
                              {cert.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 pl-3">
                            <span className="font-mono-code text-[11px] text-[#4cd7f6] font-bold">
                              {cert.code}
                            </span>
                            {cert.domains && (
                              <span className="text-[10px] font-mono-code text-[#908fa0]">
                                • {cert.domains.length} {language === 'fr' ? 'domaines' : 'domains'}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Dedicated CLF-C02 Deck shortcut */}
                          {cert.code === 'CLF-C02' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigate('clf-c02-hub');
                              }}
                              title={language === 'fr' ? 'Ouvrir le guide Domaine 1 et les 50 Flashcards' : 'Open Domain 1 Guide & 50 Flashcards'}
                              className="px-2 py-1 rounded-lg bg-[#ff9900]/20 hover:bg-[#ff9900] text-[#ffb95f] hover:text-[#0f131d] text-[11px] font-mono-code font-bold flex items-center gap-1 border border-[#ff9900]/40 transition-all shadow-sm"
                            >
                              <span className="material-symbols-outlined text-[13px]">style</span>
                              <span>{language === 'fr' ? '50 Cartes' : '50 Cards'}</span>
                            </button>
                          )}

                          {/* Direct URL Access to Official Vendor Program */}
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title={
                              language === 'fr'
                                ? `Accéder au programme officiel de ${cert.name}`
                                : `Open official ${cert.name} program page`
                            }
                            className="px-2 py-1 rounded-lg bg-[#171b26] hover:bg-[#8083ff] text-[#4cd7f6] hover:text-white text-[11px] font-mono-code font-bold flex items-center gap-1 border border-[#262a35] hover:border-[#8083ff] transition-all shadow-sm"
                          >
                            <span>{language === 'fr' ? 'URL' : 'URL'}</span>
                            <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                          </a>

                          {/* Inspect Syllabus & Blueprint Modal Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCertForModal(cert);
                            }}
                            title={
                              language === 'fr'
                                ? 'Voir le programme détaillé et les domaines'
                                : 'Inspect full syllabus & domain weights'
                            }
                            className="p-1 rounded-lg bg-[#171b26] hover:bg-[#313540] text-[#908fa0] hover:text-white transition-colors border border-[#262a35]"
                          >
                            <span className="material-symbols-outlined text-[15px]">menu_book</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Optional cert */}
                    {pathway.optionalCert && (
                      typeof pathway.optionalCert === 'object' ? (
                        <div className="p-2 rounded-xl bg-[#0a0e18]/60 border border-[#262a35]/60 flex items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[10px] font-mono-code text-[#908fa0] uppercase shrink-0">
                              {language === 'fr' ? 'Optionnel :' : 'Optional:'}
                            </span>
                            <span className="text-[#c7c4d7] truncate text-xs">
                              {pathway.optionalCert.name} ({pathway.optionalCert.code})
                            </span>
                          </div>
                          <a
                            href={pathway.optionalCert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-0.5 rounded bg-[#171b26] hover:bg-[#8083ff] text-[#4cd7f6] hover:text-white text-[10px] font-mono-code font-bold flex items-center gap-1 shrink-0 border border-[#262a35]"
                            title={pathway.optionalCert.name}
                          >
                            <span>{language === 'fr' ? 'URL ↗' : 'URL ↗'}</span>
                          </a>
                        </div>
                      ) : (
                        <p className="text-[11px] text-[#908fa0] font-mono-code italic pt-1">
                          {pathway.optionalCert}
                        </p>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Metrics and CTA */}
              <div className="mt-6 pt-4 border-t border-[#262a35] space-y-4">
                {/* Metric progress */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono-code mb-1">
                    <span className="text-[#908fa0]">
                      {language === 'fr' && pathway.metric1Label === 'Syllabus Mastery'
                        ? 'Maîtrise du Programme'
                        : pathway.metric1Label}
                    </span>
                    <span className="text-white font-bold">{pathway.metric1Value}</span>
                  </div>
                  {pathway.metric1Progress && (
                    <div className="w-full bg-[#0a0e18] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#4cd7f6] h-full rounded-full"
                        style={{ width: `${pathway.metric1Progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Action CTA */}
                <div>
                  <button
                    onClick={() => handleStartPathway(pathway)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold font-mono-code transition-all flex items-center justify-center gap-1.5 ${
                      isActive
                        ? 'bg-[#8083ff] text-white shadow-md'
                        : 'bg-[#262a35] hover:bg-[#8083ff] hover:text-white text-[#dfe2f1]'
                    }`}
                  >
                    <span>
                      {isActive
                        ? (language === 'fr' ? 'Objectif Actif' : 'Active Target')
                        : (language === 'fr' ? 'Activer le Parcours' : 'Start Pathway')}
                    </span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Certification Equivalency Matrix Table */}
      <div className="rounded-2xl bg-[#171b26] border border-[#262a35] p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">table_chart</span>
              <h2 className="text-lg font-display font-bold text-white">
                {language === 'fr'
                  ? 'Matrice d’Alignement des Certifications Multi-Cloud'
                  : 'Multi-Cloud Certification Alignment Matrix'}
              </h2>
            </div>
            <p className="text-xs text-[#908fa0]">
              {language === 'fr'
                ? 'Correspondance structurée entre niveaux fondamental, associé et expert sur AWS, Azure, GCP et Kubernetes.'
                : 'Crosswalk between foundational, associate, and professional tiers across AWS, Azure, GCP, and Kubernetes.'}
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#908fa0] text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder={language === 'fr' ? 'Filtrer la matrice...' : 'Filter matrix rows...'}
              value={matrixSearch}
              onChange={(e) => setMatrixSearch(e.target.value)}
              className="w-full bg-[#0a0e18] border border-[#262a35] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#dfe2f1] placeholder-[#908fa0] outline-none focus:border-[#4cd7f6] transition-colors"
            />
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#262a35] text-[#908fa0] font-mono-code text-[11px] uppercase">
                <th className="py-3 px-4">{language === 'fr' ? 'Objectif / Filière' : 'Goal / Track'}</th>
                <th className="py-3 px-4">{language === 'fr' ? 'Alignement Certifications' : 'Industry Credentials Alignment'}</th>
                <th className="py-3 px-4">{language === 'fr' ? 'Compétences Clés' : 'Core Competency Tags'}</th>
                <th className="py-3 px-4">{language === 'fr' ? 'Niveau' : 'Target Level'}</th>
                <th className="py-3 px-4 text-right">{language === 'fr' ? 'Action' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262a35]/60 font-body">
              {filteredMatrix.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#1c1f2a]/60 transition-colors group cursor-pointer"
                  onClick={() => {
                    onNavigate('my-study-dashboard');
                  }}
                >
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block text-sm">{row.goal}</span>
                    <span className="text-[11px] text-[#908fa0] font-mono-code">{row.subGoal}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#dfe2f1] max-w-md leading-relaxed">
                    {row.certList && row.certList.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {row.certList.map((c, cIdx) => (
                          <a
                            key={cIdx}
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title={
                              language === 'fr'
                                ? `Accéder au programme officiel de ${c.name}`
                                : `Open official ${c.name} program page`
                            }
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0a0e18] hover:bg-[#8083ff] text-[#dfe2f1] hover:text-white border border-[#262a35] hover:border-[#8083ff] text-[11px] font-mono-code transition-all group/badge shadow-sm"
                          >
                            <span className="text-[#4cd7f6] font-bold">{c.code}:</span>
                            <span className="truncate max-w-[170px]">{c.name}</span>
                            <span className="material-symbols-outlined text-[13px] opacity-60 group-hover/badge:opacity-100">
                              open_in_new
                            </span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      row.certifications
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1.5">
                      {row.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded bg-[#0a0e18] border border-[#262a35] text-[10px] font-mono-code text-[#c7c4d7]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono-code font-bold ${row.levelBadgeClass}`}>
                      {row.domainLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('my-study-dashboard');
                      }}
                      className="px-3 py-1 rounded-lg bg-[#262a35] hover:bg-[#8083ff] hover:text-white text-xs font-mono-code text-[#dfe2f1] transition-all"
                    >
                      {language === 'fr' ? 'Ouvrir' : 'Study Deck'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certification Program & Blueprint Modal */}
      <CertificationProgramModal
        cert={selectedCertForModal}
        isOpen={Boolean(selectedCertForModal)}
        onClose={() => setSelectedCertForModal(null)}
        onNavigate={onNavigate}
        onSelectAsTarget={(certCode) => {
          onNavigate('my-study-dashboard');
        }}
      />
    </div>
  );
};
