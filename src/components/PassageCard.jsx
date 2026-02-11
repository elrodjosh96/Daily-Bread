export default function PassageCard({ reference, text, isLoading, error }) {
  return (
    <article className="passage-card">
      <header>
        <h2>{reference}</h2>
      </header>
      {isLoading && <p className="muted">Loading passage...</p>}
      {error && <p className="error">{error}</p>}
      {!isLoading && !error && <pre className="passage-text">{text}</pre>}
    </article>
  )
}
