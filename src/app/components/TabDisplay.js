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
 */

/**
 * TabDisplay component renders guitar tablature notation
 * Displays 6 horizontal lines representing guitar strings with fret numbers
 *
 * @param {Object} props
 * @param {TabPhrase[]} props.phrases - Array of musical phrases to display
 * @param {string[]} props.tuning - Guitar tuning (high E to low E)
 */
const TabDisplay = ({ phrases = [], tuning = ['E', 'B', 'G', 'D', 'A', 'E'] }) => {
  const { theme } = useTheme();
  if (!phrases || phrases.length === 0) {
    return (
      <div className="tab-display">
        <div className="tab-placeholder">
          <p>No tablature to display. Generate phrases to see guitar tabs here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-display">
      <h6 className="tab-title">Guitar Tablature</h6>

      {phrases.map((phrase, phraseIndex) => (
        <div key={phraseIndex} className="tab-phrase">
          <div className="phrase-header">
            <strong>{phrase.chordName}</strong>
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
      ))}
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
