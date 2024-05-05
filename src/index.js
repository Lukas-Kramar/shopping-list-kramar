import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './components/header/user';
import 'bootstrap/dist/css/bootstrap.min.css';

//import 'bootstrap/dist/css/bootstrap.min.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

//language
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/en.json"
import cs from "./locales/cs/cs.json"

// mocking
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ENABLE_MOCKING } from './config';

import { ThemeProvider } from './components/theme-switcher/ThemeContext';

// router
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

//language
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en, },
    cs: { translation: cs, },
  },
  lng: "en", // Default language
  fallbackLng: "en", // Fallback language if translation is missing
  interpolation: {
    escapeValue: false, // React already escapes values to prevent XSS
  },
});

// icons
library.add(faSquare);

async function enableMocking() {
  if (ENABLE_MOCKING) {
    const { worker } = await import('./mocks/browser')

    // `worker.start()` returns a Promise that resolves
    // once the Service Worker is up and ready to intercept requests.
    return worker.start({
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
  }
  else { return; }
}

// Call enableMocking and render the app
enableMocking().then(() => {

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>

      <UserProvider>
        <ThemeProvider>

          <RouterProvider router={router} />

        </ThemeProvider>
      </UserProvider>

    </React.StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
