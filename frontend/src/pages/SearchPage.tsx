import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { getIdFromUrl } from '../utils/getIdFromUrl';
import { SwapiResponse } from '../types/swapi';

const API_URL = process.env.REACT_APP_API_URL || '';
const BACKEND_PEOPLE = `${API_URL}/api/star-wars/characters/search?q=`;
const BACKEND_MOVIES = `${API_URL}/api/star-wars/movies/search?q=`;

const SearchPage: React.FC = () => {
  const [searchType, setSearchType] = useState<'people' | 'movies'>('people');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [showResultsMobile, setShowResultsMobile] = useState(false);
  const navigate = useNavigate();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (query.trim().length >= 2) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        handleSearch();
        if (isMobile) setShowResultsMobile(true);
      }, 400);
    } else {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      setResults(null);
      setError(null);
      if (isMobile) setShowResultsMobile(false);
    }
  }, [query, searchType, isMobile]);

  const handleSearch = () => {
    if (query.trim().length < 2) return;
    setIsSearching(true);
    setError(null);
    const endpoint = searchType === 'people' ? BACKEND_PEOPLE : BACKEND_MOVIES;
    fetch(endpoint + encodeURIComponent(query.trim()))
      .then(async res => {
        if (!res.ok) {
          const err = await res.text();
          throw new Error(err || 'API error');
        }
        return res.json();
      })
      .then(data => {
        if (!data || typeof data !== 'object' || !Array.isArray(data.results)) {
          setError('Invalid response from backend');
          setResults(null);
        } else {
          setResults(data);
        }
        setIsSearching(false);
      })
      .catch(() => {
        setError('Error fetching data');
        setResults(null);
        setIsSearching(false);
      });
  };

  const hasResults = results && Array.isArray(results.results) && results.results.length > 0;

  if (isMobile) {
    return (
      <div className="main-content" style={{ minHeight: '100vh' }}>
        <section className="search-card">
          {!showResultsMobile && (
            <>
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
                placeholder="e.g. Chewbacca, Yoda"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </>
          )}
          {showResultsMobile && (
            <>
              <div className="results-title">Results</div>
              <hr className="results-divider" />
              <div className="results-empty">
                {error && <span style={{ color: 'red' }}>{error}</span>}
                {!error && (!hasResults) && (
                  <>
                    There are zero matches.<br />
                    Use the form to search for People or Movies.
                  </>
                )}
                {!error && hasResults && (
                  <ul className="results-list">
                    {results.results.map((item: any, idx: number) => (
                      <li className="results-item" key={idx}>
                        <span className="results-name">{searchType === 'people' ? item.name : item.title}</span>
                        <button className="details-btn" onClick={() => {
                          const id = getIdFromUrl(item.url, searchType === 'people' ? 'people' : 'films');
                          if (id) navigate(searchType === 'people' ? `/person/${id}` : `/movie/${id}`);
                        }}>
                          SEE DETAILS
                        </button>
                        {idx !== results.results.length - 1 && <div className="results-separator" />}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </section>
        <button
          className={`search-btn search-btn-mobile-fixed${isSearching ? ' searching' : ''}`}
          disabled={(!showResultsMobile && query.trim().length < 2) || isSearching}
          onClick={() => {
            if (showResultsMobile) {
              setShowResultsMobile(false);
            } else {
              handleSearch();
              setShowResultsMobile(true);
            }
          }}
        >
          {isSearching ? 'SEARCHING...' : (showResultsMobile ? 'BACK TO SEARCH' : 'SEARCH')}
        </button>
      </div>
    );
  }

  return (
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
        <button className="search-btn" disabled={query.trim().length < 2 || isSearching} onClick={handleSearch}>
          {isSearching ? 'SEARCHING...' : 'SEARCH'}
        </button>
      </section>
      <section className="results-card">
        <div className="results-title">Results</div>
        <hr className="results-divider" />
        <div className="results-empty">
          {error && <span style={{ color: 'red' }}>{error}</span>}
          {!error && (!hasResults) && (
            <>
              There are zero matches.<br />
              Use the form to search for People or Movies.
            </>
          )}
          {!error && hasResults && (
            <ul className="results-list">
              {results.results.map((item: any, idx: number) => (
                <li className="results-item" key={idx}>
                  <span className="results-name">{searchType === 'people' ? item.name : item.title}</span>
                  <button className="details-btn" onClick={() => {
                    const id = getIdFromUrl(item.url, searchType === 'people' ? 'people' : 'films');
                    if (id) navigate(searchType === 'people' ? `/person/${id}` : `/movie/${id}`);
                  }}>
                    SEE DETAILS
                  </button>
                  {idx !== results.results.length - 1 && <div className="results-separator" />}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
};

export default SearchPage; 