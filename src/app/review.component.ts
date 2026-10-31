import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'
import { DeckService } from './deck.service'
import type { Grade } from './sm2'

interface GradeButton {
  label: string
  grade: Grade
  tone: string
}

@Component({
  selector: 'app-review',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (current(); as card) {
      <section class="card" aria-live="polite">
        <p class="card__prompt">{{ card.front }}</p>

        @if (revealed()) {
          <hr />
          <p class="card__answer">{{ card.back }}</p>
          <div class="grades">
            @for (button of grades; track button.grade) {
              <button type="button" [class]="'grade grade--' + button.tone" (click)="grade(card.id, button.grade)">
                {{ button.label }}
              </button>
            }
          </div>
        } @else {
          <button type="button" class="reveal" (click)="revealed.set(true)">Show answer</button>
        }
      </section>
    } @else {
      <section class="card card--done">
        <p>🎉 All caught up. Nothing due right now.</p>
      </section>
    }
  `,
  styles: [
    `
      .card {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 28px 24px;
        min-height: 180px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .card--done { align-items: center; justify-content: center; text-align: center; color: var(--muted); }
      .card__prompt { font-size: 20px; font-weight: 600; margin: 0; }
      .card__answer { font-size: 17px; margin: 0; color: var(--fg); }
      hr { border: none; border-top: 1px solid var(--border); margin: 0; }
      .reveal {
        align-self: flex-start; margin-top: auto; background: var(--accent); color: #fff;
        border: none; border-radius: 8px; padding: 10px 18px; font: inherit; cursor: pointer;
      }
      .grades { display: flex; gap: 8px; flex-wrap: wrap; margin-top: auto; }
      .grade { border: 1px solid var(--border); border-radius: 8px; padding: 9px 16px; font: inherit; cursor: pointer; color: var(--fg); background: var(--panel-2); }
      .grade--again { border-color: #ef4444; color: #fca5a5; }
      .grade--hard { border-color: #f59e0b; color: #fcd34d; }
      .grade--good { border-color: #3b82f6; color: #93c5fd; }
      .grade--easy { border-color: #22c55e; color: #86efac; }
    `,
  ],
})
export class ReviewComponent {
  private readonly deck = inject(DeckService)

  readonly revealed = signal(false)
  readonly current = computed(() => this.deck.due()[0] ?? null)

  readonly grades: GradeButton[] = [
    { label: 'Again', grade: 1, tone: 'again' },
    { label: 'Hard', grade: 3, tone: 'hard' },
    { label: 'Good', grade: 4, tone: 'good' },
    { label: 'Easy', grade: 5, tone: 'easy' },
  ]

  grade(id: string, grade: Grade): void {
    this.deck.review(id, grade)
    this.revealed.set(false)
  }
}
