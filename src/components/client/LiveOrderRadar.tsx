import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BellRing,
  CheckCircle2,
  Clock,
  Sparkles,
  Droplets,
  Check,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { OrderStatus } from '../../types';

interface LiveOrderRadarProps {
  onOrderServed: () => void;
}

const STEPS: { status: OrderStatus; label: string; icon: string; desc: string }[] = [
  {
    status: 'received',
    label: 'Reçue',
    icon: '📝',
    desc: 'Bons imprimés',
  },
  {
    status: 'in_kitchen',
    label: 'Cuisson',
    icon: '🔥',
    desc: 'Sur les feux',
  },
  {
    status: 'ready',
    label: 'Passe',
    icon: '🛎️',
    desc: 'Cloche sonnée',
  },
  {
    status: 'served',
    label: 'À Table',
    icon: '🍷',
    desc: 'Servie en salle',
  },
];

export const LiveOrderRadar: React.FC<LiveOrderRadarProps> = ({ onOrderServed }) => {
  const { activeTableOrder, selectedTable, callWaiter } = useRestaurant();
  const [callSuccessMessage, setCallSuccessMessage] = useState<string | null>(null);

  if (!activeTableOrder) return null;

  const currentStatusIndex = STEPS.findIndex((s) => s.status === activeTableOrder.status);
  const activeStepIdx = currentStatusIndex >= 0 ? currentStatusIndex : 0;

  const handleQuickCall = async (type: 'call_waiter' | 'water_bread', label: string) => {
    await callWaiter(type, label);
    setCallSuccessMessage(`${label} transmise ✓`);
    setTimeout(() => setCallSuccessMessage(null), 3500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[24px] p-3.5 sm:p-4 bg-white dark:bg-[#1c1c1e] border border-stone-200 dark:border-[#2c2c2e] shadow-md relative overflow-hidden text-black dark:text-white mb-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-stone-100 dark:border-[#2c2c2e]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ff9f0a]/15 text-[#ff9f0a] text-[10px] font-extrabold uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f0a] animate-ping" />
            <span>Suivi Radar</span>
          </div>
          <h3 className="text-base font-extrabold tracking-tight mt-1">
            Commande #{activeTableOrder.id} • Table {selectedTable}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 bg-[#f2f2f7] dark:bg-[#2c2c2e] px-2.5 py-1 rounded-full">
          <Clock className="w-3 h-3 text-[#ff9f0a]" />
          <span className="text-[11px] font-bold text-[#ff9f0a]">
            {STEPS[activeStepIdx]?.label}
          </span>
        </div>
      </div>

      {/* 4-Step Progress Line */}
      <div className="py-3">
        <div className="relative mb-3">
          <div className="h-1 bg-stone-200 dark:bg-stone-700 rounded-full w-full" />
          <motion.div
            className="h-1 bg-[#ff9f0a] rounded-full absolute top-0 left-0"
            initial={{ width: 0 }}
            animate={{ width: `${(activeStepIdx / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < activeStepIdx;
            const isCurrent = idx === activeStepIdx;

            return (
              <div
                key={step.status}
                className={`p-2 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-sm'
                    : isCompleted
                    ? 'bg-[#f2f2f7] dark:bg-[#2c2c2e] border-emerald-500/30'
                    : 'bg-[#f2f2f7] dark:bg-[#2c2c2e] border-transparent opacity-50'
                }`}
              >
                <div className="text-sm mb-0.5">{step.icon}</div>
                <div className="text-[10px] font-extrabold leading-tight">{step.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary of Items */}
      <div className="bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-xl p-2.5 mb-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#ff9f0a]" />
          <span>Menu commandé ({activeTableOrder.items.length})</span>
        </div>

        <div className="divide-y divide-stone-200 dark:divide-stone-700 max-h-28 overflow-y-auto">
          {activeTableOrder.items.map((item, idx) => (
            <div key={idx} className="py-1 flex items-center justify-between text-[11px]">
              <div className="truncate">
                <span className="font-extrabold text-[#ff9f0a] mr-1">{item.quantity}×</span>
                <span>{item.name}</span>
                {item.cookingPreference && (
                  <span className="text-[9px] text-stone-400 ml-1">
                    ({item.cookingPreference})
                  </span>
                )}
              </div>
              <span className="font-bold text-stone-600 dark:text-stone-400 flex-shrink-0">
                {item.totalPrice.toFixed(2)} €
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Served alert banner */}
      {activeTableOrder.status === 'served' && (
        <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🍷</span>
            <div>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                Plats servis à votre table !
              </p>
              <p className="text-[9px] text-stone-500">
                Bonne dégustation.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOrderServed}
            className="px-2.5 py-1 rounded-full bg-emerald-500 text-white font-extrabold text-[10px] cursor-pointer"
          >
            Options
          </button>
        </div>
      )}

      {/* Live Table Assistance Buttons */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100 dark:border-[#2c2c2e]">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleQuickCall('water_bread', 'Eau & Pain')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#f2f2f7] dark:bg-[#2c2c2e] text-xs font-semibold hover:bg-stone-200 dark:hover:bg-[#3a3a3c] transition-all cursor-pointer"
          >
            <Droplets className="w-3 h-3 text-sky-500" />
            <span>Eau / Pain</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickCall('call_waiter', 'Appel Serveur')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#ff9f0a]/15 text-[#ff9f0a] text-xs font-bold hover:bg-[#ff9f0a]/25 transition-all cursor-pointer"
          >
            <BellRing className="w-3 h-3 text-[#ff9f0a]" />
            <span>Appel Serveur</span>
          </button>
        </div>

        {callSuccessMessage && (
          <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
            <Check className="w-3 h-3 stroke-[3]" />
            <span>{callSuccessMessage}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
