// Servizio API principale per PrigioneRecords

console.log('🔄 Caricamento api.service.js...');

/**
 * Classe per gestire errori API
 */
class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  /**
   * Restituisce un messaggio user-friendly
   * @returns {string} Messaggio per l'utente
   */
  getUserMessage() {
    const config = window.AppConfig || {
      errors: {
        validation: 'Dati inseriti non validi.',
        unauthorized: 'Accesso non autorizzato. Effettua il login.',
        forbidden: 'Non hai i permessi per eseguire questa operazione.',
        notFound: 'Risorsa non trovata.',
        server: 'Errore del server. Riprova più tardi.',
        generic: 'Si è verificato un errore imprevisto.'
      }
    };
    
    switch (this.status) {
      case 400:
        return this.data?.message || config.errors.validation;
      case 401:
        return config.errors.unauthorized;
      case 403:
        return config.errors.forbidden;
      case 404:
        return config.errors.notFound;
      case 500:
      case 502:
      case 503:
      case 504:
        return config.errors.server;
      default:
        if (this.status >= 500) {
          return config.errors.server;
        }
        if (this.status >= 400) {
          return this.data?.message || config.errors.validation;
        }
        return this.message || config.errors.generic;
    }
  }

  /**
   * Verifica se l'errore è di rete
   * @returns {boolean} True se è un errore di rete
   */
  isNetworkError() {
    return this.name === 'TypeError' || this.status === 0;
  }

  /**
   * Verifica se l'errore è del server
   * @returns {boolean} True se è un errore del server
   */
  isServerError() {
    return this.status >= 500;
  }

  /**
   * Verifica se l'errore è di validazione
   * @returns {boolean} True se è un errore di validazione
   */
  isValidationError() {
    return this.status >= 400 && this.status < 500;
  }
}

class ApiService {
  constructor() {
    console.log('🏗️ Costruendo istanza ApiService...');
    // Utilizziamo window.AppConfig invece di assumere che AppConfig sia importato
    this.config = window.AppConfig || {
      api: {
        baseURL: 'http://localhost:8080/api',
        timeout: 10000,
        retryAttempts: 3,
        retryDelay: 1000
      },
      auth: {
        tokenKey: 'prigione_token',
        userKey: 'prigione_user'
      },
      dev: {
        enableLogging: true
      },
      errors: {
        validation: 'Dati inseriti non validi.',
        unauthorized: 'Accesso non autorizzato. Effettua il login.',
        forbidden: 'Non hai i permessi per eseguire questa operazione.',
        notFound: 'Risorsa non trovata.',
        server: 'Errore del server. Riprova più tardi.',
        generic: 'Si è verificato un errore imprevisto.'
      }
    };
    
    this.baseURL = this.config.api.baseURL;
    this.timeout = this.config.api.timeout;
    this.retryAttempts = this.config.api.retryAttempts;
    this.retryDelay = this.config.api.retryDelay;
    
    console.log('✅ ApiService istanza creata con baseURL:', this.baseURL);
  }

  /**
   * Effettua una richiesta HTTP con gestione errori e retry
   * @param {string} endpoint - Endpoint dell'API
   * @param {Object} options - Opzioni della richiesta
   * @returns {Promise} Risposta dell'API
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem(this.config.auth.tokenKey);
    
    const config = {
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    let lastError = null;
    
    // Retry logic
    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        // Gestione codici di stato HTTP
        if (response.status === 401) {
          this._handleUnauthorized();
          throw new ApiError('Accesso non autorizzato', 401);
        }

        if (response.status === 403) {
          throw new ApiError('Accesso negato', 403);
        }

        if (response.status === 404) {
          throw new ApiError('Risorsa non trovata', 404);
        }

        if (response.status >= 500) {
          throw new ApiError('Errore del server', response.status);
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError(
            errorData.message || errorData.error || `HTTP error! status: ${response.status}`,
            response.status,
            errorData
          );
        }

        // Prova a parsare come JSON, altrimenti restituisci il response
        try {
          return await response.json();
        } catch {
          return response;
        }

      } catch (error) {
        lastError = error;
        
        // Non fare retry per errori di validazione (4xx)
        if (error.status && error.status >= 400 && error.status < 500) {
          break;
        }
        
        // Non fare retry se è l'ultimo tentativo
        if (attempt === this.retryAttempts) {
          break;
        }
        
        // Attendi prima del prossimo tentativo
        await this._delay(this.retryDelay * (attempt + 1));
        
        if (this.config.dev.enableLogging) {
          console.warn(`API retry ${attempt + 1}/${this.retryAttempts} for ${url}`);
        }
      }
    }

    // Se arriviamo qui, tutti i tentativi sono falliti
    if (this.config.dev.enableLogging) {
      console.error('API Error:', lastError);
    }
    
    throw lastError;
  }

  /**
   * GET request
   * @param {string} endpoint - Endpoint dell'API
   * @param {Object} params - Query parameters
   * @returns {Promise} Risposta dell'API
   */
  async get(endpoint, params = {}) {
    const queryString = Object.keys(params).length > 0 
      ? '?' + new URLSearchParams(params).toString()
      : '';
    
    return this.request(endpoint + queryString, { 
      method: 'GET' 
    });
  }

  /**
   * POST request
   * @param {string} endpoint - Endpoint dell'API
   * @param {Object} data - Dati da inviare
   * @returns {Promise} Risposta dell'API
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT request
   * @param {string} endpoint - Endpoint dell'API
   * @param {Object} data - Dati da inviare
   * @returns {Promise} Risposta dell'API
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   * @param {string} endpoint - Endpoint dell'API
   * @returns {Promise} Risposta dell'API
   */
  async delete(endpoint) {
    return this.request(endpoint, { 
      method: 'DELETE' 
    });
  }

  /**
   * PATCH request
   * @param {string} endpoint - Endpoint dell'API
   * @param {Object} data - Dati da inviare
   * @returns {Promise} Risposta dell'API
   */
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  /**
   * Upload file
   * @param {string} endpoint - Endpoint dell'API
   * @param {FormData} formData - FormData con il file
   * @returns {Promise} Risposta dell'API
   */
  async upload(endpoint, formData) {
    const token = localStorage.getItem(this.config.auth.tokenKey);
    
    return this.request(endpoint, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
        // Non impostare Content-Type per FormData
      },
      body: formData
    });
  }

  /**
   * Gestisce logout automatico per 401
   * @private
   */
  _handleUnauthorized() {
    localStorage.removeItem(this.config.auth.tokenKey);
    localStorage.removeItem(this.config.auth.userKey);
    
    // Redirect al login se non siamo già lì
    if (window.location.pathname !== '/login') {
      window.router?.navigate('/login');
    }
  }

  /**
   * Delay utility per retry
   * @private
   * @param {number} ms - Millisecondi di attesa
   * @returns {Promise} Promise che risolve dopo il delay
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Verifica se il token è valido
   * @returns {boolean} True se il token è valido
   */
  isTokenValid() {
    const token = localStorage.getItem(this.config.auth.tokenKey);
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  /**
   * Ottiene l'header Authorization
   * @returns {Object} Header con token
   */
  getAuthHeaders() {
    const token = localStorage.getItem(this.config.auth.tokenKey);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Verifica se il backend è raggiungibile
   * @returns {Promise<boolean>} True se il backend è raggiungibile
   */
  async healthCheck() {
    try {
      console.log('🏥 Checking backend health...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout più breve per health check
      
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('✅ Backend health check passed:', response.status);
      return true;
      
    } catch (error) {
      console.error('❌ Backend health check failed:', error.message);
      return false;
    }
  }

  /**
   * Attende che il backend sia disponibile
   * @param {number} maxRetries - Numero massimo di tentativi
   * @param {number} delay - Ritardo tra i tentativi in ms
   * @returns {Promise<boolean>} True se il backend diventa disponibile
   */
  async waitForBackend(maxRetries = 10, delay = 2000) {
    console.log('⏳ Waiting for backend to be available...');
    
    for (let i = 0; i < maxRetries; i++) {
      const isHealthy = await this.healthCheck();
      if (isHealthy) {
        console.log('✅ Backend is now available!');
        return true;
      }
      
      console.log(`⏳ Backend not ready, retrying in ${delay}ms... (${i + 1}/${maxRetries})`);
      await this._delay(delay);
    }
    
    console.error('❌ Backend did not become available within timeout');
    return false;
  }
}

// Istanza globale del servizio API
console.log('🔧 Creando istanza globale apiService...');
const apiService = new ApiService();
console.log('✅ Istanza globale apiService creata!');

// Export per uso globale
window.apiService = apiService;
window.ApiError = ApiError;
console.log('🌐 Esportato in window.apiService e window.ApiError');

// Export per moduli ES6
export default ApiService;
export { ApiError, apiService };
console.log('📦 Export ES6 completati: default=ApiService, {ApiError, apiService}'); 