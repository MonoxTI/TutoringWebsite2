"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message)
        return
      }

      setSuccess(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1.5px solid rgba(59,130,246,0.25)",
    color: "#fff", padding: "0.75rem 1rem",
    fontSize: "0.9rem", borderRadius: 3,
    fontFamily: "'Barlow', sans-serif",
  }

  const labelStyle = {
    display: "block",
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 700, fontSize: "0.7rem",
    letterSpacing: "0.15em", textTransform: "uppercase",
    color: "rgba(255,255,255,0.4)", marginBottom: "0.4rem",
  }

  if (success) return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #000 0%, #0a1628 40%, #1e3a7a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem", fontFamily: "'Barlow', sans-serif",
    }}>
      <div style={{ textAlign: "center", color: "#fff", maxWidth: 420 }}>
        <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>✅</div>
        <h2 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900, fontSize: "2rem", marginBottom: "1rem",
        }}>
          REGISTRATION SENT
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "2rem" }}>
          Your account is pending admin approval. You'll be able to log in once access is granted.
        </p>
        <button
          onClick={() => router.push("/login")}
          style={{
            background: "#2563b8", color: "#fff", border: "none",
            padding: "0.9rem 2.5rem",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800, fontSize: "0.9rem",
            letterSpacing: "0.12em", textTransform: "uppercase",
            borderRadius: 3, cursor: "pointer",
          }}
        >
          GO TO LOGIN
        </button>
      </div>
    </main>
  )

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #000 0%, #0a1628 40%, #1e3a7a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem", fontFamily: "'Barlow', sans-serif",
    }}>
      <div style={{
        background: "rgba(0,0,0,0.55)",
        border: "1px solid rgba(59,130,246,0.25)",
        backdropFilter: "blur(20px)",
        padding: "3rem", width: "100%", maxWidth: 420, borderRadius: 6,
      }}>
        <div
          onClick={() => router.push("/")}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900, fontSize: "1.3rem",
            color: "#fff", marginBottom: "2rem", cursor: "pointer",
          }}
        >
          ASSEMBLED<span style={{ color: "#3b82f6" }}>.</span>
        </div>

        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900, fontSize: "2rem",
          color: "#fff", marginBottom: "0.4rem",
        }}>
          REGISTER
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", marginBottom: "2rem" }}>
          Create a tutor account. Admin approval required before login.
        </p>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.35)",
            color: "#fca5a5", padding: "0.75rem 1rem",
            borderRadius: 3, fontSize: "0.85rem", marginBottom: "1.5rem",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {[
            { label: "Username", key: "username", type: "text", placeholder: "e.g. naledi_t" },
            { label: "Email", key: "email", type: "email", placeholder: "your@email.com" },
            { label: "Password", key: "password", type: "password", placeholder: "Min 6 characters" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                required
                style={inputStyle}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#1e40af" : "#2563b8",
              color: "#fff", border: "none", padding: "0.9rem",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800, fontSize: "0.95rem",
              letterSpacing: "0.15em", textTransform: "uppercase",
              borderRadius: 3, marginTop: "0.5rem",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "REGISTERING..." : "CREATE ACCOUNT →"}
          </button>
        </form>

        <p style={{
          color: "rgba(255,255,255,0.2)",
          fontSize: "0.78rem", marginTop: "1.5rem", textAlign: "center",
        }}>
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            style={{ color: "#3b82f6", cursor: "pointer" }}
          >
            Sign in
          </span>
        </p>
      </div>
    </main>
  )
}