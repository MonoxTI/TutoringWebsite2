"use client"
import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const CHAPTER_OPTIONS = {
  "Maths Paper 1": [
    "Algebra",
    "Series and sequences",
    "Financial maths",
    "Functions and graphs",
    "Probability",
  ],
  "Maths Paper 2": [
    "Trigonometry",
    "Euclidean geometry",
    "Analytical geometry",
    "Statistics and regression",
  ],
}

const INITIAL_FORM = { fullName: "", email: "", phoneNumber: "" }

export default function AppointmentsPage() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [selectedPaper, setSelectedPaper] = useState("")
  const [selectedChapters, setSelectedChapters] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handlePaperChange = (e) => {
    setSelectedPaper(e.target.value)
    setSelectedChapters([]) // reset chapters when paper changes
  }

  const toggleChapter = (chapter) =>
    setSelectedChapters((prev) =>
      prev.includes(chapter)
        ? prev.filter((c) => c !== chapter)
        : [...prev, chapter]
    )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)

    if (!selectedPaper) {
      setMessage({ type: "error", text: "Please select a Maths Paper" })
      return
    }
    if (selectedChapters.length === 0) {
      setMessage({ type: "error", text: "Please select at least one chapter" })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          // ── Combine paper + chapters into one string
          // e.g. "Maths Paper 1 - Algebra, Probability"
          // This is how your backend stores and parses it
          chapters: `${selectedPaper} - ${selectedChapters.join(", ")}`,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: "error", text: data.message || "Booking failed" })
        return
      }

      setMessage({ type: "success", text: "Appointment booked successfully ✅" })
      setForm(INITIAL_FORM)
      setSelectedPaper("")
      setSelectedChapters([])
    } catch {
      setMessage({ type: "error", text: "Server error. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1.5px solid #d1d5db",
    borderRadius: 6,
    fontSize: "0.9rem",
    fontFamily: "'Barlow', sans-serif",
    color: "#111",
    background: "#fff",
    outline: "none",
  }

  const labelStyle = {
    display: "block",
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 700,
    fontSize: "0.72rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#6b7280",
    marginBottom: "0.4rem",
  }

  return (
    <>
      <Navbar />

      {/* Page header */}
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
          Reserve Your Spot
        </div>
        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900, fontSize: "clamp(2.5rem,6vw,4.5rem)",
          lineHeight: 0.95, letterSpacing: "-0.02em",
        }}>
          BOOK A<br />
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic", fontWeight: 400,
          }}>Session</span>
        </h1>
      </div>

      <main style={{
        background: "#f0f4ff",
        minHeight: "60vh",
        padding: "3rem clamp(1rem,4vw,2rem)",
        fontFamily: "'Barlow', sans-serif",
      }}>
        <div style={{
          maxWidth: 600,
          margin: "0 auto",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          padding: "2.5rem clamp(1.25rem,4vw,2.5rem)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900, fontSize: "1.3rem",
            textTransform: "uppercase",
            color: "#0a1628", marginBottom: "2rem",
          }}>
            Appointment Details
          </h2>

          {/* Status message */}
          {message && (
            <div style={{
              background: message.type === "success" ? "#f0fdf4" : "#fef2f2",
              border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
              color: message.type === "success" ? "#15803d" : "#b91c1c",
              padding: "0.85rem 1rem",
              borderRadius: 6, fontSize: "0.875rem",
              marginBottom: "1.5rem", textAlign: "center",
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Standard fields */}
            {[
              { label: "Full Name", name: "fullName", type: "text", placeholder: "Your full name" },
              { label: "Email", name: "email", type: "email", placeholder: "your@email.com" },
              { label: "Phone Number", name: "phoneNumber", type: "tel", placeholder: "e.g. 084 727 7408" },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label style={labelStyle}>{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  style={inputStyle}
                />
              </div>
            ))}

            {/* Paper dropdown */}
            <div>
              <label style={labelStyle}>Select Paper</label>
              <select
                value={selectedPaper}
                onChange={handlePaperChange}
                required
                style={{ ...inputStyle, appearance: "none" }}
              >
                <option value="">Choose a Maths Paper</option>
                <option value="Maths Paper 1">Maths Paper 1</option>
                <option value="Maths Paper 2">Maths Paper 2</option>
              </select>
            </div>

            {/* Chapter checkboxes — only show once a paper is selected */}
            {selectedPaper && (
              <div>
                <label style={labelStyle}>
                  Select Chapters (choose one or more)
                </label>
                <div style={{
                  border: "1.5px solid #d1d5db",
                  borderRadius: 6,
                  overflow: "hidden",
                }}>
                  {CHAPTER_OPTIONS[selectedPaper].map((chapter, i) => (
                    <label
                      key={chapter}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem 1rem",
                        cursor: "pointer",
                        background: selectedChapters.includes(chapter)
                          ? "#eff6ff"
                          : i % 2 === 0 ? "#fff" : "#f9fafb",
                        borderBottom: i < CHAPTER_OPTIONS[selectedPaper].length - 1
                          ? "1px solid #e5e7eb" : "none",
                        transition: "background 0.15s",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedChapters.includes(chapter)}
                        onChange={() => toggleChapter(chapter)}
                        style={{ width: 16, height: 16, accentColor: "#2563b8" }}
                      />
                      <span style={{ fontSize: "0.9rem", color: "#374151" }}>
                        {chapter}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Show selected summary */}
                {selectedChapters.length > 0 && (
                  <div style={{
                    marginTop: "0.6rem",
                    padding: "0.6rem 0.85rem",
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: 4,
                    fontSize: "0.8rem",
                    color: "#1d4ed8",
                  }}>
                    <strong>Selected:</strong> {selectedChapters.join(", ")}
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "#93c5fd" : "#1e3a7a",
                color: "#fff", border: "none",
                padding: "0.95rem",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800, fontSize: "0.95rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
                borderRadius: 6,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
                marginTop: "0.5rem",
              }}
            >
              {loading ? "BOOKING..." : "CONFIRM BOOKING →"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  )
}