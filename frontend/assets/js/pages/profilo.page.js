/**
 * Pagina Profilo - Gestione del profilo utente
 */

const ProfiloPage = {
    render: async () => {
  return `
    <div class="page-container">
      <div class="page-header">
        <h1>Il Mio Profilo</h1>
        <p>Gestisci le tue informazioni personali e le impostazioni dell'account</p>
      </div>

      <div class="profile-container">
        <!-- Sezione Informazioni Personali -->
        <div class="profile-section">
          <div class="section-header">
            <h2>Informazioni Personali</h2>
            <button class="btn btn-outline" id="edit-profile-btn">
              <i class="fas fa-edit"></i>
              Modifica
            </button>
          </div>

          <div class="profile-info" id="profile-display">
            <div class="info-grid">
              <div class="info-item">
                <label>Nome</label>
                <span id="display-nome">-</span>
              </div>
              <div class="info-item">
                <label>Email</label>
                <span id="display-email">-</span>
              </div>
              <div class="info-item">
                <label>Data Registrazione</label>
                <span id="display-data-registrazione">-</span>
              </div>
            </div>
          </div>

          <!-- Form di modifica (nascosto inizialmente) -->
          <form id="profile-form" class="profile-form" style="display: none;">
            <div class="form-grid">
              <div class="form-group">
                <label for="nome-input">Nome *</label>
                <input 
                  type="text" 
                  id="nome-input" 
                  name="nome" 
                  class="form-input" 
                  required
                  maxlength="50"
                >
                <span class="form-error" style="display: none;"></span>
              </div>
              <div class="form-group">
                <label for="email-input">Email *</label>
                <input 
                  type="email" 
                  id="email-input" 
                  name="email" 
                  class="form-input" 
                  required
                >
                <span class="form-error" style="display: none;"></span>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" id="cancel-edit">Annulla</button>
              <button type="submit" class="btn btn-primary" id="save-profile">
                <span class="btn-text">Salva Modifiche</span>
                <div class="btn-loader" style="display: none;">
                  <i class="fas fa-spinner fa-spin"></i>
                </div>
              </button>
            </div>
          </form>
        </div>

        <!-- Sezione Cambio Password -->
        <div class="profile-section">
          <div class="section-header">
            <h2>Sicurezza</h2>
            <button class="btn btn-outline" id="change-password-btn">
              <i class="fas fa-key"></i>
              Cambia Password
            </button>
          </div>

          <div class="security-info">
            <div class="info-item">
              <label>Ultimo accesso</label>
              <span id="display-ultimo-accesso">-</span>
            </div>
          </div>

          <!-- Form cambio password (nascosto inizialmente) -->
          <form id="password-form" class="password-form" style="display: none;">
            <div class="form-group">
              <label for="current-password">Password Attuale *</label>
              <input 
                type="password" 
                id="current-password" 
                name="currentPassword" 
                class="form-input" 
                required
              >
              <span class="form-error" style="display: none;"></span>
            </div>
            <div class="form-group">
              <label for="new-password">Nuova Password *</label>
              <input 
                type="password" 
                id="new-password" 
                name="newPassword" 
                class="form-input" 
                required
                minlength="6"
              >
              <span class="form-error" style="display: none;"></span>
              <div class="password-requirements">
                <small>La password deve essere lunga almeno 6 caratteri</small>
              </div>
            </div>
            <div class="form-group">
              <label for="confirm-password">Conferma Nuova Password *</label>
              <input 
                type="password" 
                id="confirm-password" 
                name="confirmPassword" 
                class="form-input" 
                required
              >
              <span class="form-error" style="display: none;"></span>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" id="cancel-password">Annulla</button>
              <button type="submit" class="btn btn-primary" id="save-password">
                <span class="btn-text">Cambia Password</span>
                <div class="btn-loader" style="display: none;">
                  <i class="fas fa-spinner fa-spin"></i>
                </div>
              </button>
            </div>
          </form>
        </div>

        <!-- Sezione Statistiche -->
        <div class="profile-section">
          <div class="section-header">
            <h2>Le Tue Statistiche</h2>
          </div>

          <div class="stats-grid" id="user-stats">
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-calendar-check"></i>
              </div>
              <div class="stat-content">
                <div class="stat-number" id="stat-prenotazioni">-</div>
                <div class="stat-label">Prenotazioni Totali</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-star"></i>
              </div>
              <div class="stat-content">
                <div class="stat-number" id="stat-recensioni">-</div>
                <div class="stat-label">Recensioni Scritte</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-music"></i>
              </div>
              <div class="stat-content">
                <div class="stat-number" id="stat-studi">-</div>
                <div class="stat-label">Studi Visitati</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="stat-content">
                <div class="stat-number" id="stat-giorni">-</div>
                <div class="stat-label">Giorni da Registrazione</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sezione Impostazioni -->
        <div class="profile-section">
          <div class="section-header">
            <h2>Impostazioni</h2>
          </div>

          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-info">
                <h3>Notifiche Email</h3>
                <p>Ricevi notifiche sulle prenotazioni e aggiornamenti</p>
              </div>
              <div class="setting-control">
                <label class="switch">
                  <input type="checkbox" id="email-notifications" checked>
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <h3>Modalità Scura</h3>
                <p>Usa il tema scuro per l'interfaccia</p>
              </div>
              <div class="setting-control">
                <label class="switch">
                  <input type="checkbox" id="dark-mode">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Sezione Azioni Account -->
        <div class="profile-section danger-section">
          <div class="section-header">
            <h2>Zona Pericolosa</h2>
          </div>

          <div class="danger-actions">
            <div class="danger-item">
              <div class="danger-info">
                <h3>Logout da tutti i dispositivi</h3>
                <p>Disconnetti il tuo account da tutti i dispositivi</p>
              </div>
              <button class="btn btn-outline-danger" id="logout-all-btn">
                Logout Ovunque
              </button>
            </div>
            <div class="danger-item">
              <div class="danger-info">
                <h3>Elimina Account</h3>
                <p>Elimina permanentemente il tuo account e tutti i dati</p>
              </div>
              <button class="btn btn-danger" id="delete-account-btn">
                Elimina Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Conferma Eliminazione Account -->
    <div id="delete-account-modal" class="modal" style="display: none;">
      <div class="modal-content modal-danger">
        <div class="modal-header">
          <h2>Elimina Account</h2>
          <button class="modal-close" id="close-delete-account-modal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="warning-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>
              <strong>Attenzione!</strong> Questa azione eliminerà permanentemente il tuo account 
              e tutti i dati associati (prenotazioni, recensioni, ecc.). 
              Questa operazione non può essere annullata.
            </p>
          </div>
          
          <div class="form-group">
            <label for="delete-confirmation">
              Per confermare, digita "ELIMINA" nel campo sottostante:
            </label>
            <input 
              type="text" 
              id="delete-confirmation" 
              class="form-input"
              placeholder="ELIMINA"
            >
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" id="cancel-delete-account">
              Annulla
            </button>
            <button type="button" class="btn btn-danger" id="confirm-delete-account" disabled>
              <span class="btn-text">Elimina Account</span>
              <div class="btn-loader" style="display: none;">
                <i class="fas fa-spinner fa-spin"></i>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
    },

    afterRender: async () => {
  try {
    // Import dei moduli necessari
    const authStore = (await import('../store/auth.store.js')).default;
    const { showToast } = await import('../utils/helpers.js');
    const { Validator } = await import('../utils/validation.utils.js');
    const DateUtils = (await import('../utils/date.utils.js')).default;

    // Carica i dati del profilo
    loadProfileData();
    loadUserStats();

    // Configura event listeners
    setupEventListeners();

    /**
     * Carica i dati del profilo
     */
    function loadProfileData() {
      const user = authStore.getState().user;
      if (!user) return;

      // Mostra informazioni utente
      document.getElementById('display-nome').textContent = user.nome || '-';
      document.getElementById('display-email').textContent = user.email || '-';
      
      // Simula data registrazione (poiché non è nel token)
      const registrationDate = new Date();
      registrationDate.setMonth(registrationDate.getMonth() - 3); // 3 mesi fa (esempio)
      document.getElementById('display-data-registrazione').textContent = 
        DateUtils.formatDate(registrationDate);
      
      // Simula ultimo accesso
      document.getElementById('display-ultimo-accesso').textContent = 
        DateUtils.formatRelativeTime(new Date());

      // Popola form di modifica
      document.getElementById('nome-input').value = user.nome || '';
      document.getElementById('email-input').value = user.email || '';
    }

    /**
     * Carica le statistiche utente
     */
    async function loadUserStats() {
      try {
        // Qui dovresti caricare le statistiche reali dal backend
        // Per ora usiamo dati simulati
        const stats = await simulateUserStats();
        
        document.getElementById('stat-prenotazioni').textContent = stats.prenotazioni;
        document.getElementById('stat-recensioni').textContent = stats.recensioni;
        document.getElementById('stat-studi').textContent = stats.studi;
        document.getElementById('stat-giorni').textContent = stats.giorni;
      } catch (error) {
        console.error('Errore nel caricamento statistiche:', error);
        // Mostra valori di default in caso di errore
        ['stat-prenotazioni', 'stat-recensioni', 'stat-studi', 'stat-giorni'].forEach(id => {
          document.getElementById(id).textContent = '0';
        });
      }
    }

    /**
     * Simula le statistiche utente (da sostituire con chiamata API reale)
     */
    async function simulateUserStats() {
      // Simula un delay della chiamata API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        prenotazioni: Math.floor(Math.random() * 50) + 5,
        recensioni: Math.floor(Math.random() * 30) + 2,
        studi: Math.floor(Math.random() * 15) + 1,
        giorni: Math.floor(Math.random() * 365) + 30
      };
    }

    /**
     * Configura gli event listeners
     */
    function setupEventListeners() {
      // Modifica profilo
      document.getElementById('edit-profile-btn')?.addEventListener('click', showProfileEditForm);
      document.getElementById('cancel-edit')?.addEventListener('click', hideProfileEditForm);
      document.getElementById('profile-form')?.addEventListener('submit', handleProfileUpdate);

      // Cambio password
      document.getElementById('change-password-btn')?.addEventListener('click', showPasswordForm);
      document.getElementById('cancel-password')?.addEventListener('click', hidePasswordForm);
      document.getElementById('password-form')?.addEventListener('submit', handlePasswordChange);

      // Impostazioni
      document.getElementById('email-notifications')?.addEventListener('change', handleSettingChange);
      document.getElementById('dark-mode')?.addEventListener('change', handleDarkModeToggle);

      // Azioni pericolose
      document.getElementById('logout-all-btn')?.addEventListener('click', handleLogoutAll);
      document.getElementById('delete-account-btn')?.addEventListener('click', showDeleteAccountModal);

      // Modal eliminazione account
      document.getElementById('close-delete-account-modal')?.addEventListener('click', hideDeleteAccountModal);
      document.getElementById('cancel-delete-account')?.addEventListener('click', hideDeleteAccountModal);
      document.getElementById('delete-confirmation')?.addEventListener('input', handleDeleteConfirmationInput);
      document.getElementById('confirm-delete-account')?.addEventListener('click', handleAccountDeletion);

      // Validazione password in tempo reale
      document.getElementById('confirm-password')?.addEventListener('input', validatePasswordConfirmation);
    }

    /**
     * Mostra il form di modifica profilo
     */
    function showProfileEditForm() {
      document.getElementById('profile-display').style.display = 'none';
      document.getElementById('profile-form').style.display = 'block';
      document.getElementById('edit-profile-btn').style.display = 'none';
    }

    /**
     * Nasconde il form di modifica profilo
     */
    function hideProfileEditForm() {
      document.getElementById('profile-display').style.display = 'block';
      document.getElementById('profile-form').style.display = 'none';
      document.getElementById('edit-profile-btn').style.display = 'inline-flex';
      
      // Ripristina i valori originali
      loadProfileData();
      clearFormErrors('profile-form');
    }

    /**
     * Gestisce l'aggiornamento del profilo
     */
    async function handleProfileUpdate(e) {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      
      // Validazione
      const validation = validateProfileData(data);
      if (!validation.isValid) {
        showFormErrors('profile-form', validation.errors);
        return;
      }

      const submitBtn = document.getElementById('save-profile');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');

      try {
        // Mostra loading
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        submitBtn.disabled = true;

        // Simula aggiornamento profilo (sostituire con chiamata API reale)
        await simulateProfileUpdate(data);
        
        // Aggiorna store locale
        const currentUser = authStore.getState().user;
        const updatedUser = { ...currentUser, ...data };
        authStore.updateUser(updatedUser);
        
        showToast('Profilo aggiornato con successo!', 'success');
        hideProfileEditForm();
        loadProfileData();
      } catch (error) {
        console.error('Errore nell\'aggiornamento profilo:', error);
        showToast('Errore nell\'aggiornamento del profilo', 'error');
      } finally {
        // Nascondi loading
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
      }
    }

    /**
     * Mostra il form di cambio password
     */
    function showPasswordForm() {
      document.getElementById('password-form').style.display = 'block';
      document.getElementById('change-password-btn').style.display = 'none';
    }

    /**
     * Nasconde il form di cambio password
     */
    function hidePasswordForm() {
      document.getElementById('password-form').style.display = 'none';
      document.getElementById('change-password-btn').style.display = 'inline-flex';
      document.getElementById('password-form').reset();
      clearFormErrors('password-form');
    }

    /**
     * Gestisce il cambio password
     */
    async function handlePasswordChange(e) {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      
      // Validazione
      const validation = validatePasswordData(data);
      if (!validation.isValid) {
        showFormErrors('password-form', validation.errors);
        return;
      }

      const submitBtn = document.getElementById('save-password');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');

      try {
        // Mostra loading
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        submitBtn.disabled = true;

        // Simula cambio password (sostituire con chiamata API reale)
        await simulatePasswordChange(data);
        
        showToast('Password cambiata con successo!', 'success');
        hidePasswordForm();
      } catch (error) {
        console.error('Errore nel cambio password:', error);
        showToast('Errore nel cambio password', 'error');
      } finally {
        // Nascondi loading
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
      }
    }

    /**
     * Gestisce i cambiamenti delle impostazioni
     */
    function handleSettingChange(e) {
      const setting = e.target.id;
      const value = e.target.checked;
      
      // Salva l'impostazione (localStorage per ora)
      localStorage.setItem(`setting_${setting}`, value);
      
      showToast(`Impostazione ${value ? 'attivata' : 'disattivata'}`, 'info');
    }

    /**
     * Gestisce il toggle della modalità scura
     */
    function handleDarkModeToggle(e) {
      const isDark = e.target.checked;
      
      document.documentElement.classList.toggle('dark-theme', isDark);
      localStorage.setItem('dark-mode', isDark);
      
      showToast(`Modalità ${isDark ? 'scura' : 'chiara'} attivata`, 'info');
    }

    /**
     * Gestisce il logout da tutti i dispositivi
     */
    async function handleLogoutAll() {
      if (confirm('Sei sicuro di voler disconnettere il tuo account da tutti i dispositivi?')) {
        try {
          // Simula logout globale (sostituire con chiamata API reale)
          await simulateGlobalLogout();
          
          showToast('Disconnesso da tutti i dispositivi', 'success');
          
          // Logout locale
          setTimeout(() => {
            authStore.logout();
          }, 1500);
        } catch (error) {
          console.error('Errore nel logout globale:', error);
          showToast('Errore nel logout globale', 'error');
        }
      }
    }

    /**
     * Mostra il modal di eliminazione account
     */
    function showDeleteAccountModal() {
      document.getElementById('delete-account-modal').style.display = 'flex';
      document.getElementById('delete-confirmation').value = '';
      document.getElementById('confirm-delete-account').disabled = true;
    }

    /**
     * Nasconde il modal di eliminazione account
     */
    function hideDeleteAccountModal() {
      document.getElementById('delete-account-modal').style.display = 'none';
    }

    /**
     * Gestisce l'input di conferma eliminazione
     */
    function handleDeleteConfirmationInput(e) {
      const confirmBtn = document.getElementById('confirm-delete-account');
      confirmBtn.disabled = e.target.value !== 'ELIMINA';
    }

    /**
     * Gestisce l'eliminazione dell'account
     */
    async function handleAccountDeletion() {
      const confirmBtn = document.getElementById('confirm-delete-account');
      const btnText = confirmBtn.querySelector('.btn-text');
      const btnLoader = confirmBtn.querySelector('.btn-loader');

      try {
        // Mostra loading
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        confirmBtn.disabled = true;

        // Simula eliminazione account (sostituire con chiamata API reale)
        await simulateAccountDeletion();
        
        showToast('Account eliminato con successo', 'success');
        
        // Logout e redirect
        setTimeout(() => {
          authStore.logout();
        }, 1500);
      } catch (error) {
        console.error('Errore nell\'eliminazione account:', error);
        showToast('Errore nell\'eliminazione dell\'account', 'error');
      } finally {
        // Nascondi loading
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
        confirmBtn.disabled = false;
      }
    }

    /**
     * Valida la conferma password
     */
    function validatePasswordConfirmation() {
      const newPassword = document.getElementById('new-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const errorElement = document.querySelector('#confirm-password').parentNode.querySelector('.form-error');

      if (confirmPassword && newPassword !== confirmPassword) {
        errorElement.textContent = 'Le password non coincidono';
        errorElement.style.display = 'block';
      } else {
        errorElement.style.display = 'none';
      }
    }

    /**
     * Funzioni di validazione
     */
    function validateProfileData(data) {
      const errors = {};

      if (!Validator.validateRequired(data.nome)) {
        errors.nome = 'Nome è obbligatorio';
      } else if (!Validator.validateMinLength(data.nome, 2)) {
        errors.nome = 'Nome deve essere almeno 2 caratteri';
      }

      if (!Validator.validateRequired(data.email)) {
        errors.email = 'Email è obbligatoria';
      } else if (!Validator.validateEmail(data.email)) {
        errors.email = 'Email non valida';
      }

      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    }

    function validatePasswordData(data) {
      const errors = {};

      if (!Validator.validateRequired(data.currentPassword)) {
        errors.currentPassword = 'Password attuale è obbligatoria';
      }

      if (!Validator.validateRequired(data.newPassword)) {
        errors.newPassword = 'Nuova password è obbligatoria';
      } else if (!Validator.validatePassword(data.newPassword)) {
        errors.newPassword = 'Password deve essere almeno 6 caratteri';
      }

      if (data.newPassword !== data.confirmPassword) {
        errors.confirmPassword = 'Le password non coincidono';
      }

      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    }

    /**
     * Helper functions per UI
     */
    function showFormErrors(formId, errors) {
      const form = document.getElementById(formId);
      Object.keys(errors).forEach(field => {
        const input = form.querySelector(`[name="${field}"]`);
        const errorElement = input?.parentNode?.querySelector('.form-error');
        if (errorElement) {
          errorElement.textContent = errors[field];
          errorElement.style.display = 'block';
        }
      });
    }

    function clearFormErrors(formId) {
      const form = document.getElementById(formId);
      const errorElements = form.querySelectorAll('.form-error');
      errorElements.forEach(element => {
        element.style.display = 'none';
      });
    }

    /**
     * Funzioni simulate per le chiamate API (da sostituire con quelle reali)
     */
    async function simulateProfileUpdate(data) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simula possibile errore
      if (Math.random() < 0.1) {
        throw new Error('Errore simulato');
      }
    }

    async function simulatePasswordChange(data) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simula possibile errore
      if (Math.random() < 0.1) {
        throw new Error('Password attuale non corretta');
      }
    }

    async function simulateGlobalLogout() {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    async function simulateAccountDeletion() {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Carica impostazioni salvate
    loadSavedSettings();

    function loadSavedSettings() {
      const emailNotifications = localStorage.getItem('setting_email-notifications');
      const darkMode = localStorage.getItem('dark-mode');

      if (emailNotifications !== null) {
        document.getElementById('email-notifications').checked = emailNotifications === 'true';
      }

      if (darkMode === 'true') {
        document.getElementById('dark-mode').checked = true;
        document.documentElement.classList.add('dark-theme');
      }
    }

  } catch (error) {
    console.error('Errore nell\'inizializzazione pagina profilo:', error);
    document.querySelector('.page-container').innerHTML = `
      <div class="error-container">
        <h1>Errore di caricamento</h1>
        <p>Si è verificato un errore durante il caricamento della pagina profilo.</p>
        <button class="btn btn-primary" onclick="window.location.reload()">Ricarica Pagina</button>
      </div>
    `;
  }
    }
};

export default ProfiloPage; 