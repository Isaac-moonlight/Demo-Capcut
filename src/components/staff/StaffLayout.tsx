import React, { useState } from 'react';
import {
  ChefHat,
  CreditCard,
  LayoutGrid,
  FileText,
  LogOut,
  BellRing,
  Check,
  Droplets,
  HelpCircle,
  Receipt,
  Volume2,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { GastronomyLogo } from '../common/GastronomyLogo';
import { ThemeToggle } from '../common/ThemeToggle';
import { KdsKitchen } from './KdsKitchen';
import { PosCashier } from './PosCashier';
import { FloorPlan2D } from './FloorPlan2D';
import { BillingErp } from './BillingErp';
import { playServiceBell } from '../../lib/audio';

interface StaffLayoutProps {
  onBackToClient: () => void;
}

export const StaffLayout: React.FC<StaffLayoutProps> = ({ onBackToClient }) => {
  const {
    staffSection,
    setStaffSection,
    logoutStaff,
    waiterCalls,
    resolveWaiterCall,
    orders,
  } = useRestaurant();

  const activeKitchenCount = orders.filter((o) =>
    ['received', 'in_kitchen', 'ready'].includes(o.status)
  ).length;

  return (
    <div className="min-h-screen bg-[#0b0e14] text-stone-100 flex flex-col font-sans">
      {/* Top Staff Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0d1017]/95 backdrop-blur-md border-b border-amber-500/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Brigade badge */}
          <div className="flex items-center gap-3">
            <GastronomyLogo size="sm" showText={false} />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display-luxury font-bold text-amber-300 text-sm">
                  DineFlow Pro
                </span>
                <span className="text-[10px] bg-red-500/20 text-red-400 font-extrabold uppercase px-1.5 py-0.5 rounded border border-red-500/30">
                  Espace Brigade
                </span>
              </div>
              <span className="text-[10px] text-stone-400">Personnel de Salle & Cuisine</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav aria-label="Modules du personnel" className="flex items-center gap-1.5 bg-[#141824] p-1 rounded-2xl border border-stone-800">
            <button
              type="button"
              onClick={() => setStaffSection('kds')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                staffSection === 'kds'
                  ? 'bg-amber-500 text-stone-950 font-black shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Cuisine KDS</span>
              {activeKitchenCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-stone-950 text-amber-300 text-[10px] font-black flex items-center justify-center">
                  {activeKitchenCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStaffSection('pos')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                staffSection === 'pos'
                  ? 'bg-amber-500 text-stone-950 font-black shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Caisse POS</span>
            </button>

            <button
              type="button"
              onClick={() => setStaffSection('tables')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                staffSection === 'tables'
                  ? 'bg-amber-500 text-stone-950 font-black shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Plan de Salle 2D</span>
            </button>

            <button
              type="button"
              onClick={() => setStaffSection('erp')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                staffSection === 'erp'
                  ? 'bg-amber-500 text-stone-950 font-black shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Facturation & Stocks</span>
            </button>
          </nav>

          {/* Right actions: Theme, Sound & Logout */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => playServiceBell(1760)}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Tester la cloche de service"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
            </button>

            <button
              type="button"
              onClick={() => {
                logoutStaff();
                onBackToClient();
              }}
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Revenir au menu client"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quitter Brigade</span>
            </button>
          </div>
        </div>
      </header>

      {/* Live Waiter Calls Alert Bar with "Traité ✓" instant Firestore deletion */}
      {waiterCalls.length > 0 && (
        <aside aria-label="Alertes serveur en direct" className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 px-4 py-2.5 shadow-lg border-b border-amber-400">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto">
            <div className="flex items-center gap-2 flex-shrink-0 font-bold text-xs uppercase tracking-wide">
              <BellRing className="w-4 h-4 animate-bounce" />
              <span>Appels Serveur Actifs ({waiterCalls.length}) :</span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto py-0.5">
              {waiterCalls.map((call) => (
                <div
                  key={call.id}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-black/85 text-white text-xs font-semibold border border-amber-400/40 shadow-sm flex-shrink-0 animate-in fade-in"
                >
                  <span className="font-black text-amber-400 bg-stone-900 px-1.5 py-0.5 rounded">
                    {call.tableNumber}
                  </span>

                  <span>
                    {call.type === 'bill_request'
                      ? '💳 Demande d’addition'
                      : call.type === 'water_bread'
                      ? '🥖 Eau & Pain'
                      : '🛎️ Appel Serveur'}
                  </span>

                  {/* "Traité ✓" button with real-time deletion from Firestore */}
                  <button
                    type="button"
                    onClick={() => resolveWaiterCall(call.id)}
                    className="ml-1 px-2.5 py-0.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-[11px] uppercase transition-colors cursor-pointer flex items-center gap-1"
                    title="Marquer comme traité et supprimer de l'écran"
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Traité ✓</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}

      {/* Main Staff Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {staffSection === 'kds' && <KdsKitchen />}
        {staffSection === 'pos' && (
          <PosCashier
            onRedirectToInvoice={(orderId) => {
              setStaffSection('erp');
            }}
          />
        )}
        {staffSection === 'tables' && <FloorPlan2D />}
        {staffSection === 'erp' && <BillingErp />}
      </main>
    </div>
  );
};
