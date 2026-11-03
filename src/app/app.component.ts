import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { AddCardComponent } from './add-card.component'
import { DeckService } from './deck.service'
import { ReviewComponent } from './review.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReviewComponent, AddCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="app">
      <header>
        <h1>Recall</h1>
        <p class="muted">Spaced-repetition flashcards. Review what's due; the SM-2 algorithm decides when each card returns.</p>
      </header>

      <section class="stats" aria-label="Deck statistics">
        <div class="stat"><span class="stat__value">{{ deck.stats().due }}</span><span class="stat__label">Due now</span></div>
        <div class="stat"><span class="stat__value">{{ deck.stats().learned }}</span><span class="stat__label">Learned</span></div>
        <div class="stat"><span class="stat__value">{{ deck.stats().total }}</span><span class="stat__label">Total cards</span></div>
      </section>

      <app-review />
      <app-add-card />

      <footer>
        <button type="button" class="reset" (click)="deck.resetProgress()">Reset all progress</button>
      </footer>
    </main>
  `,
  styles: [
    `
      .app { max-width: 680px; margin: 0 auto; padding: 32px 16px 64px; display: flex; flex-direction: column; gap: 18px; }
      h1 { margin: 0 0 4px; font-size: 26px; }
      header p { margin: 0; max-width: 60ch; }
      .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
      .stat { background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; display: flex; flex-direction: column; }
      .stat__value { font-size: 26px; font-weight: 700; line-height: 1; }
      .stat__label { font-size: 12px; color: var(--muted); margin-top: 4px; }
      footer { margin-top: 8px; }
      .reset { background: none; border: 1px solid var(--border); color: var(--muted); border-radius: 8px; padding: 7px 12px; font: inherit; cursor: pointer; }
      .reset:hover { color: var(--fg); }
    `,
  ],
})
export class AppComponent {
  readonly deck = inject(DeckService)
}
