"use client";

import React, { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./fretboard.css";

const allNotes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

const defaultTuning = ["E", "A", "D", "G", "B", "E"];
const totalFrets = 12;

const chordVoicingMap = {
  "C Major": "Open",
  "D Major": "Open",
  "E Major": "Open",
  "F Major": "Barre",
  "G Major": "Open",
  "A Major": "Barre",
  "B Minor": "Barre",
  "A Minor": "Open",
  "E Minor": "Open",
  G7: "Open",
  A7: "Open",
  E7: "Open",
  Am7: "Open",
  Em7: "Open",
  Gm7: "Barre",
};

const progressionFormulas = [
  { label: "Folk: I – V – vi – IV", pattern: [0, 7, 9, 5] }, // C G Am F
  { label: "Pop: vi – IV – I – V", pattern: [9, 5, 0, 7] }, // Am F C G
  { label: "Sad Pop: I – vi – iii – IV", pattern: [0, 9, 4, 5] }, // C Am Em F
  { label: "Indie: I – iii – vi – V", pattern: [0, 4, 9, 7] }, // C Em Am G
  { label: "Cinematic: i – VI – III – VII", pattern: [0, -3, -8, -1] }, // Am F C G (minor root)
  { label: "Classic Rock: I – IV – V – IV", pattern: [0, 5, 7, 5] }, // C F G F
  { label: "Melancholy Minor: i – VII – VI – iv", pattern: [0, -1, -2, -5] },
  { label: "Dramatic Minor: i – v – VI – III", pattern: [0, -2, -4, -7] },
];

const generateChordsAndScales = () => {
  const chords = {},
    scales = {};
  allNotes.forEach((root, i) => {
    chords[`${root} Major`] = [root, allNotes[(i + 4) % 12], allNotes[(i + 7) % 12]];
    chords[`${root} Minor`] = [root, allNotes[(i + 3) % 12], allNotes[(i + 7) % 12]];
    chords[`${root} Maj7`] = [root, allNotes[(i + 4) % 12], allNotes[(i + 7) % 12], allNotes[(i + 11) % 12]];
    chords[`${root} 7`] = [root, allNotes[(i + 4) % 12], allNotes[(i + 7) % 12], allNotes[(i + 10) % 12]];
    chords[`${root} m7`] = [root, allNotes[(i + 3) % 12], allNotes[(i + 7) % 12], allNotes[(i + 10) % 12]];
    chords[`${root} Sus4`] = [root, allNotes[(i + 5) % 12], allNotes[(i + 7) % 12]];
    chords[`${root} Add9`] = [root, allNotes[(i + 4) % 12], allNotes[(i + 7) % 12], allNotes[(i + 2) % 12]];
    scales[`${root} Major`] = [0, 2, 4, 5, 7, 9, 11].map((x) => allNotes[(i + x) % 12]);
    scales[`${root} Minor`] = [0, 2, 3, 5, 7, 8, 10].map((x) => allNotes[(i + x) % 12]);
    scales[`${root} Pentatonic Major`] = [0, 2, 4, 7, 9].map((x) => allNotes[(i + x) % 12]);
    scales[`${root} Pentatonic Minor`] = [0, 3, 5, 7, 10].map((x) => allNotes[(i + x) % 12]);
    scales[`${root} Phrygian`] = [0, 1, 3, 5, 7, 8, 10].map((x) => allNotes[(i + x) % 12]);
  });
  return { chords, scales };
};

const getNoteAt = (base, fret) => {
  const i = allNotes.indexOf(base);
  return allNotes[(i + fret) % 12];
};

const GuitarFretboard = () => {
  const { chords, scales } = useMemo(() => generateChordsAndScales(), []);
  const [progressionKey, setProgressionKey] = useState("C");
  const [tuning, setTuning] = useState([...defaultTuning]);
  const [chord, setChord] = useState("");
  const [scale, setScale] = useState("");
  const [voicingType, setVoicingType] = useState("");
  const [formulaIndex, setFormulaIndex] = useState(0);
  const [chordProgression, setChordProgression] = useState([
    { name: "", fret: 0 },
    { name: "", fret: 0 },
    { name: "", fret: 0 },
    { name: "", fret: 0 },
  ]);

  const updateTuning = (index, value) => {
    const newTuning = [...tuning];
    newTuning[index] = value;
    setTuning(newTuning);
  };

  const updateChordInProgression = (index, field, value) => {
    const updated = [...chordProgression];
    updated[index] = { ...updated[index], [field]: field === "fret" ? parseInt(value) : value };
    setChordProgression(updated);
  };

  const resetTuning = () => {
    setTuning([...defaultTuning]);
  };

  const generateProgression = () => {
    const formula = progressionFormulas[formulaIndex].pattern;
    const rootIndex = allNotes.indexOf(progressionKey);
    const baseFret = Math.floor(Math.random() * (totalFrets - 4)) + 4;
    const progression = formula.map((offset, i) => {
      const noteIndex = (rootIndex + offset + 12) % 12;
      const isMinor = /i/.test(progressionFormulas[formulaIndex].label.split(":")[1]?.split("–")[i]?.trim());
      const chordName = `${allNotes[noteIndex]} ${isMinor ? "Minor" : "Major"}`;
      const fret = Math.max(baseFret - i * 2, 0);
      return { name: chordName, fret };
    });
    setChordProgression(progression);
  };

  const chordNotes = chord ? chords[chord] : [];
  const scaleNotes = scale ? scales[scale] : [];
  const normalizedChordNotes = chordNotes.map((n) => n.toUpperCase());
  const normalizedScaleNotes = scaleNotes.map((n) => n.toUpperCase());

  return (
    <div className='container-fluid p-4'>
      <h1 className='mb-4'>Guitar Fretboard</h1>
      <div className='controls row mb-3'>
        <div className='col'>
          <div className='d-flex flex-column gap-1 mb-2'>
            {tuning.map((note, i) => (
              <select
                key={i}
                className='form-select form-select-sm'
                value={note}
                onChange={(e) => updateTuning(i, e.target.value)}
              >
                {allNotes.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            ))}
          </div>
          <button className='btn btn-outline-dark' onClick={resetTuning}>
            Reset Tuning
          </button>
        </div>
        <div className='col'>
          <select className='form-select mb-3' value={chord} onChange={(e) => setChord(e.target.value)}>
            <option value=''>-- Select Chord --</option>
            {Object.entries(chords).map(([name, notes]) => (
              <option key={name} value={name}>{`${name} [${notes.join(", ")}]`}</option>
            ))}
          </select>
          <select className='form-select mb-3' value={scale} onChange={(e) => setScale(e.target.value)}>
            <option value=''>-- Select Scale --</option>
            {Object.entries(scales).map(([name, notes]) => (
              <option key={name} value={name}>{`${name} [${notes.join(", ")}]`}</option>
            ))}
          </select>
        </div>
        <div className='col'>
          <h5>Chord Progression</h5>
          <select
            className='form-select mb-3'
            value={progressionKey}
            onChange={(e) => setProgressionKey(e.target.value)}
          >
            {allNotes.map((note) => (
              <option key={note} value={note}>{`Key of ${note}`}</option>
            ))}
          </select>
          <select className='form-select mb-3' value={voicingType} onChange={(e) => setVoicingType(e.target.value)}>
            <option value=''>-- All Voicings --</option>
            <option value='Open'>Open</option>
            <option value='Barre'>Barre</option>
            <option value='Partial'>Partial</option>
            <option value='Inversion'>Inversion</option>
          </select>
          <select
            className='form-select mb-3'
            value={formulaIndex}
            onChange={(e) => setFormulaIndex(parseInt(e.target.value))}
          >
            {progressionFormulas.map((formula, idx) => (
              <option key={idx} value={idx}>
                {formula.label}
              </option>
            ))}
          </select>
          {chordProgression.map((entry, index) => (
            <div key={index} className='d-flex align-items-center mb-2 gap-2'>
              <select
                className='form-select form-select-sm'
                value={entry.name}
                onChange={(e) => updateChordInProgression(index, "name", e.target.value)}
              >
                <option value=''>{`-- Select Chord ${index + 1} --`}</option>
                {Object.entries(chords).map(([chordName, chordNotes]) => (
                  <option key={chordName} value={chordName}>{`${chordName} [${chordNotes.join(", ")}]`}</option>
                ))}
              </select>
              <input
                type='number'
                className='form-control form-control-sm'
                style={{ width: "80px" }}
                value={entry.fret}
                onChange={(e) => updateChordInProgression(index, "fret", e.target.value)}
              />
            </div>
          ))}
          <button className='btn btn-secondary btn-sm mt-2' onClick={generateProgression}>
            Generate Random Progression
          </button>
        </div>
      </div>
      <div className='fretboard-wrapper overflow-auto'>
        <div className='d-flex mb-1'>
          {[...Array(totalFrets + 1).keys()].map((fret) => (
            <div key={fret} className='fret-number text-center flex-fill' style={{ fontSize: 12, color: "#333" }}>
              {fret}
            </div>
          ))}
        </div>
        <div className='fretboard d-flex' style={{ minWidth: 800 }}>
          {[...Array(totalFrets + 1).keys()].map((fret) => (
            <div key={fret} className='fret d-flex flex-column flex-fill gap-1'>
              {tuning
                .slice()
                .reverse()
                .map((baseNote, string) => {
                  const note = getNoteAt(baseNote, fret).toUpperCase();
                  const isScaleNote = normalizedScaleNotes.includes(note);
                  const isChordNote = normalizedChordNotes.includes(note);

                  const progressionClass = chordProgression
                    .map(({ name, fret: rootFret }, index) => {
                      const notes = chords[name]?.map((n) => n.toUpperCase()) || [];
                      return Math.abs(fret - rootFret) <= 1 && notes.includes(note) ? `highlight-p${index}` : null;
                    })
                    .filter(Boolean);

                  const classList = [
                    "note",
                    fret === 0 && "open",
                    isScaleNote && "scale",
                    isChordNote && "highlight",
                    ...progressionClass,
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <div key={string} className={classList}>
                      {note}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuitarFretboard;
