import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css';
import { getIdFromUrl } from '../utils/getIdFromUrl';

const API_URL = process.env.REACT_APP_API_URL || '';
const BACKEND_MOVIE_DETAILS = `${API_URL}/api/star-wars/movies/`;
const BACKEND_PERSON_DETAILS = `${API_URL}/api/star-wars/characters/`;

const MovieDetailsPage: React.FC = () => {
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

export default MovieDetailsPage; 