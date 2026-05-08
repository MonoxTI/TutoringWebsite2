"use client"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Link from "next/link"

const PRICING = [
  { grade: "GRADE 4–7",   monthly: "R1 500", perLesson: "R500" },
  { grade: "GRADE 8–9",   monthly: "R1 800", perLesson: "R600" },
  { grade: "GRADE 10",    monthly: "R2 000", perLesson: "R650" },
  { grade: "GRADE 11–12", monthly: "R2 300", perLesson: "R700" },
]

export default function ServicesPage() {
  return (
    <>
      <Navbar />

      {/* Header */}
      <section style={{
        background: "linear-gradient(135deg, #000 0%, #0a1628 40%, #1d4ed8 100%)",
        color: "#fff",
        padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem) 4rem",
        position: "relative", overflow: "hidden",
      }}>
        {/* Logo watermark */}
        <div style={{
          position: "absolute", right: "clamp(1rem,5vw,4rem)",
          top: "50%", transform: "translateY(-50%)",
          opacity: 0.07, pointerEvents: "none",
        }}>
          <img
            src="/images/logo.png"
            alt=""
            style={{ height: "clamp(200px,35vw,500px)", width: "auto" }}
          />
        </div>

        <div style={{ maxWidth: 700, position: "relative", zIndex: 1 }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700, fontSize: "0.72rem",
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "#60a5fa", marginBottom: "0.75rem",
          }}>
            What We Offer
          </div>
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(2.5rem,7vw,5.5rem)",
            lineHeight: 0.95, textTransform: "uppercase",
            marginBottom: "1rem",
          }}>
            SERVICES &
          </h1>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic", fontWeight: 400,
            fontSize: "clamp(2rem,5vw,4rem)",
            color: "rgba(255,255,255,0.8)",
            marginBottom: "1.5rem",
          }}>
            Pricing
          </p>
          <p style={{
            fontSize: "clamp(0.95rem,1.5vw,1.05rem)",
            color: "rgba(255,255,255,0.6)", lineHeight: 1.7,
            maxWidth: 520,
          }}>
            Monthly subscriptions include 2 hours per week — 4 sessions per month.
            Once-off lessons are also available at the rates below.
          </p>
        </div>
      </section>

      {/* Pricing table */}
      <section style={{
        background: "linear-gradient(180deg, #0a1628 0%, #0d1f3c 100%)",
        color: "#fff",
        padding: "clamp(3rem,6vw,5rem) clamp(1.5rem,6vw,5rem)",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          {/* Column header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr 1.5fr",
            padding: "0.75rem 1.5rem",
            marginBottom: "0.5rem",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700, fontSize: "0.72rem",
            letterSpacing: "0.15em", textTransform: "uppercase",
            color: "rgba(147,197,253,0.8)",
            borderBottom: "1px solid rgba(59,130,246,0.3)",
          }}>
            <span>Grade</span>
            <span>Monthly (8 hrs/month)</span>
            <span>Per Lesson (2 hrs)</span>
          </div>

          {PRICING.map((item) => (
            <div key={item.grade} style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 1.5fr",
              alignItems: "center",
              background: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(59,130,246,0.2)",
              borderRadius: 6, padding: "1.1rem 1.5rem",
              marginBottom: "0.75rem",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700, fontSize: "1.05rem",
              transition: "background 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,0.12)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.25)"}
            >
              <span>{item.grade}</span>
              <span style={{ color: "#60a5fa" }}>{item.monthly}</span>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>{item.perLesson}</span>
            </div>
          ))}

          <p style={{
            marginTop: "1.5rem",
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.4)",
            fontStyle: "italic",
          }}>
            * All sessions follow the CAPS curriculum. Prices are in South African Rand (ZAR).
          </p>
        </div>
      </section>

      {/* What's included */}
      <section style={{
        background: "#fff",
        padding: "clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)",
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700, fontSize: "0.72rem",
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "#2563b8", marginBottom: "0.5rem",
          }}>
            Every Session Includes
          </div>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(1.8rem,4vw,3rem)",
            textTransform: "uppercase",
            color: "#0a1628", marginBottom: "2.5rem",
          }}>
            WHAT YOU GET
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5px",
            background: "#e5e7eb",
          }}>
            {[
              { icon: "🧠", title: "Psychological Transformation", desc: "We address the mental blocks that make students believe certain subjects are impossible." },
              { icon: "📊", title: "Psychometric Assessment", desc: "Every student is assessed first to identify gaps from previous grades." },
              { icon: "📝", title: "Weekly Tests", desc: "Regular testing keeps students engaged. Results and feedback go directly to parents." },
              { icon: "🔄", title: "Cognitive Offloading", desc: "Complex problems are broken into practised steps, freeing mental space for real thinking." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{
                background: "#fff",
                padding: "2rem 1.75rem",
                transition: "background 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#0a1628"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}
              >
                <div style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>{icon}</div>
                <h3 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800, fontSize: "1rem",
                  textTransform: "uppercase", marginBottom: "0.65rem",
                }}>
                  {title}
                </h3>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#6b7280" }}>{desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "3rem", textAlign: "center" }}>
            <Link href="/appointments" style={{
              background: "#1e3a7a", color: "#fff",
              padding: "0.95rem 2.5rem",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800, fontSize: "0.95rem",
              letterSpacing: "0.12em", textTransform: "uppercase",
              borderRadius: 4, textDecoration: "none",
              display: "inline-block",
            }}>
              BOOK A SESSION →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}