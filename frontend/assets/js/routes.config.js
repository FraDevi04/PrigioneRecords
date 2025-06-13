/**
 * @fileoverview Route definitions for the application.
 */

const routes = {
    '/': {
        component: () => import('./pages/home.page.js'),
        title: 'Home | PrigioneRecords'
    },
    '/login': {
        component: () => import('./pages/login.page.js'),
        title: 'Login | PrigioneRecords'
    },
    '/register': {
        component: () => import('./pages/register.page.js'),
        title: 'Registrati | PrigioneRecords'
    },
    '/dashboard': {
        component: () => import('./pages/dashboard.page.js'),
        title: 'Dashboard | PrigioneRecords',
        protected: true
    },
    '/studi': {
        component: () => import('./pages/studi.page.js'),
        title: 'Studi | PrigioneRecords'
    },
    '/studi/:id': {
        component: () => import('./pages/studio-detail.page.js'),
        title: 'Dettaglio Studio | PrigioneRecords'
    },
    '/prenotazioni': {
        component: () => import('./pages/prenotazioni.page.js'),
        title: 'Le Mie Prenotazioni | PrigioneRecords',
        protected: true
    },
    '/prenotazioni/nuova': {
        component: () => import('./pages/nuova-prenotazione.page.js'),
        title: 'Nuova Prenotazione | PrigioneRecords',
        protected: true,
        exact: true
    },
    '/profilo': {
        component: () => import('./pages/profilo.page.js'),
        title: 'Il Mio Profilo | PrigioneRecords',
        protected: true
    },
    '/404': {
        component: () => import('./pages/error.page.js'),
        title: '404 Not Found | PrigioneRecords'
    }
    // TODO: Add other routes from PDR
    // '/recensioni': 'recensioni',
    // '/admin': 'admin'
};

export default routes; 