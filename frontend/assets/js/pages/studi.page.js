/**
 * @fileoverview Studios list page component.
 */
import studiosStore from '../store/studios.store.js';
import { renderStudioCard } from '../components/studio-card.js';

const StudiPage = {
    render: () => {
        return `
            <div class="container">
                <div class="studios-header">
                    <h1>Studi di Registrazione</h1>
                    <div class="studios-filters">
                        <div class="search-bar">
                            <input type="text" id="search-input" class="search-input" placeholder="Cerca studi...">
                            <button class="search-btn" id="search-btn">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="studios-grid" id="studios-grid">
                    <div class="loading-container">
                        <div class="loading-spinner"></div>
                    </div>
                </div>
            </div>
        `;
    },
    afterRender: async () => {
        const grid = document.getElementById('studios-grid');
        
        try {
            console.log('🏢 Loading studios...');
            const studios = await studiosStore.fetchStudi();
            console.log('✅ Studios loaded:', studios);
            
            if (studios && studios.length > 0) {
                grid.innerHTML = studios.map(studio => renderStudioCard(studio)).join('');
            } else {
                grid.innerHTML = '<p>Nessun studio trovato.</p>';
            }
        } catch (error) {
            console.error('Failed to load studios:', error);
            grid.innerHTML = `<p class="error-message">Errore nel caricamento degli studi: ${error.message}</p>`;
        }

        // Add event listeners only if elements exist
        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('search-input');
        
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => {
                // TODO: Implement search functionality
                console.log('Searching for:', searchInput.value);
            });
        } else {
            console.warn('⚠️ Search elements not found in DOM');
        }
    }
};

export default StudiPage; 