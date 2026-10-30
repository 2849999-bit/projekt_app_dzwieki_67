let currentChord;
let selectedNotes = [];

const AVAILABLE_NOTES = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B"
];

function renderChordsPage() {

    document.getElementById("module-title").innerText =
        "🎵 Akordy";

    document.getElementById("module-content").innerHTML = `

        <div class="mode-selector">

            <button class="mode-button"
                    onclick="renderChordLearning()">
                📚 Nauka
            </button>

            <button class="mode-button"
                    onclick="renderChordQuiz()">
                🧠 Quiz
            </button>

        </div>

    `;
}

function getRandomChord() {

    const index =
        Math.floor(Math.random() * CHORDS.length);

    return CHORDS[index];
}

/* ========================================= */
/*                 NAUKA                     */
/* ========================================= */

function renderChordLearning() {

    let html = `

        <div class="learning-container">

            <h2>📚 Nauka akordów</h2>

            <div class="learning-type">

                <label>Typ akordów:</label>

                <select>
                    <option>Durowe</option>
                </select>

            </div>

            <div class="learning-list">
    
    `;

    CHORDS.forEach(chord => {

        html += `
        
            <div class="learning-card">

                <h3>${chord.name} dur</h3>

                <p>
                    <strong>Pryma:</strong> ${chord.root}
                </p>

                <p>
                    <strong>Tercja:</strong> ${chord.third}
                </p>

                <p>
                    <strong>Kwinta:</strong> ${chord.fifth}
                </p>

            </div>
        
        `;
    });

    html += `
            </div>
        </div>
    `;

    document.getElementById("module-content").innerHTML = html;
}

/* ========================================= */
/*                  QUIZ                     */
/* ========================================= */

function renderChordQuiz() {

    document.getElementById("module-content").innerHTML = `
    
        <div class="chord-container">

            <h2 id="chord-name"></h2>

            <div class="answer-boxes">

                <div class="answer-box">
                    <strong>Pryma</strong>
                    <div id="root-display">?</div>
                </div>

                <div class="answer-box">
                    <strong>Tercja</strong>
                    <div id="third-display">?</div>
                </div>

                <div class="answer-box">
                    <strong>Kwinta</strong>
                    <div id="fifth-display">?</div>
                </div>

            </div>

            <div id="note-grid"
                 class="note-grid">
            </div>

            <div class="button-row">

                <button onclick="checkChord()">
                    ✅ Sprawdź
                </button>

                <button onclick="showChordAnswer()">
                    💡 Nie wiem
                </button>

                <button onclick="clearSelection()">
                    🗑 Wyczyść
                </button>

                <button onclick="generateChord()">
                    🎲 Następny akord
                </button>

            </div>

            <p id="result"></p>

        </div>

    `;

    generateChord();
    renderNoteButtons();
}

function generateChord() {

    currentChord = getRandomChord();

    document.getElementById("chord-name").innerText =
        currentChord.name + " dur";

    clearSelection(false);

    document.getElementById("result").innerText = "";
}

function renderNoteButtons() {

    const grid = document.getElementById("note-grid");

    if (!grid) return;

    grid.innerHTML = "";

    AVAILABLE_NOTES.forEach(note => {

        grid.innerHTML += `
            <button
                class="note-button"
                onclick="selectNote('${note}')">
                ${note}
            </button>
        `;
    });
}

function selectNote(note) {

    if(selectedNotes.length >= 3) {
        return;
    }

    selectedNotes.push(note);

    updateDisplays();
}

function updateDisplays() {

    document.getElementById("root-display").innerText =
        selectedNotes[0] || "?";

    document.getElementById("third-display").innerText =
        selectedNotes[1] || "?";

    document.getElementById("fifth-display").innerText =
        selectedNotes[2] || "?";
}

function clearSelection(clearResult = true) {

    selectedNotes = [];

    updateDisplays();

    if(clearResult) {
        document.getElementById("result").innerText = "";
    }
}

function checkChord() {

    if(selectedNotes.length !== 3) {

        document.getElementById("result").innerText =
            "⚠ Wybierz 3 dźwięki";

        return;
    }

    const correct =
        selectedNotes[0] === currentChord.root &&
        selectedNotes[1] === currentChord.third &&
        selectedNotes[2] === currentChord.fifth;

    if(correct) {

        document.getElementById("result").innerText =
            "✅ Poprawnie!";

    } else {

        document.getElementById("result").innerText =
            "❌ Spróbuj jeszcze raz";
    }
}

function showChordAnswer() {

    selectedNotes = [
        currentChord.root,
        currentChord.third,
        currentChord.fifth
    ];

    updateDisplays();

    document.getElementById("result").innerText =
        "💡 Poprawna odpowiedź";
}