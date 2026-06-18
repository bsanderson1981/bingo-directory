import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BINGO_DATA_FILE = path.join(__dirname, '../public/data/bingo_directory.json');

// List of cities and states to scrape for drag/LGBTQ+ friendly bingo
const SEARCH_TARGETS = [
  { city: 'Los Angeles', state: 'CA' },
  { city: 'San Francisco', state: 'CA' },
  { city: 'Sacramento', state: 'CA' },
  { city: 'San Diego', state: 'CA' }
];

const DELAY_MS = 4000; // Delay to prevent rate limiting

// Standard user agent
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to scrape search results from Bing
async function searchBing(query) {
  try {
    const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
    console.log(`🔍 Querying: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT
      }
    });

    if (!response.ok) {
      console.log(`❌ Bing search failed with status: ${response.status}`);
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const results = [];

    // Parse Bing organic search result titles, descriptions and URLs
    $('.b_algo').each((i, el) => {
      const titleAnchor = $(el).find('h2 a');
      const title = titleAnchor.text().trim();
      const href = titleAnchor.attr('href');
      const snippet = $(el).find('.b_caption p, .b_algoSublist').text().trim();

      if (title && href && href.startsWith('http')) {
        results.push({
          title,
          url: href,
          description: snippet
        });
      }
    });

    return results;
  } catch (error) {
    console.error(`Error searching Bing:`, error.message);
    return [];
  }
}

// Ingest scraped items and update the local database
function saveBingoListing(listing) {
  let data = [];
  if (fs.existsSync(BINGO_DATA_FILE)) {
    try {
      data = JSON.parse(fs.readFileSync(BINGO_DATA_FILE, 'utf-8'));
    } catch (e) {
      console.error('Error reading database file, starting fresh.');
    }
  }

  // Check if a listing with a very similar name/website already exists
  const isDuplicate = data.some(item => 
    (item.name.toLowerCase() === listing.name.toLowerCase() && item.city === listing.city) ||
    (listing.website && item.website === listing.website)
  );

  if (!isDuplicate) {
    listing.id = `bingo-${listing.state.toLowerCase()}-${String(data.length + 1).padStart(3, '0')}`;
    listing.verified_at = new Date().toISOString().split('T')[0];
    data.push(listing);
    fs.writeFileSync(BINGO_DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Saved new listing: "${listing.name}" in ${listing.city}, ${listing.state}`);
  } else {
    console.log(`⚠️ Listing or website already exists, skipping: "${listing.name}"`);
  }
}

// Scrape Gay Desert Guide specifically for Palm Springs bingo events
async function scrapeGayDesertGuide() {
  console.log('\n🌵 Scraping Gay Desert Guide (Palm Springs)...');
  try {
    const searchUrl = 'https://gaydesertguide.com/wp-json/wp/v2/search?search=bingo&subtype=ajde_events&per_page=20';
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': USER_AGENT
      }
    });

    if (!response.ok) {
      console.log(`❌ Failed to query WordPress search API: ${response.status}`);
      return;
    }

    const foundEvents = await response.json();
    console.log(`Found ${foundEvents.length} potential bingo events on Gay Desert Guide API.`);

    for (const event of foundEvents) {
      if (!event.url || !event.title) continue;
      const titleText = event.title;
      console.log(`Processing Gay Desert Guide event: "${titleText}"`);
      await sleep(2000); // Friendly delay
      
      try {
        const detailResponse = await fetch(event.url, { headers: { 'User-Agent': USER_AGENT } });
        if (!detailResponse.ok) continue;
        
        const detailHtml = await detailResponse.text();
        const $$ = cheerio.load(detailHtml);
        
        let venue = $$('.evo_locationName, .evo_card_location, .tribe-events-venue-details a').first().text().trim();
        if (!venue) {
          venue = $$('.eventon_list_event .location, .evo_event_location_title').first().text().trim();
        }
        if (!venue) {
          venue = 'Palm Springs Venue';
        }

        let address = $$('.evo_event_location_address, .evo_card_location_address').first().text().trim() || '';
        let schedule = $$('.evo_event_time, .evo_event_header_time').first().text().trim() || 'Check website';
        let notes = $$('.eventon_desc_in, .evo_event_details').text().trim().substring(0, 300) + '...';
        if (notes.length < 10) {
          notes = 'Drag/LGBTQ+ friendly bingo event at ' + venue;
        }

        const categories = ['drag', 'lgbtq+'];
        if (titleText.toLowerCase().includes('disco')) categories.push('disco');
        if (titleText.toLowerCase().includes('tunes') || titleText.toLowerCase().includes('music')) categories.push('music');

        const listing = {
          name: titleText.split(' at ')[0].split(' | ')[0].split(' / ')[0].trim(),
          venue: venue,
          address: address,
          city: 'Palm Springs',
          state: 'CA',
          zip: '92262',
          latitude: null,
          longitude: null,
          phone: '',
          website: event.url,
          schedule: schedule,
          categories: categories,
          notes: notes
        };
        
        saveBingoListing(listing);
        
      } catch (err) {
        console.error(`Error parsing event details for ${event.url}:`, err.message);
      }
    }

  } catch (error) {
    console.error('Error scraping Gay Desert Guide:', error.message);
  }
}

// Main logic
async function runScraper() {
  console.log('🏁 Starting Drag & LGBTQ+ Bingo Scraper...');
  
  // Scrape Gay Desert Guide first
  await scrapeGayDesertGuide();
  
  for (let i = 0; i < SEARCH_TARGETS.length; i++) {
    const target = SEARCH_TARGETS[i];
    const queries = [
      `drag queen bingo ${target.city} ${target.state}`,
      `drag bingo ${target.city} ${target.state}`,
      `lgbtq bingo ${target.city} ${target.state}`
    ];

    console.log(`\n========================================`);
    console.log(`Processing Target: ${target.city}, ${target.state} (${i + 1}/${SEARCH_TARGETS.length})`);
    console.log(`========================================`);

    for (const query of queries) {
      const results = await searchBing(query);
      console.log(`Found ${results.length} search results.`);

      for (const res of results) {
        // Simple heuristic rules to extract venue or event name from search result title
        // e.g. "Drag Queen Bingo at The Garden Nightclub - Eventbrite" -> Name: Drag Queen Bingo, Venue: The Garden Nightclub
        let name = res.title;
        let venue = 'Unknown Venue';

        if (name.includes(' at ')) {
          const parts = name.split(' at ');
          name = parts[0].trim();
          venue = parts[1].split(' - ')[0].split(' | ')[0].trim();
        } else if (name.includes(' | ')) {
          const parts = name.split(' | ');
          name = parts[0].trim();
          venue = parts[1].trim();
        } else if (name.includes(' - ')) {
          const parts = name.split(' - ');
          name = parts[0].trim();
          venue = parts[1].trim();
        }

        // Clean event name if it has platform names
        name = name.replace(/(Eventbrite|Facebook|Meetup|Ticketmaster)/gi, '').trim();
        venue = venue.replace(/(Eventbrite|Facebook|Meetup|Ticketmaster)/gi, '').trim();

        // Ensure we only save relevant-looking results
        const isRelevant = res.title.toLowerCase().includes('bingo') || res.description.toLowerCase().includes('bingo');
        if (!isRelevant) continue;

        const categories = [];
        if (res.title.toLowerCase().includes('drag') || res.description.toLowerCase().includes('drag')) {
          categories.push('drag');
        }
        if (res.title.toLowerCase().includes('lgbt') || res.description.toLowerCase().includes('lgbt') || res.title.toLowerCase().includes('pride') || res.description.toLowerCase().includes('pride')) {
          categories.push('lgbtq+');
        }
        if (categories.length === 0) {
          categories.push('lgbtq+ friendly');
        }

        const listing = {
          name: name || 'Drag/LGBTQ+ Bingo Night',
          venue: venue || 'Local Venue',
          address: '', // To be geocoded / enriched manually or via place details API
          city: target.city,
          state: target.state,
          zip: '',
          latitude: null,
          longitude: null,
          phone: '',
          website: res.url,
          schedule: 'Check website for schedule',
          categories: categories,
          notes: res.description || 'Drag/LGBTQ+ friendly bingo event.'
        };

        saveBingoListing(listing);
      }

      console.log(`Sleeping to avoid rate limits...`);
      await sleep(DELAY_MS);
    }
  }

  console.log('\n🏁 Scraper completed successfully!');
}

runScraper();
