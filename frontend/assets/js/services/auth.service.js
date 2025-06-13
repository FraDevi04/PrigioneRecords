/**
 * @fileoverview Service for authentication-related API calls.
 */
console.log('🔄 Caricamento auth.service.js...');
import ApiService, { apiService } from './api.service.js';
console.log('📥 Import completato in auth.service.js, apiService:', typeof apiService);

class AuthService {
    constructor() {
        console.log('🏗️ Costruendo istanza AuthService...');
        // Utilizziamo lazy loading per evitare problemi di ordine di caricamento
        this._api = null;
        console.log('✅ AuthService istanza creata');
    }

    // Getter per apiService con lazy loading
    get api() {
        console.log('🔍 Getter api chiamato, _api corrente:', this._api ? 'presente' : 'null');
        if (!this._api) {
            console.log('🔧 Inizializzando _api...');
            console.log('apiService disponibile:', typeof apiService);
            console.log('ApiService class disponibile:', typeof ApiService);
            this._api = apiService || new ApiService();
            console.log('✅ _api inizializzato:', this._api ? 'successo' : 'fallito');
        }
        return this._api;
    }

    async login(credentials) {
        console.log('🔐 Login chiamato con:', credentials);
        return this.api.post('/auth/login', credentials);
    }

    async register(userData) {
        console.log('📝 Register chiamato con:', userData);
        return this.api.post('/auth/register', userData);
    }

    // async refreshToken() {
    //     // Implementation for token refresh if backend supports it
    // }
}

console.log('📦 Export AuthService completato');
export default AuthService; 