import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css';
import { getIdFromUrl } from '../utils/getIdFromUrl';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';
const BACKEND_MOVIE_DETAILS = `${API_URL}/api/star-wars/movies/`;
const BACKEND_PERSON_DETAILS = `${API_URL}/api/star-wars/characters/`;

const fetchMovieDetails = async (id: string) => {
  const res = await axios.get(`${BACKEND_MOVIE_DETAILS}${id}`);
  return res.data;
};

const fetchPersonDetails = async (id: string) => {
  const res = await axios.get(`${BACKEND_PERSON_DETAILS}${id}`);
  return res.data;
};

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [characters, setCharacters] = useState<any[]>([]);
  const [loadingCharacters, setLoadingCharacters] = useState(true);
  const {
    data: movie,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['movies', 'details', id],
    queryFn: () => fetchMovieDetails(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!id) return;
    setLoadingCharacters(true);
    fetch(`${BACKEND_MOVIE_DETAILS}${id}`)
      .then(res => res.json())
      .then(async data => {
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
        setLoadingCharacters(false);
      });
  }, [id]);

  useEffect(() => {
    if (movie && Array.isArray(movie.characters)) {
      movie.characters.forEach((charUrl: string) => {
        const charId = getIdFromUrl(charUrl, 'people');
        if (charId) {
          queryClient.prefetchQuery({
            queryKey: ['people', 'details', charId],
            queryFn: () => fetchPersonDetails(charId),
            staleTime: 1000 * 60 * 10,
          });
        }
      });
    }
  }, [movie, queryClient]);

  if (isLoading) return <div className="results-card" style={{ margin: '48px auto' }}>Loading...</div>;
  if (isError) return <div className="results-card" style={{ margin: '48px auto' }}>Error: {(error as Error).message}</div>;
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
              {loadingCharacters ? (
                <span style={{ color: '#1ec87a', fontWeight: 600 }}>Loading characters...</span>
              ) : (
                characters.map((char, idx) => (
                  <span key={idx}>
                    <a href="#" style={{ color: '#1a73e8' }} onClick={e => { e.preventDefault(); navigate(`/person/${getIdFromUrl(char.url, 'people')}`); }}>{char.name}</a>
                    {idx !== characters.length - 1 && ', '}
                  </span>
                ))
              )}
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