"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/useAuth"
import Link from "next/link"

function parseChapters(str) {
  if (!str) return { paper: "", chapters: [] }
  const [paper, rest] = str.split(" - ")
  const chapters = rest
    ? rest.split(",").map((c) => c.trim()).filter(Boolean)
    : []
  return { paper: paper?.trim() || "", chapters }
}

const STATUS_OPTIONS = ["Unpaid", "Partial", "Paid"]

export default function AppointmentDetailsPage() {
  const { user, loading: authLoading } = useAuth("user")

  // ── Search state ────────────────────────────────────
  const [options, setOptions] = useState([])          // dropdown names
  const [selectedName, setSelectedName] = useState("")
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState("")

  // ── Result state ────────────────────────────────────
  const [data, setData] = useState(null)              // appointment + payment

  // ── Payment update state ────────────────────────────
  const [paymentStatus, setPaymentStatus] = useState("Unpaid")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [updating, setUpdating] = useState(false)
  const [updateMsg, setUpdateMsg] = useState(null)

  // ── Load names for dropdown on mount ────────────────
  useEffect(() => {
    if (!user) return
    const loadNames = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("/api/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = await res.json()
        if (res.ok) {
          // Deduplicate names for dropdown
          const names = [...new Set((json.data || []).map((a) => a.fullName))]
          setOptions(names)
        }
      } catch {
        setSearchError("Failed to load student names")
      }
    }
    loadNames()
  }, [user])

  // ── Pre-fill payment form when data loads ───────────
  useEffect(() => {
    if (data?.paymentDetails) {
      const s = data.paymentDetails.paymentStatus || "unpaid"
      setPaymentStatus(s.charAt(0).toUpperCase() + s.slice(1))
      setAmount(data.paymentDetails.amountPaid?.toString() || "")
      setNote(data.paymentDetails.note || "")
    } else {
      setPaymentStatus("Unpaid")
      setAmount("")
      setNote("")
    }
    setUpdateMsg(null)
  }, [data])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!selectedName.trim()) return
    setSearching(true)
    setSearchError("")
    setData(null)

    try {
      const token = localStorage.getItem("token")
      // ── We fetch all appointments and filter client-side
      // This avoids needing a separate search endpoint
      const res = await fetch("/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message)

      const match = (json.data || []).find(
        (a) => a.fullName.toLowerCase() === selectedName.toLowerCase()
      )

      if (!match) {
        setSearchError("Appointment not found")
        return
      }

      // ── Fetch payment details for this appointment ───
      const detailRes = await fetch(`/api/appointments/${match._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const detailJson = await detailRes.json()
      if (!detailRes.ok) throw new Error(detailJson.message)

      setData(detailJson.data)
    } catch (err) {
      setSearchError(err.message || "Search failed")
    } finally {
      setSearching(false)
    }
  }

  const handleUpdatePayment = async (e) => {
    e.preventDefault()
    setUpdateMsg(null)

    if (paymentStatus !== "Unpaid" && (!amount || parseFloat(amount) <= 0)) {
      setUpdateMsg({ type: "error", text: "Enter a valid amount for Paid or Partial status" })
      return
    }

    setUpdating(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/appointments/${data.appointment.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          PaymentStatus: paymentStatus,
          AmountPaid: amount ? parseFloat(amount) : null,
          Note: note.trim(),
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.message)

      // ── Update local payment data without re-fetching ─
      setData((prev) => ({
        ...prev,
        paymentDetails: {
          paymentStatus: json.data.paymentStatus,
          amountPaid: json.data.amountPaid,
          note: json.data.note,
          transactionId: json.data.transactionId,
          invoiceNumber: json.data.invoiceNumber,
        },
      }))

      setUpdateMsg({ type: "success", text: "Payment updated successfully!" })
      setTimeout(() => setUpdateMsg(null), 3000)
    } catch (err) {
      setUpdateMsg({ type: "error", text: err.message || "Update failed" })
    } finally {
      setUpdating(false)
    }
  }

  if (authLoading) return <LoadingScreen />

  const inputStyle = {
    width: "100%", padding: "0.75rem 1rem",
    border: "1.5px solid #d1d5db", borderRadius: 6,
    fontSize: "0.9rem", fontFamily: "'Barlow', sans-serif",
    color: "#111", outline: "none",
  }

  const labelStyle = {
    display: "block",
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 700, fontSize: "0.7rem",
    letterSpacing: "0.12em", textTransform: "uppercase",
    color: "#6b7280", marginBottom: "0.4rem",
  }

  const statusColor = {
    paid: { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
    partial: { bg: "#fefce8", text: "#a16207", border: "#fde68a" },
    unpaid: { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#f0f4ff",
      paddingTop: 80,
      fontFamily: "'Barlow', sans-serif",
    }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1.5rem" }}>

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
              APPOINTMENT MANAGEMENT
            </h1>
            <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
              Search a student to view and update their session
            </p>
          </div>
          <Link href="/dashboard/tutor" style={{
            background: "#1e3a7a", color: "#fff",
            padding: "0.65rem 1.25rem",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700, fontSize: "0.8rem",
            letterSpacing: "0.1em", textTransform: "uppercase",
            borderRadius: 4, textDecoration: "none",
          }}>
            ← Dashboard
          </Link>
        </div>

        {/* Search */}
        <div style={{
          background: "#fff", border: "1px solid #e5e7eb",
          borderRadius: 8, padding: "1.5rem 2rem",
          marginBottom: "1.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800, fontSize: "1rem",
            textTransform: "uppercase", color: "#0a1628",
            marginBottom: "1.25rem",
          }}>
            Search by Student Name
          </h2>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <select
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
                required
                style={{ ...inputStyle, appearance: "none" }}
              >
                <option value="">Select a student name</option>
                {options.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={searching || !selectedName}
              style={{
                background: searching ? "#93c5fd" : "#2563b8",
                color: "#fff", border: "none",
                padding: "0.75rem 1.5rem",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800, fontSize: "0.85rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
                borderRadius: 6,
                cursor: searching || !selectedName ? "not-allowed" : "pointer",
              }}
            >
              {searching ? "SEARCHING..." : "SEARCH →"}
            </button>
          </form>
          {searchError && (
            <div style={{
              marginTop: "0.75rem",
              color: "#b91c1c", fontSize: "0.85rem",
            }}>
              {searchError}
            </div>
          )}
        </div>

        {/* Results */}
        {data && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Appointment details card */}
            <div style={{
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 8, padding: "1.5rem 2rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}>
              <h2 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800, fontSize: "1rem",
                textTransform: "uppercase", color: "#0a1628",
                marginBottom: "1.25rem",
              }}>
                Appointment Details
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "0.85rem",
              }}>
                {[
                  ["Student", data.appointment.fullName],
                  ["Email", data.appointment.email],
                  ["Phone", data.appointment.phoneNumber],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={labelStyle}>{label}</div>
                    <div style={{ fontSize: "0.95rem", color: "#111" }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Chapters */}
              {data.appointment.chapters && (() => {
                const { paper, chapters } = parseChapters(data.appointment.chapters)
                return (
                  <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid #f3f4f6" }}>
                    <div style={labelStyle}>📚 Chapters</div>
                    <div style={{
                      borderLeft: "3px solid #2563b8",
                      paddingLeft: "0.85rem",
                      background: "#eff6ff",
                      borderRadius: "0 4px 4px 0",
                      padding: "0.75rem 0.85rem",
                    }}>
                      {paper && (
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1d4ed8", marginBottom: "0.35rem" }}>
                          {paper}
                        </div>
                      )}
                      <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
                        {chapters.map((ch) => (
                          <li key={ch} style={{ fontSize: "0.875rem", color: "#374151" }}>{ch}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Payment info card */}
            <div style={{
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 8, padding: "1.5rem 2rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <h2 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800, fontSize: "1rem",
                  textTransform: "uppercase", color: "#0a1628",
                }}>
                  Payment Information
                </h2>
                {data.paymentDetails && (() => {
                  const s = data.paymentDetails.paymentStatus?.toLowerCase() || "unpaid"
                  const c = statusColor[s] || statusColor.unpaid
                  return (
                    <span style={{
                      background: c.bg, color: c.text,
                      border: `1px solid ${c.border}`,
                      padding: "0.2rem 0.65rem", borderRadius: 20,
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700, fontSize: "0.72rem",
                      letterSpacing: "0.08em", textTransform: "uppercase",
                    }}>
                      {data.paymentDetails.paymentStatus}
                    </span>
                  )
                })()}
              </div>

              {data.paymentDetails ? (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "0.85rem",
                }}>
                  {[
                    ["Amount Paid", `R${parseFloat(data.paymentDetails.amountPaid || 0).toFixed(2)}`],
                    ["Transaction ID", data.paymentDetails.transactionId || "N/A"],
                    ["Invoice #", data.paymentDetails.invoiceNumber || "N/A"],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <div style={labelStyle}>{label}</div>
                      <div style={{ fontSize: "0.95rem", color: "#111", fontFamily: "monospace" }}>{val}</div>
                    </div>
                  ))}
                  {data.paymentDetails.note && (
                    <div style={{ gridColumn: "1 / -1" }}>
                      <div style={labelStyle}>Notes</div>
                      <div style={{
                        background: "#f9fafb", border: "1px solid #e5e7eb",
                        borderRadius: 4, padding: "0.65rem 0.85rem",
                        fontSize: "0.875rem", color: "#374151",
                      }}>
                        {data.paymentDetails.note}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "0.875rem" }}>
                  No payment recorded yet. Use the form below to add details.
                </p>
              )}
            </div>

            {/* Update payment form */}
            <div style={{
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 8, padding: "1.5rem 2rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}>
              <h2 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800, fontSize: "1rem",
                textTransform: "uppercase", color: "#0a1628",
                marginBottom: "1.25rem",
              }}>
                Update Payment
              </h2>

              {updateMsg && (
                <div style={{
                  background: updateMsg.type === "success" ? "#f0fdf4" : "#fef2f2",
                  border: `1px solid ${updateMsg.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                  color: updateMsg.type === "success" ? "#15803d" : "#b91c1c",
                  padding: "0.85rem 1rem", borderRadius: 6,
                  fontSize: "0.875rem", marginBottom: "1.25rem",
                }}>
                  {updateMsg.text}
                </div>
              )}

              <form onSubmit={handleUpdatePayment} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={labelStyle}>Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    style={{ ...inputStyle, appearance: "none" }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Amount Paid (ZAR)</label>
                  <div style={{ position: "relative" }}>
                    <span style={{
                      position: "absolute", left: "1rem",
                      top: "50%", transform: "translateY(-50%)",
                      color: "#6b7280", fontWeight: 600,
                    }}>R</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="0" step="0.01"
                      disabled={paymentStatus === "Unpaid"}
                      style={{
                        ...inputStyle,
                        paddingLeft: "2rem",
                        background: paymentStatus === "Unpaid" ? "#f9fafb" : "#fff",
                        color: paymentStatus === "Unpaid" ? "#9ca3af" : "#111",
                      }}
                    />
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.3rem" }}>
                    {paymentStatus === "Unpaid"
                      ? "Amount disabled while status is Unpaid"
                      : "Enter the amount received"}
                  </p>
                </div>

                <div>
                  <label style={labelStyle}>Notes</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Payment notes, special arrangements..."
                    maxLength={500}
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "#9ca3af", textAlign: "right", marginTop: "0.2rem" }}>
                    {note.length}/500
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  style={{
                    background: updating ? "#6ee7b7" : "#16a34a",
                    color: "#fff", border: "none", padding: "0.9rem",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800, fontSize: "0.9rem",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    borderRadius: 6,
                    cursor: updating ? "not-allowed" : "pointer",
                  }}
                >
                  {updating ? "UPDATING..." : "UPDATE PAYMENT DETAILS →"}
                </button>
              </form>
            </div>
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
        <p style={{ color: "#6b7280" }}>Loading...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}