interface INote {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
}

interface IToDoList {
  addNoteToList(title: string, content: string): void;
  removeNoteById(id: number): void;
  editNoteById(id: number): void;
  toggleNoteCompletion(id: number): void;
  render(): void;
}

class Note implements INote {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;

  constructor(id: number, title: string, content: string) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.isCompleted = false;
  }
}

class ToDoListRenderer {
  selectedHtmlElement: HTMLElement;

  constructor(selectedHtmlElement: HTMLElement) {
    this.selectedHtmlElement = selectedHtmlElement || document.body;
  }

  clear(): void {
    this.selectedHtmlElement.innerHTML = "";
  }

  addFormForAddingNotes(
    addNoteCallback: (title: string, content: string) => void
  ): void {
    const titleInput = document.createElement("input");
    const contentInput = document.createElement("textarea");
    const button = document.createElement("button");

    titleInput.placeholder = "Note Title (required)";
    contentInput.placeholder = "Note Content (required)";
    button.innerText = "Add Note";

    button.addEventListener("click", () => {
      const title = titleInput.value;
      const content = contentInput.value;
      if (title && content) {
        addNoteCallback(title, content);
        titleInput.value = "";
        contentInput.value = "";
      } else {
        alert("Both title and content are required!");
      }
    });

    this.selectedHtmlElement.appendChild(titleInput);
    this.selectedHtmlElement.appendChild(contentInput);
    this.selectedHtmlElement.appendChild(button);
  }

  addSearchInput(searchCallback: (searchText: string) => void): void {
    const searchInput = document.createElement("input");
    const searchButton = document.createElement("button");

    searchInput.placeholder = "Search by title or content";
    searchButton.innerText = "Search";

    searchButton.addEventListener("click", () => {
      const searchedText = searchInput.value;
      searchCallback(searchedText);
    });

    this.selectedHtmlElement.appendChild(searchInput);
    this.selectedHtmlElement.appendChild(searchButton);
  }

  addFilteringAndSortingButtons(
    renderCallback: () => void,
    sortByDateCallback: () => void,
    sortByStatusCallback: () => void
  ): void {
    const filterButton = document.createElement("button");
    const sortByDateButton = document.createElement("button");
    const sortByStatusButton = document.createElement("button");

    filterButton.innerText = "Show All Notes";
    sortByDateButton.innerText = "Sort Notes by Creation Date";
    sortByStatusButton.innerText = "Sort Notes by Status";

    filterButton.addEventListener("click", () => renderCallback());
    sortByDateButton.addEventListener("click", () => sortByDateCallback());
    sortByStatusButton.addEventListener("click", () => sortByStatusCallback());

    this.selectedHtmlElement.appendChild(filterButton);
    this.selectedHtmlElement.appendChild(sortByDateButton);
    this.selectedHtmlElement.appendChild(sortByStatusButton);
  }

  addListWithNotes(
    notes: INote[],
    removeNoteCallback: (id: number) => void,
    editNoteCallback: (id: number) => void,
    toggleNoteCompletionCallback: (id: number) => void
  ): void {
    const ul = document.createElement("ul");
    ul.className = "note-list";

    notes.forEach((note) => {
      const li = document.createElement("li");
      const removeButton = document.createElement("div");
      const editButton = document.createElement("div");
      const completeButton = document.createElement("div");

      li.classList.add("note");
      removeButton.className = "delete-note-button";
      editButton.className = "edit-note-button";
      completeButton.className = "complete-note-button";

      const status = note.isCompleted ? "Completed" : "In Process";
      let noteText = `${note.title}: ${
        note.content
      } (Created: ${note.createdAt.toLocaleString()}) ${status}`;
      if (note.updatedAt.getTime() !== note.createdAt.getTime()) {
        noteText = `${note.title}: ${
          note.content
        } (Created: ${note.createdAt.toLocaleString()}) Updated: ${note.updatedAt.toLocaleString()} ${status}`;
      }
      li.innerText = noteText;

      if (note.isCompleted) {
        li.style.textDecoration = "line-through";
        li.style.color = "green";
      }

      const removeIcon = document.createTextNode("\u00D7");
      const editIcon = document.createTextNode("\u270E");
      const completeIcon = document.createTextNode("\u2713");

      removeButton.appendChild(removeIcon);
      editButton.appendChild(editIcon);
      completeButton.appendChild(completeIcon);

      removeButton.addEventListener("click", () => removeNoteCallback(note.id));
      editButton.addEventListener("click", () => editNoteCallback(note.id));
      completeButton.addEventListener("click", () =>
        toggleNoteCompletionCallback(note.id)
      );

      li.appendChild(removeButton);
      li.appendChild(editButton);
      li.appendChild(completeButton);
      ul.appendChild(li);
    });

    this.selectedHtmlElement.appendChild(ul);
  }

  showStatistics(totalNotes: number, remainingNotes: number): void {
    const stats = document.createElement("div");
    stats.innerText = `Total Notes: ${totalNotes}, In Process: ${remainingNotes}`;
    this.selectedHtmlElement.appendChild(stats);
  }
}

class NoteFilterAndSorter {
  static filterNotes(notes: INote[], searchText: string): INote[] {
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchText.toLowerCase()) ||
        note.content.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  static sortByDate(notes: INote[]): INote[] {
    return notes.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  static sortByStatus(notes: INote[]): INote[] {
    return notes.sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
  }
}

class ToDoList implements IToDoList {
  notes: Note[];
  nextId: number;
  renderer: ToDoListRenderer;

  constructor(renderer: ToDoListRenderer) {
    this.notes = [];
    this.nextId = 1;
    this.renderer = renderer;
    this.render();
  }

  render(): void {
    this.renderer.clear();
    this.renderer.addFormForAddingNotes(this.addNoteToList.bind(this));
    this.renderer.addSearchInput(this.searchNotes.bind(this));
    this.renderer.addFilteringAndSortingButtons(
      this.render.bind(this),
      this.sortByDate.bind(this),
      this.sortByStatus.bind(this)
    );
    this.renderer.addListWithNotes(
      this.notes,
      this.removeNoteById.bind(this),
      this.editNoteById.bind(this),
      this.toggleNoteCompletion.bind(this)
    );
    this.showStatistics();
  }

  addNoteToList(title: string, content: string): void {
    const newNote = new Note(this.nextId++, title, content);
    this.notes.push(newNote);
    this.render();
  }

  removeNoteById(id: number): void {
    this.notes = this.notes.filter((note) => note.id !== id);
    this.render();
  }

  editNoteById(id: number): void {
    const note = this.notes.find((note) => note.id === id);
    if (!note) return;

    const confirmEditInitiation = confirm(
      "Are you sure you want to edit this note?"
    );
    if (!confirmEditInitiation) return;

    const newTitle = prompt("Edit title:", note.title);
    const newContent = prompt("Edit content:", note.content);

    if (newTitle !== null && newContent !== null) {
      const confirmChanges = confirm(
        `Are you sure you want to save the changes?\nTitle: ${newTitle}\nContent: ${newContent}`
      );

      if (confirmChanges) {
        note.title = newTitle;
        note.content = newContent;
        note.updatedAt = new Date();
        this.render();
      }
    }
  }

  toggleNoteCompletion(id: number): void {
    const note = this.notes.find((note) => note.id === id);
    if (note) {
      note.isCompleted = !note.isCompleted;
      this.render();
    }
  }

  searchNotes(searchText: string): void {
    const filteredNotes = NoteFilterAndSorter.filterNotes(
      this.notes,
      searchText
    );
    this.renderer.clear();
    this.renderer.addFormForAddingNotes(this.addNoteToList.bind(this));
    this.renderer.addSearchInput(this.searchNotes.bind(this));
    this.renderer.addFilteringAndSortingButtons(
      this.render.bind(this),
      this.sortByDate.bind(this),
      this.sortByStatus.bind(this)
    );
    this.renderer.addListWithNotes(
      filteredNotes,
      this.removeNoteById.bind(this),
      this.editNoteById.bind(this),
      this.toggleNoteCompletion.bind(this)
    );
    this.showStatistics();
  }

  sortByDate(): void {
    NoteFilterAndSorter.sortByDate(this.notes);
    this.render();
  }

  sortByStatus(): void {
    NoteFilterAndSorter.sortByStatus(this.notes);
    this.render();
  }

  showStatistics(): void {
    const totalNotes = this.notes.length;
    const remainingNotes = this.notes.filter(
      (note) => !note.isCompleted
    ).length;
    this.renderer.showStatistics(totalNotes, remainingNotes);
  }
}

const renderer = new ToDoListRenderer(document.getElementById("app")!);
const toDoList = new ToDoList(renderer);
