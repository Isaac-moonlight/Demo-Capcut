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
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { GastronomyLogo } from '../common/GastronomyLogo';

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

  // Generate downloadable legal PDF/HTML invoice
  const handleDownloadInvoice = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Facture_${activeTableOrder.id}.html</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1c1917; max-width: 800px; margin: auto; }
    .header { border-bottom: 2px solid #d97706; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 24px; font-weight: bold; color: #b45309; }
    .meta { font-size: 13px; color: #78716c; margin-top: 4px; }
    .details { margin: 30px 0; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { text-align: left; padding: 10px; border-bottom: 2px solid #e7e5e4; background: #fafaf9; font-size: 12px; text-transform: uppercase; }
    td { padding: 12px 10px; border-bottom: 1px solid #f5f5f4; font-size: 13px; }
    .total-box { margin-top: 30px; border-top: 2px solid #d97706; padding-top: 15px; font-size: 14px; text-align: right; }
    .total-bold { font-size: 20px; font-weight: bold; color: #b45309; }
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
      <h2 style="margin: 0; color: #78716c;">FACTURE N° ${activeTableOrder.id}</h2>
      <div class="meta">Date: ${new Date(activeTableOrder.createdAt).toLocaleDateString('fr-FR')} ${new Date(activeTableOrder.createdAt).toLocaleTimeString('fr-FR')}</div>
      <div class="meta">Table: ${activeTableOrder.tableNumber} | Mode: ${activeTableOrder.paymentMethod?.toUpperCase()}</div>
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
    <div>Sous-total HT : ${(activeTableOrder.subtotal * 0.9).toFixed(2)} €</div>
    <div>TVA 10% collectée : ${(activeTableOrder.subtotal * 0.1).toFixed(2)} €</div>
    ${activeTableOrder.tipAmount > 0 ? `<div>Pourboire Brigade : ${activeTableOrder.tipAmount.toFixed(2)} €</div>` : ''}
    <div class="total-bold" style="margin-top: 10px;">TOTAL TTC RÉGLÉ : ${activeTableOrder.totalAmount.toFixed(2)} €</div>
  </div>

  <div class="footer">
    Merci pour votre visite à l'Ambroisie Royale. Facture certifiée conforme aux normes fiscales dématérialisées.
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Facture_${settings.name.replace(/[^a-zA-Z0-9]/g, '_')}_${activeTableOrder.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0f131d] border border-amber-500/30 p-5 sm:p-7 text-stone-100 shadow-2xl my-auto text-center">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-center mb-3">
          <GastronomyLogo size="sm" showText={false} />
        </div>

        <h2 className="text-2xl font-bold font-serif-luxury text-amber-200">
          Avez-vous apprécié votre repas ?
        </h2>
        <p className="text-xs text-stone-400 mt-1 max-w-[280px] mx-auto">
          Votre appréciation permet à notre brigade de perfectionner chaque geste culinaire.
        </p>

        {/* 5 Interactive Stars */}
        <div className="flex justify-center items-center gap-2.5 my-5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={isSubmitted}
              onClick={() => setRating(star)}
              className="p-1.5 transition-transform hover:scale-125 cursor-pointer disabled:pointer-events-none"
            >
              <Star
                className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                  star <= rating
                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]'
                    : 'text-stone-700 hover:text-stone-500'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Compliment Tags */}
        {!isSubmitted && (
          <div className="space-y-4 mb-6">
            <div className="flex flex-wrap justify-center gap-1.5 max-w-sm mx-auto">
              {COMPLIMENT_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-[#141824] border-stone-800 text-stone-400 hover:border-stone-700'
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
              className="w-full text-xs p-3 rounded-xl bg-[#141824] border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />

            <button
              type="button"
              onClick={handleSendFeedback}
              className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs transition-colors cursor-pointer"
            >
              Envoyer mes remerciements au Chef
            </button>
          </div>
        )}

        {isSubmitted && (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium my-4 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Merci pour vos compliments transmis directement en cuisine !</span>
          </div>
        )}

        {/* Download Receipt / Invoice */}
        <div className="pt-4 border-t border-stone-800 space-y-2.5">
          <div className="text-[11px] uppercase tracking-wider font-bold text-stone-400">
            Justificatif Fiscal Dématérialisé
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDownloadInvoice}
              className="py-2.5 px-3 rounded-xl bg-[#181d2c] hover:bg-[#20273a] border border-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Télécharger Facture</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl bg-[#181d2c] hover:bg-[#20273a] border border-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Imprimer le Reçu</span>
            </button>
          </div>
        </div>

        {/* End of Service / Free Table */}
        <div className="mt-6 pt-4 border-t border-stone-800">
          <button
            type="button"
            onClick={onFinishService}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-stone-950" />
            <span>Libérer la Table {selectedTable} & Terminer</span>
          </button>
          <p className="text-[11px] text-stone-500 mt-2">
            Réinitialise la session pour les prochains convives
          </p>
        </div>
      </div>
    </div>
  );
};
