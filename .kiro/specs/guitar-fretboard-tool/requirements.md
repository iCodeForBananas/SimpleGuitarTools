# Requirements Document

## Introduction

The Guitar Fretboard Tool is a web-based application designed to help guitarists visualize chords, scales, and chord progressions on an interactive fretboard. The application provides a comprehensive learning platform for musicians to understand music theory concepts, practice chord progressions, and explore different tunings and scales on the guitar fretboard.

## Requirements

### Requirement 1: Chord Visualization

**User Story:** As a guitarist, I want to visualize chords on a fretboard, so that I can learn chord shapes and finger positions.

#### Acceptance Criteria

1. WHEN a user selects a chord from the dropdown THEN the system SHALL highlight all chord notes on the fretboard with a distinct color
2. WHEN a user views the chord dropdown THEN the system SHALL display chord names with their constituent notes in brackets
3. WHEN chord notes are displayed on the fretboard THEN the system SHALL use bold text and yellow highlighting to distinguish chord tones
4. IF no chord is selected THEN the system SHALL display a neutral fretboard with note names only

### Requirement 2: Scale Visualization

**User Story:** As a music student, I want to visualize scales on the fretboard, so that I can practice scale patterns and understand scale relationships.

#### Acceptance Criteria

1. WHEN a user selects a scale from the dropdown THEN the system SHALL highlight all scale notes on the fretboard with blue background color
2. WHEN a user views the scale dropdown THEN the system SHALL display scale names with their constituent notes in brackets
3. WHEN both chord and scale are selected THEN the system SHALL display chord notes with yellow highlighting and scale notes with blue highlighting
4. WHEN scale notes overlap with chord notes THEN the system SHALL prioritize chord note highlighting (yellow over blue)

### Requirement 3: Custom Tuning

**User Story:** As a guitarist, I want to customize guitar tuning, so that I can practice with different tuning configurations.

#### Acceptance Criteria

1. WHEN a user clicks on a tuning selector THEN the system SHALL display a dropdown with all 12 chromatic notes
2. WHEN a user changes a string tuning THEN the system SHALL immediately update all fretboard displays to reflect the new tuning
3. WHEN a user clicks "Reset Tuning" THEN the system SHALL restore standard tuning (E-A-D-G-B-E from low to high)
4. WHEN the application loads THEN the system SHALL default to standard guitar tuning

### Requirement 4: Chord Progressions

**User Story:** As a songwriter, I want to generate and visualize chord progressions, so that I can explore different harmonic patterns for my compositions.

#### Acceptance Criteria

1. WHEN a user selects a key from the progression key dropdown THEN the system SHALL update the available progression formulas for that key
2. WHEN a user selects a progression formula THEN the system SHALL display the pattern description (e.g., "Folk: I – V – vi – IV")
3. WHEN a user clicks "Generate Random Progression" THEN the system SHALL populate four chord slots based on the selected key and formula
4. WHEN chord progression is generated THEN the system SHALL create separate fretboard displays for each chord in the progression
5. WHEN a user manually selects chords in progression slots THEN the system SHALL update the corresponding fretboard displays

### Requirement 5: Multiple Fretboard Views

**User Story:** As a guitar teacher, I want to see multiple fretboard views simultaneously, so that I can demonstrate chord progressions and relationships between chords.

#### Acceptance Criteria

1. WHEN chord progression is active THEN the system SHALL display a main preview fretboard plus individual fretboards for each progression chord
2. WHEN displaying multiple fretboards THEN the system SHALL label each fretboard clearly (e.g., "Preview", "Chord 1", "Chord 2")
3. WHEN tuning is changed THEN the system SHALL update all fretboard displays consistently
4. WHEN scale is selected THEN the system SHALL apply scale highlighting to all fretboard displays

### Requirement 6: Fretboard Navigation

**User Story:** As a guitarist, I want to see fret numbers and note names clearly, so that I can identify specific positions on the fretboard.

#### Acceptance Criteria

1. WHEN fretboard is displayed THEN the system SHALL show fret numbers (0-12) above each fret position
2. WHEN fretboard is displayed THEN the system SHALL show note names in each fret position for all six strings
3. WHEN displaying open strings (fret 0) THEN the system SHALL use bold text and gray background to distinguish open notes
4. WHEN fretboard extends beyond viewport THEN the system SHALL provide horizontal scrolling to view all frets

### Requirement 7: Responsive Design

**User Story:** As a user, I want the application to be responsive and visually appealing, so that I can use it effectively on different devices.

#### Acceptance Criteria

1. WHEN the application loads THEN the system SHALL use Bootstrap styling for consistent UI components
2. WHEN fretboard is too wide for viewport THEN the system SHALL provide horizontal scrolling with minimum width of 800px
3. WHEN controls are displayed THEN the system SHALL organize them in a three-column layout for easy access
4. WHEN multiple fretboards are shown THEN the system SHALL maintain consistent spacing and alignment

### Requirement 8: Music Theory Libraries

**User Story:** As a music theory student, I want access to comprehensive chord and scale libraries, so that I can explore various musical concepts.

#### Acceptance Criteria

1. WHEN chord library is accessed THEN the system SHALL provide Major, Minor, Maj7, 7th, m7, Sus4, and Add9 chords for all 12 chromatic roots
2. WHEN scale library is accessed THEN the system SHALL provide Major, Minor, Pentatonic Major, Pentatonic Minor, Phrygian, Phrygian Dominant, Blues, Harmonic Minor, and Melodic Minor scales for all 12 chromatic roots
3. WHEN chord or scale is selected THEN the system SHALL calculate note positions using proper music theory intervals
4. WHEN progression formulas are accessed THEN the system SHALL provide at least 10 different progression patterns including Folk, Pop, Sad Pop, Indie, Cinematic, Classic Rock, Melancholy Minor, Dramatic Minor, Spanish, and Spanish Romantic progressions
5. WHEN Spanish Romantic progression (i–VII–VI–V) is selected THEN the system SHALL generate the appropriate minor key chord sequence

### Requirement 9: Reset Functionality

**User Story:** As a user, I want to reset all inputs back to their default state, so that I can start over with a clean slate when exploring different musical concepts.

#### Acceptance Criteria

1. WHEN a user activates a "reset all" function THEN the system SHALL clear all selected chords and scales
2. WHEN a user activates a "reset all" function THEN the system SHALL reset tuning to standard guitar tuning (E-A-D-G-B-E)
3. WHEN a user activates a "reset all" function THEN the system SHALL clear all chord progression selections
4. WHEN a user activates a "reset all" function THEN the system SHALL reset progression key to a default value (C)
5. WHEN reset is complete THEN the system SHALL display only neutral fretboards with note names and no highlighting

### Requirement 10: Dark Mode Support

**User Story:** As a user, I want to toggle between light and dark mode themes, so that I can use the application comfortably in different lighting conditions.

#### Acceptance Criteria

1. WHEN a user toggles to dark mode THEN the system SHALL apply dark background colors and light text throughout the interface
2. WHEN a user toggles to light mode THEN the system SHALL apply light background colors and dark text throughout the interface
3. WHEN dark mode is active THEN the system SHALL maintain chord and scale highlighting visibility with appropriate contrast
4. WHEN theme is changed THEN the system SHALL persist the user's theme preference for future sessions
5. WHEN the application loads THEN the system SHALL default to the user's previously selected theme or light mode if no preference exists

### Requirement 11: Musical Phrase Generation

**User Story:** As a guitarist, I want to generate small musical phrases as guitar tabs based on the selected scale and chord progression, so that I can practice improvisation and learn melodic patterns over chord changes.

#### Acceptance Criteria

1. WHEN a chord progression and scale are selected THEN the system SHALL provide an option to generate musical phrases for each chord
2. WHEN musical phrase generation is triggered THEN the system SHALL create short melodic patterns (4-8 notes) that fit the selected scale and emphasize chord tones
3. WHEN musical phrases are generated THEN the system SHALL display them in standard guitar tablature format showing fret numbers on string lines
4. WHEN displaying guitar tabs THEN the system SHALL use proper tab notation with six horizontal lines representing guitar strings (high E to low E)
5. WHEN multiple chords are in progression THEN the system SHALL generate complementary phrases that flow musically between chord changes
6. WHEN phrases are generated THEN the system SHALL prioritize notes within easy reach (same fretboard position) for playability
