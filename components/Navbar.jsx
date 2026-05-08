"use client"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { logout } from "@/lib/useAuth"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  // ── Read user from localStorage on load and when
  //    storage changes (e.g. after login in another tab) ──
  useEffect(() => {
    const read = () => {
      const str = localStorage.getItem("user")
      setUser(str ? JSON.parse(str) : null)
    }
    read()
    window.addEventListener("storage", read)
    return () => window.removeEventListener("storage", read)
  }, [])

  // ── Also re-read when the page changes ──────────────
  // This catches the case where the user logs in and
  // gets redirected — the navbar updates without a refresh
  useEffect(() => {
    const str = localStorage.getItem("user")
    setUser(str ? JSON.parse(str) : null)
  }, [pathname])

  const handleLogout = () => {
    setMenuOpen(false)
    logout(router)
  }

  const navLinks = [
    { href: "/services",     label: "Services" },
    { href: "/appointments", label: "Book a Session" },
    { href: "/contact",      label: "Contact" },
  ]

  const linkStyle = (href) => ({
    padding: "0.5rem 1rem",
    borderRadius: 6,
    background: pathname === href ? "rgba(255,255,255,0.15)" : "transparent",
    color: "#fff",
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 600,
    fontSize: "0.85rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s",
    textDecoration: "none",
    display: "inline-block",
    whiteSpace: "nowrap",
  })

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
      background: "linear-gradient(90deg, #000 0%, #0a1628 50%, #1d4ed8 100%)",
      borderBottom: "2px solid rgba(255,255,255,0.2)",
      padding: "0 clamp(1rem,4vw,3rem)",
      height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      fontFamily: "'Barlow', sans-serif",
    }}>

      {/* Logo */}
      <Link href="/" style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 900, fontSize: "1.3rem",
        color: "#fff", letterSpacing: "0.05em",
        textDecoration: "none", whiteSpace: "nowrap",
      }}>
        ASSEMBLED<span style={{ color: "#3b82f6" }}>.</span>
      </Link>

      {/* Desktop links */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        {navLinks.map(({ href, label }) => (
          <Link key={href} href={href} style={linkStyle(href)}>{label}</Link>
        ))}

        {/* Logged in + approved */}
        {user && user.role !== "pending" && (
          <>
            <Link
              href={user.role === "admin" ? "/dashboard/admin" : "/dashboard/tutor"}
              style={{
                ...linkStyle("/dashboard"),
                background: "rgba(255,255,255,0.9)",
                color: "#1e3a7a",
                fontWeight: 700,
              }}
            >
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              style={{
                ...linkStyle(""),
                border: "1.5px solid rgba(255,255,255,0.5)",
              }}
            >
              Logout
            </button>
          </>
        )}

        {/* Pending user */}
        {user?.role === "pending" && (
          <>
            <span style={{
              color: "#fbbf24",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700, fontSize: "0.85rem",
              letterSpacing: "0.1em", padding: "0 0.5rem",
            }}>
              ⏳ PENDING APPROVAL
            </span>
            <button onClick={handleLogout} style={linkStyle("")}>
              Logout
            </button>
          </>
        )}

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{
            display: "none", // shown via media query workaround below
            background: "none", border: "none",
            color: "#fff", cursor: "pointer",
            padding: "0.5rem",
          }}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: "absolute", top: 64, left: 0, right: 0,
          background: "#0a1628",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          padding: "1rem 1.5rem",
          display: "flex", flexDirection: "column", gap: "0.5rem",
        }}>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href} href={href}
              onClick={() => setMenuOpen(false)}
              style={{ ...linkStyle(href), display: "block", width: "100%" }}
            >
              {label}
            </Link>
          ))}
          {user && user.role !== "pending" && (
            <>
              <Link
                href={user.role === "admin" ? "/dashboard/admin" : "/dashboard/tutor"}
                onClick={() => setMenuOpen(false)}
                style={{ ...linkStyle(""), display: "block", width: "100%", background: "rgba(255,255,255,0.15)" }}
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} style={{ ...linkStyle(""), width: "100%", textAlign: "left" }}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}