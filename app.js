function onClickTestButton(event) {
    // const testAbcString = document.getElementById("abcTextArea").value;

    // abcjs.renderAbc("sheetmusic", testAbcString, { });
    // abcjs.renderMidi(
    //     "midiplayer",
    //     testAbcString,
    //     {
    //         generateDownload: true,
    //         inlineControls: {
    //             loopToggle: true,
    //             startPlaying: true,
    //             tempo: true,
    //         },
    //     }
    // );
    // abcjs.midi.startPlaying(document.querySelector(".abcjs-inline-midi"));
    // abcjs.midi.stopPlaying();
    // abcjs.midi.restartPlaying();
    // abcjs.midi.setLoop(document.querySelector(".abcjs-inline-midi"), true);
    // abcjs.midi.setRandomProgress(0.33);
    //abcjs.midi.setSoundFont("");

    new ABCJS.Editor("absTextArea", { paper_id: "sheetmusic",
        synth: {
            el: "#midiplayer",
            options: {
                displayLoop: true,
                 displayRestart: true,
                 displayPlay: true,
                 displayProgress: true,
                 displayWarp: true
             }
        },
        generate_warnings: false,
        // warnings_id:"warnings",
        abcjsParams: {
            generateDownload: true,
            clickListener: null
        }
    });
}

(() => {
    const testButton = document.getElementById("testButton");
    testButton.addEventListener("click", onClickTestButton);
})()
