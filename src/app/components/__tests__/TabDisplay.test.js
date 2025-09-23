import { render, screen } from '@testing-library/react';
import TabDisplay, { createPlaceholderTabData } from '../TabDisplay';

// Mock CSS imports
jest.mock('../tab-display.css', () => ({}));

describe('TabDisplay Component', () => {
  const defaultTuning = ['E', 'B', 'G', 'D', 'A', 'E'];

  test('renders empty state when no phrases provided', () => {
    render(<TabDisplay phrases={[]} tuning={defaultTuning} theme="light" />);

    expect(screen.getByText(/No tablature to display/i)).toBeInTheDocument();
    expect(screen.getByText(/Generate phrases to see guitar tabs here/i)).toBeInTheDocument();
  });

  test('renders tab phrases with chord names', () => {
    const testPhrases = [
      {
        chordName: 'C Major',
        notes: [
          { string: 0, fret: 0 },
          { string: 1, fret: 1 },
          { string: 2, fret: 0 },
        ],
      },
    ];

    render(<TabDisplay phrases={testPhrases} tuning={defaultTuning} theme="light" />);

    expect(screen.getByText('Guitar Tablature')).toBeInTheDocument();
    expect(screen.getByText('C Major')).toBeInTheDocument();
  });

  test('displays string labels correctly', () => {
    const testPhrases = [
      {
        chordName: 'Test Chord',
        notes: [{ string: 0, fret: 3 }],
      },
    ];

    render(<TabDisplay phrases={testPhrases} tuning={defaultTuning} theme="light" />);

    // Check that all string labels are displayed
    defaultTuning.forEach((note) => {
      expect(screen.getByText(note)).toBeInTheDocument();
    });
  });

  test('applies dark theme class correctly', () => {
    const testPhrases = [
      {
        chordName: 'Test Chord',
        notes: [{ string: 0, fret: 1 }],
      },
    ];

    const { container } = render(<TabDisplay phrases={testPhrases} tuning={defaultTuning} theme="dark" />);

    expect(container.querySelector('.tab-display.dark')).toBeInTheDocument();
  });

  test('renders fret numbers for notes', () => {
    const testPhrases = [
      {
        chordName: 'Test Chord',
        notes: [
          { string: 0, fret: 3 },
          { string: 1, fret: 1 },
          { string: 2, fret: 0 },
        ],
      },
    ];

    render(<TabDisplay phrases={testPhrases} tuning={defaultTuning} theme="light" />);

    // Check that fret numbers are displayed
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});

describe('createPlaceholderTabData', () => {
  test('returns array of tab phrases', () => {
    const placeholderData = createPlaceholderTabData();

    expect(Array.isArray(placeholderData)).toBe(true);
    expect(placeholderData.length).toBeGreaterThan(0);
  });

  test('each phrase has required properties', () => {
    const placeholderData = createPlaceholderTabData();

    placeholderData.forEach((phrase) => {
      expect(phrase).toHaveProperty('chordName');
      expect(phrase).toHaveProperty('notes');
      expect(typeof phrase.chordName).toBe('string');
      expect(Array.isArray(phrase.notes)).toBe(true);
    });
  });

  test('each note has required properties', () => {
    const placeholderData = createPlaceholderTabData();

    placeholderData.forEach((phrase) => {
      phrase.notes.forEach((note) => {
        expect(note).toHaveProperty('string');
        expect(note).toHaveProperty('fret');
        expect(typeof note.string).toBe('number');
        expect(typeof note.fret).toBe('number');
        expect(note.string).toBeGreaterThanOrEqual(0);
        expect(note.string).toBeLessThanOrEqual(5);
        expect(note.fret).toBeGreaterThanOrEqual(0);
      });
    });
  });

  test('includes expected chord names', () => {
    const placeholderData = createPlaceholderTabData();
    const chordNames = placeholderData.map((phrase) => phrase.chordName);

    expect(chordNames).toContain('C Major');
    expect(chordNames).toContain('G Major');
    expect(chordNames).toContain('Am');
    expect(chordNames).toContain('F Major');
  });
});
