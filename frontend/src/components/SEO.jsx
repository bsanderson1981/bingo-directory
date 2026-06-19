import { Helmet } from 'react-helmet-async';

export function SEO({ title, description, image, url, events }) {
    const siteTitle = "LGBTQ+ Drag Directory: Shows, Brunches & Bingo | OlderFriends.org";
    const defaultDescription = "Find weekly drag shows, drag brunches, drag queen bingo, LGBTQ+ friendly events, and community activities in your state. Connect, support local venues, and have fun!";
    const defaultImage = "https://olderfriends.org/hero.png";
    const siteUrl = "https://olderfriends.org";

    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const finalDescription = description || defaultDescription;
    const finalImage = image ? `${siteUrl}${image}` : defaultImage;
    const finalUrl = url ? `${siteUrl}${url}` : siteUrl;

    // 1. Base website schema for SEO/AI engines
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "LGBTQ+ Drag Directory (Shows, Brunches & Bingo)",
        "url": finalUrl,
        "description": finalDescription,
        "image": finalImage,
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/?zip={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };

    // 2. Dynamic event list schema for AI crawlers to parse events directly
    let eventListSchema = null;
    if (events && events.length > 0) {
        eventListSchema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "numberOfItems": events.length,
            "itemListElement": events.map((event, index) => {
                const eventSchema = {
                    "@type": "Event",
                    "name": event.name,
                    // Standard schedule text or default recurring representation
                    "startDate": new Date().toISOString().split('T')[0] + "T18:00:00-07:00",
                    "url": event.website || finalUrl,
                    "location": {
                        "@type": "Place",
                        "name": event.venue || "Local Venue",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": event.address || "",
                            "addressLocality": event.city || "Palm Springs",
                            "addressRegion": event.state || "CA",
                            "postalCode": event.zip || "",
                            "addressCountry": "US"
                        }
                    },
                    "description": event.notes || `Weekly/Monthly LGBTQ+ or Drag Bingo event at ${event.venue}.`,
                    "organizer": {
                        "@type": "Organization",
                        "name": event.venue || "Local Venue",
                        "url": event.website || finalUrl
                    }
                };

                if (event.latitude !== null && event.longitude !== null && event.latitude !== undefined) {
                    eventSchema.location.geo = {
                        "@type": "GeoCoordinates",
                        "latitude": event.latitude,
                        "longitude": event.longitude
                    };
                }

                return {
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": eventSchema
                };
            })
        };
    }

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={finalDescription} />
            <link rel="canonical" href={finalUrl} />
            <meta name="keywords" content="drag shows, drag brunches, drag queen bingo, lgbtq events, gay bars directory, drag performance local, pride events near me" />
            
            {/* Full indexing permission for search engines & AI agent scrapers */}
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

            {/* Open Graph / Facebook */}
            <meta property="og:site_name" content="LGBTQ+ Drag Directory (Shows, Brunches & Bingo)" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={finalUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />
            <meta property="og:locale" content="en_US" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={finalUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={finalDescription} />
            <meta property="twitter:image" content={finalImage} />

            {/* Structured Schema JSON-LD Injection */}
            <script type="application/ld+json">
                {JSON.stringify(websiteSchema)}
            </script>
            {eventListSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(eventListSchema)}
                </script>
            )}
        </Helmet>
    );
}

