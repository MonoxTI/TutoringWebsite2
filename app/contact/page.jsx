"use client"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function ContactPage() {
  const details = [
    { label: "Email", value: "assembledtutoring@gmail.com", icon: "✉️" },
    { label: "Phone", value: "084 727 7408", icon: "📞" },
    { label: "Location", value: "Montana Tuine, Pretoria, Gauteng, 0182", icon: "📍" },
    { label: "Hours", value: "Mon–Fri: 07:00–19:00 | Sat: 08:00–14:00", icon: "🕐" },
  ]

  return (
    <>
      <Navbar />

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #000 0%, #0a1628 40%, #1e3a7a 100%)",
        color: "#fff",
        padding: "clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem) 3rem",
        marginTop: 64,
      }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700, fontSize: "0.72rem",
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "#3b82f6", marginBottom: "0.75rem",
        }}>
          Get In Touch
        </div>
        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900,
          fontSize: "clamp(2.5rem,6vw,4.5rem)",
          lineHeight: 0.95, letterSpacing: "-0.02em",
        }}>
          CONTACT<br />
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic", fontWeight: 400,
          }}>Us</span>
        </h1>
      </div>

      <main style={{
        background: "#f0f4ff",
        padding: "3rem clamp(1rem,4vw,3rem)",
        fontFamily: "'Barlow', sans-serif",
        minHeight: "60vh",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>

          {/* Contact cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "3rem" }}>
            {details.map(({ label, value, icon }) => (
              <div key={label} style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderLeft: "4px solid #2563b8",
                borderRadius: 8,
                padding: "1.25rem 1.5rem",
                display: "flex", alignItems: "center", gap: "1.25rem",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}>
                <span style={{ fontSize: "1.4rem" }}>{icon}</span>
                <div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700, fontSize: "0.7rem",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "#6b7280", marginBottom: "0.2rem",
                  }}>
                    {label}
                  </div>
                  <div style={{ fontSize: "0.95rem", color: "#111" }}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Staff portal */}
          <div style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "2rem",
            textAlign: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900, fontSize: "1.1rem",
              textTransform: "uppercase", color: "#0a1628",
              marginBottom: "0.5rem",
            }}>
              Staff Portal
            </div>
            <p style={{
              color: "#6b7280", fontSize: "0.875rem",
              lineHeight: 1.6, marginBottom: "1.5rem",
            }}>
              Tutors and administrators can access their dashboards here.
              Login credentials are issued by administration.
            </p>
            <Link
              href="/login"
              style={{
                display: "inline-block",
                background: "#0a1628", color: "#fff",
                padding: "0.875rem 2.5rem",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800, fontSize: "0.9rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
                borderRadius: 6, textDecoration: "none",
                transition: "background 0.2s",
              }}
            >
              STAFF LOGIN →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}