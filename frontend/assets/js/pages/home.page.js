/**
 * @fileoverview Home page component
 */

const HomePage = {
    render: () => {
        return `
            <div class="hero-section">
              <div class="container">
                <div class="hero-content text-center">
                  <h1 class="hero-title">Benvenuto in PrigioneRecords</h1>
                  <p class="hero-subtitle">La piattaforma per gestire studi di registrazione, prenotazioni e recensioni</p>
                  <div class="hero-cta">
                    <a href="#/register" class="btn btn-primary btn-lg">Inizia Ora</a>
                    <a href="#/studi" class="btn btn-outline btn-lg">Esplora Studi</a>
                  </div>
                </div>
              </div>
            </div>
            
            <section class="features-section">
              <div class="container">
                <h2 class="section-title text-center">Perché scegliere PrigioneRecords?</h2>
                <div class="features-grid">
                  <div class="feature-card">
                    <div class="feature-icon">
                      <i class="fas fa-building"></i>
                    </div>
                    <h3>Studi Certificati</h3>
                    <p>Accesso a una rete di studi di registrazione professionali e certificati.</p>
                  </div>
                  <div class="feature-card">
                    <div class="feature-icon">
                      <i class="fas fa-calendar-check"></i>
                    </div>
                    <h3>Prenotazioni Facili</h3>
                    <p>Sistema di prenotazione intuitivo con disponibilità in tempo reale.</p>
                  </div>
                  <div class="feature-card">
                    <div class="feature-icon">
                      <i class="fas fa-star"></i>
                    </div>
                    <h3>Recensioni Verificate</h3>
                    <p>Leggi recensioni autentiche di altri musicisti per scegliere il meglio.</p>
                  </div>
                </div>
              </div>
            </section>
        `;
    },
    afterRender: () => {
        // Add any event listeners or post-render logic here
        console.log('HomePage rendered');
    }
};

export default HomePage; 