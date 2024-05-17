import Card from "./card.js";
import Mover from "./mover.js";

export default class App {
  constructor() {
    // event listener for adding a card
    this.form = document.getElementById("addCard");
    this.form.addEventListener("submit", this.handleSubmit);

    // mover instantiation
    this.mover = new Mover()
  }

  addCard(col, title, color) {
    let card = new Card(title, color);
    let colElem = document.querySelector(`#${col}`);
    card.addToCol(colElem, this.mover);
    return card;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let cardTitle = document.querySelector("#cardTitle").value;
    let cardColor = document.querySelector("#cardColor").value;
    this.addCard("todo", cardTitle, cardColor);
    this.form.reset();

    this.mover.stopMoving();
  }
}
