export function ResultsList({ results, loading, error, hasSearch }) {
    if (loading) {
        return (
            <div className="flex justify-center mt-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-12 p-6 bg-red-50 rounded-xl border border-red-200 text-red-700 animate-fade-in">
                <p className="text-xl font-medium">⚠️ {error}</p>
            </div>
        );
    }

    if (results.length === 0) {
        if (!hasSearch) return null;

        return (
            <div className="text-center mt-12 p-8 bg-white rounded-2xl border border-slate-300 shadow-sm animate-fade-in text-slate-700">
                <svg className="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No bingo events found nearby</h3>
                <p className="text-lg">We couldn't find any drag or LGBTQ+ friendly bingo events within 25 miles of this location.</p>
                <p className="text-base mt-4 text-slate-500">Try entering a Zip Code in Des Moines (e.g., 50309) or searching by State.</p>
            </div>
        );
    }

    return (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 pb-20">
            {results.map((item) => (
                <div
                    key={item.id}
                    className="group relative bg-white border border-slate-300 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
                >
                    <div>
                        <div className="flex justify-between items-start mb-2 gap-2">
                            <h3 className="text-2xl font-extrabold text-black leading-tight">{item.name}</h3>
                        </div>

                        {item.venue && (
                            <p className="text-pink-600 font-bold text-lg mb-3">at {item.venue}</p>
                        )}

                        <div className="space-y-2 text-slate-800 text-base mb-4">
                            {item.address && (
                                <p className="flex items-start">
                                    <svg className="h-5 w-5 mr-2 shrink-0 text-teal-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{item.address}, {item.city}, {item.state} {item.zip}</span>
                                </p>
                            )}
                            {!item.address && (
                                <p className="flex items-start">
                                    <svg className="h-5 w-5 mr-2 shrink-0 text-teal-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    <span>{item.city}, {item.state}</span>
                                </p>
                            )}
                            {item.schedule && (
                                <p className="flex items-start">
                                    <svg className="h-5 w-5 mr-2 shrink-0 text-violet-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-semibold text-slate-900">{item.schedule}</span>
                                </p>
                            )}
                            {item.phone && (
                                <p className="flex items-center">
                                    <svg className="h-5 w-5 mr-2 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {item.phone}
                                </p>
                            )}
                        </div>

                        {item.notes && (
                            <p className="text-slate-600 text-sm italic mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                {item.notes}
                            </p>
                        )}

                        {item.categories && item.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {item.categories.map((cat, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase bg-teal-50 text-teal-700 border border-teal-100"
                                    >
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        {item.distance !== undefined && item.distance !== 9999 && (
                            <span className="text-sm font-semibold text-slate-500">
                                📍 {item.distance.toFixed(1)} miles away
                            </span>
                        )}
                        <div className="flex gap-4 ml-auto">
                            {item.website && (
                                <a
                                    href={item.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-sm font-bold text-teal-700 hover:text-teal-900 transition-colors"
                                >
                                    Event Details
                                </a>
                            )}
                            <a
                                href={
                                    item.latitude && item.longitude
                                        ? `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`
                                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.venue || item.name} ${item.city} ${item.state}`)}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                Map
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
