/**
 * @fileoverview Service for studio-related API calls.
 */
import ApiService from './api.service.js';

class StudiosService extends ApiService {
    constructor() {
        super();
    }

    async getStudi() {
        return this.get('/studi');
    }

    async getStudio(id) {
        return this.get(`/studi/${id}`);
    }

    async checkAvailability(studioId, date) {
        return this.get(`/studi/${studioId}/disponibilita?data=${date}`);
    }

    // Admin-only methods
    async createStudio(data) {
        return this.post('/studi', data);
    }

    async updateStudio(id, data) {
        return this.put(`/studi/${id}`, data);
    }

    async deleteStudio(id) {
        return this.delete(`/studi/${id}`);
    }
}

export default StudiosService; 