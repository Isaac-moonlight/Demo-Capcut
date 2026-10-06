import React from 'react';
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
    <aside aria-label="Aperçu du panier" className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-40 animate-in slide-in-from-bottom-6 duration-300">
      <div
        onClick={onOpenCart}
        className="relative overflow-hidden rounded-2xl bg-[#0f131d] border border-amber-500/40 p-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.7)] text-stone-100 cursor-pointer group hover:border-amber-400 transition-all hover:scale-[1.01]"
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/15 via-transparent to-amber-600/15 pointer-events-none" />

        {/* Incentive mini progress bar at very top of card */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-stone-800">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
            style={{ width: `${Math.min(100, (cartSubtotal / threshold) * 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-3 relative z-10">
          {/* Left: Badge & count */}
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-stone-950 font-black shadow-md group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 text-stone-950" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-stone-950 text-amber-300 text-[10px] font-extrabold flex items-center justify-center border border-amber-400">
                {cartItemsCount}
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-white">
                  Table {selectedTable || 'T1'}
                </span>
                <span className="text-xs font-extrabold text-amber-400">
                  {cartSubtotal.toFixed(2)} €
                </span>
              </div>
              <p className="text-[11px] text-stone-400 flex items-center gap-1">
                {isRewardUnlocked ? (
                  <span className="text-amber-300 font-semibold flex items-center gap-1">
                    <Gift className="w-3 h-3 text-amber-400 animate-bounce" />
                    Café gourmand du chef offert !
                  </span>
                ) : (
                  <span>
                    Plus que <strong className="text-amber-400">{remainingForReward.toFixed(2)} €</strong> pour le cadeau
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Right: CTA button */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 group-hover:from-amber-400 group-hover:to-amber-500 text-stone-950 text-xs font-extrabold shadow-md transition-all whitespace-nowrap"
          >
            <span>Voir le panier</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </aside>
  );
};
