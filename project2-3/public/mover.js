/* Text to add to the move here button */
const MOVE_HERE_TEXT = "— Move here —";

export default class Mover {
  constructor() {
    this.moveHereButton = document.createElement("button");
    this.moveHereButton.textContent = MOVE_HERE_TEXT;
  }

  startMoving(card) {
    this.card = card;
    this.card.className = "card moving";
    let columnTitles = document.querySelectorAll(".columnTitle");
    let cards = document.querySelectorAll("[class='card'], [class='card moving']");
    
    columnTitles.forEach((ele) => {
      let newButton = this.moveHereButton.cloneNode(true);
      newButton.addEventListener("click", this.handleMoveHere);
      newButton.className = "moveHere";
      ele.after(newButton);
    });

    cards.forEach((ele) => {
      let newButton = this.moveHereButton.cloneNode(true);
      newButton.addEventListener("click", this.handleMoveHere);
      newButton.className = "moveHere";
      ele.after(newButton);
    });
  }

  stopMoving() {
    let moveHereButtons = document.querySelectorAll(".moveHere");
    moveHereButtons.forEach((ele) => {
      ele.remove();
    });

    if (this.card !== undefined) {
      this.card.className = "card";
    }
  }
  

  handleMoveHere = (event) => {
    event.currentTarget.replaceWith(this.card);
    this.stopMoving();
  }
}
