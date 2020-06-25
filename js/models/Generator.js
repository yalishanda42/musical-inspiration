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
        const keyHeader = "K:" + Generator.tonicNotation(tonic, scale) + Generator.scaleNotation(scale);
        const tempoHeader = "Q:" + tempoInBpm
        const result = "X:0\n" + timeSigHeader + "\n" + defaultNoteHeader + "\n" + keyHeader + "\n" + tempoHeader + "\n";
        return result;
    }

    static scaleNotation(scaleString) {
        const scaleNotations = {
            "Minor": "minor",
            "Major": "major",
            "Dorian": "dorian",
            "Phrygian": "phrygian",
            "Lydian": "lydian",
            "Mixolydian": "mixolydian",
            "Locrian": "locrian",
            "Harmonic minor": "minor",
            "Melodic minor": "minor",
            "Phrygian Dominant": "minor",
            "Gypsy major": "major",
            "Gypsy minor": "minor",
            "Minor pentatonic": "minor",
            "Major pentatonic": "major",
            "Japanese": "minor",
            "South-East Asian": "minor",
            "Minor blues": "minor",
            "Major blues": "major"
        }
        return scaleNotations[scaleString];
    }

    static tonicNotation(tonic, scale) {
        const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        var note = notes[tonic];
        const scaleNotation = Generator.scaleNotation(scale);
        const sharpScaleIsIncorrect = teoria.note(note).scale(scaleNotation).simple()
            .map(n => n.substring(1))
            .some(a => a === "x" || a === "bb");

        if (sharpScaleIsIncorrect) {
            note = notes[+tonic + 1] + "b"; // assumes note was a sharp
        }

        return note;
    }

    static noteDifferencesToBaseScale(scale) {
        const deltas = {
            "Minor": [0, 0, 0, 0, 0, 0, 0],
            "Major": [0, 0, 0, 0, 0, 0, 0],
            "Dorian": [0, 0, 0, 0, 0, 0, 0],
            "Phrygian": [0, 0, 0, 0, 0, 0, 0],
            "Lydian": [0, 0, 0, 0, 0, 0, 0],
            "Mixolydian": [0, 0, 0, 0, 0, 0, 0],
            "Locrian": [0, 0, 0, 0, 0, 0, 0],
            "Harmonic minor": [0, 0, 0, 0, 0, 0, +1], // to minor
            "Melodic minor": [0, 0, 0, 0, 0, +1, +1], // to minor
            "Phrygian Dominant": [0, -1, +1, 0, 0, 0, 0], // to minor
            "Gypsy major": [0, -1, +1, 0, 0, 0, +1], // to minor
            "Gypsy minor": [0, -1, +1, +1, 0, 0, +1], // to minor
            "Minor pentatonic": [0, 0, 0, 0, 0], // to minor pentatonic
            "Major pentatonic": [0, 0, 0, 0, 0], // to major pentatonic
            "Japanese": [0, -1, 0, 0, 0],  // not used // TODO: refactor
            // "Minor blues": [0, 0, 0, 0, 0, 0],  // to minor blues (6-tonic) // TODO: implement
            // "Major blues": [0, 0, 0, 0, 0, 0] // to major blues (6-tonic) // TODO: implement
        }
        return deltas[scale];
    }

    static accidentalValueToAbcNotation(accidentalInt) {
        switch (accidentalInt) {
            case -2:
                return "__";
            case -1:
                return "_";
            case 0:
                return "=";
            case +1:
                return "^";
            case +2:
                return "^^";
            default:
                return "";
        }
    }

    static noteNotationsForScale(tonic, scale) {
        if (scale === "Japanese") {
            // hakxs
            return Generator.noteNotationsForScale(tonic, "Phrygian Dominant")
            .filter((n, i) => i !== 2 && i !== 6); // remove 3rd and 7th degrees of the mazna scale
        }

        const tonicName = Generator.tonicNotation(tonic, scale);
        const baseScaleName = Generator.scaleNotation(scale);
        const deltas = Generator.noteDifferencesToBaseScale(scale);

        if (deltas.every(n => n === 0)) {
            if (scale === "Minor pentatonic") {
                baseScaleName = "minorpentatonic";
            } else if (scale === "Major pentatonic") {
                baseScaleName = "majorpentatonic";
            }
            return teoria.note(tonicName).scale(baseScaleName).notes().map(n => n.name());
        }

        return teoria.note(tonicName).scale(baseScaleName).notes().map((n, i) => (deltas[i] !== 0) ? Generator.accidentalValueToAbcNotation(n.accidentalValue() + deltas[i]) + n.name() : n.name());
    }

    static generateRandomRhythmWithPauses(beats=4, beatNote=4, bars=2) {
        // TODO
        return "z/2z/2 z/2z/4z/4 z/2z/2 z | z/2z/2 z/2z/4z/4 (3z/z/z/ z"; // TEST
    }

    static generateRandomMelody(rhythmAbcString, tonic, scale) {
        // TODO: improve algorithm, add tones from more octaves
        const notes = Generator.noteNotationsForScale(tonic, scale).concat("z");
        var result = rhythmAbcString.replace(/z/g, (z) => notes[Math.floor(Math.random() * notes.length)])
        return result;
    }
}
