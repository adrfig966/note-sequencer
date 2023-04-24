import { useState, useEffect, useRef } from "react";
import NoteSequence from "./NoteSequence";
import Knob from "./Knob";
import * as Tone from "tone";

const starterboard = [];

const notes = [
  "A4",
  "A#4",
  "B4",
  "C4",
  "C#4",
  "D4",
  "D#4",
  "E4",
  "F4",
  "F#4",
  "G4",
  "G#4",
  "A5",
];

for (let i = 0; i < 6; i++) {
  starterboard.push(new Array(16).fill(null));
}

const SequenceBoard = () => {
  const [board, setBoard] = useState(starterboard);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [eventID, setEventID] = useState(null);
  const [bpm, setBpm] = useState(120);
  const [reverb, setReverb] = useState(0.5);
  const stepRef = useRef(0);
  const synthRef = useRef(null);
  const reverbRef = useRef(null);

  if (!synthRef.current) {
    synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
    reverbRef.current = new Tone.Reverb().toDestination();
    reverbRef.current.generate(); // generate an impulse response
    reverbRef.current.wet.value = 0.5; // set the wet/dry mix
    reverbRef.current.decay = 3; // set the decay time

    synthRef.current.connect(reverbRef.current);
    console.log("synth created");
  }

  const playNotes = (notes, time) => {
    if (synthRef.current) {
      synthRef.current.triggerAttackRelease(notes, "8n", time);
    }
  };

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  useEffect(() => {
    reverbRef.current.wet.value = reverb;
  }, [reverb]);

  useEffect(() => {
    let id = null;
    if (isPlaying) {
      Tone.start();
      Tone.Transport.start();
      id = Tone.Transport.scheduleRepeat(repeat, "8n");
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
  };

  const setnote = (row, column) => {
    const newboard = [...board];

    newboard[row][column] = newboard[row][column] ? null : notes[row];

    setBoard(newboard);
  };

  return (
    <div className="sequence-board">
      <div className="controls">
        <button className="button" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? "Stop" : "Play"}
        </button>
        <div className="knob-board">
          <Knob
            value={bpm}
            label="BPM"
            minValue={60}
            maxValue={240}
            onChange={(value) => setBpm(value)}
          />
          <Knob
            value={reverb}
            label="Reverb"
            minValue={0}
            maxValue={1}
            onChange={(value) => setReverb(value)}
          />
        </div>
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
  );
};

export default SequenceBoard;
