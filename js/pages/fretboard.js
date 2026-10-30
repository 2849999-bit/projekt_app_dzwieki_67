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

    let html = `

        <h2>📚 Nauka gryfu</h2>

        <div class="fretboard-wrapper">

            <div class="fret-numbers">

                <div class="open-string-header">
                    0
                </div>

                <div class="nut-header"></div>
    `;

    for (let fret = 1; fret <= 12; fret++) {

        html += `
            <div class="fret-number">
                ${fret}
            </div>
        `;
    }

    html += `
            </div>

            <div class="fretboard">
    `;

    for (let string = 5; string >= 0; string--) {

        html += `
            <div class="string-row">
        `;

        const openNote =
            getNoteForPosition(string, 0);

        html += `
            <div class="open-string-note">

                <div
                    class="note-circle"
                    style="background:${NOTE_COLORS[openNote]}">

                    ${openNote}

                </div>

            </div>

            <div class="nut-line"></div>
        `;

        for (let fret = 1; fret <= 12; fret++) {

            const note =
                getNoteForPosition(string, fret);

            html += `
                <div class="fret-cell">

                    <div
                        class="note-circle"
                        style="background:${NOTE_COLORS[note]}">

                        ${note}

                    </div>

                </div>
            `;
        }

        html += `
            </div>
        `;
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

        html += `
            <div class="marker-cell">
                ${marker}
            </div>
        `;
    }

    html += `

            </div>

        </div>
    `;

    document.getElementById(
        "module-content"
    ).innerHTML = html;
}

function renderFretboardQuizSetup() {

    document.getElementById("module-content").innerHTML = `

        <h2>🧠 Quiz gryfu</h2>

        <p>
            Konfiguracja quizu będzie dodana w kolejnym kroku.
        </p>

    `;
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
