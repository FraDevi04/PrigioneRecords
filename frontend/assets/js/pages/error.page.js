/**
 * @fileoverview Error page component.
 */
export const ErrorPage = {
    render: (error) => {
        console.log('🔍 Error page render called with:', error);
        
        // Ensure error is an object
        const errorObj = error || {};
        
        // Default error message if no error is provided
        const errorMessage = errorObj.message || 'Si è verificato un errore imprevisto';
        const errorCode = errorObj.code || 'ERRORE';
        
        return `
            <div class="error-page">
                <div class="error-container">
                    <h1>Errore ${errorCode}</h1>
                    <p>${errorMessage}</p>
                    <div class="error-actions">
                        <button class="btn btn-primary" onclick="window.history.back()">Torna Indietro</button>
                        <a href="#/" class="btn btn-secondary">Torna alla Home</a>
                    </div>
                </div>
            </div>
        `;
    },
    afterRender: () => {
        console.log('✅ Error page rendered');
    }
};

// Add default export for backward compatibility
export default ErrorPage; 