"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UtensilsCrossed } from "lucide-react"

export default function LoginPage() {
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const { sendOtp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length < 10) return

    setLoading(true)
    try {
      const success = await sendOtp(phone)
      if (success) {
        // In a real app we'd pass the phone number securely or via state management,
        // using URL params for simplicity in this MVP.
        router.push(`/verify?phone=${encodeURIComponent(phone)}`)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
            <UtensilsCrossed size={24} />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to HomeBite</CardTitle>
          <CardDescription className="text-base mt-2">
            Enter your phone number to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex">
                <div className="bg-muted px-3 flex items-center border border-r-0 border-input rounded-l-md text-muted-foreground">
                  +91
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  className="rounded-l-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  required
                  maxLength={10}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full h-12 text-base" disabled={phone.length < 10 || loading}>
              {loading ? "Sending OTP..." : "Continue"}
            </Button>
            
            <p className="text-sm text-center text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
