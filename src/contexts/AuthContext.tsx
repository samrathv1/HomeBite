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
  setRole: (role: UserRole) => Promise<boolean>
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
    // Rely exclusively on Supabase for Auth
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
    if (!user) return false

    // Update the profiles table
    const { error } = await supabase
      .from("profiles")
      .update({ 
        full_name: user.fullName || "User",
        role 
      })
      .eq("id", user.id)
    
    if (error) {
      console.error("Error updating role:", error)
      return false
    }
    
    // Fetch fresh profile data to ensure state is in sync
    await fetchProfile(user.id, user.phone)
    router.refresh()
    
    if (role === "customer") router.push("/customer/home")
    else if (role === "provider") router.push("/provider/dashboard")
    else router.push("/admin/dashboard")

    return true
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
