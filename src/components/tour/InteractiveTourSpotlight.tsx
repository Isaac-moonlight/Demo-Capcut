import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';
import { useTour } from '../../context/TourContext';
import { playServiceBell } from '../../lib/audio';

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

export const InteractiveTourSpotlight: React.FC = () => {
  const {
    currentStep,
    currentStepIndex,
    totalSteps,
    status,
    skipTour,
    notifyActionDone,
  } = useTour();

  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [placement, setPlacement] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const [actionBurst, setActionBurst] = useState<{ x: number; y: number } | null>(null);
  const targetElRef = useRef<HTMLElement | null>(null);

  // Measure and track target element in real time
  const updateTargetRect = useCallback(() => {
    if (!currentStep || status !== 'active') {
      setTargetRect(null);
      return;
    }

    const el = document.querySelector(currentStep.targetSelector) as HTMLElement | null;
    if (el) {
      targetElRef.current = el;
      const rect = el.getBoundingClientRect();
      
      // If element is hidden or 0x0, wait
      if (rect.width === 0 && rect.height === 0) {
        return;
      }

      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom,
        right: rect.right,
      });

      // Determine best placement for arrow & tooltip
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceLeft = rect.left;
      const spaceRight = window.innerWidth - rect.right;

      // Prefer explicit preferred position if specified
      if (currentStep.position === 'top' && spaceAbove >= 80) {
        setPlacement('top');
      } else if (currentStep.position === 'bottom' && spaceBelow >= 80) {
        setPlacement('bottom');
      } else if (currentStep.position === 'left' && spaceLeft >= 180) {
        setPlacement('left');
      } else if (currentStep.position === 'right' && spaceRight >= 180) {
        setPlacement('right');
      } else {
        // Auto: choose side with maximum comfort
        if (spaceAbove >= 95) {
          setPlacement('top');
        } else if (spaceBelow >= 95) {
          setPlacement('bottom');
        } else if (spaceRight >= 180) {
          setPlacement('right');
        } else if (spaceLeft >= 180) {
          setPlacement('left');
        } else {
          setPlacement('bottom');
        }
      }
    } else {
      setTargetRect(null);
    }
  }, [currentStep, status]);

  // Continuously track target element on step change, resize, scroll, or DOM mutation
  useEffect(() => {
    if (!currentStep || status !== 'active') return;

    let attempts = 0;
    const interval = setInterval(() => {
      attempts += 1;
      const el = document.querySelector(currentStep.targetSelector) as HTMLElement | null;
      if (el) {
        clearInterval(interval);
        // Scroll into view if needed
        const rect = el.getBoundingClientRect();
        const isInViewport =
          rect.top >= 60 &&
          rect.bottom <= window.innerHeight - 60 &&
          rect.left >= 10 &&
          rect.right <= window.innerWidth - 10;

        if (!isInViewport) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
        updateTargetRect();
      } else if (attempts > 30) {
        clearInterval(interval);
      }
    }, 100);

    const handleUpdate = () => updateTargetRect();
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);

    const observer = new MutationObserver(handleUpdate);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
      observer.disconnect();
    };
  }, [currentStep, status, updateTargetRect]);

  // Click capture listener on document: advances step ONLY when user actually clicks target!
  useEffect(() => {
    if (!currentStep || status !== 'active') return;

    const handleDocumentClick = (e: MouseEvent) => {
      const clickTarget = e.target as HTMLElement | null;
      if (!clickTarget) return;

      const targetEl = document.querySelector(currentStep.targetSelector) as HTMLElement | null;
      if (!targetEl) return;

      // Check if clicked element is target or inside target
      const isMatch =
        targetEl === clickTarget ||
        targetEl.contains(clickTarget) ||
        !!clickTarget.closest(currentStep.targetSelector);

      if (isMatch) {
        // Trigger subtle chime & burst
        playServiceBell(1980);
        setActionBurst({ x: e.clientX, y: e.clientY });

        setTimeout(() => {
          setActionBurst(null);
          notifyActionDone(currentStep.id);
        }, 220);
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
    };
  }, [currentStep, status, notifyActionDone]);

  if (status !== 'active' || !currentStep || !targetRect) {
    return null;
  }

  // Calculate coordinates for Arrow & Bubble
  const targetCenterX = targetRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top + targetRect.height / 2;

  // Clamp bubble horizontally inside viewport
  const tooltipWidth = 320;
  const halfTooltip = tooltipWidth / 2;
  const clampedX = Math.max(16 + halfTooltip, Math.min(window.innerWidth - 16 - halfTooltip, targetCenterX));

  // Determine positions based on placement
  let bubbleTop = 0;
  let bubbleLeft = clampedX;
  let arrowTop = 0;
  let arrowLeft = targetCenterX;

  if (placement === 'top') {
    bubbleTop = targetRect.top - 64;
    arrowTop = targetRect.top - 12;
  } else if (placement === 'bottom') {
    bubbleTop = targetRect.bottom + 28;
    arrowTop = targetRect.bottom + 8;
  } else if (placement === 'left') {
    bubbleTop = targetCenterY - 20;
    bubbleLeft = Math.max(halfTooltip + 10, targetRect.left - halfTooltip - 16);
    arrowTop = targetCenterY;
    arrowLeft = targetRect.left - 12;
  } else {
    // right
    bubbleTop = targetCenterY - 20;
    bubbleLeft = Math.min(window.innerWidth - halfTooltip - 10, targetRect.right + halfTooltip + 16);
    arrowTop = targetCenterY;
    arrowLeft = targetRect.right + 12;
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none overflow-hidden">
      {/* 1. PULSING TARGET HIGHLIGHT BORDER */}
      <motion.div
        key={`highlight-${currentStep.id}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        style={{
          top: targetRect.top - 4,
          left: targetRect.left - 4,
          width: targetRect.width + 8,
          height: targetRect.height + 8,
        }}
        className="absolute rounded-2xl border-2 border-amber-400 dark:border-[#ff9f0a] shadow-[0_0_25px_rgba(255,159,10,0.7)] pointer-events-none"
      >
        {/* Subtle breathing ripple */}
        <div className="absolute -inset-1.5 rounded-2xl border border-amber-400/50 animate-ping pointer-events-none" />
      </motion.div>

      {/* 2. THE ANIMATED ARROW (POINTER) */}
      <motion.div
        key={`arrow-${currentStep.id}-${placement}`}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{
          opacity: 1,
          scale: 1,
          y:
            placement === 'top'
              ? [0, -6, 0]
              : placement === 'bottom'
              ? [0, 6, 0]
              : 0,
          x:
            placement === 'left'
              ? [0, -6, 0]
              : placement === 'right'
              ? [0, 6, 0]
              : 0,
        }}
        transition={{
          y: { repeat: Infinity, duration: 1.1, ease: 'easeInOut' },
          x: { repeat: Infinity, duration: 1.1, ease: 'easeInOut' },
          opacity: { duration: 0.2 },
        }}
        style={{
          top: arrowTop,
          left: arrowLeft,
          transform: 'translate(-50%, -50%)',
        }}
        className="absolute z-50 pointer-events-none flex items-center justify-center filter drop-shadow-[0_4px_12px_rgba(255,159,10,0.85)]"
      >
        {/* SVG Arrow rendering matching the exact direction */}
        {placement === 'top' && (
          // Points DOWN towards element
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-amber-400 fill-amber-400">
            <path
              d="M12 21L4 12H9V3H15V12H20L12 21Z"
              stroke="#000"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {placement === 'bottom' && (
          // Points UP towards element
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-amber-400 fill-amber-400">
            <path
              d="M12 3L20 12H15V21H9V12H4L12 3Z"
              stroke="#000"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {placement === 'left' && (
          // Points RIGHT towards element
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-amber-400 fill-amber-400">
            <path
              d="M21 12L12 4V9H3V15H12V20L21 12Z"
              stroke="#000"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {placement === 'right' && (
          // Points LEFT towards element
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-amber-400 fill-amber-400">
            <path
              d="M3 12L12 20V15H21V9H12V4L3 12Z"
              stroke="#000"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </motion.div>

      {/* 3. ATTACHED DIRECTIVE TOOLTIP PILL */}
      <motion.div
        key={`bubble-${currentStep.id}`}
        initial={{ opacity: 0, scale: 0.9, y: placement === 'top' ? 8 : -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          top: bubbleTop,
          left: bubbleLeft,
          transform: 'translate(-50%, -50%)',
        }}
        className="absolute z-50 pointer-events-auto"
      >
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#0d1017]/95 backdrop-blur-xl border border-amber-400/60 text-white shadow-[0_12px_40px_rgba(0,0,0,0.85)] max-w-[340px] ring-1 ring-amber-400/30">
          {/* Pulsing beacon indicator */}
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0 shadow-[0_0_8px_#ff9f0a]" />

          {/* Action text */}
          <span className="text-xs font-black tracking-tight text-amber-200">
            {currentStep.actionInstruction}
          </span>

          {/* Step badge */}
          <span className="text-[10px] font-bold text-stone-400 px-1.5 py-0.5 rounded-md bg-stone-800 flex-shrink-0">
            {currentStepIndex + 1}/{totalSteps}
          </span>

          {/* Discreet close/pause button */}
          <button
            type="button"
            onClick={skipTour}
            className="p-1 -mr-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer flex-shrink-0"
            title="Mettre le guide en pause"
            aria-label="Pause guide"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* 4. SUCCESS MICRO-INTERACTION BURST */}
      <AnimatePresence>
        {actionBurst && (
          <motion.div
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              top: actionBurst.y,
              left: actionBurst.x,
              transform: 'translate(-50%, -50%)',
            }}
            className="fixed z-50 pointer-events-none flex items-center justify-center"
          >
            <div className="p-2 rounded-full bg-amber-400 text-stone-950 shadow-xl">
              <CheckCircle2 className="w-6 h-6 stroke-[3]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
