const Page = require("./helpers/page"); // proxy to customPage, puppeteer's Page and puppeteer's browser

let page;

/* Boot up Chromium instance */
beforeEach(async () => {
  // create a new page
  page = await Page.build();
  // navigate to the running app
  await page.goto("http://localhost:3000");
});

/* Terminate Chromium instance */
afterEach(async () => {
  // close the page
  await page.close();
});

/* Group tests with nested describe structure */
describe("When logged in", async () => {
  beforeEach(async () => {
    // login
    await page.login();
    // click on a + button
    await page.click("a.btn-floating");
  });

  test("can see blog create form", async () => {
    // get the content of the form label
    const label = await page.getContentOf("form label");
    // make assertion about the content
    expect(label).toEqual("Blog Title");
  });

  describe("And using invalid inputs", async () => {
    beforeEach(async () => {
      // click on submit button
      await page.click("form button");
    });

    test("the form shows error message", async () => {
      // get the content of the validation error messages
      const titleError = await page.getContentOf(".title .red-text");
      const contentError = await page.getContentOf(".content .red-text");
      // make assertion about the content
      expect(titleError).toEqual("You must provide a value");
      expect(contentError).toEqual("You must provide a value");
    });
  });

  describe("And using valid inputs", async () => {
    beforeEach(async () => {
      // type title and content (args: 1 -> selector of element, 2 -> text)
      await page.type(".title input", "Test Title");
      await page.type(".content input", "Test Content");
      // click on submit button
      await page.click("form button");
    });

    test("submitting takes the user to the review screen", async () => {
      const text = await page.getContentOf("h5");
      expect(text).toEqual("Please confirm your entries");
    });

    test("submitting then saving adds blog to the index page", async () => {
      // click on save button
      await page.click("button.green");
      // wait for the card appeared on the screen
      await page.waitFor(".card");
      // assert title and content
      const title = await page.getContentOf(".card-title");
      const content = await page.getContentOf("p");
      expect(title).toEqual("Test Title");
      expect(content).toEqual("Test Content");
    });
  });
});

describe("When not logged in", async () => {
  test("user cannot get the list of posts", async () => {
    const apiRequestResult = await page.get("api/blogs");
    expect(apiRequestResult).toEqual({ error: "You must log in!" });
  });

  test("user cannot create blog posts", async () => {
    const apiRequestResult = await page.post("api/blogs", {
      title: "Title",
      content: "Content",
    });
    expect(apiRequestResult).toEqual({ error: "You must log in!" });
  });

  // combine the upper two tests
  test("blog related actions are prohibited", async () => {
    const actions = [
      {
        method: "get",
        url: "api/blogs",
      },
      {
        method: "post",
        url: "api/blogs",
        payload: {
          title: "Title",
          content: "Content",
        },
      },
    ];
    const apiRequestsResults = await page.execRequests(actions);
    for (const result of apiRequestsResults) {
      expect(result).toEqual({ error: "You must log in!" });
    }
  });
});
