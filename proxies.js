// class implemented by library; don't want to change the class
class Page {
  goto() {
    console.log("Go to URL");
  }
  setCookie() {
    console.log("Set cookies");
  }
}

// custom written class
class CustomPage {
  login() {
    console.log("Login");
  }
}

// instances of both classes
const page = new Page();
const customPage = new CustomPage();
page.goto();
customPage.login();

// using proxy to combine access to both classes
const pages = new Proxy(customPage, {
  get: function (target, property) {
    console.log("target: ", target); // target object (customPage)
    console.log("property: ", property); // property we trying to access

    // first look up for the property of customPage and then of page
    return target[property] || page[property];
  },
});

pages.login(); // access property of customPage
pages.goto(); // access property of page
