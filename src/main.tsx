import {StrictMode, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import i18n from './i18n';

function Root() {
  useEffect(() => {
    const updateLang = () => {
      document.documentElement.lang = i18n.language;
    };
    i18n.on('languageChanged', updateLang);
    updateLang();
    return () => i18n.off('languageChanged', updateLang);
  }, []);

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
