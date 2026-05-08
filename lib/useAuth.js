"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// ── How to use this on any protected page ────────────────
//
// const { user, loading } = useAuth()          ← any logged-in user
// const { user, loading } = useAuth("admin")   ← admin only
//
// Always check `loading` first before rendering
// anything that depends on the user

export function useAuth(requiredRole = null) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")

    // ── Not logged in → go to login ──────────────────
    if (!token || !userStr) {
      router.replace("/login")
      return
    }

    const parsed = JSON.parse(userStr)

    // ── Pending user → go to pending page ───────────
    if (parsed.role === "pending") {
      router.replace("/pending")
      return
    }

    // ── Wrong role → go back to their dashboard ──────
    if (requiredRole && parsed.role !== requiredRole) {
      router.replace(
        parsed.role === "admin" ? "/dashboard/admin" : "/dashboard/tutor"
      )
      return
    }

    setUser(parsed)
    setLoading(false)
  }, [])

  return { user, loading }
}

// ── Logout helper — call this from any page or navbar ───
export function logout(router) {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  router.push("/login")
}