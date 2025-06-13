/**
 * @fileoverview Register page component
 */
import authStore from '../store/auth.store.js';

const RegisterPage = {
    render: () => {
        return `
            <div class="auth-layout">
                <div class="auth-container">
                    <div class="auth-logo">
                        <i class="fas fa-music"></i>
                        <span>PrigioneRecords</span>
                    </div>
                    <h2 class="auth-title">Crea il tuo account</h2>
                    <div id="register-error" class="alert alert-danger" style="display: none;"></div>
                    <form id="register-form" class="space-y-4" novalidate>
                        <div class="form-field">
                            <label for="nome" class="form-label">Nome <span class="required">*</span></label>
                            <input type="text" id="nome" name="nome" class="form-input" required>
                            <span class="form-error" style="display: none;"></span>
                        </div>
                        <div class="form-field">
                            <label for="email" class="form-label">Email <span class="required">*</span></label>
                            <input type="email" id="email" name="email" class="form-input" required>
                            <span class="form-error" style="display: none;"></span>
                        </div>
                        <div class="form-field">
                            <label for="password" class="form-label">Password <span class="required">*</span></label>
                            <input type="password" id="password" name="password" class="form-input" required minlength="6">
                            <span class="form-error" style="display: none;"></span>
                        </div>
                        <div class="form-field">
                            <label for="confirmPassword" class="form-label">Conferma Password <span class="required">*</span></label>
                            <input type="password" id="confirmPassword" name="confirmPassword" class="form-input" required>
                            <span class="form-error" style="display: none;"></span>
                        </div>
                        <button type="submit" id="register-btn" class="btn btn-primary btn-full">
                            <span class="btn-text">Registrati</span>
                            <div class="btn-loader" style="display: none;"></div>
                        </button>
                    </form>
                    <div class="auth-link">
                        Hai già un account? <a href="#/login">Accedi qui</a>
                    </div>
                </div>
            </div>
        `;
    },
    afterRender: async () => {
        const form = document.getElementById('register-form');
        const registerButton = document.getElementById('register-btn');
        const errorContainer = document.getElementById('register-error');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnText = registerButton.querySelector('.btn-text');
            const btnLoader = registerButton.querySelector('.btn-loader');

            if (form.password.value !== form.confirmPassword.value) {
                errorContainer.textContent = 'Le password non coincidono.';
                errorContainer.style.display = 'block';
                return;
            }

            errorContainer.style.display = 'none';
            registerButton.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'block';

            const userData = {
                nome: form.nome.value,
                email: form.email.value,
                password: form.password.value,
            };

            try {
                await authStore.register(userData);
                window.router.navigate('/dashboard');
            } catch (error) {
                console.error('Registration failed:', error);
                errorContainer.textContent = error.message || 'Errore durante la registrazione.';
                errorContainer.style.display = 'block';
            } finally {
                registerButton.disabled = false;
                btnText.style.display = 'block';
                btnLoader.style.display = 'none';
            }
        });
    }
};

export default RegisterPage; 