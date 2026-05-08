"use client"
import { useRouter } from "next/navigation"
import { logout } from "@/lib/useAuth"

export default function PendingPage() {
  const router = useRouter()

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #000 0%, #0a1628 40%, #1e3a7a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem", fontFamily: "'Barlow', sans-serif",
    }}>
      <div style={{
        background: "rgba(0,0,0,0.55)",
        border: "1px solid rgba(245,158,11,0.3)",
        backdropFilter: "blur(20px)",
        padding: "3rem", width: "100%",
        maxWidth: 460, borderRadius: 6,
        textAlign: "center", color: "#fff",
      }}>
        <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>⏳</div>

        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900, fontSize: "2rem",
          marginBottom: "1rem", letterSpacing: "-0.01em",
        }}>
          AWAITING APPROVAL
        </h1>

        <p style={{
          color: "rgba(255,255,255,0.55)",
          lineHeight: 1.7, marginBottom: "2rem", fontSize: "0.95rem",
        }}>
          Your account has been created successfully. An administrator
          will review and approve your access shortly. You'll be able
          to log in once approved.
        </p>

        <div style={{
          background: "rgba(245,158,11,0.1)",
          border: "1px solid rgba(245,158,11,0.3)",
          borderRadius: 4, padding: "1rem",
          color: "#fbbf24", fontSize: "0.85rem",
          marginBottom: "2rem", lineHeight: 1.6,
        }}>
          💡 If you haven't heard back within 24 hours, contact us at{" "}
          <strong>assembledtutoring@gmail.com</strong>
        </div>

        <button
          onClick={() => logout(router)}
          style={{
            background: "transparent",
            border: "1.5px solid rgba(255,255,255,0.3)",
            color: "rgba(255,255,255,0.7)",
            padding: "0.75rem 2rem",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700, fontSize: "0.9rem",
            letterSpacing: "0.12em", textTransform: "uppercase",
            borderRadius: 3, cursor: "pointer",
          }}
        >
          BACK TO LOGIN
        </button>
      </div>
    </main>
  )
}