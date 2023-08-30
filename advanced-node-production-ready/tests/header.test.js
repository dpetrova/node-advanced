const puppeteer = require("puppeteer");

let browser, page;

/* Boot up Chromium instance */
beforeEach(async () => {
  // launch browser
  browser = await puppeteer.launch({
    headless: false, // the browser will open with GUI
  });

  // create a new tab
  page = await browser.newPage();

  // navigate to the running app
  await page.goto("localhost:3000");
});

/* Terminate Chromium instance */
afterEach(async () => {
  // close the running browser instance
  await browser.close();
});

test("Assert header logo", async () => {
  // get the content of an element by a selector
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);

  // make assertion about the content
  expect(text).toEqual("Blogster");
});
