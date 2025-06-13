/**
 * @fileoverview State management for bookings.
 */
import BookingsService from '../services/bookings.service.js';

class BookingsStore {
    constructor() {
        this.bookingsService = null; // Lazy load
        this._bookings = [];
        this._isLoading = false;
        this._error = null;
        this.listeners = new Set();
    }

    // Lazy load del servizio
    getBookingsService() {
        if (!this.bookingsService) {
            this.bookingsService = new BookingsService();
        }
        return this.bookingsService;
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
            bookings: this._bookings,
            isLoading: this._isLoading,
            error: this._error,
        };
    }

    async fetchMiePrenotazioni() {
        this._isLoading = true;
        this._error = null;
        this.notify();

        try {
            const bookings = await this.getBookingsService().getMiePrenotazioni();
            this._bookings = bookings;
            return this._bookings;
        } catch (error) {
            this._error = error.message;
            throw error;
        } finally {
            this._isLoading = false;
            this.notify();
        }
    }

    async createPrenotazione(data) {
        this._isLoading = true;
        this._error = null;
        this.notify();

        try {
            const newBooking = await this.getBookingsService().createPrenotazione(data);
            this._bookings.push(newBooking);
            return newBooking;
        } catch (error) {
            this._error = error.message;
            throw error;
        } finally {
            this._isLoading = false;
            this.notify();
        }
    }
}

const bookingsStore = new BookingsStore();
export default bookingsStore; 