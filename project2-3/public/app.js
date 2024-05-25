import Card from "./card.js";
import Mover from "./mover.js";

/*
Draggable cards design change

When a card drag starts, calculate midline of all cards and assign it to the card.midline property

When a card is being dragged into/over a column, loop over all cards and open up a landing spot
that is above the closest midline that is below the current mouse xy
*/

export default class App {
  constructor() {
    // event listener for adding a card
    this.form = document.getElementById("addCard");
    this.form.addEventListener("submit", this.handleSubmit);

    // mover instantiation
    this.mover = new Mover()

    // theme toggle button setup
    this.toggleSpan = document.querySelector("#toggleMode .material-symbols-outlined");
    this.toggleModeButton = document.querySelector("#toggleMode");
    this.toggleModeButton.addEventListener("click", this.handleToggleMode);
    
    // theme setup
    this.html = document.querySelector("html");
    this.theme = this.getTheme();
    this.setTheme(this.theme);

    // store cards and theme in localStorage before unloading / switching page
    window.addEventListener("beforeunload", this.beforeUnload);
    document.addEventListener("visibilitychange", this.beforeUnload);
    document.addEventListener("click", this.handleDocumentClick);

    // load cards stored in localStorage
    this.loadCards();
  }

  handleDocumentClick = () => {
    let cards = document.querySelectorAll(".card:not(.template)");
    cards.forEach((card) => {
      card.classList.remove("dropped");
    });
  }

  beforeUnload = () => {
    localStorage.setItem("theme", this.theme);

    this.cards = [];
    const allCards = document.querySelectorAll(".card:not(.template)");
    allCards.forEach((card) => {
      const title = card.querySelector(".title").textContent;
      const color = card.style.backgroundColor;
      const desc = card.querySelector(".description").textContent;
      const column = card.parentNode.id;
      this.cards.push({title: title, color: color, desc: desc, column: column});
    });
    localStorage.setItem("cards", JSON.stringify(this.cards));
  }

  loadCards() {
    const cards = JSON.parse(localStorage.getItem("cards"));
    if (cards !== null && Object.keys(cards).length !== 0) {
      cards.forEach((card) => {
        let newCard = this.addCard(card.column, card.title, card.color);
        newCard.setDescription(card.desc);
      });
    }
  }

  getTheme() {
    const storedTheme = localStorage.getItem("theme");
    const osPrefDark = window.matchMedia("(prefers-color-scheme: dark)");

    if (storedTheme !== null) {
      return storedTheme;
    }
    if (osPrefDark.matches) {
      return "dark";
    }
    return "light";
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

  handleToggleMode = () => {
    let newTheme;

    if (this.toggleSpan.textContent === "dark_mode") {
      newTheme = "light";
    }
    else {
      newTheme = "dark";
    }

    this.setTheme(newTheme);
  }

  setTheme(newTheme) {
    this.html.setAttribute("data-theme", newTheme);
    this.toggleSpan.textContent = `${newTheme}_mode`;
    this.theme = newTheme;
  }
}