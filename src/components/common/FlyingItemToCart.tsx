import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface FlyingItem {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  image?: string;
  emoji?: string;
  badgeText?: string;
  color?: string;
}

interface FlyingItemToCartProps {
  items: FlyingItem[];
  onComplete: (id: string) => void;
}

export const FlyingItemToCart: React.FC<FlyingItemToCartProps> = ({ items, onComplete }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              x: item.startX - 26,
              y: item.startY - 26,
              scale: 0.6,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              x: [
                item.startX - 26,
                (item.startX + item.targetX) / 2 + (Math.random() > 0.5 ? -35 : 35),
                item.targetX - 20,
              ],
              y: [
                item.startY - 26,
                Math.min(item.startY, item.targetY) - 70,
                item.targetY - 20,
              ],
              scale: [0.6, 1.45, 0.25],
              rotate: [0, -30, 40],
              opacity: [1, 1, 0.9],
            }}
            transition={{
              duration: 0.72,
              ease: [0.18, 0.89, 0.32, 1.25], // bouncy overshoot
            }}
            onAnimationComplete={() => onComplete(item.id)}
            className="absolute rounded-full shadow-[0_12px_30px_rgba(255,159,10,0.65)] flex items-center justify-center"
          >
            {item.image ? (
              <div className="w-14 h-14 rounded-full p-1 bg-gradient-to-tr from-[#ff9f0a] via-[#ffffff] to-[#ffd60a] shadow-lg flex items-center justify-center">
                <img
                  src={item.image}
                  alt="Élément sélectionné"
                  className="w-full h-full object-cover rounded-full border-2 border-black"
                />
              </div>
            ) : item.emoji ? (
              <div className="w-12 h-12 rounded-full bg-black/90 text-white text-2xl flex items-center justify-center border-2 border-[#ff9f0a] shadow-lg">
                <span>{item.emoji}</span>
              </div>
            ) : item.badgeText ? (
              <div className="px-3 py-1.5 rounded-full bg-[#ff9f0a] text-black text-xs font-black tracking-wider uppercase shadow-lg border border-white">
                <span>{item.badgeText}</span>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff9f0a] to-[#ffd60a] flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-black">★</span>
              </div>
            )}

            {/* Sparkle halo ping */}
            <div className="absolute inset-0 rounded-full animate-ping bg-[#ff9f0a]/40 pointer-events-none" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

