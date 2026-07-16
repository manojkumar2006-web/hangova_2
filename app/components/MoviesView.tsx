"use client";

import React, { useEffect, useState } from 'react';
import { Film, Play, Star, Calendar } from 'lucide-react';
import MoviePlayer from './MoviePlayer';

export default function MoviesView() {
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeMovie, setActiveMovie] = useState<any | null>(null);

    useEffect(() => {
        const fetchTamilMovies = async () => {
            try {
                const token = process.env.NEXT_PUBLIC_TMDB_API_KEY;
                if (!token) {
                    throw new Error("TMDB API Key not found in environment variables.");
                }

                // Fetch Top Popular Tamil Movies
                const res = await fetch('https://api.themoviedb.org/3/discover/movie?with_original_language=ta&sort_by=popularity.desc&page=1', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': 'application/json'
                    }
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch movies: ${res.statusText}`);
                }

                const data = await res.json();
                setMovies(data.results || []);
                setLoading(false);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchTamilMovies();
    }, []);

    if (activeMovie) {
        return (
            <MoviePlayer 
                tmdbId={activeMovie.id} 
                title={activeMovie.title} 
                onClose={() => setActiveMovie(null)} 
            />
        );
    }

    return (
        <div className="movies-view-container">
            <div className="movies-header">
                <h1><Film className="inline-icon" /> Tamil Cinema</h1>
                <p>The best of Kollywood, streaming instantly for you and your friends</p>
            </div>

            {loading ? (
                <div className="movies-loading">
                    <div className="tmdb-spinner"></div>
                    <p>Loading the Kollywood Library...</p>
                </div>
            ) : error ? (
                <div className="movies-error">
                    <h2>Connection Error</h2>
                    <p>{error}</p>
                </div>
            ) : movies.length > 0 ? (
                <div className="tmdb-movies-grid">
                    {movies.map(movie => (
                        <div key={movie.id} className="tmdb-movie-card" onClick={() => setActiveMovie(movie)}>
                            <div className="tmdb-poster-wrapper">
                                {movie.poster_path ? (
                                    <img 
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                                        alt={movie.title} 
                                        className="tmdb-poster"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="tmdb-poster-placeholder">
                                        <Film size={48} />
                                    </div>
                                )}
                                <div className="tmdb-hover-overlay">
                                    <Play size={48} className="tmdb-play-icon" />
                                </div>
                            </div>
                            <div className="tmdb-movie-info">
                                <h3>{movie.title}</h3>
                                <div className="tmdb-movie-meta">
                                    <span className="tmdb-rating"><Star size={14} className="star-icon" /> {movie.vote_average.toFixed(1)}</span>
                                    <span className="tmdb-date"><Calendar size={14} /> {movie.release_date?.split('-')[0]}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="movies-empty">
                    <h2>No Movies Found</h2>
                </div>
            )}
        </div>
    );
}
