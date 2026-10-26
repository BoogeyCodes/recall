import { INITIAL_STATE, schedule } from './sm2'

describe('schedule (SM-2)', () => {
  const now = new Date('2026-01-01T00:00:00Z')
  const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / (24 * 60 * 60 * 1000))

  it('schedules a new card one day out on the first good grade', () => {
    const result = schedule(INITIAL_STATE, 5, now)
    expect(result.repetitions).toBe(1)
    expect(result.interval).toBe(1)
    expect(result.easeFactor).toBeCloseTo(2.6, 5) // grade 5 raises ease by 0.1
    expect(daysBetween(now, result.dueAt)).toBe(1)
  })

  it('uses the 1, 6, then interval*ease progression', () => {
    const first = schedule(INITIAL_STATE, 4, now)
    expect(first.interval).toBe(1)
    const second = schedule(first, 4, now)
    expect(second.interval).toBe(6)
    const third = schedule(second, 4, now)
    // ease stays 2.5 for grade 4, so 6 * 2.5 = 15
    expect(third.interval).toBe(15)
  })

  it('keeps the ease factor unchanged for a grade of 4', () => {
    const result = schedule(INITIAL_STATE, 4, now)
    expect(result.easeFactor).toBeCloseTo(2.5, 5)
  })

  it('resets repetitions and interval on a lapse', () => {
    const learned = { repetitions: 5, interval: 40, easeFactor: 2.5 }
    const lapsed = schedule(learned, 2, now)
    expect(lapsed.repetitions).toBe(0)
    expect(lapsed.interval).toBe(1)
    expect(lapsed.easeFactor).toBeLessThan(2.5) // a lapse still lowers ease
  })

  it('never lets the ease factor drop below 1.3', () => {
    let state = INITIAL_STATE
    for (let i = 0; i < 20; i++) {
      state = schedule(state, 0, now)
    }
    expect(state.easeFactor).toBe(1.3)
  })

  it('spaces an easy card out faster than a hard one over time', () => {
    const easy = schedule(schedule(schedule(INITIAL_STATE, 5, now), 5, now), 5, now)
    const hard = schedule(schedule(schedule(INITIAL_STATE, 3, now), 3, now), 3, now)
    expect(easy.interval).toBeGreaterThan(hard.interval)
  })
})
