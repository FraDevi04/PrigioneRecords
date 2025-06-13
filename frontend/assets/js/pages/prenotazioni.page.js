/**
 * @fileoverview Page for listing a user's bookings.
 */
import bookingsStore from '../store/bookings.store.js';
import { renderBookingCard } from '../components/booking-card.js';

const PrenotazioniPage = {
    render: () => {
        return `
            <div class="container">
                <div class="page-header">
                    <h1>Le Mie Prenotazioni</h1>
                    <a href="#/prenotazioni/nuova" class="btn btn-primary">Nuova Prenotazione</a>
                </div>
                <div id="bookings-list" class="bookings-list">
                    <div class="loading-container">
                        <div class="loading-spinner"></div>
                    </div>
                </div>
            </div>
        `;
    },
    afterRender: async () => {
        const listContainer = document.getElementById('bookings-list');
        
        try {
            const bookings = await bookingsStore.fetchMiePrenotazioni();
            if (bookings && bookings.length > 0) {
                // TODO: The backend response needs to include studio names for this to work.
                // Assuming the store/service will be updated to fetch this data.
                listContainer.innerHTML = bookings.map(b => renderBookingCard(b)).join('');
            } else {
                listContainer.innerHTML = '<p>Non hai nessuna prenotazione al momento.</p>';
            }
        } catch (error) {
            console.error('Failed to load bookings:', error);
            listContainer.innerHTML = `<p class="error-message">Errore nel caricamento delle prenotazioni: ${error.message}</p>`;
        }
    }
};

export default PrenotazioniPage; 