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
  constructor(page) {
    this.page = page;
  }

  static build() {
    const page = new Page();
    const customPage = new CustomPage(page);
    // combine access of both classes
    const superPage = new Proxy(customPage, {
      get: function (target, property) {
        return target[property] || page[property];
      },
    });
    return superPage;
  }

  login() {
    this.page.goto("localhost:3000");
    this.page.setCookie();
  }
}

const superPage = CustomPage.build();
superPage.login();
superPage.goto();
