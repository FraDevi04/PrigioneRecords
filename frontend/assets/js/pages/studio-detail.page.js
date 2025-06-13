/**
 * @fileoverview Studio detail page component.
 */
import studiosStore from '../store/studios.store.js';

const StudioDetailPage = {
    render: async (params) => {
        if (!params || !params.id) {
            return '<h1>Studio non trovato</h1>';
        }
        
        return `
            <div class="container">
                <div id="studio-detail-container">
                    <div class="loading-container">
                        <div class="loading-spinner"></div>
                    </div>
                </div>
            </div>
        `;
    },
    afterRender: async (params) => {
        console.log('🎨 StudioDetailPage afterRender started');
        const container = document.getElementById('studio-detail-container');
        
        if (!container) {
            console.error('❌ Container element not found');
            // Create a new container if it doesn't exist
            const newContainer = document.createElement('div');
            newContainer.id = 'studio-detail-container';
            document.querySelector('.container').appendChild(newContainer);
            return this.afterRender(params); // Retry with the new container
        }

        try {
            const studio = await studiosStore.fetchStudio(params.id);
            if (studio) {
                console.log('📋 Studio found:', studio);
                container.innerHTML = `
                    <div class="studio-detail-header">
                        <h1>${studio.nome}</h1>
                        <p>${studio.indirizzo}</p>
                    </div>
                    <div class="studio-detail-content">
                        <div class="studio-detail-image">
                            <img src="${studio.imageUrl || 'https://placehold.co/800x400/e2e8f0/1e293b?text=Studio+Image'}" alt="${studio.nome}">
                        </div>
                        <div class="studio-detail-info">
                            <h2>Dettagli</h2>
                            <p>Qui andranno i dettagli dello studio.</p>
                            <h2>Recensioni</h2>
                            <p>Qui andranno le recensioni.</p>
                            <button class="btn btn-primary" id="prenota-btn">Prenota Ora</button>
                        </div>
                    </div>
                `;

                // Add click event handler to the booking button
                const prenotaBtn = document.getElementById('prenota-btn');
                if (prenotaBtn) {
                    console.log('🔍 Found prenota-btn, adding click handler');
                    prenotaBtn.addEventListener('click', () => {
                        console.log('👆 Prenota button clicked');
                        console.log('📋 Studio ID:', studio.id);
                        console.log('🔑 Auth state:', window.stores?.auth?.getState());
                        console.log('🚦 Router state:', {
                            router: !!window.router,
                            currentPath: window.location.hash,
                            targetPath: `/prenotazioni/nuova?studioId=${studio.id}`
                        });
                        
                        if (!window.router) {
                            console.error('❌ Router not available');
                            alert('Errore di navigazione. Ricarica la pagina e riprova.');
                            return;
                        }
                        
                        try {
                            const targetPath = `/prenotazioni/nuova?studioId=${studio.id}`;
                            console.log('🎯 Navigating to:', targetPath);
                            window.router.navigate(targetPath);
                        } catch (error) {
                            console.error('❌ Navigation error:', error);
                            // Fallback to hash-based navigation if router fails
                            const fallbackPath = `#/prenotazioni/nuova?studioId=${studio.id}`;
                            console.log('🔄 Using fallback navigation:', fallbackPath);
                            window.location.hash = fallbackPath;
                        }
                    });
                    console.log('✅ Click handler added successfully');
                } else {
                    console.error('❌ prenota-btn not found in DOM');
                }
            } else {
                container.innerHTML = `
                    <div class="error-container">
                        <h1>Studio non trovato</h1>
                        <p>Lo studio richiesto non esiste o non è più disponibile.</p>
                        <a href="#/studi" class="btn btn-primary">Torna agli Studi</a>
                    </div>
                `;
            }
        } catch (error) {
            console.error('❌ Error loading studio details:', error);
            container.innerHTML = `
                <div class="error-container">
                    <h1>Errore di caricamento</h1>
                    <p>Si è verificato un errore durante il caricamento dei dettagli dello studio.</p>
                    <button class="btn btn-primary" onclick="window.location.reload()">Ricarica Pagina</button>
                </div>
            `;
        }
    }
};

export default StudioDetailPage; 