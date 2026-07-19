import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import { GameProvider } from './contexts/GameContext';
import './styles/global.css';

registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(<StrictMode><GameProvider><App /></GameProvider></StrictMode>);
