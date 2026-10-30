const NOTE_LETTERS = ["C", "D", "E", "F", "G", "A", "B"];

const STAFF_CLEFS = {
    treble: {
        label: "Klucz wiolinowy",
        bottomLine: { letter: "E", octave: 4 }
    }
};

const TREBLE_NOTE_RANGE = Array.from({ length: 12 }, (_, index) => {
    const noteIndex = NOTE_LETTERS.indexOf("C") + index;
    const octave = 4 + Math.floor(noteIndex / NOTE_LETTERS.length);

    return {
        letter: NOTE_LETTERS[noteIndex % NOTE_LETTERS.length],
        octave
    };
});

const CHROMATIC_NOTE_NAMES = [
    "C", "C#", "D", "D#", "E", "F",
    "F#", "G", "G#", "A", "A#", "B"
];

const PIANO_NOTE_RANGE = Array.from({ length: 20 }, (_, index) => {
    const noteName = CHROMATIC_NOTE_NAMES[index % CHROMATIC_NOTE_NAMES.length];
    const letter = noteName[0];

    return {
        letter,
        accidental: noteName.length > 1 ? noteName[1] : "",
        octave: 4 + Math.floor(index / CHROMATIC_NOTE_NAMES.length),
        chromaticIndex: index
    };
});

const PIANO_QUIZ_NOTE_RANGE = PIANO_NOTE_RANGE.filter(note => note.octave === 4);

function getNoteName(note) {
    return `${note.letter}${note.accidental || ""}${note.octave}`;
}

function getDiatonicNoteIndex(note) {
    return note.octave * NOTE_LETTERS.length + NOTE_LETTERS.indexOf(note.letter);
}
