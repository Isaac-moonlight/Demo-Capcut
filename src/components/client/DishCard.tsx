import React from 'react';
import { motion } from 'motion/react';
import { Plus, Star, AlertCircle } from 'lucide-react';
import { Dish } from '../../types';
import { useRestaurant } from '../../context/RestaurantContext';

interface DishCardProps {
  dish: Dish;
  onSelect: (dish: Dish) => void;
  onQuickAdd?: (e: React.MouseEvent, dish: Dish) => void;
  index?: number;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, onSelect, onQuickAdd, index = 0 }) => {
  const { inventory } = useRestaurant();
  const inv = inventory[dish.id];
  const isOutOfStock = inv ? !inv.inStock : false;

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    if (dish.requiresCooking) {
      onSelect(dish);
    } else if (onQuickAdd) {
      onQuickAdd(e, dish);
    } else {
      onSelect(dish);
    }
  };

  return (
    <motion.div
      data-tour={dish.id === 'wagyu-a5' || dish.name.toLowerCase().includes('wagyu') || dish.requiresCooking ? 'dish-card-wagyu' : undefined}
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: Math.min(0.2, (index % 6) * 0.04), ease: 'easeOut' }}
      whileHover={!isOutOfStock ? { y: -3, scale: 1.02 } : {}}
      whileTap={!isOutOfStock ? { scale: 0.94 } : {}}
      onClick={() => !isOutOfStock && onSelect(dish)}
      className={`group relative rounded-[20px] p-2.5 transition-all flex flex-col justify-between cursor-pointer border ${
        isOutOfStock
          ? 'opacity-40 grayscale cursor-not-allowed bg-[#f2f2f7] dark:bg-[#1c1c1e] border-stone-300 dark:border-stone-800'
          : 'bg-white dark:bg-[#1c1c1e] border-[#e5e5ea] dark:border-[#2c2c2e] hover:border-[#ff9f0a] dark:hover:border-[#ff9f0a] shadow-sm hover:shadow-md'
      }`}
    >
      <div>
        {/* iOS Photo Container */}
        <div className="relative w-full aspect-square rounded-[16px] overflow-hidden mb-2 bg-[#f2f2f7] dark:bg-[#2c2c2e]">
          <img
            src={dish.image}
            alt={dish.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-300 ease-out"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

          {/* Chef Tag */}
          {dish.isChefSpecial && (
            <div className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ff9f0a] text-black font-extrabold text-[9px] shadow-sm">
              <Star className="w-2.5 h-2.5 fill-black text-black" />
              <span>Chef</span>
            </div>
          )}

          {/* 86 Rupture Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-1 text-center">
              <AlertCircle className="w-5 h-5 text-rose-400 mb-0.5" />
              <span className="text-[9px] font-black uppercase text-rose-200">
                Épuisé (86)
              </span>
            </div>
          )}
        </div>

        {/* Dish Title & Price (Clean iOS Style, No Italic, Just Menu) */}
        <div className="space-y-0.5">
          <h3 className="text-xs sm:text-sm font-bold tracking-tight text-black dark:text-white line-clamp-2 leading-tight">
            {dish.name}
          </h3>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs sm:text-sm font-extrabold text-[#ff9f0a] dark:text-[#ffd60a] whitespace-nowrap">
              {dish.price.toFixed(2)} €
            </span>

            {dish.requiresCooking && (
              <span className="text-[8px] uppercase font-bold text-[#ff9f0a] bg-[#ff9f0a]/15 px-1.5 py-0.5 rounded-full">
                Cuisson
              </span>
            )}
          </div>

          {/* Clean Menu Tag instead of long descriptions */}
          <div className="pt-0.5">
            <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500">
              Menu
            </span>
          </div>
        </div>
      </div>

      {/* Footer: Quick Add Button with Flying Animation */}
      <div className="mt-2 pt-1.5 border-t border-[#f2f2f7] dark:border-[#2c2c2e] flex items-center justify-between gap-1">
        <span className="text-[9px] font-semibold text-stone-400 dark:text-stone-500 truncate">
          {dish.allergens.length > 0 ? `${dish.allergens.length} allergènes` : 'Frais'}
        </span>

        <motion.button
          type="button"
          whileTap={{ scale: 0.82 }}
          whileHover={{ scale: 1.05 }}
          disabled={isOutOfStock}
          onClick={handleQuickAddClick}
          className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full bg-black text-white dark:bg-white dark:text-black font-black text-[10px] shadow-sm transition-all cursor-pointer disabled:pointer-events-none"
        >
          <Plus className="w-3 h-3 stroke-[3]" />
          <span>Ajouter</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
