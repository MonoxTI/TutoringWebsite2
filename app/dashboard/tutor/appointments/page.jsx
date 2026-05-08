"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/useAuth"
import Link from "next/link"

// ── Splits "Maths Paper 1 - Algebra, Probability" into
//    { paper: "Maths Paper 1", chapters: ["Algebra", "Probability"] }
function parseChapters(str) {
  if (!str) return { paper: "", chapters: [] }
  const [paper, rest] = str.split(" - ")
  const chapters = rest
    ? rest.split(",").map((c) => c.trim()).filter(Boolean)
    : []
  return { paper: paper?.trim() || "", chapters }
}

export default function AllAppointmentsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth("user")
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user) return

    const controller = new AbortController()

    const fetch_ = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("/api/appointments", {
          signal: controller.signal,
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)
        setAppointments(data.data || [])
      } catch (err) {
        if (err.name !== "AbortError") setError("Failed to load appointments")
      } finally {
        setLoading(false)
      }
    }

    fetch_()
    return () => controller.abort()
  }, [user])

  if (authLoading || loading) return <LoadingScreen />

  return (
    <main style={{
      minHeight: "100vh",
      background: "#f0f4ff",
      paddingTop: 80,
      fontFamily: "'Barlow', sans-serif",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem",
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900, fontSize: "2rem",
              color: "#0a1628", marginBottom: "0.2rem",
            }}>
              ALL APPOINTMENTS
            </h1>
            <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
              {appointments.length} session{appointments.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <Link
            href="/dashboard/tutor"
            style={{
              background: "#1e3a7a", color: "#fff",
              padding: "0.65rem 1.25rem",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700, fontSize: "0.8rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
              borderRadius: 4, textDecoration: "none",
            }}
          >
            ← Dashboard
          </Link>
        </div>

        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca",
            color: "#b91c1c", padding: "1rem",
            borderRadius: 6, marginBottom: "1.5rem",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            {error}
            <button
              onClick={() => window.location.reload()}
              style={{ background: "none", border: "none", color: "#b91c1c", cursor: "pointer", fontWeight: 600 }}
            >
              Retry
            </button>
          </div>
        )}

        {appointments.length === 0 && !error ? (
          <div style={{
            background: "#fff", border: "1px solid #e5e7eb",
            borderRadius: 8, padding: "3rem",
            textAlign: "center", color: "#6b7280",
          }}>
            No appointments found.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {appointments.map((apt) => {
              const { paper, chapters } = parseChapters(apt.chapters)
              return (
                <div key={apt._id} style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: "1.5rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  transition: "box-shadow 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(37,99,184,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"}
                >
                  {/* Top row */}
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem",
                    marginBottom: "1rem",
                  }}>
                    <div>
                      <div style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 800, fontSize: "1.1rem", color: "#0a1628",
                      }}>
                        {apt.fullName}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: 2 }}>
                        {apt.email} · {apt.phoneNumber}
                      </div>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#9ca3af" }}>
                      {new Date(apt.createdAt).toLocaleDateString("en-ZA", {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </div>
                  </div>

                  {/* Chapters */}
                  <div style={{
                    borderTop: "1px solid #f3f4f6",
                    paddingTop: "1rem",
                  }}>
                    <div style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700, fontSize: "0.7rem",
                      letterSpacing: "0.12em", textTransform: "uppercase",
                      color: "#6b7280", marginBottom: "0.5rem",
                    }}>
                      📚 Chapters
                    </div>
                    <div style={{
                      borderLeft: "3px solid #2563b8",
                      paddingLeft: "0.85rem",
                      background: "#eff6ff",
                      borderRadius: "0 4px 4px 0",
                      padding: "0.75rem 0.85rem",
                    }}>
                      {paper && (
                        <div style={{
                          fontSize: "0.85rem", fontWeight: 600,
                          color: "#1d4ed8", marginBottom: "0.35rem",
                        }}>
                          {paper}
                        </div>
                      )}
                      {chapters.length > 0 ? (
                        <ul style={{
                          margin: 0, paddingLeft: "1.1rem",
                          display: "flex", flexDirection: "column", gap: "0.2rem",
                        }}>
                          {chapters.map((ch) => (
                            <li key={ch} style={{ fontSize: "0.875rem", color: "#374151" }}>
                              {ch}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span style={{ fontSize: "0.85rem", color: "#9ca3af", fontStyle: "italic" }}>
                          No chapters listed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

function LoadingScreen() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "#f0f4ff",
    }}>
      <div style={{ textAlign: "center", fontFamily: "'Barlow', sans-serif" }}>
        <div style={{
          width: 48, height: 48,
          border: "3px solid #e5e7eb",
          borderTop: "3px solid #2563b8",
          borderRadius: "50%", margin: "0 auto 1rem",
          animation: "spin 0.8s linear infinite",
        }} />
        <p style={{ color: "#6b7280" }}>Loading appointments...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}