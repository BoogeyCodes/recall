import { TestBed } from '@angular/core/testing'
import { DeckService } from './deck.service'

describe('DeckService', () => {
  let service: DeckService

  beforeEach(() => {
    localStorage.clear()
    TestBed.configureTestingModule({})
    service = TestBed.inject(DeckService)
  })

  it('seeds a deck when storage is empty', () => {
    expect(service.cards().length).toBeGreaterThan(0)
    // Freshly seeded cards have never been reviewed, so all are due.
    expect(service.stats().due).toBe(service.stats().total)
    expect(service.stats().learned).toBe(0)
  })

  it('adds a card and persists it', () => {
    const before = service.cards().length
    service.addCard('front', 'back')
    expect(service.cards().length).toBe(before + 1)
    expect(localStorage.getItem('recall.deck.v1')).toContain('front')
  })

  it('removes a card from the due set after a good review', () => {
    const card = service.due()[0]
    const dueBefore = service.stats().due
    service.review(card.id, 5)
    expect(service.stats().due).toBe(dueBefore - 1)
    expect(service.stats().learned).toBe(1)
  })

  it('keeps a lapsed card due', () => {
    const card = service.due()[0]
    service.review(card.id, 1) // grade < 3 reschedules one day out
    const updated = service.cards().find((c) => c.id === card.id)!
    expect(updated.repetitions).toBe(0)
  })

  it('resets progress for every card', () => {
    service.cards().forEach((c) => service.review(c.id, 5))
    expect(service.stats().due).toBe(0)
    service.resetProgress()
    expect(service.stats().due).toBe(service.stats().total)
    expect(service.stats().learned).toBe(0)
  })
})
