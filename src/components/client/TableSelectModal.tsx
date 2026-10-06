import React, { useState } from 'react';
import { Utensils, CheckCircle2, Sparkles } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { GastronomyLogo } from '../common/GastronomyLogo';

interface TableSelectModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const TableSelectModal: React.FC<TableSelectModalProps> = ({ isOpen, onClose }) => {
  const { selectedTable, setSelectedTable, orders } = useRestaurant();
  const [tempTable, setTempTable] = useState<string>(selectedTable || 'T1');

  if (!isOpen) return null;

  const tableList = Array.from({ length: 12 }, (_, i) => `T${i + 1}`);

  const handleConfirm = () => {
    setSelectedTable(tempTable);
    if (onClose) onClose();
  };

  // Check if table is occupied
  const isTableOccupied = (t: string) => {
    return orders.some((o) => o.tableNumber === t && ['received', 'in_kitchen', 'ready', 'served'].includes(o.status));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0f131d] border border-amber-500/30 p-6 md:p-8 text-stone-100 shadow-2xl overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Center Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <GastronomyLogo size="lg" showText={false} />
          <h1 className="mt-4 text-2xl font-bold font-serif-luxury tracking-wide text-amber-200">
            Bienvenue à l’Ambroisie
          </h1>
          <p className="text-xs text-stone-400 mt-1 max-w-[280px]">
            Veuillez sélectionner le numéro de votre table pour commander en toute fluidité depuis votre smartphone.
          </p>
        </div>

        {/* Table Grid (T1 to T12) */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-amber-400/80 mb-3 px-1">
            <span>Tables du Restaurant</span>
            <span className="text-[11px] text-stone-400 lowercase font-normal flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Salle Principale & Salons
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {tableList.map((tbl) => {
              const isSelected = tempTable === tbl;
              const occupied = isTableOccupied(tbl);

              return (
                <button
                  key={tbl}
                  type="button"
                  onClick={() => setTempTable(tbl)}
                  className={`relative h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-stone-950 font-extrabold shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-105 ring-2 ring-amber-300'
                      : occupied
                      ? 'bg-[#181d2a] border border-amber-500/20 text-stone-300 hover:border-amber-500/40'
                      : 'bg-[#141824] border border-stone-800 text-stone-300 hover:border-amber-500/40 hover:bg-[#1a2030]'
                  }`}
                >
                  <span className="text-sm font-bold tracking-tight">{tbl}</span>
                  <span
                    className={`text-[9px] uppercase tracking-wider ${
                      isSelected ? 'text-stone-900 font-semibold' : occupied ? 'text-amber-400/90' : 'text-emerald-400/90'
                    }`}
                  >
                    {occupied ? 'Occupée' : 'Disponible'}
                  </span>
                  {isSelected && (
                    <div className="absolute top-1 right-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-stone-950" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirm Button */}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-base shadow-[0_4px_25px_rgba(245,158,11,0.4)] hover:shadow-[0_4px_30px_rgba(245,158,11,0.6)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Utensils className="w-5 h-5 text-stone-950" />
          <span>Accéder à la Carte ({tempTable})</span>
        </button>

        <p className="text-[11px] text-stone-500 text-center mt-4">
          Vous pourrez modifier votre table à tout moment depuis la barre supérieure.
        </p>
      </div>
    </div>
  );
};
