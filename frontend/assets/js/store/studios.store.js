/**
 * @fileoverview State management for studios.
 */
import StudiosService from '../services/studios.service.js';

class StudiosStore {
    constructor() {
        this.studiosService = null; // Lazy load
        this._studi = [];
        this._currentStudio = null;
        this._isLoading = false;
        this._error = null;
        this.listeners = new Set();
    }

    // Lazy load del servizio
    getStudiosService() {
        if (!this.studiosService) {
            this.studiosService = new StudiosService();
        }
        return this.studiosService;
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener(this.getState()));
    }

    getState() {
        return {
            studi: this._studi,
            currentStudio: this._currentStudio,
            isLoading: this._isLoading,
            error: this._error,
        };
    }

    async fetchStudi() {
        this._isLoading = true;
        this._error = null;
        this.notify();

        try {
            const studi = await this.getStudiosService().getStudi();
            this._studi = studi;
            return this._studi;
        } catch (error) {
            this._error = error.message;
            throw error;
        } finally {
            this._isLoading = false;
            this.notify();
        }
    }

    async fetchStudio(id) {
        this._isLoading = true;
        this._currentStudio = null;
        this._error = null;
        this.notify();

        try {
            const studio = await this.getStudiosService().getStudio(id);
            this._currentStudio = studio;
            return this._currentStudio;
        } catch (error) {
            this._error = error.message;
            throw error;
        } finally {
            this._isLoading = false;
            this.notify();
        }
    }
}

const studiosStore = new StudiosStore();
export default studiosStore; 