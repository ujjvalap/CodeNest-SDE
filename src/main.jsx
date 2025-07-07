// // main.jsx
// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App.jsx';
// import QuestionsState from './context/questions/QuestionsState';
// import './index.css';

// // Grab the root DOM node
// const rootElement = document.getElementById('root');

// // Ensure the element exists before rendering
// if (rootElement) {
//   const root = createRoot(rootElement);
//   root.render(
//     <React.StrictMode>
//       <QuestionsState>
//         <App />
//       </QuestionsState>
//     </React.StrictMode>
//   );
// }



// // src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';

import "./index.css"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
