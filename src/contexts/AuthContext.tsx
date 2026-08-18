"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export type UserRole = "customer" | "provider" | "admin" | null

export interface UserProfile {
  id: string
  phone: string
  role: UserRole
  fullName?: string
}

interface AuthContextType {
  user: UserProfile | null
  loading: boolean
  sendOtp: (phone: string) => Promise<boolean>
  verifyOtp: (phone: string, otp: string) => Promise<boolean>
  setRole: (role: UserRole) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.phone || session.user.email || "")
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.phone || session.user.email || "")
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const fetchProfile = async (id: string, phone: string) => {
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", id).single()
    if (profile) {
      setUser({
        id: profile.id,
        phone: profile.phone || phone,
        role: profile.role as UserRole,
        fullName: profile.full_name
      })
    } else {
      // Profile trigger hasn't fired yet or failed, just set minimal
      setUser({ id, phone, role: null })
    }
  }

  const sendOtp = async (phone: string) => {
    // For demo/MVP, if we are simulating payments/auth without a paid Twilio account, 
    // we use Supabase Email magic links disguised as OTP, OR we just use mock OTP locally.
    // Given the prompt "If development OTP/mock auth exists: make sure it is clearly development-only",
    // we will implement real Supabase OTP (which requires config), but fallback to mock if env says so.
    
    if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true") {
      console.warn("[DEVELOPMENT MODE] MOCK OTP SENT. USE 123456.")
      return true
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone: `+91${phone}`,
    })
    
    if (error) {
      console.error("Error sending OTP:", error)
      return false
    }
    return true
  }

  const verifyOtp = async (phone: string, otp: string) => {
    if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true" && otp === "123456") {
      // Mock login for UI development without actual Supabase backend active
      setUser({ id: "mock-id", phone, role: null })
      return true
    }

    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+91${phone}`,
      token: otp,
      type: 'sms',
    })

    if (error || !data.user) {
      console.error("Error verifying OTP:", error)
      return false
    }

    await fetchProfile(data.user.id, phone)
    return true
  }

  const setRole = async (role: UserRole) => {
    if (!user) return

    if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== "true") {
      // Update the profiles table
      const { error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", user.id)
      
      if (error) {
        console.error("Error updating role:", error)
        return
      }
    }

    setUser({ ...user, role })
    
    if (role === "customer") router.push("/customer/home")
    else if (role === "provider") router.push("/provider/dashboard")
    else router.push("/admin/dashboard")
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, loading, sendOtp, verifyOtp, setRole, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
