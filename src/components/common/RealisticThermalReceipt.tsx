import React from 'react';
import { Order, RestaurantSettings } from '../../types';

interface RealisticThermalReceiptProps {
  order: Order;
  settings: RestaurantSettings;
  className?: string;
}

export const RealisticThermalReceipt: React.FC<RealisticThermalReceiptProps> = ({
  order,
  settings,
  className = '',
}) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const formattedTime = new Date(order.createdAt).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const subtotalHt = Number((order.subtotal / 1.10).toFixed(2));
  const tva10 = Number((order.subtotal - subtotalHt).toFixed(2));

  return (
    <div className={`relative max-w-[320px] mx-auto select-none ${className}`}>
      {/* Serrated paper tear top */}
      <div className="receipt-paper-cut-top w-full" />

      {/* Main White Paper Ticket */}
      <div className="thermal-ticket-bw bg-white text-black p-5 text-[11px] font-mono leading-relaxed shadow-2xl border-x border-stone-200">
        {/* Header */}
        <div className="text-center space-y-0.5 mb-3">
          <div className="font-black text-sm tracking-widest uppercase">
            {settings.name.toUpperCase()}
          </div>
          <div className="text-[10px] text-stone-700 uppercase">
            {settings.tagline}
          </div>
          <div className="text-[10px] text-stone-600">
            {settings.address} - {settings.postalCode} {settings.city}
          </div>
          <div className="text-[9px] text-stone-600">
            SIRET : {settings.siret} • APE 5610A
          </div>
          <div className="text-[9px] text-stone-600">
            TVA INTRA : {settings.vatNumber}
          </div>
          <div className="text-[9px] text-stone-600">
            TEL : {settings.phone}
          </div>
        </div>

        {/* Separator line */}
        <div className="border-b border-dashed border-black/80 my-2" />

        {/* Ticket Metadata */}
        <div className="text-[10px] space-y-0.5">
          <div className="flex justify-between">
            <span>DATE : {formattedDate}</span>
            <span>HEURE : {formattedTime}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>TABLE : {order.tableNumber}</span>
            <span>TICKET N° : #{order.id}</span>
          </div>
          <div className="flex justify-between text-stone-700">
            <span>ORIGINE : {order.origin === 'client_qr' ? 'COMMANDE SMARTPHONE' : 'CAISSE CENTRALE'}</span>
            <span>COUV : {order.splitWays || 1}</span>
          </div>
        </div>

        {/* Double line before items */}
        <div className="border-b-2 border-black my-2" />

        {/* Items Column Header */}
        <div className="flex justify-between font-bold text-[10px] text-black pb-1 uppercase">
          <span>QTE  DESIGNATION</span>
          <span>TOTAL</span>
        </div>

        {/* Items List */}
        <div className="space-y-1.5 py-1">
          {order.items.map((item, idx) => (
            <div key={idx} className="text-[10px]">
              <div className="flex justify-between items-start gap-1">
                <span className="font-bold flex-1 break-words">
                  {item.quantity}x {item.name.toUpperCase()}
                </span>
                <span className="font-bold whitespace-nowrap">
                  {item.totalPrice.toFixed(2)} €
                </span>
              </div>

              {/* Cooking preference mention */}
              {item.cookingPreference && (
                <div className="text-[9px] text-stone-700 pl-4 font-medium">
                  CUISSON : {item.cookingPreference.toUpperCase().replace('_', ' ')}
                </div>
              )}

              {/* Addons */}
              {item.selectedAddons && item.selectedAddons.length > 0 && (
                <div className="text-[9px] text-stone-700 pl-4">
                  {item.selectedAddons.map((a) => `+ ${a.name.toUpperCase()}`).join(' ')}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Separator before Totals */}
        <div className="border-b border-dashed border-black my-2" />

        {/* Fiscal & Tax Breakdown */}
        <div className="space-y-1 text-[10px]">
          <div className="flex justify-between text-stone-800">
            <span>TOTAL BRUT H.T.</span>
            <span>{subtotalHt.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-stone-800">
            <span>TVA 10.0% (RESTAURATION)</span>
            <span>{tva10.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-stone-800">
            <span>TVA 20.0%</span>
            <span>0.00 €</span>
          </div>
          {order.tipAmount > 0 && (
            <div className="flex justify-between font-bold">
              <span>POURBOIRE BRIGADE</span>
              <span>+{order.tipAmount.toFixed(2)} €</span>
            </div>
          )}
        </div>

        {/* Heavy Box Total Net TTC */}
        <div className="my-3 p-2 border-2 border-black text-center bg-black/5">
          <div className="text-[9px] font-bold uppercase tracking-wider text-stone-800">
            TOTAL NET TTC A PAYER
          </div>
          <div className="text-xl font-black tracking-tight text-black">
            {order.totalAmount.toFixed(2)} €
          </div>
        </div>

        {/* Split Bill Info if applied */}
        {order.splitWays && order.splitWays > 1 && (
          <div className="text-center text-[9px] font-bold border border-dashed border-black p-1 my-1">
            PARTAGE DE NOTE ({order.splitWays} PERSONNES) :{' '}
            {(order.totalAmount / order.splitWays).toFixed(2)} € / CONVIVE
          </div>
        )}

        {/* Payment confirmation */}
        <div className="text-[9px] text-stone-800 space-y-0.5 mt-2">
          <div className="flex justify-between">
            <span>MODE DE REGLEMENT :</span>
            <span className="font-bold">
              {order.paymentMethod === 'apple_pay'
                ? 'APPLE PAY / SANS CONTACT'
                : order.paymentMethod === 'cash'
                ? 'ESPECES (CAISSE)'
                : 'CARTE BANCAIRE EMV'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>STATUT TRANSACTION :</span>
            <span className="font-bold text-black">ACQUITTEE (OK)</span>
          </div>
          <div className="flex justify-between text-[8px] text-stone-500">
            <span>NUMERO D'AUTORISATION :</span>
            <span>AUT-{order.id.slice(-5)}</span>
          </div>
        </div>

        {/* Barcode realistic representation */}
        <div className="mt-4 pt-2 border-t border-dashed border-black text-center">
          {/* Authentic monochrome barcode */}
          <div className="flex justify-center items-center gap-[1.5px] h-9 my-1 overflow-hidden px-4">
            {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 3, 1, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 3, 2, 1, 2, 3, 1, 2, 4, 1, 2, 3, 1].map((w, i) => (
              <span
                key={i}
                className="bg-black inline-block h-full"
                style={{ width: `${w}px` }}
              />
            ))}
          </div>
          <div className="text-[8px] tracking-widest text-stone-600 font-mono">
            *CMD-{order.id.replace(/[^0-9]/g, '') || '928401'}*
          </div>
        </div>

        {/* Legal Footer & Warm Goodbye */}
        <div className="text-center text-[9px] text-stone-600 space-y-0.5 mt-3 pt-2 border-t border-dashed border-black/60">
          <div className="font-bold uppercase text-black">
            *** MERCI DE VOTRE VISITE ***
          </div>
          <div>L’AMBROISIE ROYALE VOUS SOUHAITE UNE BELLE JOURNEE</div>
          <div className="text-[8px] text-stone-500 mt-1">
            Logiciel certifié conforme NF525 & CGI art. 286-I-3° bis
          </div>
        </div>
      </div>

      {/* Serrated paper tear bottom */}
      <div className="receipt-paper-cut-bottom w-full" />
    </div>
  );
};
