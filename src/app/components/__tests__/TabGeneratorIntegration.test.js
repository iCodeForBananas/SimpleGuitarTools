/**
 * Integration tests for TabGenerator with GuitarFretboard component
 * Tests the end-to-end functionality of musical phrase generation
 */

import TabGenerator from '../../utils/TabGenerator';

describe('TabGenerator Integration', () => {
  let generator;
  const standardTuning = ['E', 'B', 'G', 'D', 'A', 'E'];

  // Sample chord progression data (similar to what GuitarFretboard would use)
  const sampleProgression = [
    { name: 'C Major', notes: ['C', 'E', 'G'] },
    { name: 'F Major', notes: ['F', 'A', 'C'] },
    { name: 'G Major', notes: ['G', 'B', 'D'] },
    { name: 'C Major', notes: ['C', 'E', 'G'] },
  ];

  const cMajorScale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  beforeEach(() => {
    generator = new TabGenerator();
  });

  describe('End-to-end phrase generation', () => {
    it('should generate complete progression phrases matching GuitarFretboard requirements', () => {
      const phrases = generator.generateProgressionPhrases(sampleProgression, cMajorScale, standardTuning, {
        phraseLength: 6,
        preferredPosition: 5,
        emphasizeChordTones: true,
        positionRange: 4,
      });

      // Should generate one phrase per chord
      expect(phrases).toHaveLength(4);

      // Each phrase should have the correct structure for TabDisplay component
      phrases.forEach((phrase, index) => {
        expect(phrase).toHaveProperty('chordName');
        expect(phrase).toHaveProperty('notes');
        expect(phrase.chordName).toBe(sampleProgression[index].name);
        expect(Array.isArray(phrase.notes)).toBe(true);

        // Each note should have valid string and fret properties
        phrase.notes.forEach((note) => {
          expect(note).toHaveProperty('string');
          expect(note).toHaveProperty('fret');
          expect(typeof note.string).toBe('number');
          expect(typeof note.fret).toBe('number');
          expect(note.string).toBeGreaterThanOrEqual(0);
          expect(note.string).toBeLessThanOrEqual(5);
          expect(note.fret).toBeGreaterThanOrEqual(0);
          expect(note.fret).toBeLessThanOrEqual(12);
        });
      });
    });

    it('should generate phrases that stay within the same fretboard position', () => {
      const phrases = generator.generateProgressionPhrases(sampleProgression, cMajorScale, standardTuning, {
        phraseLength: 6,
        preferredPosition: 5,
        emphasizeChordTones: true,
        positionRange: 4,
      });

      phrases.forEach((phrase) => {
        if (phrase.notes.length > 0) {
          const frets = phrase.notes.map((note) => note.fret);
          const minFret = Math.min(...frets);
          const maxFret = Math.max(...frets);

          // Most phrases should stay within a reasonable range
          // Allow some flexibility for musical variety
          expect(maxFret - minFret).toBeLessThanOrEqual(6);
        }
      });
    });

    it('should generate phrases with appropriate length (4-8 notes)', () => {
      const phrases = generator.generateProgressionPhrases(sampleProgression, cMajorScale, standardTuning, {
        phraseLength: 6,
        preferredPosition: 5,
        emphasizeChordTones: true,
        positionRange: 4,
      });

      phrases.forEach((phrase) => {
        expect(phrase.notes.length).toBeGreaterThanOrEqual(4);
        expect(phrase.notes.length).toBeLessThanOrEqual(8);
      });
    });

    it('should create complementary phrases with position variation', () => {
      const phrases = generator.generateProgressionPhrases(sampleProgression, cMajorScale, standardTuning, {
        phraseLength: 6,
        preferredPosition: 5,
        emphasizeChordTones: true,
        positionRange: 4,
      });

      // Collect all fret positions used across phrases
      const allFrets = phrases.flatMap((phrase) => phrase.notes.map((note) => note.fret));
      const uniqueFrets = [...new Set(allFrets)];

      // Should have variety in fret positions across the progression
      expect(uniqueFrets.length).toBeGreaterThan(2);
    });

    it('should handle empty chord progression gracefully', () => {
      const emptyProgression = [
        { name: '', notes: [] },
        { name: '', notes: [] },
      ];

      const phrases = generator.generateProgressionPhrases(emptyProgression, cMajorScale, standardTuning);

      // Should return empty array or skip empty chords
      expect(phrases.length).toBe(0);
    });

    it('should work with different tunings', () => {
      const dropDTuning = ['E', 'B', 'G', 'D', 'A', 'D']; // Drop D tuning

      const phrases = generator.generateProgressionPhrases(sampleProgression, cMajorScale, dropDTuning, {
        phraseLength: 5,
        preferredPosition: 3,
        emphasizeChordTones: true,
        positionRange: 4,
      });

      expect(phrases).toHaveLength(4);

      // Should generate valid phrases even with different tuning
      phrases.forEach((phrase) => {
        expect(phrase.notes.length).toBeGreaterThan(0);
        phrase.notes.forEach((note) => {
          expect(note.string).toBeGreaterThanOrEqual(0);
          expect(note.string).toBeLessThanOrEqual(5);
          expect(note.fret).toBeGreaterThanOrEqual(0);
          expect(note.fret).toBeLessThanOrEqual(12);
        });
      });
    });

    it('should emphasize chord tones when requested', () => {
      // Generate multiple sets of phrases to test chord tone emphasis
      const phraseSets = [];
      for (let i = 0; i < 5; i++) {
        phraseSets.push(
          generator.generateProgressionPhrases(sampleProgression, cMajorScale, standardTuning, {
            phraseLength: 6,
            preferredPosition: 5,
            emphasizeChordTones: true,
            positionRange: 4,
          }),
        );
      }

      // Check that chord tones appear frequently across generated phrases
      let totalNotes = 0;
      let chordToneCount = 0;

      phraseSets.forEach((phrases) => {
        phrases.forEach((phrase, chordIndex) => {
          const chordNotes = sampleProgression[chordIndex].notes;
          phrase.notes.forEach((note) => {
            totalNotes++;
            // Get the actual note name at this fret position
            const stringNote = standardTuning[note.string];
            const actualNote = generator.getNoteAt(stringNote, note.fret);
            if (chordNotes.includes(actualNote)) {
              chordToneCount++;
            }
          });
        });
      });

      // With emphasis, chord tones should appear more frequently than random
      const chordToneRatio = chordToneCount / totalNotes;
      expect(chordToneRatio).toBeGreaterThan(0.4); // Should be higher than random chance
    });
  });

  describe('Single phrase generation', () => {
    it('should generate phrase compatible with TabDisplay component', () => {
      const phrase = generator.generatePhrase('C Major', ['C', 'E', 'G'], cMajorScale, standardTuning, {
        phraseLength: 6,
        preferredPosition: 5,
        emphasizeChordTones: true,
        positionRange: 4,
      });

      // Should match TabPhrase interface expected by TabDisplay
      expect(phrase).toHaveProperty('chordName', 'C Major');
      expect(phrase).toHaveProperty('notes');
      expect(Array.isArray(phrase.notes)).toBe(true);

      phrase.notes.forEach((note) => {
        expect(note).toHaveProperty('string');
        expect(note).toHaveProperty('fret');
        expect(typeof note.string).toBe('number');
        expect(typeof note.fret).toBe('number');
      });
    });
  });
});
