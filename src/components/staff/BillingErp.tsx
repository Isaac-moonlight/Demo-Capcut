import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Search,
  Package,
  AlertOctagon,
  CheckCircle2,
  Receipt,
  Building,
  Save,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Order, Dish } from '../../types';
import { RealisticThermalReceipt } from '../common/RealisticThermalReceipt';

export const BillingErp: React.FC = () => {
  const {
    orders,
    dishes,
    inventory,
    toggleDishStock,
    setDishStockQuantity,
    settings,
    updateSettings,
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'invoices' | 'stocks' | 'settings'>('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);
  const [invoiceFormat, setInvoiceFormat] = useState<'a4' | 'thermal80'>('a4');

  // Fiscal settings form state
  const [fiscalForm, setFiscalForm] = useState({
    name: settings.name,
    siret: settings.siret,
    vatNumber: settings.vatNumber,
    address: settings.address,
    city: settings.city,
    postalCode: settings.postalCode,
    phone: settings.phone,
    email: settings.email,
  });
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.tableNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadAutonomousHtml = (order: Order) => {
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Facture_${order.id}.html</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1c1917; max-width: 800px; margin: auto; }
    .header { border-bottom: 2px solid #d97706; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 24px; font-weight: bold; color: #b45309; }
    .meta { font-size: 13px; color: #78716c; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 25px; }
    th { text-align: left; padding: 10px; border-bottom: 2px solid #e7e5e4; background: #fafaf9; font-size: 12px; text-transform: uppercase; }
    td { padding: 12px 10px; border-bottom: 1px solid #f5f5f4; font-size: 13px; }
    .total-box { margin-top: 30px; border-top: 2px solid #d97706; padding-top: 15px; font-size: 14px; text-align: right; }
    .total-bold { font-size: 20px; font-weight: bold; color: #b45309; margin-top: 8px; }
    .footer { margin-top: 50px; font-size: 11px; color: #a8a29e; text-align: center; border-top: 1px solid #e7e5e4; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">${settings.name}</div>
      <div class="meta">${settings.tagline}</div>
      <div class="meta">${settings.address}, ${settings.postalCode} ${settings.city}</div>
      <div class="meta">SIRET: ${settings.siret} | TVA: ${settings.vatNumber}</div>
    </div>
    <div style="text-align: right;">
      <h2 style="margin: 0; color: #78716c;">FACTURE OFFICIELLE N° ${order.id}</h2>
      <div class="meta">Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR')} ${new Date(order.createdAt).toLocaleTimeString('fr-FR')}</div>
      <div class="meta">Table: ${order.tableNumber} | Mode: ${order.paymentMethod?.toUpperCase() || 'CB'}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Désignation</th>
        <th style="text-align: center;">Qté</th>
        <th style="text-align: right;">P.U TTC</th>
        <th style="text-align: right;">Total TTC</th>
      </tr>
    </thead>
    <tbody>
      ${order.items
        .map(
          (item) => `
        <tr>
          <td>
            <strong>${item.name}</strong>
            ${item.cookingPreference ? `<br><small style="color:#78716c;">Cuisson: ${item.cookingPreference}</small>` : ''}
            ${item.selectedAddons && item.selectedAddons.length > 0 ? `<br><small style="color:#78716c;">Suppléments: ${item.selectedAddons.map((a) => a.name).join(', ')}</small>` : ''}
          </td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">${item.unitPrice.toFixed(2)} €</td>
          <td style="text-align: right;"><strong>${item.totalPrice.toFixed(2)} €</strong></td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="total-box">
    <div>Sous-total HT : ${(order.subtotal * 0.9).toFixed(2)} €</div>
    <div>TVA 10% : ${(order.subtotal * 0.1).toFixed(2)} €</div>
    ${order.tipAmount > 0 ? `<div>Pourboire Service : ${order.tipAmount.toFixed(2)} €</div>` : ''}
    <div class="total-bold">TOTAL TTC ACQUITTÉ : ${order.totalAmount.toFixed(2)} €</div>
  </div>

  <div class="footer">
    Document légal édité par DineFlow Pro ERP. Conforme aux exigences d'archivage fiscal dématérialisé.
  </div>
</body>
</html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Facture_${order.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(fiscalForm);
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121622] p-3 rounded-2xl border border-stone-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'invoices'
                ? 'bg-amber-500 text-stone-950 font-black shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Facturation & Tickets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stocks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'stocks'
                ? 'bg-amber-500 text-stone-950 font-black shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Gestion des Stocks (86 Rupture)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-stone-950 font-black shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Paramètres SIRET & TVA</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INVOICES & THERMAL 80MM */}
      {activeTab === 'invoices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Order List & Search */}
          <div className="lg:col-span-4 bg-[#121622] p-4 rounded-3xl border border-stone-800 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Rechercher facture ou table..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-[#161a26] border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8 text-stone-500 text-xs">
                  Aucune facture trouvée
                </div>
              ) : (
                filteredOrders.map((ord) => {
                  const isSelected = selectedOrder?.id === ord.id;
                  return (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-white'
                          : 'bg-[#161a26] border-stone-800 hover:border-stone-700 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-amber-300">
                          #{ord.id}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {ord.totalAmount.toFixed(2)} €
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-stone-400">
                        <span>
                          {ord.tableNumber} • {ord.items.length} lignes
                        </span>
                        <span>{new Date(ord.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Live Printable Preview (A4 or Thermal 80mm) */}
          <div className="lg:col-span-8 bg-[#121622] p-6 rounded-3xl border border-stone-800 flex flex-col justify-between">
            {selectedOrder ? (
              <div>
                {/* Format switcher & print buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-800 mb-6 no-print">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInvoiceFormat('a4')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        invoiceFormat === 'a4'
                          ? 'bg-stone-100 text-stone-900 font-black'
                          : 'bg-stone-800 text-stone-300'
                      }`}
                    >
                      Facture A4
                    </button>
                    <button
                      type="button"
                      onClick={() => setInvoiceFormat('thermal80')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        invoiceFormat === 'thermal80'
                          ? 'bg-stone-100 text-stone-900 font-black'
                          : 'bg-stone-800 text-stone-300'
                      }`}
                    >
                      Ticket Thermique (80mm)
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadAutonomousHtml(selectedOrder)}
                      className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Fichier HTML</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePrint}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimer (window.print)</span>
                    </button>
                  </div>
                </div>

                {/* Printable Document Box */}
                {invoiceFormat === 'a4' ? (
                  /* Standard A4 Black & White Luxury View */
                  <div className="bg-white text-black p-8 rounded-2xl shadow-xl max-w-2xl mx-auto print-invoice-a4 border border-stone-200 font-sans">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                      <div>
                        <h2 className="text-2xl font-black tracking-tight text-black uppercase">{settings.name}</h2>
                        <p className="text-xs text-stone-600 font-medium">{settings.tagline}</p>
                        <p className="text-xs text-stone-800 mt-1">
                          {settings.address}, {settings.postalCode} {settings.city}
                        </p>
                        <p className="text-[11px] font-mono text-stone-600 mt-0.5">
                          SIRET : {settings.siret} | N° TVA : {settings.vatNumber}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black uppercase tracking-widest text-black block">
                          FACTURE OFFICIELLE
                        </span>
                        <span className="text-lg font-black font-mono text-black">
                          N° {selectedOrder.id}
                        </span>
                        <p className="text-xs text-stone-700 mt-1">
                          Date : {new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR')} -{' '}
                          {new Date(selectedOrder.createdAt).toLocaleTimeString('fr-FR')}
                        </p>
                        <p className="text-xs font-bold text-black uppercase">
                          Table : {selectedOrder.tableNumber}
                        </p>
                      </div>
                    </div>

                    {/* Table items */}
                    <table className="w-full text-xs border-collapse mb-6">
                      <thead>
                        <tr className="border-b-2 border-black text-black uppercase text-[11px]">
                          <th className="text-left py-2 font-black">Désignation</th>
                          <th className="text-center py-2 font-black">Qté</th>
                          <th className="text-right py-2 font-black">P.U TTC</th>
                          <th className="text-right py-2 font-black">Total TTC</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {selectedOrder.items.map((it, idx) => (
                          <tr key={idx} className="py-2">
                            <td className="py-2.5">
                              <span className="font-bold text-black">{it.name}</span>
                              {it.cookingPreference && (
                                <span className="block text-[10px] text-stone-600 font-medium">
                                  Cuisson : {it.cookingPreference.toUpperCase()}
                                </span>
                              )}
                              {it.selectedAddons && it.selectedAddons.length > 0 && (
                                <span className="block text-[10px] text-stone-600">
                                  Suppléments : {it.selectedAddons.map((a) => a.name).join(', ')}
                                </span>
                              )}
                            </td>
                            <td className="text-center py-2.5 font-bold">{it.quantity}</td>
                            <td className="text-right py-2.5 font-mono">{it.unitPrice.toFixed(2)} €</td>
                            <td className="text-right py-2.5 font-bold font-mono">
                              {it.totalPrice.toFixed(2)} €
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Totals & Tax breakdown */}
                    <div className="border-t-2 border-black pt-4 flex justify-between items-start text-xs">
                      <div className="text-stone-700 space-y-1">
                        <p>Total Hors Taxes (H.T.) : {(selectedOrder.subtotal / 1.1).toFixed(2)} €</p>
                        <p>TVA 10.0% (Restauration) : {(selectedOrder.subtotal - (selectedOrder.subtotal / 1.1)).toFixed(2)} €</p>
                        <p>TVA 20.0% : 0.00 €</p>
                        <p className="font-bold text-black">
                          Règlement : {selectedOrder.paymentMethod?.toUpperCase() || 'CARTE BANCAIRE'}
                        </p>
                      </div>

                      <div className="text-right space-y-1">
                        <p className="text-stone-700 font-mono">
                          Sous-total TTC : {selectedOrder.subtotal.toFixed(2)} €
                        </p>
                        {selectedOrder.tipAmount > 0 && (
                          <p className="font-bold text-black font-mono">
                            Pourboire Brigade : +{selectedOrder.tipAmount.toFixed(2)} €
                          </p>
                        )}
                        <div className="border-2 border-black p-2 mt-2 bg-stone-50 text-right">
                          <span className="text-[10px] uppercase font-black text-stone-600 block">TOTAL NET ACQUITTE</span>
                          <span className="text-2xl font-black font-mono text-black">
                            {selectedOrder.totalAmount.toFixed(2)} €
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-dashed border-stone-300 text-center text-[10px] text-stone-500 font-mono">
                      Document certifié conforme NF525. Facturation dématérialisée DineFlow Pro.
                    </div>
                  </div>
                ) : (
                  /* Ultra-Realistic Thermal 80mm B&W Receipt */
                  <RealisticThermalReceipt order={selectedOrder} settings={settings} />
                )}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-stone-400 text-sm">
                Sélectionnez une commande pour afficher sa facture
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE STOCKS & 86 RUPTURE MODE */}
      {activeTab === 'stocks' && (
        <div className="bg-[#121622] p-6 rounded-3xl border border-stone-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-serif-luxury text-amber-200">
                Gestion des Stocks & Mode Rupture (86)
              </h3>
              <p className="text-xs text-stone-400">
                Activez le commutateur pour retirer instantanément un plat de la carte client.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dishes.map((dish) => {
              const currentInv = inventory[dish.id];
              const inStock = currentInv ? currentInv.inStock : true;
              const quantity = currentInv ? currentInv.stockQuantity : 15;

              return (
                <div
                  key={dish.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    inStock
                      ? 'bg-[#161a26] border-stone-800'
                      : 'bg-rose-500/10 border-rose-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">
                        {dish.name}
                      </h4>
                      <span className="text-[10px] text-stone-400 uppercase">
                        {dish.category} • {dish.price.toFixed(2)} €
                      </span>
                    </div>

                    {/* Stock switch */}
                    <button
                      type="button"
                      onClick={() => toggleDishStock(dish.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        inStock
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500 text-white font-black shadow-md'
                      }`}
                    >
                      {inStock ? 'En Stock ✓' : 'RUPTURE (86)'}
                    </button>
                  </div>

                  {/* Stock quantity input */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs">
                    <span className="text-stone-400">Portions restantes :</span>
                    <input
                      type="number"
                      min="0"
                      value={quantity}
                      onChange={(e) =>
                        setDishStockQuantity(dish.id, parseInt(e.target.value, 10) || 0)
                      }
                      className="w-16 text-center p-1 rounded-lg bg-[#121622] border border-stone-700 text-white font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: RESTAURANT FISCAL SETTINGS */}
      {activeTab === 'settings' && (
        <form
          onSubmit={handleSaveSettings}
          className="bg-[#121622] p-6 rounded-3xl border border-stone-800 max-w-2xl mx-auto space-y-4"
        >
          <div className="border-b border-stone-800 pb-3 mb-4">
            <h3 className="text-base font-bold font-serif-luxury text-amber-200">
              Coordonnées de l’Établissement & Mentions Fiscales
            </h3>
            <p className="text-xs text-stone-400">
              Ces informations apparaissent sur toutes les factures A4 et tickets de caisse légaux.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-400 block mb-1">
                Nom du Restaurant
              </label>
              <input
                type="text"
                value={fiscalForm.name}
                onChange={(e) => setFiscalForm({ ...fiscalForm, name: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-[#161a26] border border-stone-700 text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-400 block mb-1">
                Numéro SIRET (14 chiffres)
              </label>
              <input
                type="text"
                value={fiscalForm.siret}
                onChange={(e) => setFiscalForm({ ...fiscalForm, siret: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-[#161a26] border border-stone-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-400 block mb-1">
                Numéro TVA Intracommunautaire
              </label>
              <input
                type="text"
                value={fiscalForm.vatNumber}
                onChange={(e) => setFiscalForm({ ...fiscalForm, vatNumber: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-[#161a26] border border-stone-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-400 block mb-1">Téléphone</label>
              <input
                type="text"
                value={fiscalForm.phone}
                onChange={(e) => setFiscalForm({ ...fiscalForm, phone: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-[#161a26] border border-stone-700 text-white"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-bold text-stone-400 block mb-1">
                Adresse Postale
              </label>
              <input
                type="text"
                value={fiscalForm.address}
                onChange={(e) => setFiscalForm({ ...fiscalForm, address: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-[#161a26] border border-stone-700 text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-400 block mb-1">Code Postal</label>
              <input
                type="text"
                value={fiscalForm.postalCode}
                onChange={(e) => setFiscalForm({ ...fiscalForm, postalCode: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-[#161a26] border border-stone-700 text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-400 block mb-1">Ville</label>
              <input
                type="text"
                value={fiscalForm.city}
                onChange={(e) => setFiscalForm({ ...fiscalForm, city: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-[#161a26] border border-stone-700 text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            {savedSettingsSuccess && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Enregistré avec succès !
              </span>
            )}

            <button
              type="submit"
              className="ml-auto py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Sauvegarder les Coordonnées</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
