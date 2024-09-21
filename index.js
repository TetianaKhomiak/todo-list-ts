"use strict";
// Тип для статусу нотатки
var NoteStatus;
(function (NoteStatus) {
    NoteStatus["Active"] = "Active";
    NoteStatus["Completed"] = "Completed";
})(NoteStatus || (NoteStatus = {}));
// Абстрактний клас для нотатки
class Note {
    constructor(id, title, content, status = NoteStatus.Active) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.status = status;
    }
    // Метод для отримання повної інформації про нотатку
    getFullInfo() {
        return `ID: ${this.id}\nTitle: ${this.title}\nContent: ${this.content}\nCreated At: ${this.createdAt}\nUpdated At: ${this.updatedAt}\nStatus: ${this.status}`;
    }
    // Метод для зміни статусу
    toggleStatus() {
        this.status =
            this.status === NoteStatus.Active
                ? NoteStatus.Completed
                : NoteStatus.Active;
        this.updatedAt = new Date();
    }
}
// Клас дефолтної нотатки
class DefaultNote extends Note {
    edit(content) {
        this.content = content;
        this.updatedAt = new Date();
    }
}
// Клас нотатки з підтвердженням редагування
class ConfirmableNote extends Note {
    edit(content) {
        if (confirm("Ви впевнені, що хочете відредагувати цю нотатку?")) {
            this.content = content;
            this.updatedAt = new Date();
        }
    }
}
// Клас для керування списком нотаток
class NoteList {
    constructor() {
        this.notes = [];
        this.nextId = 1;
    }
    // Метод для додавання нотатки
    addNote(title, content, type) {
        let note;
        if (type === "default") {
            note = new DefaultNote(this.nextId, title, content);
        }
        else {
            note = new ConfirmableNote(this.nextId, title, content);
        }
        this.notes.push(note);
        this.nextId++;
    }
    // Метод для видалення нотатки
    deleteNote(id) {
        this.notes = this.notes.filter((note) => note.id !== id);
    }
    // Метод для редагування нотатки
    editNote(id, content) {
        const note = this.notes.find((note) => note.id === id);
        if (note) {
            note.edit(content);
        }
    }
    // Метод для отримання повної інформації про нотатку за ідентифікатором
    getNoteById(id) {
        const note = this.notes.find((note) => note.id === id);
        return note ? note.getFullInfo() : null;
    }
    // Метод для отримання списку всіх нотаток
    getAllNotes() {
        return this.notes;
    }
}
