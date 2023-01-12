import {useState, useEffect, useRef} from 'react';
import NoteSequence from './NoteSequence';
import * as Tone from 'tone';

const starterboard = [];

const notes = [
    'A4',
    'A#4',
    'B4',
    'C4',
    'C#4',
    'D4',
    'D#4',
    'E4',
    'F4',
    'F#4',
    'G4',
    'G#4',
    'A5',
]

for (let i = 0; i < 6; i++) {
    starterboard.push(new Array(16).fill(null));
}


const SequenceBoard = () => {
    const [board, setBoard] = useState(starterboard);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [eventID, setEventID] = useState(null);
    const [bpm, setBpm] = useState(120);
    const stepRef = useRef(0);

    const synth = new Tone.PolySynth(Tone.Synth).toDestination();

    const playNotes = (notes, time) => {
        synth.triggerAttackRelease(notes, '8n', time);
    }

    useEffect(() => {
        Tone.Transport.bpm.value = bpm;
    }, [bpm]);

    useEffect(() => {
        let id = null;
        if (isPlaying) {
            Tone.Transport.start();
            id = Tone.Transport.scheduleRepeat(repeat, '8n');
            setEventID(id);
        } else {
            Tone.Transport.stop();
            Tone.Transport.clear(eventID);
            setEventID(null);
        }
    }, [isPlaying]);

    const repeat = (time) => {
        let step = stepRef.current % 16;
        let notearray = [];

        board.forEach((row, rowIndex) => {
            if (row[step]) {
                notearray.push(row[step]);
            }
        });
        playNotes(notearray, time);
        stepRef.current++;
    }

    const setnote = (row, column) => {
        const newboard = [...board];

        newboard[row][column] = newboard[row][column] ? null : notes[row];

        setBoard(newboard);
    }

    return (
        <div className="sequence-board">
            <div className="controls">
                <button onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? 'Stop' : 'Play'}
                </button>
                <input
                    type="range"
                    min="60"
                    max="240"
                    value={bpm}
                    onChange={(e) => setBpm(e.target.value)}
                />
            </div>
            {board.map((notepattern, index) => (
                <NoteSequence
                    key={index}
                    notepattern={notepattern}
                    row={index}
                    setnote={setnote}
                />
            ))}
        </div>
    )
}

export default SequenceBoard;