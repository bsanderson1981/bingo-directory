import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../public/data/us_centers.json');

// Configuration
const BATCH_SIZE = 50; // How many to process per run
const DELAY_MS = 3000; // Delay between searches to avoid IP ban

// Domains we want to ignore when searching for an official website
const IGNORED_DOMAINS = [
    'facebook.com',
    'yelp.com',
    'mapquest.com',
    'yellowpages.com',
    'seniorcenterdirectory.com',
    'wikipedia.org',
    'caring.com',
    'seniorcare2share.com',
    'agingcare.com',
    'aplaceformom.com',
    'alignable.com',
    'local.yahoo.com',
    'foursquare.com',
    'chamberofcommerce.com',
    'manta.com',
    'buzzfile.com',
    'countyoffice.org',
    'seniorcenter.us',
    'seniorcenter.info',
    'search.yahoo.com',
    'health.usnews.com',
    'usnews.com',
    'dnb.com',
    'opendi.us',
    'localyahoo.com',
    'amazon.com',
    'calculator.net',
    'zhihu.com',
    'learnreligions.com',
    'youtube.com',
    'tripadvisor.com',
    'zillow.com',
    'realtor.com',
    'instagram.com',
    'twitter.com',
    'linkedin.com',
    'pinterest.com',
    'bizapedia.com',
    'superpages.com',
    'dexknows.com',
    'greatnonprofits.org',
    'guidestar.org',
    'nursinghomes.com',
    'seniorcare.com',
    'care.com',
    'waze.com',
    'apple.com/maps',
    'local.com',
    'bizjournals.com',
    'bloomberg.com',
    'glassdoor.com',
    'indeed.com',
    'laweekly.com',
    'reddit.com',
    'stackexchange.com',
    'stackoverflow.com',
    'britannica.com',
    'merriam-webster.com',
    'dictionary.com',
    'wiktionary.org',
    'encyclopedia.com',
    'thefreedictionary.com',
    'wikipedia.org'
];

const BAD_URL_KEYWORDS = [
    'onlyfans',
    'sex',
    'porn',
    'xxx',
    'escort',
    'nude',
    'cam',
    'naked',
    'babes',
    'tits',
    'milf',
    'livejasmin',
    'chaturbate',
    'strip',
    'dating',
    'adult'
];

// Helper to pause execution
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to verify if an address string is found on a website
async function verifyWebsiteAddress(url, addressText) {
    if (!addressText) return true; // If we don't have an address to verify against, assume it's okay

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.log(`      [Fetch Error] Status: ${response.status} for ${url}`);
            return false; // Could not fetch or error, reject
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Remove scripts, styles, noscript to only get visible text
        $('script, style, noscript, svg, img, iframe').remove();
        let pageText = $('body').text();

        // Normalize page text
        pageText = pageText.toLowerCase().replace(/[^a-z0-9]/g, ' ');
        // Collapse multiple spaces
        pageText = pageText.replace(/\s+/g, ' ');

        // Normalize the address to check
        let normalizedAddress = addressText.toLowerCase().replace(/[^a-z0-9]/g, ' ');
        normalizedAddress = normalizedAddress.replace(/\s+/g, ' ').trim();

        // Basic verification: look for the primary number and the first word of the street
        // e.g "123 Main St" -> check if "123 main" exists sequentially
        const addressParts = normalizedAddress.split(' ');
        if (addressParts.length >= 2) {
            const checkString = `${addressParts[0]} ${addressParts[1]}`;
            const isValid = pageText.includes(checkString);
            if (!isValid) {
                console.log(`      [Address Verify Failed] Looking for '${checkString}' but not found on ${url}`);
            }
            return isValid;
        }

        return true;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log(`      [Fetch Timeout] 10s timeout trying to reach ${url}`);
        } else {
            console.log(`      [Fetch Error] ${error.message} on ${url}`);
        }
        return false; // Error fetching or parsing, safer to reject
    }
}

async function searchBing(query, address) {
    try {
        const response = await fetch(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            }
        });

        const html = await response.text();
        const $ = cheerio.load(html);

        let foundUrl = null;

        // We need to use a standard for loop instead of .each to use await inside
        const links = $('h2 a').toArray();

        for (const el of links) {
            const href = $(el).attr('href');
            if (!href) continue;

            let actualUrl = href;

            // Bing often wraps links in their own redirect with base64 encoded URL in 'u' param
            if (href.includes('bing.com/ck/') || href.startsWith('/ck/a?')) {
                try {
                    const urlObj = new URL(href, 'https://www.bing.com');
                    const uParam = urlObj.searchParams.get('u');
                    if (uParam && uParam.startsWith('a1')) {
                        const base64str = uParam.substring(2); // Remove "a1" prefix
                        actualUrl = Buffer.from(base64str, 'base64').toString('utf8');
                    }
                } catch (e) {
                    // ignore parsing error
                }
            }

            if (!actualUrl.startsWith('http')) continue;

            const urlLower = actualUrl.toLowerCase();

            // Check if it's from an ignored domain
            const isIgnored = IGNORED_DOMAINS.some(domain => urlLower.includes(domain));

            // Also ensure it's not a generic news article or wiki link if possible
            const isBadPath = urlLower.includes('/dp/') || urlLower.includes('/question/') || urlLower.includes('/book/') || urlLower.includes('/article/');

            // rigorous check for NSFW/Spam content
            const isNSFW = BAD_URL_KEYWORDS.some(keyword => urlLower.includes(keyword));

            if (!isIgnored && !isBadPath && !isNSFW) {
                // Now verify the address is on the candidate page
                console.log(`    Checking candidate: ${actualUrl}`);
                const hasAddress = await verifyWebsiteAddress(actualUrl, address);

                if (hasAddress) {
                    foundUrl = actualUrl;
                    break; // Found a valid one, stop checking
                }
            }
        }

        return foundUrl;
    } catch (error) {
        console.error(`Error searching for ${query}:`, error.message);
        return null;
    }
}

async function findMissingWebsites() {
    console.log(`Loading data from ${DATA_FILE}...`);
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

    // clear out previous bad NOT_FOUND or amazon matches and NSFW links
    const missing = data.filter(c => {
        if (!c.website || c.website.trim() === '' || c.website === 'NOT_FOUND') return true;
        const url = c.website.toLowerCase();
        return url.includes('amazon.com') ||
            url.includes('calculator.net') ||
            url.includes('zhihu.com') ||
            url.includes('learnreligions.com') ||
            url.includes('britannica.com') ||
            url.includes('merriam-webster.com') ||
            url.includes('dictionary.com') ||
            BAD_URL_KEYWORDS.some(kw => url.includes(kw));
    });

    console.log(`Found ${missing.length} centers to process.`);

    const toProcess = missing.slice(0, BATCH_SIZE);
    console.log(`Processing next ${toProcess.length} centers...`);

    let updatedCount = 0;

    for (let i = 0; i < toProcess.length; i++) {
        const center = toProcess[i];
        console.log(`[${i + 1}/${toProcess.length}] Searching for: ${center.name} - ${center.address || center.city || ''}`);

        const query = `${center.name} senior center ${center.city || ''} ${center.state || ''} website`;
        const websiteUrl = await searchBing(query, center.address);

        if (websiteUrl) {
            console.log(`  -> Found: ${websiteUrl}`);
            center.website = websiteUrl;
            updatedCount++;
        } else {
            console.log(`  -> No official website found. Marking as 'NOT_FOUND'`);
            center.website = 'NOT_FOUND';
        }

        // Save progressively in case script is stopped
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

        if (i < toProcess.length - 1) {
            await sleep(DELAY_MS);
        }
    }

    console.log(`\nFinished processing batch! Found ${updatedCount} websites.`);
    console.log(`Run the script again to process the next batch of ${BATCH_SIZE}.`);
}

findMissingWebsites();
