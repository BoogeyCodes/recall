import type { SchedulingState } from './sm2'

export interface Card extends SchedulingState {
  id: string
  front: string
  back: string
  dueAt: string // ISO timestamp
  lastReviewed: string | null
}

export interface DeckStats {
  total: number
  due: number
  learned: number
}
