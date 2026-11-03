/**
 * The SM-2 spaced-repetition algorithm (SuperMemo 2).
 *
 * After each review the learner grades their recall from 0 (no idea) to 5 (perfect). From that grade
 * and the card's history, SM-2 produces the next interval, an updated "ease factor" that stretches or
 * compresses future intervals, and a repetition count. Cards you know well come back less and less
 * often; a lapse (grade < 3) sends a card back to the start.
 */

export type Grade = 0 | 1 | 2 | 3 | 4 | 5

export interface SchedulingState {
  /** Successful reviews in a row. */
  repetitions: number
  /** Days until the next review. */
  interval: number
  /** Multiplier applied to the interval; never below 1.3. */
  easeFactor: number
}

export interface Scheduled extends SchedulingState {
  dueAt: Date
}

export const INITIAL_STATE: SchedulingState = {
  repetitions: 0,
  interval: 0,
  easeFactor: 2.5,
}

const DAY_MS = 24 * 60 * 60 * 1000
const MIN_EASE = 1.3

/** Compute the next scheduling state for a card given the grade and the current time. */
export function schedule(state: SchedulingState, grade: Grade, now: Date = new Date()): Scheduled {
  // The ease factor is adjusted on every review, up for easy recalls and down for hard ones.
  const delta = 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)
  const easeFactor = Math.max(MIN_EASE, state.easeFactor + delta)

  let repetitions: number
  let interval: number

  if (grade < 3) {
    // A lapse: relearn from the beginning, but keep the (now lowered) ease factor.
    repetitions = 0
    interval = 1
  } else {
    repetitions = state.repetitions + 1
    if (repetitions === 1) {
      interval = 1
    } else if (repetitions === 2) {
      interval = 6
    } else {
      interval = Math.round(state.interval * easeFactor)
    }
  }

  return {
    repetitions,
    interval,
    easeFactor,
    dueAt: new Date(now.getTime() + interval * DAY_MS),
  }
}

/** Whether a scheduled card is due for review at `now`. */
export function isDue(dueAt: Date, now: Date = new Date()): boolean {
  return dueAt.getTime() <= now.getTime()
}

/**
 * The interval (in days) each grade would produce next, without committing the change — handy for
 * labelling the answer buttons so the learner can see what "Again", "Good", "Easy" will do.
 */
export function previewIntervals(state: SchedulingState, now: Date = new Date()): Record<Grade, number> {
  const out = {} as Record<Grade, number>
  for (const grade of [0, 1, 2, 3, 4, 5] as Grade[]) {
    out[grade] = schedule(state, grade, now).interval
  }
  return out
}
