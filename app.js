var hasRhythm = false;
var hasMelody = false;
var rhythmString = null;

function onClickRhythmButton(event) {
    const tonic = document.getElementById("tonic").value;
    const scale = document.getElementById("scale").value;

    const headers = Generator.generateAbcHeaders(tonic, scale, 120);
    const rhythmPauses = Generator.generateRandomRhythmWithPauses();

    const rhythmTonic = rhythmPauses.replace(/z/g, Generator.tonicNotation(tonic, scale));

    loadNewABC(headers + rhythmTonic);

    hasRhythm = true;
    hasMelody = false;
    rhythmString = rhythmPauses;
}

function onClickMelodyButton(event) {
    const tonic = document.getElementById("tonic").value;
    const scale = document.getElementById("scale").value;

    if (hasRhythm === false) {
        rhythmString = Generator.generateRandomRhythmWithPauses();
        hasRhythm = true;
    }

    melodyString = Generator.generateRandomMelody(rhythmString, tonic, scale);
    headers = Generator.generateAbcHeaders(tonic, scale, 120);

    loadNewABC(headers + melodyString);

    hasMelody = true;
}

function loadNewABC(abcString) {
    const cursorControl = { /* nani? */ };
    const abcOptions = { add_classes: true };
    const audioParams = { chordsOff: true };

    const visualObj = ABCJS.renderAbc("sheetmusic", abcString, abcOptions);

    if (!ABCJS.synth.supportsAudio()) {
        document.querySelector("#midiplayer").innerHTML = "Audio is not supported in this browser.";
        return;
    }

    const synthController = new ABCJS.synth.SynthController();
    synthController.load("#midiplayer",
        cursorControl,
        {
            displayLoop: true,
            displayRestart: true,
            displayPlay: true,
            displayProgress: true,
            displayWarp: true
        }
    );

    const createSynth = new ABCJS.synth.CreateSynth();
    createSynth.init({ visualObj: visualObj[0] })
        .then(() => {
            synthController.setTune(visualObj[0], false, audioParams)
                .then(() => {
                    console.log("Audio successfully loaded.")
                }).catch((error) => {
                    console.warn("Audio problem:", error);
                });
        }).catch((error) => {
            console.warn("Audio problem:", error);
        });
}

(() => {
    const rhythmButton = document.getElementById("rhythmButton");
    rhythmButton.addEventListener("click", onClickRhythmButton);
    const melodyButton = document.getElementById("melodyButton");
    melodyButton.addEventListener("click", onClickMelodyButton);
})()
