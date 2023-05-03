const puppeteer = require('puppeteer');
const mysql = require('mysql');

// Set up MySQL connection
const connection = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: ''
});

// Connect to MySQL
connection.connect(function(err) {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Function to insert data into MySQL
function insertData(title, content) {
  const sql = 'INSERT INTO data (title, content) VALUES (?, ?)';
  const values = [title, content];
  connection.query(sql, values, function(err, result) {
    if (err) throw err;
    console.log('Data inserted successfully');
  });
}

// Function to extract data from webpage
async function extractData(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // Get all divs on the page
  const divs = await page.$$('div');

  for (const div of divs) {
    // Check if div has a title
    const title = await page.evaluate(() => Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(Element => Element.textContent));

    // Get all paragraphs in the div
    const paragraphs = await div.$$('p');
    let content = '';

    // Combine all paragraphs into a single string
    for (const paragraph of paragraphs) {
      const text = await paragraph.evaluate(element => element.textContent.trim());
      content += text + ' ';
    }

    // If no title, save paragraphs as title
    if (!title) {
      title = content.substring(0, 50) + '...';
    }

    // Insert data into MySQL
    insertData(title, content);
  }

  await browser.close();
}

// Example usage
extractData('');