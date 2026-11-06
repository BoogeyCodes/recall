# Changelog

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- `isDue(dueAt, now?)` — whether a scheduled card is due.
- `previewIntervals(state, now?)` — the interval each grade would produce next, for
  labelling the answer buttons without committing the review.

## [0.1.0]

### Added
- SM-2 spaced-repetition scheduler; signal-based deck service with localStorage.
