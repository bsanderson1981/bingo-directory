import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BINGO_DATA_FILE = path.join(__dirname, '../public/data/bingo_directory.json');
const MANUAL_REVIEW_FILE = path.join(__dirname, '../public/data/manual_review.json');
const ZIPCODES_FILE = path.join(__dirname, '../public/data/zipcodes.json');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36';
const DELAY_MS = 4000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const STATES = [
  { name: 'Alabama', code: 'AL' },
  { name: 'Alaska', code: 'AK' },
  { name: 'Arizona', code: 'AZ' },
  { name: 'Arkansas', code: 'AR' },
  { name: 'California', code: 'CA' },
  { name: 'Colorado', code: 'CO' },
  { name: 'Connecticut', code: 'CT' },
  { name: 'Delaware', code: 'DE' },
  { name: 'Florida', code: 'FL' },
  { name: 'Georgia', code: 'GA' },
  { name: 'Hawaii', code: 'HI' },
  { name: 'Idaho', code: 'ID' },
  { name: 'Illinois', code: 'IL' },
  { name: 'Indiana', code: 'IN' },
  { name: 'Iowa', code: 'IA' },
  { name: 'Kansas', code: 'KS' },
  { name: 'Kentucky', code: 'KY' },
  { name: 'Louisiana', code: 'LA' },
  { name: 'Maine', code: 'ME' },
  { name: 'Maryland', code: 'MD' },
  { name: 'Massachusetts', code: 'MA' },
  { name: 'Michigan', code: 'MI' },
  { name: 'Minnesota', code: 'MN' },
  { name: 'Mississippi', code: 'MS' },
  { name: 'Missouri', code: 'MO' },
  { name: 'Montana', code: 'MT' },
  { name: 'Nebraska', code: 'NE' },
  { name: 'Nevada', code: 'NV' },
  { name: 'New Hampshire', code: 'NH' },
  { name: 'New Jersey', code: 'NJ' },
  { name: 'New Mexico', code: 'NM' },
  { name: 'New York', code: 'NY' },
  { name: 'North Carolina', code: 'NC' },
  { name: 'North Dakota', code: 'ND' },
  { name: 'Ohio', code: 'OH' },
  { name: 'Oklahoma', code: 'OK' },
  { name: 'Oregon', code: 'OR' },
  { name: 'Pennsylvania', code: 'PA' },
  { name: 'Rhode Island', code: 'RI' },
  { name: 'South Carolina', code: 'SC' },
  { name: 'South Dakota', code: 'SD' },
  { name: 'Tennessee', code: 'TN' },
  { name: 'Texas', code: 'TX' },
  { name: 'Utah', code: 'UT' },
  { name: 'Vermont', code: 'VT' },
  { name: 'Virginia', code: 'VA' },
  { name: 'Washington', code: 'WA' },
  { name: 'West Virginia', code: 'WV' },
  { name: 'Wisconsin', code: 'WI' },
  { name: 'Wyoming', code: 'WY' }
];

// Load zipcodes to detect cities
console.log('📦 Loading zipcode database to map cities...');
const zipcodes = JSON.parse(fs.readFileSync(ZIPCODES_FILE, 'utf-8'));
const citiesByState = {};
zipcodes.forEach(z => {
  if (!z.state || !z.city) return;
  const st = z.state.toUpperCase();
  if (!citiesByState[st]) {
    citiesByState[st] = new Set();
  }
  citiesByState[st].add(z.city.toLowerCase());
});

// Convert Sets to arrays sorted by length descending (to match longest city names first)
const sortedCitiesByState = {};
for (const state in citiesByState) {
  sortedCitiesByState[state] = Array.from(citiesByState[state]).sort((a, b) => b.length - a.length);
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function detectCity(title, snippet, stateCode) {
  const cities = sortedCitiesByState[stateCode];
  if (!cities) return 'Unknown';
  
  const text = `${title} ${snippet}`.toLowerCase();
  for (const city of cities) {
    const regex = new RegExp('\\b' + escapeRegExp(city) + '\\b', 'i');
    if (regex.test(text)) {
      return city.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
  }
  return 'Unknown';
}

function checkEventRelevance(name, description, schedule, venue) {
  const nameText = (name || '').toLowerCase();
  const descText = (description || '').toLowerCase();
  const scheduleText = (schedule || '').toLowerCase();
  const venueText = (venue || '').toLowerCase();

  // Explicitly allow "drag queen bingo", "drag bingo", "drag show", or "drag brunch" search term matches to bypass checks and add to directory
  const hasExplicitDragEvent = nameText.includes('drag queen bingo') || 
                               descText.includes('drag queen bingo') ||
                               nameText.includes('drag bingo') ||
                               descText.includes('drag bingo') ||
                               nameText.includes('drag show') ||
                               descText.includes('drag show') ||
                               nameText.includes('drag brunch') ||
                               descText.includes('drag brunch');

  if (hasExplicitDragEvent) {
    return { relevant: true };
  }

  const hasBingoInName = nameText.includes('bingo');
  const hasKeywords = nameText.includes('drag') || nameText.includes('lgbt') || 
                      descText.includes('drag') || descText.includes('lgbt');
  
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

function saveBingoListing(listing) {
  let data = [];
  if (fs.existsSync(BINGO_DATA_FILE)) {
    try {
      data = JSON.parse(fs.readFileSync(BINGO_DATA_FILE, 'utf-8'));
    } catch (e) {}
  }

  const isDuplicate = data.some(item => 
    item.name.toLowerCase() === listing.name.toLowerCase() && 
    item.city.toLowerCase() === listing.city.toLowerCase()
  );

  if (!isDuplicate) {
    listing.id = `bingo-${listing.state.toLowerCase()}-${String(data.length + 1).padStart(3, '0')}`;
    listing.verified_at = new Date().toISOString().split('T')[0];
    data.push(listing);
    fs.writeFileSync(BINGO_DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`   ✅ Saved directly to main directory: "${listing.name}" in ${listing.city}, ${listing.state}`);
  }
}

function saveManualReviewListing(listing, reason) {
  let manualData = [];
  if (fs.existsSync(MANUAL_REVIEW_FILE)) {
    try {
      manualData = JSON.parse(fs.readFileSync(MANUAL_REVIEW_FILE, 'utf-8'));
    } catch (e) {}
  }

  let directoryData = [];
  if (fs.existsSync(BINGO_DATA_FILE)) {
    try {
      directoryData = JSON.parse(fs.readFileSync(BINGO_DATA_FILE, 'utf-8'));
    } catch (e) {}
  }

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
    console.log(`   ⚠️ Flagged for manual review: "${listing.name}" (${reason})`);
  }
}

async function runSecondaryScraper() {
  console.log('🏁 Starting 50-State Secondary Scraper for "drag Queen Bingo"...');
  
  const targetStates = process.argv.slice(2).map(s => s.toUpperCase());
  const activeStates = targetStates.length > 0 
    ? STATES.filter(s => targetStates.includes(s.code))
    : STATES;

  for (let i = 0; i < activeStates.length; i++) {
    const state = activeStates[i];
    console.log(`\n========================================`);
    console.log(`State: ${state.name} (${state.code}) (${i + 1}/${activeStates.length})`);
    console.log(`========================================`);

    const queries = [
      `"drag queen bingo" ${state.name}`,
      `"drag bingo" ${state.name}`,
      `"drag show" ${state.name}`,
      `"drag brunch" ${state.name}`
    ];

    for (const query of queries) {
      const results = await searchBing(query);
      console.log(`   Found ${results.length} search results.`);

      for (const res of results) {
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

        name = name.replace(/(Eventbrite|Facebook|Meetup|Ticketmaster)/gi, '').trim();
        venue = venue.replace(/(Eventbrite|Facebook|Meetup|Ticketmaster)/gi, '').trim();

        // Detect city from title or description snippet
        const detectedCity = detectCity(res.title, res.description, state.code);

        const categories = ['drag', 'lgbtq+'];
        const listing = {
          name: name || 'Drag Queen Bingo Night',
          venue: venue || 'Local Venue',
          address: '',
          city: detectedCity,
          state: state.code,
          zip: '',
          latitude: null,
          longitude: null,
          phone: '',
          website: res.url,
          schedule: 'Check website for schedule',
          categories: categories,
          notes: res.description || 'Drag Queen Bingo event.'
        };

        const check = checkEventRelevance(name, res.description, 'Check website for schedule', venue);
        if (check.relevant) {
          saveBingoListing(listing);
        } else {
          saveManualReviewListing(listing, check.reason);
        }
      }

      console.log(`   Sleeping to avoid rate limits...`);
      await sleep(DELAY_MS);
    }
  }

  console.log('\n🏁 Secondary scraper completed successfully!');
}

runSecondaryScraper();
