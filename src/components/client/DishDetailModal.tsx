import React, { useState } from 'react';
import { X, Plus, Minus, Check, Flame, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';
import { Dish, CookingPreference, DishAddon } from '../../types';
import { useRestaurant } from '../../context/RestaurantContext';
import { EU_ALLERGENS } from '../../data/menuData';

interface DishDetailModalProps {
  dish: Dish | null;
  onClose: () => void;
}

const COOKING_LABELS: Record<CookingPreference, { name: string; desc: string }> = {
  bleu: { name: 'Bleu', desc: 'Saisi très vif, tiède à cœur' },
  saignant: { name: 'Saignant', desc: 'Chaud à cœur, rouge vif et juteux' },
  a_point: { name: 'À point', desc: 'Rosé tendre, texture fondante' },
  bien_cuit: { name: 'Bien cuit', desc: 'Cuit à cœur sans dessèchement' },
};

export const DishDetailModal: React.FC<DishDetailModalProps> = ({ dish, onClose }) => {
  const { addToCart } = useRestaurant();

  const [quantity, setQuantity] = useState(1);
  const [cooking, setCooking] = useState<CookingPreference | undefined>(
    dish?.requiresCooking ? (dish.availableCooking ? dish.availableCooking[0] : 'saignant') : undefined
  );
  const [selectedAddons, setSelectedAddons] = useState<DishAddon[]>([]);
  const [specialNotes, setSpecialNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!dish) return null;

  const handleAddonToggle = (addon: DishAddon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      }
      return [...prev, addon];
    });
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = dish.price + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    if (dish.requiresCooking && !cooking) {
      setErrorMsg('Veuillez sélectionner votre préférence de cuisson pour ce plat.');
      return;
    }

    addToCart({
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      quantity,
      cookingPreference: cooking,
      selectedAddons,
      specialInstructions: specialNotes.trim(),
      image: dish.image,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#0f131d] border border-stone-200 dark:border-amber-500/20 text-stone-900 dark:text-stone-100 shadow-2xl my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-stone-400 hover:text-white rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Photo with Relief Frame */}
        <div className="relative w-full h-56 sm:h-64 overflow-hidden rounded-t-3xl bg-stone-900">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-4 left-5 right-5 text-white">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              {dish.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury tracking-tight mt-0.5">
              {dish.name}
            </h2>
            {dish.frenchSubtitle && (
              <p className="text-xs font-serif-luxury italic text-stone-300">
                {dish.frenchSubtitle}
              </p>
            )}
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans-clean">
            {dish.description}
          </p>

          {/* 1. Sélection Obligatoire de la Cuisson (Viandes / Burgers) */}
          {dish.requiresCooking && (
            <div className="rounded-2xl p-4 bg-stone-50 dark:bg-[#141824] border border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Cuisson de Précision (Obligatoire)</span>
                </label>
                <span className="text-[10px] text-amber-500 font-semibold px-2 py-0.5 rounded bg-amber-500/10">
                  Requis
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {((dish.availableCooking || ['bleu', 'saignant', 'a_point', 'bien_cuit']) as CookingPreference[]).map(
                  (cKey) => {
                    const isSelected = cooking === cKey;
                    const meta = COOKING_LABELS[cKey];
                    return (
                      <button
                        key={cKey}
                        type="button"
                        onClick={() => {
                          setCooking(cKey);
                          setErrorMsg('');
                        }}
                        className={`p-3 rounded-xl text-left transition-all duration-150 cursor-pointer border ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 border-amber-500 text-amber-500 dark:text-amber-300 font-bold shadow-sm'
                            : 'bg-white dark:bg-[#181d2c] border-stone-200 dark:border-stone-700/80 text-stone-700 dark:text-stone-300 hover:border-amber-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{meta.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-500" />}
                        </div>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 block mt-0.5 leading-tight">
                          {meta.desc}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* 2. Suppléments Gastronomiques Payants Cochables */}
          {dish.addons && dish.addons.length > 0 && (
            <div className="rounded-2xl p-4 bg-stone-50 dark:bg-[#141824] border border-stone-200 dark:border-stone-800">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mb-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Sublimer Votre Assiette (Suppléments)</span>
              </label>

              <div className="space-y-2">
                {dish.addons.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => handleAddonToggle(addon)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left cursor-pointer ${
                        isChecked
                          ? 'bg-amber-500/10 border-amber-500 text-stone-900 dark:text-amber-200 font-semibold'
                          : 'bg-white dark:bg-[#181d2c] border-stone-200 dark:border-stone-700/80 text-stone-700 dark:text-stone-300 hover:border-amber-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isChecked
                              ? 'bg-amber-500 border-amber-500 text-stone-950'
                              : 'border-stone-400 dark:border-stone-600'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs">{addon.name}</span>
                      </div>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        +{addon.price.toFixed(2)} €
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Gestion des 14 Allergènes UE */}
          <div className="rounded-2xl p-4 bg-stone-50 dark:bg-[#141824] border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Allergènes UE Présents</span>
            </div>

            {dish.allergens.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {dish.allergens.map((allg) => {
                  const matched = EU_ALLERGENS.find(
                    (a) => a.name.toLowerCase() === allg.toLowerCase()
                  );
                  return (
                    <span
                      key={allg}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-200/80 dark:bg-[#1e2434] text-stone-700 dark:text-stone-300 text-[11px] font-medium"
                    >
                      <span>{matched?.icon || '⚠️'}</span>
                      <span>{allg}</span>
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-stone-500">Aucun des 14 allergènes majeurs répertoriés.</p>
            )}
          </div>

          {/* 4. Instructions Spéciales Brigade */}
          <div className="rounded-2xl p-4 bg-stone-50 dark:bg-[#141824] border border-stone-200 dark:border-stone-800">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5 mb-2">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <span>Remarques Spéciales pour la Brigade</span>
            </label>
            <textarea
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="Ex: Sans sel ajouté, sauce à part, intolérance spécifique..."
              rows={2}
              className="w-full text-xs p-3 rounded-xl bg-white dark:bg-[#181d2c] border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs text-center font-medium">
              {errorMsg}
            </div>
          )}

          {/* Bottom Action: Quantité & Bouton Ajouter */}
          <div className="pt-2 flex items-center justify-between gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-2 rounded-2xl bg-stone-100 dark:bg-[#141824] p-1.5 border border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-[#1a2030] text-stone-700 dark:text-stone-200 hover:text-amber-500 shadow-sm transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-stone-900 dark:text-stone-100">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-[#1a2030] text-stone-700 dark:text-stone-200 hover:text-amber-500 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-sm shadow-[0_4px_20px_rgba(245,158,11,0.4)] active:scale-[0.98] transition-all flex items-center justify-between cursor-pointer"
            >
              <span>Ajouter à la commande</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
