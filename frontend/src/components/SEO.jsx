import { Helmet } from 'react-helmet-async';

export function SEO({ title, description, image, url }) {
    const siteTitle = "LGBTQ+ & Drag Queen Bingo Directory | OlderFriends.org";
    const defaultDescription = "Find drag queen bingo, LGBTQ+ friendly bingo nights, pride events, and community activities in your state. Connect, support local venues, and have fun!";
    const defaultImage = "https://olderfriends.org/hero.jpg";
    const siteUrl = "https://olderfriends.org";

    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const finalDescription = description || defaultDescription;
    const finalImage = image ? `${siteUrl}${image}` : defaultImage;
    const finalUrl = url ? `${siteUrl}${url}` : siteUrl;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={finalDescription} />
            <link rel="canonical" href={finalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={finalUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={finalUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={finalDescription} />
            <meta property="twitter:image" content={finalImage} />
        </Helmet>
    );
}
