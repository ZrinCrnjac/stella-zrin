import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import Firebase functions as named imports
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app’s Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBHQcgFuCGwvgx6xlVkL8e2YR0jPocf50",
  authDomain: "stella-zrin-wedding.firebaseapp.com",
  projectId: "stella-zrin-wedding",
  storageBucket: "stella-zrin-wedding.appspot.com",
  messagingSenderId: "872146637053",
  appId: "1:872146637053:web:a79aae997223b3b862ae94",
  measurementId: "G-F15BWRDPD7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export `db` for use in other files
export { db };

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();