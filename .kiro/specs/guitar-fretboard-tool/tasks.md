# Implementation Plan

- [x] 1. Enhance music theory engine with missing chord progressions

  - Add Spanish Romantic progression (i–VII–VI–V) to progressionFormulas array
  - Update progression generation logic to handle minor key progressions correctly
  - Write unit tests for new progression formula
  - _Requirements: 8.5_

- [x] 2. Implement theme system foundation

  - Create ThemeContext using React Context API
  - Add CSS custom properties for light and dark themes
  - Implement theme toggle functionality with localStorage persistence
  - Update existing components to use CSS custom properties
  - _Requirements: 10.1, 10.2, 10.4, 10.5_

- [x] 3. Apply dark mode styling to fretboard components

  - Update fretboard.css to use CSS custom properties for colors
  - Ensure chord and scale highlighting maintains proper contrast in dark mode
  - Test visual accessibility and contrast ratios for both themes
  - _Requirements: 10.3_

- [x] 4. Create reset functionality component

  - Add "Reset All" button to control panel
  - Implement resetToDefaults function that clears all selections
  - Reset tuning to standard, clear chord/scale selections, reset progression key to C
  - Write tests for reset functionality
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [-] 5. Redesign tab notation component structure for new positioning

  - Update TabDisplay component to support positioning between chord fretboards
  - Enhance TabNote and TabPhrase interfaces with pattern type support
  - Add monospace font styling for proper fret number alignment on string lines
  - Implement 'between-chords' and 'standalone' positioning modes
  - _Requirements: 11.4, 11.7, 11.8_

- [ ] 6. Rebuild musical phrase generation engine with new patterns

  - Update TabGenerator class with enhanced generatePhrase method
  - Add generateConnectingPhrase method for transitions between chords
  - Implement algorithm for 4-12 note phrases with specific musical patterns
  - Add support for ascending-run, descending-run, arpeggiated, and mixed patterns
  - _Requirements: 11.1, 11.2, 11.5, 11.6_

- [ ] 7. Implement tab positioning between chord displays

  - Create ProgressionDisplay component that alternates between chord fretboards and tab phrases
  - Modify layout to position TabDisplay components between consecutive chord fretboards
  - Update CSS styling to ensure proper spacing and visual flow between elements
  - Add connecting phrase generation that flows musically from one chord to the next
  - _Requirements: 11.3, 11.8_

- [ ] 7.1 Enhance tab generation with musical phrase patterns

  - Implement ascending-run pattern generator for scale-based melodic lines
  - Create descending-run pattern generator emphasizing chord tones
  - Add arpeggiated pattern generator for broken chord sequences
  - Develop mixed pattern algorithm combining scalar and arpeggiated elements
  - _Requirements: 11.6, 11.7_

- [ ] 7.2 Remove demo content and implement clean live interface

  - Remove any static demo content, placeholder text, or non-functional elements
  - Implement conditional rendering for all display components based on user selections
  - Ensure default state shows only neutral fretboards ready for user input
  - Add progressive disclosure for advanced features based on prerequisite selections
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [ ] 8. Integrate tab generation with chord progression system

  - Add "Generate Tabs" button to chord progression section
  - Connect tab generator to selected chord progression and scale
  - Implement automatic tab regeneration when chord progression or scale changes
  - Add state management for generated connecting phrases between chords
  - _Requirements: 11.1, 11.3_

- [ ] 9. Add comprehensive error handling and validation

  - Implement input validation for tuning selections
  - Add error boundaries for music theory calculation failures
  - Create user-friendly error messages for invalid inputs
  - Add graceful fallbacks when tab generation fails
  - _Requirements: All requirements - error handling_

- [ ] 10. Enhance accessibility features

  - Add ARIA labels to all fretboard positions and interactive controls
  - Implement keyboard navigation for all UI elements
  - Add live regions to announce chord and scale changes
  - Ensure proper heading hierarchy and semantic HTML structure
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 11. Optimize performance and add memoization

  - Add React.useMemo to chord and scale generation functions
  - Implement debouncing for rapid user input changes
  - Optimize fretboard re-rendering with React.memo
  - Add lazy loading for tab generation to improve initial load time
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 12. Create comprehensive test suite

  - Write unit tests for music theory engine (chord/scale generation)
  - Add integration tests for component interactions
  - Test theme switching and persistence functionality
  - Create tests for tab generation with various chord/scale combinations
  - Test musical phrase pattern generation and positioning between chords
  - _Requirements: All requirements - testing coverage_

- [ ] 13. Implement responsive design improvements
  - Ensure tab notation displays properly on mobile devices with monospace fonts
  - Add responsive breakpoints for control panel layout
  - Test and optimize horizontal scrolling for fretboards on small screens
  - Verify theme toggle accessibility on touch devices
  - Ensure proper spacing for tab phrases positioned between chord displays
  - _Requirements: 7.1, 7.2, 7.3, 7.4_
