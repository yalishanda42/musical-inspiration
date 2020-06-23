function generateAbcString() {
    // TODO: implement algorithm
    return `X:0
M:3/4
L:1/8
Q:1/4=120
R:Klezmer
K:Dm
Ade|:"Dm"(f2d)e gf|"A7"e2^c4|"Gm"B>>^c BA BG|"A"A3Ade|"Dm"(f2d)e gf|"A7"e2^c4|
"Gm"A>>B "A7"AG FE|1"Dm"D3Ade:|2"Dm"D3DEF||:"Gm"(G2D)E FG|"Dm"A2F4|"Gm"B>>c "A7"BA BG|
"Dm"A3 DEF|"Gm"(G2D)EFG|"Dm"A2F4|"E°"E>>Fy "(A7)"ED^C2|1"Dm"D3DEF:|2"Dm"D6||`;
}

function onClickTestButton(event) {
    var abcString = generateAbcString();

    var cursorControl = { /* nani? */ };
    var abcOptions = { add_classes: true };
    var audioParams = { chordsOff: true };

    var visualObj = ABCJS.renderAbc("sheetmusic", abcString, abcOptions);

    if (!ABCJS.synth.supportsAudio()) {
        document.querySelector("#midiplayer").innerHTML = "Audio is not supported in this browser.";
        return;
    }

    var synthController = new ABCJS.synth.SynthController();
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

    var createSynth = new ABCJS.synth.CreateSynth();
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
    const testButton = document.getElementById("testButton");
    testButton.addEventListener("click", onClickTestButton);
})()
