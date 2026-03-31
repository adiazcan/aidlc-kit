import { PuzzleBank } from './components/puzzle-bank'
import { PuzzleControls } from './components/puzzle-controls'
import { PuzzleHistory } from './components/puzzle-history'
import { PuzzleSolution } from './components/puzzle-solution'
import { PuzzleStatus } from './components/puzzle-status'
import { usePuzzleGame } from './hooks/use-puzzle-game'

export default function App() {
  const { viewModel, applyMove, isSolutionVisible, showSolution, solutionSteps } = usePuzzleGame()

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">Bolt 3 Persistence and Solution Flow</p>
        <h1>River Crossing Puzzle</h1>
        <p className="summary">
          Resume local progress automatically, keep exploring the puzzle in the browser, and reveal
          the full valid solution only when you explicitly ask for it.
        </p>
      </header>

      <PuzzleStatus
        statusLabel={viewModel.statusLabel}
        boatSide={viewModel.boatSide}
        message={viewModel.message}
      />

      <section className="banks-grid">
        <PuzzleBank title="Left bank" items={viewModel.leftBank} />
        <PuzzleBank title="Right bank" items={viewModel.rightBank} />
      </section>

      <PuzzleControls availableMoves={viewModel.availableMoves} onMove={applyMove} />

      <section className="solution-cta-panel">
        <div>
          <h2>Need the full solution?</h2>
          <p className="solution-copy">
            Normal gameplay keeps the next move hidden. Use this only when you want to reveal the
            entire valid sequence.
          </p>
        </div>
        <button className="secondary-button" onClick={showSolution} type="button">
          Show solution
        </button>
      </section>

      {isSolutionVisible ? <PuzzleSolution steps={solutionSteps} /> : null}

      <PuzzleHistory entries={viewModel.moveHistory} />
    </main>
  )
}