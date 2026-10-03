import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab, Provider } from './types';
import { LanguageProvider } from './context/LanguageContext';
import { SystemUpdateProvider } from './context/SystemUpdateContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CareerPathwaysView } from './components/CareerPathwaysView';
import { StudyDashboardView } from './components/StudyDashboardView';
import { PracticeExamLabView } from './components/PracticeExamLabView';
import { CheatsheetsPlaygroundView } from './components/CheatsheetsPlaygroundView';
import { ClfC02LearningHub } from './components/ClfC02LearningHub';
import { Az900LearningHub } from './components/Az900LearningHub';
import { Cv0004LearningHub } from './components/Cv0004LearningHub';
import { SaaC03LearningHub } from './components/SaaC03LearningHub';
import { SapC02LearningHub } from './components/SapC02LearningHub';
import { Az305LearningHub } from './components/Az305LearningHub';
import { Pca2025LearningHub } from './components/Pca2025LearningHub';
import { DvaC02LearningHub } from './components/DvaC02LearningHub';
import { Az204LearningHub } from './components/Az204LearningHub';
import { PdeGcpLearningHub } from './components/PdeGcpLearningHub';
import { MlsC01LearningHub } from './components/MlsC01LearningHub';
import { QuickSearchModal } from './components/QuickSearchModal';
import { SkillAssessmentModal } from './components/SkillAssessmentModal';
import { SystemSettingsModal } from './components/SystemSettingsModal';
import { UpdateNotificationToast } from './components/UpdateNotificationToast';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('career-pathways');
  const [selectedProviderFilter, setSelectedProviderFilter] = useState<Provider>('all');
  const [activeTrackId, setActiveTrackId] = useState<string>('cloud-architect');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

  const handleSelectTrack = (trackId: string, targetTab?: ActiveTab) => {
    setActiveTrackId(trackId);
    if (targetTab) {
      setActiveTab(targetTab);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f131d] text-[#dfe2f1] flex flex-col font-body selection:bg-[#c0c1ff]/30 selection:text-white">
      {/* Fixed Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        selectedProviderFilter={selectedProviderFilter}
        setSelectedProviderFilter={setSelectedProviderFilter}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <AnimatePresence mode="wait">
          {activeTab === 'career-pathways' && (
            <motion.div
              key="career-pathways"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CareerPathwaysView
                onNavigate={setActiveTab}
                onSelectTrack={(id) => handleSelectTrack(id)}
                onOpenAssessment={() => setIsAssessmentOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'my-study-dashboard' && (
            <motion.div
              key="my-study-dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <StudyDashboardView
                onNavigate={setActiveTab}
                activeTrackId={activeTrackId}
              />
            </motion.div>
          )}

          {activeTab === 'practice-exam-lab' && (
            <motion.div
              key="practice-exam-lab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <PracticeExamLabView onNavigate={setActiveTab} />
            </motion.div>
          )}

          {activeTab === 'cheatsheets-and-playground' && (
            <motion.div
              key="cheatsheets-and-playground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CheatsheetsPlaygroundView />
            </motion.div>
          )}

          {activeTab === 'clf-c02-hub' && (
            <motion.div
              key="clf-c02-hub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ClfC02LearningHub onNavigate={setActiveTab} />
            </motion.div>
          )}

          {activeTab === 'az-900-hub' && (
            <motion.div
              key="az-900-hub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Az900LearningHub onNavigate={setActiveTab} />
            </motion.div>
          )}

          {activeTab === 'cv0-004-hub' && (
            <motion.div
              key="cv0-004-hub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Cv0004LearningHub onNavigate={setActiveTab} />
            </motion.div>
          )}

          {activeTab === 'saa-c03-hub' && (
            <motion.div
              key="saa-c03-hub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SaaC03LearningHub onNavigate={setActiveTab} />
            </motion.div>
          )}

          {activeTab === 'sap-c02-hub' && (
            <motion.div
              key="sap-c02-hub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SapC02LearningHub onNavigate={setActiveTab} />
            </motion.div>
          )}

          {activeTab === 'az-305-hub' && (
            <motion.div
              key="az-305-hub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Az305LearningHub onNavigate={setActiveTab} />
            </motion.div>
          )}

          {activeTab === 'pca-2025-hub' && (
            <motion.div
              key="pca-2025-hub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Pca2025LearningHub onNavigate={setActiveTab} />
            </motion.div>
          )}

          {activeTab === 'dva-c02-hub' && (
            <motion.div
              key="dva-c02-hub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DvaC02LearningHub onNavigate={setActiveTab} />
            </motion.div>
          )}

          {activeTab === 'az-204-hub' && (
            <motion.div
              key="az-204-hub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Az204LearningHub onNavigate={setActiveTab} />
            </motion.div>
          )}

          {activeTab === 'pde-gcp-hub' && (
            <motion.div
              key="pde-gcp-hub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <PdeGcpLearningHub onNavigate={setActiveTab} />
            </motion.div>
          )}

          {activeTab === 'mls-c01-hub' && (
            <motion.div
              key="mls-c01-hub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <MlsC01LearningHub onNavigate={setActiveTab} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Global Modals & Notifications */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={setActiveTab}
      />

      <SkillAssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        onSelectTrack={handleSelectTrack}
      />

      {/* System Settings & Updates Modal */}
      <SystemSettingsModal />

      {/* Automatic Background Update Notification Toast */}
      <UpdateNotificationToast />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <SystemUpdateProvider>
        <AppContent />
      </SystemUpdateProvider>
    </LanguageProvider>
  );
}
