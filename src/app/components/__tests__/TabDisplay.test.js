import { render, screen } from '@testing-library/react';
import TabDisplay, { createPlaceholderTabData, createSingleTabPhrase } from '../TabDisplay';

// Mock CSS imports
jest.mock('../tab-display.css', () => ({}));

// Mock ThemeContext
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

describe('TabDisplay Component', () => {
  const defaultTuning = ['E', 'B', 'G', 'D', 'A', 'E'];

  test('renders empty state when no phrase provided', () => {
    render(<TabDisplay phrase={null} tuning={defaultTuning} position="standalone" />);

    expect(screen.getByText(/No tablature to display/i)).toBeInTheDocument();
    expect(screen.getByText(/Generate phrases to see guitar tabs here/i)).toBeInTheDocument();
  });

  test('renders tab phrase with chord name in standalone mode', () => {
    const testPhrase = {
      chordName: 'C Major',
      pattern: 'arpeggiated',
      notes: [
        { string: 0, fret: 0 },
        { string: 1, fret: 1 },
        { string: 2, fret: 0 },
      ],
    };

    render(<TabDisplay phrase={testPhrase} tuning={defaultTuning} position="standalone" />);

    expect(screen.getByText('Guitar Tablature')).toBeInTheDocument();
    expect(screen.getByText('C Major')).toBeInTheDocument();
    expect(screen.getByText('(Arpeggiated)')).toBeInTheDocument();
  });

  test('displays string labels correctly', () => {
    const testPhrase = {
      chordName: 'Test Chord',
      pattern: 'mixed',
      notes: [{ string: 0, fret: 3 }],
    };

    render(<TabDisplay phrase={testPhrase} tuning={defaultTuning} position="standalone" />);

    // Check that all string labels are displayed
    defaultTuning.forEach((note) => {
      expect(screen.getByText(note)).toBeInTheDocument();
    });
  });

  test('renders between-chords positioning mode correctly', () => {
    const testPhrase = {
      chordName: 'Test Chord',
      pattern: 'ascending-run',
      notes: [{ string: 0, fret: 1 }],
    };

    const { container } = render(<TabDisplay phrase={testPhrase} tuning={defaultTuning} position="between-chords" />);

    expect(container.querySelector('.tab-display--between-chords')).toBeInTheDocument();
    expect(screen.getByText('Ascending Run')).toBeInTheDocument();
    expect(screen.queryByText('Guitar Tablature')).not.toBeInTheDocument(); // No title in between-chords mode
  });

  test('renders fret numbers for notes', () => {
    const testPhrase = {
      chordName: 'Test Chord',
      pattern: 'descending-run',
      notes: [
        { string: 0, fret: 3 },
        { string: 1, fret: 1 },
        { string: 2, fret: 0 },
      ],
    };

    render(<TabDisplay phrase={testPhrase} tuning={defaultTuning} position="standalone" />);

    // Check that fret numbers are displayed
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('applies correct CSS classes for positioning modes', () => {
    const testPhrase = createSingleTabPhrase('C Major', 'mixed');

    const { container: standaloneContainer } = render(
      <TabDisplay phrase={testPhrase} tuning={defaultTuning} position="standalone" />,
    );
    expect(standaloneContainer.querySelector('.tab-display--standalone')).toBeInTheDocument();

    const { container: betweenContainer } = render(
      <TabDisplay phrase={testPhrase} tuning={defaultTuning} position="between-chords" />,
    );
    expect(betweenContainer.querySelector('.tab-display--between-chords')).toBeInTheDocument();
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
      expect(phrase).toHaveProperty('pattern');
      expect(typeof phrase.chordName).toBe('string');
      expect(Array.isArray(phrase.notes)).toBe(true);
      expect(['ascending-run', 'descending-run', 'arpeggiated', 'mixed']).toContain(phrase.pattern);
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
describe('createSingleTabPhrase', () => {
  test('returns a single tab phrase with default values', () => {
    const phrase = createSingleTabPhrase();

    expect(phrase).toHaveProperty('chordName', 'C Major');
    expect(phrase).toHaveProperty('pattern', 'arpeggiated');
    expect(phrase).toHaveProperty('notes');
    expect(Array.isArray(phrase.notes)).toBe(true);
  });

  test('returns phrase with specified chord name and pattern', () => {
    const phrase = createSingleTabPhrase('G Major', 'ascending-run');

    expect(phrase).toHaveProperty('chordName', 'G Major');
    expect(phrase).toHaveProperty('pattern', 'ascending-run');
    expect(phrase).toHaveProperty('notes');
  });

  test('falls back to first phrase if chord name not found', () => {
    const phrase = createSingleTabPhrase('Unknown Chord', 'mixed');

    expect(phrase).toHaveProperty('chordName', 'C Major'); // Falls back to first chord
    expect(phrase).toHaveProperty('pattern', 'mixed'); // But keeps the specified pattern
  });

  test('supports all pattern types', () => {
    const patterns = ['ascending-run', 'descending-run', 'arpeggiated', 'mixed'];

    patterns.forEach((pattern) => {
      const phrase = createSingleTabPhrase('C Major', pattern);
      expect(phrase.pattern).toBe(pattern);
    });
  });
});
