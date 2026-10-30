const fretboardStringOptions = [
    { stringIndex: 5, label: "High E" },
    { stringIndex: 4, label: "B" },
    { stringIndex: 3, label: "G" },
    { stringIndex: 2, label: "D" },
    { stringIndex: 1, label: "A" },
    { stringIndex: 0, label: "Low E" }
];

const fretboardQuizState = {
    settings: null,
    question: null,
    selectedAnswer: null,
    checked: false,
    revealed: false
};

function renderFretboardPage() {

    document.getElementById("module-title").innerText =
        "🎸 Gryf";

    document.getElementById("module-content").innerHTML = `

        <div class="mode-selector">

            <button class="mode-button"
                    onclick="renderFretboardLearning()">
                📚 Nauka
            </button>

            <button class="mode-button"
                    onclick="renderFretboardQuizSetup()">
                🧠 Quiz
            </button>

        </div>

    `;
}

function renderFretboardLearning() {

    document.getElementById("module-content").innerHTML = `

        <div class="fretboard-learning">
            <h2>📚 Nauka gryfu</h2>

            ${renderFretboardBoard({ showNotes: true })}
        </div>
    `;
}

function renderFretboardBoard({ showNotes, highlightedPosition = null }) {

    let html = `
        <div class="fretboard-wrapper">
            <div class="fret-numbers">
                <div class="open-string-header">0</div>
                <div class="nut-header"></div>
    `;

    for (let fret = 1; fret <= 12; fret++) {
        html += `<div class="fret-number">${fret}</div>`;
    }

    html += `
            </div>
            <div class="fretboard">
    `;

    for (let string = 5; string >= 0; string--) {
        html += `<div class="string-row">`;

        const openNote =
            getNoteForPosition(string, 0);

        html += `<div class="open-string-note">`;
        if (showNotes) {
            html += `
                <div class="note-circle" style="background:${NOTE_COLORS[openNote]}">
                    ${openNote}
                </div>
            `;
        } else if (
            highlightedPosition &&
            highlightedPosition.stringIndex === string &&
            highlightedPosition.fret === 0
        ) {
            html += `<div class="quiz-marker" aria-hidden="true"></div>`;
        }
        html += `</div><div class="nut-line"></div>`;

        for (let fret = 1; fret <= 12; fret++) {
            const note =
                getNoteForPosition(string, fret);

            html += `<div class="fret-cell">`;
            if (showNotes) {
                html += `
                    <div class="note-circle" style="background:${NOTE_COLORS[note]}">
                        ${note}
                    </div>
                `;
            } else if (
                highlightedPosition &&
                highlightedPosition.stringIndex === string &&
                highlightedPosition.fret === fret
            ) {
                html += `<div class="quiz-marker" aria-hidden="true"></div>`;
            }
            html += `</div>`;
        }

        html += `</div>`;
    }

    html += `
            </div>
            <div class="fret-markers">
                <div class="open-string-header"></div>
                <div class="nut-header"></div>
    `;

    for (let fret = 1; fret <= 12; fret++) {
        let marker = "";
        if (
            fret === 3 ||
            fret === 5 ||
            fret === 7 ||
            fret === 9
        ) {
            marker = "●";
        }

        if (fret === 12) {
            marker = "●●";
        }

        html += `<div class="marker-cell">${marker}</div>`;
    }

    return `${html}</div></div>`;
}

function renderFretboardQuizSetup() {

    document.getElementById("module-content").innerHTML = `
        <h2>🧠 Quiz gryfu</h2>
        <div class="quiz-settings">
            <h3>Wybierz struny</h3>
            <div class="string-selection">
                ${fretboardStringOptions.map(({ stringIndex, label }) => `
                    <label class="string-option">
                        <input type="checkbox" id="quiz-string-${stringIndex}" checked>
                        <span>${label}</span>
                    </label>
                `).join("")}
            </div>
            <div class="fret-range">
                <label for="quiz-fret-from">Od progu</label>
                <select id="quiz-fret-from">${renderFretOptions(0)}</select>
                <label for="quiz-fret-to">Do progu</label>
                <select id="quiz-fret-to">${renderFretOptions(12)}</select>
            </div>
            <p id="fretboard-quiz-result" role="status"></p>
            <div class="button-row">
                <button type="button" onclick="startFretboardQuiz()">Start quizu</button>
            </div>
        </div>
    `;
}

function renderFretOptions(selectedFret) {
    return Array.from({ length: 13 }, (_, fret) =>
        `<option value="${fret}"${fret === selectedFret ? " selected" : ""}>${fret}</option>`
    ).join("");
}

function startFretboardQuiz() {
    const selectedStrings = fretboardStringOptions
        .filter(({ stringIndex }) =>
            document.getElementById(`quiz-string-${stringIndex}`).checked
        )
        .map(({ stringIndex }) => stringIndex);
    const fretFrom = Number(document.getElementById("quiz-fret-from").value);
    const fretTo = Number(document.getElementById("quiz-fret-to").value);
    const result = document.getElementById("fretboard-quiz-result");

    if (selectedStrings.length === 0) {
        result.textContent = "Wybierz co najmniej jedną strunę.";
        return;
    }

    if (fretFrom > fretTo) {
        result.textContent = "Początkowy próg nie może być większy od końcowego.";
        return;
    }

    fretboardQuizState.settings = { selectedStrings, fretFrom, fretTo };
    nextFretboardQuestion();
}

function nextFretboardQuestion() {
    fretboardQuizState.question =
        generateRandomFretboardQuestion(fretboardQuizState.settings);
    fretboardQuizState.selectedAnswer = null;
    fretboardQuizState.checked = false;
    fretboardQuizState.revealed = false;
    renderFretboardQuiz();
}

function generateRandomFretboardQuestion({ selectedStrings, fretFrom, fretTo }) {
    const stringIndex =
        selectedStrings[Math.floor(Math.random() * selectedStrings.length)];
    const fret =
        fretFrom + Math.floor(Math.random() * (fretTo - fretFrom + 1));

    return { stringIndex, fret };
}

function renderFretboardQuiz() {
    const { question, selectedAnswer, checked, revealed } = fretboardQuizState;
    const correctNote = getNoteForPosition(question.stringIndex, question.fret);
    let result = "";

    if (revealed) {
        result = `Prawidłowa odpowiedź: ${correctNote}`;
    } else if (checked) {
        result = selectedAnswer === correctNote
            ? "Dobrze!"
            : "Niepoprawna odpowiedź. Spróbuj ponownie lub pokaż odpowiedź.";
    }

    document.getElementById("module-content").innerHTML = `
        <h2>🧠 Quiz gryfu</h2>
        ${renderFretboardBoard({ showNotes: false, highlightedPosition: question })}
        <div class="quiz-answer">
            <h3>Jaka to nuta?</h3>
            <div class="note-grid">
                ${NOTES.map(note => `
                    <button
                        type="button"
                        class="note-button${selectedAnswer === note ? " selected" : ""}"
                        aria-pressed="${selectedAnswer === note}"
                        onclick="selectFretboardAnswer('${note}')">
                        ${note}
                    </button>
                `).join("")}
            </div>
            <div class="button-row">
                <button type="button" onclick="checkFretboardAnswer()">Sprawdź</button>
                <button type="button" onclick="revealFretboardAnswer()">Pokaż odpowiedź</button>
                <button type="button" onclick="nextFretboardQuestion()">Następne pytanie</button>
            </div>
            <p id="fretboard-quiz-result" role="status">${result}</p>
        </div>
    `;
}

function selectFretboardAnswer(note) {
    fretboardQuizState.selectedAnswer = note;
    fretboardQuizState.checked = false;
    fretboardQuizState.revealed = false;
    renderFretboardQuiz();
}

function checkFretboardAnswer() {
    if (!fretboardQuizState.selectedAnswer) {
        document.getElementById("fretboard-quiz-result").textContent =
            "Wybierz nutę.";
        return;
    }

    fretboardQuizState.checked = true;
    fretboardQuizState.revealed = false;
    renderFretboardQuiz();
}

function revealFretboardAnswer() {
    fretboardQuizState.revealed = true;
    fretboardQuizState.checked = false;
    renderFretboardQuiz();
}

function getNoteForPosition(stringIndex, fret) {

    const openNote =
        STRING_TUNING[stringIndex];

    const startIndex =
        NOTES.indexOf(openNote);

    const noteIndex =
        (startIndex + fret) % 12;

    return NOTES[noteIndex];
}
