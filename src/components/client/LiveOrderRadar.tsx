import React, { useState } from 'react';
import {
  BellRing,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  Droplets,
  HelpCircle,
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
    label: 'Reçue en brigade',
    icon: '📝',
    desc: 'Bons imprimés et affectés aux postes',
  },
  {
    status: 'in_kitchen',
    label: 'En cuisson & dressage',
    icon: '🔥',
    desc: 'Le Chef et la brigade préparent vos mets',
  },
  {
    status: 'ready',
    label: 'Prête au passe',
    icon: '🛎️',
    desc: 'Contrôle qualité & cloche de service',
  },
  {
    status: 'served',
    label: 'Servie à table',
    icon: '🍷',
    desc: 'Service en salle & dégustation',
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
    setCallSuccessMessage(`${label} transmise au maître d'hôtel ✓`);
    setTimeout(() => setCallSuccessMessage(null), 4000);
  };

  return (
    <div className="rounded-3xl p-5 sm:p-6 bg-[#0f131d] border border-amber-500/30 shadow-2xl relative overflow-hidden text-stone-100 mb-8">
      {/* Radiant Radar Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-stone-800 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Radar de Cuisson en Direct</span>
          </div>
          <h3 className="text-xl font-bold font-serif-luxury text-stone-100 flex items-center gap-2">
            <span>Commande #{activeTableOrder.id}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-800 text-amber-400 font-sans border border-amber-500/20">
              Table {selectedTable}
            </span>
          </h3>
        </div>

        {/* Real-time pulse indicator */}
        <div className="flex items-center gap-2 bg-[#141824] px-3.5 py-2 rounded-2xl border border-stone-800">
          <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <div className="text-right">
            <span className="text-[11px] text-stone-400 block leading-none">Statut</span>
            <span className="text-xs font-bold text-amber-300">
              {STEPS[activeStepIdx]?.label}
            </span>
          </div>
        </div>
      </div>

      {/* 4-Step Progress Radar Line */}
      <div className="py-6 relative z-10">
        {/* Connected Line */}
        <div className="relative mb-6">
          <div className="h-1.5 bg-stone-800 rounded-full w-full" />
          <div
            className="h-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-full absolute top-0 left-0 transition-all duration-700"
            style={{ width: `${(activeStepIdx / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < activeStepIdx;
            const isCurrent = idx === activeStepIdx;

            return (
              <div
                key={step.status}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-b from-[#1b2233] to-[#121622] border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)] scale-[1.02]'
                    : isCompleted
                    ? 'bg-[#121620] border-emerald-500/30 text-stone-300'
                    : 'bg-[#10141e] border-stone-800/80 text-stone-500 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{step.icon}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-stone-700" />
                  )}
                </div>

                <div className="text-xs font-bold text-stone-100">{step.label}</div>
                <div className="text-[10px] text-stone-400 mt-0.5 leading-snug">{step.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary of Items Ordered */}
      <div className="bg-[#121622] rounded-2xl p-4 border border-stone-800/80 mb-5 relative z-10">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mets en Préparation ({activeTableOrder.items.length})</span>
        </div>

        <div className="divide-y divide-stone-800/60">
          {activeTableOrder.items.map((item, idx) => (
            <div key={idx} className="py-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-300">{item.quantity}×</span>
                <span className="text-stone-200">{item.name}</span>
                {item.cookingPreference && (
                  <span className="text-[10px] text-stone-400 italic">
                    ({item.cookingPreference})
                  </span>
                )}
              </div>
              <span className="font-semibold text-stone-400">
                {item.totalPrice.toFixed(2)} €
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* If served, quick transition button */}
      {activeTableOrder.status === 'served' && (
        <div className="mb-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🍷</span>
            <div>
              <p className="text-xs font-bold text-emerald-300">
                Vos plats sont servis à votre table !
              </p>
              <p className="text-[11px] text-stone-400">
                Bon appétit et excellente dégustation.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOrderServed}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Options Service
          </button>
        </div>
      )}

      {/* Live Table Assistance Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-stone-800 relative z-10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleQuickCall('water_bread', "Demande d'eau & pain")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <Droplets className="w-3.5 h-3.5 text-sky-400" />
            <span>Eau / Pain</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickCall('call_waiter', 'Appel du maître d’hôtel')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all cursor-pointer"
          >
            <BellRing className="w-3.5 h-3.5 text-amber-400" />
            <span>Appeler le Serveur</span>
          </button>
        </div>

        {callSuccessMessage && (
          <div className="text-xs font-medium text-emerald-400 flex items-center gap-1 animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>{callSuccessMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
