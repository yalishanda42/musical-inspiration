function onClickRhythmButton(event) {
    const tonic = document.getElementById("tonic").value;
    const scale = document.getElementById("scale").value;

    // TEST
    const headers = Generator.generateAbcHeaders(tonic, scale, 120);
    var rhythmPauses = Generator.generateRandomRhythmWithPauses();

    rhythmPauses = rhythmPauses.replace(/z/g, Generator.tonicNotation(tonic, scale));
    // ====

    abcString = headers + rhythmPauses;

    console.log('rhythmPauses', rhythmPauses);

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
    const testButton = document.getElementById("rhythmButton");
    testButton.addEventListener("click", onClickRhythmButton);
})()
