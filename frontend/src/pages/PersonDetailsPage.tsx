import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css';
import { getIdFromUrl } from '../utils/getIdFromUrl';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';
const BACKEND_PERSON_DETAILS = `${API_URL}/api/star-wars/characters/`;
const BACKEND_MOVIE_DETAILS = `${API_URL}/api/star-wars/movies/`;

const fetchPersonDetails = async (id: string) => {
  const res = await axios.get(`${BACKEND_PERSON_DETAILS}${id}`);
  return res.data;
};

const fetchMovieDetails = async (id: string) => {
  const res = await axios.get(`${BACKEND_MOVIE_DETAILS}${id}`);
  return res.data;
};

const PersonDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: person,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['people', 'details', id],
    queryFn: () => fetchPersonDetails(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });

  const [movies, setMovies] = useState<any[]>([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loadingMovies, setLoadingMovies] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoadingMovies(true);
    fetch(`${BACKEND_PERSON_DETAILS}${id}`)
      .then(res => res.json())
      .then(async data => {
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
        setLoadingMovies(false);
      });
  }, [id]);

  useEffect(() => {
    if (person && Array.isArray(person.films)) {
      person.films.forEach((filmUrl: string) => {
        const filmId = getIdFromUrl(filmUrl, 'films');
        if (filmId) {
          queryClient.prefetchQuery({
            queryKey: ['movies', 'details', filmId],
            queryFn: () => fetchMovieDetails(filmId),
            staleTime: 1000 * 60 * 10,
          });
        }
      });
    }
  }, [person, queryClient]);

  if (isLoading) return <div className="results-card" style={{ margin: '48px auto' }}>Loading...</div>;
  if (isError) return <div className="results-card" style={{ margin: '48px auto', color: 'red' }}>Error: {(error as Error).message}</div>;
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
              {loadingMovies ? (
                <span style={{ color: '#1ec87a', fontWeight: 600 }}>Loading movies...</span>
              ) : (
                movies.map((movie, idx) => (
                  <div key={idx}>
                    <a href="#" style={{ color: '#1a73e8' }} onClick={e => { e.preventDefault(); navigate(`/movie/${getIdFromUrl(movie.url, 'films')}`); }}>{movie.title}</a>
                  </div>
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

export default PersonDetailsPage; 