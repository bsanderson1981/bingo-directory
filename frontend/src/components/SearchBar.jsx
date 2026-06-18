export function SearchBar({ zip, onZipChange, selectedState, onStateChange }) {
    const US_STATES = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
    ];

    return (
        <div className="max-w-2xl mx-auto w-full">
            <div className="flex flex-col gap-6 w-full items-center">
                {/* Zip Code Input */}
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-4 border border-slate-300 rounded-2xl bg-white text-black placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-sm transition-all duration-300 text-xl"
                        placeholder="Enter Zip Code (e.g. 90210)"
                        value={zip}
                        onChange={(e) => onZipChange(e.target.value)}
                        maxLength={10}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {zip && zip.length >= 5 && (
                            <span className="flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                            </span>
                        )}
                    </div>
                </div>

                {/* OR Divider with Line */}
                <div className="relative flex items-center w-full">
                    <div className="flex-grow border-t border-slate-300"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-500 font-bold uppercase text-sm tracking-wider">or</span>
                    <div className="flex-grow border-t border-slate-300"></div>
                </div>

                {/* State Dropdown */}
                <div className="relative w-full">
                    <select
                        className="block w-full px-4 py-4 border border-slate-300 rounded-2xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-pink-600 shadow-sm transition-all duration-300 text-xl appearance-none cursor-pointer"
                        value={selectedState}
                        onChange={(e) => onStateChange(e.target.value)}
                    >
                        <option value="" className="text-slate-600">Select State</option>
                        {US_STATES.map(st => (
                            <option key={st} value={st} className="text-black">{st}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Radius Helper Text - Moved outside flex row to preserve alignment */}
            <div className="mt-2 text-sm text-slate-700 font-medium w-full text-center">
                We will return centers within 10 miles of the zip code entered
            </div>
        </div>
    );
}
