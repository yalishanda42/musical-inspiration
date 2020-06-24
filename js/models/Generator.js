class Generator {
    constructor() {}

    static generateAbcHeaders(tonic, scale, tempoInBpm, timeSignatureUpper=4, timeSignatureLower=4) {
        var timeSigHeader = "M:" + timeSignatureUpper + "/" + timeSignatureLower;
        if (timeSigHeader === "M:4/4") {
            timeSigHeader = "M:C"; // common time
        } else if (timeSigHeader === "M:2/2") {
            timeSigHeader = "M:C|" // cut common time
        }

        const defaultNoteHeader = "L:1/"+ timeSignatureLower;
        const keyHeader = "K:" + Generator.keyNotation(tonic, scale);
        const tempoHeader = "Q:" + tempoInBpm
        return "X:0\n" + timeSigHeader + "\n" + defaultNoteHeader + "\n" + keyHeader + "\n" + tempoHeader + "\n";
    }

    static keyNotation(tonic, scale) {
        // TODO
        return "Dm"
    }

    static noteAccidentalsInKey(tonic, scale) {
        // TODO
        return ["", "_", "^", "", "", "", ""];
    }

    static intervalTypesInKey(scale) {
        // TODO
        return [2, 2, 2, 2, 2, 2, 2];
    }

    static generateRandomRhythmWithPauses(beats=4, beatNote=4, bars=2) {
        // TODO
        return "z/2z/2 z/2z/4z/4 z/2z/2 z | z/2z/2 z/2z/4z/4 (3z/z/z/ z";
    }

    static generateRandomMelody(rhythmAbcString, tonic, scale) {
        // TODO
    }
}
