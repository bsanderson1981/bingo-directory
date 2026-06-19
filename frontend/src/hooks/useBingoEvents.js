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
            // Case 1: Neither Zip/City (min 3 characters) nor State is selected
            if ((!zip || zip.trim().length < 3) && !state) {
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
                    const res = await fetch(`/data/bingo_directory.json?t=${Date.now()}`);
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

                // Case 3: Filter by Zip Code or City Name
                if (zip && zip.trim().length >= 3) {
                    const query = zip.trim().toLowerCase();
                    const isNumeric = /^\d+$/.test(query);

                    if (isNumeric) {
                        // Zip Code logic
                        const cleanZip = query.replace(/\D/g, '').substring(0, 5);
                        const lookupZip = parseInt(cleanZip, 10);
                        const userLocation = zipCodeDataCache.find(z => z.zip_code === lookupZip);

                        if (!userLocation) {
                            setError('Zip code not found in our database.');
                            setResults([]);
                            setLoading(false);
                            return;
                        }

                        const filtered = bingoDataCache.map(item => {
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
                        }).filter(item => item.distance <= 25)
                          .sort((a, b) => a.distance - b.distance);

                        if (filtered.length === 0) {
                            setError('No bingo events found within 25 miles of this zip code.');
                        }
                        setResults(filtered);
                    } else {
                        // City Name logic
                        let cityPart = query;
                        let statePart = '';
                        if (query.includes(',')) {
                            const parts = query.split(',');
                            cityPart = parts[0].trim();
                            statePart = parts[1].trim();
                        }

                        // Try to resolve coordinates for city center
                        const userLocation = zipCodeDataCache.find(z => {
                            const cityMatch = z.city.toLowerCase() === cityPart;
                            if (statePart) {
                                return cityMatch && z.state.toLowerCase() === statePart;
                            }
                            return cityMatch;
                        });

                        let radiusResults = [];
                        if (userLocation) {
                            radiusResults = bingoDataCache.map(item => {
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
                            }).filter(item => item.distance <= 25);
                        }

                        // Text matching fallback/complement
                        const textResults = bingoDataCache.filter(item => {
                            const cityMatch = item.city.toLowerCase().includes(cityPart);
                            const stateMatch = statePart ? item.state.toLowerCase() === statePart : true;
                            
                            return (
                                (cityMatch && stateMatch) ||
                                item.venue.toLowerCase().includes(cityPart) ||
                                item.name.toLowerCase().includes(cityPart)
                            );
                        }).map(item => {
                            const inRadius = radiusResults.find(r => r.id === item.id);
                            return inRadius || { ...item, distance: 9999 };
                        });

                        // Merge & Deduplicate
                        const mergedMap = new Map();
                        radiusResults.forEach(r => mergedMap.set(r.id, r));
                        textResults.forEach(t => {
                            if (!mergedMap.has(t.id)) {
                                mergedMap.set(t.id, t);
                            }
                        });

                        const finalResults = Array.from(mergedMap.values())
                            .sort((a, b) => {
                                if (a.distance !== b.distance) {
                                    return a.distance - b.distance;
                                }
                                return a.name.localeCompare(b.name);
                            });

                        if (finalResults.length === 0) {
                            setError(`No bingo events found for "${zip}".`);
                        }
                        setResults(finalResults);
                    }
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
