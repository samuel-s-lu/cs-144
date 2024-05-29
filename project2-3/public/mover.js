/* Text to add to the move here button */
const MOVE_HERE_TEXT = "— Move here —";

export default class Mover {
  constructor() {
    this.moveHereButton = document.createElement("button");
    this.moveHereButton.textContent = MOVE_HERE_TEXT;

    // event listeners for columns to handle card drops
    this.columns = document.querySelectorAll(".column")
    this.columns.forEach((column) => {
      column.addEventListener("drop", this.handleCardDrop);
      column.addEventListener("dragover", this.handleDragOver);
    });
  }

  fileDragEnter(card) {
    if (!this.draggingCard) {
      card.classList.add("fileHover");
    }
  }

  handleCardDrop = () => {
    if (this.draggedCard) {
      this.draggedCard.classList.remove("dragging");
      this.draggedCard.classList.add("dropped");
      this.draggedCard = null;
      this.draggingCard = false;
    }
  }

  handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (this.draggingCard && event.target.classList.contains("column")) {
      let column = event.target;
      let cards = column.querySelectorAll(".card:not(.template, .dragging)");
      let minDist = Infinity
      let closestCard = null;
      cards.forEach((card) => {
        card.midline = card.offsetTop + card.offsetHeight / 2;
        if (Math.abs(event.clientY - card.midline) < minDist) {
          closestCard = card;
          minDist = Math.abs(event.clientY - card.midline);
        }
      });

      if (closestCard === null) {
        column.appendChild(this.draggedCard);
      }
      else if (event.clientY < closestCard.midline) {
        column.insertBefore(this.draggedCard, closestCard);
      }
      else {
        column.insertBefore(this.draggedCard, closestCard.nextSibling);
      }
    }
  }

  startDragging(card) {
    this.draggedCard = card;
    this.draggingCard = true;
    this.draggedCard.classList.add("dragging");
  }

  startMoving(card) {
    this.card = card;
    this.card.moving = true;
    this.card.classList.add("moving");
    let columnTitles = document.querySelectorAll(".columnTitle");
    let cards = document.querySelectorAll(".card:not(.template)");
    
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
      this.card.classList.remove("moving");
      this.card.moving = false;
    }
  }

  handleMoveHere = (event) => {
    event.currentTarget.replaceWith(this.card);
    this.stopMoving();
  }
}
