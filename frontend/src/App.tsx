import React, { useState, useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || '';
const BACKEND_PEOPLE = `${API_URL}/api/star-wars/characters/search?q=`;
const BACKEND_MOVIES = `${API_URL}/api/star-wars/movies/search?q=`;
const BACKEND_PERSON_DETAILS = `${API_URL}/api/star-wars/characters/`;
const BACKEND_MOVIE_DETAILS = `${API_URL}/api/star-wars/movies/`;

function getIdFromUrl(url: string, type: 'people' | 'films') {
  const match = url.match(type === 'people' ? /\/people\/(\d+)\/?$/ : /\/films\/(\d+)\/?$/);
  return match ? match[1] : null;
}

type SwapiResponse = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: any[];
  [key: string]: any;
};

const SearchPage: React.FC = () => {
  const [searchType, setSearchType] = useState<'people' | 'movies'>('people');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SwapiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length >= 2) {
      setIsSearching(true);
      setError(null);
      const endpoint = searchType === 'people' ? BACKEND_PEOPLE : BACKEND_MOVIES;
      fetch(endpoint + encodeURIComponent(query.trim()))
        .then(async res => {
          if (!res.ok) {
            const err = await res.text();
            console.error('API error response:', err);
            throw new Error(err || 'API error');
          }
          return res.json();
        })
        .then(data => {
          console.log('API response:', data);
          if (!data || typeof data !== 'object' || !Array.isArray(data.results)) {
            setError('Invalid response from backend');
            setResults(null);
          } else {
            setResults(data);
          }
          setIsSearching(false);
        })
        .catch((e) => {
          console.error('Fetch error:', e);
          setError('Error fetching data');
          setResults(null);
          setIsSearching(false);
        });
    } else {
      setResults(null);
      setIsSearching(false);
    }
  }, [query, searchType]);

  const hasResults = results && Array.isArray(results.results) && results.results.length > 0;

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
        <button className="search-btn" disabled={query.trim().length < 2 || isSearching}>
          {isSearching ? 'SEARCHING' : 'SEARCH'}
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
              {results!.results!.map((item: any, idx: number) => (
                <li className="results-item" key={idx}>
                  <span className="results-name">{searchType === 'people' ? item.name : item.title}</span>
                  {searchType === 'people' ? (
                    <button className="details-btn" onClick={() => {
                      const id = getIdFromUrl(item.url, 'people');
                      if (id) navigate(`/person/${id}`);
                    }}>
                      SEE DETAILS
                    </button>
                  ) : (
                    <button className="details-btn" onClick={() => {
                      const id = getIdFromUrl(item.url, 'films');
                      if (id) navigate(`/movie/${id}`);
                    }}>
                      SEE DETAILS
                    </button>
                  )}
                  {idx !== results!.results!.length - 1 && <div className="results-separator" />}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
};

const PersonDetails: React.FC = () => {
  const { id } = useParams();
  const [person, setPerson] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${BACKEND_PERSON_DETAILS}${id}`)
      .then(res => res.json())
      .then(async data => {
        setPerson(data);
        // Buscar títulos dos filmes
        if (Array.isArray(data.films)) {
          const filmsData = await Promise.all(
            data.films.map((filmUrl: string) => {
              const filmId = getIdFromUrl(filmUrl, 'films');
              if (!filmId) return null;
              return fetch(`${BACKEND_MOVIE_DETAILS}${filmId}`).then(r => r.json());
            })
          );
          setMovies(filmsData.filter(Boolean));
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="results-card" style={{ margin: '48px auto' }}>Loading...</div>;
  if (!person) return <div className="results-card" style={{ margin: '48px auto' }}>Not found</div>;

  return (
    <main className="main-content">
      <section className="details-card">
        <h2 style={{ marginBottom: 0 }}>{person.name}</h2>
        <div style={{ display: 'flex', gap: 40, marginTop: 24 }}>
          <div style={{ flex: 1 }}>
            <div className="results-title">Details</div>
            <div style={{ marginTop: 12, lineHeight: 1.7 }}>
              <div>Birth Year: {person.birth_year}</div>
              <div>Gender: {person.gender}</div>
              <div>Eye Color: {person.eye_color}</div>
              <div>Hair Color: {person.hair_color}</div>
              <div>Height: {person.height}</div>
              <div>Mass: {person.mass}</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="results-title">Movies</div>
            <div style={{ marginTop: 12 }}>
              {movies.map((movie, idx) => (
                <div key={idx}>
                  <a href="#" style={{ color: '#1a73e8' }} onClick={e => { e.preventDefault(); navigate(`/movie/${getIdFromUrl(movie.url, 'films')}`); }}>{movie.title}</a>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="search-btn" style={{ marginTop: 32, width: 200 }} onClick={() => navigate(-1)}>
          BACK TO SEARCH
        </button>
      </section>
    </main>
  );
};

const MovieDetails: React.FC = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${BACKEND_MOVIE_DETAILS}${id}`)
      .then(res => res.json())
      .then(async data => {
        setMovie(data);
        // Buscar nomes dos personagens
        if (Array.isArray(data.characters)) {
          const charsData = await Promise.all(
            data.characters.map((charUrl: string) => {
              const charId = getIdFromUrl(charUrl, 'people');
              if (!charId) return null;
              return fetch(`${BACKEND_PERSON_DETAILS}${charId}`).then(r => r.json());
            })
          );
          setCharacters(charsData.filter(Boolean));
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="results-card" style={{ margin: '48px auto' }}>Loading...</div>;
  if (!movie) return <div className="results-card" style={{ margin: '48px auto' }}>Not found</div>;

  return (
    <main className="main-content">
      <section className="details-card">
        <h2 style={{ marginBottom: 0 }}>{movie.title}</h2>
        <div style={{ display: 'flex', gap: 40, marginTop: 24 }}>
          <div style={{ flex: 1 }}>
            <div className="results-title">Opening Crawl</div>
            <div style={{ marginTop: 12, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{movie.opening_crawl}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="results-title">Characters</div>
            <div style={{ marginTop: 12 }}>
              {characters.map((char, idx) => (
                <span key={idx}>
                  <a href="#" style={{ color: '#1a73e8' }} onClick={e => { e.preventDefault(); navigate(`/person/${getIdFromUrl(char.url, 'people')}`); }}>{char.name}</a>
                  {idx !== characters.length - 1 && ', '}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button className="search-btn" style={{ marginTop: 32, width: 200 }} onClick={() => navigate(-1)}>
          BACK TO SEARCH
        </button>
      </section>
    </main>
  );
};

const App: React.FC = () => (
  <Router>
    <header className="header">
      <h1 className="header-title">SWStarter</h1>
    </header>
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/person/:id" element={<PersonDetails />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
    </Routes>
  </Router>
);

export default App; 