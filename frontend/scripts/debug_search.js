import * as cheerio from 'cheerio';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36';

async function searchBing(query) {
  const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
  console.log(`Querying: ${url}`);
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT }
  });
  const html = await response.text();
  const $ = cheerio.load(html);
  
  console.log(`HTML size: ${html.length} chars`);
  
  $('.b_algo').each((i, el) => {
    const titleAnchor = $(el).find('h2 a');
    const title = titleAnchor.text().trim();
    const href = titleAnchor.attr('href');
    const snippet = $(el).find('.b_caption p, .b_algoSublist').text().trim();
    
    console.log(`[Result ${i+1}]`);
    console.log(`  Title: "${title}"`);
    console.log(`  URL: "${href}"`);
    console.log(`  Snippet: "${snippet}"`);
  });
}

searchBing('drag queen bingo Los Angeles CA');
