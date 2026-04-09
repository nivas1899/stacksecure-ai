import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeModeProvider } from 'context/ThemeContext';
import ThemedApp from 'ThemedApp';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <ThemedApp />
    </ThemeModeProvider>
  </React.StrictMode>,
);
