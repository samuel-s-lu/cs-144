import Card from "./card.js";
import Mover from "./mover.js";

export default class App {
  constructor() {
    // load cards stored in MongoDB
    this.loadCards();

    // event listener for adding a card
    this.form = document.getElementById("addCard");
    this.form.addEventListener("submit", this.handleSubmit);

    // mover instantiation
    this.mover = new Mover()

    // theme toggle button setup
    this.toggleSpan = document.querySelector("#toggleMode .material-symbols-outlined");
    this.toggleModeButton = document.querySelector("#toggleMode");
    this.toggleModeButton.addEventListener("click", this.handleToggleMode);

    // logout button setup
    this.logoutButton = document.querySelector("#logout");
    this.logoutButton.addEventListener("click", this.handleLogout);
    
    // theme setup
    this.html = document.querySelector("html");
    this.theme = this.getTheme();
    this.setTheme(this.theme);

    // store cards and theme in localStorage before unloading / switching page
    // window.addEventListener("beforeunload", this.beforeUnload);
    // document.addEventListener("visibilitychange", this.beforeUnload);
    document.addEventListener("mousedown", this.handleDocumentMouseDown);

    // MutationObserver setup
    // const todo = document.getElementById('todo');
    // const doing = document.getElementById('doing');
    // const done = document.getElementById('done');
    // const observerConfig = {
    //   childList: true,
    //   subtree: false,
    //   attributes: false
    // };
    // const throttledObserverCallback = this.throttle(this.observerCallback, 500);
    // const observer = new MutationObserver(throttledObserverCallback);
    // observer.observe(todo, observerConfig);
    // observer.observe(doing, observerConfig);
    // observer.observe(done, observerConfig);
  }

  handleLogout = () => {
    window.location.href = "/";
    fetch('/logout', { method: 'POST' });
  }

  noAction() {}

  handleDocumentMouseDown = () => {
    let cards = document.querySelectorAll(".card:not(.template)");
    cards.forEach((card) => {
      card.classList.remove("dropped");
    });
  }

  beforeUnload = () => {
    localStorage.setItem("theme", this.theme);

    let data = {
      user: localStorage["user"],
      todo: [],
      doing: [],
      done: []
    };

    const allCards = document.querySelectorAll(".card:not(.template)");
    allCards.forEach((card) => {
      const title = card.querySelector(".title").textContent;
      const color = card.style.backgroundColor;
      const desc = card.querySelector(".description").textContent;
      const column = card.parentNode.id;

      data[column].push({
        title: title,
        color: color,
        desc: desc,
        index: data[column].length
      });
    });

    localStorage.setItem("data", data);
    
    fetch('/save-cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }

  async loadCards() {
    fetch('/get-cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({user: localStorage["user"]})
    })
      .then((response) => {
        response.json()
          .then((result) => {
            ["todo", "doing", "done"].forEach((column) => {
              result.data[column].forEach((card) => {
                let newCard = this.addCard(column, card.title, card.color);
                newCard.setDescription(card.desc);
              });
            });
          });
      });
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

  addCardAndSave(col, title, color) {
    let card = new Card(title, color);
    let colElem = document.querySelector(`#${col}`);
    card.addToCol(colElem, this.mover);
    saveCards();
    return card;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let cardTitle = document.querySelector("#cardTitle").value;
    let cardColor = document.querySelector("#cardColor").value;
    this.addCardAndSave("todo", cardTitle, cardColor);
    this.form.reset();

    // this.mover.stopMoving();
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

export const saveCards = async () => {
  let data = {
    user: localStorage["user"],
    todo: [],
    doing: [],
    done: []
  };

  const allCards = document.querySelectorAll(".card:not(.template)");
  allCards.forEach((card) => {
    const title = card.querySelector(".title").textContent;
    const color = card.style.backgroundColor;
    const desc = card.querySelector(".description").textContent;
    const column = card.parentNode.id;

    data[column].push({
      title: title,
      color: color,
      desc: desc,
      index: data[column].length
    });
  });

  // localStorage.setItem("data", data);
  // console.log(data);
  
  fetch('/save-cards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}