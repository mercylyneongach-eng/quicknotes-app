// Select HTML elements
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

// Store notes in an array
let notes = [];

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
        // Create the note card
        const listItem = document.createElement("li");
        listItem.classList.add(
            "note-card",
            `category-${note.category}`
        );

        // Create note text
        const text = document.createElement("p");
        text.classList.add("note-text");
        text.textContent = note.text;

        // Create category label
        const category = document.createElement("span");
        category.classList.add("note-category");
        category.textContent =
            note.category.charAt(0).toUpperCase() +
            note.category.slice(1);

        // Create date and time
        const date = document.createElement("small");
        date.classList.add("note-date");
        date.textContent = note.createdAt;

        // Create Delete button
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList.add("delete-button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            notes = notes.filter(function (item) {
                return item.id !== note.id;
            });

            render();
        });

        // Add elements to the note card
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

    // Validate empty notes
    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    // Validate note length
    if (text.length > 200) {
        errorMessage.textContent =
            "Notes must be 200 characters or fewer.";
        return;
    }

    // Create the note object
    const newNote = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        text: text,
        category: noteCategory.value,
        createdAt: new Date().toLocaleString()
    };

    // Add note to the array
    notes.push(newNote);

    // Clear the input and error message
    noteInput.value = "";
    errorMessage.textContent = "";

    // Refresh the displayed notes
    render();
});

// Search notes as the user types
searchInput.addEventListener("input", function () {
    render();
});

// Display the initial page
render();

