export class StudioDetailPage {
    constructor() {
        this.studioId = null;
    }

    async afterRender() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Get studio ID from URL
            const params = new URLSearchParams(window.location.search);
            this.studioId = params.get('id');

            if (!this.studioId) {
                throw new Error('Studio ID not provided');
            }

            // Load studio data
            const studioData = await this.loadStudioData(this.studioId);
            this.renderStudioDetails(studioData);
        } catch (error) {
            console.error('Error in studio detail page:', error);
            this.showErrorMessage('Unable to load studio details. Please try again.');
        }
    }

    async loadStudioData(studioId) {
        try {
            const response = await fetch(`/api/studios/${studioId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch studio data');
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading studio data:', error);
            throw error;
        }
    }

    renderStudioDetails(studioData) {
        const elements = {
            name: document.querySelector('#studio-name'),
            description: document.querySelector('#studio-description'),
            address: document.querySelector('#studio-address'),
            // Add other elements as needed
        };

        // Check if all required elements exist
        if (Object.values(elements).some(el => !el)) {
            throw new Error('Required studio detail elements not found');
        }

        // Set content safely
        elements.name.textContent = studioData.name;
        elements.description.textContent = studioData.description;
        elements.address.textContent = studioData.address;
    }

    showErrorMessage(message) {
        const errorElement = document.querySelector('#error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
} 