/**
 * Utility per la validazione dei form
 */
class Validator {
  
  /**
   * Valida un indirizzo email
   * @param {string} email - Email da validare
   * @returns {boolean} True se l'email è valida
   */
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida una password
   * @param {string} password - Password da validare
   * @param {number} minLength - Lunghezza minima (default: 6)
   * @returns {boolean} True se la password è valida
   */
  static validatePassword(password, minLength = 6) {
    return password && password.length >= minLength;
  }

  /**
   * Valida che un campo sia obbligatorio
   * @param {string} value - Valore da validare
   * @returns {boolean} True se il valore è presente
   */
  static validateRequired(value) {
    return value && value.trim().length > 0;
  }

  /**
   * Valida lunghezza minima
   * @param {string} value - Valore da validare
   * @param {number} minLength - Lunghezza minima
   * @returns {boolean} True se la lunghezza è valida
   */
  static validateMinLength(value, minLength) {
    return value && value.length >= minLength;
  }

  /**
   * Valida lunghezza massima
   * @param {string} value - Valore da validare
   * @param {number} maxLength - Lunghezza massima
   * @returns {boolean} True se la lunghezza è valida
   */
  static validateMaxLength(value, maxLength) {
    return value && value.length <= maxLength;
  }

  /**
   * Valida un numero intero
   * @param {any} value - Valore da validare
   * @param {number} min - Valore minimo (opzionale)
   * @param {number} max - Valore massimo (opzionale)
   * @returns {boolean} True se il numero è valido
   */
  static validateInteger(value, min = null, max = null) {
    const num = parseInt(value);
    if (isNaN(num)) return false;
    if (min !== null && num < min) return false;
    if (max !== null && num > max) return false;
    return true;
  }

  /**
   * Valida una data
   * @param {string} date - Data da validare (formato YYYY-MM-DD)
   * @returns {boolean} True se la data è valida
   */
  static validateDate(date) {
    if (!date) return false;
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
  }

  /**
   * Valida che una data sia futura
   * @param {string} date - Data da validare
   * @returns {boolean} True se la data è futura
   */
  static validateFutureDate(date) {
    if (!this.validateDate(date)) return false;
    const dateObj = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dateObj >= today;
  }

  /**
   * Valida una valutazione (rating)
   * @param {number} rating - Valutazione da validare
   * @param {number} min - Valore minimo (default: 1)
   * @param {number} max - Valore massimo (default: 5)
   * @returns {boolean} True se la valutazione è valida
   */
  static validateRating(rating, min = 1, max = 5) {
    return this.validateInteger(rating, min, max);
  }

  /**
   * Valida i dati di login
   * @param {Object} formData - Dati del form
   * @returns {Object} Risultato della validazione
   */
  static validateLogin(formData) {
    const errors = {};

    if (!this.validateRequired(formData.email)) {
      errors.email = 'Email è obbligatoria';
    } else if (!this.validateEmail(formData.email)) {
      errors.email = 'Email non valida';
    }

    if (!this.validateRequired(formData.password)) {
      errors.password = 'Password è obbligatoria';
    } else if (!this.validatePassword(formData.password)) {
      errors.password = 'Password deve essere almeno 6 caratteri';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Valida i dati di registrazione
   * @param {Object} formData - Dati del form
   * @returns {Object} Risultato della validazione
   */
  static validateRegister(formData) {
    const errors = {};

    if (!this.validateRequired(formData.nome)) {
      errors.nome = 'Nome è obbligatorio';
    } else if (!this.validateMinLength(formData.nome, 2)) {
      errors.nome = 'Nome deve essere almeno 2 caratteri';
    } else if (!this.validateMaxLength(formData.nome, 50)) {
      errors.nome = 'Nome non può superare 50 caratteri';
    }

    if (!this.validateRequired(formData.email)) {
      errors.email = 'Email è obbligatoria';
    } else if (!this.validateEmail(formData.email)) {
      errors.email = 'Email non valida';
    }

    if (!this.validateRequired(formData.password)) {
      errors.password = 'Password è obbligatoria';
    } else if (!this.validatePassword(formData.password)) {
      errors.password = 'Password deve essere almeno 6 caratteri';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Le password non coincidono';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Valida i dati di una prenotazione
   * @param {Object} formData - Dati del form
   * @returns {Object} Risultato della validazione
   */
  static validateBooking(formData) {
    const errors = {};

    if (!this.validateRequired(formData.studioId)) {
      errors.studioId = 'Studio è obbligatorio';
    }

    if (!this.validateRequired(formData.data)) {
      errors.data = 'Data è obbligatoria';
    } else if (!this.validateDate(formData.data)) {
      errors.data = 'Data non valida';
    } else if (!this.validateFutureDate(formData.data)) {
      errors.data = 'La data deve essere futura';
    }

    if (formData.note && !this.validateMaxLength(formData.note, 500)) {
      errors.note = 'Le note non possono superare 500 caratteri';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Valida i dati di una recensione
   * @param {Object} formData - Dati del form
   * @returns {Object} Risultato della validazione
   */
  static validateReview(formData) {
    const errors = {};

    if (!this.validateRequired(formData.studioId)) {
      errors.studioId = 'Studio è obbligatorio';
    }

    if (!this.validateRequired(formData.valutazione)) {
      errors.valutazione = 'Valutazione è obbligatoria';
    } else if (!this.validateRating(formData.valutazione)) {
      errors.valutazione = 'Valutazione deve essere tra 1 e 5';
    }

    if (formData.commento && !this.validateMaxLength(formData.commento, 1000)) {
      errors.commento = 'Il commento non può superare 1000 caratteri';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Valida i dati di uno studio (per admin)
   * @param {Object} formData - Dati del form
   * @returns {Object} Risultato della validazione
   */
  static validateStudio(formData) {
    const errors = {};

    if (!this.validateRequired(formData.nome)) {
      errors.nome = 'Nome studio è obbligatorio';
    } else if (!this.validateMinLength(formData.nome, 2)) {
      errors.nome = 'Nome deve essere almeno 2 caratteri';
    } else if (!this.validateMaxLength(formData.nome, 100)) {
      errors.nome = 'Nome non può superare 100 caratteri';
    }

    if (!this.validateRequired(formData.indirizzo)) {
      errors.indirizzo = 'Indirizzo è obbligatorio';
    } else if (!this.validateMinLength(formData.indirizzo, 5)) {
      errors.indirizzo = 'Indirizzo deve essere almeno 5 caratteri';
    } else if (!this.validateMaxLength(formData.indirizzo, 200)) {
      errors.indirizzo = 'Indirizzo non può superare 200 caratteri';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

/**
 * Helper per aggiungere validazione a un form
 * @param {string} formId - ID del form
 * @param {Function} validationFunction - Funzione di validazione
 */
function addValidationToForm(formId, validationFunction) {
  const form = document.getElementById(formId);
  if (!form) return;

  const inputs = form.querySelectorAll('input, textarea, select');

  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input, validationFunction));
    input.addEventListener('input', () => clearError(input));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const validation = validationFunction(data);

    if (validation.isValid) {
      // Trigger custom event per il submit
      const submitEvent = new CustomEvent('validSubmit', { detail: data });
      form.dispatchEvent(submitEvent);
    } else {
      // Mostra gli errori
      showValidationErrors(validation.errors);
    }
  });
}

/**
 * Mostra gli errori di validazione
 * @param {Object} errors - Oggetto con gli errori
 */
function showValidationErrors(errors) {
  Object.keys(errors).forEach(field => {
    const input = document.querySelector(`[name="${field}"]`);
    if (input) {
      const errorElement = input.parentNode.querySelector('.form-error');
      if (errorElement) {
        errorElement.textContent = errors[field];
        errorElement.style.display = 'block';
      }
      input.classList.add('error');
    }
  });
}

/**
 * Pulisce l'errore di un campo
 * @param {HTMLElement} input - Campo input
 */
function clearError(input) {
  const errorElement = input.parentNode.querySelector('.form-error');
  if (errorElement) {
    errorElement.style.display = 'none';
  }
  input.classList.remove('error');
}

/**
 * Valida un singolo campo
 * @param {HTMLElement} input - Campo input
 * @param {Function} validationFunction - Funzione di validazione
 */
function validateField(input, validationFunction) {
  const form = input.closest('form');
  if (!form) return;

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  const validation = validationFunction(data);

  if (validation.errors[input.name]) {
    const errorElement = input.parentNode.querySelector('.form-error');
    if (errorElement) {
      errorElement.textContent = validation.errors[input.name];
      errorElement.style.display = 'block';
    }
    input.classList.add('error');
  } else {
    clearError(input);
  }
}

export { 
  Validator, 
  addValidationToForm, 
  showValidationErrors, 
  clearError, 
  validateField 
}; 