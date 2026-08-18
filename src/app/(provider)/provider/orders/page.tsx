"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Phone, CheckCircle2, ChevronRight, Filter } from "lucide-react"

type OrderStatus = "New" | "Preparing" | "Ready" | "Out for Delivery" | "Delivered"

interface Order {
  id: string
  customerName: string
  address: string
  phone: string
  mealName: string
  status: OrderStatus
  type: "Lunch" | "Dinner"
  plan: "Weekly" | "Trial"
}

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    { id: "o1", customerName: "Rahul Sharma", address: "Flat 402, Shivam Society, Kothrud", phone: "9876543210", mealName: "Veg Thali", status: "Preparing", type: "Lunch", plan: "Weekly" },
    { id: "o2", customerName: "Priya M.", address: "Hostel 3, MIT College", phone: "9876543211", mealName: "Veg Thali", status: "New", type: "Lunch", plan: "Weekly" },
    { id: "o3", customerName: "Amit Kumar", address: "Tech Park, Baner", phone: "9876543212", mealName: "Non-Veg Thali", status: "Out for Delivery", type: "Lunch", plan: "Trial" },
    { id: "o4", customerName: "Neha J.", address: "Silver Apartments, Kothrud", phone: "9876543213", mealName: "Veg Thali", status: "Delivered", type: "Lunch", plan: "Weekly" },
  ])

  const [activeTab, setActiveTab] = useState("all")

  const updateStatus = (id: string, newStatus: OrderStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o))
  }

  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case "New": return "bg-blue-100 text-blue-800 border-blue-200"
      case "Preparing": return "bg-orange-100 text-orange-800 border-orange-200"
      case "Ready": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Out for Delivery": return "bg-purple-100 text-purple-800 border-purple-200"
      case "Delivered": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredOrders = orders.filter(o => {
    if (activeTab === "all") return true
    if (activeTab === "active") return o.status !== "Delivered"
    if (activeTab === "delivered") return o.status === "Delivered"
    return true
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Today's Deliveries</h1>
          <p className="text-muted-foreground">Manage order statuses and delivery.</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="lunch">
            <SelectTrigger className="w-[120px] bg-white">
              <SelectValue placeholder="Meal Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="bg-white shrink-0">
            <Filter size={18} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="active">Active ({orders.filter(o => o.status !== "Delivered").length})</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-border border-dashed">
              <CheckCircle2 size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-foreground">No orders to show</h3>
              <p className="text-muted-foreground">You're all caught up for this view.</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <Card key={order.id} className="border-border/50 shadow-sm overflow-hidden bg-white">
                <div className="flex flex-col sm:flex-row">
                  {/* Info Section */}
                  <div className="p-4 sm:p-5 flex-1 border-b sm:border-b-0 sm:border-r border-border/50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{order.customerName}</h3>
                        <Badge variant="secondary" className="text-[10px] font-normal px-1.5 py-0">
                          {order.plan}
                        </Badge>
                      </div>
                      <Badge variant="outline" className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm font-medium text-foreground mb-3">{order.mealName} ({order.type})</p>
                    
                    <div className="space-y-1.5 text-sm text-muted-foreground">
                      <p className="flex items-start gap-2">
                        <MapPin size={16} className="shrink-0 mt-0.5" /> 
                        <span className="line-clamp-2">{order.address}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone size={16} className="shrink-0" /> 
                        {order.phone}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action Section */}
                  <div className="p-4 sm:p-5 sm:w-64 bg-muted/20 flex flex-col justify-center">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Update Status</p>
                    <Select 
                      value={order.status} 
                      onValueChange={(val) => updateStatus(order.id, val as OrderStatus)}
                    >
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Preparing">Preparing</SelectItem>
                        <SelectItem value="Ready">Ready for Pickup</SelectItem>
                        <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {order.status !== "Delivered" && (
                      <Button 
                        className="w-full mt-3 gap-1"
                        variant={order.status === "Out for Delivery" ? "default" : "outline"}
                        onClick={() => {
                          const nextStatus: Record<OrderStatus, OrderStatus> = {
                            "New": "Preparing",
                            "Preparing": "Ready",
                            "Ready": "Out for Delivery",
                            "Out for Delivery": "Delivered",
                            "Delivered": "Delivered"
                          }
                          updateStatus(order.id, nextStatus[order.status])
                        }}
                      >
                        {order.status === "Out for Delivery" ? "Mark Delivered" : "Next Step"} <ChevronRight size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
