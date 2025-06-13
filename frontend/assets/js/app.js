/**
 * @fileoverview Main application entry point.
 * Initializes the router, stores, and global components.
 */
import Router from './router.js';
import routes from './routes.config.js';
import authStore from './store/auth.store.js';
import studiosStore from './store/studios.store.js';
import bookingsStore from './store/bookings.store.js';
import reviewsStore from './store/reviews.store.js';

class PrigioneRecordsApp {
    constructor() {
        this.router = null;
        this.stores = {
            auth: authStore,
            studios: studiosStore,
            bookings: bookingsStore,
            reviews: reviewsStore,
        };
    }

    async init() {
        try {
            console.log('🚀 Initializing PrigioneRecords App...');
            console.log('📊 Debug: Start time:', new Date().toISOString());
            
            // Debug: Verifica elementi DOM essenziali
            console.log('🔍 Checking DOM elements...');
            const mainContent = document.getElementById('main-content');
            const userMenu = document.getElementById('user-menu');
            const navMenu = document.getElementById('nav-menu');
            const loadingScreen = document.getElementById('loading-screen');
            
            console.log('📋 DOM elements check:', {
                mainContent: !!mainContent,
                userMenu: !!userMenu,
                navMenu: !!navMenu,
                loadingScreen: !!loadingScreen
            });

            // Debug: Verifica stores
            console.log('🏪 Checking stores...');
            console.log('📊 Stores available:', Object.keys(this.stores));
            
            // NUOVO: Verifica connettività backend
            console.log('🏥 Checking backend connectivity...');
            
            // Wait a bit for modules to fully load, then check for apiService
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const apiService = window.apiService;
            if (apiService && typeof apiService.waitForBackend === 'function') {
                console.log('✅ ApiService found, checking backend...');
                const backendAvailable = await apiService.waitForBackend(5, 3000);
                if (!backendAvailable) {
                    console.warn('⚠️ Backend not available, some features may not work');
                    this.showBackendUnavailableBanner();
                } else {
                    console.log('✅ Backend is available');
                    this.hideBackendUnavailableBanner();
                }
            } else {
                console.warn('⚠️ ApiService not available on window, skipping backend check');
                console.log('🔍 Available on window:', Object.keys(window).filter(k => k.includes('api') || k.includes('Api')));
                // Don't show banner if apiService isn't available yet - it might load later
            }
            
            // Expose stores and router globally for easy access
            console.log('🌐 Exposing stores globally...');
            window.stores = this.stores;
            
            console.log('🚦 Creating router...');
            this.router = new Router(routes);
            window.router = this.router;
            console.log('✅ Router created successfully');
            console.log('📋 Router instance:', this.router);
            console.log('📋 Router on window:', window.router);
            console.log('📋 Available routes:', Object.keys(routes));

            // Setup global UI components
            console.log('🎨 Setting up header...');
            this.setupHeader();
            console.log('✅ Header setup completed');
            
            // Listen to auth changes to update UI
            console.log('👂 Setting up auth listeners...');
            this.stores.auth.subscribe(this.onAuthStateChange.bind(this));
            console.log('✅ Auth listeners setup completed');

            // Initial check of auth state to set correct header
            console.log('🔐 Getting initial auth state...');
            const authState = this.stores.auth.getState();
            console.log('📊 Initial auth state:', authState);
            
            console.log('🎨 Applying initial auth state to UI...');
            this.onAuthStateChange(authState);
            console.log('✅ Initial auth state applied');

            console.log('⏱️ Setting up loading screen timeout...');
            // Timeout di sicurezza per nascondere la schermata di loading
            this.loadingTimeout = setTimeout(() => {
                console.log('⚠️ Loading timeout reached, forcing hide loading screen');
                this.hideLoadingScreen();
            }, 3000);

            console.log('✅ PrigioneRecords App initialized successfully');
            console.log('📊 Debug: End time:', new Date().toISOString());
            
            // Nascondi la schermata di loading
            console.log('🎭 Hiding loading screen...');
            this.hideLoadingScreen();
        } catch (error) {
            console.error('❌ Error initializing app:', error);
            // Nascondi la schermata di loading anche in caso di errore
            this.hideLoadingScreen();
            
            document.getElementById('main-content').innerHTML = `
                <div class="error-container">
                    <h1>Errore di inizializzazione</h1>
                    <p>Si è verificato un errore durante il caricamento dell'applicazione.</p>
                    <p>Dettagli: ${error.message}</p>
                    <button onclick="location.reload()">Ricarica pagina</button>
                </div>
            `;
        }
    }

    setupHeader() {
        console.log('🎨 setupHeader started');
        
        // This could be a more complex component in a real app
        this.userMenu = document.getElementById('user-menu');
        this.navMenu = document.getElementById('nav-menu');
        
        console.log('📋 Header elements:', {
            userMenu: !!this.userMenu,
            navMenu: !!this.navMenu
        });

        if (this.userMenu) {
            // Add event listener for logout
            this.userMenu.addEventListener('click', e => {
                console.log('👆 User menu clicked:', e.target.id);
                if (e.target.id === 'logout-btn') {
                    console.log('🚪 Logout button clicked');
                    this.stores.auth.logout();
                }
            });
            console.log('✅ User menu event listener added');
        } else {
            console.error('❌ User menu element not found!');
        }
        
        console.log('✅ setupHeader completed');
    }

    hideLoadingScreen() {
        console.log('🎭 hideLoadingScreen called');
        const loadingScreen = document.getElementById('loading-screen');
        
        if (loadingScreen) {
            console.log('✅ Loading screen element found:', loadingScreen);
            console.log('📊 Current classes:', loadingScreen.className);
            console.log('📊 Current display:', loadingScreen.style.display);
            
            // Add hidden class for transition
            loadingScreen.classList.add('hidden');
            console.log('✅ Added "hidden" class');
            
            // Remove the element after transition
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                loadingScreen.style.visibility = 'hidden';
                loadingScreen.style.opacity = '0';
                console.log('✅ Loading screen hidden completely');
            }, 300);
            
            // Clear safety timeout if exists
            if (this.loadingTimeout) {
                clearTimeout(this.loadingTimeout);
                console.log('⏱️ Safety timeout cleared');
            }
        } else {
            console.error('❌ Loading screen element not found!');
        }
    }

    onAuthStateChange(authState) {
        console.log('🔐 onAuthStateChange called with:', authState);
        
        if (!this.userMenu || !this.navMenu) {
            console.error('❌ Missing menu elements:', {
                userMenu: !!this.userMenu,
                navMenu: !!this.navMenu
            });
            return;
        }
        
        console.log('📋 Menu elements available, proceeding with UI update');

        if (authState.isAuthenticated) {
            console.log('👤 Updating UI for authenticated user:', authState.user?.nome);
            
            // Update user menu for logged-in user
            this.userMenu.innerHTML = `
                <div class="user-avatar" id="user-avatar-btn">
                    ${authState.user?.nome?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div class="user-dropdown" id="user-dropdown">
                    <a href="#/profilo" class="user-dropdown-item">Profilo</a>
                    <a href="#/prenotazioni" class="user-dropdown-item">Le mie prenotazioni</a>
                    <button id="logout-btn" class="user-dropdown-item">Logout</button>
                </div>
            `;
            console.log('✅ User menu updated for authenticated user');
            
            // Update nav menu for logged-in user
            this.navMenu.innerHTML = `
                <li><a href="#/dashboard" class="nav-link">Dashboard</a></li>
                <li><a href="#/studi" class="nav-link">Studi</a></li>
            `;
            console.log('✅ Nav menu updated for authenticated user');

            const avatarBtn = this.userMenu.querySelector('#user-avatar-btn');
            const dropdown = this.userMenu.querySelector('#user-dropdown');
            avatarBtn?.addEventListener('click', () => dropdown?.classList.toggle('active'));
            console.log('✅ Avatar dropdown event listener added');

        } else {
            console.log('👤 Updating UI for guest user');
            
            // Update user menu for guest
            this.userMenu.innerHTML = `
                <a href="#/login" class="btn btn-outline btn-sm">Login</a>
                <a href="#/register" class="btn btn-primary btn-sm">Registrati</a>
            `;
            console.log('✅ User menu updated for guest');
            
            // Update nav menu for guest
            this.navMenu.innerHTML = `
                <li><a href="#/" class="nav-link">Home</a></li>
                <li><a href="#/studi" class="nav-link">Studi</a></li>
            `;
            console.log('✅ Nav menu updated for guest');
        }
        
        console.log('✅ onAuthStateChange completed');
    }

    showBackendUnavailableBanner() {
        console.log('🚨 Showing backend unavailable banner');
        const banner = document.getElementById('backend-status-banner');
        if (banner) {
            banner.classList.remove('hidden');
            document.body.classList.remove('banner-hidden');
            
            // Aggiungi listener per il pulsante retry
            const retryBtn = document.getElementById('retry-backend');
            if (retryBtn && !retryBtn.hasAttribute('data-listener-added')) {
                retryBtn.setAttribute('data-listener-added', 'true');
                retryBtn.addEventListener('click', async () => {
                    console.log('🔄 Retrying backend connection...');
                    const apiService = window.apiService;
                    if (apiService) {
                        const isAvailable = await apiService.healthCheck();
                        if (isAvailable) {
                            this.hideBackendUnavailableBanner();
                            // Ricarica la pagina per reinizializzare tutto
                            window.location.reload();
                        } else {
                            console.log('❌ Backend still not available');
                            // Puoi aggiungere un toast di errore qui
                        }
                    }
                });
            }
        }
    }

    hideBackendUnavailableBanner() {
        console.log('✅ Hiding backend unavailable banner');
        const banner = document.getElementById('backend-status-banner');
        if (banner) {
            banner.classList.add('hidden');
            document.body.classList.add('banner-hidden');
        }
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 DOMContentLoaded event fired');
    console.log('📊 Document ready state:', document.readyState);
    
    try {
        console.log('🏗️ Creating PrigioneRecordsApp instance...');
        const app = new PrigioneRecordsApp();
        
        console.log('🚀 Starting app initialization...');
        await app.init();
        
        console.log('🌐 Setting window.app...');
        window.app = app;
        
        console.log('🎉 App startup completed successfully!');
    } catch (error) {
        console.error('❌ Critical error during app startup:', error);
        console.error('📊 Error stack:', error.stack);
        
        // Forza la rimozione della schermata di loading anche in caso di errore critico
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            console.log('🆘 Loading screen force hidden due to critical error');
        }
    }
});

export default PrigioneRecordsApp; 