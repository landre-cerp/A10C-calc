// This is just an example,
// so you can safely delete all default props below

export default {
  and: 'et',
  app_title: 'Calculateur de Perf A10C (pour DCS) - par Cerppo',
  failed: 'La commande a échoué',
  success: 'La commande a réussi',
  wind_direction_0_360: 'La direction du vent doit être comprise entre 0 et 360',
  loadout: 'Armement',
  takeoff: 'Décollage',
  landing: 'Atterrissage',
  flight: 'Vol',
  brief: 'Brief',
  about: 'A propos',
  change_language: 'change to ',
  runway: 'Piste',
  export_kneeboard: 'Exporter la kneeboard',

  wind: {
    label: 'Vent',
    Neutral: 'Neutre',
    Head: 'Face',
    Tail: 'Dos',
    CrossLeft: 'Croisé Gauche',
    CrossRight: 'Croisé Droite',
  },
  validator_between_0_360: 'la valeur doit être comprise entre 0 et 360',


  drag: 'Traînée',
  weapons: 'Armes',
  gun_ammo: 'Munitions',
  fuel_qty: 'Quantité de carburant',
  empty_weight: 'Poids à vide',
  config_name: 'Nom de la config.',
  sym_load: 'chargement symétrique',

  airport: {
    information: "Information sur l'aéroport",
    elevation: "Élévation de l'aéroport (pieds)",
    runway_length: 'Longueur de la piste (pieds)',
    runway_qfu: 'Direction QFU de la piste (degrés)',
    wind_direction: 'Direction du vent',
    wind_direction_help: 'Entrez la direction du vent en degrés (0-360)',
    wind_speed: 'Vitesse du vent',
    wind_speed_help: 'Entrez la vitesse du vent en nœuds',
    temperature: 'Température',
    temperature_help: 'la température du brief dans DCS est donnée pour le niveau de la mer. Retirez 2°C tous les 1000 pieds.',
    pressure: 'Pression',
    pressure_altitude: 'Altitude pression',
    pressure_qnh: 'QNH',
    pressure_qnh_unit_hpa: 'hPa',
    pressure_qnh_unit_inhg: 'inHg'
  },
  takeoff_info: {
    info: 'Informations décollage',
    flaps: 'Volets',
    ptfs_help: 'La vitesse de la turbine doit être vérifiée après environ 1 000 pieds de roulage pendant le décollage.',
    takeoff_weight: 'Poids au décollage',
    rotate_speed: 'Vitesse de rotation',
    takeoff_speed: 'Vitesse de décollage',
    takeoff_index: 'Indice de décollage (poussée Max)',
    takeoff_index_help: 'TakeOff Index est indiqué pour le cas où vous souhaitez lire les graphiques.',
    taxi_fuel: 'Carb. pour le Taxi (100 lbs/10 min)',
    taxi_fuel_help: "+ 200 lbs au pire pour le décollage et l'accélération à la vitesse de montée.",
    ground_run: 'Distance roulage piste',
    fifty_feet_clearance: 'Dégagement obstacle à 50 pieds',
    critical_field_length: 'Longueur piste critique',
    enter_runway_length: 'Entrez la longueur de la piste',


  },
  runway_condition: {
    label: 'Condition de la piste',
    dry: 'Sec',
    wet: 'Mouillé',
    icy: 'Verglacé'
  },
  flight_phase: {
    phase: 'Phase',
    summary: 'Résumé du vol',
    reserve: 'Réserve (lbs)',
    mission_range: 'Rayon de mission (NM)',
    cruise_alt: 'Alt. Croisière',
    optimum_cruise_alt: 'Opti. Alt. Croisière',
    distance: 'Distance',
    duration: 'Durée',
    duration_minutes: 'Durée (minutes)',
    fuel_used: 'Carb. utilisé',
    std_day_temp_dev: 'Dév T° jour STD',
    bingo_fuel: 'Bingo',

    TAKEOFF: 'Taxi & Décollage',
    CLIMB: 'Montée',
    CRUISE: 'Croisière',
    HI_COMBAT: 'Combat Altitude',
    REFUEL: 'Ravitaillement',
    DESCENT: 'Descente',
    LANDING: 'Atterrissage',

    wind_direction: 'Direction du vent',
    wind_speed: 'Vitesse du vent',
    leg_course: 'Cap',
    course_valid: 'le cap doit être entre 0 et 360°',

    starting_weight: 'Poids initial',
    efob: 'Carb Est.',
    starting_altitude: 'Alt. initiale',
    ending_altitude: 'Alt. finale',

    fuel_flow: 'Débit carburant',
    altitude: 'Altitude',
    drag: 'Traînée',
    bingo: 'Bingo',

    remove_last: 'Supprimer le dernier',
    quantity_refuelled: 'Qté ravitaillée (lbs)',
    greater_than_zero: 'doit être supérieur à 0. Ou vérifiez le carburant',

    optimum: {
      climb_speed: 'Vitesses (x1000ft : IAS) : [SL: 200, 5: 195, 10: 190, 15: 185, 20: 180]',
      combat_ff: 'Débit Carb. Combat à 250 KIAS',
      speed_max_range: 'Vitesse pour distance maximale est {speed} KIAS ( Idle, SB Fermés)',
      speed_max_range_help: 'Carburant, temps and distance pour une descente en Penetration: 80 % core RPM, 200 KIAS, SB ouverts à 40% ',
    },

    alt_must_be_lower: 'Altitude doit être inférieure à l\'originale pour descendre	',
    alt_must_be_higher: 'Altitude doit être supérieure à l\'originale pour monter',

  },
  landing_info: {
    copy_takeoff_params: 'Copier les paramètres de décollage',
    gross_weight: 'Poids total',
    gross_weight_validator: "Le poids brut doit être supérieur au poids à vide et inférieur au poids d'atterrissage maximal.",
    single_engine: 'Un seul moteur  ',
    speed_brakes: 'Aerofreins',
    minimum_run: 'Distance roulage minimum',
    minimum_run_help: 'Cochez pour voir la distance de roulage minimum et la vitesse d\'atterrissage associée',
    final_approach_speed: 'Vitesse finale d\'approche',
    touch_down_speed: 'Vitesse d\'atterrissage',
    ground_roll: 'Distance roulage',
    landing_index: 'Landing index',
    landing_index_help: "L'indice d'atterrissage est affiché au cas où vous souhaiteriez consulter les cartes.",
  },

  brief_page: {
    fuel: 'Carburant',
    ammo: 'Munitions',
    takeoff_weight: 'Poids au décollage',


  }

};
