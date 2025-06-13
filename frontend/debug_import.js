// Test per verificare il problema di import

console.log('🔍 Inizio test import...');

// Test 1: Import api.service.js
try {
    console.log('📦 Importando api.service.js...');
    const apiModule = await import('./assets/js/services/api.service.js');
    console.log('✅ api.service.js importato con successo');
    console.log('Default export (ApiService):', typeof apiModule.default);
    console.log('Named export (apiService):', typeof apiModule.apiService);
    console.log('Named export (ApiError):', typeof apiModule.ApiError);
    
    // Test istanziazione apiService
    if (apiModule.apiService) {
        console.log('✅ apiService istanza disponibile');
        console.log('baseURL:', apiModule.apiService.baseURL);
    } else {
        console.log('❌ apiService istanza NON disponibile');
    }
    
} catch (error) {
    console.error('❌ Errore import api.service.js:', error);
}

// Test 2: Import auth.service.js
try {
    console.log('\n📦 Importando auth.service.js...');
    const authModule = await import('./assets/js/services/auth.service.js');
    console.log('✅ auth.service.js importato con successo');
    console.log('Default export (AuthService):', typeof authModule.default);
    
    // Test istanziazione AuthService
    const authService = new authModule.default();
    console.log('✅ AuthService istanziato');
    
    // Test accesso all'API
    console.log('Test getter api...');
    const api = authService.api;
    console.log('✅ Getter api funziona:', typeof api);
    console.log('API baseURL:', api.baseURL);
    
} catch (error) {
    console.error('❌ Errore import auth.service.js:', error);
    console.error('Stack trace:', error.stack);
}

// Test 3: Import auth.store.js (quello che fa l'import reale)
try {
    console.log('\n📦 Importando auth.store.js...');
    const storeModule = await import('./assets/js/store/auth.store.js');
    console.log('✅ auth.store.js importato con successo');
    console.log('Default export (authStore):', typeof storeModule.default);
    
} catch (error) {
    console.error('❌ Errore import auth.store.js:', error);
    console.error('Stack trace:', error.stack);
}

console.log('\n�� Test completato'); 