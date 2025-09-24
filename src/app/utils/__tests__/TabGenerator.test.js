import TabGenerator from '../TabGenerator';

describe('TabGenerator', () => {
  let generator;
  const standardTuning = ['E', 'B', 'G', 'D', 'A', 'E'];
  const cMajorChord = ['C', 'E', 'G'];
  const cMajorScale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  beforeEach(() => {
    generator = new TabGenerator();
  });

  describe('getNoteAt', () => {
    it('should calculate correct note at fret position', () => {
      expect(generator.getNoteAt('E', 0)).toBe('E');
      expect(generator.getNoteAt('E', 1)).toBe('F');
      expect(generator.getNoteAt('E', 3)).toBe('G');
      expect(generator.getNoteAt('A', 2)).toBe('B');
    });

    it('should handle wrap-around for high fret numbers', () => {
      expect(generator.getNoteAt('E', 12)).toBe('E'); // Octave
      expect(generator.getNoteAt('A', 14)).toBe('B'); // A + 14 semitones = B
    });

    it('should return empty string for invalid base note', () => {
      expect(generator.getNoteAt('X', 5)).toBe('');
    });
  });

  describe('findNotePositions', () => {
    it('should find all positions for a note on the fretboard', () => {
      const positions = generator.findNotePositions('E', standardTuning, 0, 12);

      // E should be found on open high E (string 0) and open low E (string 5)
      expect(positions).toContainEqual({ string: 0, fret: 0 });
      expect(positions).toContainEqual({ string: 5, fret: 0 });

      // E should also be found on other strings at various frets
      expect(positions.length).toBeGreaterThan(2);
    });

    it('should respect fret range limits', () => {
      const positions = generator.findNotePositions('E', standardTuning, 3, 7);

      // Should not include open string positions (fret 0)
      expect(positions.every((pos) => pos.fret >= 3 && pos.fret <= 7)).toBe(true);
    });
  });

  describe('filterPositionsByRange', () => {
    it('should filter positions to stay within range', () => {
      const allPositions = [
        { string: 0, fret: 1 },
        { string: 1, fret: 5 },
        { string: 2, fret: 8 },
        { string: 3, fret: 12 },
      ];

      const filtered = generator.filterPositionsByRange(allPositions, 5, 4);

      // Should include positions around fret 5 (3-7 range)
      expect(filtered).toContainEqual({ string: 1, fret: 5 });
      expect(filtered).not.toContainEqual({ string: 0, fret: 1 });
      expect(filtered).not.toContainEqual({ string: 3, fret: 12 });
    });
  });

  describe('scorePosition', () => {
    it('should give higher scores to chord tones when emphasized', () => {
      const chordTonePos = { string: 2, fret: 5 };
      const nonChordTonePos = { string: 2, fret: 5 };

      const chordToneScore = generator.scorePosition(chordTonePos, 'C', cMajorChord, true, 5);
      const nonChordToneScore = generator.scorePosition(nonChordTonePos, 'D', cMajorChord, true, 5);

      expect(chordToneScore).toBeGreaterThan(nonChordToneScore);
    });

    it('should prefer positions closer to preferred fret', () => {
      const closePos = { string: 2, fret: 5 };
      const farPos = { string: 2, fret: 10 };

      const closeScore = generator.scorePosition(closePos, 'C', cMajorChord, false, 5);
      const farScore = generator.scorePosition(farPos, 'C', cMajorChord, false, 5);

      expect(closeScore).toBeGreaterThan(farScore);
    });
  });

  describe('createMelodicSequence', () => {
    it('should generate sequence of specified length', () => {
      const sequence = generator.createMelodicSequence(cMajorScale, cMajorChord, 6, true);
      expect(sequence).toHaveLength(6);
    });

    it('should use only notes from the provided scale', () => {
      const sequence = generator.createMelodicSequence(cMajorScale, cMajorChord, 6, true);
      sequence.forEach((note) => {
        expect(cMajorScale).toContain(note);
      });
    });

    it('should emphasize chord tones when requested', () => {
      // Generate multiple sequences and check that chord tones appear more frequently
      const sequences = [];
      for (let i = 0; i < 10; i++) {
        sequences.push(...generator.createMelodicSequence(cMajorScale, cMajorChord, 6, true));
      }

      const chordToneCount = sequences.filter((note) => cMajorChord.includes(note)).length;
      const totalNotes = sequences.length;

      // With emphasis, chord tones should appear more than their natural proportion
      // Natural proportion would be 3/7 ≈ 43%, with emphasis should be higher
      expect(chordToneCount / totalNotes).toBeGreaterThan(0.5);
    });

    it('should return empty array when no scale notes provided', () => {
      const sequence = generator.createMelodicSequence([], cMajorChord, 6, true);
      expect(sequence).toEqual([]);
    });
  });

  describe('generatePhrase', () => {
    it('should generate phrase with correct chord name', () => {
      const phrase = generator.generatePhrase('C Major', cMajorChord, cMajorScale, standardTuning);
      expect(phrase.chordName).toBe('C Major');
    });

    it('should generate phrase with notes array', () => {
      const phrase = generator.generatePhrase('C Major', cMajorChord, cMajorScale, standardTuning);
      expect(Array.isArray(phrase.notes)).toBe(true);
      expect(phrase.notes.length).toBeGreaterThan(0);
    });

    it('should generate notes with valid string and fret properties', () => {
      const phrase = generator.generatePhrase('C Major', cMajorChord, cMajorScale, standardTuning);

      phrase.notes.forEach((note) => {
        expect(typeof note.string).toBe('number');
        expect(typeof note.fret).toBe('number');
        expect(note.string).toBeGreaterThanOrEqual(0);
        expect(note.string).toBeLessThanOrEqual(5);
        expect(note.fret).toBeGreaterThanOrEqual(0);
        expect(note.fret).toBeLessThanOrEqual(12);
      });
    });

    it('should respect phrase length option', () => {
      const phrase = generator.generatePhrase('C Major', cMajorChord, cMajorScale, standardTuning, { phraseLength: 4 });
      expect(phrase.notes.length).toBeLessThanOrEqual(4);
    });

    it('should handle empty chord and scale gracefully', () => {
      const phrase = generator.generatePhrase('Empty', [], [], standardTuning);
      expect(phrase.chordName).toBe('Empty');
      expect(phrase.notes).toEqual([]);
    });

    it('should stay within preferred position range', () => {
      const phrase = generator.generatePhrase('C Major', cMajorChord, cMajorScale, standardTuning, {
        preferredPosition: 5,
        positionRange: 4,
      });

      // Most notes should be within the preferred range (3-7 frets)
      const notesInRange = phrase.notes.filter((note) => note.fret >= 3 && note.fret <= 7);
      expect(notesInRange.length).toBeGreaterThan(phrase.notes.length * 0.5);
    });
  });

  describe('generateProgressionPhrases', () => {
    const testProgression = [
      { name: 'C Major', notes: ['C', 'E', 'G'] },
      { name: 'F Major', notes: ['F', 'A', 'C'] },
      { name: 'G Major', notes: ['G', 'B', 'D'] },
      { name: 'C Major', notes: ['C', 'E', 'G'] },
    ];

    it('should generate phrases for each chord in progression', () => {
      const phrases = generator.generateProgressionPhrases(testProgression, cMajorScale, standardTuning);

      expect(phrases).toHaveLength(4);
      expect(phrases[0].chordName).toBe('C Major');
      expect(phrases[1].chordName).toBe('F Major');
      expect(phrases[2].chordName).toBe('G Major');
      expect(phrases[3].chordName).toBe('C Major');
    });

    it('should generate valid tab notes for each phrase', () => {
      const phrases = generator.generateProgressionPhrases(testProgression, cMajorScale, standardTuning);

      phrases.forEach((phrase) => {
        expect(Array.isArray(phrase.notes)).toBe(true);
        phrase.notes.forEach((note) => {
          expect(typeof note.string).toBe('number');
          expect(typeof note.fret).toBe('number');
          expect(note.string).toBeGreaterThanOrEqual(0);
          expect(note.string).toBeLessThanOrEqual(5);
          expect(note.fret).toBeGreaterThanOrEqual(0);
          expect(note.fret).toBeLessThanOrEqual(12);
        });
      });
    });

    it('should handle progression with empty chords', () => {
      const progressionWithEmpty = [
        { name: 'C Major', notes: ['C', 'E', 'G'] },
        { name: '', notes: [] },
        { name: 'G Major', notes: ['G', 'B', 'D'] },
      ];

      const phrases = generator.generateProgressionPhrases(progressionWithEmpty, cMajorScale, standardTuning);

      // Should only generate phrases for valid chords
      expect(phrases).toHaveLength(2);
      expect(phrases[0].chordName).toBe('C Major');
      expect(phrases[1].chordName).toBe('G Major');
    });

    it('should create complementary phrases with position variation', () => {
      const phrases = generator.generateProgressionPhrases(testProgression, cMajorScale, standardTuning, {
        preferredPosition: 5,
      });

      // Check that phrases have some variation in their fret positions
      const allFrets = phrases.flatMap((phrase) => phrase.notes.map((note) => note.fret));
      const uniqueFrets = [...new Set(allFrets)];

      // Should have some variety in fret positions
      expect(uniqueFrets.length).toBeGreaterThan(2);
    });
  });
});
