import { saveCards } from "./app.js";

/* The text to use when description is empty */
const NO_DESCRIPTION_TEXT = "(No description)";

export default class Card {
  constructor(title, color) {
    // clone template card
    this.node = document.querySelector(".template").cloneNode(true);

    // set basic attributes
    this.titleNode = this.node.querySelector(".title");
    this.titleNode.textContent = title;
    this.descriptionNode = this.node.querySelector(".description");
    this.setDescription(NO_DESCRIPTION_TEXT);

    // setup event listeners
    // card buttons
    this.deleteButton = this.node.querySelector(".delete");
    this.deleteButton.addEventListener("click", this.handleDelete);

    this.editButton = this.node.querySelector(".edit");
    this.editButton.addEventListener("click", this.handleEdit);

    this.moveButton = this.node.querySelector(".startMove");
    this.moveButton.addEventListener("click", this.handleStartMove);

    this.textAreaNode = this.node.querySelector(".editDescription");
    this.textAreaNode.addEventListener("blur", this.handleTextAreaBlur);

    // drag and drop txt files
    this.node.addEventListener("dragenter", this.handleDragEnter);
    this.node.addEventListener("dragover", this.handleDragOver);
    this.node.addEventListener("dragleave", this.handleDragLeave);
    this.node.addEventListener("drop", this.handleDrop);

    // make cards themselves draggable
    this.node.setAttribute("draggable", true);
    this.node.addEventListener("dragstart", this.handleDragStart);
    this.node.addEventListener("dragend", this.handleDragEnd);


    // make card visible with correct background color and text color
    this.node.style.backgroundColor = color;

    const avgRGB = this.getAvgRGB(color);
    if (avgRGB < 128) {
      this.node.classList.add("whiteText");
    }
    else {
      this.node.classList.add("blackText");
    }

    this.node.classList.remove("template");
    this.node.classList.add("card");
  }

  handleDragEnd = () => {
    this.mover.handleCardDrop();
  }

  handleDragStart = () => {
    this.mover.startDragging(this.node);
  }

  getAvgRGB(color) {
    if (color[0] === "#") { // hex format
      const hex = color.slice(1);

      let rgb = parseInt(hex, 16);
      const r = (rgb >> 16) & 255;
      const g = (rgb >> 8) & 255;
      const b = rgb & 255;
      return (r+g+b)/3
    }
    else { // rgb format
      let rgb = color.match(/\d+/g);
      const r = parseInt(rgb[0]);
      const g = parseInt(rgb[1]);
      const b = parseInt(rgb[2]);
      return (r+g+b)/3
    }
  }

  addToCol(colElem, mover) {
    // add to specified column and save mover for later
    colElem.append(this.node);
    this.mover = mover;
  }

  setDescription(text) {
    this.descriptionNode.textContent = text;
  }

  // event handler functions
  handleDelete = () => {
    this.node.remove();
    // this.mover.stopMoving();

    saveCards();
  }

  handleEdit = () => {
    this.textAreaNode.textContent = this.descriptionNode.textContent;
    this.descriptionNode.className = "description hidden";
    this.textAreaNode.className = "editDescription";
    this.textAreaNode.focus();
    this.textAreaNode.select();
  }

  handleTextAreaBlur = () => {
    this.setDescription(this.textAreaNode.value || NO_DESCRIPTION_TEXT);
    this.textAreaNode.className = "editDescription hidden";
    this.descriptionNode.className = "description";

    saveCards();
  }

  handleStartMove = () => {
    // if card is already selected to move, just cancel move
    if (this.node.moving == true) {
      this.mover.stopMoving();
      return;
    }
    this.mover.stopMoving();
    this.mover.startMoving(this.node);
  }

  handleDragEnter = () => {
    this.mover.fileDragEnter(this.node);
  }

  handleDragLeave = (event) => {
    event.preventDefault();
    if (event.relatedTarget === null || (!this.node.contains(event.relatedTarget))) {
      this.node.classList.remove("fileHover");
    }
  }

  handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file !== undefined && file.type === "text/plain") {
      const reader = new FileReader();
      
      reader.onload = () => {
        this.setDescription(reader.result);
      };

      reader.readAsText(file);
    }
    this.node.classList.remove("fileHover");
  }
}
