import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Receipt,
  Sparkles,
  Utensils,
  X,
  CreditCard,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Order } from '../../types';

export const FloorPlan2D: React.FC = () => {
  const { orders, waiterCalls, updateOrderStatus } = useRestaurant();
  const [selectedInspectTable, setSelectedInspectTable] = useState<string | null>(null);

  const tables = Array.from({ length: 12 }, (_, i) => `T${i + 1}`);

  // Helpers to get table state
  const getTableData = (tableNum: string) => {
    const activeOrder = orders.find(
      (o) =>
        o.tableNumber === tableNum &&
        ['received', 'in_kitchen', 'ready', 'served'].includes(o.status)
    );
    const billCall = waiterCalls.find(
      (w) => w.tableNumber === tableNum && w.type === 'bill_request' && w.status === 'pending'
    );
    const normalCall = waiterCalls.find(
      (w) => w.tableNumber === tableNum && w.status === 'pending'
    );

    let state: 'free' | 'busy' | 'cooking' | 'bill_needed' = 'free';
    if (billCall) {
      state = 'bill_needed';
    } else if (activeOrder) {
      state = activeOrder.status === 'served' ? 'busy' : 'cooking';
    }

    return { activeOrder, billCall, normalCall, state };
  };

  const inspectedData = selectedInspectTable ? getTableData(selectedInspectTable) : null;

  return (
    <div className="space-y-6">
      {/* Legend Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121622] p-4 rounded-2xl border border-stone-800">
        <div>
          <h2 className="text-base font-bold font-serif-luxury text-amber-200">
            Plan de Salle 2D - Supervision en Direct
          </h2>
          <p className="text-xs text-stone-400">12 tables actives en salle & salons VIP</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-stone-300">Libre</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-stone-300">En cuisine / Service</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-stone-300">À table (Dégustation)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <span className="text-rose-400 font-bold">Addition demandée</span>
          </div>
        </div>
      </div>

      {/* 2D Interactive Floor Layout Canvas */}
      <div className="bg-[#0b0e14] border border-amber-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        {/* Architectural zone banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Zone 1: Salons VIP (T1 - T4) */}
          <div className="rounded-2xl border border-stone-800/80 bg-[#121622]/50 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Salons Privés Vendôme (T1 à T4)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['T1', 'T2', 'T3', 'T4'].map((t) => {
                const info = getTableData(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedInspectTable(t)}
                    className={`h-28 rounded-2xl border p-3 flex flex-col justify-between text-left transition-all relative cursor-pointer ${
                      info.state === 'bill_needed'
                        ? 'bg-rose-500/15 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse'
                        : info.state === 'cooking'
                        ? 'bg-amber-500/10 border-amber-500/60'
                        : info.state === 'busy'
                        ? 'bg-blue-500/10 border-blue-500/60'
                        : 'bg-[#161c2a] border-stone-800 hover:border-emerald-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-black text-white">{t}</span>
                      <span
                        className={`w-3 h-3 rounded-full ${
                          info.state === 'bill_needed'
                            ? 'bg-rose-500'
                            : info.state === 'cooking'
                            ? 'bg-amber-500'
                            : info.state === 'busy'
                            ? 'bg-blue-500'
                            : 'bg-emerald-500'
                        }`}
                      />
                    </div>

                    <div>
                      {info.activeOrder ? (
                        <>
                          <span className="text-[11px] font-bold text-amber-300 block">
                            {info.activeOrder.totalAmount.toFixed(2)} €
                          </span>
                          <span className="text-[10px] text-stone-400 block truncate">
                            {info.activeOrder.items.length} mets • {info.activeOrder.status}
                          </span>
                        </>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-semibold">
                          Disponible
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zone 2: Grande Salle Centrale (T5 - T8) */}
          <div className="rounded-2xl border border-stone-800/80 bg-[#121622]/50 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5" />
              <span>Grande Salle d’Honneur (T5 à T8)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['T5', 'T6', 'T7', 'T8'].map((t) => {
                const info = getTableData(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedInspectTable(t)}
                    className={`h-28 rounded-2xl border p-3 flex flex-col justify-between text-left transition-all relative cursor-pointer ${
                      info.state === 'bill_needed'
                        ? 'bg-rose-500/15 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse'
                        : info.state === 'cooking'
                        ? 'bg-amber-500/10 border-amber-500/60'
                        : info.state === 'busy'
                        ? 'bg-blue-500/10 border-blue-500/60'
                        : 'bg-[#161c2a] border-stone-800 hover:border-emerald-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-black text-white">{t}</span>
                      <span
                        className={`w-3 h-3 rounded-full ${
                          info.state === 'bill_needed'
                            ? 'bg-rose-500'
                            : info.state === 'cooking'
                            ? 'bg-amber-500'
                            : info.state === 'busy'
                            ? 'bg-blue-500'
                            : 'bg-emerald-500'
                        }`}
                      />
                    </div>

                    <div>
                      {info.activeOrder ? (
                        <>
                          <span className="text-[11px] font-bold text-amber-300 block">
                            {info.activeOrder.totalAmount.toFixed(2)} €
                          </span>
                          <span className="text-[10px] text-stone-400 block truncate">
                            {info.activeOrder.items.length} mets • {info.activeOrder.status}
                          </span>
                        </>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-semibold">
                          Disponible
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zone 3: Verrière & Jardin d’Hiver (T9 - T12) */}
          <div className="rounded-2xl border border-stone-800/80 bg-[#121622]/50 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Verrière & Jardin d’Hiver (T9 à T12)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['T9', 'T10', 'T11', 'T12'].map((t) => {
                const info = getTableData(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedInspectTable(t)}
                    className={`h-28 rounded-2xl border p-3 flex flex-col justify-between text-left transition-all relative cursor-pointer ${
                      info.state === 'bill_needed'
                        ? 'bg-rose-500/15 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse'
                        : info.state === 'cooking'
                        ? 'bg-amber-500/10 border-amber-500/60'
                        : info.state === 'busy'
                        ? 'bg-blue-500/10 border-blue-500/60'
                        : 'bg-[#161c2a] border-stone-800 hover:border-emerald-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-black text-white">{t}</span>
                      <span
                        className={`w-3 h-3 rounded-full ${
                          info.state === 'bill_needed'
                            ? 'bg-rose-500'
                            : info.state === 'cooking'
                            ? 'bg-amber-500'
                            : info.state === 'busy'
                            ? 'bg-blue-500'
                            : 'bg-emerald-500'
                        }`}
                      />
                    </div>

                    <div>
                      {info.activeOrder ? (
                        <>
                          <span className="text-[11px] font-bold text-amber-300 block">
                            {info.activeOrder.totalAmount.toFixed(2)} €
                          </span>
                          <span className="text-[10px] text-stone-400 block truncate">
                            {info.activeOrder.items.length} mets • {info.activeOrder.status}
                          </span>
                        </>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-semibold">
                          Disponible
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Inspection Modal for Clicked Table */}
      {selectedInspectTable && inspectedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-[#121622] border border-amber-500/30 p-6 text-stone-100 shadow-2xl">
            <button
              onClick={() => setSelectedInspectTable(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-800">
              <span className="text-2xl font-black px-3 py-1 bg-amber-500 text-stone-950 rounded-xl">
                {selectedInspectTable}
              </span>
              <div>
                <h3 className="text-lg font-bold font-serif-luxury text-amber-200">
                  Détail de la Table
                </h3>
                <span className="text-xs text-stone-400 capitalize">
                  État : {inspectedData.state.replace('_', ' ')}
                </span>
              </div>
            </div>

            {inspectedData.activeOrder ? (
              <div className="space-y-4">
                <div className="bg-[#181d2c] p-3 rounded-xl border border-stone-800">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-400">Numéro Commande :</span>
                    <span className="font-bold">#{inspectedData.activeOrder.id}</span>
                  </div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-400">Statut de Préparation :</span>
                    <span className="font-bold text-amber-300">
                      {inspectedData.activeOrder.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-400">Total Courant :</span>
                    <span className="font-bold text-amber-400">
                      {inspectedData.activeOrder.totalAmount.toFixed(2)} €
                    </span>
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {inspectedData.activeOrder.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="text-xs bg-[#141824] p-2 rounded-lg flex justify-between"
                    >
                      <span>
                        {it.quantity}× {it.name}
                      </span>
                      <span className="font-bold">{it.totalPrice.toFixed(2)} €</span>
                    </div>
                  ))}
                </div>

                {inspectedData.activeOrder.status !== 'paid' && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (inspectedData.activeOrder) {
                        await updateOrderStatus(inspectedData.activeOrder.id, 'paid');
                        setSelectedInspectTable(null);
                      }
                    }}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Encaisser & Clôturer la Table</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-stone-400 text-sm">
                Cette table est actuellement libre et prête à accueillir de nouveaux convives.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
