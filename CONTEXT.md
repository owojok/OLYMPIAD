# Session Context (CONTEXT.md)

This file tracks the current state, invariants, and architectural decisions of the project.

## Current Goal
Transform the plaintext file [Science_Olympiad_Event_Plan_2026.txt](file:///c:/Projects/olymipiad/Science_Olympiad_Event_Plan_2026.txt) into a highly-styled, interactive React TypeScript single-page application dashboard.

## Invariants (R19)
1. **Source Fidelity**: All event schedules, room allocations, budget items, and risk tables must map exactly to the source text file.
2. **Local Storage Integrity**: Checklists, school check-ins, judges profiles, and training state must persist and restore correctly between page reloads, and never allow corrupted values.
3. **No Silent State Failures**: Invalid user budget input or local storage access failures must fail gracefully with visible UI error/warning banners (R12).
4. **Roster Calculations**: School arrival percentage and judge presence metrics must compute dynamically from live checked-in arrays.

## Tech Stack & Styling (R4)
- **Framework**: Vite + React + TypeScript.
- **Styling**: Vanilla CSS with comprehensive CSS custom properties (design tokens) inside [index.css](file:///c:/Projects/olymipiad/src/index.css) to support Light/Dark theme switching and animations. No Tailwind CSS.

## Architecture (R2)
All components will reside in feature-specific directories under `src/features/`:
- `features/Dashboard/`: Home overview, stats, event state.
- `features/Schedule/`: Run of show timeline with filtering & search.
- `features/VenueMap/`: Interactive room status & allocations.
- `features/Volunteer/`: Shift assignments & training progress check-list.
- `features/Checklist/`: Persistent material checklists.
- `features/Budget/`: Interactive budget adjustment tool & Risk Matrix.
- `features/Schools/`: Schools accreditation status, check-in forms to log accompanying details (students list, teacher/chaperone name, email, and phone), search filters, and dashboard integration.
- `features/Judges/`: Judges roster portal with check-ins, inline edits, custom registrations, and events coverage.
- `features/Emergency/`: Visual security guidelines & interactive contact lists.
Each feature will export its public API via its own `index.ts`.
