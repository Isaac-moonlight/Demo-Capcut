import React, { useState, useRef, useEffect } from 'react';
import {
  Utensils,
  ShoppingBag,
  BellRing,
  Sparkles,
  ChevronUp,
  Receipt,
  Heart,
  HelpCircle,
  Wine,
} from 'lucide-react';
import { useRestaurant } from './context/RestaurantContext';
import { useTheme } from './context/ThemeContext';
import { MENU_CATEGORIES } from './data/menuData';
import { Dish } from './types';

// Common Components
import { GastronomyLogo } from './components/common/GastronomyLogo';
import { ThemeToggle } from './components/common/ThemeToggle';
import { PinModal } from './components/common/PinModal';

// Client Components
import { TableSelectModal } from './components/client/TableSelectModal';
import { HeroHeader } from './components/client/HeroHeader';
import { DishCard } from './components/client/DishCard';
import { DishDetailModal } from './components/client/DishDetailModal';
import { CartFloatingBar } from './components/client/CartFloatingBar';
import { CartDrawer } from './components/client/CartDrawer';
import { LiveOrderRadar } from './components/client/LiveOrderRadar';
import { PostServiceModal } from './components/client/PostServiceModal';
import { BillPaymentModal } from './components/client/BillPaymentModal';
import { SatisfactionFeedbackModal } from './components/client/SatisfactionFeedbackModal';

// Staff Layout
import { StaffLayout } from './components/staff/StaffLayout';

export default function App() {
  const {
    selectedTable,
    setSelectedTable,
    cartItemsCount,
    cartSubtotal,
    activeTableOrder,
    isStaffAuthenticated,
    dishes,
    finishClientService,
  } = useRestaurant();

  const { theme } = useTheme();

  // Modals & Drawers state
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [selectedDishForDetail, setSelectedDishForDetail] = useState<Dish | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPostServiceModalOpen, setIsPostServiceModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('starters');

  // View state: 'client' | 'staff'
  const [currentView, setCurrentView] = useState<'client' | 'staff'>('client');

  // Category refs for smooth scrolling
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});

  // Auto trigger table selection on first load if none is selected
  useEffect(() => {
    if (!selectedTable && !isStaffAuthenticated) {
      setIsTableModalOpen(true);
    }
  }, [selectedTable, isStaffAuthenticated]);

  // When order becomes 'served', auto prompt the festive post-service modal
  useEffect(() => {
    if (activeTableOrder?.status === 'served') {
      setIsPostServiceModalOpen(true);
    }
  }, [activeTableOrder?.status]);

  // Scroll smoothly to a menu section
  const scrollToCategory = (catId: string) => {
    setActiveCategoryTab(catId);
    const elem = categoryRefs.current[catId];
    if (elem) {
      const topOffset = elem.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  // Staff entrance handlers (Triple click or discreet dot)
  const handleOpenStaffAuth = () => {
    if (isStaffAuthenticated) {
      setCurrentView('staff');
    } else {
      setIsPinModalOpen(true);
    }
  };

  const handleStaffSuccess = () => {
    setIsPinModalOpen(false);
    setCurrentView('staff');
  };

  // If in staff view and staff is authenticated, show the complete Staff Brigade ERP
  if (currentView === 'staff' && isStaffAuthenticated) {
    return <StaffLayout onBackToClient={() => setCurrentView('client')} />;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0b0e14] text-stone-100' : 'bg-[#faf6f0] text-stone-900'} transition-colors duration-200 selection:bg-amber-500/30 selection:text-amber-200`}>
      {/* 1. TOP CLIENT HEADER */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
        theme === 'dark' ? 'bg-[#0d1017]/95 border-amber-500/15' : 'bg-[#faf6f0]/95 border-stone-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo with TRIPLE-CLICK secret staff trigger */}
          <div className="flex items-center">
            <GastronomyLogo
              size="md"
              onTripleClick={handleOpenStaffAuth}
              className="cursor-pointer"
            />
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Table Badge Selector */}
            <button
              type="button"
              onClick={() => setIsTableModalOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                selectedTable
                  ? 'bg-amber-500/10 text-amber-500 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700'
              }`}
              title="Modifier le numéro de table"
            >
              <Utensils className="w-3.5 h-3.5 text-amber-500" />
              <span>{selectedTable ? `Table ${selectedTable}` : 'Choisir Table'}</span>
            </button>

            {/* Active order quick view button */}
            {activeTableOrder && (
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 text-amber-400 text-xs font-bold hover:scale-105 transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Suivi Commande</span>
              </button>
            )}

            {/* Dark/Light Theme Toggle */}
            <ThemeToggle />

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Ouvrir le panier"
              className="relative p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold transition-all shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-stone-950 text-amber-300 text-[10px] font-black flex items-center justify-center border border-amber-400 shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO HEADER (Levitation Plate & Category Badges) */}
      <HeroHeader
        onCategoryClick={scrollToCategory}
        activeCategory={activeCategoryTab}
      />

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Real-time Live Order Radar if active order exists for this table */}
        {activeTableOrder && (
          <LiveOrderRadar
            onOrderServed={() => setIsPostServiceModalOpen(true)}
          />
        )}

        {/* 4. DISH CATALOG BY CATEGORIES (AIRY CARDS & DELIBERATE SPACING) */}
        {MENU_CATEGORIES.map((category) => {
          const categoryDishes = dishes.filter((d) => d.category === category.id);

          return (
            <section
              key={category.id}
              ref={(el) => {
                categoryRefs.current[category.id] = el;
              }}
              className="pt-4 scroll-mt-24"
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-4 mb-6 border-b border-amber-500/20">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    {category.icon}
                  </span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury tracking-tight text-stone-900 dark:text-stone-100">
                      {category.name}
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-luxury italic">
                      {category.description}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-amber-600 dark:text-amber-400/80 font-semibold self-end sm:self-auto">
                  {categoryDishes.length} créations du Chef
                </span>
              </div>

              {/* Airy Cards Grid (Generous spacing to avoid crowded clutter) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {categoryDishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    onSelect={(d) => setSelectedDishForDetail(d)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* 5. FLOATING PERSISTENT CART BAR */}
      <CartFloatingBar onOpenCart={() => setIsCartOpen(true)} />

      {/* 6. MODALS & DRAWERS */}
      {/* A. Mandatory Table Selection Modal */}
      <TableSelectModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
      />

      {/* B. Dish Fine Customization Modal */}
      <DishDetailModal
        dish={selectedDishForDetail}
        onClose={() => setSelectedDishForDetail(null)}
      />

      {/* C. Cart Drawer with Incentive Chef Gauge */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderSuccess={(orderId) => {
          // scroll to radar
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
      />

      {/* D. Post-Service Modal (Plats servis ! Desserts ou Addition) */}
      <PostServiceModal
        isOpen={isPostServiceModalOpen}
        onClose={() => setIsPostServiceModalOpen(false)}
        onChooseDesserts={() => {
          setIsPostServiceModalOpen(false);
          scrollToCategory('desserts');
        }}
        onChooseBill={() => {
          setIsPostServiceModalOpen(false);
          setIsBillModalOpen(true);
        }}
      />

      {/* E. Bill Settlement Modal (Tip, Split the bill, Apple Pay / TPE) */}
      <BillPaymentModal
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
        onPaymentSuccess={() => {
          setIsBillModalOpen(false);
          setIsFeedbackModalOpen(true);
        }}
      />

      {/* F. Satisfaction Feedback & Invoice Modal */}
      <SatisfactionFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onFinishService={() => {
          setIsFeedbackModalOpen(false);
          finishClientService();
          setIsTableModalOpen(true);
        }}
      />

      {/* G. PIN Modal for Discreet Staff Access */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handleStaffSuccess}
      />

      {/* 7. LUXURY FOOTER WITH DISCREET TRIGGER 2 (TINY BULLET DOT `·`) */}
      <footer className="mt-20 border-t border-amber-500/10 py-12 px-4 sm:px-6 text-center text-xs text-stone-500 dark:text-stone-400 bg-black/20">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <GastronomyLogo size="sm" showText={false} />

          <p className="font-serif-luxury text-sm text-stone-600 dark:text-stone-400 italic">
            « La gastronomie est l’art d’utiliser la nourriture pour créer le bonheur. »
          </p>

          <p className="text-[11px] text-stone-500">
            DineFlow Pro © {new Date().getFullYear()} — L’Ambroisie Royale • 14 Place Vendôme, 75001 Paris
          </p>

          <div className="text-[10px] text-stone-600 dark:text-stone-400 flex items-center justify-center gap-1.5 select-none">
            <span>Tous droits réservés</span>
            {/* Déclencheur secret 2 : Clic sur une minuscule puce (`·`) */}
            <button
              type="button"
              onClick={handleOpenStaffAuth}
              className="text-stone-600 dark:text-stone-400 hover:text-amber-500 text-xs px-1 py-0.5 cursor-pointer transition-colors"
              title="·"
              aria-label="Accès confidentiel"
            >
              ·
            </button>
            <span>Service en salle & brigade d’exception</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
