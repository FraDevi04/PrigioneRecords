// Configurazione dell'applicazione PrigioneRecords

const AppConfig = {
  // API Configuration
  api: {
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000
  },

  // Authentication
  auth: {
    tokenKey: 'prigione_token',
    userKey: 'prigione_user',
    refreshThreshold: 5 * 60 * 1000, // 5 minuti
    rememberMeDuration: 30 * 24 * 60 * 60 * 1000 // 30 giorni
  },

  // Cache Configuration
  cache: {
    defaultDuration: 5 * 60 * 1000, // 5 minuti
    studiosCacheDuration: 10 * 60 * 1000, // 10 minuti
    userDataCacheDuration: 2 * 60 * 1000 // 2 minuti
  },

  // UI Configuration
  ui: {
    itemsPerPage: 12,
    searchDebounceDelay: 300,
    toastDuration: 5000,
    modalAnimationDuration: 300,
    loadingMinDelay: 500 // Per evitare flash dei loading
  },

  // Feature Flags
  features: {
    enablePushNotifications: false,
    enableSocialLogin: false,
    enableFileUpload: false,
    enableRealTimeChat: false,
    enableAnalytics: false
  },

  // App Metadata
  app: {
    name: 'PrigioneRecords',
    version: '1.0.0',
    description: 'Gestione studi di registrazione, prenotazioni e recensioni',
    keywords: ['music', 'recording', 'studio', 'booking'],
    author: 'Francesco Devillanova, Davide Galliani, Francesco Bonavita'
  },

  // Validation Rules
  validation: {
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      maxLength: 255
    },
    password: {
      minLength: 6,
      maxLength: 128,
      requireSpecialChar: false,
      requireNumber: false,
      requireUppercase: false
    },
    name: {
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZÀ-ÿ\s'.-]+$/
    },
    rating: {
      min: 1,
      max: 5
    },
    comment: {
      maxLength: 1000
    },
    address: {
      maxLength: 255
    }
  },

  // Date/Time Configuration
  dateTime: {
    locale: 'it-IT',
    timezone: 'Europe/Rome',
    formats: {
      date: 'DD/MM/YYYY',
      time: 'HH:mm',
      datetime: 'DD/MM/YYYY HH:mm',
      apiDate: 'YYYY-MM-DD',
      apiDateTime: 'YYYY-MM-DDTHH:mm:ss'
    }
  },

  // Error Messages
  errors: {
    network: 'Errore di connessione. Verifica la tua connessione internet.',
    server: 'Errore del server. Riprova più tardi.',
    unauthorized: 'Accesso non autorizzato. Effettua il login.',
    forbidden: 'Non hai i permessi per eseguire questa operazione.',
    notFound: 'Risorsa non trovata.',
    validation: 'Dati inseriti non validi.',
    generic: 'Si è verificato un errore imprevisto.'
  },

  // Success Messages
  success: {
    login: 'Accesso effettuato con successo!',
    register: 'Registrazione completata! Benvenuto in PrigioneRecords.',
    bookingCreated: 'Prenotazione confermata con successo!',
    bookingCancelled: 'Prenotazione cancellata.',
    reviewCreated: 'Recensione pubblicata con successo!',
    reviewDeleted: 'Recensione eliminata.',
    profileUpdated: 'Profilo aggiornato con successo.',
    passwordChanged: 'Password modificata con successo.'
  },

  // Routes Configuration
  routes: {
    home: '/',
    login: '/login',
    register: '/register',
    dashboard: '/dashboard',
    studios: '/studi',
    studioDetail: '/studi/:id',
    bookings: '/prenotazioni',
    newBooking: '/prenotazioni/nuova',
    reviews: '/recensioni',
    profile: '/profilo',
    admin: '/admin',
    adminStudios: '/admin/studi',
    adminUsers: '/admin/utenti',
    adminDashboard: '/admin/dashboard'
  },

  // Storage Keys
  storage: {
    theme: 'prigione_theme',
    language: 'prigione_language',
    lastRoute: 'prigione_last_route',
    searchHistory: 'prigione_search_history',
    filters: 'prigione_filters'
  },

  // Development Configuration
  dev: {
    enableLogging: true,
    enableDebugMode: false,
    showPerformanceMetrics: false,
    mockApiDelay: 500
  }
};

// Funzione per ottenere configurazioni annidate
AppConfig.get = function(path, defaultValue = null) {
  return path.split('.').reduce((obj, key) => {
    return obj && obj[key] !== undefined ? obj[key] : defaultValue;
  }, this);
};

// Funzione per verificare se una feature è abilitata
AppConfig.isFeatureEnabled = function(featureName) {
  return this.features[featureName] === true;
};

// Funzione per ottenere l'URL completo dell'API
AppConfig.getApiUrl = function(endpoint) {
  return `${this.api.baseURL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
};

// Funzione per validare email
AppConfig.validateEmail = function(email) {
  return this.validation.email.pattern.test(email) && 
         email.length <= this.validation.email.maxLength;
};

// Funzione per validare password
AppConfig.validatePassword = function(password) {
  return password && 
         password.length >= this.validation.password.minLength && 
         password.length <= this.validation.password.maxLength;
};

// Export per uso globale
if (typeof window !== 'undefined') {
  window.AppConfig = AppConfig;
}

// Export per moduli ES6 (se supportato)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppConfig;
} 