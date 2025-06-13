/**
 * @fileoverview Page for creating a new booking (wizard).
 */
import studiosStore from '../store/studios.store.js';
import bookingsStore from '../store/bookings.store.js';
import authStore from '../store/auth.store.js';

const NuovaPrenotazionePage = {
    state: {
        step: 1,
        selectedStudio: null,
        selectedDate: null,
        notes: ''
    },

    render: () => {
        return `
            <div class="container">
                <div class="page-header">
                    <h1>Nuova Prenotazione</h1>
                </div>
                <div id="booking-wizard">
                    <!-- Wizard content will be rendered here -->
                </div>
            </div>
        `;
    },

    afterRender: async (params) => {
        console.log('🎨 NuovaPrenotazionePage afterRender started');
        console.log('📋 Route params:', params);
        
        // Check authentication first
        const authState = authStore.getState();
        console.log('🔐 Auth state:', authState);
        
        if (!authState.isAuthenticated) {
            console.log('❌ User not authenticated, redirecting to login');
            // Save the current URL to redirect back after login
            localStorage.setItem('redirectAfterLogin', window.location.hash);
            window.router.navigate('/login');
            return;
        }
        
        console.log('✅ User authenticated, proceeding with booking wizard');
        
        // Check if we have a studioId in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const studioId = urlParams.get('studioId');
        console.log('🔍 Studio ID from URL:', studioId);
        
        if (studioId) {
            try {
                console.log('📡 Fetching studio details...');
                // If we have a studioId, fetch that studio and go directly to step 2
                const studio = await studiosStore.fetchStudio(studioId);
                console.log('✅ Studio fetched:', studio);
                
                if (studio) {
                    NuovaPrenotazionePage.state.selectedStudio = studio;
                    NuovaPrenotazionePage.renderStep2();
                } else {
                    console.warn('⚠️ Studio not found, showing studio selection');
                    NuovaPrenotazionePage.renderStep1();
                }
            } catch (error) {
                console.error('❌ Error fetching studio:', error);
                NuovaPrenotazionePage.renderStep1();
            }
        } else {
            console.log('ℹ️ No studio ID provided, showing studio selection');
            NuovaPrenotazionePage.renderStep1();
        }
    },

    renderStep1: async () => {
        console.log('🎨 Rendering Step 1: Studio Selection');
        const wizardContainer = document.getElementById('booking-wizard');
        wizardContainer.innerHTML = `
            <h2>Step 1: Seleziona uno studio</h2>
            <div id="studio-selection-list">
                <div class="loading-container"><div class="loading-spinner"></div></div>
            </div>
        `;
        
        try {
            console.log('📡 Fetching studios list...');
            const studios = await studiosStore.fetchStudi();
            console.log('✅ Studios fetched:', studios.length);
            
            const studioListContainer = document.getElementById('studio-selection-list');
            if(studios && studios.length > 0) {
                studioListContainer.innerHTML = studios.map(studio => `
                    <div class="studio-selection-item" data-studio-id="${studio.id}">
                        <h3>${studio.nome}</h3>
                        <p>${studio.indirizzo}</p>
                        <button class="btn btn-primary btn-sm">Seleziona</button>
                    </div>
                `).join('');
                
                document.querySelectorAll('.studio-selection-item button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const studioId = e.target.closest('.studio-selection-item').dataset.studioId;
                        console.log('👆 Studio selected:', studioId);
                        NuovaPrenotazionePage.state.selectedStudio = studios.find(s => s.id === studioId);
                        NuovaPrenotazionePage.renderStep2();
                    });
                });
            } else {
                studioListContainer.innerHTML = `<p>Nessun studio disponibile.</p>`;
            }
        } catch (error) {
            console.error('❌ Error loading studios:', error);
            wizardContainer.innerHTML = `<p class="error-message">Errore nel caricamento degli studi.</p>`;
        }
    },

    renderStep2: () => {
        console.log('🎨 Rendering Step 2: Date Selection');
        const wizardContainer = document.getElementById('booking-wizard');
        wizardContainer.innerHTML = `
            <h2>Step 2: Seleziona una data per ${NuovaPrenotazionePage.state.selectedStudio.nome}</h2>
            <input type="date" id="booking-date" min="${new Date().toISOString().split('T')[0]}">
            <button id="next-step-btn" class="btn btn-primary">Avanti</button>
        `;
        
        document.getElementById('next-step-btn').addEventListener('click', () => {
            const selectedDate = document.getElementById('booking-date').value;
            console.log('📅 Selected date:', selectedDate);
            
            if (selectedDate) {
                NuovaPrenotazionePage.state.selectedDate = selectedDate;
                NuovaPrenotazionePage.renderStep3();
            } else {
                alert('Per favore, seleziona una data.');
            }
        });
    },
    
    renderStep3: () => {
        console.log('🎨 Rendering Step 3: Confirmation');
        const wizardContainer = document.getElementById('booking-wizard');
        wizardContainer.innerHTML = `
             <h2>Step 3: Note aggiuntive e conferma</h2>
             <textarea id="booking-notes" placeholder="Aggiungi note per lo studio..." rows="4"></textarea>
             <h3>Riepilogo</h3>
             <p><strong>Studio:</strong> ${NuovaPrenotazionePage.state.selectedStudio.nome}</p>
             <p><strong>Data:</strong> ${NuovaPrenotazionePage.state.selectedDate}</p>
             <button id="confirm-booking-btn" class="btn btn-primary">Conferma Prenotazione</button>
        `;
        
        document.getElementById('confirm-booking-btn').addEventListener('click', async () => {
            console.log('👆 Confirm booking clicked');
            
            // Double-check authentication before proceeding
            const authState = authStore.getState();
            if (!authState.isAuthenticated) {
                console.log('❌ User no longer authenticated');
                alert('Sessione scaduta. Effettua di nuovo il login.');
                localStorage.setItem('redirectAfterLogin', window.location.hash);
                window.router.navigate('/login');
                return;
            }
            
            NuovaPrenotazionePage.state.notes = document.getElementById('booking-notes').value;
            
            const bookingData = {
                studioId: NuovaPrenotazionePage.state.selectedStudio.id,
                data: NuovaPrenotazionePage.state.selectedDate,
                note: NuovaPrenotazionePage.state.notes
            };
            
            console.log('📦 Booking data:', bookingData);
            console.log('🔑 Current auth token:', authState.token ? 'Present' : 'Missing');

            try {
                console.log('📡 Creating booking...');
                await bookingsStore.createPrenotazione(bookingData);
                console.log('✅ Booking created successfully');
                alert('Prenotazione creata con successo!');
                window.router.navigate('/prenotazioni');
            } catch(error) {
                console.error('❌ Error creating booking:', error);
                
                if (error.status === 403 || error.status === 401) {
                    alert('Sessione scaduta o non autorizzata. Effettua di nuovo il login.');
                    localStorage.setItem('redirectAfterLogin', window.location.hash);
                    window.router.navigate('/login');
                } else {
                    alert('Errore nella creazione della prenotazione: ' + error.message);
                }
            }
        });
    }
};

export default NuovaPrenotazionePage; 