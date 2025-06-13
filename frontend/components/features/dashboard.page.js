export class DashboardPage {
    constructor() {
        this.dashboardData = {
            futureBookings: [],
            pastBookings: [],
            favoriteStudios: [],
            recentActivity: []
        };
    }

    async afterRender() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            await this.loadDashboardData();
        } catch (error) {
            console.error('Error in dashboard page:', error);
            this.showErrorMessage('Unable to load dashboard data. Please try again.');
        }
    }

    async loadDashboardData() {
        try {
            const [bookings, favorites] = await Promise.all([
                this.fetchUserBookings(),
                this.fetchFavoriteStudios()
            ]);

            // Sort bookings into future and past
            this.dashboardData.futureBookings = bookings.filter(booking => 
                new Date(booking.date) > new Date()
            );
            this.dashboardData.pastBookings = bookings.filter(booking => 
                new Date(booking.date) <= new Date()
            );
            this.dashboardData.favoriteStudios = favorites;

            this.renderDashboard();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            throw error;
        }
    }

    async fetchUserBookings() {
        const response = await fetch('/api/user/bookings');
        if (!response.ok) {
            throw new Error('Failed to fetch bookings');
        }
        return await response.json();
    }

    async fetchFavoriteStudios() {
        const response = await fetch('/api/user/favorites');
        if (!response.ok) {
            throw new Error('Failed to fetch favorite studios');
        }
        return await response.json();
    }

    renderDashboard() {
        this.renderBookings('future-bookings-list', this.dashboardData.futureBookings);
        this.renderBookings('past-bookings-list', this.dashboardData.pastBookings);
        this.renderFavorites('favorites-list', this.dashboardData.favoriteStudios);
    }

    renderBookings(containerId, bookings) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = bookings.map(booking => this.createBookingCard(booking)).join('');
    }

    renderFavorites(containerId, favorites) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = favorites.map(studio => this.createStudioCard(studio)).join('');
    }

    createBookingCard(booking) {
        return `
            <div class="booking-card">
                <h3>${booking.studioName}</h3>
                <p>Data: ${this.formatDate(booking.date)}</p>
                <p>Orario: ${booking.time}</p>
                <button onclick="window.location.href='/studio?id=${booking.studioId}'">
                    Vedi Dettagli
                </button>
            </div>
        `;
    }

    createStudioCard(studio) {
        return `
            <div class="studio-card">
                <h3>${studio.name}</h3>
                <p>${studio.address}</p>
                <button onclick="window.location.href='/studio?id=${studio.id}'">
                    Vedi Dettagli
                </button>
            </div>
        `;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    showErrorMessage(message) {
        const errorElement = document.querySelector('#error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
} 