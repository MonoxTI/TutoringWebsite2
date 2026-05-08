export default function Footer() {
  return (
    <footer style={{
      background: "linear-gradient(90deg, #000 0%, #0a1628 50%, #1d4ed8 100%)",
      color: "#fff",
      borderTop: "2px solid rgba(255,255,255,0.2)",
      padding: "1.5rem clamp(1rem,4vw,3rem)",
      fontFamily: "'Barlow', sans-serif",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <p style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900, fontSize: "1.1rem",
          letterSpacing: "0.05em", marginBottom: "0.75rem",
        }}>
          ASSEMBLED<span style={{ color: "#3b82f6" }}>.</span> TUTORING
        </p>
        <div style={{
          display: "flex", flexWrap: "wrap",
          justifyContent: "center", gap: "1.5rem",
          fontSize: "0.85rem", color: "rgba(255,255,255,0.6)",
        }}>
          <span>assembledtutoring@gmail.com</span>
          <span>084 727 7408</span>
          <span>Montana Tuine, Pretoria, 0182</span>
        </div>
        <p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>
          © {new Date().getFullYear()} Assembled Tutoring. All rights reserved.
        </p>
      </div>
    </footer>
  )
}