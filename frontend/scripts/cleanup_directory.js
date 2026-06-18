import fs from 'fs';
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

// Read files
let directory = [];
if (fs.existsSync(BINGO_DATA_FILE)) {
  directory = JSON.parse(fs.readFileSync(BINGO_DATA_FILE, 'utf-8'));
}

let manualReview = [];
if (fs.existsSync(MANUAL_REVIEW_FILE)) {
  manualReview = JSON.parse(fs.readFileSync(MANUAL_REVIEW_FILE, 'utf-8'));
}

// Pool all events together and deduplicate by name + city (allowing different events at same venue)
const allEventsMap = new Map();

function getEventKey(item) {
  const namePart = item.name ? item.name.trim().toLowerCase() : '';
  const cityPart = item.city ? item.city.trim().toLowerCase() : '';
  return `${namePart}|${cityPart}`;
}

// Add directory events first (preserving their IDs and metadata)
for (const item of directory) {
  const key = getEventKey(item);
  allEventsMap.set(key, item);
}

// Add manual review events (only if they aren't already represented)
for (const item of manualReview) {
  const key = getEventKey(item);
  if (!allEventsMap.has(key)) {
    allEventsMap.set(key, item);
  }
}

const allEvents = Array.from(allEventsMap.values());

const keptDirectory = [];
const movedToManual = [];

for (const item of allEvents) {
  const nameText = item.name || '';
  const descText = item.notes || '';
  const scheduleText = item.schedule || '';
  const venueText = item.venue || '';

  // 1. Must contain "bingo" in the event name
  const hasBingoInName = nameText.toLowerCase().includes('bingo');

  // 2. Check if the venue is a known LGBTQ+ bar/business
  const venueLower = venueText.toLowerCase();
  const isKnownLgbtqVenue = KNOWN_LGBTQ_VENUES.some(v => venueLower.includes(v));

  // 3. Must contain "drag" or "lgbt" in name or description OR be at a known LGBTQ+ venue
  const hasKeywords = nameText.toLowerCase().includes('drag') || 
                      nameText.toLowerCase().includes('lgbt') ||
                      descText.toLowerCase().includes('drag') || 
                      descText.toLowerCase().includes('lgbt') ||
                      isKnownLgbtqVenue;

  // 4. Must NOT be an annual event (no "annual" in name, description, schedule)
  const isAnnual = nameText.toLowerCase().includes('annual') || 
                   descText.toLowerCase().includes('annual') ||
                   scheduleText.toLowerCase().includes('annual');

  // 5. Must be weekly or monthly (schedule or description mentions recurring days or keywords)
  const daysPattern = /(every|each|weekly|monthly|monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun|1st|2nd|3rd|4th|last|regularly)/i;
  const hasRecurring = daysPattern.test(scheduleText) || 
                       daysPattern.test(nameText) || 
                       descText.toLowerCase().includes('every') || 
                       descText.toLowerCase().includes('weekly') || 
                       descText.toLowerCase().includes('monthly') ||
                       daysPattern.test(descText);

  if (!hasBingoInName) {
    movedToManual.push({ item, reason: "No 'bingo' in event name" });
  } else if (!hasKeywords) {
    movedToManual.push({ item, reason: "Missing 'drag' or 'lgbt' keywords" });
  } else if (isAnnual) {
    movedToManual.push({ item, reason: "Annual event (not weekly or monthly)" });
  } else if (!hasRecurring) {
    movedToManual.push({ item, reason: "Not verified as weekly or monthly recurring event" });
  } else {
    keptDirectory.push(item);
  }
}

// Re-index kept items to ensure clean CA/IA IDs if they don't have them
let caIndex = 1;
let iaIndex = 1;
const finalDirectory = keptDirectory.map(item => {
  const state = item.state ? item.state.toLowerCase() : 'ca';
  const prefix = `bingo-${state}`;
  const count = state === 'ia' ? iaIndex++ : caIndex++;
  
  // Keep original ID if it already matches the pattern, otherwise generate
  if (!item.id || !item.id.startsWith(prefix)) {
    item.id = `${prefix}-${String(count).padStart(3, '0')}`;
  }
  
  // Ensure verified date is present
  if (!item.verified_at) {
    item.verified_at = new Date().toISOString().split('T')[0];
  }
  // Remove any stale reason fields from directory items
  delete item.reason;
  return item;
});

// Update directory file
fs.writeFileSync(BINGO_DATA_FILE, JSON.stringify(finalDirectory, null, 2), 'utf-8');

// Update manual review file (without directory items)
const finalManualReview = movedToManual.map(entry => {
  const item = entry.item;
  item.reason = entry.reason;
  if (!item.scraped_at) {
    item.scraped_at = new Date().toISOString().split('T')[0];
  }
  delete item.id; // Keep manual review items ID-less
  return item;
});

fs.writeFileSync(MANUAL_REVIEW_FILE, JSON.stringify(finalManualReview, null, 2), 'utf-8');

console.log(`✅ Success! Kept ${finalDirectory.length} events in main directory.`);
console.log(`📋 Moved/Kept ${finalManualReview.length} events in manual review.`);
console.log(`\nReturned to Directory:`);
finalDirectory.forEach(item => {
  // If it was previously in manual review list, notify
  const wasInManual = manualReview.some(x => x.website && x.website === item.website);
  if (wasInManual) {
    console.log(`✨ Restored: "${item.name}" at "${item.venue}"`);
  }
});
