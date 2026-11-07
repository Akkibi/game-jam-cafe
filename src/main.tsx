import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { blockSafariPinchZoom } from './utils/device';
import { enableFullscreenOnFirstTap } from './utils/fullscreen';

blockSafariPinchZoom();
enableFullscreenOnFirstTap();

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
