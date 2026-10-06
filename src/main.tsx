import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { RestaurantProvider } from './context/RestaurantContext';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <RestaurantProvider>
      <App />
    </RestaurantProvider>
  </ThemeProvider>
);

