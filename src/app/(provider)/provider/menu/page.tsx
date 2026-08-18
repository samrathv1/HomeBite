"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2, Save } from "lucide-react"

export default function ProviderMenuPage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [kitchen, setKitchen] = useState<any>(null)
  const [lunchCapacity, setLunchCapacity] = useState("25")
  const [dinnerCapacity, setDinnerCapacity] = useState("20")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { data: kitchenData } = await supabase.from('kitchens').select('*').limit(1).single()
      
      if (kitchenData) {
        setKitchen(kitchenData)
        setLunchCapacity(kitchenData.lunch_capacity?.toString() || "25")
        setDinnerCapacity(kitchenData.dinner_capacity?.toString() || "20")
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const handleSaveCapacity = async () => {
    if (!kitchen) return
    setSaving(true)
    try {
      const { error } = await supabase
        .from('kitchens')
        .update({
          lunch_capacity: parseInt(lunchCapacity),
          dinner_capacity: parseInt(dinnerCapacity)
        })
        .eq('id', kitchen.id)
      
      if (error) throw error
      alert("Capacity updated successfully!")
    } catch (e: any) {
      alert("Error saving capacity: " + e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="animate-in fade-in duration-500 pb-20 max-w-3xl mx-auto flex justify-center items-center h-96 text-[#6F6F6F] animate-pulse">Loading menu...</div>
  }

  if (!kitchen) {
    return <div className="p-8">No kitchen found for this account. Please contact support.</div>
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Menu & Capacity</h1>
          <p className="text-muted-foreground">Manage your weekly offerings and limits.</p>
        </div>
        <Button className="bg-primary text-white hover:bg-primary/90 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Add Menu Item
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Capacity Management */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-border/50 shadow-sm border-secondary/20">
            <CardHeader className="pb-3 bg-secondary/5 rounded-t-xl">
              <CardTitle className="text-lg flex items-center gap-2">
                Daily Capacity Limits
              </CardTitle>
              <CardDescription>
                Maximum meals you can prepare per day.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lunch-cap">Lunch Capacity</Label>
                <div className="flex gap-2">
                  <Input 
                    id="lunch-cap" 
                    type="number" 
                    value={lunchCapacity}
                    onChange={(e) => setLunchCapacity(e.target.value)}
                    className="bg-white"
                  />
                  <div className="flex items-center px-3 border border-border rounded-md bg-muted text-sm text-muted-foreground">
                    Meals
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dinner-cap">Dinner Capacity</Label>
                <div className="flex gap-2">
                  <Input 
                    id="dinner-cap" 
                    type="number" 
                    value={dinnerCapacity}
                    onChange={(e) => setDinnerCapacity(e.target.value)}
                    className="bg-white"
                  />
                  <div className="flex items-center px-3 border border-border rounded-md bg-muted text-sm text-muted-foreground">
                    Meals
                  </div>
                </div>
              </div>
              <Button onClick={handleSaveCapacity} className="w-full mt-2" disabled={saving}>
                {saving ? (
                  "Saving..."
                ) : (
                  <><Save className="w-4 h-4 mr-2" /> Save Capacity</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Menu Planner */}
        <div className="md:col-span-2">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg">This Week's Menu</CardTitle>
                <CardDescription>Plan what you'll cook each day.</CardDescription>
              </div>
              <Button variant="outline" size="sm">Copy Last Week</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-4">
                <div className="border border-border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg">Monday</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Lunch Item */}
                    <div className="flex justify-between items-center bg-muted/50 p-3 rounded-md">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs bg-white">LUNCH</Badge>
                          <span className="font-medium">Homestyle Veg Thali</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">2 Roti, Dal, Sabzi, Rice</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>

                    {/* Dinner Item */}
                    <div className="flex justify-between items-center bg-muted/50 p-3 rounded-md">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs bg-white">DINNER</Badge>
                          <span className="font-medium">Khichdi & Kadhi</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Comfort food, easily digestible</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tuesday */}
                <div className="border border-border rounded-lg p-4 bg-white opacity-60 hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg">Tuesday</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="border border-dashed border-border p-4 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors">
                      <Plus className="w-4 h-4 mr-2" /> Add Lunch
                    </div>
                    <div className="border border-dashed border-border p-4 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors">
                      <Plus className="w-4 h-4 mr-2" /> Add Dinner
                    </div>
                  </div>
                </div>
                
                {/* Visual cue for rest of the week */}
                <div className="text-center py-2 text-sm text-muted-foreground italic">
                  Wednesday - Sunday are empty
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
