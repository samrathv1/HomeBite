"use client"

import { useState } from "react"
import { useAuth, UserRole } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils, ChefHat } from "lucide-react"

export default function RoleSelectionPage() {
  const { setRole, loading } = useAuth()
  const [selectedRole, setSelectedRole] = useState<UserRole>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleContinue = async () => {
    if (!selectedRole) return
    setIsSubmitting(true)
    setError(null)
    const success = await setRole(selectedRole)
    if (!success) {
      setError("Failed to save role. Please check your database connection.")
      setIsSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-lg shadow-xl border-border/50">
        <CardHeader className="text-center pb-8 pt-10">
          <CardTitle className="text-2xl font-bold">How do you want to use HomeBite?</CardTitle>
          <CardDescription className="text-base mt-2">
            Select your primary goal to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Customer Option */}
            <button
              type="button"
              onClick={() => setSelectedRole("customer")}
              className={`flex flex-col items-center text-center p-6 rounded-2xl border-2 transition-all ${
                selectedRole === "customer" 
                  ? "border-primary bg-primary/5 shadow-md" 
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                selectedRole === "customer" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              }`}>
                <Utensils size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Find Home-Cooked Food</h3>
              <p className="text-sm text-muted-foreground">I want fresh meals near me.</p>
            </button>

            {/* Provider Option */}
            <button
              type="button"
              onClick={() => setSelectedRole("provider")}
              className={`flex flex-col items-center text-center p-6 rounded-2xl border-2 transition-all ${
                selectedRole === "provider" 
                  ? "border-secondary bg-secondary/5 shadow-md" 
                  : "border-border hover:border-secondary/50 hover:bg-muted/50"
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                selectedRole === "provider" ? "bg-secondary text-white" : "bg-muted text-muted-foreground"
              }`}>
                <ChefHat size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Provide Home-Cooked Food</h3>
              <p className="text-sm text-muted-foreground">I want to cook and earn.</p>
            </button>
          </div>
          
          <div className="pt-4">
            {error && (
              <div className="text-sm text-destructive text-center mb-4 p-3 bg-destructive/10 rounded-md">
                {error}
              </div>
            )}
            <Button 
              className="w-full h-14 text-lg" 
              disabled={!selectedRole || isSubmitting}
              onClick={handleContinue}
            >
              {isSubmitting ? "Setting up..." : "Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
