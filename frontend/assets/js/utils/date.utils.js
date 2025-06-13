/**
 * Utility per la gestione delle date
 */
class DateUtils {
  
  /**
   * Formatta una data nel formato italiano
   * @param {Date|string} date - Data da formattare
   * @param {Object} options - Opzioni di formattazione
   * @returns {string} Data formattata
   */
  static formatDate(date, options = {}) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Data non valida';
    }
    
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };
    
    return dateObj.toLocaleDateString('it-IT', defaultOptions);
  }

  /**
   * Formatta una data in formato breve (gg/mm/aaaa)
   * @param {Date|string} date - Data da formattare
   * @returns {string} Data formattata
   */
  static formatDateShort(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Data non valida';
    }
    
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  /**
   * Formatta una data nel formato ISO (YYYY-MM-DD)
   * @param {Date|string} date - Data da formattare
   * @returns {string} Data in formato ISO
   */
  static formatDateISO(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (!dateObj || isNaN(dateObj.getTime())) {
      return '';
    }
    
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  /**
   * Formatta data e ora
   * @param {Date|string} date - Data da formattare
   * @param {boolean} includeSeconds - Includere i secondi
   * @returns {string} Data e ora formattate
   */
  static formatDateTime(date, includeSeconds = false) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Data non valida';
    }
    
    const dateOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      ...(includeSeconds && { second: '2-digit' })
    };
    
    return dateObj.toLocaleString('it-IT', dateOptions);
  }

  /**
   * Formatta una data in formato relativo (es. "2 giorni fa")
   * @param {Date|string} date - Data da formattare
   * @returns {string} Data in formato relativo
   */
  static formatRelativeTime(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Data non valida';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) {
      return 'Adesso';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minuto${diffMinutes > 1 ? 'i' : ''} fa`;
    } else if (diffHours < 24) {
      return `${diffHours} ora${diffHours > 1 ? 'e' : ''} fa`;
    } else if (diffDays < 7) {
      return `${diffDays} giorno${diffDays > 1 ? 'i' : ''} fa`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} settimana${weeks > 1 ? 'e' : ''} fa`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} mese${months > 1 ? 'i' : ''} fa`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} anno${years > 1 ? 'i' : ''} fa`;
    }
  }

  /**
   * Ottiene il nome del giorno della settimana
   * @param {Date|string} date - Data
   * @param {boolean} short - Formato breve (es. "Lun" invece di "Lunedì")
   * @returns {string} Nome del giorno
   */
  static getDayName(date, short = false) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Data non valida';
    }
    
    const options = { weekday: short ? 'short' : 'long' };
    return dateObj.toLocaleDateString('it-IT', options);
  }

  /**
   * Ottiene il nome del mese
   * @param {Date|string} date - Data
   * @param {boolean} short - Formato breve (es. "Gen" invece di "Gennaio")
   * @returns {string} Nome del mese
   */
  static getMonthName(date, short = false) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Data non valida';
    }
    
    const options = { month: short ? 'short' : 'long' };
    return dateObj.toLocaleDateString('it-IT', options);
  }

  /**
   * Verifica se una data è oggi
   * @param {Date|string} date - Data da verificare
   * @returns {boolean} True se la data è oggi
   */
  static isToday(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    
    return dateObj.getDate() === today.getDate() &&
           dateObj.getMonth() === today.getMonth() &&
           dateObj.getFullYear() === today.getFullYear();
  }

  /**
   * Verifica se una data è domani
   * @param {Date|string} date - Data da verificare
   * @returns {boolean} True se la data è domani
   */
  static isTomorrow(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return dateObj.getDate() === tomorrow.getDate() &&
           dateObj.getMonth() === tomorrow.getMonth() &&
           dateObj.getFullYear() === tomorrow.getFullYear();
  }

  /**
   * Verifica se una data è nel futuro
   * @param {Date|string} date - Data da verificare
   * @returns {boolean} True se la data è nel futuro
   */
  static isFuture(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    
    return dateObj.getTime() > now.getTime();
  }

  /**
   * Verifica se una data è nel passato
   * @param {Date|string} date - Data da verificare
   * @returns {boolean} True se la data è nel passato
   */
  static isPast(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    
    return dateObj.getTime() < now.getTime();
  }

  /**
   * Aggiunge giorni a una data
   * @param {Date|string} date - Data base
   * @param {number} days - Giorni da aggiungere
   * @returns {Date} Nuova data
   */
  static addDays(date, days) {
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
    dateObj.setDate(dateObj.getDate() + days);
    return dateObj;
  }

  /**
   * Sottrae giorni da una data
   * @param {Date|string} date - Data base
   * @param {number} days - Giorni da sottrarre
   * @returns {Date} Nuova data
   */
  static subtractDays(date, days) {
    return this.addDays(date, -days);
  }

  /**
   * Calcola la differenza in giorni tra due date
   * @param {Date|string} date1 - Prima data
   * @param {Date|string} date2 - Seconda data
   * @returns {number} Differenza in giorni
   */
  static daysDifference(date1, date2) {
    const dateObj1 = typeof date1 === 'string' ? new Date(date1) : date1;
    const dateObj2 = typeof date2 === 'string' ? new Date(date2) : date2;
    
    const diffMs = dateObj2.getTime() - dateObj1.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Ottiene il primo giorno del mese
   * @param {Date|string} date - Data di riferimento
   * @returns {Date} Primo giorno del mese
   */
  static getFirstDayOfMonth(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
    return new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
  }

  /**
   * Ottiene l'ultimo giorno del mese
   * @param {Date|string} date - Data di riferimento
   * @returns {Date} Ultimo giorno del mese
   */
  static getLastDayOfMonth(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
    return new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
  }

  /**
   * Ottiene una data per il selettore di date HTML (YYYY-MM-DD)
   * @param {Date|string} date - Data da convertire
   * @returns {string} Data in formato YYYY-MM-DD
   */
  static toInputDate(date) {
    return this.formatDateISO(date);
  }

  /**
   * Crea una data dalla stringa del selettore HTML
   * @param {string} inputDate - Data nel formato YYYY-MM-DD
   * @returns {Date} Oggetto Date
   */
  static fromInputDate(inputDate) {
    return new Date(inputDate + 'T00:00:00');
  }

  /**
   * Ottiene l'ora attuale in formato HH:MM
   * @returns {string} Ora attuale
   */
  static getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Verifica se una data è in un range
   * @param {Date|string} date - Data da verificare
   * @param {Date|string} startDate - Data inizio range
   * @param {Date|string} endDate - Data fine range
   * @returns {boolean} True se la data è nel range
   */
  static isDateInRange(date, startDate, endDate) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const startObj = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const endObj = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    return dateObj >= startObj && dateObj <= endObj;
  }

  /**
   * Genera un array di date per un range
   * @param {Date|string} startDate - Data inizio
   * @param {Date|string} endDate - Data fine
   * @returns {Array<Date>} Array di date
   */
  static getDateRange(startDate, endDate) {
    const dates = [];
    const currentDate = typeof startDate === 'string' ? new Date(startDate) : new Date(startDate);
    const lastDate = typeof endDate === 'string' ? new Date(endDate) : new Date(endDate);
    
    while (currentDate <= lastDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  }

  /**
   * Ottiene la data attuale senza orario (inizio giornata)
   * @returns {Date} Data attuale alle 00:00:00
   */
  static getToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  /**
   * Ottiene la data di domani senza orario
   * @returns {Date} Data di domani alle 00:00:00
   */
  static getTomorrow() {
    const tomorrow = this.getToday();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }
}

export default DateUtils; 