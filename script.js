const axios = require('axios');
const cheerio = require('cheerio');
const sanitizeHtml = require('sanitize-html');
const mysql = require('mysql');

// Database configuration
const dbConfig = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
};

// Function to save the data in the database
function saveDataToDatabase(title, content) {
  const connection = mysql.createConnection(dbConfig);
  connection.connect();

  const query = 'INSERT INTO data (title, content) VALUES (?, ?)';
  const values = [title, content];

  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.error('Error saving data to database:', error);
    } else {
      console.log('Data saved to database');
    }
  });

  connection.end();
}

// Function to do web scraping of a page
async function scrapePage(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const title = $('title').text();
    const sanitizedContent = sanitizeHtml($('body').html(), {
      allowedTags: [],
      allowedAttributes: {}
    });
    const content = cheerio.load(sanitizedContent).text();

    saveDataToDatabase(title, content);
  } catch (error) {
    console.error('Error scraping page:', error);
  }
}

// Function to process the sitemap and extract the URLs
async function processSitemap(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const sitemapUrls = $('urlset url loc').map((i, el) => $(el).text()).get();

    for (const pageUrl of sitemapUrls) {
      await scrapePage(pageUrl);
    }
  } catch (error) {
    console.error('Error getting URLs from Sitemap:', error);
  }
}

// Process the main sitemap
processSitemap('  ');