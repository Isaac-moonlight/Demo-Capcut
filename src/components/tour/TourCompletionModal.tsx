import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Compass, RotateCcw, CheckCircle2, TrendingUp, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useTour } from '../../context/TourContext';
import { GastronomyLogo } from '../common/GastronomyLogo';

export const TourCompletionModal: React.FC = () => {
  const { isCompletionOpen, restartTour, closeCompletion } = useTour();

  if (!isCompletionOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-3xl bg-[#0f131d] border border-emerald-500/40 text-stone-100 shadow-[0_25px_70px_rgba(0,0,0,0.9)] p-6 sm:p-8 text-center overflow-hidden"
        >
          {/* Ambient emerald & gold glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Logo & Trophy badge */}
          <div className="flex justify-center mb-3 relative z-10">
            <div className="relative">
              <GastronomyLogo size="sm" showText={false} />
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-stone-950 shadow-md">
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>Visite Interactive Complète Validée</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-display-luxury text-amber-200 tracking-tight">
              Félicitations !
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
              Vous venez de parcourir l'ensemble des 11 modules stratégiques de DineFlow Pro. Votre restaurant dispose désormais d'un écosystème connecté sans faille de la commande à la facturation légale.
            </p>

            {/* Recap Highlights */}
            <div className="space-y-2 text-left my-4">
              <div className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center gap-2.5 text-xs">
                <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-stone-300"><strong>+25% Panier Moyen</strong> grâce à l’upselling et la jauge incitative du chef.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center gap-2.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-stone-300"><strong>Zéro rupture papier</strong> : KDS temps réel & tickets thermiques 80mm NF525.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center gap-2.5 text-xs">
                <HeartHandshake className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="text-stone-300"><strong>Fluidité Salle-Cuisine</strong> : Alertes traitées en direct et vision 2D des tables.</span>
              </div>
            </div>

            <p className="text-xs text-stone-400">
              Vous pouvez maintenant explorer librement toutes les fonctionnalités à votre propre rythme.
            </p>

            {/* Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={closeCompletion}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 hover:from-emerald-400 hover:to-emerald-300 text-stone-950 font-black text-xs sm:text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>EXPLORER LIBREMENT</span>
              </button>

              <button
                type="button"
                onClick={restartTour}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>REFAIRE LA VISITE</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
