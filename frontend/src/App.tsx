import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || '';
const BACKEND_PEOPLE = `${API_URL}/api/star-wars/characters/search?q=`;
const BACKEND_MOVIES = `${API_URL}/api/star-wars/movies/search?q=`;

const App: React.FC = () => {
  const [searchType, setSearchType] = useState<'people' | 'movies'>('people');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim().length >= 2) {
      setIsSearching(true);
      setError(null);
      const endpoint = searchType === 'people' ? BACKEND_PEOPLE : BACKEND_MOVIES;
      fetch(endpoint + encodeURIComponent(query.trim()))
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setIsSearching(false);
        })
        .catch(() => {
          setError('Error fetching data');
          setIsSearching(false);
        });
    } else {
      setResults(null);
      setIsSearching(false);
    }
  }, [query, searchType]);

  return (
    <div className="app-bg">
      <header className="header">
        <h1 className="header-title">SWStarter</h1>
      </header>
      <main className="main-content">
        <section className="search-card">
          <div className="search-title">What are you searching for?</div>
          <div className="search-type-group">
            <label className="radio-label">
              <input
                type="radio"
                name="searchType"
                checked={searchType === 'people'}
                onChange={() => setSearchType('people')}
              />
              <span>People</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="searchType"
                checked={searchType === 'movies'}
                onChange={() => setSearchType('movies')}
              />
              <span>Movies</span>
            </label>
          </div>
          <input
            className="search-input"
            type="text"
            placeholder="e.g. Chewbacca, Yoda, Boba Fett"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="search-btn" disabled={query.trim().length < 2 || isSearching}>
            {isSearching ? 'SEARCHING' : 'SEARCH'}
          </button>
        </section>
        <section className="results-card">
          <div className="results-title">Results</div>
          <hr className="results-divider" />
          <div className="results-empty">
            {error && <span style={{color: 'red'}}>{error}</span>}
            {!error && (!results || !results.results || results.results.length === 0) && (
              <>
                There are zero matches.<br />
                Use the form to search for People or Movies.
              </>
            )}
            {!error && results && results.results && results.results.length > 0 && (
              <ul style={{padding: 0, margin: 0, listStyle: 'none', width: '100%'}}>
                {results.results.map((item: any, idx: number) => (
                  <li key={idx} style={{textAlign: 'left', marginBottom: 12}}>
                    {searchType === 'people' ? item.name : item.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App; 