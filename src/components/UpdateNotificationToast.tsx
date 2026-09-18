import React from 'react';
import { useSystemUpdate } from '../context/SystemUpdateContext';
import { useLanguage } from '../context/LanguageContext';

export const UpdateNotificationToast: React.FC = () => {
  const { language } = useLanguage();
  const {
    status,
    pendingUpdate,
    showUpdateToast,
    dismissUpdateToast,
    applyUpdate,
    setIsSettingsOpen,
  } = useSystemUpdate();

  if (!showUpdateToast || !pendingUpdate || status !== 'ready') {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-4 rounded-2xl bg-[#131722]/95 backdrop-blur-xl border border-[#4cd7f6]/50 shadow-2xl shadow-black/80 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8083ff] to-[#4cd7f6] flex items-center justify-center text-[#0f131d] shadow-md shrink-0">
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white font-display flex items-center gap-1.5">
                <span>{language === 'fr' ? 'Mise à Jour Prête' : 'Update Ready'}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono-code font-bold bg-[#4cd7f6]/20 text-[#4cd7f6]">
                  {pendingUpdate.version}
                </span>
              </h4>
              <p className="text-[11px] text-[#c7c4d7] mt-0.5">
                {language === 'fr'
                  ? 'Téléchargée et préparée en arrière-plan.'
                  : 'Downloaded and prepared in background.'}
              </p>
            </div>
          </div>

          <button
            onClick={dismissUpdateToast}
            className="text-[#908fa0] hover:text-white p-1 rounded-md transition-colors"
            title={language === 'fr' ? 'Ignorer pour le moment' : 'Dismiss for now'}
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div className="flex items-center gap-2 pt-1 font-mono-code text-xs">
          <button
            onClick={applyUpdate}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#4cd7f6] to-[#8083ff] text-[#0f131d] font-bold hover:brightness-110 shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">restart_alt</span>
            <span>{language === 'fr' ? 'Redémarrer & Appliquer' : 'Apply & Restart'}</span>
          </button>

          <button
            onClick={() => {
              dismissUpdateToast();
              setIsSettingsOpen(true);
            }}
            className="py-2 px-3 rounded-xl bg-[#1c202c] hover:bg-[#262a35] text-[#dfe2f1] hover:text-white border border-[#313540] transition-colors cursor-pointer"
            title={language === 'fr' ? 'Détails des changements' : 'Changelog details'}
          >
            {language === 'fr' ? 'Détails' : 'Notes'}
          </button>
        </div>
      </div>
    </div>
  );
};
