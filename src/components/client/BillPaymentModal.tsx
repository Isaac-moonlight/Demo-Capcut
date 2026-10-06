import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Users,
  HeartHandshake,
  Smartphone,
  Receipt,
  CheckCircle2,
  BellRing,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

interface BillPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const BillPaymentModal: React.FC<BillPaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const { activeTableOrder, selectedTable, submitOrderPayment, callWaiter } = useRestaurant();

  const [tipPercent, setTipPercent] = useState<number>(10);
  const [customTip, setCustomTip] = useState<string>('');
  const [splitCount, setSplitCount] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tpeRequested, setTpeRequested] = useState(false);

  if (!isOpen || !activeTableOrder) return null;

  const subtotal = activeTableOrder.subtotal;

  // Tip calculation
  const calculatedTip = customTip !== ''
    ? Math.max(0, parseFloat(customTip) || 0)
    : Number(((subtotal * tipPercent) / 100).toFixed(2));

  const totalAmount = Number((subtotal + calculatedTip).toFixed(2));
  const perPersonAmount = Number((totalAmount / splitCount).toFixed(2));

  const handleSimulatePayment = async (method: 'apple_pay' | 'card') => {
    setIsProcessing(true);
    try {
      await submitOrderPayment(method, calculatedTip, tipPercent, splitCount);
      setIsProcessing(false);
      onPaymentSuccess();
    } catch (err) {
      console.error('Payment error:', err);
      setIsProcessing(false);
    }
  };

  const handleRequestTpe = async () => {
    setIsProcessing(true);
    try {
      await submitOrderPayment('tpe_waiter', calculatedTip, tipPercent, splitCount);
      await callWaiter('bill_request', `Demande TPE - Table ${selectedTable} (${totalAmount}€)`);
      setTpeRequested(true);
      setIsProcessing(false);
      setTimeout(() => {
        onPaymentSuccess();
      }, 2500);
    } catch (err) {
      console.error('TPE request error:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0f131d] border border-amber-500/30 p-5 sm:p-7 text-stone-100 shadow-2xl my-auto">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5 pb-4 border-b border-stone-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Receipt className="w-3.5 h-3.5" />
            <span>Addition Table {selectedTable}</span>
          </div>
          <h2 className="text-2xl font-bold font-serif-luxury text-amber-200">
            Règlement & Clôture de Table
          </h2>
        </div>

        {/* Breakdown Box */}
        <div className="rounded-2xl bg-[#141824] p-4 border border-stone-800/80 mb-5 space-y-2">
          <div className="flex justify-between text-xs text-stone-300">
            <span>Mets & Boissons ({activeTableOrder.items.length} lignes)</span>
            <span className="font-bold">{subtotal.toFixed(2)} €</span>
          </div>

          <div className="flex justify-between text-xs text-stone-400">
            <span>Dont TVA 10% & 20%</span>
            <span>{activeTableOrder.taxTotal.toFixed(2)} €</span>
          </div>

          {calculatedTip > 0 && (
            <div className="flex justify-between text-xs text-amber-400 font-semibold">
              <span>Pourboire brigade</span>
              <span>+{calculatedTip.toFixed(2)} €</span>
            </div>
          )}

          <div className="pt-2 border-t border-stone-700 flex justify-between items-center text-sm">
            <span className="font-bold text-stone-100">Total Général</span>
            <span className="text-xl font-black text-amber-300">
              {totalAmount.toFixed(2)} €
            </span>
          </div>
        </div>

        {/* 1. Pourboire Service (0%, 5%, 10%, 15% ou montant libre) */}
        <div className="mb-5">
          <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2.5">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Pourboire pour la Brigade de Salle & Cuisine</span>
          </label>

          <div className="grid grid-cols-4 gap-2 mb-2">
            {[0, 5, 10, 15].map((pct) => {
              const isSelected = tipPercent === pct && customTip === '';
              return (
                <button
                  key={pct}
                  type="button"
                  onClick={() => {
                    setTipPercent(pct);
                    setCustomTip('');
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md font-extrabold'
                      : 'bg-[#181d2c] border-stone-800 text-stone-300 hover:border-amber-500/40'
                  }`}
                >
                  {pct === 0 ? 'Aucun' : `${pct}%`}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Montant libre en €"
              value={customTip}
              onChange={(e) => {
                setCustomTip(e.target.value);
                setTipPercent(0);
              }}
              min="0"
              step="1"
              className="w-full text-xs p-2.5 rounded-xl bg-[#141824] border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* 2. Partage de Note (Split the bill: 1, 2, 3, 4, 5 convives) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Partager l’Addition (Split the Bill)</span>
            </label>
            <span className="text-xs font-bold text-amber-300">
              {perPersonAmount.toFixed(2)} € / pers.
            </span>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => setSplitCount(cnt)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  splitCount === cnt
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 border-amber-400 shadow-md font-black'
                    : 'bg-[#181d2c] border-stone-800 text-stone-300 hover:border-amber-500/40'
                }`}
              >
                {cnt === 1 ? '1 part' : `${cnt} parts`}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Modes de Règlement */}
        <div className="space-y-3">
          {/* Apple Pay / Google Pay Instantané */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleSimulatePayment('apple_pay')}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-stone-100 active:scale-[0.98] text-stone-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-stone-950" />
            <span>Payer avec Apple Pay ({totalAmount.toFixed(2)} €)</span>
          </button>

          {/* Carte Bancaire Sécurisée */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleSimulatePayment('card')}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] text-stone-950 font-extrabold text-sm shadow-[0_4px_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-stone-950" />
            <span>Payer par Carte Bancaire ({totalAmount.toFixed(2)} €)</span>
          </button>

          {/* Demander le terminal TPE au serveur */}
          <button
            type="button"
            disabled={isProcessing || tpeRequested}
            onClick={handleRequestTpe}
            className="w-full py-3 px-4 rounded-2xl bg-[#141824] hover:bg-[#1a2030] active:scale-[0.98] border border-amber-500/30 text-amber-300 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BellRing className="w-4 h-4 text-amber-400" />
            <span>
              {tpeRequested
                ? 'Maître d’hôtel notifié avec le terminal TPE ✓'
                : 'Demander l’addition au serveur avec le terminal TPE'}
            </span>
          </button>
        </div>

        {tpeRequested && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs text-center font-medium flex items-center justify-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Le serveur se présente à votre table avec le terminal. Redirection en cours...</span>
          </div>
        )}
      </div>
    </div>
  );
};
