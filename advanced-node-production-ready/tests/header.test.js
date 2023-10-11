// const puppeteer = require("puppeteer");
// const mongoose = require("mongoose");
// const sessionFactory = require("./factories/sessionFactory");
// const userFactory = require("./factories/userFactory");
const Page = require("./helpers/page"); // proxy to customPage, puppeteer's Page and puppeteer's browser

// let browser
let page;

/* Boot up Chromium instance */
beforeEach(async () => {
  // create a new page
  page = await Page.build();

  // navigate to the running app
  await page.goto("localhost:3000");
});

/*
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
*/

/* Terminate Chromium instance */
afterEach(async () => {
  // close the page
  await page.close();
});

/*
afterEach(async () => {
  // close the running browser instance
  await browser.close();
});
*/

test("Header has correct text", async () => {
  // get the content of an element by a selector
  //const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);
  const text = await page.getContentOf("a.brand-logo");

  // make assertion about the content
  expect(text).toEqual("Blogster");
});

test("Click login starts OAuth flow", async () => {
  // click on a link
  await page.click(".right a");

  // get url
  const url = await page.url();

  // assert url matches a regex
  expect(url).toMatch(/accounts\.google\.com/);
});

/*
test("When signed in show logout button", async () => {
  // generate session
  const userId = "64ccc20d52d46f2c94a4f9e1";
  const Buffer = require("safe-buffer").Buffer;
  const sessionObject = {
    passport: {
      user: userId,
    },
  };
  const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString(
    "base64"
  );

  // generate signatures
  const Keygrip = require("keygrip");
  const keys = require("../config/keys");
  const keygrip = new Keygrip([keys.cookieKey]);
  const sig = keygrip.sign("session=" + sessionString);

  // set cookie on the page
  await page.setCookie({ name: "session", value: sessionString });
  await page.setCookie({ name: "session.sig", value: sig });

  // refresh the page
  await page.goto("localhost:3000");

  // wait for the elemet on the screen
  await page.waitFor("a[href='/auth/logout']");

  // get the content of an element by a selector
  const text = await page.$eval("a[href='/auth/logout']", (el) => el.innerHTML);

  // make assertion about the content
  expect(text).toEqual("Logout");
});
*/

/*
test("When signed in show logout button", async () => {
  // create new user
  const user = await userFactory();

  // generate session and sig
  const { session, sig } = sessionFactory(user);

  // set cookie on the page
  await page.setCookie({ name: "session", value: session });
  await page.setCookie({ name: "session.sig", value: sig });

  // refresh the page
  await page.goto("localhost:3000");

  // wait for the elemet to be visible on the screen
  await page.waitFor("a[href='/auth/logout']");

  // get the content of an element by a selector
  const text = await page.$eval("a[href='/auth/logout']", (el) => el.innerHTML);

  // make assertion about the content
  expect(text).toEqual("Logout");
});
*/

test("When signed in show logout button", async () => {
  // login
  await page.login();

  // get the content of an element by a selector
  const text = await page.getContentOf("a[href='/auth/logout']");

  // make assertion about the content
  expect(text).toEqual("Logout");
});
