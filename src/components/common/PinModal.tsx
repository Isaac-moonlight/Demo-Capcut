import React, { useState } from 'react';
import { X, Delete, ShieldCheck, Lock } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { authenticateStaff } = useRestaurant();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const nextPin = pin + digit;
    setPin(nextPin);
    setError(false);

    if (nextPin.length === 4) {
      setTimeout(() => {
        const ok = authenticateStaff(nextPin);
        if (ok) {
          setPin('');
          onSuccess();
        } else {
          setError(true);
          setPin('');
        }
      }, 150);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#121622] border border-amber-500/20 shadow-2xl p-6 text-stone-100 overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-serif-luxury tracking-wide text-amber-200">
            Accès Espace Brigade
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-[240px]">
            Saisissez votre code confidentiel de service pour accéder au KDS, POS et ERP.
          </p>
        </div>

        {/* PIN Indicators */}
        <div className={`flex justify-center items-center gap-4 mb-8 ${error ? 'animate-shake' : ''}`}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = index < pin.length;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  error
                    ? 'bg-rose-500 ring-4 ring-rose-500/20'
                    : isFilled
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)] scale-110'
                    : 'bg-stone-800 border border-stone-700'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-rose-400 text-xs text-center -mt-5 mb-5 font-medium animate-in fade-in">
            Code incorrect. Veuillez renouveler la saisie.
          </p>
        )}

        {/* Tactile Keypad */}
        <div data-tour="pin-keypad" className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="h-14 rounded-2xl bg-[#1a2030] hover:bg-amber-500/20 active:scale-95 border border-stone-800 hover:border-amber-500/40 text-xl font-semibold text-white transition-all duration-150 flex items-center justify-center shadow-sm select-none"
            >
              {digit}
            </button>
          ))}

          <button
            type="button"
            onClick={handleClear}
            className="h-14 rounded-2xl bg-[#161a26] hover:bg-stone-800 text-xs uppercase tracking-wider text-stone-400 hover:text-white transition-all flex items-center justify-center font-bold"
          >
            Effacer
          </button>

          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-[#1a2030] hover:bg-amber-500/20 active:scale-95 border border-stone-800 hover:border-amber-500/40 text-xl font-semibold text-white transition-all flex items-center justify-center shadow-sm select-none"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-[#161a26] hover:bg-stone-800 text-stone-300 hover:text-white transition-all flex items-center justify-center"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500/60" />
          <span>Accès réservé au personnel de salle et cuisine</span>
        </div>
      </div>
    </div>
  );
};
