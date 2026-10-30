function openPage(page) {

    document.getElementById("home-screen").style.display = "none";
    document.getElementById("module-screen").style.display = "block";

    switch(page) {

        case "chords":
            renderChordsPage();
            break;

        case "fretboard":
            renderFretboardPage();
            break;

        case "notes":
            renderNotesPage();
            break;

        case "scales":
            renderScalesPage();
            break;

        case "metronome":
            renderMetronomePage();
            break;

        case "circle":
            renderCirclePage();
            break;
    }
}

function goHome() {
    document.getElementById("home-screen").style.display = "block";
    document.getElementById("module-screen").style.display = "none";
}