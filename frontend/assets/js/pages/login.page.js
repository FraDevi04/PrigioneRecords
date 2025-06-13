/**
 * @fileoverview Login page component
 */
// import { authService } from '../services/auth.service.js';
import authStore from '../store/auth.store.js';
import { ErrorPage } from './error.page.js';

const LoginPage = {
    render: () => {
        return `
            <div class="auth-layout">
                <div class="auth-container">
                    <div class="auth-logo">
                        <i class="fas fa-music"></i>
                        <span>PrigioneRecords</span>
                    </div>
                    <h2 class="auth-title">Accedi al tuo account</h2>
                    <div id="login-error" class="alert alert-danger" style="display: none;"></div>
                    <form id="login-form" class="space-y-4" novalidate>
                        <div class="form-field">
                            <label for="email" class="form-label">Email <span class="required">*</span></label>
                            <input type="email" id="email" name="email" class="form-input" required autocomplete="email">
                            <span class="form-error" style="display: none;"></span>
                        </div>
                        <div class="form-field">
                            <label for="password" class="form-label">Password <span class="required">*</span></label>
                            <input type="password" id="password" name="password" class="form-input" required autocomplete="current-password">
                            <span class="form-error" style="display: none;"></span>
                        </div>
                        <button type="submit" id="login-btn" class="btn btn-primary btn-full">
                            <span class="btn-text">Accedi</span>
                            <div class="btn-loader" style="display: none;"></div>
                        </button>
                    </form>
                    <div class="auth-link">
                        Non hai un account? <a href="#/register">Registrati qui</a>
                    </div>
                </div>
            </div>
        `;
    },
    afterRender: async () => {
        const form = document.getElementById('login-form');
        const loginButton = document.getElementById('login-btn');
        const errorContainer = document.getElementById('login-error');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnText = loginButton.querySelector('.btn-text');
            const btnLoader = loginButton.querySelector('.btn-loader');

            // Reset previous errors
            errorContainer.style.display = 'none';
            errorContainer.textContent = '';
            
            // Show loading state
            loginButton.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'block';

            const credentials = {
                email: form.email.value,
                password: form.password.value,
            };

            try {
                await authStore.login(credentials);
                // Check if there's a redirect path stored
                const redirectPath = localStorage.getItem('redirectAfterLogin');
                if (redirectPath) {
                    localStorage.removeItem('redirectAfterLogin');
                    window.router.navigate(redirectPath);
                } else {
                    window.router.navigate('/dashboard');
                }
            } catch (error) {
                console.error('Login failed:', error);
                errorContainer.textContent = error.message || 'Credenziali non valide. Riprova.';
                errorContainer.style.display = 'block';
            } finally {
                // Hide loading state
                loginButton.disabled = false;
                btnText.style.display = 'block';
                btnLoader.style.display = 'none';
            }
        });
    }
};

export default LoginPage; 