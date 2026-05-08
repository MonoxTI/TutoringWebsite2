"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message)
        return
      }

      // ── Save token and user to localStorage ──────────
      // Think of this like writing the user's details on
      // a sticky note that the browser keeps. Every page
      // can read this note to know who is logged in.
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      // ── Send to the right dashboard by role ──────────
      if (data.user.role === "admin") {
        router.push("/dashboard/admin")
      } else {
        router.push("/dashboard/tutor")
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #000000 0%, #0a1628 40%, #1e3a7a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem",
      fontFamily: "'Barlow', sans-serif",
    }}>
      <div style={{
        background: "rgba(0,0,0,0.55)",
        border: "1px solid rgba(59,130,246,0.25)",
        backdropFilter: "blur(20px)",
        padding: "3rem",
        width: "100%", maxWidth: 420,
        borderRadius: 6,
      }}>

        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900, fontSize: "1.3rem",
            letterSpacing: "0.05em", color: "#fff",
            marginBottom: "2rem", cursor: "pointer",
          }}
        >
          ASSEMBLED<span style={{ color: "#3b82f6" }}>.</span>
          <span style={{
            fontWeight: 400, fontSize: "0.65rem",
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.12em", marginLeft: "0.75rem",
          }}>
            STAFF PORTAL
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900, fontSize: "2rem",
          color: "#fff", marginBottom: "0.4rem",
        }}>
          SIGN IN
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", marginBottom: "2rem" }}>
          Access your tutor or admin dashboard.
        </p>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.35)",
            color: "#fca5a5", padding: "0.75rem 1rem",
            borderRadius: 3, fontSize: "0.85rem",
            marginBottom: "1.5rem",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {[
            { label: "Email", key: "email", type: "email", placeholder: "your@email.com" },
            { label: "Password", key: "password", type: "password", placeholder: "••••••••" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label style={{
                display: "block",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700, fontSize: "0.7rem",
                letterSpacing: "0.15em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)", marginBottom: "0.4rem",
              }}>
                {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                required
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1.5px solid rgba(59,130,246,0.25)",
                  color: "#fff", padding: "0.75rem 1rem",
                  fontSize: "0.9rem", borderRadius: 3,
                  fontFamily: "'Barlow', sans-serif",
                }}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#1e40af" : "#2563b8",
              color: "#fff", border: "none",
              padding: "0.9rem",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800, fontSize: "0.95rem",
              letterSpacing: "0.15em", textTransform: "uppercase",
              borderRadius: 3, marginTop: "0.5rem",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {loading ? "SIGNING IN..." : "SIGN IN →"}
          </button>
        </form>

        <p style={{
          color: "rgba(255,255,255,0.2)",
          fontSize: "0.78rem", marginTop: "1.5rem", textAlign: "center",
        }}>
          Don't have an account?{" "}
          <span
            onClick={() => router.push("/register")}
            style={{ color: "#3b82f6", cursor: "pointer" }}
          >
            Register here
          </span>
        </p>
      </div>
    </main>
  )
}