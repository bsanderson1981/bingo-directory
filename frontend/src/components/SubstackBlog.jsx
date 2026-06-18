import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { SEO } from './SEO';

export function SubstackBlog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchRSS() {
            try {
                // Use the proxy we set up
                const response = await fetch('/api/substack-rss');
                if (!response.ok) throw new Error('Failed to fetch RSS feed');

                const text = await response.text();
                const parser = new DOMParser();
                const xml = parser.parseFromString(text, 'text/xml');

                const items = Array.from(xml.querySelectorAll('item')).map(item => {
                    // Substack often puts the full content in content:encoded
                    const contentEncoded = item.getElementsByTagName('content:encoded')[0]?.textContent;
                    const description = item.querySelector('description')?.textContent;

                    // Prioritize content:encoded if available
                    let content = contentEncoded || description || '';

                    // Basic cleanup: remove massive inline styles or scripts if needed
                    // For now, we trust the feed content but might want to sanitize in a real prod env

                    // Extract first image if available for a thumbnail (optional, logic can be added)

                    return {
                        title: item.querySelector('title')?.textContent || 'No Title',
                        link: item.querySelector('link')?.textContent || '#',
                        content: content,
                        pubDate: item.querySelector('pubDate')?.textContent || '',
                        guid: item.querySelector('guid')?.textContent || Math.random().toString(),
                        creator: item.getElementsByTagName('dc:creator')[0]?.textContent || 'Older Friends'
                    };
                });

                setPosts(items.slice(0, 10)); // Show top 10
            } catch (err) {
                console.error("RSS Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchRSS();
    }, []);

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
                <p className="text-xl font-medium">⚠️ Error loading updates: {error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-8 px-4 animate-fade-in">
            <SEO title="Community Updates" description="Latest news and updates from the LGBTQ+ & Drag Bingo Directory community." url="/communityblog" />
            <div className="flex items-center gap-4 mb-8">
                {/* Optional: Add Substack Logo or Site Logo */}
                <div className="bg-orange-500 rounded p-1">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" /></svg>
                </div>
                <h1 className="text-3xl font-extrabold text-black">Community Updates</h1>
            </div>

            <p className="mb-8 text-slate-600">
                Latest news from our <a href="https://olderfriends.substack.com" target="_blank" rel="noopener noreferrer" className="text-orange-600 underline hover:text-orange-700">Substack Newsletter</a>.
            </p>

            <div className="space-y-8">
                {posts.map(post => (
                    <article key={post.guid} className="bg-white p-8 rounded-2xl border border-slate-300 shadow-sm hover:shadow-md transition-shadow">
                        <header className="mb-4">
                            <a href={post.link} target="_blank" rel="noopener noreferrer" className="group">
                                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors mb-2">{post.title}</h3>
                            </a>
                            <div className="flex items-center text-sm text-slate-500 gap-2">
                                <time>{new Date(post.pubDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</time>
                                <span>•</span>
                                <span>{post.creator}</span>
                            </div>
                        </header>

                        {/* We use a max-height with overflow to prevent massive posts from taking over, with a "Read More" link */}
                        <div className="relative">
                            <div
                                className="prose prose-slate max-w-none text-slate-800 leading-relaxed max-h-[400px] overflow-hidden mask-bottom"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <a href={post.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-teal-700 font-bold hover:underline">
                                Read full article on Substack
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </a>
                        </div>
                    </article>
                ))}
            </div>

            <div className="mt-12 flex justify-center pb-8">
                <Link
                    to="/"
                    className="px-8 py-3 bg-teal-600 text-white font-bold rounded-xl shadow-md hover:bg-teal-700 transition-colors text-lg"
                >
                    Return to Home Page
                </Link>
            </div>
        </div>

    );
}
