import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Send, Gift, Sparkles, ChefHat, Check } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    selectedTable,
    settings,
    submitClientOrder,
  } = useRestaurant();

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const threshold = settings.chefRewardThreshold || 65;
  const remaining = Math.max(0, threshold - cartSubtotal);
  const isRewardUnlocked = remaining === 0;
  const rewardPercentage = Math.min(100, Math.round((cartSubtotal / threshold) * 100));

  const handleSendOrder = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const orderId = await submitClientOrder(notes);
      setIsSubmitting(false);
      onClose();
      onOrderSuccess(orderId);
    } catch (err) {
      console.error('Order submit error:', err);
      setError('Erreur lors de l’envoi de la commande. Veuillez réessayer.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-[#0d1017] border-l border-amber-500/20 text-stone-100 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-[#121622]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif-luxury text-amber-200">
                Commande Table {selectedTable}
              </h2>
              <p className="text-[11px] text-stone-400">Envoi direct au passe de la brigade</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Incentive Brigade Reward Gauge */}
        <div className="p-4 bg-gradient-to-b from-[#161c2a] to-[#121622] border-b border-amber-500/20">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <Gift className="w-4 h-4 text-amber-400" />
              <span>Privilège Brigade Gourmande</span>
            </div>
            <span className="text-[11px] font-bold text-amber-400">{rewardPercentage}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 transition-all duration-500 rounded-full"
              style={{ width: `${rewardPercentage}%` }}
            />
          </div>

          <p className="text-[11px] text-stone-300 leading-snug">
            {isRewardUnlocked ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Félicitations ! Le Café Gourmand Signature est offert avec votre commande.
              </span>
            ) : (
              <span>
                Plus que <strong className="text-amber-300 font-bold">{remaining.toFixed(2)} €</strong> pour obtenir le{' '}
                <span className="text-amber-200 underline decoration-amber-500/50">
                  {settings.chefRewardDescription}
                </span>
                .
              </span>
            )}
          </p>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <Sparkles className="w-10 h-10 text-amber-500/40 mb-3" />
              <p className="text-sm font-semibold text-stone-300">Votre panier est encore vide</p>
              <p className="text-xs text-stone-500 mt-1 max-w-[220px]">
                Parcourez nos créations culinaires et ajoutez vos mets favoris.
              </p>
            </div>
          ) : (
            cart.map((item) => {
              const addonsCost = (item.selectedAddons || []).reduce((s, a) => s + a.price, 0);
              const itemTotal = (item.price + addonsCost) * item.quantity;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-[#141824] border border-stone-800 p-3.5 flex gap-3 relative group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-stone-100 truncate">{item.name}</h4>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-500 hover:text-rose-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Cooking preference */}
                    {item.cookingPreference && (
                      <span className="inline-block mt-0.5 text-[10px] uppercase font-bold text-amber-400/90 bg-amber-500/10 px-1.5 py-0.5 rounded">
                        Cuisson : {item.cookingPreference.replace('_', ' ')}
                      </span>
                    )}

                    {/* Addons */}
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.selectedAddons.map((addon) => (
                          <span
                            key={addon.id}
                            className="text-[9px] text-stone-400 bg-stone-800 px-1.5 py-0.5 rounded"
                          >
                            +{addon.name} ({addon.price}€)
                          </span>
                        ))}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <p className="text-[10px] text-stone-400 italic mt-1 truncate">
                        « {item.specialInstructions} »
                      </p>
                    )}

                    {/* Quantity & price footer */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 bg-stone-900 rounded-lg p-1 border border-stone-800">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-stone-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-stone-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-amber-400">
                        {itemTotal.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 bg-[#121622] border-t border-stone-800 space-y-3">
            {/* Notes for brigade */}
            <div>
              <label className="text-[11px] uppercase font-bold text-stone-400 block mb-1">
                Mot global pour la cuisine
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Servir les entrées ensemble..."
                className="w-full text-xs p-2.5 rounded-xl bg-[#181d2c] border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Total breakdown */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-800/80">
              <span className="text-xs text-stone-400 font-medium">Sous-total TTC</span>
              <span className="text-lg font-black text-amber-300">
                {cartSubtotal.toFixed(2)} €
              </span>
            </div>

            {error && (
              <p className="text-xs text-rose-400 text-center font-medium">{error}</p>
            )}

            {/* Validate in one click button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSendOrder}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-sm shadow-[0_4px_25px_rgba(245,158,11,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-stone-950" />
              <span>
                {isSubmitting ? 'Transmission en cours...' : 'Envoyer en Cuisine (1-Clic)'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
