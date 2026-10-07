import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { TourContextType, TourStatus, TourStep } from '../types/tour';
import { TOUR_CHAPTERS, TOUR_STEPS } from '../data/tourSteps';

const STORAGE_STATUS_KEY = 'dineflow_demo_tour_status';
const STORAGE_STEP_KEY = 'dineflow_demo_tour_step_idx';

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<TourStatus>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STATUS_KEY) as TourStatus;
      if (saved && ['not_started', 'active', 'completed', 'dismissed'].includes(saved)) {
        return saved;
      }
      return 'active';
    } catch {
      return 'active';
    }
  });

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(() => {
    try {
      const savedIdx = localStorage.getItem(STORAGE_STEP_KEY);
      const parsed = savedIdx ? parseInt(savedIdx, 10) : 0;
      return !isNaN(parsed) && parsed >= 0 && parsed < TOUR_STEPS.length ? parsed : 0;
    } catch {
      return 0;
    }
  });

  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState<boolean>(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STATUS_KEY, status);
    } catch (e) {
      console.warn('Unable to persist tour status to localStorage', e);
    }
  }, [status]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STEP_KEY, currentStepIndex.toString());
    } catch (e) {
      console.warn('Unable to persist tour step to localStorage', e);
    }
  }, [currentStepIndex]);

  const currentStep = useMemo<TourStep | null>(() => {
    if (status !== 'active') return null;
    return TOUR_STEPS[currentStepIndex] || null;
  }, [status, currentStepIndex]);

  const currentChapter = useMemo(() => {
    if (!currentStep) return null;
    return TOUR_CHAPTERS.find((c) => c.id === currentStep.chapterId) || null;
  }, [currentStep]);

  const startTour = useCallback((fromIndex = 0) => {
    const validIndex = Math.max(0, Math.min(fromIndex, TOUR_STEPS.length - 1));
    setCurrentStepIndex(validIndex);
    setStatus('active');
    setIsWelcomeOpen(false);
    setIsCompletionOpen(false);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      const nextIdx = prev + 1;
      if (nextIdx >= TOUR_STEPS.length) {
        setStatus('completed');
        setIsCompletionOpen(true);
        return prev;
      }
      return nextIdx;
    });
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const skipTour = useCallback(() => {
    setStatus('dismissed');
    setIsWelcomeOpen(false);
    setIsCompletionOpen(false);
  }, []);

  const restartTour = useCallback(() => {
    setCurrentStepIndex(0);
    setStatus('active');
    setIsWelcomeOpen(false);
    setIsCompletionOpen(false);
  }, []);

  const goToChapter = useCallback((chapterId: string) => {
    const targetStepIdx = TOUR_STEPS.findIndex((s) => s.chapterId === chapterId);
    if (targetStepIdx !== -1) {
      setCurrentStepIndex(targetStepIdx);
      setStatus('active');
      setIsWelcomeOpen(false);
      setIsCompletionOpen(false);
    }
  }, []);

  const closeWelcome = useCallback(() => {
    setIsWelcomeOpen(false);
  }, []);

  const closeCompletion = useCallback(() => {
    setIsCompletionOpen(false);
  }, []);

  // Action validation notification
  const notifyActionDone = useCallback((stepId: string) => {
    if (currentStep && currentStep.id === stepId) {
      setTimeout(() => {
        nextStep();
      }, 350);
    }
  }, [currentStep, nextStep]);

  return (
    <TourContext.Provider
      value={{
        status,
        currentStepIndex,
        currentStep,
        currentChapter,
        totalSteps: TOUR_STEPS.length,
        isWelcomeOpen,
        isCompletionOpen,
        isSpotlightVisible: status === 'active' && !!currentStep,
        startTour,
        nextStep,
        prevStep,
        skipTour,
        restartTour,
        goToChapter,
        closeWelcome,
        closeCompletion,
        notifyActionDone,
        chapters: TOUR_CHAPTERS,
        steps: TOUR_STEPS,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
