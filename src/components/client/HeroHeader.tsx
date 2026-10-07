import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Utensils, Star } from 'lucide-react';
import { MENU_CATEGORIES } from '../../data/menuData';
import { WavyText } from '../common/WavyText';

interface HeroHeaderProps {
  onCategoryClick: (categoryId: string) => void;
  activeCategory: string;
  onPlateClick?: (e: React.MouseEvent) => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  onCategoryClick,
  activeCategory,
  onPlateClick,
}) => {
  return (
    <div className="relative overflow-hidden pt-2 pb-4 px-3 sm:px-4">
      <div className="flex flex-col items-center text-center relative z-10">
        {/* iOS-styled Minimalist Pill Badge */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 16, stiffness: 350 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff9f0a]/15 text-[#ff9f0a] dark:text-[#ffd60a] text-[11px] font-bold tracking-tight mb-2 border border-[#ff9f0a]/30"
        >
          <Sparkles className="w-3 h-3 text-[#ff9f0a]" />
          <span>Menu • DineFlow Pro</span>
        </motion.div>

        {/* TITLE: JUST "Menu" WITH WAVY UNDULATION KEYFRAME */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white">
          <WavyText text="Menu" delayOffset={0} />
        </h1>

        {/* Circular Plate with impact zoom keyframes */}
        <motion.div
          data-tour="hero-plate"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{
            scale: [1, 1.06, 0.98, 1.05, 1],
            rotate: [0, 1.5, -1.5, 0.5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          whileTap={{ scale: 1.15 }}
          onClick={(e) => onPlateClick && onPlateClick(e)}
          className="relative flex items-center justify-center my-3 cursor-pointer"
        >
          {/* Concentric halo */}
          <div className="absolute w-36 h-36 rounded-full border border-[#ff9f0a]/30 animate-pulse-gold pointer-events-none" />

          {/* Floating elements */}
          <motion.div
            animate={{ y: [-5, 5, -5], rotate: [-8, 8, -8] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-2 -left-2 text-lg pointer-events-none"
          >
            🌿
          </motion.div>
          <motion.div
            animate={{ y: [5, -5, 5], rotate: [8, -8, 8] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute -bottom-2 -right-2 text-base pointer-events-none"
          >
            🍃
          </motion.div>

          {/* Center Plate */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-[#ff9f0a]/40 to-[#ffd60a]/40 shadow-xl overflow-hidden">
            <div className="w-full h-full rounded-full overflow-hidden border border-black dark:border-white/20 relative group">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop"
                alt="Menu"
                className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-1">
                <span className="text-[9px] font-black uppercase text-white bg-black/70 px-2 py-0.5 rounded-full">
                  Menu
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* iOS Segmented Category Controls (iPhone-styled horizontal sliding tabs) */}
      <div className="mt-1" data-tour="category-tabs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x px-1">
          {MENU_CATEGORIES.map((cat) => {
            const isCurrent = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                type="button"
                data-tour={cat.id === 'meats' ? 'category-tab-meats' : undefined}
                whileTap={{ scale: 0.92 }}
                onClick={() => onCategoryClick(cat.id)}
                className={`snap-start flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-md scale-105'
                    : 'bg-[#e5e5ea] text-[#3a3a3c] dark:bg-[#1c1c1e] dark:text-[#98989d] hover:bg-[#d1d1d6] dark:hover:bg-[#2c2c2e]'
                }`}
              >
                <span className="text-xs">{cat.icon}</span>
                <span className="whitespace-nowrap font-semibold">{cat.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
