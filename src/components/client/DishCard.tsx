import React from 'react';
import { Heart, Plus, Clock, Wine, AlertCircle } from 'lucide-react';
import { Dish } from '../../types';
import { useRestaurant } from '../../context/RestaurantContext';

interface DishCardProps {
  dish: Dish;
  onSelect: (dish: Dish) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, onSelect }) => {
  const { inventory } = useRestaurant();
  const inv = inventory[dish.id];
  const isOutOfStock = inv ? !inv.inStock : false;

  return (
    <div
      onClick={() => !isOutOfStock && onSelect(dish)}
      className={`group relative rounded-3xl p-5 transition-all duration-300 flex flex-col justify-between ${
        isOutOfStock
          ? 'opacity-60 grayscale cursor-not-allowed bg-stone-100/60 dark:bg-[#11141d]/60 border border-stone-200 dark:border-stone-800'
          : 'cursor-pointer bg-white dark:bg-[#121622] hover:bg-stone-50 dark:hover:bg-[#161c2b] border border-stone-200/80 dark:border-stone-800/90 hover:border-amber-500/40 shadow-sm hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1'
      }`}
    >
      <div>
        {/* Visual Relief Plate Image */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-stone-100 dark:bg-[#181d2a] shadow-inner">
          <img
            src={dish.image}
            alt={dish.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
          />

          {/* Soft ambient gradient overlay (no heavy blackening) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

          {/* Coup de Cœur du Chef Badge */}
          {dish.isChefSpecial && (
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-[11px] shadow-md tracking-tight">
              <Heart className="w-3 h-3 fill-stone-950 text-stone-950" />
              <span>Coup de Cœur du Chef</span>
            </div>
          )}

          {/* Prep time badge */}
          {dish.prepTimeMinutes && (
            <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-stone-200 text-[10px] font-medium border border-white/10">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{dish.prepTimeMinutes} min</span>
            </div>
          )}

          {/* 86 Mode / Rupture badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
              <AlertCircle className="w-8 h-8 text-rose-400 mb-2" />
              <span className="text-sm font-bold uppercase tracking-wider text-rose-200">
                Épuisé ce service (86)
              </span>
              <span className="text-xs text-stone-300 mt-1">Victime de son succès</span>
            </div>
          )}
        </div>

        {/* Dish Titles & Subtitles */}
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base sm:text-lg font-bold font-serif-luxury tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-amber-500 dark:group-hover:text-amber-300 transition-colors">
              {dish.name}
            </h3>
            <span className="text-base sm:text-lg font-extrabold text-amber-600 dark:text-amber-400 whitespace-nowrap">
              {dish.price.toFixed(2)} €
            </span>
          </div>

          {dish.frenchSubtitle && (
            <p className="text-xs font-serif-luxury italic text-stone-500 dark:text-stone-400 leading-snug">
              {dish.frenchSubtitle}
            </p>
          )}

          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-sans-clean pt-1 line-clamp-2">
            {dish.description}
          </p>
        </div>

        {/* Wine Pairing hint */}
        {dish.winePairing && (
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-600/90 dark:text-amber-400/90 bg-amber-500/5 dark:bg-amber-500/10 px-2.5 py-1.5 rounded-xl border border-amber-500/15">
            <Wine className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate italic">Accord : {dish.winePairing}</span>
          </div>
        )}
      </div>

      {/* Footer of Card: Allergens & CTA */}
      <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1 max-w-[65%]">
          {dish.allergens.slice(0, 3).map((allg) => (
            <span
              key={allg}
              className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium"
            >
              {allg}
            </span>
          ))}
          {dish.allergens.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500">
              +{dish.allergens.length - 3}
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={(e) => {
            e.stopPropagation();
            if (!isOutOfStock) onSelect(dish);
          }}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:pointer-events-none"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Choisir</span>
        </button>
      </div>
    </div>
  );
};
