import type { MovePassenger } from '../domain/puzzle/move'

const moveLabels: Array<{ passenger: MovePassenger; label: string }> = [
  { passenger: 'none', label: 'Farmer alone' },
  { passenger: 'wolf', label: 'Farmer with wolf' },
  { passenger: 'goat', label: 'Farmer with goat' },
  { passenger: 'cabbage', label: 'Farmer with cabbage' },
]

interface PuzzleControlsProps {
  availableMoves: MovePassenger[]
  onMove: (passenger: MovePassenger) => void
}

export function PuzzleControls({ availableMoves, onMove }: PuzzleControlsProps) {
  return (
    <section className="controls-panel">
      <div className="controls-heading">
        <div>
          <h2>Choose a crossing</h2>
          <p className="controls-copy">
            Every move option stays visible. If the passenger is on the wrong bank, the engine will
            explain why the move is invalid.
          </p>
        </div>
      </div>

      <div className="move-grid" role="group" aria-label="Move options">
        {moveLabels.map(({ passenger, label }) => {
          const isCurrentlyAvailable = availableMoves.includes(passenger)

          return (
            <button
              key={passenger}
              className={isCurrentlyAvailable ? 'move-button move-button-legal' : 'move-button'}
              onClick={() => onMove(passenger)}
              type="button"
            >
              <span>{label}</span>
              <small>{isCurrentlyAvailable ? 'Available now' : 'Will be rejected if chosen'}</small>
            </button>
          )
        })}
      </div>
    </section>
  )
}