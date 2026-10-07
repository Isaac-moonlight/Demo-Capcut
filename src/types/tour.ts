export type TourActionType = 'click' | 'input' | 'state_change' | 'observe';

export interface TourChapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
}

export interface TourStep {
  id: string;
  chapterId?: string;
  stepNumber?: number;
  totalStepsInChapter?: number;
  globalIndex: number;
  title: string;
  targetSelector: string; // CSS selector or data-tour
  actionInstruction: string; // Ce que le visiteur doit faire
  arrowDirection?: 'up' | 'down' | 'left' | 'right' | 'auto';
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'auto';
  requiresView?: 'client' | 'staff';
  requiresStaffSection?: 'kds' | 'pos' | 'tables' | 'erp';
  autoPrepare?: () => void;
  skipCondition?: () => boolean;
}

export type TourStatus = 'not_started' | 'active' | 'completed' | 'dismissed';

export interface TourContextType {
  status: TourStatus;
  currentStepIndex: number;
  currentStep: TourStep | null;
  currentChapter: TourChapter | null;
  totalSteps: number;
  isWelcomeOpen: boolean;
  isCompletionOpen: boolean;
  isSpotlightVisible: boolean;
  startTour: (fromIndex?: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  restartTour: () => void;
  goToChapter: (chapterId: string) => void;
  closeWelcome: () => void;
  closeCompletion: () => void;
  notifyActionDone: (stepId: string) => void;
  chapters: TourChapter[];
  steps: TourStep[];
}
