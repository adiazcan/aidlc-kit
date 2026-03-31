interface PuzzleStatusProps {
  statusLabel: string
  boatSide: string
  message: string
}

export function PuzzleStatus({ statusLabel, boatSide, message }: PuzzleStatusProps) {
  return (
    <section className="status-panel" aria-live="polite" aria-label="Puzzle status">
      <p>
        <strong>Status:</strong> {statusLabel}
      </p>
      <p>
        <strong>Boat side:</strong> {boatSide}
      </p>
      <p>
        <strong>Explanation:</strong> {message}
      </p>
    </section>
  )
}