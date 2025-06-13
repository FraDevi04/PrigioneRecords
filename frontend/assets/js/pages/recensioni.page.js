/**
 * Pagina Recensioni - Gestione delle recensioni dell'utente
 */

async function renderRecensioniPage() {
  return `
    <div class="page-container">
      <div class="page-header">
        <h1>Le Mie Recensioni</h1>
        <p>Gestisci le tue recensioni e scrivi nuove valutazioni</p>
        <div class="page-actions">
          <button class="btn btn-primary" id="new-review-btn">
            <i class="fas fa-star"></i>
            Nuova Recensione
          </button>
        </div>
      </div>

      <!-- Filtri -->
      <div class="filters-section">
        <div class="filters-grid">
          <div class="filter-group">
            <label for="studio-filter">Filtra per Studio</label>
            <select id="studio-filter" class="form-input">
              <option value="">Tutti gli studi</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="rating-filter">Valutazione Minima</label>
            <select id="rating-filter" class="form-input">
              <option value="">Tutte</option>
              <option value="5">5 Stelle</option>
              <option value="4">4+ Stelle</option>
              <option value="3">3+ Stelle</option>
              <option value="2">2+ Stelle</option>
              <option value="1">1+ Stelle</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="date-filter">Periodo</label>
            <select id="date-filter" class="form-input">
              <option value="">Tutte le date</option>
              <option value="7">Ultima settimana</option>
              <option value="30">Ultimo mese</option>
              <option value="90">Ultimi 3 mesi</option>
              <option value="365">Ultimo anno</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Lista Recensioni -->
      <div class="content-section">
        <div id="reviews-list" class="reviews-list">
          <!-- Le recensioni verranno caricate qui -->
          <div class="loading-placeholder">
            <div class="spinner"></div>
            <p>Caricamento recensioni...</p>
          </div>
        </div>

        <!-- Empty State -->
        <div id="empty-state" class="empty-state" style="display: none;">
          <div class="empty-icon">
            <i class="fas fa-star"></i>
          </div>
          <h3>Nessuna recensione trovata</h3>
          <p>Non hai ancora scritto recensioni o nessuna recensione corrisponde ai filtri selezionati.</p>
          <button class="btn btn-primary" id="empty-new-review-btn">
            Scrivi la tua prima recensione
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Nuova Recensione -->
    <div id="review-modal" class="modal" style="display: none;">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="modal-title">Nuova Recensione</h2>
          <button class="modal-close" id="close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form id="review-form">
            <div class="form-group">
              <label for="studio-select">Studio *</label>
              <select id="studio-select" name="studioId" class="form-input" required>
                <option value="">Seleziona uno studio</option>
              </select>
              <span class="form-error" style="display: none;"></span>
            </div>

            <div class="form-group">
              <label for="rating-select">Valutazione *</label>
              <div class="rating-input" id="rating-input">
                <span class="star" data-value="1">★</span>
                <span class="star" data-value="2">★</span>
                <span class="star" data-value="3">★</span>
                <span class="star" data-value="4">★</span>
                <span class="star" data-value="5">★</span>
              </div>
              <input type="hidden" id="rating-value" name="valutazione" required>
              <span class="form-error" style="display: none;"></span>
            </div>

            <div class="form-group">
              <label for="comment-input">Commento</label>
              <textarea 
                id="comment-input" 
                name="commento" 
                class="form-input"
                rows="4"
                placeholder="Descrivi la tua esperienza con questo studio..."
                maxlength="1000"
              ></textarea>
              <div class="char-counter">
                <span id="char-count">0</span>/1000 caratteri
              </div>
              <span class="form-error" style="display: none;"></span>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" id="cancel-review">Annulla</button>
              <button type="submit" class="btn btn-primary" id="submit-review">
                <span class="btn-text">Pubblica Recensione</span>
                <div class="btn-loader" style="display: none;">
                  <i class="fas fa-spinner fa-spin"></i>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Conferma Eliminazione -->
    <div id="delete-modal" class="modal" style="display: none;">
      <div class="modal-content modal-confirm">
        <div class="modal-header">
          <h2>Conferma Eliminazione</h2>
          <button class="modal-close" id="close-delete-modal">&times;</button>
        </div>
        <div class="modal-body">
          <p>Sei sicuro di voler eliminare questa recensione? Questa azione non può essere annullata.</p>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" id="cancel-delete">Annulla</button>
            <button type="button" class="btn btn-danger" id="confirm-delete">
              <span class="btn-text">Elimina</span>
              <div class="btn-loader" style="display: none;">
                <i class="fas fa-spinner fa-spin"></i>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Inizializza la pagina recensioni
 */
async function initRecensioniPage() {
  try {
    // Import dei moduli necessari
    const reviewsStore = (await import('../store/reviews.store.js')).default;
    const studiosStore = (await import('../store/studios.store.js')).default;
    const { showToast } = await import('../utils/helpers.js');
    const { Validator } = await import('../utils/validation.utils.js');

    let currentEditingId = null;
    let currentDeletingId = null;

    // Carica dati iniziali
    await Promise.all([
      reviewsStore.fetchMieRecensioni(),
      studiosStore.fetchStudi()
    ]);

    // Sottoscrivi ai cambiamenti dello store
    reviewsStore.subscribe(renderReviews);
    studiosStore.subscribe(updateStudioSelects);

    // Inizializza i componenti
    setupEventListeners();
    setupFilters();
    updateStudioSelects(studiosStore.getState());
    renderReviews(reviewsStore.getState());

    /**
     * Configura gli event listeners
     */
    function setupEventListeners() {
      // Bottoni per nuova recensione
      document.getElementById('new-review-btn')?.addEventListener('click', openReviewModal);
      document.getElementById('empty-new-review-btn')?.addEventListener('click', openReviewModal);

      // Modal recensione
      document.getElementById('close-modal')?.addEventListener('click', closeReviewModal);
      document.getElementById('cancel-review')?.addEventListener('click', closeReviewModal);
      document.getElementById('review-form')?.addEventListener('submit', handleReviewSubmit);

      // Rating input
      setupRatingInput();

      // Character counter
      const commentInput = document.getElementById('comment-input');
      commentInput?.addEventListener('input', updateCharCounter);

      // Modal eliminazione
      document.getElementById('close-delete-modal')?.addEventListener('click', closeDeleteModal);
      document.getElementById('cancel-delete')?.addEventListener('click', closeDeleteModal);
      document.getElementById('confirm-delete')?.addEventListener('click', handleDeleteConfirm);

      // Click fuori modal per chiudere
      document.addEventListener('click', handleModalOutsideClick);
    }

    /**
     * Configura i filtri
     */
    function setupFilters() {
      const studioFilter = document.getElementById('studio-filter');
      const ratingFilter = document.getElementById('rating-filter');
      const dateFilter = document.getElementById('date-filter');

      [studioFilter, ratingFilter, dateFilter].forEach(filter => {
        filter?.addEventListener('change', applyFilters);
      });
    }

    /**
     * Configura l'input per il rating
     */
    function setupRatingInput() {
      const stars = document.querySelectorAll('#rating-input .star');
      const ratingValue = document.getElementById('rating-value');

      stars.forEach(star => {
        star.addEventListener('mouseover', () => highlightStars(star.dataset.value));
        star.addEventListener('click', () => selectRating(star.dataset.value));
      });

      document.getElementById('rating-input')?.addEventListener('mouseleave', resetRatingDisplay);

      function highlightStars(value) {
        stars.forEach((star, index) => {
          star.classList.toggle('active', index < value);
        });
      }

      function selectRating(value) {
        ratingValue.value = value;
        highlightStars(value);
      }

      function resetRatingDisplay() {
        const currentValue = ratingValue.value;
        if (currentValue) {
          highlightStars(currentValue);
        } else {
          stars.forEach(star => star.classList.remove('active'));
        }
      }
    }

    /**
     * Aggiorna i select degli studi
     */
    function updateStudioSelects(studiosState) {
      const selects = [
        document.getElementById('studio-filter'),
        document.getElementById('studio-select')
      ];

      selects.forEach(select => {
        if (!select) return;

        // Mantieni l'opzione di default
        const defaultOption = select.querySelector('option[value=""]');
        select.innerHTML = '';
        if (defaultOption) {
          select.appendChild(defaultOption);
        }

        // Aggiungi gli studi
        studiosState.studi.forEach(studio => {
          const option = document.createElement('option');
          option.value = studio.id;
          option.textContent = studio.nome;
          select.appendChild(option);
        });
      });
    }

    /**
     * Renderizza le recensioni
     */
    function renderReviews(reviewsState) {
      const container = document.getElementById('reviews-list');
      const emptyState = document.getElementById('empty-state');

      if (reviewsState.isLoading) {
        container.innerHTML = `
          <div class="loading-placeholder">
            <div class="spinner"></div>
            <p>Caricamento recensioni...</p>
          </div>
        `;
        emptyState.style.display = 'none';
        return;
      }

      const reviews = getFilteredReviews(reviewsState);

      if (reviews.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
      }

      emptyState.style.display = 'none';
      container.innerHTML = reviews.map(createReviewCard).join('');

      // Aggiungi event listeners alle azioni delle recensioni
      container.querySelectorAll('.review-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const reviewId = e.target.closest('[data-review-id]').dataset.reviewId;
          editReview(reviewId);
        });
      });

      container.querySelectorAll('.review-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const reviewId = e.target.closest('[data-review-id]').dataset.reviewId;
          deleteReview(reviewId);
        });
      });
    }

    /**
     * Ottiene le recensioni filtrate
     */
    function getFilteredReviews(reviewsState) {
      let reviews = [...reviewsState.mieRecensioni];

      const studioFilter = document.getElementById('studio-filter')?.value;
      const ratingFilter = document.getElementById('rating-filter')?.value;
      const dateFilter = document.getElementById('date-filter')?.value;

      if (studioFilter) {
        reviews = reviews.filter(r => r.studioId === studioFilter);
      }

      if (ratingFilter) {
        reviews = reviews.filter(r => r.valutazione >= parseInt(ratingFilter));
      }

      if (dateFilter) {
        const daysAgo = parseInt(dateFilter);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
        reviews = reviews.filter(r => new Date(r.dataRecensione) >= cutoffDate);
      }

      return reviews.sort((a, b) => new Date(b.dataRecensione) - new Date(a.dataRecensione));
    }

    /**
     * Crea una card per la recensione
     */
    function createReviewCard(review) {
      const { formatRelativeTime } = DateUtils || { formatRelativeTime: (date) => new Date(date).toLocaleDateString() };
      
      return `
        <div class="review-card" data-review-id="${review.id}">
          <div class="review-header">
            <div class="review-studio">
              <h3>${review.nomeStudio || 'Studio sconosciuto'}</h3>
              <div class="review-rating">
                ${createStarRating(review.valutazione)}
                <span class="rating-value">${review.valutazione}/5</span>
              </div>
            </div>
            <div class="review-date">
              ${formatRelativeTime(review.dataRecensione)}
            </div>
          </div>
          
          ${review.commento ? `
            <div class="review-comment">
              <p>${review.commento}</p>
            </div>
          ` : ''}
          
          <div class="review-actions">
            <button class="btn btn-sm btn-outline review-edit">
              <i class="fas fa-edit"></i>
              Modifica
            </button>
            <button class="btn btn-sm btn-outline-danger review-delete">
              <i class="fas fa-trash"></i>
              Elimina
            </button>
          </div>
        </div>
      `;
    }

    /**
     * Crea le stelle per il rating
     */
    function createStarRating(rating) {
      let stars = '';
      for (let i = 1; i <= 5; i++) {
        stars += `<span class="star ${i <= rating ? 'active' : ''}">★</span>`;
      }
      return stars;
    }

    /**
     * Applica i filtri
     */
    function applyFilters() {
      renderReviews(reviewsStore.getState());
    }

    /**
     * Apre il modal per nuova recensione
     */
    function openReviewModal() {
      currentEditingId = null;
      document.getElementById('modal-title').textContent = 'Nuova Recensione';
      document.getElementById('review-form').reset();
      clearRatingSelection();
      updateCharCounter();
      document.getElementById('review-modal').style.display = 'flex';
    }

    /**
     * Chiude il modal recensione
     */
    function closeReviewModal() {
      document.getElementById('review-modal').style.display = 'none';
      currentEditingId = null;
    }

    /**
     * Modifica una recensione
     */
    function editReview(reviewId) {
      const review = reviewsStore.getState().mieRecensioni.find(r => r.id === reviewId);
      if (!review) return;

      currentEditingId = reviewId;
      document.getElementById('modal-title').textContent = 'Modifica Recensione';
      
      // Popola il form
      document.getElementById('studio-select').value = review.studioId;
      document.getElementById('rating-value').value = review.valutazione;
      document.getElementById('comment-input').value = review.commento || '';
      
      // Aggiorna rating visuale
      const stars = document.querySelectorAll('#rating-input .star');
      stars.forEach((star, index) => {
        star.classList.toggle('active', index < review.valutazione);
      });
      
      updateCharCounter();
      document.getElementById('review-modal').style.display = 'flex';
    }

    /**
     * Elimina una recensione
     */
    function deleteReview(reviewId) {
      currentDeletingId = reviewId;
      document.getElementById('delete-modal').style.display = 'flex';
    }

    /**
     * Chiude il modal di eliminazione
     */
    function closeDeleteModal() {
      document.getElementById('delete-modal').style.display = 'none';
      currentDeletingId = null;
    }

    /**
     * Gestisce il submit del form recensione
     */
    async function handleReviewSubmit(e) {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      
      // Validazione
      const validation = Validator.validateReview(data);
      if (!validation.isValid) {
        Object.keys(validation.errors).forEach(field => {
          const input = document.querySelector(`[name="${field}"]`);
          const errorElement = input?.parentNode?.querySelector('.form-error');
          if (errorElement) {
            errorElement.textContent = validation.errors[field];
            errorElement.style.display = 'block';
          }
        });
        return;
      }

      const submitBtn = document.getElementById('submit-review');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');

      try {
        // Mostra loading
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        submitBtn.disabled = true;

        if (currentEditingId) {
          await reviewsStore.updateRecensione(currentEditingId, data);
          showToast('Recensione aggiornata con successo!', 'success');
        } else {
          await reviewsStore.createRecensione(data);
          showToast('Recensione pubblicata con successo!', 'success');
        }

        closeReviewModal();
      } catch (error) {
        console.error('Errore nella gestione recensione:', error);
        showToast('Errore nella gestione della recensione', 'error');
      } finally {
        // Nascondi loading
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
      }
    }

    /**
     * Conferma eliminazione recensione
     */
    async function handleDeleteConfirm() {
      if (!currentDeletingId) return;

      const confirmBtn = document.getElementById('confirm-delete');
      const btnText = confirmBtn.querySelector('.btn-text');
      const btnLoader = confirmBtn.querySelector('.btn-loader');

      try {
        // Mostra loading
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        confirmBtn.disabled = true;

        await reviewsStore.deleteRecensione(currentDeletingId);
        showToast('Recensione eliminata con successo!', 'success');
        closeDeleteModal();
      } catch (error) {
        console.error('Errore nell\'eliminazione recensione:', error);
        showToast('Errore nell\'eliminazione della recensione', 'error');
      } finally {
        // Nascondi loading
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
        confirmBtn.disabled = false;
      }
    }

    /**
     * Gestisce click fuori dal modal
     */
    function handleModalOutsideClick(e) {
      if (e.target.classList.contains('modal')) {
        if (e.target.id === 'review-modal') {
          closeReviewModal();
        } else if (e.target.id === 'delete-modal') {
          closeDeleteModal();
        }
      }
    }

    /**
     * Pulisce la selezione del rating
     */
    function clearRatingSelection() {
      document.getElementById('rating-value').value = '';
      document.querySelectorAll('#rating-input .star').forEach(star => {
        star.classList.remove('active');
      });
    }

    /**
     * Aggiorna il contatore caratteri
     */
    function updateCharCounter() {
      const input = document.getElementById('comment-input');
      const counter = document.getElementById('char-count');
      if (input && counter) {
        counter.textContent = input.value.length;
      }
    }

  } catch (error) {
    console.error('Errore nell\'inizializzazione pagina recensioni:', error);
    document.getElementById('main-content').innerHTML = `
      <div class="error-container">
        <h1>Errore di caricamento</h1>
        <p>Si è verificato un errore durante il caricamento della pagina recensioni.</p>
        <button class="btn btn-primary" onclick="window.location.reload()">Ricarica Pagina</button>
      </div>
    `;
  }
}

export { renderRecensioniPage, initRecensioniPage }; 