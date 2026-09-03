import React, { useState } from 'react';
import { ActiveTab } from '../types';

interface SkillAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrack: (trackId: string, tab: ActiveTab) => void;
}

export const SkillAssessmentModal: React.FC<SkillAssessmentModalProps> = ({
  isOpen,
  onClose,
  onSelectTrack,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  if (!isOpen) return null;

  const questions = [
    {
      question: 'What is your primary experience level with public cloud platforms (AWS, Azure, GCP)?',
      options: [
        'None or minimal (< 6 months). Looking to build foundational skills.',
        '1-2 years deploying VMs, basic VPCs, or writing simple Lambda functions.',
        '3+ years architecting multi-region systems, hybrid networks, or enterprise migrations.',
        'Heavy focus on Kubernetes clusters, CI/CD pipelines, and Terraform IaC.',
      ],
      trackRecommendation: ['it-beginner', 'cloud-developer', 'cloud-architect', 'devops-sre'],
    },
    {
      question: 'Which daily operational scenario excites you the most?',
      options: [
        'Understanding cloud pricing models, security policies, and foundational concepts.',
        'Writing serverless event-driven code and integrating managed NoSQL databases.',
        'Designing zero-downtime multi-AZ/multi-region failover and transit gateway network topologies.',
        'Tuning ML vector embeddings, streaming pipelines with Kafka/Kinesis, and AI model inference.',
      ],
      trackRecommendation: ['it-beginner', 'cloud-developer', 'cloud-architect', 'data-ai'],
    },
    {
      question: 'What is your target timeline for achieving your next certification?',
      options: [
        'Fast-track: 4 to 6 weeks for entry-level cert (CLF-C02 or AZ-900).',
        'Deep dive: 8 to 12 weeks for Associate-level Solutions Architect (SAA-C03).',
        'Advanced: 14 to 18 weeks for Professional or Specialty (SAP-C02 or CKA).',
        'Flexible learning while practicing real hands-on sandbox labs.',
      ],
      trackRecommendation: ['it-beginner', 'cloud-architect', 'devops-sre', 'cloud-architect'],
    },
  ];

  const handleSelectOption = (idx: number) => {
    setSelectedAnswers({ ...selectedAnswers, [currentStep]: idx });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const q = questions[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#1c1f2a] border border-[#313540] rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-[#262a35]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">psychology</span>
            <h3 className="font-display font-bold text-white text-base">Architect Diagnostic Skill Assessment</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#262a35] text-[#908fa0] hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {!showResults ? (
          <div className="py-6 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono-code text-[#908fa0]">
              <span>QUESTION {currentStep + 1} OF {questions.length}</span>
              <span className="text-[#4cd7f6]">{Math.round(((currentStep + 1) / questions.length) * 100)}% COMPLETE</span>
            </div>

            <div className="w-full bg-[#0a0e18] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#4cd7f6] to-[#8083ff] h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            <h4 className="text-sm font-semibold text-[#dfe2f1] leading-relaxed">
              {q.question}
            </h4>

            <div className="space-y-2.5">
              {q.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentStep] === optIdx;
                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#8083ff]/15 border-[#8083ff] text-white shadow-sm'
                        : 'bg-[#0a0e18] border-[#262a35] text-[#c7c4d7] hover:border-[#464554]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                        isSelected ? 'border-[#8083ff] bg-[#8083ff]' : 'border-[#908fa0]'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </div>
                    <span className="leading-relaxed">{opt}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 rounded-lg bg-[#262a35] disabled:opacity-40 text-xs font-semibold text-[#dfe2f1]"
              >
                Back
              </button>
              <button
                disabled={selectedAnswers[currentStep] === undefined}
                onClick={handleNext}
                className="px-5 py-2 rounded-lg bg-[#8083ff] hover:bg-[#8083ff]/90 disabled:opacity-40 text-xs font-bold text-white shadow-md transition-all flex items-center gap-1.5"
              >
                <span>{currentStep === questions.length - 1 ? 'Analyze Diagnostic' : 'Next Question'}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6 space-y-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#4cd7f6]/20 border border-[#4cd7f6]/40 flex items-center justify-center mx-auto text-[#4cd7f6]">
              <span className="material-symbols-outlined text-[32px]">verified</span>
            </div>

            <div>
              <span className="text-[11px] font-mono-code uppercase tracking-wider text-[#ffb95f]">
                Recommended Architecture Track
              </span>
              <h4 className="text-xl font-display font-bold text-white mt-1">
                Cloud Architect (SAA-C03 / AZ-305)
              </h4>
              <p className="text-xs text-[#c7c4d7] max-w-md mx-auto mt-2 leading-relaxed">
                Based on your experience and objectives, you are primed for the high-yield Solutions Architect pathway. Target readiness index is estimated at 65%.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0a0e18] border border-[#262a35] grid grid-cols-2 gap-4 text-left font-mono-code text-[11px]">
              <div>
                <span className="text-[#908fa0] block">Estimated Duration</span>
                <span className="text-white font-bold">12–16 Weeks</span>
              </div>
              <div>
                <span className="text-[#908fa0] block">Hands-on Ratio</span>
                <span className="text-[#4cd7f6] font-bold">75% Labs</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg bg-[#262a35] hover:bg-[#313540] text-xs font-semibold text-[#dfe2f1]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onSelectTrack('cloud-architect', 'my-study-dashboard');
                  onClose();
                }}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] text-xs font-bold text-[#0f131d] shadow-lg hover:opacity-95 transition-opacity"
              >
                Activate Track & Open Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
