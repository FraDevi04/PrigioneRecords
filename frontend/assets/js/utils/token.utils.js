/**
 * Utility per la gestione dei token JWT
 */
class TokenManager {
  static TOKEN_KEY = 'prigione_token';
  static REFRESH_TOKEN_KEY = 'prigione_refresh_token';
  static REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minuti prima della scadenza

  /**
   * Imposta il token di autenticazione
   * @param {string} token - Token JWT
   */
  static setToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Ottiene il token di autenticazione
   * @returns {string|null} Token JWT o null se non presente
   */
  static getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Rimuove il token di autenticazione
   */
  static removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Imposta il refresh token
   * @param {string} refreshToken - Refresh token
   */
  static setRefreshToken(refreshToken) {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  /**
   * Ottiene il refresh token
   * @returns {string|null} Refresh token o null se non presente
   */
  static getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Verifica se il token è scaduto
   * @param {string} token - Token da verificare
   * @returns {boolean} True se il token è scaduto
   */
  static isTokenExpired(token) {
    if (!token) return true;
    
    try {
      const payload = this.decodeTokenPayload(token);
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Errore nel parsing del token:', error);
      return true;
    }
  }

  /**
   * Verifica se il token deve essere rinnovato
   * @param {string} token - Token da verificare
   * @returns {boolean} True se il token deve essere rinnovato
   */
  static shouldRefreshToken(token) {
    if (!token) return false;
    
    try {
      const payload = this.decodeTokenPayload(token);
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = (payload.exp - currentTime) * 1000;
      return timeUntilExpiry < this.REFRESH_THRESHOLD;
    } catch (error) {
      console.error('Errore nel parsing del token:', error);
      return false;
    }
  }

  /**
   * Decodifica il payload del token JWT
   * @param {string} token - Token JWT
   * @returns {Object} Payload decodificato
   */
  static decodeTokenPayload(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token JWT non valido');
    }
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  }

  /**
   * Ottiene informazioni dall'utente dal token
   * @param {string} token - Token JWT
   * @returns {Object|null} Informazioni utente o null se errore
   */
  static getUserFromToken(token) {
    if (!token) return null;
    
    try {
      const payload = this.decodeTokenPayload(token);
      return {
        id: payload.sub || payload.userId,
        email: payload.email,
        nome: payload.nome,
        role: payload.role || 'USER',
        exp: payload.exp,
        iat: payload.iat
      };
    } catch (error) {
      console.error('Errore nell\'estrazione utente dal token:', error);
      return null;
    }
  }

  /**
   * Verifica se l'utente è amministratore
   * @param {string} token - Token JWT
   * @returns {boolean} True se l'utente è admin
   */
  static isAdmin(token) {
    const user = this.getUserFromToken(token);
    return user && user.role === 'ADMIN';
  }

  /**
   * Ottiene il tempo rimanente prima della scadenza del token
   * @param {string} token - Token JWT
   * @returns {number} Millisecondi rimanenti (0 se scaduto)
   */
  static getTimeUntilExpiry(token) {
    if (!token) return 0;
    
    try {
      const payload = this.decodeTokenPayload(token);
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = (payload.exp - currentTime) * 1000;
      return Math.max(0, timeUntilExpiry);
    } catch (error) {
      console.error('Errore nel calcolo scadenza token:', error);
      return 0;
    }
  }

  /**
   * Formatta la data di scadenza del token
   * @param {string} token - Token JWT
   * @returns {string} Data formattata o 'Scaduto'
   */
  static getFormattedExpiry(token) {
    if (!token) return 'Token non presente';
    
    try {
      const payload = this.decodeTokenPayload(token);
      const expDate = new Date(payload.exp * 1000);
      
      if (this.isTokenExpired(token)) {
        return 'Scaduto';
      }
      
      return expDate.toLocaleString('it-IT');
    } catch (error) {
      console.error('Errore nella formattazione scadenza:', error);
      return 'Formato non valido';
    }
  }

  /**
   * Valida la struttura del token JWT
   * @param {string} token - Token da validare
   * @returns {boolean} True se la struttura è valida
   */
  static isValidTokenStructure(token) {
    if (!token || typeof token !== 'string') return false;
    
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    try {
      // Verifica che header e payload siano JSON validi
      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      
      // Verifica presenza campi essenziali
      return header.alg && payload.exp && payload.sub;
    } catch (error) {
      return false;
    }
  }

  /**
   * Ottiene gli header di autorizzazione per le richieste API
   * @returns {Object} Headers di autorizzazione
   */
  static getAuthHeaders() {
    const token = this.getToken();
    if (!token || this.isTokenExpired(token)) {
      return {};
    }
    
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  /**
   * Configura un timer per il refresh automatico del token
   * @param {Function} refreshCallback - Funzione da chiamare per il refresh
   * @returns {number} ID del timer (per clearTimeout)
   */
  static setupAutoRefresh(refreshCallback) {
    const token = this.getToken();
    if (!token || this.isTokenExpired(token)) {
      return null;
    }
    
    const timeUntilRefresh = Math.max(0, this.getTimeUntilExpiry(token) - this.REFRESH_THRESHOLD);
    
    if (timeUntilRefresh > 0) {
      return setTimeout(() => {
        if (typeof refreshCallback === 'function') {
          refreshCallback();
        }
      }, timeUntilRefresh);
    }
    
    return null;
  }

  /**
   * Pulisce tutti i dati di autenticazione
   */
  static clearAllAuth() {
    this.removeToken();
    
    // Rimuovi anche altri dati correlati all'autenticazione
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    // Cancella eventuali cookie di autenticazione (se usati)
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      if (name.trim().includes('auth') || name.trim().includes('token')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    });
  }

  /**
   * Debug: ottiene informazioni complete sul token
   * @param {string} token - Token da analizzare
   * @returns {Object} Informazioni dettagliate
   */
  static getTokenInfo(token) {
    if (!token) {
      return { error: 'Token non presente' };
    }
    
    try {
      const payload = this.decodeTokenPayload(token);
      const isExpired = this.isTokenExpired(token);
      const shouldRefresh = this.shouldRefreshToken(token);
      const timeUntilExpiry = this.getTimeUntilExpiry(token);
      
      return {
        payload,
        isExpired,
        shouldRefresh,
        timeUntilExpiry,
        formattedExpiry: this.getFormattedExpiry(token),
        user: this.getUserFromToken(token),
        isValid: this.isValidTokenStructure(token)
      };
    } catch (error) {
      return { 
        error: `Errore nell'analisi del token: ${error.message}` 
      };
    }
  }
}

export default TokenManager; 