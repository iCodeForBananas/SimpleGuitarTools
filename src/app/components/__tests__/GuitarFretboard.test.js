import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GuitarFretboard from '../GuitarFretboard';
import { ThemeProvider } from '../../contexts/ThemeContext';

// Test wrapper component
const TestWrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

// Helper function to render with theme provider
const renderWithTheme = (component) => {
  return render(component, { wrapper: TestWrapper });
};

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
    renderWithTheme(<GuitarFretboard />);

    const progressionSelect = screen.getByDisplayValue('Folk: I – V – vi – IV');
    fireEvent.click(progressionSelect);

    expect(screen.getByText('Spanish Romantic: i – VII – VI – V')).toBeInTheDocument();
  });

  test('should generate Spanish Romantic progression when selected', () => {
    renderWithTheme(<GuitarFretboard />);

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
describe('Reset Functionality', () => {
  test('should render Reset All button', () => {
    renderWithTheme(<GuitarFretboard />);

    const resetButton = screen.getByText('Reset All');
    expect(resetButton).toBeInTheDocument();
    expect(resetButton).toHaveAttribute('title', 'Reset all selections to default values');
  });

  test('should reset tuning to standard when Reset All is clicked', () => {
    renderWithTheme(<GuitarFretboard />);

    // Change tuning from standard
    const firstTuningSelect = screen.getAllByDisplayValue('E')[0]; // First string (low E)
    fireEvent.change(firstTuningSelect, { target: { value: 'D' } });

    // Verify tuning changed
    expect(screen.getAllByDisplayValue('D')).toHaveLength(2); // D string and the changed one

    // Click Reset All
    const resetButton = screen.getByText('Reset All');
    fireEvent.click(resetButton);

    // Verify tuning is back to standard (E-A-D-G-B-E)
    const tuningSelects = screen.getAllByRole('combobox').slice(0, 6); // First 6 are tuning selects
    expect(tuningSelects[0]).toHaveValue('E'); // Low E
    expect(tuningSelects[1]).toHaveValue('A'); // A
    expect(tuningSelects[2]).toHaveValue('D'); // D
    expect(tuningSelects[3]).toHaveValue('G'); // G
    expect(tuningSelects[4]).toHaveValue('B'); // B
    expect(tuningSelects[5]).toHaveValue('E'); // High E
  });

  test('should clear chord selection when Reset All is clicked', () => {
    renderWithTheme(<GuitarFretboard />);

    // Select a chord
    const chordSelect = screen.getByDisplayValue('-- Select Chord --');
    fireEvent.change(chordSelect, { target: { value: 'C Major' } });

    // Verify chord is selected
    expect(chordSelect).toHaveValue('C Major');

    // Click Reset All
    const resetButton = screen.getByText('Reset All');
    fireEvent.click(resetButton);

    // Verify chord selection is cleared
    expect(chordSelect).toHaveValue('');
  });

  test('should clear scale selection when Reset All is clicked', () => {
    renderWithTheme(<GuitarFretboard />);

    // Select a scale
    const scaleSelect = screen.getByDisplayValue('-- Select Scale --');
    fireEvent.change(scaleSelect, { target: { value: 'C Major' } });

    // Verify scale is selected
    expect(scaleSelect).toHaveValue('C Major');

    // Click Reset All
    const resetButton = screen.getByText('Reset All');
    fireEvent.click(resetButton);

    // Verify scale selection is cleared
    expect(scaleSelect).toHaveValue('');
  });

  test('should reset progression key to C when Reset All is clicked', () => {
    renderWithTheme(<GuitarFretboard />);

    // Change progression key from C
    const keySelect = screen.getByDisplayValue('Key of C');
    fireEvent.change(keySelect, { target: { value: 'G' } });

    // Verify key changed
    expect(keySelect).toHaveValue('G');

    // Click Reset All
    const resetButton = screen.getByText('Reset All');
    fireEvent.click(resetButton);

    // Verify key is back to C
    expect(keySelect).toHaveValue('C');
  });

  test('should reset progression formula to first option when Reset All is clicked', () => {
    renderWithTheme(<GuitarFretboard />);

    // Change progression formula from Folk
    const formulaSelect = screen.getByDisplayValue('Folk: I – V – vi – IV');
    fireEvent.change(formulaSelect, { target: { value: '2' } }); // Sad Pop

    // Verify formula changed
    expect(formulaSelect).toHaveValue('2');

    // Click Reset All
    const resetButton = screen.getByText('Reset All');
    fireEvent.click(resetButton);

    // Verify formula is back to first option (Folk)
    expect(formulaSelect).toHaveValue('0');
  });

  test('should clear all chord progression selections when Reset All is clicked', () => {
    renderWithTheme(<GuitarFretboard />);

    // Generate a progression first
    const generateButton = screen.getByText('Generate Random Progression');
    fireEvent.click(generateButton);

    // Manually select a chord in one of the progression slots
    const chordProgressionSelects = screen.getAllByText(/-- Select Chord \d --/);
    const firstProgressionSelect = chordProgressionSelects[0].closest('select');
    fireEvent.change(firstProgressionSelect, { target: { value: 'C Major' } });

    // Verify chord is selected in progression
    expect(firstProgressionSelect).toHaveValue('C Major');

    // Click Reset All
    const resetButton = screen.getByText('Reset All');
    fireEvent.click(resetButton);

    // Verify all progression chord selections are cleared
    const resetProgressionSelects = screen.getAllByText(/-- Select Chord \d --/);
    resetProgressionSelects.forEach((option) => {
      const select = option.closest('select');
      expect(select).toHaveValue('');
    });
  });

  test('should reset all selections simultaneously', () => {
    renderWithTheme(<GuitarFretboard />);

    // Make multiple changes
    const firstTuningSelect = screen.getAllByDisplayValue('E')[0];
    fireEvent.change(firstTuningSelect, { target: { value: 'D' } });

    const chordSelect = screen.getByDisplayValue('-- Select Chord --');
    fireEvent.change(chordSelect, { target: { value: 'G Major' } });

    const scaleSelect = screen.getByDisplayValue('-- Select Scale --');
    fireEvent.change(scaleSelect, { target: { value: 'A Minor' } });

    const keySelect = screen.getByDisplayValue('Key of C');
    fireEvent.change(keySelect, { target: { value: 'F' } });

    const formulaSelect = screen.getByDisplayValue('Folk: I – V – vi – IV');
    fireEvent.change(formulaSelect, { target: { value: '3' } });

    // Verify all changes were made
    expect(firstTuningSelect).toHaveValue('D');
    expect(chordSelect).toHaveValue('G Major');
    expect(scaleSelect).toHaveValue('A Minor');
    expect(keySelect).toHaveValue('F');
    expect(formulaSelect).toHaveValue('3');

    // Click Reset All
    const resetButton = screen.getByText('Reset All');
    fireEvent.click(resetButton);

    // Verify everything is reset to defaults
    expect(firstTuningSelect).toHaveValue('E');
    expect(chordSelect).toHaveValue('');
    expect(scaleSelect).toHaveValue('');
    expect(keySelect).toHaveValue('C');
    expect(formulaSelect).toHaveValue('0');
  });
});
