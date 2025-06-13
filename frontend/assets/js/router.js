/**
 * @fileoverview Router for SPA navigation.
 * Uses hash-based routing for simplicity and compatibility.
 */

import { ErrorPage } from './pages/error.page.js';

class Router {
    constructor(routes) {
        if (!routes || typeof routes !== 'object') {
            throw new Error('Routes must be an object');
        }
        this.routes = routes;
        this.currentPath = '';
        this.currentParams = {};
        this.currentQuery = {};
        
        // Bind methods
        this.handleRouteChange = this.handleRouteChange.bind(this);
        this.navigate = this.navigate.bind(this);
        
        // Add event listener for hash changes
        window.addEventListener('hashchange', this.handleRouteChange);
        
        // Initial route handling
        this.handleRouteChange();
    }

    findMatchingRoute(path) {
        const pathParts = path.split('/');
        
        // Convert routes object to array of [path, route] pairs
        const routeEntries = Object.entries(this.routes);
        
        for (const [routePath, routeConfig] of routeEntries) {
            const routeParts = routePath.split('/');
            if (routeParts.length !== pathParts.length) continue;
            
            const params = {};
            const isMatch = routeParts.every((part, i) => {
                if (part.startsWith(':')) {
                    params[part.slice(1)] = pathParts[i];
                    return true;
                }
                return part === pathParts[i];
            });

            if (isMatch) {
                return { route: routeConfig, params };
            }
        }
        
        return null;
    }

    async handleRouteChange() {
        try {
            console.log('🔄 Router: Handling route change');
            const hash = window.location.hash.slice(1) || '/';
            console.log('📍 Current hash:', hash);
            
            // Parse query parameters
            const [path, queryString] = hash.split('?');
            this.currentQuery = {};
            if (queryString) {
                this.currentQuery = Object.fromEntries(
                    new URLSearchParams(queryString)
                );
            }
            
            // Find matching route
            const match = this.findMatchingRoute(path);
            if (!match) {
                console.log('❌ No matching route found for:', path);
                // Redirect to 404 page
                this.navigate('/404');
                return;
            }
            
            const { route, params } = match;
            this.currentPath = path;
            this.currentParams = params;
            
            console.log('✅ Found matching route:', route);
            console.log('📋 Route params:', this.currentParams);
            console.log('🔍 Query params:', this.currentQuery);
            
            // Check if route is protected
            if (route.protected && !window.stores?.auth?.getState()?.isAuthenticated) {
                console.log('🔒 Protected route, redirecting to login');
                this.navigate('/login');
                return;
            }
            
            // Ensure page container exists
            let pageContainer = document.querySelector('.page-container');
            if (!pageContainer) {
                console.log('⚠️ Page container not found, creating one...');
                pageContainer = document.createElement('div');
                pageContainer.className = 'page-container';
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.appendChild(pageContainer);
                } else {
                    console.error('❌ Main content container not found');
                    // Create main content if it doesn't exist
                    const newMainContent = document.createElement('div');
                    newMainContent.id = 'main-content';
                    newMainContent.appendChild(pageContainer);
                    document.body.appendChild(newMainContent);
                }
            }
            
            try {
                // Load the component if it's a dynamic import
                const component = typeof route.component === 'function' 
                    ? (await route.component()).default 
                    : route.component;
                
                if (!component || typeof component.render !== 'function') {
                    throw new Error(`Invalid component for route ${path}`);
                }

                const content = await component.render(this.currentParams);
                if (!content) {
                    throw new Error(`Component for route ${path} returned no content`);
                }

                pageContainer.innerHTML = content;
                
                if (component.afterRender) {
                    await component.afterRender(this.currentParams);
                }

                // Update page title
                if (route.title) {
                    document.title = route.title;
                }
            } catch (error) {
                console.error('❌ Error rendering page:', error);
                throw error;
            }
            
        } catch (error) {
            console.error('❌ Error during route change:', error);
            this.handleError(error);
        }
    }

    handleError(error) {
        let pageContainer = document.querySelector('.page-container');
        if (!pageContainer) {
            console.log('⚠️ Creating error container...');
            pageContainer = document.createElement('div');
            pageContainer.className = 'page-container';
            const mainContent = document.getElementById('main-content') || document.createElement('div');
            if (!mainContent.id) {
                mainContent.id = 'main-content';
                document.body.appendChild(mainContent);
            }
            mainContent.appendChild(pageContainer);
        }

        try {
            const errorContent = ErrorPage.render({
                code: error.status || '500',
                message: error.message || 'Si è verificato un errore imprevisto'
            });
            pageContainer.innerHTML = errorContent;
            if (ErrorPage.afterRender) {
                ErrorPage.afterRender();
            }
        } catch (renderError) {
            console.error('❌ Error rendering error page:', renderError);
            pageContainer.innerHTML = `
                <div class="error-container">
                    <h1>Errore</h1>
                    <p>${error.message || 'Si è verificato un errore imprevisto'}</p>
                    <button onclick="window.router.navigate('/')">Torna alla Home</button>
                </div>
            `;
        }
    }

    navigate(path) {
        console.log('🎯 Router: Navigating to:', path);
        window.location.hash = path;
    }
}

export default Router; 