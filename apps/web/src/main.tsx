import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import App from './App';
import { BuggyCounter } from './components/BuggyCounter';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

const About = () => {
  return <h2>About Page</h2>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <nav style={{ marginBottom: 16 }}>
          <Link to="/">Home</Link> | <Link to="/about">About</Link> |{' '}
          <Link to="/buggy">Buggy Counter</Link>
        </nav>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route path="/buggy" element={<BuggyCounter />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
