import { computed, Injectable, signal } from '@angular/core'
import type { Card, DeckStats } from './models'
import { type Grade, INITIAL_STATE, schedule } from './sm2'

const STORAGE_KEY = 'recall.deck.v1'

const SEED: Array<{ front: string; back: string }> = [
  { front: 'What does SM-2 compute from a review grade?', back: 'The next interval, the ease factor and the repetition count.' },
  { front: 'What grade counts as a lapse in SM-2?', back: 'A grade below 3, which resets the card to the start.' },
  { front: 'What is an Angular signal?', back: 'A reactive value that notifies consumers when it changes.' },
  { front: 'What does a computed() signal do?', back: 'Derives a value from other signals and recomputes lazily when they change.' },
]

/**
 * Holds the deck as a signal and persists it to localStorage. Reviewing a card runs it through the
 * SM-2 scheduler and updates its due date, so `due` always reflects what needs studying now.
 */
@Injectable({ providedIn: 'root' })
export class DeckService {
  private readonly _cards = signal<Card[]>(this.load())
  readonly cards = this._cards.asReadonly()

  /** Cards whose due date has passed (new cards are due immediately). */
  readonly due = computed(() => {
    const now = Date.now()
    return this._cards().filter((c) => new Date(c.dueAt).getTime() <= now)
  })

  readonly stats = computed<DeckStats>(() => ({
    total: this._cards().length,
    due: this.due().length,
    learned: this._cards().filter((c) => c.repetitions > 0).length,
  }))

  addCard(front: string, back: string): void {
    const card: Card = {
      id: crypto.randomUUID(),
      front: front.trim(),
      back: back.trim(),
      ...INITIAL_STATE,
      dueAt: new Date().toISOString(),
      lastReviewed: null,
    }
    this._cards.update((cards) => [...cards, card])
    this.persist()
  }

  review(id: string, grade: Grade, now: Date = new Date()): void {
    this._cards.update((cards) =>
      cards.map((card) => {
        if (card.id !== id) return card
        const next = schedule(card, grade, now)
        return {
          ...card,
          repetitions: next.repetitions,
          interval: next.interval,
          easeFactor: next.easeFactor,
          dueAt: next.dueAt.toISOString(),
          lastReviewed: now.toISOString(),
        }
      }),
    )
    this.persist()
  }

  remove(id: string): void {
    this._cards.update((cards) => cards.filter((c) => c.id !== id))
    this.persist()
  }

  resetProgress(): void {
    this._cards.update((cards) =>
      cards.map((card) => ({ ...card, ...INITIAL_STATE, dueAt: new Date().toISOString(), lastReviewed: null })),
    )
    this.persist()
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._cards()))
    } catch {
      // storage unavailable (private mode, etc.): the deck simply will not survive a reload
    }
  }

  private load(): Card[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw) as Card[]
    } catch {
      // fall through to the seeded deck
    }
    return SEED.map((s) => ({
      id: crypto.randomUUID(),
      front: s.front,
      back: s.back,
      ...INITIAL_STATE,
      dueAt: new Date().toISOString(),
      lastReviewed: null,
    }))
  }
}
