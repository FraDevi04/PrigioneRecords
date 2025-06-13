export class BookingSystem {
    constructor() {
        this.studioId = null;
        this.selectedDate = null;
        this.selectedTime = null;
    }

    async initialize(studioId) {
        this.studioId = studioId;
        await this.loadAvailableSlots();
    }

    async loadAvailableSlots() {
        try {
            const response = await fetch(`/api/studios/${this.studioId}/availability`);
            if (!response.ok) {
                throw new Error('Failed to fetch available slots');
            }
            const slots = await response.json();
            this.renderAvailableSlots(slots);
        } catch (error) {
            console.error('Error loading available slots:', error);
            this.showErrorMessage('Unable to load available slots. Please try again.');
        }
    }

    async checkBookingAvailability(date, time) {
        try {
            const response = await fetch(`/api/studios/${this.studioId}/check-availability`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ date, time })
            });

            if (!response.ok) {
                throw new Error('Failed to check availability');
            }

            const result = await response.json();
            return result.available;
        } catch (error) {
            console.error('Error checking availability:', error);
            throw error;
        }
    }

    async createBooking(bookingData) {
        try {
            // First check availability
            const isAvailable = await this.checkBookingAvailability(
                bookingData.date,
                bookingData.time
            );

            if (!isAvailable) {
                throw new Error('Studio già prenotato per questa data e ora');
            }

            // Proceed with booking creation
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    studioId: this.studioId,
                    date: bookingData.date,
                    time: bookingData.time,
                    studioName: bookingData.studioName
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create booking');
            }

            const booking = await response.json();
            this.showSuccessMessage('Prenotazione creata con successo!');
            return booking;
        } catch (error) {
            console.error('Error creating booking:', error);
            this.showErrorMessage(error.message || 'Unable to create booking. Please try again.');
            throw error;
        }
    }

    renderAvailableSlots(slots) {
        const container = document.getElementById('available-slots');
        if (!container) return;

        container.innerHTML = slots.map(slot => this.createSlotElement(slot)).join('');
    }

    createSlotElement(slot) {
        const isAvailable = slot.available;
        return `
            <div class="time-slot ${isAvailable ? 'available' : 'unavailable'}">
                <span class="time">${slot.time}</span>
                ${isAvailable ? 
                    `<button onclick="bookingSystem.selectTimeSlot('${slot.time}')">
                        Seleziona
                    </button>` :
                    '<span class="unavailable-text">Non disponibile</span>'
                }
            </div>
        `;
    }

    selectTimeSlot(time) {
        this.selectedTime = time;
        this.updateBookingForm();
    }

    updateBookingForm() {
        const form = document.getElementById('booking-form');
        if (!form) return;

        const timeInput = form.querySelector('#booking-time');
        if (timeInput) {
            timeInput.value = this.selectedTime;
        }
    }

    showSuccessMessage(message) {
        const messageElement = document.getElementById('success-message');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.style.display = 'block';
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 3000);
        }
    }

    showErrorMessage(message) {
        const errorElement = document.getElementById('error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
} 