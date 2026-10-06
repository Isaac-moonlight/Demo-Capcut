import React, { useState } from 'react';
import {
  Star,
  Download,
  Printer,
  CheckCircle2,
  Sparkles,
  LogOut,
  Receipt,
  FileText,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { GastronomyLogo } from '../common/GastronomyLogo';
import { RealisticThermalReceipt } from '../common/RealisticThermalReceipt';

interface SatisfactionFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinishService: () => void;
}

const COMPLIMENT_TAGS = [
  'Cuisine d’exception',
  'Cuisson millimétrée',
  'Service remarquable',
  'Accords mets & vins parfaits',
  'Cadre somptueux',
  'Sauces inoubliables',
];

export const SatisfactionFeedbackModal: React.FC<SatisfactionFeedbackModalProps> = ({
  isOpen,
  onClose,
  onFinishService,
}) => {
  const { activeTableOrder, selectedTable, settings, submitFeedback } = useRestaurant();

  const [rating, setRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Cuisine d’exception',
    'Service remarquable',
  ]);
  const [chefNote, setChefNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReceiptPreview, setShowReceiptPreview] = useState(true);

  if (!isOpen || !activeTableOrder) return null;

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSendFeedback = async () => {
    if (activeTableOrder) {
      await submitFeedback(activeTableOrder.id, rating, selectedTags, chefNote);
    }
    setIsSubmitted(true);
  };

  // Generate downloadable legal Black & White HTML invoice
  const handleDownloadInvoice = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Facture_${activeTableOrder.id}.html</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Courier New", monospace; padding: 40px; color: #000000; background: #ffffff; max-width: 780px; margin: auto; }
    .header { border-bottom: 2px solid #000000; padding-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-start; }
    .title { font-size: 22px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }
    .meta { font-size: 11px; color: #333333; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
    th { text-align: left; padding: 8px 6px; border-bottom: 2px solid #000000; background: #f4f4f4; text-transform: uppercase; font-size: 11px; }
    td { padding: 10px 6px; border-bottom: 1px solid #e0e0e0; }
    .total-box { margin-top: 25px; border-top: 2px solid #000000; padding-top: 15px; font-size: 13px; text-align: right; }
    .total-bold { font-size: 22px; font-weight: 900; margin-top: 8px; border: 2px solid #000; padding: 6px 12px; display: inline-block; }
    .barcode { margin-top: 30px; text-align: center; border-top: 1px dashed #000; padding-top: 15px; font-family: monospace; font-size: 11px; }
    .footer { margin-top: 30px; font-size: 10px; color: #555555; text-align: center; border-top: 1px solid #000; padding-top: 15px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">${settings.name}</div>
      <div class="meta">${settings.tagline}</div>
      <div class="meta">${settings.address}, ${settings.postalCode} ${settings.city}</div>
      <div class="meta">SIRET: ${settings.siret} • N° TVA: ${settings.vatNumber}</div>
      <div class="meta">TEL: ${settings.phone}</div>
    </div>
    <div style="text-align: right;">
      <h3 style="margin: 0; font-size: 16px; font-weight: 900;">FACTURE OFFICIELLE N° ${activeTableOrder.id}</h3>
      <div class="meta">Date: ${new Date(activeTableOrder.createdAt).toLocaleDateString('fr-FR')} ${new Date(activeTableOrder.createdAt).toLocaleTimeString('fr-FR')}</div>
      <div class="meta">Table: ${activeTableOrder.tableNumber} | Mode: ${activeTableOrder.paymentMethod?.toUpperCase()}</div>
      <div class="meta">Statut: TRANSACTION ACQUITTEE</div>
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
      ${activeTableOrder.items
        .map(
          (item) => `
        <tr>
          <td>
            <strong>${item.name}</strong>
            ${item.cookingPreference ? `<br><small style="color:#555;">Cuisson: ${item.cookingPreference.toUpperCase()}</small>` : ''}
            ${item.selectedAddons && item.selectedAddons.length > 0 ? `<br><small style="color:#555;">Suppléments: ${item.selectedAddons.map((a) => a.name).join(', ')}</small>` : ''}
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
    <div>Total Brut Hors Taxes (H.T.) : ${(activeTableOrder.subtotal / 1.1).toFixed(2)} €</div>
    <div>TVA 10.0% (Restauration) : ${(activeTableOrder.subtotal - (activeTableOrder.subtotal / 1.1)).toFixed(2)} €</div>
    <div>TVA 20.0% (Boissons alc.) : 0.00 €</div>
    ${activeTableOrder.tipAmount > 0 ? `<div>Pourboire Service : ${activeTableOrder.tipAmount.toFixed(2)} €</div>` : ''}
    <div>
      <div class="total-bold">NET A PAYER TTC : ${activeTableOrder.totalAmount.toFixed(2)} €</div>
    </div>
  </div>

  <div class="barcode">
    ||| | |||| | ||| || |||| | ||||| | ||| | |||| | ||| |<br>
    *CMD-${activeTableOrder.id.replace(/[^0-9]/g, '') || '849201'}*
  </div>

  <div class="footer">
    Document certifié conforme NF525 & art. 286-I-3° bis du CGI. Facturation dématérialisée DineFlow Pro.<br>
    Merci pour votre dégustation à l'Ambroisie Royale.
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Facture_${activeTableOrder.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[94vh] overflow-y-auto rounded-3xl bg-[#0f1118] border border-[#2a2e40] p-4 sm:p-6 text-stone-100 shadow-2xl my-auto text-center">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-center mb-2">
          <GastronomyLogo size="sm" showText={false} />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-stone-100">
          Avez-vous apprécié votre repas ?
        </h2>
        <p className="text-xs text-[#ff9f0a] font-bold uppercase tracking-wider mt-1">
          Menu • DineFlow Pro
        </p>

        {/* 5 Interactive Stars with Arrival Bounce Keyframes */}
        <div className="flex justify-center items-center gap-2 my-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              disabled={isSubmitted}
              whileTap={{ scale: 1.4 }}
              animate={star <= rating ? { scale: [1, 1.35, 0.9, 1.15, 1], rotate: [0, -12, 12, 0] } : { scale: 1 }}
              transition={{ duration: 0.35 }}
              onClick={() => setRating(star)}
              className="p-1 cursor-pointer disabled:pointer-events-none"
            >
              <Star
                className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                  star <= rating
                    ? 'fill-[#ff9f0a] text-[#ff9f0a] drop-shadow-[0_0_12px_rgba(255,159,10,0.8)]'
                    : 'text-stone-700 hover:text-stone-500'
                }`}
              />
            </motion.button>
          ))}
        </div>

        {/* Compliment Tags */}
        {!isSubmitted && (
          <div className="space-y-3 mb-5">
            <div className="flex flex-wrap justify-center gap-1.5 max-w-sm mx-auto">
              {COMPLIMENT_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f0da8a]'
                        : 'bg-[#151824] border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Note to chef */}
            <input
              type="text"
              value={chefNote}
              onChange={(e) => setChefNote(e.target.value)}
              placeholder="Un mot personnel pour le Chef et la brigade..."
              className="w-full text-xs p-2.5 rounded-xl bg-[#151824] border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#d4af37]"
            />

            <button
              type="button"
              onClick={handleSendFeedback}
              className="w-full py-2.5 rounded-xl bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border border-[#d4af37]/40 text-[#f0da8a] font-bold text-xs transition-colors cursor-pointer"
            >
              Envoyer mes remerciements au Chef
            </button>
          </div>
        )}

        {isSubmitted && (
          <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold my-3 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Merci pour vos compliments transmis directement en cuisine !</span>
          </div>
        )}

        {/* Toggleable Realistic B&W Thermal Receipt Preview */}
        <div className="my-4 pt-3 border-t border-stone-800 text-left">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => setShowReceiptPreview(!showReceiptPreview)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#d4af37] hover:underline cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>{showReceiptPreview ? 'Masquer le Ticket de Caisse' : 'Aperçu du Ticket Thermique Réaliste (80mm)'}</span>
              {showReceiptPreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showReceiptPreview && (
            <div className="max-h-72 overflow-y-auto p-2 bg-stone-900/60 rounded-2xl border border-stone-800">
              <RealisticThermalReceipt order={activeTableOrder} settings={settings} />
            </div>
          )}
        </div>

        {/* Action Buttons: Download & Print */}
        <div className="pt-2 border-t border-stone-800 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDownloadInvoice}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-stone-100 text-stone-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5 text-stone-950" />
              <span>Télécharger Facture B&W</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl bg-[#1b1f2e] hover:bg-[#252b40] border border-stone-700 text-stone-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Imprimer Ticket (80mm)</span>
            </button>
          </div>
        </div>

        {/* End of Service / Free Table */}
        <div className="mt-4 pt-3 border-t border-stone-800">
          <button
            type="button"
            onClick={onFinishService}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b88e55] hover:from-[#e5c158] hover:to-[#d4af37] text-stone-950 font-black text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-stone-950" />
            <span>Libérer la Table {selectedTable} & Terminer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
