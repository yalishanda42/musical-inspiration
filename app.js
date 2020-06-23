function onClickTestButton(event) {
    const testAbcString = document.getElementById("testTextarea").value;

    abcjs.renderAbc("sheetmusic", testAbcString, { });
    abcjs.renderMidi(
        "midiplayer",
        testAbcString,
        {
            generateDownload: true,
            inlineControls: {
                loopToggle: true,
                startPlaying: true,
                tempo: true,
            },
        }
    );
    abcjs.midi.startPlaying(document.querySelector(".abcjs-inline-midi"));
    // abcjs.midi.stopPlaying();
    // abcjs.midi.restartPlaying();
    abcjs.midi.setLoop(document.querySelector(".abcjs-inline-midi"), true);
    // abcjs.midi.setRandomProgress(0.33);
    //abcjs.midi.setSoundFont("");
}

(() => {
    const testButton = document.getElementById("testButton");
    testButton.addEventListener("click", onClickTestButton);
})()
