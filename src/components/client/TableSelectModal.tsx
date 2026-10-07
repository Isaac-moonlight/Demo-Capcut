import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, CheckCircle2 } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { GastronomyLogo } from '../common/GastronomyLogo';

interface TableSelectModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onTableSelected?: (table: string) => void;
}

export const TableSelectModal: React.FC<TableSelectModalProps> = ({
  isOpen,
  onClose,
  onTableSelected,
}) => {
  const { selectedTable, setSelectedTable, orders } = useRestaurant();
  const [tempTable, setTempTable] = useState<string>(selectedTable || 'T1');

  if (!isOpen) return null;

  const tableList = Array.from({ length: 12 }, (_, i) => `T${i + 1}`);

  const handleConfirm = () => {
    setSelectedTable(tempTable);
    if (onTableSelected) onTableSelected(tempTable);
    if (onClose) onClose();
  };

  const isTableOccupied = (t: string) => {
    return orders.some(
      (o) =>
        o.tableNumber === t &&
        ['received', 'in_kitchen', 'ready', 'served'].includes(o.status)
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="relative w-full max-w-sm rounded-[28px] bg-white dark:bg-[#1c1c1e] text-black dark:text-white p-5 shadow-2xl border border-stone-200 dark:border-[#2c2c2e] overflow-hidden"
        >
          {/* Center Logo */}
          <div className="flex flex-col items-center text-center mb-4">
            <GastronomyLogo size="sm" showText={false} />
            <h2 className="mt-2 text-xl font-extrabold tracking-tight">
              Menu • Table
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-bold uppercase tracking-wider">
              Menu
            </p>
          </div>

          {/* Table Grid (T1 to T12) */}
          <div className="mb-4" data-tour="table-select-grid">
            <div className="grid grid-cols-4 gap-2">
              {tableList.map((tbl) => {
                const isSelected = tempTable === tbl;
                const occupied = isTableOccupied(tbl);

                return (
                  <motion.button
                    key={tbl}
                    type="button"
                    data-tour={tbl === 'T1' ? 'table-item-t1' : undefined}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTempTable(tbl)}
                    className={`relative h-14 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-black text-white dark:bg-white dark:text-black font-black shadow-md'
                        : occupied
                        ? 'bg-[#f2f2f7] dark:bg-[#2c2c2e] text-stone-400 border border-transparent'
                        : 'bg-[#f2f2f7] dark:bg-[#2c2c2e] text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-[#3a3a3c]'
                    }`}
                  >
                    <span className="text-sm font-bold tracking-tight">{tbl}</span>
                    <span
                      className={`text-[8px] uppercase tracking-wider font-bold ${
                        isSelected
                          ? 'opacity-80'
                          : occupied
                          ? 'text-[#ff9f0a]'
                          : 'text-[#30d158]'
                      }`}
                    >
                      {occupied ? 'Occupée' : 'Libre'}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 right-1">
                        <CheckCircle2 className="w-3 h-3 text-current" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Confirm Button */}
          <motion.button
            type="button"
            data-tour="table-select-confirm"
            whileTap={{ scale: 0.94 }}
            onClick={handleConfirm}
            className="w-full py-3.5 px-4 rounded-full bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Utensils className="w-4 h-4" />
            <span>Valider Table {tempTable}</span>
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
