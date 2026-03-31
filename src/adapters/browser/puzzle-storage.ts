import type { PuzzleStateSnapshot } from '../../domain/puzzle/evaluation-result'

const STORAGE_KEY = 'river-crossing-puzzle.progress'

export interface PersistedPuzzleSnapshot {
  state: PuzzleStateSnapshot
  savedAt: string
}

export function savePuzzleProgress(
  state: PuzzleStateSnapshot,
  savedAt: string = new Date().toISOString(),
) {
  const payload: PersistedPuzzleSnapshot = {
    state,
    savedAt,
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function loadPuzzleProgress(): PersistedPuzzleSnapshot | null {
  const raw = window.localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw)
    return isPersistedPuzzleSnapshot(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function clearPuzzleProgress() {
  window.localStorage.removeItem(STORAGE_KEY)
}

function isPersistedPuzzleSnapshot(value: unknown): value is PersistedPuzzleSnapshot {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>
  const state = candidate.state as Record<string, unknown> | undefined

  if (!state || typeof candidate.savedAt !== 'string') {
    return false
  }

  return (
    Array.isArray(state.leftBank) &&
    Array.isArray(state.rightBank) &&
    (state.boatSide === 'left' || state.boatSide === 'right') &&
    Array.isArray(state.moveHistory) &&
    (state.status === 'in_progress' || state.status === 'failed' || state.status === 'solved') &&
    typeof state.statusExplanation === 'string'
  )
}