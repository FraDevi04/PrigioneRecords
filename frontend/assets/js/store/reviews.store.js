/**
 * Store per la gestione dello stato delle recensioni
 */
class ReviewsStore {
  constructor() {
    this.recensioni = [];
    this.mieRecensioni = [];
    this.currentRecensione = null;
    this.isLoading = false;
    this.error = null;
    this.listeners = new Set();
    this.filters = {
      studioId: null,
      valutazione: null,
      dataInizio: null,
      dataFine: null
    };
  }

  /**
   * Sottoscrivi ai cambiamenti di stato
   * @param {Function} listener - Funzione da chiamare sui cambiamenti
   * @returns {Function} Funzione per annullare la sottoscrizione
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notifica tutti i listener dei cambiamenti
   */
  notify() {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  /**
   * Ottiene lo stato corrente
   * @returns {Object} Stato corrente
   */
  getState() {
    return {
      recensioni: this.recensioni,
      mieRecensioni: this.mieRecensioni,
      currentRecensione: this.currentRecensione,
      isLoading: this.isLoading,
      error: this.error,
      filters: { ...this.filters }
    };
  }

  /**
   * Carica tutte le recensioni
   */
  async fetchRecensioni() {
    this.isLoading = true;
    this.error = null;
    this.notify();
    
    try {
      const reviewsService = (await import('../services/reviews.service.js')).default;
      this.recensioni = await reviewsService.getRecensioni();
      
      // Cache delle recensioni
      this._cacheData('recensioni_all', this.recensioni);
    } catch (error) {
      this.error = error.message;
      console.error('Errore nel caricamento recensioni:', error);
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  /**
   * Carica le recensioni dell'utente corrente
   */
  async fetchMieRecensioni() {
    this.isLoading = true;
    this.error = null;
    this.notify();
    
    try {
      const reviewsService = (await import('../services/reviews.service.js')).default;
      this.mieRecensioni = await reviewsService.getMieRecensioni();
      
      // Cache delle recensioni personali
      this._cacheData('recensioni_mie', this.mieRecensioni);
    } catch (error) {
      this.error = error.message;
      console.error('Errore nel caricamento mie recensioni:', error);
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  /**
   * Carica le recensioni per uno studio specifico
   * @param {string} studioId - ID dello studio
   */
  async fetchRecensioniStudio(studioId) {
    this.isLoading = true;
    this.error = null;
    this.notify();
    
    try {
      const reviewsService = (await import('../services/reviews.service.js')).default;
      const recensioniStudio = await reviewsService.getRecensioniStudio(studioId);
      
      // Aggiorna la lista principale con le recensioni dello studio
      this.recensioni = recensioniStudio;
      
      // Cache delle recensioni dello studio
      this._cacheData(`recensioni_studio_${studioId}`, recensioniStudio);
    } catch (error) {
      this.error = error.message;
      console.error('Errore nel caricamento recensioni studio:', error);
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  /**
   * Crea una nuova recensione
   * @param {Object} recensioneData - Dati della recensione
   */
  async createRecensione(recensioneData) {
    this.isLoading = true;
    this.error = null;
    this.notify();
    
    try {
      const reviewsService = (await import('../services/reviews.service.js')).default;
      const nuovaRecensione = await reviewsService.createRecensione(recensioneData);
      
      // Aggiungi la nuova recensione alle liste
      this.recensioni.unshift(nuovaRecensione);
      this.mieRecensioni.unshift(nuovaRecensione);
      this.currentRecensione = nuovaRecensione;
      
      // Invalida le cache correlate
      this._invalidateCache(['recensioni_all', 'recensioni_mie', `recensioni_studio_${recensioneData.studioId}`]);
      
      return nuovaRecensione;
    } catch (error) {
      this.error = error.message;
      console.error('Errore nella creazione recensione:', error);
      throw error;
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  /**
   * Aggiorna una recensione esistente
   * @param {string} id - ID della recensione
   * @param {Object} recensioneData - Nuovi dati
   */
  async updateRecensione(id, recensioneData) {
    this.isLoading = true;
    this.error = null;
    this.notify();
    
    try {
      const reviewsService = (await import('../services/reviews.service.js')).default;
      const recensioneAggiornata = await reviewsService.updateRecensione(id, recensioneData);
      
      // Aggiorna la recensione nelle liste
      this._updateRecensioneInLists(id, recensioneAggiornata);
      
      // Invalida le cache
      this._invalidateCache(['recensioni_all', 'recensioni_mie']);
      
      return recensioneAggiornata;
    } catch (error) {
      this.error = error.message;
      console.error('Errore nell\'aggiornamento recensione:', error);
      throw error;
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  /**
   * Elimina una recensione
   * @param {string} id - ID della recensione
   */
  async deleteRecensione(id) {
    this.isLoading = true;
    this.error = null;
    this.notify();
    
    try {
      const reviewsService = (await import('../services/reviews.service.js')).default;
      await reviewsService.deleteRecensione(id);
      
      // Rimuovi la recensione dalle liste
      this._removeRecensioneFromLists(id);
      
      // Invalida le cache
      this._invalidateCache(['recensioni_all', 'recensioni_mie']);
      
    } catch (error) {
      this.error = error.message;
      console.error('Errore nell\'eliminazione recensione:', error);
      throw error;
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  /**
   * Imposta i filtri per le recensioni
   * @param {Object} newFilters - Nuovi filtri
   */
  setFilters(newFilters) {
    this.filters = { ...this.filters, ...newFilters };
    this.notify();
  }

  /**
   * Ottiene le recensioni filtrate
   * @returns {Array} Recensioni filtrate
   */
  getFilteredRecensioni() {
    let filtered = [...this.recensioni];
    
    if (this.filters.studioId) {
      filtered = filtered.filter(r => r.studioId === this.filters.studioId);
    }
    
    if (this.filters.valutazione) {
      filtered = filtered.filter(r => r.valutazione >= this.filters.valutazione);
    }
    
    if (this.filters.dataInizio) {
      filtered = filtered.filter(r => new Date(r.dataRecensione) >= new Date(this.filters.dataInizio));
    }
    
    if (this.filters.dataFine) {
      filtered = filtered.filter(r => new Date(r.dataRecensione) <= new Date(this.filters.dataFine));
    }
    
    return filtered;
  }

  /**
   * Reset dello stato
   */
  reset() {
    this.recensioni = [];
    this.mieRecensioni = [];
    this.currentRecensione = null;
    this.error = null;
    this.filters = {
      studioId: null,
      valutazione: null,
      dataInizio: null,
      dataFine: null
    };
    this.notify();
  }

  // Metodi privati per la gestione delle liste e cache
  _updateRecensioneInLists(id, recensioneAggiornata) {
    const updateInList = (list) => {
      const index = list.findIndex(r => r.id === id);
      if (index !== -1) {
        list[index] = recensioneAggiornata;
      }
    };
    
    updateInList(this.recensioni);
    updateInList(this.mieRecensioni);
    
    if (this.currentRecensione?.id === id) {
      this.currentRecensione = recensioneAggiornata;
    }
  }

  _removeRecensioneFromLists(id) {
    this.recensioni = this.recensioni.filter(r => r.id !== id);
    this.mieRecensioni = this.mieRecensioni.filter(r => r.id !== id);
    
    if (this.currentRecensione?.id === id) {
      this.currentRecensione = null;
    }
  }

  _cacheData(key, data) {
    try {
      const cacheData = {
        data: data,
        timestamp: Date.now()
      };
      sessionStorage.setItem(key, JSON.stringify(cacheData));
    } catch (e) {
      console.warn('Cache storage fallito:', e);
    }
  }

  _invalidateCache(keys) {
    keys.forEach(key => {
      try {
        sessionStorage.removeItem(key);
      } catch (e) {
        console.warn('Errore invalidazione cache:', e);
      }
    });
  }
}

export default new ReviewsStore(); 