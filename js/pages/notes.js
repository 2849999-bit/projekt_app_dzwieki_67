const notesQuizState = {
    currentNote: null,
    selectedNote: null,
    checked: false,
    revealed: false,
    showPianoKeyNames: false,
    lowestNote: "C4",
    highestNote: "G5"
};

function renderNotesPage() {

    document.getElementById("module-title").innerText =
        "🎹 Czytanie nut";

    document.getElementById("module-content").innerHTML = `
        <div class="mode-selector">
            <button class="mode-button" onclick="renderNotesLearning()">
                📚 Nauka
            </button>
            <button class="mode-button" onclick="renderNotesQuiz()">
                🧠 Quiz
            </button>
        </div>
    `;
}

function renderNotesLearning() {
    document.getElementById("module-content").innerHTML = `
        <div class="notes-container">
            <h2>📚 Nauka nut</h2>
            <div class="shared-staff-wrapper">
                ${renderStaffWithNotes({
                    notes: TREBLE_NOTE_RANGE,
                    clef: "treble"
                })}
            </div>
        </div>
    `;
}

function renderStaff({ note, clef }) {
    const staffClef = STAFF_CLEFS[clef];
    const noteY = getStaffNoteY(note, staffClef);
    const ledgerLine = note.letter === "C" && note.octave === 4
        ? `<line class="staff-ledger-line" x1="106" y1="${noteY}" x2="134" y2="${noteY}" />`
        : "";
    const accidental = note.accidental
        ? `<text class="staff-accidental" x="98" y="${noteY + 6}">${note.accidental}</text>`
        : "";

    return `
        <svg class="staff-svg" viewBox="0 0 200 140" role="img"
             aria-label="${staffClef.label}, nuta ${getNoteName(note)}">
            <g class="staff-lines">
                <line x1="14" y1="25" x2="186" y2="25" />
                <line x1="14" y1="45" x2="186" y2="45" />
                <line x1="14" y1="65" x2="186" y2="65" />
                <line x1="14" y1="85" x2="186" y2="85" />
                <line x1="14" y1="105" x2="186" y2="105" />
            </g>
            <text class="staff-clef" x="20" y="98">𝄞</text>
            ${ledgerLine}
            ${accidental}
            <ellipse class="staff-note-head" cx="120" cy="${noteY}"
                     rx="9" ry="6" transform="rotate(-20 120 ${noteY})" />
        </svg>
    `;
}

function renderStaffWithNotes({ notes, clef }) {
    const staffClef = STAFF_CLEFS[clef];
    const noteStartX = 128;
    const noteSpacing = 70;
    const staffWidth = noteStartX + notes.length * noteSpacing;
    const staffLines = [25, 45, 65, 85, 105]
        .map(y => `<line x1="14" y1="${y}" x2="${staffWidth}" y2="${y}" />`)
        .join("");
    const noteElements = notes.map((note, index) => {
        const x = noteStartX + index * noteSpacing;
        const y = getStaffNoteY(note, staffClef);
        const ledgerLine = note.letter === "C" && note.octave === 4
            ? `<line class="staff-ledger-line" x1="${x - 14}" y1="${y}" x2="${x + 14}" y2="${y}" />`
            : "";

        return `
            ${ledgerLine}
            <ellipse class="staff-note-head" cx="${x}" cy="${y}"
                     rx="9" ry="6" transform="rotate(-20 ${x} ${y})" />
            <text class="shared-staff-note-label" x="${x}" y="168">
                ${getNoteName(note)}
            </text>
        `;
    }).join("");

    return `
        <svg class="staff-svg shared-staff-svg"
             viewBox="0 0 ${staffWidth + 14} 184"
             style="width:${staffWidth + 14}px"
             role="img"
             aria-label="${staffClef.label}, nuty ${notes.map(getNoteName).join(", ")}">
            <g class="staff-lines">${staffLines}</g>
            <text class="staff-clef" x="20" y="98">𝄞</text>
            ${noteElements}
        </svg>
    `;
}

function getStaffNoteY(note, staffClef) {
    const bottomLineIndex = getDiatonicNoteIndex(staffClef.bottomLine);
    const noteStep = getDiatonicNoteIndex(note) - bottomLineIndex;
    return 105 - noteStep * 10;
}

function renderNotesQuiz() {
    const availableNotes = getNotesQuizRange();
    const currentNoteIsInRange = notesQuizState.currentNote &&
        availableNotes.some(
            note => getNoteName(note) === getNoteName(notesQuizState.currentNote)
        );

    if (availableNotes.length > 0 &&
        (!notesQuizState.currentNote || !currentNoteIsInRange)) {
        nextNotesQuizQuestion();
        return;
    }

    const result = availableNotes.length === 0
        ? "Najniższa nuta musi być niższa lub równa najwyższej."
        : notesQuizState.revealed
            ? `Odpowiedź: ${notesQuizState.currentNote.letter}`
            : notesQuizState.checked
                ? getPianoQuizAnswer(notesQuizState.selectedNote) === notesQuizState.currentNote.letter
                    ? "Poprawnie!"
                    : "Niepoprawna odpowiedź. Spróbuj ponownie."
                : "";

    document.getElementById("module-content").innerHTML = `
        <div class="notes-container">
            <div class="notes-quiz">
               
                <div class="notes-quiz-range">
                    <label>
                        Najniższa nuta
                        <select onchange="updateNotesQuizRange('lowestNote', this.value)">
                            ${renderNoteOptions(notesQuizState.lowestNote)}
                        </select>
                    </label>
                    <label>
                        Najwyższa nuta
                        <select onchange="updateNotesQuizRange('highestNote', this.value)">
                            ${renderNoteOptions(notesQuizState.highestNote)}
                        </select>
                    </label>
                </div>
                ${availableNotes.length > 0
                    ? renderStaff({ note: notesQuizState.currentNote, clef: "treble" })
                    : ""}
                <label class="piano-label-toggle">
                    <input
                        type="checkbox"
                        ${notesQuizState.showPianoKeyNames ? "checked" : ""}
                        onchange="togglePianoKeyNames(this.checked)">
                    <span class="piano-label-switch" aria-hidden="true"></span>
                    <span>Pokaż nazwy klawiszy</span>
                </label>
                <div class="piano-keyboard" role="group" aria-label="Klawiatura piano">
                    ${renderPianoKeyboard()}
                </div>
                ${availableNotes.length > 0 ? `
                    <div class="button-row">
                        <button type="button" onclick="checkNotesQuizAnswer()">Sprawdź</button>
                        <button type="button" onclick="showNotesQuizAnswer()">Pokaż odpowiedź</button>
                        <button type="button" onclick="nextNotesQuizQuestion()">Następna nuta</button>
                    </div>
                ` : ""}
                <p class="notes-quiz-result" role="status">${result}</p>
            </div>
        </div>
    `;
}

function renderPianoKeyboard() {
    const whiteNotes = PIANO_QUIZ_NOTE_RANGE.filter(note => !note.accidental);

    return whiteNotes.map(note => {
        const blackNote = PIANO_QUIZ_NOTE_RANGE.find(candidate =>
            candidate.accidental &&
            candidate.chromaticIndex === note.chromaticIndex + 1
        );
        const noteName = getNoteName(note);
        const selected = notesQuizState.selectedNote === noteName;
        const blackKey = blackNote
            ? `
                <button
                    type="button"
                    class="piano-key piano-key-black${notesQuizState.selectedNote === getNoteName(blackNote) ? " selected" : ""}"
                    aria-label="${getNoteName(blackNote)}"
                    aria-pressed="${notesQuizState.selectedNote === getNoteName(blackNote)}"
                    onclick="selectNotesQuizAnswer('${getNoteName(blackNote)}')">
                    ${notesQuizState.showPianoKeyNames
                        ? `<span class="piano-key-label">${getNoteName(blackNote)}</span>`
                        : ""}
                </button>
            `
            : "";

        return `
            <div class="piano-key-slot">
                <button
                    type="button"
                    class="piano-key piano-key-white${selected ? " selected" : ""}"
                    aria-label="${noteName}"
                    aria-pressed="${selected}"
                    onclick="selectNotesQuizAnswer('${noteName}')">
                    ${notesQuizState.showPianoKeyNames
                        ? `<span class="piano-key-label">${noteName}</span>`
                        : ""}
                </button>
                ${blackKey}
            </div>
        `;
    }).join("");
}

function togglePianoKeyNames(showNames) {
    notesQuizState.showPianoKeyNames = showNames;
    renderNotesQuiz();
}

function renderNoteOptions(selectedNote) {
    return TREBLE_NOTE_RANGE.map(note => {
        const name = getNoteName(note);
        return `<option value="${name}"${name === selectedNote ? " selected" : ""}>${name}</option>`;
    }).join("");
}

function updateNotesQuizRange(setting, value) {
    notesQuizState[setting] = value;
    notesQuizState.currentNote = null;
    notesQuizState.selectedNote = null;
    notesQuizState.checked = false;
    notesQuizState.revealed = false;
    renderNotesQuiz();
}

function getNotesQuizRange() {
    const lowestIndex = TREBLE_NOTE_RANGE.findIndex(
        note => getNoteName(note) === notesQuizState.lowestNote
    );
    const highestIndex = TREBLE_NOTE_RANGE.findIndex(
        note => getNoteName(note) === notesQuizState.highestNote
    );

    if (lowestIndex < 0 || highestIndex < lowestIndex) {
        return [];
    }

    return TREBLE_NOTE_RANGE.slice(lowestIndex, highestIndex + 1);
}

function getPianoQuizAnswer(noteName) {
    if (!noteName || noteName.includes("#")) {
        return null;
    }

    return noteName[0];
}

function nextNotesQuizQuestion() {
    const availableNotes = getNotesQuizRange();
    if (availableNotes.length === 0) {
        renderNotesQuiz();
        return;
    }

    let nextNote = availableNotes[
        Math.floor(Math.random() * availableNotes.length)
    ];

    if (
        availableNotes.length > 1 &&
        notesQuizState.currentNote &&
        getNoteName(nextNote) === getNoteName(notesQuizState.currentNote)
    ) {
        const currentIndex = availableNotes.indexOf(nextNote);
        nextNote = availableNotes[(currentIndex + 1) % availableNotes.length];
    }

    notesQuizState.currentNote = nextNote;
    notesQuizState.selectedNote = null;
    notesQuizState.checked = false;
    notesQuizState.revealed = false;
    renderNotesQuiz();
}

function selectNotesQuizAnswer(noteName) {
    notesQuizState.selectedNote = noteName;
    notesQuizState.checked = false;
    notesQuizState.revealed = false;
    renderNotesQuiz();
}

function checkNotesQuizAnswer() {
    if (!notesQuizState.selectedNote) {
        document.querySelector(".notes-quiz-result").textContent =
            "Wybierz klawisz.";
        return;
    }

    notesQuizState.checked = true;
    notesQuizState.revealed = false;
    renderNotesQuiz();
}

function showNotesQuizAnswer() {
    notesQuizState.revealed = true;
    notesQuizState.checked = false;
    const matchingKey = PIANO_QUIZ_NOTE_RANGE.find(note =>
        !note.accidental && note.letter === notesQuizState.currentNote.letter
    );
    notesQuizState.selectedNote = getNoteName(matchingKey);
    renderNotesQuiz();
}
