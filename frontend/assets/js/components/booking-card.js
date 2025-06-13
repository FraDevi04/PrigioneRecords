/**
 * @fileoverview Component to render a single booking card.
 */

export function renderBookingCard(booking) {
    // A simple date formatter. In a real app, use a robust library like date-fns.
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('it-IT', options);
    };

    return `
        <div class="booking-card" data-booking-id="${booking.id}">
            <div class="booking-card-header">
                <h3 class="booking-studio-name">${booking.nomeStudio || 'Nome Studio'}</h3>
                <span class="booking-date">Data: ${formatDate(booking.data)}</span>
            </div>
            <div class="booking-card-body">
                <p class="booking-notes">
                    <strong>Note:</strong> ${booking.note || 'Nessuna nota.'}
                </p>
            </div>
            <div class="booking-card-actions">
                <button class="btn btn-danger btn-sm" data-action="delete" data-id="${booking.id}">Cancella</button>
            </div>
        </div>
    `;
} 