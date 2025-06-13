/**
 * Button Component - Componente avanzato per i bottoni
 */
class ButtonComponent {
  constructor(element) {
    this.element = element;
    this.loader = element.querySelector('.btn-loader');
    this.text = element.querySelector('.btn-text');
    this.originalText = this.text?.textContent || '';
    this.isLoading = false;
    
    this.init();
  }

  init() {
    // Aggiungi event listeners per animazioni hover
    this.element.addEventListener('mouseenter', this.onMouseEnter.bind(this));
    this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    
    // Gestione click con ripple effect
    this.element.addEventListener('click', this.onClick.bind(this));
    
    // Gestione keyboard navigation
    this.element.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  /**
   * Imposta lo stato di loading del bottone
   * @param {boolean} loading - Stato di loading
   * @param {string} loadingText - Testo da mostrare durante il loading (opzionale)
   */
  setLoading(loading, loadingText = null) {
    this.isLoading = loading;
    
    if (loading) {
      if (this.text) {
        if (loadingText) {
          this.text.textContent = loadingText;
        }
        this.text.style.display = 'none';
      }
      
      if (this.loader) {
        this.loader.style.display = 'inline-block';
      }
      
      this.element.disabled = true;
      this.element.classList.add('btn-loading');
    } else {
      if (this.text) {
        this.text.textContent = this.originalText;
        this.text.style.display = 'inline-block';
      }
      
      if (this.loader) {
        this.loader.style.display = 'none';
      }
      
      this.element.disabled = false;
      this.element.classList.remove('btn-loading');
    }
  }

  /**
   * Cambia il testo del bottone
   * @param {string} text - Nuovo testo
   */
  setText(text) {
    this.originalText = text;
    if (this.text && !this.isLoading) {
      this.text.textContent = text;
    }
  }

  /**
   * Cambia la variante del bottone
   * @param {string} variant - Nuova variante (primary, secondary, danger, etc.)
   */
  setVariant(variant) {
    // Rimuovi varianti esistenti
    const variants = ['btn-primary', 'btn-secondary', 'btn-outline', 'btn-danger', 'btn-success'];
    variants.forEach(v => this.element.classList.remove(v));
    
    // Aggiungi nuova variante
    this.element.classList.add(`btn-${variant}`);
  }

  /**
   * Abilita/disabilita il bottone
   * @param {boolean} disabled - Stato disabilitato
   */
  setDisabled(disabled) {
    this.element.disabled = disabled;
    this.element.classList.toggle('disabled', disabled);
  }

  /**
   * Simula un click del bottone
   */
  click() {
    if (!this.element.disabled && !this.isLoading) {
      this.element.click();
    }
  }

  /**
   * Aggiungi un tooltip al bottone
   * @param {string} text - Testo del tooltip
   */
  setTooltip(text) {
    this.element.title = text;
    this.element.setAttribute('data-tooltip', text);
  }

  /**
   * Gestisce l'hover del mouse
   */
  onMouseEnter() {
    if (!this.element.disabled && !this.isLoading) {
      this.element.classList.add('hover');
    }
  }

  onMouseLeave() {
    this.element.classList.remove('hover');
  }

  /**
   * Gestisce il click con ripple effect
   */
  onClick(e) {
    if (this.element.disabled || this.isLoading) {
      e.preventDefault();
      return;
    }

    // Crea ripple effect
    this.createRipple(e);
  }

  /**
   * Crea l'effetto ripple
   */
  createRipple(e) {
    const ripple = document.createElement('span');
    const rect = this.element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    this.element.appendChild(ripple);
    
    // Rimuovi ripple dopo l'animazione
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  /**
   * Gestisce la navigazione da tastiera
   */
  onKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.click();
    }
  }

  /**
   * Distrugge il componente
   */
  destroy() {
    this.element.removeEventListener('mouseenter', this.onMouseEnter);
    this.element.removeEventListener('mouseleave', this.onMouseLeave);
    this.element.removeEventListener('click', this.onClick);
    this.element.removeEventListener('keydown', this.onKeyDown);
  }
}

/**
 * Button Group Component - Gestisce gruppi di bottoni
 */
class ButtonGroup {
  constructor(element) {
    this.element = element;
    this.buttons = Array.from(element.querySelectorAll('.btn'));
    this.activeButton = element.querySelector('.btn.active');
    
    this.init();
  }

  init() {
    this.buttons.forEach(button => {
      button.addEventListener('click', this.onButtonClick.bind(this, button));
    });
  }

  onButtonClick(clickedButton) {
    // Rimuovi active da tutti i bottoni
    this.buttons.forEach(btn => btn.classList.remove('active'));
    
    // Aggiungi active al bottone cliccato
    clickedButton.classList.add('active');
    this.activeButton = clickedButton;
    
    // Trigger custom event
    const event = new CustomEvent('buttonGroupChange', {
      detail: {
        activeButton: clickedButton,
        value: clickedButton.textContent,
        index: this.buttons.indexOf(clickedButton)
      }
    });
    this.element.dispatchEvent(event);
  }

  setActive(index) {
    if (index >= 0 && index < this.buttons.length) {
      this.onButtonClick(this.buttons[index]);
    }
  }

  getActiveIndex() {
    return this.buttons.indexOf(this.activeButton);
  }

  getActiveValue() {
    return this.activeButton?.textContent || null;
  }
}

/**
 * Factory function per creare istanze di ButtonComponent
 */
function createButton(selector, options = {}) {
  const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!element) return null;
  
  const button = new ButtonComponent(element);
  
  // Applica opzioni se fornite
  if (options.variant) button.setVariant(options.variant);
  if (options.text) button.setText(options.text);
  if (options.disabled) button.setDisabled(options.disabled);
  if (options.tooltip) button.setTooltip(options.tooltip);
  
  return button;
}

/**
 * Factory function per creare istanze di ButtonGroup
 */
function createButtonGroup(selector) {
  const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!element) return null;
  
  return new ButtonGroup(element);
}

/**
 * Inizializza automaticamente tutti i bottoni nella pagina
 */
function initButtons() {
  // Inizializza tutti i button groups
  document.querySelectorAll('.btn-group').forEach(group => {
    if (!group._buttonGroup) {
      group._buttonGroup = new ButtonGroup(group);
    }
  });
  
  // Inizializza bottoni singoli con data-attributes
  document.querySelectorAll('.btn[data-auto-init]').forEach(button => {
    if (!button._buttonComponent) {
      button._buttonComponent = new ButtonComponent(button);
    }
  });
}

// Auto-inizializzazione quando il DOM è pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initButtons);
} else {
  initButtons();
}

// Aggiungi CSS per il ripple effect se non presente
if (!document.querySelector('#button-component-styles')) {
  const style = document.createElement('style');
  style.id = 'button-component-styles';
  style.textContent = `
    .btn {
      position: relative;
      overflow: hidden;
    }
    
    .ripple {
      position: absolute;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.4);
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    .btn:focus {
      outline: 2px solid var(--primary-500);
      outline-offset: 2px;
    }
    
    .btn.hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
    
    .btn:active {
      transform: translateY(0);
    }
    
    .btn.btn-loading {
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
}

export { ButtonComponent, ButtonGroup, createButton, createButtonGroup, initButtons }; 