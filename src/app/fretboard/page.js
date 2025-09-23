'use client';

import GuitarFretboard from '../components/GuitarFretboard';
import TabDisplay, { createPlaceholderTabData } from '../components/TabDisplay';

export default function FretboardPage() {
  // Create placeholder tab data for testing
  const placeholderTabs = createPlaceholderTabData();

  return (
    <main>
      <GuitarFretboard />

      {/* Tab Display Demo Section */}
      <div className="container-fluid p-4">
        <h4>Tab Notation Demo</h4>
        <p className="text-muted mb-4">
          This demonstrates the TabDisplay component with placeholder chord data. Each chord shows the fret positions on
          all six strings.
        </p>

        <TabDisplay phrases={placeholderTabs} tuning={['E', 'B', 'G', 'D', 'A', 'E']} theme="light" />

        <h5 className="mt-4">Dark Theme Example</h5>
        <TabDisplay phrases={placeholderTabs.slice(0, 2)} tuning={['E', 'B', 'G', 'D', 'A', 'E']} theme="dark" />

        <h5 className="mt-4">Empty State Example</h5>
        <TabDisplay phrases={[]} tuning={['E', 'B', 'G', 'D', 'A', 'E']} theme="light" />
      </div>
    </main>
  );
}
