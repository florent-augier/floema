import Page from "classes/Page";

export default class Home extends Page {
  constructor() {
    super({
      id: "home",

      element: ".home",
      elements: {
        navigation: document.querySelector(".navigation"),
        link: ".home__link",
      },
    });
  }

  // create() {
  //   super.create();

  //   this.elements.link.addEventListener("click", (_) =>
  //     console.log("You clicked on link")
  //   );
  // }
}
