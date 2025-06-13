/**
 * Utility helper generiche per l'applicazione
 */

/**
 * Debounce function per limitare la frequenza di chiamata di una funzione
 * @param {Function} func - Funzione da debounce
 * @param {number} wait - Millisecondi di attesa
 * @param {boolean} immediate - Esegui immediatamente la prima volta
 * @returns {Function} Funzione debounced
 */
function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

/**
 * Throttle function per limitare l'esecuzione di una funzione
 * @param {Function} func - Funzione da throttle
 * @param {number} limit - Millisecondi tra esecuzioni
 * @returns {Function} Funzione throttled
 */
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Formatta un numero come valuta in euro
 * @param {number} amount - Importo da formattare
 * @returns {string} Importo formattato
 */
function formatCurrency(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '€ 0,00';
  }
  
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

/**
 * Formatta un numero con separatori delle migliaia
 * @param {number} number - Numero da formattare
 * @returns {string} Numero formattato
 */
function formatNumber(number) {
  if (typeof number !== 'number' || isNaN(number)) {
    return '0';
  }
  
  return new Intl.NumberFormat('it-IT').format(number);
}

/**
 * Capitalize la prima lettera di una stringa
 * @param {string} str - Stringa da capitalizzare
 * @returns {string} Stringa capitalizzata
 */
function capitalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Converte una stringa in camelCase
 * @param {string} str - Stringa da convertire
 * @returns {string} Stringa in camelCase
 */
function toCamelCase(str) {
  if (!str) return '';
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

/**
 * Converte una stringa in kebab-case
 * @param {string} str - Stringa da convertire
 * @returns {string} Stringa in kebab-case
 */
function toKebabCase(str) {
  if (!str) return '';
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Trunca una stringa alla lunghezza specificata
 * @param {string} str - Stringa da truncare
 * @param {number} length - Lunghezza massima
 * @param {string} suffix - Suffisso da aggiungere (default: '...')
 * @returns {string} Stringa truncata
 */
function truncateString(str, length, suffix = '...') {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
}

/**
 * Rimuove tag HTML da una stringa
 * @param {string} html - Stringa HTML
 * @returns {string} Testo pulito
 */
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Escape caratteri HTML in una stringa
 * @param {string} str - Stringa da escape
 * @returns {string} Stringa con caratteri escaped
 */
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Genera un ID univoco
 * @param {string} prefix - Prefisso opzionale
 * @returns {string} ID univoco
 */
function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Copia testo negli appunti
 * @param {string} text - Testo da copiare
 * @returns {Promise<boolean>} True se copiato con successo
 */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback per browser più vecchi
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error('Errore nella copia:', error);
    return false;
  }
}

/**
 * Verifica se un elemento è visibile nel viewport
 * @param {HTMLElement} element - Elemento da verificare
 * @returns {boolean} True se visibile
 */
function isElementInViewport(element) {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Scroll smooth verso un elemento
 * @param {HTMLElement|string} target - Elemento o selettore
 * @param {Object} options - Opzioni di scroll
 */
function scrollToElement(target, options = {}) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;
  
  const defaultOptions = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
    ...options
  };
  
  element.scrollIntoView(defaultOptions);
}

/**
 * Ottiene parametri dall'URL
 * @param {string} url - URL da parsare (default: location attuale)
 * @returns {Object} Oggetto con i parametri
 */
function getUrlParams(url = window.location.href) {
  const urlObj = new URL(url);
  const params = {};
  
  for (const [key, value] of urlObj.searchParams) {
    params[key] = value;
  }
  
  return params;
}

/**
 * Aggiorna i parametri URL senza ricaricare la pagina
 * @param {Object} params - Parametri da aggiornare
 * @param {boolean} replaceState - Usa replaceState invece di pushState
 */
function updateUrlParams(params, replaceState = false) {
  const url = new URL(window.location);
  
  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === undefined) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, params[key]);
    }
  });
  
  const method = replaceState ? 'replaceState' : 'pushState';
  window.history[method]({}, '', url);
}

/**
 * Verifica se il dispositivo è mobile
 * @returns {boolean} True se mobile
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Verifica se il dispositivo è tablet
 * @returns {boolean} True se tablet
 */
function isTablet() {
  return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
}

/**
 * Verifica se siamo in modalità standalone (PWA)
 * @returns {boolean} True se standalone
 */
function isStandalone() {
  return window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
}

/**
 * Converte FileList in Array
 * @param {FileList} fileList - FileList da convertire
 * @returns {Array<File>} Array di file
 */
function fileListToArray(fileList) {
  return Array.from(fileList);
}

/**
 * Formatta la dimensione di un file
 * @param {number} bytes - Dimensione in bytes
 * @returns {string} Dimensione formattata
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Verifica il tipo di file dall'estensione
 * @param {string} filename - Nome del file
 * @param {Array} allowedTypes - Tipi consentiti
 * @returns {boolean} True se il tipo è consentito
 */
function isValidFileType(filename, allowedTypes) {
  if (!filename || !allowedTypes) return false;
  
  const extension = filename.split('.').pop().toLowerCase();
  return allowedTypes.includes(extension);
}

/**
 * Mostra un toast di notifica
 * @param {string} message - Messaggio da mostrare
 * @param {string} type - Tipo di toast (success, error, warning, info)
 * @param {number} duration - Durata in millisecondi
 */
function showToast(message, type = 'info', duration = 3000) {
  const toastContainer = document.getElementById('toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-message">${escapeHtml(message)}</span>
      <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  
  toastContainer.appendChild(toast);
  
  // Auto remove
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, duration);
  
  // Animazione di entrata
  setTimeout(() => toast.classList.add('show'), 10);
}

/**
 * Crea il container per i toast se non esiste
 * @returns {HTMLElement} Container dei toast
 */
function createToastContainer() {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Crea un delay promise
 * @param {number} ms - Millisecondi di delay
 * @returns {Promise} Promise che si risolve dopo il delay
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry di una funzione asincrona
 * @param {Function} fn - Funzione da eseguire
 * @param {number} retries - Numero di tentativi
 * @param {number} delayMs - Delay tra tentativi
 * @returns {Promise} Risultato della funzione
 */
async function retry(fn, retries = 3, delayMs = 1000) {
  let lastError;
  
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < retries) {
        await delay(delayMs);
      }
    }
  }
  
  throw lastError;
}

/**
 * Deep clone di un oggetto
 * @param {any} obj - Oggetto da clonare
 * @returns {any} Oggetto clonato
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    Object.keys(obj).forEach(key => {
      clonedObj[key] = deepClone(obj[key]);
    });
    return clonedObj;
  }
}

/**
 * Verifica se due oggetti sono uguali (deep comparison)
 * @param {any} obj1 - Primo oggetto
 * @param {any} obj2 - Secondo oggetto
 * @returns {boolean} True se uguali
 */
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== typeof obj2) return false;
  
  if (typeof obj1 !== 'object') return obj1 === obj2;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }
  
  return true;
}

export {
  debounce,
  throttle,
  formatCurrency,
  formatNumber,
  capitalize,
  toCamelCase,
  toKebabCase,
  truncateString,
  stripHtml,
  escapeHtml,
  generateId,
  copyToClipboard,
  isElementInViewport,
  scrollToElement,
  getUrlParams,
  updateUrlParams,
  isMobile,
  isTablet,
  isStandalone,
  fileListToArray,
  formatFileSize,
  isValidFileType,
  showToast,
  createToastContainer,
  delay,
  retry,
  deepClone,
  deepEqual
}; 