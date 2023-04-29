const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = 'https://popularenlinea.com/personas/Paginas/Home.aspx';

  await page.goto(url);

  const title = await page.title();

  const content = await page.evaluate(() => Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li')).map(Element => Element.textContent));

  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(link => {
      return { name: link.innerText, url: link.href };
    });
  });

  
  console.log('Contenido:', content);


  await browser.close();
})();