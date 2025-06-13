/**
 * Utility per la gestione della cache
 */
class CacheManager {
  constructor() {
    this.DEFAULT_DURATION = 5 * 60 * 1000; // 5 minuti
    this.PREFIX = 'prigione_cache_';
  }

  /**
   * Salva dati nella cache
   * @param {string} key - Chiave della cache
   * @param {any} data - Dati da cachare
   * @param {number} duration - Durata in millisecondi (opzionale)
   */
  set(key, data, duration = this.DEFAULT_DURATION) {
    const cacheData = {
      data: data,
      timestamp: Date.now(),
      duration: duration,
      expires: Date.now() + duration
    };
    
    try {
      const cacheKey = this.PREFIX + key;
      sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (e) {
      console.warn('Cache storage fallito per:', key, e);
      // Fallback: prova a liberare spazio eliminando cache vecchie
      this.cleanup();
      try {
        sessionStorage.setItem(this.PREFIX + key, JSON.stringify(cacheData));
      } catch (e2) {
        console.error('Impossibile salvare in cache:', key, e2);
      }
    }
  }

  /**
   * Recupera dati dalla cache
   * @param {string} key - Chiave della cache
   * @returns {any|null} Dati dalla cache o null se non trovati/scaduti
   */
  get(key) {
    try {
      const cacheKey = this.PREFIX + key;
      const cached = sessionStorage.getItem(cacheKey);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      const now = Date.now();
      
      // Controlla se la cache è scaduta
      if (now > cacheData.expires) {
        this.remove(key);
        return null;
      }

      return cacheData.data;
    } catch (e) {
      console.warn('Errore lettura cache per:', key, e);
      return null;
    }
  }

  /**
   * Verifica se una chiave esiste nella cache ed è valida
   * @param {string} key - Chiave da verificare
   * @returns {boolean} True se la cache esiste ed è valida
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Rimuove una chiave dalla cache
   * @param {string} key - Chiave da rimuovere
   */
  remove(key) {
    try {
      const cacheKey = this.PREFIX + key;
      sessionStorage.removeItem(cacheKey);
    } catch (e) {
      console.warn('Errore rimozione cache per:', key, e);
    }
  }

  /**
   * Pulisce tutta la cache dell'applicazione
   */
  clear() {
    try {
      // Rimuovi solo le chiavi dell'app
      const keys = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(this.PREFIX)) {
          keys.push(key);
        }
      }
      
      keys.forEach(key => sessionStorage.removeItem(key));
    } catch (e) {
      console.warn('Errore pulizia cache:', e);
    }
  }

  /**
   * Pulisce le cache scadute
   */
  cleanup() {
    try {
      const now = Date.now();
      const keysToRemove = [];
      
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(this.PREFIX)) {
          try {
            const cached = sessionStorage.getItem(key);
            const cacheData = JSON.parse(cached);
            
            if (now > cacheData.expires) {
              keysToRemove.push(key);
            }
          } catch (e) {
            // Se non riesce a parsare, rimuovi la chiave
            keysToRemove.push(key);
          }
        }
      }
      
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
      
      console.log(`Cache cleanup: rimosse ${keysToRemove.length} chiavi scadute`);
    } catch (e) {
      console.warn('Errore durante cleanup cache:', e);
    }
  }

  /**
   * Metodo helper per caching automatico delle funzioni
   * @param {string} key - Chiave della cache
   * @param {Function} fetchFunction - Funzione che recupera i dati
   * @param {number} duration - Durata cache in millisecondi
   * @returns {Promise<any>} Dati dalla cache o dalla fetch function
   */
  async withCache(key, fetchFunction, duration = this.DEFAULT_DURATION) {
    // Prova a ottenere dalla cache
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    // Se non in cache, esegui la fetch
    try {
      const data = await fetchFunction();
      this.set(key, data, duration);
      return data;
    } catch (error) {
      console.error('Errore in fetchFunction per:', key, error);
      throw error;
    }
  }

  /**
   * Invalida cache multiple basate su pattern
   * @param {Array<string>} patterns - Pattern delle chiavi da invalidare
   */
  invalidatePattern(patterns) {
    try {
      const keysToRemove = [];
      
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(this.PREFIX)) {
          const cacheKey = key.substring(this.PREFIX.length);
          
          if (patterns.some(pattern => cacheKey.includes(pattern))) {
            keysToRemove.push(key);
          }
        }
      }
      
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
      
      console.log(`Cache invalidation: rimosse ${keysToRemove.length} chiavi`);
    } catch (e) {
      console.warn('Errore invalidazione pattern cache:', e);
    }
  }

  /**
   * Ottiene informazioni sulla cache
   * @returns {Object} Statistiche della cache
   */
  getStats() {
    try {
      let totalKeys = 0;
      let totalSize = 0;
      let expiredKeys = 0;
      const now = Date.now();
      
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(this.PREFIX)) {
          totalKeys++;
          const value = sessionStorage.getItem(key);
          totalSize += (key.length + value.length) * 2; // Approssimazione size in bytes
          
          try {
            const cacheData = JSON.parse(value);
            if (now > cacheData.expires) {
              expiredKeys++;
            }
          } catch (e) {
            expiredKeys++;
          }
        }
      }
      
      return {
        totalKeys,
        expiredKeys,
        activeKeys: totalKeys - expiredKeys,
        totalSize: totalSize,
        sizeKB: Math.round(totalSize / 1024 * 100) / 100
      };
    } catch (e) {
      console.warn('Errore nel calcolo stats cache:', e);
      return {
        totalKeys: 0,
        expiredKeys: 0,
        activeKeys: 0,
        totalSize: 0,
        sizeKB: 0
      };
    }
  }

  /**
   * Imposta la durata predefinita della cache
   * @param {number} duration - Durata in millisecondi
   */
  setDefaultDuration(duration) {
    this.DEFAULT_DURATION = duration;
  }

  /**
   * Ottiene la durata predefinita della cache
   * @returns {number} Durata in millisecondi
   */
  getDefaultDuration() {
    return this.DEFAULT_DURATION;
  }

  /**
   * Verifica se la cache è supportata dal browser
   * @returns {boolean} True se sessionStorage è supportato
   */
  isSupported() {
    try {
      const test = '__cache_test__';
      sessionStorage.setItem(test, 'test');
      sessionStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Crea una versione memoizzata di una funzione con cache
   * @param {Function} fn - Funzione da memoizzare
   * @param {Function} keyGenerator - Funzione per generare la chiave cache
   * @param {number} duration - Durata cache
   * @returns {Function} Funzione memoizzata
   */
  memoize(fn, keyGenerator, duration = this.DEFAULT_DURATION) {
    return async (...args) => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      
      return this.withCache(
        `memo_${fn.name}_${key}`,
        () => fn(...args),
        duration
      );
    };
  }
}

/**
 * Istanza globale del cache manager
 */
const cacheManager = new CacheManager();

/**
 * Helper functions per casi d'uso comuni
 */

/**
 * Cache per liste di studi
 * @param {Function} fetchFunction - Funzione per recuperare gli studi
 * @returns {Promise<Array>} Lista studi
 */
async function cacheStudios(fetchFunction) {
  return cacheManager.withCache(
    'studios_list',
    fetchFunction,
    5 * 60 * 1000 // 5 minuti
  );
}

/**
 * Cache per dettaglio studio specifico
 * @param {string} studioId - ID dello studio
 * @param {Function} fetchFunction - Funzione per recuperare il dettaglio
 * @returns {Promise<Object>} Dettaglio studio
 */
async function cacheStudioDetail(studioId, fetchFunction) {
  return cacheManager.withCache(
    `studio_detail_${studioId}`,
    fetchFunction,
    10 * 60 * 1000 // 10 minuti
  );
}

/**
 * Cache per prenotazioni utente
 * @param {Function} fetchFunction - Funzione per recuperare le prenotazioni
 * @returns {Promise<Array>} Lista prenotazioni
 */
async function cacheUserBookings(fetchFunction) {
  return cacheManager.withCache(
    'user_bookings',
    fetchFunction,
    2 * 60 * 1000 // 2 minuti (più frequente per dati sensibili)
  );
}

/**
 * Cache per recensioni
 * @param {string} studioId - ID dello studio (opzionale)
 * @param {Function} fetchFunction - Funzione per recuperare le recensioni
 * @returns {Promise<Array>} Lista recensioni
 */
async function cacheReviews(studioId, fetchFunction) {
  const key = studioId ? `reviews_studio_${studioId}` : 'reviews_all';
  return cacheManager.withCache(
    key,
    fetchFunction,
    5 * 60 * 1000 // 5 minuti
  );
}

/**
 * Invalida le cache correlate alle prenotazioni
 */
function invalidateBookingCaches() {
  cacheManager.invalidatePattern(['bookings', 'studio_detail', 'user_bookings']);
}

/**
 * Invalida le cache correlate alle recensioni
 */
function invalidateReviewCaches() {
  cacheManager.invalidatePattern(['reviews', 'studio_detail']);
}

/**
 * Invalida le cache correlate agli studi
 */
function invalidateStudioCaches() {
  cacheManager.invalidatePattern(['studios', 'studio_detail']);
}

export {
  CacheManager,
  cacheManager,
  cacheStudios,
  cacheStudioDetail,
  cacheUserBookings,
  cacheReviews,
  invalidateBookingCaches,
  invalidateReviewCaches,
  invalidateStudioCaches
};

export default cacheManager; 