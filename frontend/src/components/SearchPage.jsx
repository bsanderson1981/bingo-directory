import { useState, useEffect } from 'react'
import { useSearchParams, useParams, useNavigate } from 'react-router-dom'
import { SearchBar } from './SearchBar'
import { ResultsList } from './ResultsList'
import { useBingoEvents } from '../hooks/useBingoEvents'
import { SEO } from './SEO'

export function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const { stateCode } = useParams();
    const navigate = useNavigate();

    // Initialize logic: prioritize Path Param > Query Param > Default Empty
    const initialZip = searchParams.get('zip') || '';
    const initialState = stateCode ? stateCode.toUpperCase() : (searchParams.get('state') ? searchParams.get('state').toUpperCase() : '');

    const [zipCode, setZipCode] = useState(initialZip);
    const [selectedState, setSelectedState] = useState(initialState);

    // Sync URL changes to Local State (e.g. Browser Back Button)
    useEffect(() => {
        if (stateCode) {
            setSelectedState(stateCode.toUpperCase());
            setZipCode('');
        } else {
            const zip = searchParams.get('zip');
            const state = searchParams.get('state');
            setZipCode(zip || '');
            setSelectedState(state ? state.toUpperCase() : '');
        }
    }, [stateCode, searchParams]);


    const { results, loading, error } = useBingoEvents({ zip: zipCode, state: selectedState });

    // Helper to send GA events safely
    const trackSearch = (term, type) => {
        if (window.gtag) {
            window.gtag('event', 'search', {
                search_term: term,
                search_type: type
            });
            console.log(`GA Event: search | term: ${term} | type: ${type}`);
        }
    };

    const handleZipChange = (val) => {
        setZipCode(val);

        // If we are on a state page, we must navigate home to search by zip
        if (stateCode) {
            navigate(`/?zip=${val}`);
        } else {
            // Otherwise just update query param in place
            const params = {};
            if (val) params.zip = val;
            setSearchParams(params, { replace: true });
        }

        if (val) setSelectedState('');

        if (val && val.length === 5) {
            trackSearch(val, 'zip_code');
        }
    }

    const handleStateChange = (val) => {
        setSelectedState(val);
        if (val) {
            navigate(`/state/${val}`);
        } else {
            navigate('/');
        }

        if (val) setZipCode('');

        if (val) {
            trackSearch(val, 'state_selection');
        }
    }

    return (
        <>
            <div className="text-center mb-12 animate-fade-in-down">
                <SEO events={results} />
                {/* Hero Image */}
                <div className="flex justify-center mb-8">
                    <img
                        src="/hero.jpg"
                        alt="Senior Citizens and Community Members Smiling"
                        className="rounded-2xl shadow-lg max-w-full h-auto w-[300px] object-cover"
                    />
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-black mb-2 tracking-tight drop-shadow-sm">
                    Find LGBTQ+ & Drag Queen Bingo Near You
                </h1>
                <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-6 tracking-wide">
                    Connect with your community, find weekly drag events, and support local venues.
                </h2>
                <p className="text-slate-600 text-xl md:text-2xl font-normal tracking-wide max-w-2xl mx-auto">
                    Search by Zip Code or City to find weekly shows, pride events, and friendly neighborhood bingo night listings.
                    <span className="text-slate-600 text-base mt-2 block">Powered by Geospatial Search</span>
                </p>
            </div>

            {/* Search Section */}
            <div className="w-full mb-8 z-10 flex justify-center">
                <SearchBar
                    zip={zipCode}
                    onZipChange={handleZipChange}
                    selectedState={selectedState}
                    onStateChange={handleStateChange}
                />
            </div>

            {/* Results Section */}
            <div className="w-full max-w-6xl">
                <ResultsList
                    results={results}
                    loading={loading}
                    error={error}
                    hasSearch={!!zipCode || !!selectedState}
                />
            </div>

            {/* Empty State / Welcome Message if no search */}
            {!zipCode && !selectedState && !loading && !error && (
                <div className="mt-12 text-slate-800 text-lg font-medium text-center">
                    Try entering <span className="text-teal-700 cursor-pointer hover:underline" onClick={() => handleZipChange('Palm Springs')}>Palm Springs</span>, <span className="text-teal-700 cursor-pointer hover:underline" onClick={() => handleZipChange('50309')}>50309</span>,
                    or select <span className="text-pink-700 cursor-pointer hover:underline" onClick={() => handleStateChange('IA')}>Iowa</span>
                </div>
            )}
        </>
    );
}
