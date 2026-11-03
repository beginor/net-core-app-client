import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app';
import './styles.css';

const params = new URLSearchParams(window.location.search);
const tmpToken = params.get('tmpToken');
if (tmpToken) {
    sessionStorage.setItem('tmpToken', tmpToken);
}

const container = document.getElementById('app-root');
if (container) {
    createRoot(container).render(
        <StrictMode>
            <App />
        </StrictMode>,
    );
}
