import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const { language } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Parent triggers opening
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickItems = [
    {
      title: language === 'fr'
        ? 'AWS Certified Cloud Practitioner (CLF-C02) : Guide Domaine 1 Cloud Concepts (24%)'
        : 'AWS Certified Cloud Practitioner (CLF-C02): Domain 1 Cloud Concepts Guide (24%)',
      category: language === 'fr' ? 'Programme Officiel' : 'Official Syllabus',
      tab: 'clf-c02-hub' as ActiveTab,
      badge: '24% Blueprint',
      badgeColor: 'text-[#ffb95f] bg-[#ff9900]/10',
    },
    {
      title: language === 'fr'
        ? 'Jeu des 50 Flashcards CLF-C02 (Questions, Règles d’Or & Pièges d’Examen)'
        : '50 CLF-C02 Flashcards Deck (Questions, Rules of Thumb & Exam Traps)',
      category: language === 'fr' ? 'Cartes Mémos' : 'Flashcard Deck',
      tab: 'clf-c02-hub' as ActiveTab,
      badge: '50 Cards',
      badgeColor: 'text-[#4cd7f6] bg-[#4cd7f6]/10',
    },
    {
      title: 'AWS Certified Solutions Architect – Associate (SAA-C03)',
      category: language === 'fr' ? 'Objectif d’Examen' : 'Exam Target',
      tab: 'my-study-dashboard' as ActiveTab,
      badge: language === 'fr' ? 'Objectif Actif' : 'Active Goal',
      badgeColor: 'text-[#ffb95f] bg-[#ffb95f]/10',
    },
    {
      title: language === 'fr'
        ? 'Laboratoire d’Examen Pratique #03 (Question 25 : Redis vs Aurora)'
        : 'Practice Exam Simulation Lab #03 (Question 25: Redis vs Aurora)',
      category: language === 'fr' ? 'Lab Simulé' : 'Simulated Lab',
      tab: 'practice-exam-lab' as ActiveTab,
      badge: language === 'fr' ? 'En Cours' : 'In Progress',
      badgeColor: 'text-[#4cd7f6] bg-[#4cd7f6]/10',
    },
    {
      title: language === 'fr'
        ? 'Matrice d’Équivalences Multi-Cloud (Calcul, Stockage, K8s)'
        : 'Service Equivalency & Comparison Matrix (Compute, Storage, K8s)',
      category: language === 'fr' ? 'Aide-Mémoire' : 'Cheatsheet',
      tab: 'cheatsheets-and-playground' as ActiveTab,
      badge: '142 Items',
      badgeColor: 'text-[#c0c1ff] bg-[#c0c1ff]/10',
    },
    {
      title: language === 'fr'
        ? 'Bac à sable Topologie HA 3-Tiers (ALB, ASG, RDS Multi-AZ)'
        : '3-Tier HA Topology Sandbox (ALB, ASG, RDS Multi-AZ Failover)',
      category: language === 'fr' ? 'Sandbox Interactif' : 'Interactive Sandbox',
      tab: 'cheatsheets-and-playground' as ActiveTab,
      badge: language === 'fr' ? 'Simulateur Live' : 'Live Simulator',
      badgeColor: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      title: language === 'fr'
        ? 'Parcours Ingénieur Cloud Architect & Matrice de Certifications'
        : 'Cloud Architect Career Pathway & Cert Matrix',
      category: language === 'fr' ? 'Parcours Carrière' : 'Career Track',
      tab: 'career-pathways' as ActiveTab,
      badge: language === 'fr' ? 'Niveau Expert' : 'Expert Track',
      badgeColor: 'text-[#ffb95f] bg-[#ffb95f]/10',
    },
    {
      title: language === 'fr'
        ? 'Commandes Rapides CKA & Snapshots etcd'
        : 'CKA Instant Speed Commands & etcd Snapshot Cheat',
      category: language === 'fr' ? 'Commandes Clés' : 'Speed Imperatives',
      tab: 'cheatsheets-and-playground' as ActiveTab,
      badge: 'CKA Prep',
      badgeColor: 'text-[#8083ff] bg-[#8083ff]/10',
    },
  ];

  const filtered = query.trim()
    ? quickItems.filter((i) =>
        i.title.toLowerCase().includes(query.toLowerCase()) ||
        i.category.toLowerCase().includes(query.toLowerCase())
      )
    : quickItems;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-24 px-4">
      <div className="bg-[#1c1f2a] border border-[#313540] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Search Input */}
        <div className="p-4 border-b border-[#262a35] flex items-center gap-3">
          <span className="material-symbols-outlined text-[#908fa0] text-[22px]">search</span>
          <input
            autoFocus
            type="text"
            placeholder={
              language === 'fr'
                ? 'Rechercher spécifications, blueprints, examens, commandes CKA...'
                : 'Search multi-cloud specs, blueprints, exams, CKA commands...'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-[#dfe2f1] placeholder-[#908fa0] text-sm font-medium"
          />
          <button
            onClick={onClose}
            className="text-[11px] font-mono-code px-2 py-1 rounded bg-[#262a35] text-[#908fa0] hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#908fa0] font-mono-code text-xs">
              {language === 'fr'
                ? `Aucun module architectural trouvé pour « ${query} »`
                : `No matching architectural modules found for “${query}”`}
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onNavigate(item.tab);
                  onClose();
                }}
                className="p-3 rounded-xl bg-[#0a0e18]/60 hover:bg-[#262a35] border border-[#262a35]/60 hover:border-[#4cd7f6]/40 flex items-center justify-between cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#171b26] flex items-center justify-center text-[#4cd7f6] group-hover:bg-[#8083ff]/20 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">terminal</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#dfe2f1] group-hover:text-white transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-mono-code text-[#908fa0]">{item.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-[#908fa0] group-hover:text-white transition-colors">
                    arrow_forward
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#0a0e18] border-t border-[#262a35] flex items-center justify-between text-[11px] font-mono-code text-[#908fa0]">
          <div className="flex items-center gap-3">
            <span>{language === 'fr' ? 'Navigation : Cliquer pour ouvrir' : 'Navigation: Click to jump'}</span>
            <span>•</span>
            <span>{language === 'fr' ? 'Raccourci : ⌘K / Ctrl+K' : 'Shortcut: ⌘K / Ctrl+K'}</span>
          </div>
          <span className="text-[#4cd7f6]">Cloudor v4.8</span>
        </div>
      </div>
    </div>
  );
};
