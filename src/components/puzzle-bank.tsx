interface PuzzleBankProps {
  title: string
  items: string[]
}

export function PuzzleBank({ title, items }: PuzzleBankProps) {
  return (
    <section className="bank-card" aria-label={title}>
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}