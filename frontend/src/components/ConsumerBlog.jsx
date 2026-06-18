import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from './SEO';

export function ConsumerBlog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchRSS() {
            try {
                const response = await fetch('/api/ftc-rss');
                if (!response.ok) throw new Error('Failed to fetch RSS feed');

                const text = await response.text();
                const parser = new DOMParser();
                const xml = parser.parseFromString(text, 'text/xml');

                const items = Array.from(xml.querySelectorAll('item')).map(item => {
                    const pubDate = item.querySelector('pubDate')?.textContent
                        || item.querySelector('dc\\:date')?.textContent
                        || item.getElementsByTagName('dc:date')[0]?.textContent
                        || '';

                    return {
                        title: item.querySelector('title')?.textContent || 'No Title',
                        link: item.querySelector('link')?.textContent || '#',
                        description: item.querySelector('description')?.textContent || '',
                        pubDate: pubDate,
                        guid: item.querySelector('guid')?.textContent || Math.random().toString()
                    };
                });

                setPosts(items.slice(0, 10)); // Show top 10
            } catch (err) {
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
                <p className="text-xl font-medium">⚠️ Error loading blog feed: {error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-8 px-4 animate-fade-in">
            <SEO title="FTC Consumer Blog" description="Latest consumer advice and scam alerts from the Federal Trade Commission." url="/ftcblog" />
            <div className="flex items-center gap-4 mb-8">
                <img
                    src="https://www.ftc.gov/themes/custom/ftc_theme/favicon.ico"
                    alt="FTC Logo"
                    className="w-8 h-8"
                    onError={(e) => e.target.style.display = 'none'}
                />
                <h1 className="text-3xl font-extrabold text-black">FTC Consumer Blog</h1>
            </div>

            <div className="space-y-6">
                {posts.map(post => (
                    <div key={post.guid} className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm hover:shadow-md transition-shadow">
                        <a href={post.link} target="_blank" rel="noopener noreferrer" className="group">
                            <h3 className="text-2xl font-bold text-teal-700 group-hover:underline mb-2">{post.title}</h3>
                        </a>
                        <p className="text-sm text-slate-500 mb-4">
                            {(() => {
                                if (!post.pubDate) return '';
                                const d = new Date(post.pubDate);
                                return isNaN(d.getTime()) ? post.pubDate : d.toLocaleDateString(undefined, { dateStyle: 'full' });
                            })()}
                        </p>
                        <div
                            className="text-slate-800 text-lg leading-relaxed space-y-2 [&_a]:text-teal-600 [&_a]:underline"
                            dangerouslySetInnerHTML={{ __html: post.description }}
                        />
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center text-slate-500 text-sm">
                <a href="https://consumer.ftc.gov/blog" target="_blank" rel="noopener noreferrer" className="hover:underline">View original blog on FTC.gov</a>
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
