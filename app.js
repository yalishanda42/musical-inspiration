function onClickTestButton(event) {
    console.log("Test: " + ABCJS.signature);
}

(() => {
    const testButton = document.getElementById("testButton");
    testButton.addEventListener("click", onClickTestButton);
})()
