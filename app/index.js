class App {
  constructor() {
    console.log("App");
  }

  createPages() {
    this.pages = {
      about: new About(),
      collection: new Collection(),
      detail: new Detail(),
      home: new Home(),
    };
  }
}

new App();
