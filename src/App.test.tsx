import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { savePuzzleProgress } from './adapters/browser/puzzle-storage'
import type { PuzzleStateSnapshot } from './domain/puzzle/evaluation-result'
import { createInitialState } from './domain/puzzle/puzzle-state'
import App from './App'

describe('App browser gameplay flow', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('TC-US-01-1 / US-01 AC-1 renders the initial puzzle state in the browser', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'River Crossing Puzzle' })).toBeInTheDocument()
    expect(screen.getByLabelText('Left bank')).toHaveTextContent('farmer')
    expect(screen.getByLabelText('Left bank')).toHaveTextContent('wolf')
    expect(screen.getByLabelText('Left bank')).toHaveTextContent('goat')
    expect(screen.getByLabelText('Left bank')).toHaveTextContent('cabbage')
    expect(screen.getByLabelText('Puzzle status')).toHaveTextContent('in progress')
  })

  it('TC-US-03-4 / US-03 AC-4 starts from the initial puzzle state when no saved progress exists', () => {
    render(<App />)

    expect(screen.getByLabelText('Left bank')).toHaveTextContent('farmer')
    expect(screen.getByLabelText('Left bank')).toHaveTextContent('wolf')
    expect(screen.getByLabelText('Left bank')).toHaveTextContent('goat')
    expect(screen.getByLabelText('Left bank')).toHaveTextContent('cabbage')

    const rightBank = screen.getByLabelText('Right bank')

    expect(within(rightBank).queryAllByRole('listitem')).toHaveLength(0)
  })

  it('TC-US-01-2 / US-01 AC-2 performs only legal transport actions based on the boat constraints', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /Farmer with goat/i }))
    await user.click(screen.getByRole('button', { name: /Farmer with wolf/i }))

    expect(screen.getByLabelText('Right bank')).toHaveTextContent('farmer')
    expect(screen.getByLabelText('Right bank')).toHaveTextContent('goat')
    expect(screen.getByLabelText('Right bank')).not.toHaveTextContent('wolf')
    expect(screen.getByText(/That move is invalid because the wolf is not on the same bank as the farmer/i)).toBeInTheDocument()

    const historySection = screen.getByRole('heading', { name: 'Successful moves' }).closest('section')

    expect(historySection).not.toBeNull()
    expect(within(historySection as HTMLElement).getAllByRole('listitem')).toHaveLength(1)
  })

  it('TC-US-01-3 / US-01 AC-3 updates the puzzle state and move history after a valid move', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /Farmer with goat/i }))

    expect(screen.getByLabelText('Left bank')).not.toHaveTextContent('goat')
    expect(screen.getByLabelText('Right bank')).toHaveTextContent('farmer')
    expect(screen.getByLabelText('Right bank')).toHaveTextContent('goat')
    expect(screen.getByText('Farmer crossed with goat from left to right')).toBeInTheDocument()
  })

  it('TC-US-03-1 / US-03 AC-1 saves the current puzzle state locally after each state change', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /Farmer with goat/i }))

    const raw = window.localStorage.getItem('river-crossing-puzzle.progress')

    expect(raw).not.toBeNull()

    const persisted = JSON.parse(raw as string) as {
      state: { rightBank: string[]; leftBank: string[] }
      savedAt: string
    }

    expect(persisted.state.rightBank).toEqual(['farmer', 'goat'])
    expect(persisted.state.leftBank).toEqual(['wolf', 'cabbage'])
    expect(typeof persisted.savedAt).toBe('string')
  })

  it('TC-US-03-2 / US-03 AC-2 saves move history locally after each move', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /Farmer with goat/i }))

    const raw = window.localStorage.getItem('river-crossing-puzzle.progress')
    const persisted = JSON.parse(raw as string) as {
      state: { moveHistory: Array<{ passenger: string }> }
    }

    expect(persisted.state.moveHistory).toHaveLength(1)
    expect(persisted.state.moveHistory[0]?.passenger).toBe('goat')
  })

  it('TC-US-02-1 / US-02 AC-1 explains an invalid move attempt in the browser', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /Farmer with goat/i }))
    await user.click(screen.getByRole('button', { name: /Farmer with wolf/i }))

    expect(screen.getByText(/That move is invalid because the wolf is not on the same bank as the farmer/i)).toBeInTheDocument()
    expect(screen.getByText('Farmer crossed with goat from left to right')).toBeInTheDocument()
  })

  it('TC-US-02-2 / US-02 AC-2 shows a failed state and explanation after a losing move', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /Farmer with wolf/i }))

    expect(screen.getByLabelText('Puzzle status')).toHaveTextContent('failed')
    expect(screen.getByText(/failure state/i)).toBeInTheDocument()
  })

  it('TC-US-02-4 / US-02 AC-4 does not reveal the next recommended move during normal gameplay', () => {
    render(<App />)

    expect(screen.queryByLabelText('Full solution')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Show solution' })).toBeInTheDocument()
  })

  it('TC-US-02-3 / US-02 AC-3 presents a complete valid solution path on explicit request', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Show solution' }))

    const solutionSection = screen.getByLabelText('Full solution')

    expect(solutionSection).toBeInTheDocument()
    expect(within(solutionSection).getAllByText(/Farmer takes goat from left to right/i)).toHaveLength(2)
    expect(within(solutionSection).getAllByRole('listitem')).toHaveLength(7)
  })

  it('TC-US-03-3 / US-03 AC-3 restores saved state and move history on reload', () => {
    const savedState = createInitialState()
    const afterMove: PuzzleStateSnapshot = {
      ...savedState,
      leftBank: ['wolf', 'cabbage'],
      rightBank: ['farmer', 'goat'],
      boatSide: 'right' as const,
      moveHistory: [
        {
          fromSide: 'left' as const,
          toSide: 'right' as const,
          passenger: 'goat' as const,
        },
      ],
      statusExplanation: 'Move applied: the farmer with the goat crosses the river.',
    }

    savePuzzleProgress(afterMove, '2026-03-31T18:44:00.000Z')

    render(<App />)

    expect(screen.getByLabelText('Right bank')).toHaveTextContent('farmer')
    expect(screen.getByLabelText('Right bank')).toHaveTextContent('goat')
    expect(screen.getByText('Farmer crossed with goat from left to right')).toBeInTheDocument()
  })

  it('TC-US-01-4 / US-01 AC-4 clearly communicates when the puzzle is solved', async () => {
    const user = userEvent.setup()
    render(<App />)

    const sequence = [
      /Farmer with goat/i,
      /Farmer alone/i,
      /Farmer with wolf/i,
      /Farmer with goat/i,
      /Farmer with cabbage/i,
      /Farmer alone/i,
      /Farmer with goat/i,
    ]

    for (const moveName of sequence) {
      await user.click(screen.getByRole('button', { name: moveName }))
    }

    expect(screen.getByLabelText('Puzzle status')).toHaveTextContent('solved')
    expect(screen.getByText(/Solved: all puzzle items reached the right bank safely/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Right bank')).toHaveTextContent('farmer')
    expect(screen.getByLabelText('Right bank')).toHaveTextContent('wolf')
    expect(screen.getByLabelText('Right bank')).toHaveTextContent('goat')
    expect(screen.getByLabelText('Right bank')).toHaveTextContent('cabbage')
  })
})