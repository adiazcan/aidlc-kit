import type { PuzzleSolutionStep } from '../services/puzzle-solution'

interface PuzzleSolutionProps {
  steps: PuzzleSolutionStep[]
}

export function PuzzleSolution({ steps }: PuzzleSolutionProps) {
  return (
    <section className="solution-panel" aria-label="Full solution">
      <h2>Full solution path</h2>
      <p className="solution-copy">
        The complete valid sequence stays hidden during normal play and only appears after you ask
        to see it.
      </p>
      <ol>
        {steps.map((step, index) => (
          <li key={`${index}-${step.label}`}>{step.label}</li>
        ))}
      </ol>
    </section>
  )
}