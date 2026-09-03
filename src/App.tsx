import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab, Provider } from './types';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CareerPathwaysView } from './components/CareerPathwaysView';
import { StudyDashboardView } from './components/StudyDashboardView';
import { PracticeExamLabView } from './components/PracticeExamLabView';
import { CheatsheetsPlaygroundView } from './components/CheatsheetsPlaygroundView';
import { ClfC02LearningHub } from './components/ClfC02LearningHub';
import { QuickSearchModal } from './components/QuickSearchModal';
import { SkillAssessmentModal } from './components/SkillAssessmentModal';

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
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Global Modals */}
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
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
