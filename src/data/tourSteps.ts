import { TourChapter, TourStep } from '../types/tour';

export const TOUR_CHAPTERS: TourChapter[] = [
  {
    id: 'ch1_table',
    number: 1,
    title: 'Choix de Table',
    subtitle: 'Assignation de la table client',
    icon: '🪑',
    color: '#ff9f0a',
  },
  {
    id: 'ch2_menu',
    number: 2,
    title: 'Découverte & Personnalisation',
    subtitle: 'Sélection du plat et options de cuisson',
    icon: '✨',
    color: '#d4af37',
  },
  {
    id: 'ch3_cart',
    number: 3,
    title: 'Panier & Commande',
    subtitle: 'Envoi direct de la commande en cuisine',
    icon: '🛍️',
    color: '#30d158',
  },
  {
    id: 'ch4_radar',
    number: 4,
    title: 'Suivi Radar & Appel Serveur',
    subtitle: 'Communication en direct',
    icon: '📡',
    color: '#0284c7',
  },
  {
    id: 'ch5_staff',
    number: 5,
    title: 'Espace Brigade Confidentiel',
    subtitle: 'Accès sécurisé par code PIN',
    icon: '🔒',
    color: '#eab308',
  },
  {
    id: 'ch6_kds',
    number: 6,
    title: 'Cuisine KDS Temps Réel',
    subtitle: 'Kanban des feux et cloche au passe',
    icon: '👨‍🍳',
    color: '#f97316',
  },
  {
    id: 'ch7_pos',
    number: 7,
    title: 'Caisse POS Comptoir',
    subtitle: 'Prise de commande et encaissement',
    icon: '💳',
    color: '#8b5cf6',
  },
  {
    id: 'ch8_floorplan',
    number: 8,
    title: 'Plan de Salle 2D',
    subtitle: 'Supervision spatiale architecturale',
    icon: '🏛️',
    color: '#06b6d4',
  },
  {
    id: 'ch9_erp',
    number: 9,
    title: 'Facturation NF525 & Stocks',
    subtitle: 'Tickets thermiques et rupture 86',
    icon: '🧾',
    color: '#10b981',
  },
  {
    id: 'ch10_closing',
    number: 10,
    title: 'Addition & Fin de Service',
    subtitle: 'Règlement et libération de table',
    icon: '🌟',
    color: '#ffd60a',
  },
];

export const TOUR_STEPS: TourStep[] = [
  // 1. CHOIX DE TABLE
  {
    id: 'step_table_intro',
    chapterId: 'ch1_table',
    globalIndex: 0,
    title: 'Choix de Table',
    targetSelector: '[data-tour="table-item-t1"]',
    actionInstruction: 'Cliquez ici pour choisir la Table T1',
    arrowDirection: 'down',
    position: 'top',
    requiresView: 'client',
  },
  {
    id: 'step_table_confirm',
    chapterId: 'ch1_table',
    globalIndex: 1,
    title: 'Confirmation de Table',
    targetSelector: '[data-tour="table-select-confirm"]',
    actionInstruction: 'Cliquez ici pour valider votre table',
    arrowDirection: 'down',
    position: 'top',
    requiresView: 'client',
  },

  // 2. CHOIX D'UN PLAT
  {
    id: 'step_dish_card',
    chapterId: 'ch2_menu',
    globalIndex: 2,
    title: 'Sélection du Plat',
    targetSelector: '[data-tour="dish-card-wagyu"]',
    actionInstruction: 'Cliquez ici pour choisir un plat',
    arrowDirection: 'down',
    position: 'top',
    requiresView: 'client',
  },

  // 3. CUISSON DU PLAT
  {
    id: 'step_dish_modal_cooking',
    chapterId: 'ch2_menu',
    globalIndex: 3,
    title: 'Choix de Cuisson',
    targetSelector: '[data-tour="modal-cooking-options"]',
    actionInstruction: 'Choisissez votre cuisson (ex: Saignant)',
    arrowDirection: 'down',
    position: 'top',
    requiresView: 'client',
  },

  // 4. AJOUT AU PANIER
  {
    id: 'step_dish_modal_add',
    chapterId: 'ch2_menu',
    globalIndex: 4,
    title: 'Ajout au Panier',
    targetSelector: '[data-tour="modal-add-btn"]',
    actionInstruction: 'Cliquez ici pour ajouter au panier',
    arrowDirection: 'down',
    position: 'top',
    requiresView: 'client',
  },

  // 5. OUVERTURE DU PANIER
  {
    id: 'step_cart_floating_bar',
    chapterId: 'ch3_cart',
    globalIndex: 5,
    title: 'Ouverture du Panier',
    targetSelector: '[data-tour="cart-floating-bar"]',
    actionInstruction: 'Cliquez ici pour ouvrir votre panier',
    arrowDirection: 'down',
    position: 'top',
    requiresView: 'client',
  },

  // 6. ENVOI DE LA COMMANDE EN CUISINE
  {
    id: 'step_cart_send_kitchen',
    chapterId: 'ch3_cart',
    globalIndex: 6,
    title: 'Envoi en Cuisine',
    targetSelector: '[data-tour="cart-submit-btn"]',
    actionInstruction: 'Cliquez ici pour envoyer en cuisine',
    arrowDirection: 'down',
    position: 'top',
    requiresView: 'client',
  },

  // 7. APPEL SERVEUR (EAU / PAIN)
  {
    id: 'step_radar_call_waiter',
    chapterId: 'ch4_radar',
    globalIndex: 7,
    title: 'Appel Serveur',
    targetSelector: '[data-tour="radar-water-bread"]',
    actionInstruction: 'Cliquez ici pour demander de l’eau & du pain',
    arrowDirection: 'down',
    position: 'top',
    requiresView: 'client',
  },

  // 8. ACCÈS DISCRET BRIGADE (TRIPLE-CLIC LOGO)
  {
    id: 'step_secret_trigger',
    chapterId: 'ch5_staff',
    globalIndex: 8,
    title: 'Accès Brigade',
    targetSelector: '[data-tour="staff-secret-logo"]',
    actionInstruction: 'Triple-cliquez sur le logo pour l’accès Brigade',
    arrowDirection: 'up',
    position: 'bottom',
    requiresView: 'client',
  },

  // 9. CLAVIER CODE PIN (1234)
  {
    id: 'step_pin_modal',
    chapterId: 'ch5_staff',
    globalIndex: 9,
    title: 'Code PIN',
    targetSelector: '[data-tour="pin-keypad"]',
    actionInstruction: 'Tapez le code 1234 sur le clavier',
    arrowDirection: 'up',
    position: 'bottom',
    requiresView: 'client',
  },

  // 10. ACQUITTEMENT DE L'ALERTE SERVEUR
  {
    id: 'step_staff_alerts_banner',
    chapterId: 'ch6_kds',
    globalIndex: 10,
    title: 'Acquitter l’Alerte',
    targetSelector: '[data-tour="staff-waiter-alerts"]',
    actionInstruction: 'Cliquez sur « Traité ✓ » pour acquitter l’appel',
    arrowDirection: 'up',
    position: 'bottom',
    requiresView: 'staff',
    requiresStaffSection: 'kds',
  },

  // 11. KDS : LANCER EN CUISSON
  {
    id: 'step_kds_kanban_col1',
    chapterId: 'ch6_kds',
    globalIndex: 11,
    title: 'Lancement Cuisson',
    targetSelector: '[data-tour="kds-received-card"]',
    actionInstruction: 'Cliquez sur « Lancer en Cuisson »',
    arrowDirection: 'left',
    position: 'right',
    requiresView: 'staff',
    requiresStaffSection: 'kds',
  },

  // 12. KDS : SONNER AU PASSE (CLOCHE DE CUISINE)
  {
    id: 'step_kds_kanban_col2',
    chapterId: 'ch6_kds',
    globalIndex: 12,
    title: 'Sonnette au Passe',
    targetSelector: '[data-tour="kds-btn-ready"]',
    actionInstruction: 'Cliquez sur « Sonner au Passe (Prêt) »',
    arrowDirection: 'left',
    position: 'right',
    requiresView: 'staff',
    requiresStaffSection: 'kds',
  },

  // 13. KDS : SERVI À TABLE
  {
    id: 'step_kds_kanban_col3',
    chapterId: 'ch6_kds',
    globalIndex: 13,
    title: 'Servi à Table',
    targetSelector: '[data-tour="kds-btn-served"]',
    actionInstruction: 'Cliquez sur « Servi à Table »',
    arrowDirection: 'right',
    position: 'left',
    requiresView: 'staff',
    requiresStaffSection: 'kds',
  },

  // 14. NAVIGATION STAFF : CAISSE POS
  {
    id: 'step_staff_nav_pos',
    chapterId: 'ch7_pos',
    globalIndex: 14,
    title: 'Caisse POS',
    targetSelector: '[data-tour="staff-tab-pos"]',
    actionInstruction: 'Cliquez sur l’onglet « Caisse POS »',
    arrowDirection: 'up',
    position: 'bottom',
    requiresView: 'staff',
  },

  // 15. NAVIGATION STAFF : PLAN DE SALLE 2D
  {
    id: 'step_staff_nav_tables',
    chapterId: 'ch8_floorplan',
    globalIndex: 15,
    title: 'Plan de Salle 2D',
    targetSelector: '[data-tour="staff-tab-tables"]',
    actionInstruction: 'Cliquez sur l’onglet « Plan de Salle 2D »',
    arrowDirection: 'up',
    position: 'bottom',
    requiresView: 'staff',
  },

  // 16. INSPECTION DE LA TABLE T1
  {
    id: 'step_floorplan_table_inspect',
    chapterId: 'ch8_floorplan',
    globalIndex: 16,
    title: 'Inspection Table',
    targetSelector: '[data-tour="floorplan-table-T1"]',
    actionInstruction: 'Cliquez sur la Table T1 pour l’inspecter',
    arrowDirection: 'down',
    position: 'top',
    requiresView: 'staff',
    requiresStaffSection: 'tables',
  },

  // 17. NAVIGATION STAFF : FACTURATION & STOCKS
  {
    id: 'step_staff_nav_erp',
    chapterId: 'ch9_erp',
    globalIndex: 17,
    title: 'Facturation & Stocks',
    targetSelector: '[data-tour="staff-tab-erp"]',
    actionInstruction: 'Cliquez sur l’onglet « Facturation & Stocks »',
    arrowDirection: 'up',
    position: 'bottom',
    requiresView: 'staff',
  },

  // 18. BASCULE TICKET THERMIQUE 80MM
  {
    id: 'step_billing_formats',
    chapterId: 'ch9_erp',
    globalIndex: 18,
    title: 'Ticket Thermique',
    targetSelector: '[data-tour="billing-format-toggle"]',
    actionInstruction: 'Cliquez pour basculer en Ticket Thermique 80mm',
    arrowDirection: 'up',
    position: 'bottom',
    requiresView: 'staff',
    requiresStaffSection: 'erp',
  },

  // 19. RETOUR AU MENU CLIENT
  {
    id: 'step_return_client',
    chapterId: 'ch10_closing',
    globalIndex: 19,
    title: 'Retour Client',
    targetSelector: '[data-tour="staff-btn-logout"]',
    actionInstruction: 'Cliquez sur « Quitter Brigade »',
    arrowDirection: 'up',
    position: 'bottom',
    requiresView: 'staff',
  },

  // 20. DEMANDER L'ADDITION (POST-SERVICE)
  {
    id: 'step_post_service_choice',
    chapterId: 'ch10_closing',
    globalIndex: 20,
    title: 'Demande Addition',
    targetSelector: '[data-tour="post-service-bill-btn"]',
    actionInstruction: 'Cliquez sur « Régler l’Addition »',
    arrowDirection: 'down',
    position: 'top',
    requiresView: 'client',
  },

  // 21. PAIEMENT APPLE PAY
  {
    id: 'step_bill_pay',
    chapterId: 'ch10_closing',
    globalIndex: 21,
    title: 'Règlement de la Note',
    targetSelector: '[data-tour="bill-pay-btn"]',
    actionInstruction: 'Cliquez sur « Payer avec Apple Pay »',
    arrowDirection: 'down',
    position: 'top',
    requiresView: 'client',
  },

  // 22. LIBÉRER LA TABLE & TERMINER
  {
    id: 'step_feedback_receipt_finish',
    chapterId: 'ch10_closing',
    globalIndex: 22,
    title: 'Clôture de Service',
    targetSelector: '[data-tour="feedback-finish-service"]',
    actionInstruction: 'Cliquez sur « Libérer la Table & Terminer »',
    arrowDirection: 'down',
    position: 'top',
    requiresView: 'client',
  },
];
