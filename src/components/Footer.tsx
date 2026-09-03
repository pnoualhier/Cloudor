import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const { t, language } = useLanguage();

  return (
    <>
      <footer className="mt-16 border-t border-[#262a35] bg-[#0a0e18] text-[#908fa0] text-xs py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#03b5d3] animate-pulse"></span>
              <span className="font-mono-code text-[11px] text-[#dfe2f1]">Cloudor Engine v4.8.2-prod</span>
            </div>
            <span className="text-[#313540]">|</span>
            <span className="text-[#c7c4d7]">
              {language === 'fr' ? 'Cadre d’Architecture Cloud Certifié' : 'Certified Cloud Architect Framework'}
            </span>
          </div>

          {/* Center Links */}
          <div className="flex items-center gap-6 font-mono-code text-[11px]">
            <button
              onClick={() => setShowStatusModal(true)}
              className="hover:text-[#4cd7f6] transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>{language === 'fr' ? 'Systèmes Opérationnels' : 'All Systems Operational'}</span>
            </button>
            <button
              onClick={() => setShowApiModal(true)}
              className="hover:text-[#c0c1ff] transition-colors"
            >
              {language === 'fr' ? 'Référence API' : 'API Reference'}
            </button>
            <a
              href="https://aws.amazon.com/certification/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              {language === 'fr' ? 'Programmes Officiels' : 'Official Blueprints'}
            </a>
            <span className="text-[#313540]">|</span>
            <span className="text-[#908fa0]">SAA-C03 • AZ-305 • PCA • CKA</span>
          </div>

          {/* Right copyright */}
          <div className="text-right font-mono-code text-[10px] text-[#908fa0]">
            © {new Date().getFullYear()} {t.footerCopyright}
          </div>
        </div>
      </footer>

      {/* System Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1f2a] border border-[#313540] rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#262a35]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <h3 className="font-display font-bold text-white text-base">
                  {language === 'fr' ? 'État des Systèmes Cloudor' : 'Cloudor Infrastructure Status'}
                </h3>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-1 rounded-lg hover:bg-[#262a35] text-[#908fa0] hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="py-4 space-y-3 font-mono-code text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0a0e18] border border-[#262a35]">
                <span className="text-[#dfe2f1]">AWS Test Sandbox (us-east-1)</span>
                <span className="text-emerald-400 font-bold">99.99% UP</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0a0e18] border border-[#262a35]">
                <span className="text-[#dfe2f1]">Azure Lab Orchestrator (East US)</span>
                <span className="text-emerald-400 font-bold">100.0% UP</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0a0e18] border border-[#262a35]">
                <span className="text-[#dfe2f1]">CKA Terminal Cluster Pool</span>
                <span className="text-emerald-400 font-bold">99.95% UP</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0a0e18] border border-[#262a35]">
                <span className="text-[#dfe2f1]">Exam Simulation Telemetry</span>
                <span className="text-emerald-400 font-bold">0 ms lag</span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 rounded-lg bg-[#262a35] hover:bg-[#313540] text-white text-xs font-semibold"
              >
                {language === 'fr' ? 'Fermer' : 'Dismiss'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Modal */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1f2a] border border-[#313540] rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#262a35]">
              <h3 className="font-display font-bold text-white text-base">{t.footerTelemetry}</h3>
              <button
                onClick={() => setShowApiModal(false)}
                className="p-1 rounded-lg hover:bg-[#262a35] text-[#908fa0] hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="py-4 space-y-3 font-mono-code text-xs">
              <p className="text-[#c7c4d7]">
                {language === 'fr'
                  ? 'Connectez vos pipelines CI/CD, notifications Slack ou tableaux d’étude personnalisés via les API Cloudor :'
                  : 'Connect your automated CI/CD pipelines, Slack notifications, or personal study dashboards using Cloudor endpoints:'}
              </p>
              <div className="p-3 rounded-lg bg-[#0a0e18] border border-[#262a35] text-[#4cd7f6] overflow-x-auto">
                <code>GET https://api.cloudor.internal/v1/exams/saa-c03/readiness</code>
              </div>
              <div className="p-3 rounded-lg bg-[#0a0e18] border border-[#262a35] text-[#c0c1ff] overflow-x-auto">
                <code>POST https://api.cloudor.internal/v1/labs/trigger-failover</code>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowApiModal(false)}
                className="px-4 py-2 rounded-lg bg-[#8083ff] hover:bg-[#8083ff]/90 text-white text-xs font-semibold"
              >
                {language === 'fr' ? 'Terminé' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
