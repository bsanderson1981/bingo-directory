import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BINGO_DATA_FILE = path.join(__dirname, '../public/data/bingo_directory.json');
const MANUAL_REVIEW_FILE = path.join(__dirname, '../public/data/manual_review.json');

// Known LGBTQ+ friendly venues or gay bars where *any* bingo event is implicitly LGBTQ+ friendly
const KNOWN_LGBTQ_VENUES = [
  'tool shed',
  'toolshed',
  'hunters',
  'chill bar',
  'one eleven bar',
  'one-eleven bar',
  'the joint by prc',
  'the garden nightclub',
  'hamburger mary',
  'detour',
  'gossip grill',
  'urban mo',
  'v wine lounge',
  'boozehounds'
];

// List of cities and states to scrape for drag/LGBTQ+ friendly bingo
const SEARCH_TARGETS = [
  { city: 'Birmingham', state: 'AL' },
  { city: 'Anchorage', state: 'AK' },
  { city: 'Phoenix', state: 'AZ' },
  { city: 'Little Rock', state: 'AR' },
  { city: 'Denver', state: 'CO' },
  { city: 'Hartford', state: 'CT' },
  { city: 'Wilmington', state: 'DE' },
  { city: 'Miami', state: 'FL' },
  { city: 'Atlanta', state: 'GA' },
  { city: 'Honolulu', state: 'HI' },
  { city: 'Boise', state: 'ID' },
  { city: 'Chicago', state: 'IL' },
  { city: 'Indianapolis', state: 'IN' },
  { city: 'Des Moines', state: 'IA' },
  { city: 'Wichita', state: 'KS' },
  { city: 'Louisville', state: 'KY' },
  { city: 'New Orleans', state: 'LA' },
  { city: 'Portland', state: 'ME' },
  { city: 'Baltimore', state: 'MD' },
  { city: 'Boston', state: 'MA' },
  { city: 'Detroit', state: 'MI' },
  { city: 'Minneapolis', state: 'MN' },
  { city: 'Jackson', state: 'MS' },
  { city: 'Kansas City', state: 'MO' },
  { city: 'Billings', state: 'MT' },
  { city: 'Omaha', state: 'NE' },
  { city: 'Las Vegas', state: 'NV' },
  { city: 'Manchester', state: 'NH' },
  { city: 'Newark', state: 'NJ' },
  { city: 'Albuquerque', state: 'NM' },
  { city: 'New York', state: 'NY' },
  { city: 'Charlotte', state: 'NC' },
  { city: 'Fargo', state: 'ND' },
  { city: 'Columbus', state: 'OH' },
  { city: 'Oklahoma City', state: 'OK' },
  { city: 'Portland', state: 'OR' },
  { city: 'Philadelphia', state: 'PA' },
  { city: 'Providence', state: 'RI' },
  { city: 'Charleston', state: 'SC' },
  { city: 'Sioux Falls', state: 'SD' },
  { city: 'Nashville', state: 'TN' },
  { city: 'Houston', state: 'TX' },
  { city: 'Salt Lake City', state: 'UT' },
  { city: 'Burlington', state: 'VT' },
  { city: 'Richmond', state: 'VA' },
  { city: 'Seattle', state: 'WA' },
  { city: 'Charleston', state: 'WV' },
  { city: 'Milwaukee', state: 'WI' },
  { city: 'Cheyenne', state: 'WY' }
];

const DELAY_MS = 4000; // Delay to prevent rate limiting
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Keep track of new manual review items in the current run
const newManualReviewItems = [];

// Check if an event matches relevance rules
function checkEventRelevance(name, description, schedule, venue) {
  const nameText = (name || '').toLowerCase();
  const descText = (description || '').toLowerCase();
  const scheduleText = (schedule || '').toLowerCase();
  const venueText = (venue || '').toLowerCase();

  const hasBingoInName = nameText.includes('bingo');

  // Check if the venue is a known LGBTQ+ bar/business
  const isKnownLgbtqVenue = KNOWN_LGBTQ_VENUES.some(v => venueText.includes(v));

  const hasKeywords = nameText.includes('drag') || nameText.includes('lgbt') || 
                      descText.includes('drag') || descText.includes('lgbt') ||
                      isKnownLgbtqVenue;
  
  const isAnnual = nameText.includes('annual') || descText.includes('annual') || scheduleText.includes('annual');

  const daysPattern = /(every|each|weekly|monthly|monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun|1st|2nd|3rd|4th|last|regularly)/i;
  const hasRecurring = daysPattern.test(scheduleText) || 
                       daysPattern.test(nameText) || 
                       descText.includes('every') || 
                       descText.includes('weekly') || 
                       descText.includes('monthly') ||
                       daysPattern.test(descText);

  if (!hasBingoInName) {
    return { relevant: false, reason: "No 'bingo' in event name" };
  }
  if (!hasKeywords) {
    return { relevant: false, reason: "Missing 'drag' or 'lgbt' keywords" };
  }
  if (isAnnual) {
    return { relevant: false, reason: "Annual event (not weekly or monthly)" };
  }
  if (!hasRecurring) {
    return { relevant: false, reason: "Not verified as weekly or monthly recurring event" };
  }

  return { relevant: true };
}

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

  // Check if a listing with a very similar name and city already exists
  const isDuplicate = data.some(item => 
    item.name.toLowerCase() === listing.name.toLowerCase() && 
    item.city.toLowerCase() === listing.city.toLowerCase()
  );

  if (!isDuplicate) {
    listing.id = `bingo-${listing.state.toLowerCase()}-${String(data.length + 1).padStart(3, '0')}`;
    listing.verified_at = new Date().toISOString().split('T')[0];
    data.push(listing);
    fs.writeFileSync(BINGO_DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Saved new listing: "${listing.name}" in ${listing.city}, ${listing.state}`);
  } else {
    console.log(`⚠️ Listing already exists, skipping: "${listing.name}"`);
  }
}

// Add items that do not meet the direct ingestion criteria to the manual review list
function saveManualReviewListing(listing, reason) {
  let manualData = [];
  if (fs.existsSync(MANUAL_REVIEW_FILE)) {
    try {
      manualData = JSON.parse(fs.readFileSync(MANUAL_REVIEW_FILE, 'utf-8'));
    } catch (e) {
      console.error('Error reading manual review file, starting fresh.');
    }
  }

  // Also read standard directory data to make sure we don't put already verified/saved items in the manual review list
  let directoryData = [];
  if (fs.existsSync(BINGO_DATA_FILE)) {
    try {
      directoryData = JSON.parse(fs.readFileSync(BINGO_DATA_FILE, 'utf-8'));
    } catch (e) {}
  }

  // Check if a listing with similar name and city already exists in manual review or directory
  const isDuplicate = manualData.some(item => 
    item.name.toLowerCase() === listing.name.toLowerCase() && 
    item.city.toLowerCase() === listing.city.toLowerCase()
  ) || directoryData.some(item => 
    item.name.toLowerCase() === listing.name.toLowerCase() && 
    item.city.toLowerCase() === listing.city.toLowerCase()
  );

  if (!isDuplicate) {
    listing.reason = reason;
    listing.scraped_at = new Date().toISOString().split('T')[0];
    manualData.push(listing);
    fs.writeFileSync(MANUAL_REVIEW_FILE, JSON.stringify(manualData, null, 2), 'utf-8');
    console.log(`⚠️ Flagged for manual review: "${listing.name}" (${reason})`);
    return true; // Newly added
  }
  return false;
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

        const nameVal = titleText.split(' at ')[0].split(' | ')[0].split(' / ')[0].trim();

        const listing = {
          name: nameVal,
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
        
        // Relevance Check
        const check = checkEventRelevance(nameVal, notes, schedule, venue);
        if (check.relevant) {
          saveBingoListing(listing);
        } else {
          const added = saveManualReviewListing(listing, check.reason);
          if (added) {
            newManualReviewItems.push({ ...listing, reason: check.reason });
          }
        }
        
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

        // Relevance Check
        const check = checkEventRelevance(name, res.description, 'Check website for schedule', venue);
        if (check.relevant) {
          saveBingoListing(listing);
        } else {
          const added = saveManualReviewListing(listing, check.reason);
          if (added) {
            newManualReviewItems.push({ ...listing, reason: check.reason });
          }
        }
      }

      console.log(`Sleeping to avoid rate limits...`);
      await sleep(DELAY_MS);
    }
  }

  console.log('\n========================================');
  console.log(`📋 CURRENT RUN - MANUAL REVIEW SITES (${newManualReviewItems.length} new):`);
  console.log('========================================');
  if (newManualReviewItems.length === 0) {
    console.log('No new sites flagged for manual review.');
  } else {
    newManualReviewItems.forEach((item, index) => {
      console.log(`[${index + 1}] Name: ${item.name}`);
      console.log(`    Venue: ${item.venue || 'N/A'} (${item.city || 'N/A'}, ${item.state || 'N/A'})`);
      console.log(`    Website: ${item.website}`);
      console.log(`    Reason: ${item.reason}`);
      console.log('----------------------------------------');
    });
  }

  console.log('\n🏁 Scraper completed successfully!');
}

runScraper();
