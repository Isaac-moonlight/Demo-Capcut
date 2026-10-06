import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.96 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-sm sm:max-w-md max-h-[92vh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] bg-white dark:bg-[#1c1c1e] text-black dark:text-white p-4 sm:p-5 shadow-2xl border border-stone-200 dark:border-[#2c2c2e]"
        >
          {/* iOS Grabber */}
          <div className="w-10 h-1 bg-stone-300 dark:bg-stone-600 rounded-full mx-auto mb-3 sm:hidden" />

          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 text-stone-400 hover:text-black dark:hover:text-white rounded-full bg-stone-100 dark:bg-[#2c2c2e] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="mb-3.5 pb-2 border-b border-stone-100 dark:border-[#2c2c2e]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ff9f0a]/15 text-[#ff9f0a] text-[10px] font-extrabold uppercase mb-1">
              <Receipt className="w-3 h-3" />
              <span>Addition • Table {selectedTable}</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">
              Règlement
            </h2>
          </div>

          {/* Breakdown Box */}
          <div className="rounded-2xl bg-[#f2f2f7] dark:bg-[#2c2c2e] p-3 mb-3.5 space-y-1">
            <div className="flex justify-between text-xs text-stone-600 dark:text-stone-300">
              <span>Mets & Boissons ({activeTableOrder.items.length})</span>
              <span className="font-bold">{subtotal.toFixed(2)} €</span>
            </div>

            <div className="flex justify-between text-[11px] text-stone-400">
              <span>Dont TVA 10%</span>
              <span>{(subtotal * 0.1).toFixed(2)} €</span>
            </div>

            {calculatedTip > 0 && (
              <div className="flex justify-between text-xs text-[#ff9f0a] font-bold">
                <span>Pourboire brigade</span>
                <span>+{calculatedTip.toFixed(2)} €</span>
              </div>
            )}

            <div className="pt-1.5 border-t border-stone-300 dark:border-stone-700 flex justify-between items-center text-sm">
              <span className="font-bold">Total Général</span>
              <span className="text-xl font-black text-[#ff9f0a] dark:text-[#ffd60a]">
                {totalAmount.toFixed(2)} €
              </span>
            </div>
          </div>

          {/* 1. Pourboire */}
          <div className="mb-3.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mb-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-[#ff9f0a]" />
              <span>Pourboire Service</span>
            </label>

            <div className="grid grid-cols-4 gap-1.5 mb-1.5">
              {[0, 5, 10, 15].map((pct) => {
                const isSelected = tipPercent === pct && customTip === '';
                return (
                  <motion.button
                    key={pct}
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    onClick={() => {
                      setTipPercent(pct);
                      setCustomTip('');
                    }}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-sm'
                        : 'bg-[#f2f2f7] dark:bg-[#2c2c2e] border-stone-200 dark:border-transparent text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {pct === 0 ? '0%' : `${pct}%`}
                  </motion.button>
                );
              })}
            </div>

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
              className="w-full text-xs p-2 rounded-xl bg-[#f2f2f7] dark:bg-[#2c2c2e] border-none text-black dark:text-white placeholder-stone-400 focus:outline-none"
            />
          </div>

          {/* 2. Partage de Note */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#ff9f0a]" />
                <span>Partage de Note</span>
              </label>
              <span className="text-xs font-black text-[#ff9f0a]">
                {perPersonAmount.toFixed(2)} € / part
              </span>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((cnt) => (
                <motion.button
                  key={cnt}
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setSplitCount(cnt)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    splitCount === cnt
                      ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-sm'
                      : 'bg-[#f2f2f7] dark:bg-[#2c2c2e] border-stone-200 dark:border-transparent text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {cnt === 1 ? '1' : `${cnt}p`}
                </motion.button>
              ))}
            </div>
          </div>

          {/* 3. Règlement Buttons */}
          <div className="space-y-2 pb-1">
            {/* Apple Pay Button (Primary on iOS) */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              disabled={isProcessing}
              onClick={() => handleSimulatePayment('apple_pay')}
              className="w-full py-3 px-4 rounded-full bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Payer avec Apple Pay ({totalAmount.toFixed(2)} €)</span>
            </motion.button>

            {/* Carte Bancaire */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              disabled={isProcessing}
              onClick={() => handleSimulatePayment('card')}
              className="w-full py-2.5 px-4 rounded-full bg-[#f2f2f7] dark:bg-[#2c2c2e] text-black dark:text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-stone-200 dark:hover:bg-[#3a3a3c]"
            >
              <CreditCard className="w-4 h-4 text-[#ff9f0a]" />
              <span>Carte Bancaire ({totalAmount.toFixed(2)} €)</span>
            </motion.button>

            {/* Terminal TPE */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              disabled={isProcessing || tpeRequested}
              onClick={handleRequestTpe}
              className="w-full py-2 px-4 rounded-full bg-transparent text-stone-600 dark:text-stone-400 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:text-black dark:hover:text-white"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>
                {tpeRequested
                  ? 'Serveur notifié avec le TPE ✓'
                  : 'Appeler le serveur avec le TPE'}
              </span>
            </motion.button>
          </div>

          {tpeRequested && (
            <div className="mt-2 p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs text-center font-bold flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Le serveur arrive à votre table.</span>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
