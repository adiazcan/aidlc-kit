interface PuzzleHistoryProps {
  entries: string[]
}

export function PuzzleHistory({ entries }: PuzzleHistoryProps) {
  return (
    <section className="history-panel">
      <h2>Successful moves</h2>
      <ol>
        {entries.length === 0 ? <li>No moves yet</li> : null}
        {entries.map((entry, index) => (
          <li key={`${index}-${entry}`}>{entry}</li>
        ))}
      </ol>
    </section>
  )
}