import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DeckService } from './deck.service'

@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="add" (ngSubmit)="submit()">
      <h2>Add a card</h2>
      <label>
        <span>Front (question)</span>
        <input name="front" [(ngModel)]="front" autocomplete="off" />
      </label>
      <label>
        <span>Back (answer)</span>
        <textarea name="back" [(ngModel)]="back" rows="2"></textarea>
      </label>
      <button type="submit" [disabled]="!canSubmit()">Add card</button>
    </form>
  `,
  styles: [
    `
      .add {
        background: var(--panel); border: 1px solid var(--border); border-radius: 12px;
        padding: 18px 20px; display: flex; flex-direction: column; gap: 12px;
      }
      h2 { margin: 0; font-size: 15px; }
      label { display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--muted); }
      input, textarea {
        background: var(--panel-2); color: var(--fg); border: 1px solid var(--border);
        border-radius: 8px; padding: 9px 11px; font: inherit; resize: vertical;
      }
      button {
        align-self: flex-start; background: var(--accent); color: #fff; border: none;
        border-radius: 8px; padding: 9px 16px; font: inherit; cursor: pointer;
      }
      button:disabled { opacity: 0.5; cursor: default; }
    `,
  ],
})
export class AddCardComponent {
  private readonly deck = inject(DeckService)

  front = ''
  back = ''
  private readonly _ = signal(0) // keeps OnPush honest if needed elsewhere

  canSubmit(): boolean {
    return this.front.trim().length > 0 && this.back.trim().length > 0
  }

  submit(): void {
    if (!this.canSubmit()) return
    this.deck.addCard(this.front, this.back)
    this.front = ''
    this.back = ''
  }
}
