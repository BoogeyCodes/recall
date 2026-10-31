import { TestBed } from '@angular/core/testing'
import { AppComponent } from './app.component'

describe('AppComponent', () => {
  beforeEach(async () => {
    localStorage.clear()
    await TestBed.configureTestingModule({ imports: [AppComponent] }).compileComponents()
  })

  it('creates the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    expect(fixture.componentInstance).toBeTruthy()
  })

  it('renders the title and the due statistic', () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const text = (fixture.nativeElement as HTMLElement).textContent ?? ''
    expect(text).toContain('Recall')
    expect(text).toContain('Due now')
  })
})
