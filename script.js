const axios = require('axios');
const cheerio = require('cheerio');
const sanitizeHtml = require('sanitize-html');
const mysql = require('mysql');

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'ronaldr4',
  database: 'test'
};

// Función para guardar los datos en la base de datos
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

// Función para hacer web scraping de una página
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

// Función para procesar el sitemap y extraer las URLs
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

// Procesar el sitemap principal
processSitemap('https://openai.com/sitemap.xml');