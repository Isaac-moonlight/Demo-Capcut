import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { RestaurantProvider } from './context/RestaurantContext';
import { TourProvider } from './context/TourContext';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <RestaurantProvider>
      <TourProvider>
        <App />
      </TourProvider>
    </RestaurantProvider>
  </ThemeProvider>
);

