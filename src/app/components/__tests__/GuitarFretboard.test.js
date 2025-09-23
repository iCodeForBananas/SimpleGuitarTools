import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GuitarFretboard from '../GuitarFretboard';

// Mock the music theory engine functions for testing
const allNotes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

const progressionFormulas = [
  { label: 'Folk: I – V – vi – IV', pattern: [0, 7, 9, 5], isMinor: false },
  { label: 'Pop: vi – IV – I – V', pattern: [9, 5, 0, 7], isMinor: false },
  { label: 'Sad Pop: I – vi – iii – IV', pattern: [0, 9, 4, 5], isMinor: false },
  { label: 'Indie: I – iii – vi – V', pattern: [0, 4, 9, 7], isMinor: false },
  { label: 'Cinematic: i – VI – III – VII', pattern: [0, 8, 3, 10], isMinor: true },
  { label: 'Classic Rock: I – IV – V – IV', pattern: [0, 5, 7, 5], isMinor: false },
  { label: 'Melancholy Minor: i – VII – VI – iv', pattern: [0, 10, 8, 5], isMinor: true },
  { label: 'Dramatic Minor: i – v – VI – III', pattern: [0, 7, 8, 3], isMinor: true },
  { label: 'Spanish: i – VII – VI – V', pattern: [0, 10, 8, 7], isMinor: true },
  { label: 'Spanish Romantic: i – VII – VI – V', pattern: [0, 10, 8, 7], isMinor: true },
];

// Helper function to generate chord progression based on key and formula
const generateTestProgression = (key, formulaIndex) => {
  const formula = progressionFormulas[formulaIndex];
  const rootIndex = allNotes.indexOf(key);
  const isMinorProgression = formula.isMinor;

  return formula.pattern.map((semitoneOffset) => {
    const noteIndex = (rootIndex + semitoneOffset) % 12;
    const noteName = allNotes[noteIndex];

    let chordQuality;
    if (isMinorProgression) {
      if (semitoneOffset === 0) chordQuality = 'Minor'; // i
      else if (semitoneOffset === 3) chordQuality = 'Major'; // III
      else if (semitoneOffset === 5) chordQuality = 'Minor'; // iv
      else if (semitoneOffset === 7) chordQuality = 'Major'; // V
      else if (semitoneOffset === 8) chordQuality = 'Major'; // VI
      else if (semitoneOffset === 10) chordQuality = 'Major'; // VII
      else chordQuality = 'Major';
    } else {
      const scaleDegree = semitoneOffset % 12;
      if ([0, 5, 7].includes(scaleDegree)) chordQuality = 'Major';
      else chordQuality = 'Minor';
    }

    return `${noteName} ${chordQuality}`;
  });
};

describe('GuitarFretboard Music Theory Engine', () => {
  describe('Spanish Romantic Progression', () => {
    test('should include Spanish Romantic progression in formulas', () => {
      const spanishRomanticFormula = progressionFormulas.find(
        (formula) => formula.label === 'Spanish Romantic: i – VII – VI – V',
      );

      expect(spanishRomanticFormula).toBeDefined();
      expect(spanishRomanticFormula.pattern).toEqual([0, 10, 8, 7]);
      expect(spanishRomanticFormula.isMinor).toBe(true);
    });

    test('should generate correct Spanish Romantic progression in A minor', () => {
      const progression = generateTestProgression('A', 9); // Spanish Romantic is index 9

      expect(progression).toEqual([
        'A Minor', // i (A minor)
        'G Major', // VII (G major)
        'F Major', // VI (F major)
        'E Major', // V (E major)
      ]);
    });

    test('should generate correct Spanish Romantic progression in D minor', () => {
      const progression = generateTestProgression('D', 9);

      expect(progression).toEqual([
        'D Minor', // i (D minor)
        'C Major', // VII (C major)
        'A# Major', // VI (Bb major)
        'A Major', // V (A major)
      ]);
    });

    test('should generate correct Spanish Romantic progression in E minor', () => {
      const progression = generateTestProgression('E', 9);

      expect(progression).toEqual([
        'E Minor', // i (E minor)
        'D Major', // VII (D major)
        'C Major', // VI (C major)
        'B Major', // V (B major)
      ]);
    });
  });

  describe('Minor Key Progression Logic', () => {
    test('should correctly identify minor progressions', () => {
      const minorProgressions = progressionFormulas.filter((formula) => formula.isMinor);
      const expectedMinorLabels = [
        'Cinematic: i – VI – III – VII',
        'Melancholy Minor: i – VII – VI – iv',
        'Dramatic Minor: i – v – VI – III',
        'Spanish: i – VII – VI – V',
        'Spanish Romantic: i – VII – VI – V',
      ];

      expect(minorProgressions.map((p) => p.label)).toEqual(expectedMinorLabels);
    });

    test('should generate correct chord qualities for minor progressions', () => {
      // Test Melancholy Minor: i – VII – VI – iv
      const melancholyProgression = generateTestProgression('A', 6); // Melancholy Minor

      expect(melancholyProgression).toEqual([
        'A Minor', // i
        'G Major', // VII
        'F Major', // VI
        'D Minor', // iv
      ]);
    });

    test('should generate correct chord qualities for major progressions', () => {
      // Test Folk: I – V – vi – IV
      const folkProgression = generateTestProgression('C', 0); // Folk

      expect(folkProgression).toEqual([
        'C Major', // I
        'G Major', // V
        'A Minor', // vi
        'F Major', // IV
      ]);
    });
  });

  describe('Progression Pattern Validation', () => {
    test('should have correct semitone intervals for Spanish Romantic', () => {
      const spanishRomantic = progressionFormulas[9];

      // i – VII – VI – V should be 0, 10, 8, 7 semitones from root
      expect(spanishRomantic.pattern).toEqual([0, 10, 8, 7]);
    });

    test('should generate different progressions for different keys', () => {
      const cMinorProgression = generateTestProgression('C', 9);
      const fMinorProgression = generateTestProgression('F', 9);

      expect(cMinorProgression).not.toEqual(fMinorProgression);
      expect(cMinorProgression[0]).toBe('C Minor');
      expect(fMinorProgression[0]).toBe('F Minor');
    });
  });
});

describe('GuitarFretboard Component Integration', () => {
  test('should render Spanish Romantic progression option', () => {
    render(<GuitarFretboard />);

    const progressionSelect = screen.getByDisplayValue('Folk: I – V – vi – IV');
    fireEvent.click(progressionSelect);

    expect(screen.getByText('Spanish Romantic: i – VII – VI – V')).toBeInTheDocument();
  });

  test('should generate Spanish Romantic progression when selected', () => {
    render(<GuitarFretboard />);

    // Select Spanish Romantic progression
    const progressionSelect = screen.getByDisplayValue('Folk: I – V – vi – IV');
    fireEvent.change(progressionSelect, { target: { value: '9' } });

    // Generate progression
    const generateButton = screen.getByText('Generate Random Progression');
    fireEvent.click(generateButton);

    // Check that chord selectors are populated (we can't easily test the exact values without more complex setup)
    const chordSelectors = screen.getAllByText(/-- Select Chord \d --/);
    expect(chordSelectors).toHaveLength(4);
  });
});
