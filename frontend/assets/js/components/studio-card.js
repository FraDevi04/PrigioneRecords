/**
 * @fileoverview Component to render a single studio card.
 */

export function renderStudioCard(studio) {
    return `
        <div class="studio-card" data-studio-id="${studio.id}">
            <div class="studio-image">
                <img src="${studio.imageUrl || 'https://placehold.co/300x200/e2e8f0/1e293b?text=Studio'}" alt="${studio.nome}">
            </div>
            <div class="studio-info">
                <h3 class="studio-name">${studio.nome}</h3>
                <p class="studio-address">${studio.indirizzo}</p>
                <div class="studio-rating">
                    <div class="rating" data-value="${studio.mediaRecensioni || 0}">
                        ${'★'.repeat(Math.round(studio.mediaRecensioni || 0))}${'☆'.repeat(5 - Math.round(studio.mediaRecensioni || 0))}
                    </div>
                    <span class="rating-count">(${studio.numeroRecensioni || 0} recensioni)</span>
                </div>
                <a href="#/studi/${studio.id}" class="btn btn-primary studio-select">Dettagli</a>
            </div>
        </div>
    `;
} 