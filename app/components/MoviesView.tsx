"use client";

import React, { useEffect, useState } from 'react';
import { Film, Play } from 'lucide-react';
import MoviePlayer from './MoviePlayer';

export default function MoviesView() {
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeMovie, setActiveMovie] = useState<any | null>(null);

    useEffect(() => {
        fetch('/api/movies/list')
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setMovies(data.movies || []);
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (activeMovie) {
        return (
            <MoviePlayer 
                filename={activeMovie.filename} 
                title={activeMovie.title} 
                onClose={() => setActiveMovie(null)} 
            />
        );
    }

    return (
        <div className="movies-view-container">
            <div className="movies-header">
                <h1><Film className="inline-icon" /> Local Movies</h1>
                <p>Streaming directly from D:\movies</p>
            </div>

            {loading ? (
                <div className="movies-loading">Scanning directory for MP4s...</div>
            ) : error ? (
                <div className="movies-error">Error: {error}</div>
            ) : movies.length === 0 ? (
                <div className="movies-empty">
                    <h2>No MP4 movies found!</h2>
                    <p>Run the <code>remuxMovies.js</code> script to convert your MKV files to MP4 instantly.</p>
                </div>
            ) : (
                <div className="movies-grid">
                    {movies.map(movie => (
                        <div key={movie.filename} className="movie-grid-card" onClick={() => setActiveMovie(movie)}>
                            <div className="movie-thumbnail">
                                {/* Since we don't have posters, we use a beautiful gradient placeholder */}
                                <div className="movie-poster-placeholder">
                                    <Play size={48} className="play-icon" />
                                </div>
                            </div>
                            <div className="movie-info">
                                <h3>{movie.title}</h3>
                                <p>{(movie.sizeBytes / (1024 * 1024 * 1024)).toFixed(2)} GB</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
