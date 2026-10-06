import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowRight, Gift } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

interface CartFloatingBarProps {
  onOpenCart: () => void;
}

export const CartFloatingBar: React.FC<CartFloatingBarProps> = ({ onOpenCart }) => {
  const { cartItemsCount, cartSubtotal, settings, selectedTable } = useRestaurant();

  if (cartItemsCount === 0) return null;

  const threshold = settings.chefRewardThreshold || 65;
  const remainingForReward = Math.max(0, threshold - cartSubtotal);
  const isRewardUnlocked = remainingForReward === 0;

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="Aperçu du panier"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        className="fixed bottom-3 left-3 right-3 max-w-sm sm:max-w-md mx-auto z-40"
      >
        <motion.div
          key={cartItemsCount}
          initial={{ scale: 0.92 }}
          animate={{ scale: [0.92, 1.05, 0.98, 1] }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenCart}
          className="relative overflow-hidden rounded-[24px] bg-black/90 dark:bg-[#1c1c1e]/95 backdrop-blur-xl border border-white/10 dark:border-white/15 p-3 shadow-2xl text-white cursor-pointer group ring-1 ring-[#ff9f0a]/30"
        >
          {/* iOS progress indicator */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
            <motion.div
              className="h-full bg-[#ff9f0a]"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (cartSubtotal / threshold) * 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="flex items-center justify-between gap-2.5 relative z-10 pt-0.5">
            {/* Left: Bag icon with badge */}
            <div className="flex items-center gap-2.5">
              <motion.div
                animate={{ scale: [1, 1.35, 0.9, 1.15, 1], rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.4 }}
                className="relative w-10 h-10 rounded-full bg-white text-black dark:bg-[#ff9f0a] dark:text-black flex items-center justify-center font-black shadow-sm flex-shrink-0"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-black text-[#ff9f0a] text-[9px] font-black flex items-center justify-center border border-[#ff9f0a]">
                  {cartItemsCount}
                </span>
              </motion.div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tracking-tight truncate">
                    Menu • Table {selectedTable || 'T1'}
                  </span>
                  <span className="text-xs font-extrabold text-[#ff9f0a]">
                    {cartSubtotal.toFixed(2)} €
                  </span>
                </div>
                <p className="text-[10px] text-stone-300 truncate">
                  {isRewardUnlocked ? (
                    <span className="text-[#30d158] font-bold flex items-center gap-1">
                      <Gift className="w-3 h-3 text-[#30d158]" />
                      Menu • Offert
                    </span>
                  ) : (
                    <span>
                      Menu • <strong className="text-[#ff9f0a]">{remainingForReward.toFixed(2)} €</strong>
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Right: iOS Capsule Button */}
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-black dark:bg-[#ff9f0a] dark:text-black text-xs font-extrabold shadow-sm flex-shrink-0">
              <span>Menu</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </motion.div>
      </motion.aside>
    </AnimatePresence>
  );
};
