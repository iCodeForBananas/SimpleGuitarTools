/**
 * TabGenerator - Musical phrase generation engine for guitar tablature
 *
 * This class generates short melodic phrases (4-8 notes) that:
 * - Stay within the same fretboard position for playability
 * - Emphasize chord tones when available
 * - Use notes from the selected scale
 * - Create complementary phrases between chord changes
 */

const allNotes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

/**
 * @typedef {Object} TabNote
 * @property {number} string - String number (0-5, where 0 is high E, 5 is low E)
 * @property {number} fret - Fret number to play
 * @property {number} [timing] - Optional timing for rhythm notation
 */

/**
 * @typedef {Object} TabPhrase
 * @property {string} chordName - Name of the chord this phrase is for
 * @property {TabNote[]} notes - Array of notes in the phrase
 */

/**
 * @typedef {Object} GenerationOptions
 * @property {number} phraseLength - Number of notes in phrase (4-8)
 * @property {number} preferredPosition - Preferred fret position (0-12)
 * @property {boolean} emphasizeChordTones - Whether to prioritize chord tones
 * @property {number} positionRange - Fret range to stay within (default: 4)
 */

class TabGenerator {
  constructor() {
    // Default generation options
    this.defaultOptions = {
      phraseLength: 6,
      preferredPosition: 5, // 5th fret position is comfortable
      emphasizeChordTones: true,
      positionRange: 4, // Stay within 4 frets
    };
  }

  /**
   * Get the note at a specific fret on a string
   * @param {string} baseNote - Open string note
   * @param {number} fret - Fret number
   * @returns {string} Note name
   */
  getNoteAt(baseNote, fret) {
    const baseIndex = allNotes.indexOf(baseNote);
    if (baseIndex < 0) return '';
    return allNotes[(baseIndex + fret) % 12];
  }

  /**
   * Find all fretboard positions where a specific note can be played
   * @param {string} note - Note to find
   * @param {string[]} tuning - Guitar tuning
   * @param {number} minFret - Minimum fret to consider
   * @param {number} maxFret - Maximum fret to consider
   * @returns {Array<{string: number, fret: number}>} Available positions
   */
  findNotePositions(note, tuning, minFret = 0, maxFret = 12) {
    const positions = [];

    tuning.forEach((openNote, stringIndex) => {
      for (let fret = minFret; fret <= maxFret; fret++) {
        if (this.getNoteAt(openNote, fret) === note) {
          positions.push({ string: stringIndex, fret });
        }
      }
    });

    return positions;
  }

  /**
   * Filter positions to stay within a specific fretboard position range
   * @param {Array} positions - All available positions
   * @param {number} centerPosition - Center fret position
   * @param {number} range - Fret range to stay within
   * @returns {Array} Filtered positions
   */
  filterPositionsByRange(positions, centerPosition, range) {
    const minFret = Math.max(0, centerPosition - Math.floor(range / 2));
    const maxFret = Math.min(12, centerPosition + Math.floor(range / 2));

    return positions.filter((pos) => pos.fret >= minFret && pos.fret <= maxFret);
  }

  /**
   * Score a note position based on playability and musical context
   * @param {Object} position - Position object {string, fret}
   * @param {string} note - Note name
   * @param {string[]} chordNotes - Current chord notes
   * @param {boolean} emphasizeChordTones - Whether to prioritize chord tones
   * @param {number} preferredPosition - Preferred fret position
   * @returns {number} Score (higher is better)
   */
  scorePosition(position, note, chordNotes, emphasizeChordTones, preferredPosition) {
    let score = 0;

    // Prefer chord tones if emphasizing them
    if (emphasizeChordTones && chordNotes.includes(note)) {
      score += 10;
    }

    // Prefer positions closer to preferred fret position
    const distanceFromPreferred = Math.abs(position.fret - preferredPosition);
    score += Math.max(0, 5 - distanceFromPreferred);

    // Prefer middle strings for melody (strings 1-4)
    if (position.string >= 1 && position.string <= 4) {
      score += 3;
    }

    // Avoid open strings in the middle of phrases (less melodic)
    if (position.fret === 0) {
      score -= 2;
    }

    // Prefer frets that are comfortable to play
    if (position.fret >= 3 && position.fret <= 9) {
      score += 2;
    }

    return score;
  }

  /**
   * Select the best position for a note based on scoring
   * @param {string} note - Note to place
   * @param {string[]} tuning - Guitar tuning
   * @param {string[]} chordNotes - Current chord notes
   * @param {GenerationOptions} options - Generation options
   * @returns {Object|null} Best position or null if none found
   */
  selectBestPosition(note, tuning, chordNotes, options) {
    const allPositions = this.findNotePositions(note, tuning, 0, 12);
    const filteredPositions = this.filterPositionsByRange(
      allPositions,
      options.preferredPosition,
      options.positionRange,
    );

    if (filteredPositions.length === 0) {
      // Fallback to any position if none in preferred range
      if (allPositions.length === 0) return null;
      return allPositions[Math.floor(Math.random() * allPositions.length)];
    }

    // Score all positions and select the best one
    const scoredPositions = filteredPositions.map((pos) => ({
      ...pos,
      score: this.scorePosition(pos, note, chordNotes, options.emphasizeChordTones, options.preferredPosition),
    }));

    // Sort by score (highest first) and add some randomness
    scoredPositions.sort((a, b) => b.score - a.score);

    // Select from top 3 positions to add variety
    const topPositions = scoredPositions.slice(0, Math.min(3, scoredPositions.length));
    return topPositions[Math.floor(Math.random() * topPositions.length)];
  }

  /**
   * Create an arpeggiated sequence from chord notes
   * @param {string[]} chordNotes - Current chord notes
   * @param {number} length - Number of notes to generate
   * @returns {string[]} Array of note names
   */
  createArpeggiatedSequence(chordNotes, length) {
    if (chordNotes.length === 0) return [];

    const sequence = [];
    for (let i = 0; i < length; i++) {
      sequence.push(chordNotes[i % chordNotes.length]);
    }
    return sequence;
  }

  /**
   * Generate a musical phrase for a specific chord
   * @param {string} chordName - Name of the chord
   * @param {string[]} chordNotes - Notes in the chord
   * @param {string[]} scaleNotes - Notes in the scale
   * @param {string[]} tuning - Guitar tuning
   * @param {GenerationOptions} options - Generation options
   * @returns {TabPhrase} Generated phrase
   */
  generatePhrase(chordName, chordNotes = [], scaleNotes = [], tuning = ['E', 'B', 'G', 'D', 'A', 'E'], options = {}) {
    const opts = { ...this.defaultOptions, ...options };

    // Ensure we have notes to work with
    const workingScale = scaleNotes.length > 0 ? scaleNotes : chordNotes;
    if (workingScale.length === 0) {
      // Return empty phrase if no notes available
      return { chordName, notes: [] };
    }

    // Generate arpeggiated sequence
    const noteSequence = this.createArpeggiatedSequence(chordNotes, opts.phraseLength);

    // Convert notes to fretboard positions
    const tabNotes = [];
    noteSequence.forEach((note) => {
      const position = this.selectBestPosition(note, tuning, chordNotes, opts);
      if (position) {
        tabNotes.push({
          string: position.string,
          fret: position.fret,
        });
      }
    });

    return {
      chordName,
      notes: tabNotes,
    };
  }

  /**
   * Generate complementary phrases for a chord progression
   * @param {Array} chordProgression - Array of chord objects with name and notes
   * @param {string[]} scaleNotes - Scale notes to use
   * @param {string[]} tuning - Guitar tuning
   * @param {GenerationOptions} options - Generation options
   * @returns {TabPhrase[]} Array of generated phrases
   */
  generateProgressionPhrases(chordProgression, scaleNotes = [], tuning = ['E', 'B', 'G', 'D', 'A', 'E'], options = {}) {
    const phrases = [];
    const opts = { ...this.defaultOptions, ...options };

    chordProgression.forEach((chord, index) => {
      if (!chord.name || !chord.notes) return;

      // Vary phrase length slightly for musical interest
      const basePhraseLength = opts.phraseLength;
      const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      const phraseLength = Math.max(4, Math.min(8, basePhraseLength + variation));

      // Adjust preferred position slightly for each chord to create movement
      const positionVariation = (index % 3) - 1; // -1, 0, 1 pattern
      const preferredPosition = Math.max(3, Math.min(9, opts.preferredPosition + positionVariation));

      const phraseOptions = {
        ...opts,
        phraseLength,
        preferredPosition,
      };

      const phrase = this.generatePhrase(chord.name, chord.notes, scaleNotes, tuning, phraseOptions);

      phrases.push(phrase);
    });

    return phrases;
  }
}

export default TabGenerator;
