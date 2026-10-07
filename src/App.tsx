import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Utensils,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useRestaurant } from './context/RestaurantContext';
import { useTheme } from './context/ThemeContext';
import { MENU_CATEGORIES } from './data/menuData';
import { Dish } from './types';

// Common Components
import { GastronomyLogo } from './components/common/GastronomyLogo';
import { ThemeToggle } from './components/common/ThemeToggle';
import { PinModal } from './components/common/PinModal';
import { FlyingItemToCart, FlyingItem } from './components/common/FlyingItemToCart';

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

// Staff Layout (PC Wide Mode)
import { StaffLayout } from './components/staff/StaffLayout';

// Tour Components
import { useTour } from './context/TourContext';
import { InteractiveTourSpotlight } from './components/tour/InteractiveTourSpotlight';
import { TourWelcomeModal } from './components/tour/TourWelcomeModal';
import { TourCompletionModal } from './components/tour/TourCompletionModal';
import { TourFloatingLauncher } from './components/tour/TourFloatingLauncher';

// Category color aura map for dynamic morphing background
const CATEGORY_BACKGROUND_AURAS: Record<string, { bg: string; glow: string; name: string }> = {
  starters: {
    bg: 'from-[#d4af37]/20 via-[#f8f4ee]/10 to-transparent',
    glow: 'rgba(212, 175, 55, 0.25)',
    name: 'Champagne & Or Impérial',
  },
  meats: {
    bg: 'from-[#c2410c]/25 via-[#7c2d12]/15 to-transparent',
    glow: 'rgba(194, 65, 12, 0.3)',
    name: 'Braises & Maturation',
  },
  seafood: {
    bg: 'from-[#0284c7]/25 via-[#0369a1]/15 to-transparent',
    glow: 'rgba(2, 132, 199, 0.3)',
    name: 'Iode & Côtes Océanes',
  },
  desserts: {
    bg: 'from-[#eab308]/25 via-[#fef08a]/15 to-transparent',
    glow: 'rgba(234, 179, 8, 0.25)',
    name: 'Vanille & Praliné',
  },
  wines: {
    bg: 'from-[#991b1b]/30 via-[#7f1d1d]/15 to-transparent',
    glow: 'rgba(153, 27, 27, 0.35)',
    name: 'Grands Crus & Rubis',
  },
  cocktails: {
    bg: 'from-[#f59e0b]/25 via-[#b45309]/15 to-transparent',
    glow: 'rgba(245, 158, 11, 0.3)',
    name: 'Mixologie & Infusions',
  },
};

export default function App() {
  const {
    selectedTable,
    setSelectedTable,
    cartItemsCount,
    cartSubtotal,
    activeTableOrder,
    isStaffAuthenticated,
    authenticateStaff,
    staffSection,
    setStaffSection,
    dishes,
    addToCart,
    finishClientService,
  } = useRestaurant();

  const { theme } = useTheme();
  const { currentStep, status: tourStatus, notifyActionDone } = useTour();

  // Modals & Drawers state
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [selectedDishForDetail, setSelectedDishForDetail] = useState<Dish | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPostServiceModalOpen, setIsPostServiceModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('starters');

  // Flying items to cart state (Éléments qui se déplacent d'un point à un autre)
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const cartButtonRef = useRef<HTMLButtonElement | null>(null);
  const [cartBounce, setCartBounce] = useState(false);

  // View state: 'client' (téléphone-tablette) | 'staff' (PC mode)
  const [currentView, setCurrentView] = useState<'client' | 'staff'>('client');

  // Category refs for smooth scrolling
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});

  // Tour view and state synchronization
  useEffect(() => {
    if (tourStatus !== 'active' || !currentStep) return;

    // 1. View syncing (client vs staff)
    if (currentStep.requiresView === 'staff') {
      if (!isStaffAuthenticated) {
        authenticateStaff('1234');
      }
      setCurrentView('staff');
      if (currentStep.requiresStaffSection) {
        setStaffSection(currentStep.requiresStaffSection);
      }
    } else if (currentStep.requiresView === 'client') {
      if (currentView !== 'client') {
        setCurrentView('client');
      }
    }

    // 2. Modals syncing for interactive demonstration
    if (currentStep.id === 'step_table_intro' || currentStep.id === 'step_table_confirm') {
      setIsTableModalOpen(true);
    }
    if (['step_dish_cooking', 'step_dish_addon', 'step_dish_qty', 'step_dish_add'].includes(currentStep.id)) {
      if (!selectedDishForDetail) {
        const wagyu = dishes.find((d) => d.id === 'wagyu-a5') || dishes[0];
        setSelectedDishForDetail(wagyu);
      }
    }
    if (currentStep.id === 'step_cart_floating_bar') {
      if (cartItemsCount === 0) {
        const wagyu = dishes.find((d) => d.id === 'wagyu-a5') || dishes[0];
        addToCart({
          dishId: wagyu.id,
          name: wagyu.name,
          price: wagyu.price,
          quantity: 1,
          selectedAddons: [],
          image: wagyu.image,
        });
      }
    }
    if (currentStep.id === 'step_cart_notes' || currentStep.id === 'step_cart_send_kitchen') {
      setIsCartOpen(true);
    }
    if (currentStep.id === 'step_pin_modal') {
      setIsPinModalOpen(true);
    }
    if (currentStep.id === 'step_post_service_choice') {
      setIsPostServiceModalOpen(true);
    }
    if (['step_bill_tip', 'step_bill_split', 'step_bill_pay'].includes(currentStep.id)) {
      setIsBillModalOpen(true);
    }
    if (['step_feedback_stars', 'step_feedback_receipt', 'step_feedback_receipt_finish'].includes(currentStep.id)) {
      setIsFeedbackModalOpen(true);
    }
  }, [
    tourStatus,
    currentStep,
    currentView,
    isStaffAuthenticated,
    authenticateStaff,
    setStaffSection,
    dishes,
    selectedDishForDetail,
    cartItemsCount,
    addToCart,
  ]);

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

  // Scroll smoothly to a menu section and trigger morphing background aura
  const scrollToCategory = (catId: string) => {
    setActiveCategoryTab(catId);
    const elem = categoryRefs.current[catId];
    if (elem) {
      const topOffset = elem.getBoundingClientRect().top + window.scrollY - 75;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  // Flying Item Handler (déplacement fluide vers le panier)
  const handleQuickAddWithFly = (e: React.MouseEvent, dish: Dish) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cartRect = cartButtonRef.current?.getBoundingClientRect() || {
      left: window.innerWidth - 60,
      top: 30,
    };

    const newFlyingItem: FlyingItem = {
      id: `fly-${Date.now()}-${Math.random()}`,
      startX: rect.left + rect.width / 2,
      startY: rect.top + rect.height / 2,
      targetX: cartRect.left + 20,
      targetY: cartRect.top + 20,
      image: dish.image,
    };

    setFlyingItems((prev) => [...prev, newFlyingItem]);

    // Add to cart in context
    addToCart({
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: 1,
      selectedAddons: [],
      image: dish.image,
    });
  };

  const handleFlyingComplete = (id: string) => {
    setFlyingItems((prev) => prev.filter((i) => i.id !== id));
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 400);
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

  // 1. SECTION BRIGADE / STAFF : RESTE EN MODE PC (Large Desktop Dashboard 100%)
  if (currentView === 'staff' && isStaffAuthenticated) {
    return (
      <>
        <StaffLayout onBackToClient={() => setCurrentView('client')} />
        <InteractiveTourSpotlight />
        <TourWelcomeModal />
        <TourCompletionModal />
        <TourFloatingLauncher />
      </>
    );
  }

  // Active category aura
  const activeAura = CATEGORY_BACKGROUND_AURAS[activeCategoryTab] || CATEGORY_BACKGROUND_AURAS.starters;

  // 2. SECTION CLIENT : ADAPTÉE EN MODE TÉLÉPHONE-TABLETTE (max-w-md sm:max-w-xl centré)
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#06070a]' : 'bg-[#efebe4]'} transition-colors duration-500 flex justify-center selection:bg-[#d4af37]/30 selection:text-[#d4af37]`}>
      {/* Flying items layer */}
      <FlyingItemToCart items={flyingItems} onComplete={handleFlyingComplete} />

      {/* Centered Phone-Tablet Container (Format Mobile-Tablette Propre) */}
      <div className={`w-full max-w-md sm:max-w-xl min-h-screen ${theme === 'dark' ? 'bg-[#090a0f] text-stone-100' : 'bg-[#f8f4ee] text-stone-900'} shadow-[0_0_50px_rgba(0,0,0,0.4)] border-x border-[#e8dfd5] dark:border-[#1a1d29] relative flex flex-col justify-between overflow-x-hidden transition-colors duration-300`}>
        
        {/* DYNAMIC MORPHING BACKGROUND (Change de couleur selon le bouton cliqué) */}
        <motion.div
          key={activeCategoryTab}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className={`absolute top-0 left-0 right-0 h-96 bg-gradient-to-b ${activeAura.bg} pointer-events-none blur-3xl z-0`}
        />

        {/* Inner Content Wrapper */}
        <div className="relative z-10 flex flex-col flex-1">
          {/* TOP CLIENT HEADER (Compact Mobile-Tablet Bar) */}
          <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
            theme === 'dark' ? 'bg-[#090a0f]/95 border-[#1c1f2e]' : 'bg-[#f8f4ee]/95 border-[#e8dfd5]'
          }`}>
            <div className="px-3 sm:px-5 h-16 flex items-center justify-between gap-2">
              {/* Logo with TRIPLE-CLICK secret staff trigger */}
              <div className="flex items-center" data-tour="staff-secret-logo">
                <GastronomyLogo
                  size="sm"
                  onTripleClick={handleOpenStaffAuth}
                  className="cursor-pointer"
                />
              </div>

              {/* Right Header Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Table Badge Selector */}
                <button
                  type="button"
                  data-tour="client-table-badge"
                  onClick={() => setIsTableModalOpen(true)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    selectedTable
                      ? 'bg-[#d4af37]/15 text-[#b88e55] dark:text-[#e5c158] border-[#d4af37]/40 hover:bg-[#d4af37]/25'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                  }`}
                  title="Modifier le numéro de table"
                >
                  <Utensils className="w-3 h-3 text-[#d4af37]" />
                  <span>{selectedTable ? `Table ${selectedTable}` : 'Table'}</span>
                </button>

                {/* Dark/Light Theme Toggle */}
                <ThemeToggle />

                {/* Cart Button with Punchy Bounce on Item Arrival */}
                <motion.button
                  ref={cartButtonRef}
                  type="button"
                  animate={cartBounce ? { scale: [1, 1.35, 0.9, 1.15, 1], rotate: [0, -10, 10, -5, 0] } : { scale: 1 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setIsCartOpen(true)}
                  aria-label="Ouvrir le panier"
                  className="relative p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b88e55] hover:from-[#e5c158] hover:to-[#d4af37] active:scale-90 text-stone-950 font-black transition-all shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-stone-950 text-[#e5c158] text-[9px] font-black flex items-center justify-center border border-[#d4af37] shadow-sm">
                      {cartItemsCount}
                    </span>
                  )}
                </motion.button>
              </div>
            </div>
          </header>

          {/* HERO HEADER (Texte qui ondule, zoom percutant, et badges) */}
          <HeroHeader
            onCategoryClick={scrollToCategory}
            activeCategory={activeCategoryTab}
          />

          {/* MAIN CONTENT (Strictement 2 plats par ligne sur téléphone-tablette) */}
          <main className="px-3 sm:px-4 py-4 space-y-6 flex-1">
            {/* Real-time Live Order Radar if active order exists for this table */}
            {activeTableOrder && (
              <LiveOrderRadar
                onOrderServed={() => setIsPostServiceModalOpen(true)}
              />
            )}

            {/* CATALOGUE PAR CATÉGORIES (STRICTEMENT 2 PLATS PAR LIGNE) */}
            {MENU_CATEGORIES.map((category) => {
              const categoryDishes = dishes.filter((d) => d.category === category.id);

              return (
                <section
                  key={category.id}
                  ref={(el) => {
                    categoryRefs.current[category.id] = el;
                  }}
                  className="pt-2 scroll-mt-20"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between gap-1 pb-2 mb-3 border-b border-[#e8dfd5] dark:border-[#1f2334]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg p-1 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/25">
                        {category.icon}
                      </span>
                      <div>
                        <h2 className="text-sm sm:text-base font-bold font-serif-luxury tracking-tight text-stone-900 dark:text-stone-100">
                          {category.name}
                        </h2>
                      </div>
                    </div>

                    <span className="text-[10px] text-[#b88e55] dark:text-[#e5c158] font-bold">
                      {categoryDishes.length} mets
                    </span>
                  </div>

                  {/* 2 PLATS PAR LIGNE SUR TÉLÉPHONE & TABLETTE (grid-cols-2) */}
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                    {categoryDishes.map((dish, idx) => (
                      <DishCard
                        key={dish.id}
                        dish={dish}
                        index={idx}
                        onSelect={(d) => setSelectedDishForDetail(d)}
                        onQuickAdd={handleQuickAddWithFly}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </main>
        </div>

        {/* FLOATING PERSISTENT CART BAR */}
        <CartFloatingBar onOpenCart={() => setIsCartOpen(true)} />

        {/* MODALS & DRAWERS */}
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
            window.scrollTo({ top: 150, behavior: 'smooth' });
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

        {/* F. Satisfaction Feedback & Realistic Black & White Receipt Modal */}
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

        {/* COMPACT FOOTER WITH DISCREET TRIGGER 2 (TINY BULLET DOT `·`) */}
        <footer className="mt-8 border-t border-[#e8dfd5] dark:border-[#1c1f2e] py-6 px-3 text-center text-xs text-stone-500 dark:text-stone-400 bg-black/5 dark:bg-black/20 relative z-10">
          <div className="flex flex-col items-center gap-2">
            <GastronomyLogo size="sm" showText={false} />

            <p className="font-serif-luxury text-[11px] text-stone-600 dark:text-stone-400 font-medium">
              Menu • DineFlow Pro — Haute Gastronomie
            </p>

            <p className="text-[10px] text-stone-500">
              DineFlow Pro © {new Date().getFullYear()} — L’Ambroisie Royale • Paris
            </p>

            <div className="text-[9px] text-stone-600 dark:text-stone-400 flex items-center justify-center gap-1 select-none">
              <span>Tous droits réservés</span>
              {/* Déclencheur secret 2 : Clic sur une minuscule puce (`·`) */}
              <button
                type="button"
                data-tour="staff-secret-dot"
                onClick={handleOpenStaffAuth}
                className="text-stone-500 hover:text-[#d4af37] text-xs px-1 cursor-pointer transition-colors"
                title="·"
                aria-label="Accès confidentiel brigade"
              >
                ·
              </button>
              <span>Service en salle</span>
            </div>
          </div>
        </footer>

        {/* INTERACTIVE GUIDED TOUR SUBSYSTEM */}
        <InteractiveTourSpotlight />
        <TourWelcomeModal />
        <TourCompletionModal />
        <TourFloatingLauncher />
      </div>
    </div>
  );
}
