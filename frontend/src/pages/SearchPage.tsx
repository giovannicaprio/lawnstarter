import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { getIdFromUrl } from '../utils/getIdFromUrl';
import { SwapiResponse } from '../types/swapi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';
const BACKEND_PEOPLE = `${API_URL}/api/star-wars/characters/search?q=`;
const BACKEND_MOVIES = `${API_URL}/api/star-wars/movies/search?q=`;

const fetchResults = async (type: string, query: string) => {
  if (!query || query.length < 2) return [];
  const endpoint = type === 'people' ? '/api/star-wars/characters/search' : '/api/star-wars/movies/search';
  const res = await axios.get(`${endpoint}?q=${encodeURIComponent(query)}`);
  return res.data.results;
};

const fetchDetails = async (type: string, id: string) => {
  const endpoint = type === 'people' ? `/api/star-wars/characters/${id}` : `/api/star-wars/movies/${id}`;
  const res = await axios.get(endpoint);
  return res.data;
};

const SearchPage: React.FC = () => {
  const [searchType, setSearchType] = useState<'people' | 'movies'>('people');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [showResultsMobile, setShowResultsMobile] = useState(false);
  const navigate = useNavigate();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  const {
    data: resultsQuery = [],
    isLoading: queryLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ['search', searchType, query],
    queryFn: () => fetchResults(searchType, query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (query.trim().length >= 2) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        refetch();
        if (isMobile) setShowResultsMobile(true);
      }, 400);
    } else {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      setResults(null);
      setError(null);
      if (isMobile) setShowResultsMobile(false);
    }
  }, [query, searchType, isMobile, refetch]);

  useEffect(() => {
    if (resultsQuery && Array.isArray(resultsQuery) && resultsQuery.length > 0) {
      resultsQuery.slice(0, 3).forEach((item: any) => {
        const id = getIdFromUrl(item.url, searchType === 'people' ? 'people' : 'films');
        if (id) {
          queryClient.prefetchQuery({
            queryKey: [searchType, 'details', id],
            queryFn: () => fetchDetails(searchType, id),
            staleTime: 1000 * 60 * 10, // 10 minutos
          });
        }
      });
    }
  }, [resultsQuery, searchType, queryClient]);

  const hasResults = resultsQuery && Array.isArray(resultsQuery) && resultsQuery.length > 0;

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
                {queryError && <span style={{ color: 'red' }}>{queryError.message}</span>}
                {!queryError && (!hasResults) && (
                  <>
                    There are zero matches.<br />
                    Use the form to search for People or Movies.
                  </>
                )}
                {!queryError && hasResults && (
                  <ul className="results-list">
                    {resultsQuery.map((item: any, idx: number) => (
                      <li className="results-item" key={idx}>
                        <span className="results-name">{searchType === 'people' ? item.name : item.title}</span>
                        <button className="details-btn" onClick={() => {
                          const id = getIdFromUrl(item.url, searchType === 'people' ? 'people' : 'films');
                          if (id) navigate(searchType === 'people' ? `/person/${id}` : `/movie/${id}`);
                        }}>
                          SEE DETAILS
                        </button>
                        {idx !== resultsQuery.length - 1 && <div className="results-separator" />}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </section>
        <section className="results-card">
          {queryLoading && (
            <div className="loader" style={{ textAlign: 'center', padding: '2em 0', fontWeight: 600, color: '#1ec87a' }}>
              Searching...
            </div>
          )}
          <div className="results-title">Results</div>
          <hr className="results-divider" />
          <div className="results-empty">
            {queryError && <span style={{ color: 'red' }}>{queryError.message}</span>}
            {!queryError && (!hasResults) && (
              <>
                There are zero matches.<br />
                Use the form to search for People or Movies.
              </>
            )}
            {!queryError && hasResults && (
              <ul className="results-list">
                {resultsQuery.map((item: any, idx: number) => (
                  <li className="results-item" key={idx}>
                    <span className="results-name">{searchType === 'people' ? item.name : item.title}</span>
                    <button className="details-btn" onClick={() => {
                      const id = getIdFromUrl(item.url, searchType === 'people' ? 'people' : 'films');
                      if (id) navigate(searchType === 'people' ? `/person/${id}` : `/movie/${id}`);
                    }}>
                      SEE DETAILS
                    </button>
                    {idx !== resultsQuery.length - 1 && <div className="results-separator" />}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
        <button
          className={`search-btn search-btn-mobile-fixed${queryLoading ? ' searching' : ''}`}
          disabled={(!showResultsMobile && query.trim().length < 2) || queryLoading}
          onClick={() => {
            if (showResultsMobile) {
              setShowResultsMobile(false);
            } else {
              if (query.trim().length >= 2) refetch();
              setShowResultsMobile(true);
            }
          }}
        >
          {queryLoading ? 'SEARCHING...' : (showResultsMobile ? 'BACK TO SEARCH' : 'SEARCH')}
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
        <button className="search-btn" disabled={query.trim().length < 2 || queryLoading} onClick={() => {
          if (query.trim().length >= 2) refetch();
        }}>
          {queryLoading ? 'SEARCHING...' : 'SEARCH'}
        </button>
      </section>
      <section className="results-card">
        {queryLoading && (
          <div className="loader" style={{ textAlign: 'center', padding: '2em 0', fontWeight: 600, color: '#1ec87a' }}>
            Searching...
          </div>
        )}
        <div className="results-title">Results</div>
        <hr className="results-divider" />
        <div className="results-empty">
          {queryError && <span style={{ color: 'red' }}>{queryError.message}</span>}
          {!queryError && (!hasResults) && (
            <>
              There are zero matches.<br />
              Use the form to search for People or Movies.
            </>
          )}
          {!queryError && hasResults && (
            <ul className="results-list">
              {resultsQuery.map((item: any, idx: number) => (
                <li className="results-item" key={idx}>
                  <span className="results-name">{searchType === 'people' ? item.name : item.title}</span>
                  <button className="details-btn" onClick={() => {
                    const id = getIdFromUrl(item.url, searchType === 'people' ? 'people' : 'films');
                    if (id) navigate(searchType === 'people' ? `/person/${id}` : `/movie/${id}`);
                  }}>
                    SEE DETAILS
                  </button>
                  {idx !== resultsQuery.length - 1 && <div className="results-separator" />}
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