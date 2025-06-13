/**
 * @fileoverview Dashboard page component. This page is protected.
 */

const DashboardPage = {
    render: () => {
        // const user = window.stores.auth.getState().user;
        // if (!user) return '<h1>Not authorized</h1>';

        return `
            <div class="container">
                <div class="dashboard-header">
                    <h1 class="dashboard-title">Dashboard</h1>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-label">Prenotazioni Attive</div>
                        <div class="stat-value">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Recensioni Scritte</div>
                        <div class="stat-value">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Studi Preferiti</div>
                        <div class="stat-value">0</div>
                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <div class="card">
                        <div class="card-header">
                            <h3>Prossime Prenotazioni</h3>
                        </div>
                        <div class="card-body">
                            <p class="text-gray-600">Nessuna prenotazione imminente.</p>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <h3>Attività Recente</h3>
                        </div>
                        <div class="card-body">
                            <p class="text-gray-600">Nessuna attività recente.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    afterRender: () => {
        console.log('Dashboard rendered. Fetching user data...');
        // Here we would fetch dashboard data from an API
    }
};

export default DashboardPage; 