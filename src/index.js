"use strict";
class Note {
    constructor(id, title, content, requiresConfirmation = false) {
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
    constructor(selectedHtmlElement) {
        this.notes = [];
        this.selectedHtmlElement = selectedHtmlElement || document.body;
        this.nextId = 1;
        this.render();
    }
    render() {
        this.selectedHtmlElement.innerHTML = "";
        this.addPromptFormForAddingNotes();
        this.addSearchInput();
        this.addFilteringAndSortingButtons();
        this.addListWithNotes(this.notes);
        this.showStatistics();
    }
    addPromptFormForAddingNotes() {
        const titleInput = document.createElement("input");
        const contentInput = document.createElement("textarea");
        const button = document.createElement("button");
        titleInput.className = "add-note--title";
        titleInput.placeholder = "Task Title (required)";
        contentInput.className = "add-note--content";
        contentInput.placeholder = "Task Content (required)";
        button.innerText = "Add Task";
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
    addSearchInput() {
        const searchInput = document.createElement("input");
        const searchButton = document.createElement("button");
        searchInput.placeholder = "Search by title or content";
        searchButton.innerText = "Search";
        searchButton.addEventListener("click", () => {
            const searchedText = searchInput.value.toLowerCase();
            const foundNotes = this.notes.filter((note) => note.title.toLowerCase().includes(searchedText) ||
                note.content.toLowerCase().includes(searchedText));
            this.renderFilteredNotes(foundNotes);
        });
        this.selectedHtmlElement.appendChild(searchInput);
        this.selectedHtmlElement.appendChild(searchButton);
    }
    addNoteToList(title, content) {
        if (!title || !content) {
            alert("Both title and content are required!");
            return;
        }
        const newNote = new Note(this.nextId++, title, content);
        this.notes.push(newNote);
        this.render();
    }
    addListWithNotes(chosenNoteArray) {
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
            li.innerText = `${note.title}: ${note.content} (Created: ${note.createdAt.toLocaleString()})`;
            if (note.isCompleted) {
                li.style.textDecoration = "line-through";
                li.style.color = "green";
            }
            removeButton.appendChild(removeIcon);
            editButton.appendChild(editIcon);
            completeButton.appendChild(completeIcon);
            removeButton.addEventListener("click", () => this.removeNoteById(note.id));
            editButton.addEventListener("click", () => this.editNoteById(note.id));
            completeButton.addEventListener("click", () => this.toggleNoteCompletion(note.id));
            li.appendChild(removeButton);
            li.appendChild(editButton);
            li.appendChild(completeButton);
            ul.appendChild(li);
        });
        this.selectedHtmlElement.appendChild(ul);
    }
    removeNoteById(id) {
        this.notes = this.notes.filter((note) => note.id !== id);
        this.render();
    }
    editNoteById(id) {
        const note = this.notes.find((note) => note.id === id);
        if (!note)
            return;
        const title = prompt("Edit title:", note.title);
        const content = prompt("Edit content:", note.content);
        if (title !== null && content !== null) {
            if (note.requiresConfirmation &&
                !confirm("Are you sure you want to edit this note?")) {
                return;
            }
            note.title = title || note.title;
            note.content = content || note.content;
            note.updatedAt = new Date();
            this.render();
        }
    }
    toggleNoteCompletion(id) {
        const note = this.notes.find((note) => note.id === id);
        if (note) {
            note.isCompleted = !note.isCompleted;
            this.render();
        }
    }
    addFilteringAndSortingButtons() {
        const filterButton = document.createElement("button");
        const sortByDateButton = document.createElement("button");
        const sortByStatusButton = document.createElement("button");
        filterButton.innerText = "Show All Notes";
        sortByDateButton.innerText = "Sort Notes by Creation Date";
        sortByStatusButton.innerText = "Sort Notes by Status";
        filterButton.addEventListener("click", () => this.render());
        sortByDateButton.addEventListener("click", () => {
            this.notes.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            this.render();
        });
        sortByStatusButton.addEventListener("click", () => {
            this.notes.sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
            this.render();
        });
        this.selectedHtmlElement.appendChild(filterButton);
        this.selectedHtmlElement.appendChild(sortByDateButton);
        this.selectedHtmlElement.appendChild(sortByStatusButton);
    }
    renderFilteredNotes(foundNotes) {
        this.selectedHtmlElement.innerHTML = "";
        this.addPromptFormForAddingNotes();
        this.addSearchInput();
        this.addFilteringAndSortingButtons();
        this.addListWithNotes(foundNotes);
        this.showStatistics();
    }
    showStatistics() {
        const stats = document.createElement("div");
        const totalNotes = this.notes.length;
        const remainingNotes = this.notes.filter((note) => !note.isCompleted).length;
        stats.innerText = `Total Tasks: ${totalNotes}, In Process: ${remainingNotes}`;
        this.selectedHtmlElement.appendChild(stats);
    }
}
const todo = new ToDoList();
