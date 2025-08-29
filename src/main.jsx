// // import { StrictMode } from 'react'
// // import { createRoot } from 'react-dom/client'
// // import './index.css'
// // import App from './index.jsx'

// // // Create root and render the app
// // const root = createRoot(document.getElementById('root'));

// // root.render(
// //   <StrictMode>
// //     <App />
// //   </StrictMode>
// // );

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App.jsx';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>
// );


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Index.css'
import App from './Index.jsx'

// Create root and render the app
const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);