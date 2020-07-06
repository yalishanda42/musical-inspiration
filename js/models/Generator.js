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
            .map(n => n.substring(1)) // cut first symbol
            .some(a => a === "x" || a === "bb"); // true if scale has double sharps or double flats

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
        var baseScaleName = Generator.scaleNotation(scale);
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

    static generateRandomRhythmWithTonic(tonic, scale, beats=4, beatNote=4, bars=2) {
        var pulseLengths = Array(beats).fill(1);

        if (beatNote == 8 || beatNote == 16 || beatNote == 32) {
            if (beats == 1) {
                // shouldn't really happen but whatever
                pulseLengths = [1];
            } else if (beats % 3 === 0) {
                pulseLengths = Array(beats / 3).fill(3);
            } else {
                // TODO: create a more advanced algorithm
                pulseLengths = [];
                var beatsCovered = 0;
                while (beatsCovered < beats) {
                    if (beatsCovered + 3 == beats) {
                        // only last partition is long that way
                        beatsCovered += 3;
                    } else {
                        beatsCovered += 2;
                    }
                }
            }
        }

        const tonicNote = Generator.tonicNotation(tonic, scale);
        const durationChoices = ["", "/2", "/4", "(3"];
        var result = "";
        var previousWasPause = false;

        for (let i = 0; i < bars; i++) {
            for (let j = 0; j < pulseLengths.length; j++) {

                // TODO: support ligatures, more tuplets, notes with longer and shorter duration

                var lengthCovered = 0;

                while (lengthCovered < pulseLengths[j]) {
                    var choices = durationChoices
                    if (lengthCovered !== 0) {
                        choices = choices.filter(x => x !== "(3");
                    }

                    var duration = choices[Math.floor(Math.random() * choices.length)];
                    var value = tonicNote;

                    if (!previousWasPause) {
                        // TODO: improve
                        var possible = [tonicNote, "z"];
                        var value = possible[Math.floor(Math.random() * possible.length)];
                    }

                    var lengthAddition = 1;

                    if (duration === "/2") {
                        lengthAddition = 1/2;
                    } else if (duration === "/4") {
                        lengthAddition = 1/4;
                    } else if (duration === "(3") {
                        // TODO: improve
                        lengthAddition = 1;
                        if (value === "z") {
                            duration = "z";
                        } else {
                            duration = "(3" + value + "/" + value + "/" + value + "/";
                        }
                        value = "";
                    }

                    if (lengthAddition + lengthCovered > pulseLengths[j]) {
                        continue; // oof
                    }

                    lengthCovered += lengthAddition;
                    result += value + duration;
                    previousWasPause = value === "z";
                }

                result += " "; // pulse separator
            }

            result += "|"; // bar separator
        }


        return result; // TEST
    }

    static generateRandomMelody(rhythmAbcString, tonic, scale) {
        // TODO: improve algorithm, add tones from more octaves
        const notes = Generator.noteNotationsForScale(tonic, scale);
        const tonicNotation = Generator.tonicNotation(tonic, scale);
        var result = rhythmAbcString.replace(new RegExp(tonicNotation, "g"), (z) => notes[Math.floor(Math.random() * notes.length)])
        return result;
    }
}
