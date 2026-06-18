import { useState, useEffect } from 'react';
import { calculateDistance } from '../utils/distance';

// Cache for data to avoid re-fetching
let zipCodeDataCache = null;
let bingoDataCache = null;

export function useBingoEvents({ zip, state }) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            // Case 1: Neither Zip (valid length) nor State is selected
            if ((!zip || zip.length < 5) && !state) {
                setResults([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // 1. Fetch Zip Code Data if not cached
                if (!zipCodeDataCache) {
                    const res = await fetch('/data/zipcodes.json');
                    if (!res.ok) throw new Error('Failed to load zip code database');
                    zipCodeDataCache = await res.json();
                }

                // 2. Fetch Bingo Directory Data if not cached
                if (!bingoDataCache) {
                    const res = await fetch('/data/bingo_directory.json');
                    if (!res.ok) throw new Error('Failed to load bingo directory data');
                    bingoDataCache = await res.json();
                }

                // Case 2: Filter by State
                if (state) {
                    const filtered = bingoDataCache
                        .filter(item => item.state === state)
                        .sort((a, b) => a.name.localeCompare(b.name));

                    if (filtered.length === 0) {
                        setError(`No bingo events found in ${state}.`);
                    }
                    setResults(filtered);
                    setLoading(false);
                    return;
                }

                // Case 3: Filter by Zip (Radius of 25 miles for events)
                if (zip && zip.length >= 5) {
                    const cleanZip = zip.replace(/\D/g, '').substring(0, 5);
                    const lookupZip = parseInt(cleanZip, 10);

                    const userLocation = zipCodeDataCache.find(z => z.zip_code === lookupZip);

                    if (!userLocation) {
                        setError('Zip code not found in our database.');
                        setResults([]);
                        setLoading(false);
                        return;
                    }

                    const filtered = bingoDataCache.map(item => {
                        // Default to 0 distance if coordinates are missing
                        if (item.latitude === null || item.longitude === null) {
                            return { ...item, distance: 9999 };
                        }
                        const dist = calculateDistance(
                            userLocation.latitude,
                            userLocation.longitude,
                            item.latitude,
                            item.longitude
                        );
                        return { ...item, distance: dist };
                    }).filter(item => item.distance <= 25) // Wider 25 mile radius for events
                      .sort((a, b) => a.distance - b.distance);

                    if (filtered.length === 0) {
                        setError('No bingo events found within 25 miles of this zip code.');
                    }
                    setResults(filtered);
                }

            } catch (err) {
                console.error(err);
                setError('An error occurred while searching.');
            } finally {
                setLoading(false);
            }
        }

        const timer = setTimeout(() => {
            fetchData();
        }, 300); // Debounce

        return () => clearTimeout(timer);
    }, [zip, state]);

    return { results, loading, error };
}
