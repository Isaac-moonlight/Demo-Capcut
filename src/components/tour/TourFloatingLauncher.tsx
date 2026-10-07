import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Play, RotateCcw, X, ChevronRight, Sparkles, BookOpen } from 'lucide-react';
import { useTour } from '../../context/TourContext';

export const TourFloatingLauncher: React.FC = () => {
  const {
    status,
    currentStepIndex,
    totalSteps,
    startTour,
    restartTour,
    goToChapter,
    chapters,
  } = useTour();

  const [isOpen, setIsOpen] = useState(false);

  // Don't show launcher if spotlight is active to keep screen clean
  if (status === 'active') return null;

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="px-3.5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-xs shadow-[0_8px_25px_rgba(245,158,11,0.5)] border border-amber-300 flex items-center gap-2 cursor-pointer transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-stone-950 fill-current animate-spin" />
          <span className="tracking-tight">Démo Interactive</span>
          <span className="w-2 h-2 rounded-full bg-stone-950 animate-ping" />
        </motion.button>
      </div>

      {/* Chapter Selection Drawer / Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl bg-[#0f131d] border border-amber-500/40 text-stone-100 shadow-2xl p-5 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-amber-300 tracking-tight">
                      Navigation Démo Interactive
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Explorez un chapitre précis ou relancez le parcours complet
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Quick Action */}
              <div className="pt-3 pb-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    startTour(0);
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Lancer la Démo Interactive Guidée ({chapters.length} Chapitres)</span>
                </button>
              </div>

              {/* Chapter list */}
              <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
                <span className="text-[10px] uppercase font-black tracking-wider text-stone-400 block px-1">
                  Accès Direct par Chapitre :
                </span>

                {chapters.map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      goToChapter(ch.id);
                    }}
                    className="w-full p-2.5 rounded-2xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/40 text-left flex items-center justify-between gap-2.5 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg p-1.5 rounded-xl bg-black/50 border border-stone-800 group-hover:border-amber-500/30 flex-shrink-0">
                        {ch.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black uppercase text-amber-400">
                            Ch. {ch.number}
                          </span>
                          <span className="text-xs font-bold text-stone-200 truncate group-hover:text-amber-200">
                            {ch.title}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-400 truncate">
                          {ch.subtitle}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    restartTour();
                  }}
                  className="text-xs text-stone-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Recommencer depuis l'accueil</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
