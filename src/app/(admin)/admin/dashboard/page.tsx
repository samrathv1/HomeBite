"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Store, ClipboardList, CheckCircle2, XCircle } from "lucide-react"

export default function AdminDashboard() {
  const [pendingProviders, setPendingProviders] = useState([
    { id: "p1", name: "Rani's Kitchen", chef: "Rani Desai", location: "Baner, Pune", applied: "2 hours ago" },
    { id: "p2", name: "Swad Tiffins", chef: "Kiran P.", location: "Viman Nagar, Pune", applied: "Yesterday" }
  ])

  const handleApprove = (id: string) => {
    setPendingProviders(prev => prev.filter(p => p.id !== id))
    alert("Provider approved successfully. They are now live on the platform.")
  }

  const handleReject = (id: string) => {
    setPendingProviders(prev => prev.filter(p => p.id !== id))
    alert("Provider rejected.")
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
        <p className="text-slate-500">Manage kitchens, users, and platform health.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Kitchens</CardTitle>
            <Store className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">42</div>
            <p className="text-xs text-green-600 mt-1 font-medium">+3 this week</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Subscribers</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1,204</div>
            <p className="text-xs text-green-600 mt-1 font-medium">+15% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Orders Today</CardTitle>
            <ClipboardList className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">856</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Lunch: 502, Dinner: 354</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Approvals</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingProviders.length}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Kitchens awaiting review</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Provider Verification</CardTitle>
            <CardDescription>Review and approve new kitchen applications.</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingProviders.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <CheckCircle2 size={40} className="mx-auto mb-3 text-slate-300" />
                <p>All caught up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingProviders.map(p => (
                  <div key={p.id} className="border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div>
                      <h4 className="font-bold text-slate-900">{p.name}</h4>
                      <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                        <span>{p.chef}</span> • <span>{p.location}</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">Applied: {p.applied}</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleReject(p.id)}>
                        <XCircle size={16} className="mr-1.5" /> Reject
                      </Button>
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(p.id)}>
                        <CheckCircle2 size={16} className="mr-1.5" /> Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Automated sync checks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-sm font-medium text-slate-700">Payment Gateway</span>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Simulated / Active</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-sm font-medium text-slate-700">SMS / OTP Service</span>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Mock Mode</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-sm font-medium text-slate-700">Database (Supabase)</span>
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none">Unlinked / Local</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
