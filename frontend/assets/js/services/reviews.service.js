import ApiService from './api.service.js';

/**
 * Servizio per la gestione delle recensioni
 */
class ReviewsService extends ApiService {
  
  /**
   * Ottiene tutte le recensioni
   * @returns {Promise<Array>} Lista delle recensioni
   */
  async getRecensioni() {
    return await this.get('/recensioni');
  }

  /**
   * Ottiene le recensioni dell'utente corrente
   * @returns {Promise<Array>} Lista delle recensioni dell'utente
   */
  async getMieRecensioni() {
    return await this.get('/recensioni/mie');
  }

  /**
   * Ottiene le recensioni per uno studio specifico
   * @param {string} studioId - ID dello studio
   * @returns {Promise<Array>} Lista delle recensioni dello studio
   */
  async getRecensioniStudio(studioId) {
    return await this.get(`/recensioni/studio/${studioId}`);
  }

  /**
   * Crea una nuova recensione
   * @param {Object} recensioneData - Dati della recensione
   * @param {string} recensioneData.studioId - ID dello studio
   * @param {number} recensioneData.valutazione - Valutazione da 1 a 5
   * @param {string} recensioneData.commento - Commento opzionale
   * @returns {Promise<Object>} Recensione creata
   */
  async createRecensione(recensioneData) {
    return await this.post('/recensioni', recensioneData);
  }

  /**
   * Aggiorna una recensione esistente
   * @param {string} id - ID della recensione
   * @param {Object} recensioneData - Nuovi dati della recensione
   * @returns {Promise<Object>} Recensione aggiornata
   */
  async updateRecensione(id, recensioneData) {
    return await this.put(`/recensioni/${id}`, recensioneData);
  }

  /**
   * Elimina una recensione
   * @param {string} id - ID della recensione
   * @returns {Promise<void>}
   */
  async deleteRecensione(id) {
    return await this.delete(`/recensioni/${id}`);
  }

  /**
   * Ottiene le statistiche delle recensioni per uno studio
   * @param {string} studioId - ID dello studio
   * @returns {Promise<Object>} Statistiche recensioni
   */
  async getStatisticheRecensioni(studioId) {
    return await this.get(`/recensioni/studio/${studioId}/statistiche`);
  }
}

export default ReviewsService; 