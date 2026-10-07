import React, { useMemo } from 'react';
import {
  Flame,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  ChefHat,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Order, OrderStatus } from '../../types';
import { playServiceBell, playOrderReadyChime } from '../../lib/audio';

export const KdsKitchen: React.FC = () => {
  const { orders, updateOrderStatus } = useRestaurant();

  // Filter out paid or cancelled orders for the kitchen screen, keep received, in_kitchen, ready
  const activeOrders = useMemo(() => {
    return orders.filter((o) => ['received', 'in_kitchen', 'ready'].includes(o.status));
  }, [orders]);

  const receivedOrders = useMemo(
    () => activeOrders.filter((o) => o.status === 'received'),
    [activeOrders]
  );
  const inKitchenOrders = useMemo(
    () => activeOrders.filter((o) => o.status === 'in_kitchen'),
    [activeOrders]
  );
  const readyOrders = useMemo(
    () => activeOrders.filter((o) => o.status === 'ready'),
    [activeOrders]
  );

  const getElapsedTime = (isoString: string) => {
    const elapsedMinutes = Math.floor(
      (Date.now() - new Date(isoString).getTime()) / (1000 * 60)
    );
    return Math.max(0, elapsedMinutes);
  };

  const handleNextStep = async (order: Order) => {
    if (order.status === 'received') {
      await updateOrderStatus(order.id, 'in_kitchen');
      playServiceBell(1760);
    } else if (order.status === 'in_kitchen') {
      await updateOrderStatus(order.id, 'ready');
      playOrderReadyChime();
    } else if (order.status === 'ready') {
      await updateOrderStatus(order.id, 'served');
      playServiceBell(1900);
    }
  };

  const renderOrderCard = (order: Order) => {
    const elapsedMin = getElapsedTime(order.createdAt);
    const isLate = elapsedMin >= 15;

    return (
      <div
        key={order.id}
        data-tour={order.status === 'received' ? 'kds-received-card' : undefined}
        className={`rounded-2xl p-4 transition-all duration-200 border flex flex-col justify-between ${
          order.status === 'ready'
            ? 'bg-[#131d18] border-emerald-500/40 shadow-lg'
            : order.status === 'in_kitchen'
            ? 'bg-[#1c1813] border-amber-500/40 shadow-md'
            : 'bg-[#141824] border-stone-800'
        } ${isLate ? 'ring-2 ring-rose-500/60' : ''}`}
      >
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-base font-black px-2.5 py-1 rounded-xl bg-amber-500 text-stone-950">
                {order.tableNumber}
              </span>
              <div>
                <span className="text-xs font-bold text-white block">#{order.id}</span>
                <span className="text-[10px] text-stone-400">
                  {order.origin === 'client_qr' ? '📱 Mobile' : '🖥️ Caisse'}
                </span>
              </div>
            </div>

            {/* Timer */}
            <div
              className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
                isLate
                  ? 'bg-rose-500/20 text-rose-300 animate-pulse'
                  : 'bg-black/30 text-stone-300'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{elapsedMin} min</span>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-2 mb-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="text-xs bg-black/25 p-2 rounded-xl">
                <div className="flex items-start justify-between gap-1.5">
                  <span className="font-extrabold text-amber-300 text-sm">
                    {item.quantity}×
                  </span>
                  <span className="font-semibold text-stone-100 flex-1">{item.name}</span>
                </div>

                {/* Cooking requirement */}
                {item.cookingPreference && (
                  <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px] uppercase">
                    <Flame className="w-3 h-3" />
                    <span>Cuisson : {item.cookingPreference.replace('_', ' ')}</span>
                  </div>
                )}

                {/* Addons */}
                {item.selectedAddons && item.selectedAddons.length > 0 && (
                  <div className="mt-1 text-[10px] text-amber-400/90 pl-3">
                    + {item.selectedAddons.map((a) => a.name).join(', ')}
                  </div>
                )}

                {/* Special instructions */}
                {item.specialInstructions && (
                  <div className="mt-1 text-[10px] text-yellow-200/90 font-medium bg-yellow-500/10 p-1 rounded border border-yellow-500/20">
                    ⚠️ {item.specialInstructions}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          data-tour={order.status === 'received' ? 'kds-btn-cook' : order.status === 'in_kitchen' ? 'kds-btn-ready' : 'kds-btn-served'}
          onClick={() => handleNextStep(order)}
          className={`w-full py-3 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
            order.status === 'received'
              ? 'bg-amber-500 hover:bg-amber-400 text-stone-950'
              : order.status === 'in_kitchen'
              ? 'bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-stone-950'
              : 'bg-emerald-500 hover:bg-emerald-400 text-stone-950'
          }`}
        >
          {order.status === 'received' && (
            <>
              <Flame className="w-4 h-4" />
              <span>Lancer Cuisson →</span>
            </>
          )}
          {order.status === 'in_kitchen' && (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Prêt au Passe (Cloche) →</span>
            </>
          )}
          {order.status === 'ready' && (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Servi à Table ✓</span>
            </>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* KDS Header summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121622] p-4 rounded-2xl border border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-serif-luxury text-amber-200">
              KDS Cuisine (Kitchen Display System)
            </h2>
            <p className="text-xs text-stone-400">
              {activeOrders.length} bon(s) actif(s) sur les feux
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            data-tour="kds-test-bell"
            onClick={() => playServiceBell(1760)}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Tester le son de la cloche"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Tester Cloche</span>
          </button>
        </div>
      </div>

      {/* 3-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Colonne 1 : En attente */}
        <div className="rounded-3xl bg-[#0f131d] border border-stone-800/80 p-4 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-200">
                En Attente
              </h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
              {receivedOrders.length}
            </span>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto">
            {receivedOrders.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-xs text-stone-500 font-medium">
                Aucun bon en attente
              </div>
            ) : (
              receivedOrders.map(renderOrderCard)
            )}
          </div>
        </div>

        {/* Colonne 2 : En Cuisson */}
        <div className="rounded-3xl bg-[#0f131d] border border-amber-500/20 p-4 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">
                En Cuisson & Dressage
              </h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
              {inKitchenOrders.length}
            </span>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto">
            {inKitchenOrders.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-xs text-stone-500 font-medium">
                Aucun plat sur le feu
              </div>
            ) : (
              inKitchenOrders.map(renderOrderCard)
            )}
          </div>
        </div>

        {/* Colonne 3 : Prêt au Passe */}
        <div className="rounded-3xl bg-[#0f131d] border border-emerald-500/20 p-4 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
                Prêt au Passe (Cloche)
              </h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto">
            {readyOrders.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-xs text-stone-500 font-medium">
                Passe dégagé
              </div>
            ) : (
              readyOrders.map(renderOrderCard)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
