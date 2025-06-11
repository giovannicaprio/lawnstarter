import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import PersonDetailsPage from './pages/PersonDetailsPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import StatsPage from './pages/StatsPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <header className="header">
        <h1 className="header-title">SWStarter</h1>
        <nav style={{ position: 'absolute', right: 32, top: 24 }}>
          <Link to="/" style={{ marginRight: 24, color: '#1ec87a', fontWeight: 600, textDecoration: 'none' }}>Search</Link>
          <Link to="/stats" style={{ color: '#1ec87a', fontWeight: 600, textDecoration: 'none' }}>Stats</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/person/:id" element={<PersonDetailsPage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </Router>
  </QueryClientProvider>
);

export default App;