const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");

class CustomPage {
  constructor(page) {
    this.page = page;
  }

  static async build() {
    // launch browser
    const browser = await puppeteer.launch({
      headless: false, // the browser will open with GUI
    });

    // create a new tab
    const page = await browser.newPage();

    // create a custompage instance
    const customPage = new CustomPage(page);

    // combine access of multiple objects
    return new Proxy(customPage, {
      get: function (target, property) {
        // first look for property at customPage, then at browser, and then at page
        return target[property] || browser[property] || page[property];
      },
    });
  }

  async login() {
    // create new user
    const user = await userFactory();

    // generate session and sig
    const { session, sig } = sessionFactory(user);

    // set cookie on the page
    await this.page.setCookie({ name: "session", value: session });
    await this.page.setCookie({ name: "session.sig", value: sig });

    // refresh the page
    await this.page.goto("localhost:3000/blogs");

    // wait for the Logout button to be visible on the screen
    await this.page.waitFor("a[href='/auth/logout']");
  }

  async getContentOf(selector) {
    return this.page.$eval(selector, (el) => el.innerHTML);
  }

  get(url) {
    // page.evaluate(func, ...args) -> execute arbitrary JS in Chromium
    return this.page.evaluate((_url) => {
      return fetch(_url, {
        method: "GET",
        credentials: "same-origin", //credentials will be sent only when sent to the same origin URL (other options: include/omit)
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    }, url);
  }

  post(url, payload) {
    // page.evaluate(func, ...args) -> execute arbitrary JS in Chromium
    return this.page.evaluate(
      (_url, _payload) => {
        return fetch(_url, {
          method: "POST",
          credentials: "same-origin", //credentials will be sent only when sent to the same origin URL (other options: include/omit)
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(_payload),
        }).then((res) => res.json());
      },
      url,
      payload
    );
  }

  execRequests(actions) {
    return Promise.all(
      actions.map(({ method, url, payload }) => this[method](url, payload))
    );
  }
}

module.exports = CustomPage;
