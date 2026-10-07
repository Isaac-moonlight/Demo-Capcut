import React, { useState } from 'react';
import {
  CreditCard,
  Banknote,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Printer,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CartItem, Dish } from '../../types';

interface PosCashierProps {
  onRedirectToInvoice?: (orderId: string) => void;
}

export const PosCashier: React.FC<PosCashierProps> = ({ onRedirectToInvoice }) => {
  const { dishes, createPosOrder, inventory } = useRestaurant();

  const [posTable, setPosTable] = useState('T1');
  const [posItems, setPosItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [paymentType, setPaymentType] = useState<'card' | 'cash'>('card');
  const [cashGiven, setCashGiven] = useState<string>('');
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const tableList = Array.from({ length: 12 }, (_, i) => `T${i + 1}`);

  const handleAddDish = (dish: Dish) => {
    setPosItems((prev) => {
      const idx = prev.findIndex((i) => i.dishId === dish.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [
        ...prev,
        {
          id: `${dish.id}-${Date.now()}`,
          dishId: dish.id,
          name: dish.name,
          price: dish.price,
          quantity: 1,
          selectedAddons: [],
          image: dish.image,
        },
      ];
    });
  };

  const handleUpdateQty = (itemId: string, delta: number) => {
    setPosItems((prev) =>
      prev
        .map((i) => {
          if (i.id === itemId) {
            const next = i.quantity + delta;
            return next > 0 ? { ...i, quantity: next } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const totalDue = posItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const numericCash = parseFloat(cashGiven) || 0;
  const changeDue = Math.max(0, numericCash - totalDue);

  const handleCheckout = async () => {
    if (posItems.length === 0) return;
    const orderId = await createPosOrder(posTable, posItems, paymentType);
    setCreatedOrderId(orderId);
    setPosItems([]);
    setCashGiven('');
    if (onRedirectToInvoice) {
      setTimeout(() => {
        onRedirectToInvoice(orderId);
      }, 1500);
    }
  };

  const filteredDishes =
    selectedCategory === 'all'
      ? dishes
      : dishes.filter((d) => d.category === selectedCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left 7 cols: Table Selector, Category Tabs & Dish Grid */}
      <div className="lg:col-span-7 space-y-5">
        {/* Table Selector */}
        <div className="bg-[#121622] p-4 rounded-2xl border border-stone-800">
          <label className="text-xs uppercase font-bold text-amber-400 block mb-2">
            Table d’encaissement
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {tableList.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setPosTable(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  posTable === t
                    ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                    : 'bg-[#181d2c] border border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['all', 'starters', 'meats', 'seafood', 'desserts', 'wines', 'cocktails'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 border border-amber-400 text-amber-300'
                  : 'bg-[#121622] border border-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Tout le menu' : cat}
            </button>
          ))}
        </div>

        {/* Dishes tactile grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[550px] overflow-y-auto pr-1">
          {filteredDishes.map((dish) => {
            const isOutOfStock = inventory[dish.id]?.inStock === false;
            return (
              <button
                key={dish.id}
                type="button"
                disabled={isOutOfStock}
                onClick={() => handleAddDish(dish)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 relative cursor-pointer ${
                  isOutOfStock
                    ? 'opacity-40 bg-stone-900 border-stone-800 cursor-not-allowed'
                    : 'bg-[#141824] hover:bg-[#1a2030] border-stone-800 hover:border-amber-500/40 active:scale-95'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-stone-100 line-clamp-2 leading-tight">
                    {dish.name}
                  </h4>
                  <span className="text-[10px] text-stone-400 uppercase mt-0.5 block">
                    {dish.category}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-black text-amber-400">
                    {dish.price.toFixed(2)} €
                  </span>
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right 5 cols: Ticket in Progress & Fast Payment */}
      <div data-tour="pos-checkout-section" className="lg:col-span-5 bg-[#121622] rounded-3xl border border-stone-800 p-5 flex flex-col justify-between min-h-[600px]">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
            <div>
              <h3 className="text-base font-bold font-serif-luxury text-amber-200">
                Ticket Express - Table {posTable}
              </h3>
              <span className="text-[11px] text-stone-400">
                {posItems.length} article(s) saisis
              </span>
            </div>
            {posItems.length > 0 && (
              <button
                type="button"
                onClick={() => setPosItems([])}
                className="text-stone-500 hover:text-rose-400 text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vider</span>
              </button>
            )}
          </div>

          {/* Items */}
          <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
            {posItems.length === 0 ? (
              <div className="h-32 flex flex-col items-center justify-center text-xs text-stone-500 font-medium">
                <ShoppingBag className="w-6 h-6 mb-1 opacity-40" />
                <span>Touchez des plats pour les ajouter</span>
              </div>
            ) : (
              posItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#181d2c] p-2.5 rounded-xl border border-stone-800 flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{item.name}</p>
                    <span className="text-[10px] text-amber-400">
                      {item.price.toFixed(2)} € / u
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, -1)}
                      className="w-5 h-5 flex items-center justify-center text-stone-400 hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, 1)}
                      className="w-5 h-5 flex items-center justify-center text-stone-400 hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-xs font-bold text-white w-14 text-right">
                    {(item.price * item.quantity).toFixed(2)} €
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payment & Cash Register Math */}
        <div className="pt-4 border-t border-stone-800 space-y-4">
          <div className="flex items-center justify-between text-base">
            <span className="font-bold text-stone-300">Total à Encaisser</span>
            <span className="text-2xl font-black text-amber-300">
              {totalDue.toFixed(2)} €
            </span>
          </div>

          {/* Payment Method Switch */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentType('card')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                paymentType === 'card'
                  ? 'bg-amber-500 text-stone-950 border-amber-400 font-extrabold shadow-md'
                  : 'bg-[#181d2c] border-stone-800 text-stone-300 hover:border-stone-700'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Carte / TPE</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentType('cash')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                paymentType === 'cash'
                  ? 'bg-amber-500 text-stone-950 border-amber-400 font-extrabold shadow-md'
                  : 'bg-[#181d2c] border-stone-800 text-stone-300 hover:border-stone-700'
              }`}
            >
              <Banknote className="w-4 h-4" />
              <span>Espèces</span>
            </button>
          </div>

          {/* If Cash: Calculator */}
          {paymentType === 'cash' && (
            <div className="bg-[#161a26] p-3 rounded-xl border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400">Montant Reçu :</span>
                <input
                  type="number"
                  placeholder="Ex: 50"
                  value={cashGiven}
                  onChange={(e) => setCashGiven(e.target.value)}
                  className="w-24 text-right p-1.5 rounded-lg bg-[#121622] border border-stone-700 text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              {numericCash > 0 && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-800">
                  <span className="text-stone-300 font-semibold">Rendu Monnaie :</span>
                  <span
                    className={`font-black text-sm ${
                      numericCash >= totalDue ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {changeDue.toFixed(2)} €
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Submit Checkout Button */}
          <button
            type="button"
            disabled={posItems.length === 0}
            onClick={handleCheckout}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-stone-950 font-extrabold text-sm shadow-[0_4px_25px_rgba(245,158,11,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-stone-950" />
            <span>Valider l’Encaissement ({totalDue.toFixed(2)} €)</span>
          </button>

          {createdOrderId && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center font-bold flex items-center justify-center gap-1.5">
              <span>Encaissement #{createdOrderId} validé avec succès ✓</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
