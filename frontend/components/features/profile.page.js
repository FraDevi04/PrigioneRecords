export class ProfilePage {
    constructor() {
        this.userData = null;
    }

    async afterRender() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            await this.loadProfileData();
        } catch (error) {
            console.error('Error in profile page:', error);
            this.showErrorMessage('Unable to load profile data. Please try again.');
        }
    }

    async loadProfileData() {
        try {
            const response = await fetch('/api/user/profile');
            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }
            this.userData = await response.json();
            this.renderProfileData();
        } catch (error) {
            console.error('Error loading profile data:', error);
            throw error;
        }
    }

    renderProfileData() {
        const elements = {
            name: document.querySelector('#profile-name'),
            email: document.querySelector('#profile-email'),
            phone: document.querySelector('#profile-phone'),
            // Add other elements as needed
        };

        // Check if all required elements exist
        if (Object.values(elements).some(el => !el)) {
            throw new Error('Required profile elements not found');
        }

        // Set content safely
        elements.name.textContent = this.userData.name;
        elements.email.textContent = this.userData.email;
        elements.phone.textContent = this.userData.phone || 'N/A';
    }

    showErrorMessage(message) {
        const errorElement = document.querySelector('#error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
} 