import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Sparkles, Sprout, ShieldAlert, Cpu } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ScanningAnimationProps {
  imagePreview: string;
  cropName: string;
  onComplete: () => void;
}

export const ScanningAnimation: React.FC<ScanningAnimationProps> = ({
  imagePreview,
  cropName,
  onComplete
}) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(10);

  const steps = [
    { title: 'Processing image & noise filtering', icon: Cpu },
    { title: `Identifying ${cropName} species & morphology`, icon: Sprout },
    { title: 'Detecting pathological disease signatures', icon: ShieldAlert },
    { title: 'Estimating infection severity grade', icon: Sparkles },
    { title: 'Preparing localized agronomic recommendations', icon: CheckCircle2 }
  ];

  useEffect(() => {
    // Progress counter animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 98) {
          clearInterval(progressInterval);
          return 99;
        }
        return prev + 1;
      });
    }, 45);

    // Step sequencer
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setTimeout(() => {
            setProgress(100);
            onComplete();
          }, 600);
          return prev;
        }
      });
    }, 850);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto space-y-6 text-center py-4">
      {/* Visual Scanning Viewport */}
      <div className="relative aspect-4/3 max-w-sm mx-auto rounded-2xl overflow-hidden border-2 border-agri-500/40 bg-stone-950 shadow-2xl">
        <img
          src={imagePreview}
          alt="Scanning leaf"
          className="w-full h-full object-cover opacity-80 filter contrast-125"
        />

        {/* Luminous Green Laser Beam */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_18px_#34d399] animate-scan-laser z-10" />

        {/* HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none border border-emerald-500/30 m-4 rounded-xl flex flex-col justify-between p-3 text-emerald-400 font-mono text-[11px]">
          <div className="flex justify-between items-center bg-black/60 px-2.5 py-1 rounded backdrop-blur-xs">
            <span>AGRISENSE_VISION_v2.4</span>
            <span className="animate-pulse">● LIVE_SCAN</span>
          </div>
          <div className="flex justify-between items-center bg-black/60 px-2.5 py-1 rounded backdrop-blur-xs">
            <span>CROP: {cropName.toUpperCase()}</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 max-w-md mx-auto">
        <div className="flex justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
          <span>{t('detect.analyzingText')}</span>
          <span className="text-agri-600 dark:text-agri-400 font-mono">{progress}%</span>
        </div>
        <div className="w-full h-2.5 bg-stone-200 dark:bg-darkbg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-agri-600 transition-all duration-150 ease-out rounded-full shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Sequenced Checklist */}
      <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-5 text-left max-w-md mx-auto space-y-3 shadow-sm">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs transition-colors ${
                isDone
                  ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                  : isCurrent
                  ? 'text-stone-900 dark:text-stone-100 font-semibold'
                  : 'text-stone-400 dark:text-stone-600'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-agri-600 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-stone-300 dark:border-darkbg-border" />
                )}
              </div>
              <span className="flex-1">{step.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
