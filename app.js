function onClickTestButton(event) {
    const testAbcString = document.getElementById("testTextarea").value;
    ABCJS.renderAbc("sheetmusic", testAbcString, { });
}

(() => {
    const testButton = document.getElementById("testButton");
    testButton.addEventListener("click", onClickTestButton);
})()
