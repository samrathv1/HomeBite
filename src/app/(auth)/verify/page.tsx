"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

function VerifyForm() {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const searchParams = useSearchParams()
  const phone = searchParams.get("phone")
  const { verifyOtp } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!phone) {
      router.push("/login")
    }
  }, [phone, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6 || !phone) return

    setLoading(true)
    setError("")
    try {
      const success = await verifyOtp(phone, otp)
      if (success) {
        router.push("/role-selection")
      } else {
        setError("That verification code is incorrect or expired. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!phone) return null

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-xl border-border/50 relative">
        <Link href="/login" className="absolute top-4 left-4 text-muted-foreground hover:text-foreground">
          <ArrowLeft size={20} />
        </Link>
        <CardHeader className="text-center pb-6 pt-10">
          <CardTitle className="text-2xl font-bold">Verify Phone</CardTitle>
          <CardDescription className="text-base mt-2">
            Enter the 6-digit code sent to <br/>
            <span className="font-semibold text-foreground">+91 {phone}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="sr-only">OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="• • • • • •"
                className="text-center text-2xl tracking-[0.5em] font-mono h-14"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
              />
              {error && <p className="text-sm text-destructive text-center mt-2">{error}</p>}
            </div>
            
            <Button type="submit" className="w-full h-12 text-base" disabled={otp.length !== 6 || loading}>
              {loading ? "Verifying..." : "Verify & Continue"}
            </Button>
            
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyForm />
    </Suspense>
  )
}
