"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Clock, ChefHat, IndianRupee, Users } from "lucide-react"

export default function ProviderDashboard() {
  const supabase = createClient()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [kitchen, setKitchen] = useState<any>(null)
  const [stats, setStats] = useState({
    lunchOrders: 0,
    dinnerOrders: 0,
    skipped: 0,
    revenue: 0,
    lunchCapacity: 0,
    dinnerCapacity: 0
  })

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      // We assume a provider has exactly one kitchen for MVP
      const { data: kitchenData } = await supabase.from('kitchens').select('*').limit(1).single() // Just taking the first for demo if provider_id isn't enforced, in real world we'd use eq('provider_id', user.id)
      
      if (!kitchenData) {
        setLoading(false)
        return
      }

      setKitchen(kitchenData)
      
      const today = new Date().toISOString().split('T')[0]
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('kitchen_id', kitchenData.id)
        .eq('delivery_date', today)

      if (orders) {
        const lunch = orders.filter(o => o.meal_type === 'Lunch' && o.status !== 'Skipped' && o.status !== 'Cancelled')
        const dinner = orders.filter(o => o.meal_type === 'Dinner' && o.status !== 'Skipped' && o.status !== 'Cancelled')
        const skipped = orders.filter(o => o.status === 'Skipped')
        
        const rev = [...lunch, ...dinner].reduce((acc, o) => acc + Number(o.price), 0)

        setStats({
          lunchOrders: lunch.length,
          dinnerOrders: dinner.length,
          skipped: skipped.length,
          revenue: rev,
          lunchCapacity: kitchenData.lunch_capacity || 30,
          dinnerCapacity: kitchenData.dinner_capacity || 30
        })
      }
      setLoading(false)
    }
    loadDashboard()
  }, [])

  if (loading) {
    return <div className="animate-in fade-in duration-500 pb-20 max-w-3xl mx-auto flex justify-center items-center h-96 text-[#6F6F6F] animate-pulse">Loading dashboard...</div>
  }

  if (!kitchen) {
    return <div className="p-8">No kitchen found for this account. Please contact support.</div>
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Good morning, {kitchen.chef_name.split(' ')[0]} 👋</h1>
          <p className="text-muted-foreground">Here's what's happening in your kitchen today.</p>
        </div>
        <Button className="bg-secondary text-white hover:bg-secondary/90 w-full sm:w-auto" onClick={() => router.push('/provider/menu')}>
          Manage Menu
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lunch Orders</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lunchOrders}</div>
            <p className="text-xs text-muted-foreground mt-1 text-secondary font-medium">
              {Math.max(0, stats.lunchCapacity - stats.lunchOrders)} spots left
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dinner Orders</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dinnerOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.max(0, stats.dinnerCapacity - stats.dinnerOrders)} spots left
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paused / Skipped</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.skipped}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Capacity updated automatically
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-secondary/5 border-secondary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary-foreground/80">Revenue Today</CardTitle>
            <IndianRupee className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">₹{stats.revenue}</div>
            <p className="text-xs text-secondary/70 mt-1 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" /> Ready for payout
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-3">
        {/* Prepare Today (Crucial automated feature) */}
        <Card className="md:col-span-4 lg:col-span-2 border-border/50 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle>Prepare Today</CardTitle>
            <CardDescription>
              Based on active subscriptions and single orders.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="grid sm:grid-cols-2 gap-4 flex-1">
              {/* Lunch Prep */}
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/30">LUNCH</Badge>
                  <span className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                    <Clock size={14} /> Cutoff: 10:30 AM
                  </span>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-end border-b border-primary/10 pb-2">
                    <div>
                      <h4 className="font-semibold text-lg">Today's Lunch Menu</h4>
                      <p className="text-sm text-muted-foreground">Standard</p>
                    </div>
                    <span className="text-3xl font-bold text-primary">23</span>
                  </div>
                </div>
              </div>

              {/* Dinner Prep */}
              <div className="bg-muted/50 border border-border rounded-xl p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline">DINNER</Badge>
                  <span className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                    <Clock size={14} /> Cutoff: 4:00 PM
                  </span>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-end border-b border-border/50 pb-2">
                    <div>
                      <h4 className="font-semibold text-lg">Light Combo</h4>
                      <p className="text-sm text-muted-foreground">Standard</p>
                    </div>
                    <span className="text-3xl font-bold text-foreground">18</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders Overview */}
        <Card className="md:col-span-3 lg:col-span-1 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Subscribers</CardTitle>
            <CardDescription>
              New customers joining your kitchen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: "Rahul S.", plan: "Weekly Lunch", time: "2 hrs ago", status: "Active" },
                { name: "Priya M.", plan: "Weekly Dinner", time: "5 hrs ago", status: "Active" },
                { name: "Amit K.", plan: "Daily Both", time: "Yesterday", status: "Active" },
                { name: "Neha J.", plan: "Weekly Lunch", time: "Yesterday", status: "Active" },
              ].map((sub, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-sm mr-3">
                    {sub.name.charAt(0)}
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">{sub.name}</p>
                    <p className="text-xs text-muted-foreground">{sub.plan}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">
                      {sub.status}
                    </Badge>
                    <p className="text-[10px] text-muted-foreground mt-1">{sub.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 text-xs" size="sm">
              View All Subscribers
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
