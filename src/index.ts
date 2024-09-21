"use strict";

class Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
  requiresConfirmation: boolean;

  constructor(
    id: number,
    title: string,
    content: string,
    requiresConfirmation: boolean = false
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.isCompleted = false;
    this.requiresConfirmation = requiresConfirmation;
  }
}

class ToDoList {
  notes: Note[];
  selectedHtmlElement: HTMLElement;
  nextId: number;

  constructor(selectedHtmlElement?: HTMLElement) {
    this.notes = [];
    this.selectedHtmlElement = selectedHtmlElement || document.body;
    this.nextId = 1;
    this.render();
  }

  render(): void {
    this.selectedHtmlElement.innerHTML = "";
    this.addPromptFormForAddingNotes();
    this.addSearchNoteButton();
    this.addFilteringAndSortingButtons();
    this.addListWithNotes(this.notes);
    this.showStatistics();
  }

  addPromptFormForAddingNotes(): void {
    const titleInput = document.createElement("input");
    const contentInput = document.createElement("textarea");
    const button = document.createElement("button");

    titleInput.className = "add-note--title";
    titleInput.placeholder = "Note Title (required)";
    contentInput.className = "add-note--content";
    contentInput.placeholder = "Note Content (required)";
    button.innerText = "Add Note";

    button.addEventListener("click", () => {
      const title = titleInput.value;
      const content = contentInput.value;
      this.addNoteToList(title, content);
      titleInput.value = "";
      contentInput.value = "";
    });

    this.selectedHtmlElement.appendChild(titleInput);
    this.selectedHtmlElement.appendChild(contentInput);
    this.selectedHtmlElement.appendChild(button);
  }

  addNoteToList(title: string, content: string): void {
    if (!title || !content) {
      alert("Both title and content are required!");
      return;
    }

    const newNote = new Note(this.nextId++, title, content);
    this.notes.push(newNote);
    this.render();
  }

  addListWithNotes(chosenNoteArray: Note[]): void {
    const ul = document.createElement("ul");
    ul.className = "note-list";
    chosenNoteArray.forEach((note) => {
      const li = document.createElement("li");
      const removeButton = document.createElement("div");
      const editButton = document.createElement("div");
      const completeButton = document.createElement("div");
      const removeIcon = document.createTextNode("\u00D7");
      const editIcon = document.createTextNode("\u270E");
      const completeIcon = document.createTextNode("\u2713");

      li.classList.add("note");
      removeButton.className = "delete-note-button";
      editButton.className = "edit-note-button";
      completeButton.className = "complete-note-button";

      li.innerText = `${note.title}: ${
        note.content
      } (Created: ${note.createdAt.toLocaleString()})`;
      if (note.isCompleted) {
        li.style.textDecoration = "line-through";
        li.style.color = "green";
      }

      removeButton.appendChild(removeIcon);
      editButton.appendChild(editIcon);
      completeButton.appendChild(completeIcon);

      removeButton.addEventListener("click", () =>
        this.removeNoteById(note.id)
      );
      editButton.addEventListener("click", () => this.editNoteById(note.id));
      completeButton.addEventListener("click", () =>
        this.toggleNoteCompletion(note.id)
      );

      li.appendChild(removeButton);
      li.appendChild(editButton);
      li.appendChild(completeButton);
      ul.appendChild(li);
    });
    this.selectedHtmlElement.appendChild(ul);
  }

  removeNoteById(id: number): void {
    this.notes = this.notes.filter((note) => note.id !== id);
    this.render();
  }

  editNoteById(id: number): void {
    const note = this.notes.find((note) => note.id === id);
    if (!note) return;

    const title = prompt("Edit title:", note.title);
    const content = prompt("Edit content:", note.content);

    if (title !== null && content !== null) {
      if (
        note.requiresConfirmation &&
        !confirm("Are you sure you want to edit this note?")
      ) {
        return;
      }
      note.title = title || note.title;
      note.content = content || note.content;
      note.updatedAt = new Date();
      this.render();
    }
  }

  toggleNoteCompletion(id: number): void {
    const note = this.notes.find((note) => note.id === id);
    if (note) {
      note.isCompleted = !note.isCompleted;
      this.render();
    }
  }

  addSearchNoteButton(): void {
    const searchButton = document.createElement("button");
    searchButton.innerText = "Search Note";

    searchButton.addEventListener("click", () => {
      const input =
        document.querySelector<HTMLInputElement>(".add-note--title");
      if (input) {
        const searchedText = input.value.toLowerCase();
        const foundNotes = this.notes.filter(
          (note) =>
            note.title.toLowerCase().includes(searchedText) ||
            note.content.toLowerCase().includes(searchedText)
        );
        this.renderFilteredNotes(foundNotes);
      }
    });
    this.selectedHtmlElement.appendChild(searchButton);
  }

  renderFilteredNotes(foundNotes: Note[]): void {
    this.selectedHtmlElement.innerHTML = "";
    this.addPromptFormForAddingNotes();
    this.addSearchNoteButton();
    this.addListWithNotes(foundNotes);
    this.showStatistics();
  }

  addFilteringAndSortingButtons(): void {
    const filterButton = document.createElement("button");
    const sortButton = document.createElement("button");

    filterButton.innerText = "Show All Notes";
    sortButton.innerText = "Sort Notes by Creation Date";

    filterButton.addEventListener("click", () => this.render());
    sortButton.addEventListener("click", () => {
      this.notes.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      this.render();
    });

    this.selectedHtmlElement.appendChild(filterButton);
    this.selectedHtmlElement.appendChild(sortButton);
  }

  showStatistics(): void {
    const stats = document.createElement("div");
    const totalNotes = this.notes.length;
    const remainingNotes = this.notes.filter(
      (note) => !note.isCompleted
    ).length;

    stats.innerText = `Total Tasks: ${totalNotes}, In Process: ${remainingNotes}`;
    this.selectedHtmlElement.appendChild(stats);
  }
}

const todo = new ToDoList();
