"use client";

import React, { useState } from 'react';
import { Film, Play, FolderInput } from 'lucide-react';
import MoviePlayer from './MoviePlayer';

export default function MoviesView() {
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeMovie, setActiveMovie] = useState<any | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const connectFolder = async () => {
        try {
            setError(null);
            
            // Check if File System Access API is supported
            if (!('showDirectoryPicker' in window)) {
                throw new Error("Your browser does not support the File System Access API. Please use a modern browser like Chrome or Edge on desktop.");
            }

            setLoading(true);
            
            // @ts-ignore - TS might not know about showDirectoryPicker
            const dirHandle = await window.showDirectoryPicker({
                id: 'moviesFolder',
                mode: 'read'
            });

            const foundMovies = [];

            // @ts-ignore
            for await (const entry of dirHandle.values()) {
                if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.mp4')) {
                    const file = await entry.getFile();
                    foundMovies.push({
                        file: file, // Keep the actual File object to stream it
                        filename: entry.name,
                        title: entry.name.replace('.mp4', '').replace(/\./g, ' '),
                        sizeBytes: file.size,
                    });
                }
            }

            setMovies(foundMovies);
            setIsConnected(true);
            setLoading(false);
        } catch (err: any) {
            console.error(err);
            if (err.name !== 'AbortError') {
                setError(err.message || "Failed to connect to folder.");
            }
            setLoading(false);
        }
    };

    if (activeMovie) {
        return (
            <MoviePlayer 
                file={activeMovie.file} 
                title={activeMovie.title} 
                onClose={() => setActiveMovie(null)} 
            />
        );
    }

    return (
        <div className="movies-view-container">
            <div className="movies-header">
                <h1><Film className="inline-icon" /> Local Movies</h1>
                <p>Stream your massive local movies instantly with zero buffering</p>
                
                {!isConnected && (
                    <button className="connect-folder-btn" onClick={connectFolder} disabled={loading}>
                        <FolderInput size={20} />
                        {loading ? "Scanning..." : "Connect Local Movie Folder"}
                    </button>
                )}
            </div>

            {error ? (
                <div className="movies-error">Error: {error}</div>
            ) : isConnected && movies.length === 0 ? (
                <div className="movies-empty">
                    <h2>No MP4 movies found in that folder!</h2>
                    <p>Make sure you select the folder containing your remuxed .mp4 files.</p>
                    <button className="connect-folder-btn mt-4" onClick={connectFolder}>Try Another Folder</button>
                </div>
            ) : isConnected && movies.length > 0 ? (
                <div className="movies-grid">
                    {movies.map(movie => (
                        <div key={movie.filename} className="movie-grid-card" onClick={() => setActiveMovie(movie)}>
                            <div className="movie-thumbnail">
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
            ) : null}
        </div>
    );
}
