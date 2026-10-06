import React from 'react';
import { Sparkles, Wine, Award, Clock, ChevronDown } from 'lucide-react';
import { MENU_CATEGORIES } from '../../data/menuData';

interface HeroHeaderProps {
  onCategoryClick: (categoryId: string) => void;
  activeCategory: string;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ onCategoryClick, activeCategory }) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-amber-500/10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-b from-amber-500/15 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Floating Golden Particles (SVG decor) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-8 left-12 w-2 h-2 rounded-full bg-amber-400/60 blur-[1px] animate-pulse" />
        <div className="absolute top-24 right-16 w-3 h-3 rounded-full bg-yellow-300/50 blur-[1px] animate-pulse delay-700" />
        <div className="absolute bottom-16 left-1/4 w-2.5 h-2.5 rounded-full bg-amber-500/40 blur-[1px] animate-pulse delay-1000" />
        <div className="absolute top-16 right-1/3 w-1.5 h-1.5 rounded-full bg-amber-200/70 blur-[1px] animate-pulse delay-500" />
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        {/* Left side: Editorial text & Haute Gastronomie Presentation */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Table Étoilée & Produits d’Exception</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-luxury tracking-tight leading-tight text-stone-900 dark:text-stone-100">
            L’Émotion Pure du Terroir & du Geste Culinaire
          </h1>

          <p className="mt-4 text-stone-600 dark:text-stone-300 text-sm sm:text-base max-w-xl leading-relaxed font-sans-clean">
            Découvrez une symphonie de saveurs orchestrée par notre brigade. Des criées bretonnes aux élevages d’alpage, chaque assiette célèbre la tradition sublimée par l’audace contemporaine.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-5 text-xs text-stone-500 dark:text-stone-400">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>3 Étoiles Michelin</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Dressage Minute & Précision</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wine className="w-4 h-4 text-amber-500" />
              <span>Accords Mets & Vins Rares</span>
            </div>
          </div>
        </div>

        {/* Right side: Grand Levitation Plate with aromatic leaves */}
        <div className="relative flex-shrink-0 flex items-center justify-center">
          {/* Subtle concentric plate halo */}
          <div className="absolute w-72 h-72 sm:w-84 sm:h-84 rounded-full border border-amber-500/20 animate-pulse-gold pointer-events-none" />
          <div className="absolute w-64 h-64 sm:w-76 sm:h-76 rounded-full border border-amber-500/10 pointer-events-none" />

          {/* Floating Aromatic Leaves (decor) */}
          <div className="absolute -top-3 -left-4 text-xl select-none animate-bounce duration-1000 pointer-events-none">
            🌿
          </div>
          <div className="absolute top-2 -right-5 text-lg select-none pointer-events-none rotate-45">
            🍃
          </div>
          <div className="absolute -bottom-2 right-4 text-base select-none pointer-events-none -rotate-12">
            🌱
          </div>

          {/* Center Levitation Circular Plate */}
          <div className="relative w-56 h-56 sm:w-68 sm:h-68 rounded-full p-2 bg-gradient-to-tr from-amber-500/30 via-yellow-200/20 to-amber-600/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-float-plate overflow-hidden">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-stone-800/80 shadow-inner relative group">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop"
                alt="Assiette Gastronomique Signature"
                className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-4">
                <span className="text-[11px] font-semibold text-amber-200 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/30">
                  Signature Wagyu & Morilles
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Raccourcis de Catégories sous forme de badges pour scroller instantanément */}
      <div className="max-w-6xl mx-auto mt-10">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500/90 flex items-center gap-1.5">
            <ChevronDown className="w-3.5 h-3.5" /> Navigation Rapide par Services
          </span>
          <span className="text-[11px] text-stone-500">6 univers culinaires</span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x">
          {MENU_CATEGORIES.map((cat) => {
            const isCurrent = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryClick(cat.id)}
                className={`snap-start flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-[0_4px_15px_rgba(245,158,11,0.4)] scale-105 ring-1 ring-amber-300'
                    : 'bg-stone-100 dark:bg-[#141824] hover:bg-stone-200 dark:hover:bg-[#1c2233] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-amber-500/40'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
