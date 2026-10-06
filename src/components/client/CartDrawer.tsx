import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, Send, Gift, ChefHat, Check } from 'lucide-react';
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
      setError('Erreur lors de l’envoi. Veuillez réessayer.');
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-sm sm:max-w-md h-full bg-white dark:bg-[#1c1c1e] text-black dark:text-white flex flex-col shadow-2xl border-l border-stone-200 dark:border-[#2c2c2e]"
        >
          {/* iOS Header */}
          <div className="p-4 border-b border-stone-100 dark:border-[#2c2c2e] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#ff9f0a]/15 flex items-center justify-center text-[#ff9f0a]">
                <ChefHat className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-tight">
                  Menu • Table {selectedTable}
                </h2>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">
                  Envoi direct en cuisine
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-black dark:hover:text-white rounded-full bg-stone-100 dark:bg-[#2c2c2e] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Reward Gauge */}
          <div className="p-3 bg-[#f2f2f7] dark:bg-[#2c2c2e] border-b border-stone-100 dark:border-[#3a3a3c]">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-1.5 font-bold text-[#ff9f0a]">
                <Gift className="w-3.5 h-3.5" />
                <span className="text-[11px]">Privilège Chef</span>
              </div>
              <span className="text-[10px] font-black text-[#ff9f0a]">{rewardPercentage}%</span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-stone-300 dark:bg-stone-700 overflow-hidden mb-1.5">
              <div
                className="h-full bg-[#ff9f0a] transition-all duration-500 rounded-full"
                style={{ width: `${rewardPercentage}%` }}
              />
            </div>

            <p className="text-[10px] text-stone-600 dark:text-stone-300">
              {isRewardUnlocked ? (
                <span className="text-[#30d158] font-bold flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                  Café gourmand offert avec votre commande !
                </span>
              ) : (
                <span>
                  Plus que <strong className="text-[#ff9f0a]">{remaining.toFixed(2)} €</strong> pour le café gourmand.
                </span>
              )}
            </p>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <p className="text-xs font-semibold text-stone-600 dark:text-stone-300">Votre panier est vide</p>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  Sélectionnez des plats dans le menu.
                </p>
              </div>
            ) : (
              cart.map((item) => {
                const addonsCost = (item.selectedAddons || []).reduce((s, a) => s + a.price, 0);
                const itemTotal = (item.price + addonsCost) * item.quantity;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="rounded-2xl bg-[#f2f2f7] dark:bg-[#2c2c2e] p-2.5 flex gap-2.5 relative"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-black dark:text-white truncate">{item.name}</h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-rose-500 p-0.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Cooking preference (No italic) */}
                      {item.cookingPreference && (
                        <span className="inline-block mt-0.5 text-[8px] uppercase font-bold text-[#ff9f0a] bg-[#ff9f0a]/15 px-1.5 py-0.5 rounded-full">
                          {item.cookingPreference.replace('_', ' ')}
                        </span>
                      )}

                      {/* Addons */}
                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <div className="mt-0.5 flex flex-wrap gap-1">
                          {item.selectedAddons.map((addon) => (
                            <span
                              key={addon.id}
                              className="text-[8px] text-stone-600 dark:text-stone-300 bg-white dark:bg-[#1c1c1e] px-1 py-0.5 rounded"
                            >
                              +{addon.name} ({addon.price}€)
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Quantity & price footer */}
                      <div className="mt-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-white dark:bg-[#1c1c1e] rounded-full p-0.5">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="w-5 h-5 rounded-full flex items-center justify-center text-stone-500 hover:text-black dark:hover:text-white cursor-pointer"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="w-4 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="w-5 h-5 rounded-full flex items-center justify-center text-stone-500 hover:text-black dark:hover:text-white cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <span className="text-xs font-black text-[#ff9f0a] dark:text-[#ffd60a]">
                          {itemTotal.toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-3 bg-white dark:bg-[#1c1c1e] border-t border-stone-100 dark:border-[#2c2c2e] space-y-2.5">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Consignes cuisine (optionnel)..."
                className="w-full text-xs p-2 rounded-xl bg-[#f2f2f7] dark:bg-[#2c2c2e] border-none text-black dark:text-white placeholder-stone-400 focus:outline-none"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400">Total</span>
                <span className="text-lg font-black text-[#ff9f0a] dark:text-[#ffd60a]">
                  {cartSubtotal.toFixed(2)} €
                </span>
              </div>

              {error && (
                <p className="text-xs text-rose-500 text-center font-bold">{error}</p>
              )}

              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
                onClick={handleSendOrder}
                className="w-full py-3 px-4 rounded-full bg-black text-white dark:bg-white dark:text-black font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {isSubmitting ? 'Envoi...' : 'Envoyer en Cuisine'}
                </span>
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
