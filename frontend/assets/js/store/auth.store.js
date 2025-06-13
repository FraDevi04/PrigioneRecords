/**
 * @fileoverview Authentication state management.
 */
import AuthService from '../services/auth.service.js';

class AuthStore {
    constructor() {
        this._user = JSON.parse(localStorage.getItem('prigione_user')) || null;
        this._token = localStorage.getItem('prigione_token') || null;
        this._isLoading = false;
        this._error = null;
        this.listeners = new Set();
        
        this.authService = null; // Lazy load
    }

    // Lazy load del servizio
    getAuthService() {
        if (!this.authService) {
            this.authService = new AuthService();
        }
        return this.authService;
    }

    // Subscribe to store changes
    subscribe(listener) {
        this.listeners.add(listener);
        // Return an unsubscribe function
        return () => this.listeners.delete(listener);
    }

    // Notify all subscribers
    notify() {
        this.listeners.forEach(listener => listener(this.getState()));
    }

    // Get the current state
    getState() {
        return {
            user: this._user,
            token: this._token,
            isLoading: this._isLoading,
            error: this._error,
            isAuthenticated: !!this._token,
            isAdmin: this._user?.role === 'ADMIN' // Assuming role is in user object
        };
    }

    // --- Actions ---

    async login(credentials) {
        this._isLoading = true;
        this._error = null;
        this.notify();

        try {
            const authResponse = await this.getAuthService().login(credentials);
            this._token = authResponse.accessToken;
            this._user = {
                id: authResponse.id,
                nome: authResponse.nome,
                email: authResponse.email
                // TODO: Add role from backend response
            };

            localStorage.setItem('prigione_token', this._token);
            localStorage.setItem('prigione_user', JSON.stringify(this._user));
            
            return this.getState();
        } catch (error) {
            this._error = error.message;
            throw error;
        } finally {
            this._isLoading = false;
            this.notify();
        }
    }

    async register(userData) {
        this._isLoading = true;
        this._error = null;
        this.notify();

        try {
            const authResponse = await this.getAuthService().register(userData);
            this._token = authResponse.accessToken;
            this._user = {
                id: authResponse.id,
                nome: authResponse.nome,
                email: authResponse.email
            };

            localStorage.setItem('prigione_token', this._token);
            localStorage.setItem('prigione_user', JSON.stringify(this._user));

            return this.getState();
        } catch (error) {
            this._error = error.message;
            throw error;
        } finally {
            this._isLoading = false;
            this.notify();
        }
    }

    logout() {
        this._user = null;
        this._token = null;
        this._error = null;
        localStorage.removeItem('prigione_user');
        localStorage.removeItem('prigione_token');
        this.notify();
        
        // Navigate to login page after logout
        window.router?.navigate('/login');
    }

    // Verifica se l'utente è admin
    isAdmin() {
        return this._user?.role === 'ADMIN';
    }
}

// Create a single instance of the store
const authStore = new AuthStore();

export default authStore; 