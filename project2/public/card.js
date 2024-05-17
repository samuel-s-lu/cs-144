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
    this.deleteButton = this.node.querySelector(".delete");
    this.deleteButton.addEventListener("click", this.handleDelete);

    this.editButton = this.node.querySelector(".edit");
    this.editButton.addEventListener("click", this.handleEdit);

    this.moveButton = this.node.querySelector(".startMove");
    this.moveButton.addEventListener("click", this.handleStartMove);

    this.textAreaNode = this.node.querySelector(".editDescription");
    this.textAreaNode.addEventListener("blur", this.handleTextAreaBlur);

    this.node.addEventListener("dragenter", this.handleDragEnter);
    this.node.addEventListener("dragover", this.handleDragOver);
    this.node.addEventListener("dragleave", this.handleDragLeave);
    this.node.addEventListener("drop", this.handleDrop);

    // make card visible with correct color
    this.node.style.backgroundColor = color;
    this.node.className = "card";
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
  handleDelete = (event) => {
    this.node.remove();
    this.mover.stopMoving();
  }

  handleEdit = (event) => {
    this.textAreaNode.textContent = this.descriptionNode.textContent;
    this.descriptionNode.className = "description hidden";
    this.textAreaNode.className = "editDescription";
    this.textAreaNode.focus();
    this.textAreaNode.select();
  }

  handleTextAreaBlur = (event) => {
    this.setDescription(this.textAreaNode.value || NO_DESCRIPTION_TEXT);
    this.textAreaNode.className = "editDescription hidden";
    this.descriptionNode.className = "description";
  }

  handleStartMove = (event) => {
    this.mover.stopMoving();
    this.mover.startMoving(this.node);
  }

  handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  handleDragEnter = (event) => {
    this.node.classList.add("fileHover");
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
