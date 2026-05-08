"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, logout } from "@/lib/useAuth"

export default function TutorDashboard() {
  const router = useRouter()
  const { user, loading } = useAuth("user")
  const [count, setCount] = useState(0)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user) return

    const fetchCount = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("/api/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)
        setCount(data.data?.length || 0)
      } catch (err) {
        setError("Could not load appointment data")
      } finally {
        setFetching(false)
      }
    }

    fetchCount()
  }, [user])

  if (loading) return <LoadingScreen />

  const cards = [
    {
      label: "View All Appointments",
      desc: "See the complete list of booked sessions",
      icon: "📋",
      onClick: () => router.push("/dashboard/tutor/appointments"),
      color: "#2563b8",
    },
    {
      label: "Appointment Details",
      desc: "Look up payment status and session notes",
      icon: "🔍",
      onClick: () => router.push("/dashboard/tutor/details"),
      color: "#2563b8",
    },
  ]

  return (
    <main style={{
      minHeight: "100vh",
      background: "#f0f4ff",
      paddingTop: 80,
      fontFamily: "'Barlow', sans-serif",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900, fontSize: "2rem",
            color: "#0a1628", marginBottom: "0.25rem",
          }}>
            DASHBOARD
          </h1>
          <p style={{ color: "#6b7280" }}>
            Welcome back, <strong>{user?.username}</strong>
          </p>
        </div>

        {/* Appointment count card */}
        <div style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderLeft: "4px solid #2563b8",
          borderRadius: 8,
          padding: "1.5rem 2rem",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
              Total Appointments
            </p>
            <p style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900, fontSize: "2.5rem", color: "#0a1628",
            }}>
              {fetching ? "—" : count}
            </p>
          </div>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "#eff6ff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.75rem",
          }}>
            📅
          </div>
        </div>

        {/* Action cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}>
          {cards.map(({ label, desc, icon, onClick, color }) => (
            <button
              key={label}
              onClick={onClick}
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "1.5rem",
                textAlign: "left",
                cursor: "pointer",
                transition: "box-shadow 0.2s, transform 0.15s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,184,0.15)"
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 8,
                background: "#eff6ff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.25rem", marginBottom: "1rem",
              }}>
                {icon}
              </div>
              <p style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800, fontSize: "1rem",
                color: "#0a1628", marginBottom: "0.35rem",
                textTransform: "uppercase",
              }}>
                {label}
              </p>
              <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>{desc}</p>
            </button>
          ))}
        </div>

        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca",
            color: "#b91c1c", padding: "1rem", borderRadius: 6,
            fontSize: "0.875rem",
          }}>
            {error}
          </div>
        )}

        <button
          onClick={() => logout(router)}
          style={{
            marginTop: "1rem",
            background: "none",
            border: "1.5px solid #d1d5db",
            color: "#6b7280",
            padding: "0.65rem 1.5rem",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700, fontSize: "0.8rem",
            letterSpacing: "0.1em", textTransform: "uppercase",
            borderRadius: 4, cursor: "pointer",
          }}
        >
          SIGN OUT
        </button>
      </div>
    </main>
  )
}

function LoadingScreen() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "#f0f4ff", fontFamily: "'Barlow', sans-serif",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 48, height: 48, border: "3px solid #e5e7eb",
          borderTop: "3px solid #2563b8",
          borderRadius: "50%", margin: "0 auto 1rem",
          animation: "spin 0.8s linear infinite",
        }} />
        <p style={{ color: "#6b7280" }}>Loading dashboard...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}