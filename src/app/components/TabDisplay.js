'use client';

import React from 'react';
import './tab-display.css';
import { useTheme } from '../contexts/ThemeContext';

/**
 * TabNote interface represents a single note in guitar tablature
 * @typedef {Object} TabNote
 * @property {number} string - String number (0-5, where 0 is high E, 5 is low E)
 * @property {number} fret - Fret number to play
 * @property {number} [timing] - Optional timing for rhythm notation
 */

/**
 * TabPhrase interface represents a musical phrase for a specific chord
 * @typedef {Object} TabPhrase
 * @property {string} chordName - Name of the chord this phrase is for
 * @property {TabNote[]} notes - Array of notes in the phrase
 * @property {'ascending-run' | 'descending-run' | 'arpeggiated' | 'mixed'} pattern - Pattern type for the phrase
 */

/**
 * TabDisplay component renders guitar tablature notation
 * Displays 6 horizontal lines representing guitar strings with fret numbers
 * Supports positioning between chord fretboards or as standalone display
 *
 * @param {Object} props
 * @param {TabPhrase} props.phrase - Single musical phrase to display
 * @param {string[]} props.tuning - Guitar tuning (high E to low E)
 * @param {'between-chords' | 'standalone'} props.position - Display positioning mode
 * @param {string} [props.title] - Optional title for the tab display
 */
const TabDisplay = ({
  phrase = null,
  tuning = ['E', 'B', 'G', 'D', 'A', 'E'],
  position = 'standalone',
  title = null,
}) => {
  const { theme } = useTheme();

  if (!phrase || !phrase.notes || phrase.notes.length === 0) {
    return (
      <div className={`tab-display tab-display--${position}`}>
        <div className="tab-placeholder">
          <p>No tablature to display. Generate phrases to see guitar tabs here.</p>
        </div>
      </div>
    );
  }

  // Get pattern description for display
  const getPatternDescription = (pattern) => {
    const descriptions = {
      'ascending-run': 'Ascending Run',
      'descending-run': 'Descending Run',
      'arpeggiated': 'Arpeggiated',
      'mixed': 'Mixed Pattern',
    };
    return descriptions[pattern] || 'Musical Phrase';
  };

  return (
    <div className={`tab-display tab-display--${position}`}>
      {/* Title display - different for each position mode */}
      {position === 'standalone' && <h6 className="tab-title">{title || 'Guitar Tablature'}</h6>}

      {position === 'between-chords' && (
        <div className="tab-connector">
          <div className="connector-line"></div>
          <span className="connector-label">
            {phrase.pattern ? getPatternDescription(phrase.pattern) : 'Connecting Phrase'}
          </span>
          <div className="connector-line"></div>
        </div>
      )}

      <div className="tab-phrase">
        {/* Chord name and pattern info */}
        <div className="phrase-header">
          <strong>{phrase.chordName}</strong>
          {phrase.pattern && position === 'standalone' && (
            <span className="pattern-info">({getPatternDescription(phrase.pattern)})</span>
          )}
        </div>

        <div className="tab-staff">
          {/* String labels (tuning) */}
          <div className="string-labels">
            {tuning.map((note, stringIndex) => (
              <div key={stringIndex} className="string-label">
                {note}
              </div>
            ))}
          </div>

          {/* Tab lines with fret numbers */}
          <div className="tab-lines">
            {tuning.map((note, stringIndex) => (
              <div key={stringIndex} className="tab-line">
                <div className="line-border"></div>
                <div className="fret-numbers">
                  {phrase.notes
                    .filter((tabNote) => tabNote.string === stringIndex)
                    .map((tabNote, noteIndex) => (
                      <span key={noteIndex} className="fret-number">
                        {tabNote.fret}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Creates placeholder tab data for testing component rendering
 * @returns {TabPhrase[]} Array of sample tab phrases
 */
export const createPlaceholderTabData = () => {
  return [
    {
      chordName: 'C Major',
      pattern: 'arpeggiated',
      notes: [
        { string: 0, fret: 0 }, // High E string, open
        { string: 1, fret: 1 }, // B string, 1st fret
        { string: 2, fret: 0 }, // G string, open
        { string: 3, fret: 2 }, // D string, 2nd fret
        { string: 4, fret: 3 }, // A string, 3rd fret
        { string: 5, fret: 0 }, // Low E string, open
      ],
    },
    {
      chordName: 'G Major',
      pattern: 'ascending-run',
      notes: [
        { string: 0, fret: 3 }, // High E string, 3rd fret
        { string: 1, fret: 0 }, // B string, open
        { string: 2, fret: 0 }, // G string, open
        { string: 3, fret: 0 }, // D string, open
        { string: 4, fret: 2 }, // A string, 2nd fret
        { string: 5, fret: 3 }, // Low E string, 3rd fret
      ],
    },
    {
      chordName: 'Am',
      pattern: 'descending-run',
      notes: [
        { string: 0, fret: 0 }, // High E string, open
        { string: 1, fret: 1 }, // B string, 1st fret
        { string: 2, fret: 2 }, // G string, 2nd fret
        { string: 3, fret: 2 }, // D string, 2nd fret
        { string: 4, fret: 0 }, // A string, open
        { string: 5, fret: 0 }, // Low E string, open
      ],
    },
    {
      chordName: 'F Major',
      pattern: 'mixed',
      notes: [
        { string: 0, fret: 1 }, // High E string, 1st fret
        { string: 1, fret: 1 }, // B string, 1st fret
        { string: 2, fret: 2 }, // G string, 2nd fret
        { string: 3, fret: 3 }, // D string, 3rd fret
        { string: 4, fret: 3 }, // A string, 3rd fret
        { string: 5, fret: 1 }, // Low E string, 1st fret
      ],
    },
  ];
};

export default TabDisplay;
/**
 * Creates a single placeholder tab phrase for testing
 * @param {string} chordName - Name of the chord
 * @param {'ascending-run' | 'descending-run' | 'arpeggiated' | 'mixed'} pattern - Pattern type
 * @returns {TabPhrase} Single tab phrase
 */
export const createSingleTabPhrase = (chordName = 'C Major', pattern = 'arpeggiated') => {
  const phrases = createPlaceholderTabData();
  const phrase = phrases.find((p) => p.chordName === chordName) || phrases[0];
  return {
    ...phrase,
    pattern,
  };
};
