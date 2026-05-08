"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, logout } from "@/lib/useAuth"

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading } = useAuth("admin")
  const [pendingUsers, setPendingUsers] = useState([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!user) return
    fetchPending()
  }, [user])

  const fetchPending = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/admin/users/pending", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setPendingUsers(data.data || [])
    } catch (err) {
      setError("Failed to load pending users")
    } finally {
      setFetching(false)
    }
  }

  const handleAction = async (userId, username, action) => {
    const msg = action === "approve"
      ? `Approve "${username}"? They will gain dashboard access.`
      : `Revoke access for "${username}"? They will return to pending.`

    if (!window.confirm(msg)) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setSuccess(
        action === "approve"
          ? `✅ ${username} approved successfully`
          : `🔒 ${username}'s access revoked`
      )

      // ── Remove from pending list if approved ─────────
      if (action === "approve") {
        setPendingUsers(prev => prev.filter(u => u._id !== userId))
      }

      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(""), 4000)
    }
  }

  const formatDate = (str) =>
    str
      ? new Date(str).toLocaleDateString("en-ZA", {
          year: "numeric", month: "short", day: "numeric",
        })
      : "—"

  if (loading || fetching) return <LoadingScreen />

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
          alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem",
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900, fontSize: "2rem",
              color: "#0a1628", marginBottom: "0.25rem",
            }}>
              ADMIN DASHBOARD
            </h1>
            <p style={{ color: "#6b7280" }}>Manage tutor account access</p>
          </div>
          <button
            onClick={() => logout(router)}
            style={{
              background: "none", border: "1.5px solid #d1d5db",
              color: "#6b7280", padding: "0.65rem 1.5rem",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700, fontSize: "0.8rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
              borderRadius: 4, cursor: "pointer",
            }}
          >
            SIGN OUT
          </button>
        </div>

        {/* Pending count card */}
        <div style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderLeft: "4px solid #f59e0b",
          borderRadius: 8, padding: "1.25rem 2rem",
          marginBottom: "2rem", display: "inline-block",
        }}>
          <p style={{ color: "#6b7280", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
            AWAITING APPROVAL
          </p>
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900, fontSize: "2.5rem", color: "#0a1628",
          }}>
            {pendingUsers.length}
          </p>
        </div>

        {/* Alerts */}
        {(error || success) && (
          <div style={{
            background: success ? "#f0fdf4" : "#fef2f2",
            border: `1px solid ${success ? "#bbf7d0" : "#fecaca"}`,
            color: success ? "#15803d" : "#b91c1c",
            padding: "1rem 1.25rem",
            borderRadius: 6, fontSize: "0.875rem",
            marginBottom: "1.5rem",
          }}>
            {success || error}
          </div>
        )}

        {/* Pending users table */}
        <div style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          overflow: "hidden",
        }}>
          <div style={{
            padding: "1rem 1.5rem",
            borderBottom: "1px solid #e5e7eb",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800, fontSize: "1rem",
            textTransform: "uppercase", color: "#0a1628",
          }}>
            Pending Users ({pendingUsers.length})
          </div>

          <div style={{ padding: "1.5rem" }}>
            {pendingUsers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
                <p style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800, fontSize: "1.1rem", color: "#0a1628",
                }}>
                  ALL CAUGHT UP
                </p>
                <p style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                  No users waiting for approval.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                      {["Username", "Email", "Registered", "Actions"].map(h => (
                        <th key={h} style={{
                          paddingBottom: "0.75rem",
                          textAlign: h === "Actions" ? "right" : "left",
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 700, fontSize: "0.75rem",
                          letterSpacing: "0.1em", textTransform: "uppercase",
                          color: "#9ca3af",
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map(u => (
                      <tr
                        key={u._id}
                        style={{ borderBottom: "1px solid #f3f4f6" }}
                      >
                        <td style={{ padding: "0.85rem 0", fontWeight: 600, color: "#111" }}>
                          {u.username}
                        </td>
                        <td style={{ padding: "0.85rem 0", color: "#6b7280", fontSize: "0.9rem" }}>
                          {u.email}
                        </td>
                        <td style={{ padding: "0.85rem 0", color: "#9ca3af", fontSize: "0.85rem" }}>
                          {formatDate(u.createdAt)}
                        </td>
                        <td style={{ padding: "0.85rem 0", textAlign: "right" }}>
                          <button
                            onClick={() => handleAction(u._id, u.username, "approve")}
                            style={{
                              background: "#16a34a", color: "#fff",
                              border: "none", padding: "0.45rem 1rem",
                              borderRadius: 4, cursor: "pointer",
                              fontFamily: "'Barlow Condensed', sans-serif",
                              fontWeight: 700, fontSize: "0.8rem",
                              letterSpacing: "0.06em", marginRight: "0.5rem",
                            }}
                          >
                            ✅ APPROVE
                          </button>
                          <button
                            onClick={() => handleAction(u._id, u.username, "revoke")}
                            style={{
                              background: "#f3f4f6", color: "#374151",
                              border: "none", padding: "0.45rem 1rem",
                              borderRadius: 4, cursor: "pointer",
                              fontFamily: "'Barlow Condensed', sans-serif",
                              fontWeight: 700, fontSize: "0.8rem",
                              letterSpacing: "0.06em",
                            }}
                          >
                            🔒 REVOKE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Tip */}
        <div style={{
          marginTop: "1.5rem",
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: 6, padding: "1rem 1.25rem",
          fontSize: "0.85rem", color: "#1d4ed8",
        }}>
          💡 <strong>Tip:</strong> Approved tutors can immediately log in and view appointments. Revoked users return to pending status.
        </div>
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
          width: 48, height: 48, border: "3px solid #e5e7eb",
          borderTop: "3px solid #2563b8",
          borderRadius: "50%", margin: "0 auto 1rem",
          animation: "spin 0.8s linear infinite",
        }} />
        <p style={{ color: "#6b7280" }}>Loading...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}