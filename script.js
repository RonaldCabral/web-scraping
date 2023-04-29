const url = 'https://openai.com/blog/chatgpt'
async function scraper (url) {
    const puppeteer = require('puppeteer');
    const mysql = require('mysql2');
    
    //Configuring the connection to the database
    const connection = mysql.createConnection({
      host: '',
      user: '',
      password: '',
      database: '',
    });
    
    //Function to insert data into the database
    function insertDataContent(content) {
      const query = `INSERT INTO data (content) VALUES ('${content}')`;
      connection.query(query, (error, results, fields) => {
        if (error) {
          console.error(error);
        }
        console.log('Data inserted correctly.');
      });
    }
    
    //Main function (where the magic happens)
    async function scrape(link) {
  
      //We start an instance of Puppeteer
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
    
      //Go to the page
      await page.goto(url);
    
      //Get the data
     const content = await page.evaluate(() => Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li')).map(Element => Element.textContent));
      
      //insert the data into the database
      for (let i = 0; i < content.length; i++) {
        insertDataContent(content[i]);
      }
    
      // Close th instance 
      await browser.close();
    }
    
    // exec 
    scrape(url)
  }

scraper(url)