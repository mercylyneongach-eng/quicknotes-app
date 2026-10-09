// Select HTML elements
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

// Load saved notes from localStorage
function loadNotes() {
    try {
        const savedNotes = localStorage.getItem("quicknotes");

        if (savedNotes) {
            const parsedNotes = JSON.parse(savedNotes);

            if (Array.isArray(parsedNotes)) {
                return parsedNotes.filter(function (note) {
                    return (
                        note &&
                        typeof note.id === "string" &&
                        typeof note.text === "string" &&
                        typeof note.category === "string" &&
                        ["personal", "work", "study"].includes(note.category) &&
                        typeof note.createdAt === "string"
                    );
                });
            }
        }
    } catch (error) {
        console.error("Could not load saved notes:", error);
    }

    return [];
}

// Store notes in an array
let notes = loadNotes();

// Save notes to localStorage
function saveNotes() {
    try {
        localStorage.setItem("quicknotes", JSON.stringify(notes));
    } catch (error) {
        console.error("Could not save notes:", error);
        errorMessage.textContent =
            "Your notes could not be saved in this browser.";
    }
}

// Display the correct note count
function updateNoteCount() {
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}

// Display notes on the page
function render() {
    notesList.replaceChildren();

    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredNotes = notes.filter(function (note) {
        return note.text.toLowerCase().includes(searchTerm);
    });

    if (filteredNotes.length === 0 && searchTerm !== "") {
        const message = document.createElement("li");
        message.textContent = "No notes match your search.";
        notesList.appendChild(message);
    }

    filteredNotes.forEach(function (note) {
        const listItem = document.createElement("li");
        listItem.classList.add(
            "note-card",
            `category-${note.category}`
        );

        const text = document.createElement("p");
        text.classList.add("note-text");
        text.textContent = note.text;

        const category = document.createElement("span");
        category.classList.add("note-category");
        category.textContent =
            note.category.charAt(0).toUpperCase() +
            note.category.slice(1);

        const date = document.createElement("small");
        date.classList.add("note-date");
        date.textContent = note.createdAt;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList.add("delete-button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            notes = notes.filter(function (item) {
                return item.id !== note.id;
            });

            saveNotes();
            render();
        });

        listItem.appendChild(text);
        listItem.appendChild(category);
        listItem.appendChild(date);
        listItem.appendChild(deleteButton);

        notesList.appendChild(listItem);
    });

    updateNoteCount();
}

// Add a new note
noteForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = noteInput.value.trim();

    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    if (text.length > 200) {
        errorMessage.textContent =
            "Notes must be 200 characters or fewer.";
        return;
    }

    const newNote = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        text: text,
        category: noteCategory.value,
        createdAt: new Date().toLocaleString()
    };

    notes.push(newNote);

    saveNotes();

    noteInput.value = "";
    errorMessage.textContent = "";

    render();
});

// Search notes as the user types
searchInput.addEventListener("input", function () {
    render();
});

// Display saved notes when the page opens
render();
