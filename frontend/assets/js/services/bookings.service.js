/**
 * @fileoverview Service for booking-related API calls.
 */
import ApiService from './api.service.js';

class BookingsService extends ApiService {
    constructor() {
        super();
    }

    async getPrenotazioni() {
        return await this.get('/prenotazioni');
    }

    async getMiePrenotazioni() {
        return await this.get('/prenotazioni/mie');
    }
    
    async getPrenotazioniPerStudio(studioId) {
        return await this.get(`/prenotazioni/studio/${studioId}`);
    }

    async createPrenotazione(data) {
        return await this.post('/prenotazioni', data);
    }

    async deletePrenotazione(id) {
        return await this.delete(`/prenotazioni/${id}`);
    }
}

export default BookingsService; 