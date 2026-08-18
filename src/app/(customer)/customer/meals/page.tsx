"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function MealsPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [processing, setProcessing] = useState(false)

  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const today = new Date().getDate()

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      // Fetch active subscription
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*, kitchens(name, emoji)')
        .eq('customer_id', user.id)
        .eq('status', 'Active')
        .single()
      
      if (subData) {
        setSubscription(subData)
        // Fetch upcoming orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .eq('subscription_id', subData.id)
          .gte('delivery_date', new Date().toISOString().split('T')[0])
          .order('delivery_date', { ascending: true })
        
        setOrders(ordersData || [])
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const togglePause = async () => {
    if (!subscription) return
    setProcessing(true)
    try {
      const newStatus = subscription.status === 'Active' ? 'Paused' : 'Active'
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: newStatus })
        .eq('id', subscription.id)
      
      if (error) throw error
      setSubscription({ ...subscription, status: newStatus })
    } catch (e: any) {
      alert("Error pausing subscription: " + e.message)
    } finally {
      setProcessing(false)
    }
  }

  const toggleSkipDate = async (day: number) => {
    if (!subscription || day < today) return
    
    // Construct the actual date for this day
    const dateObj = new Date()
    dateObj.setDate(day)
    const dateStr = dateObj.toISOString().split('T')[0]
    
    // Check if we already have an order record for this date
    const existingOrder = orders.find(o => o.delivery_date === dateStr)
    
    setProcessing(true)
    try {
      if (existingOrder) {
        const newStatus = existingOrder.status === 'Skipped' ? 'Confirmed' : 'Skipped'
        await supabase.from('orders').update({ status: newStatus }).eq('id', existingOrder.id)
        setOrders(orders.map(o => o.id === existingOrder.id ? { ...o, status: newStatus } : o))
      } else {
        // Create a new order explicitly marked as skipped
        const { data: newOrder } = await supabase.from('orders').insert({
          customer_id: subscription.customer_id,
          kitchen_id: subscription.kitchen_id,
          subscription_id: subscription.id,
          order_type: 'Subscription',
          meal_type: subscription.meal_type,
          delivery_date: dateStr,
          status: 'Skipped',
          price: subscription.price
        }).select().single()
        
        if (newOrder) setOrders([...orders, newOrder])
      }
    } catch (e) {
      console.error(e)
      alert("Failed to update schedule")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return <div className="animate-in fade-in duration-500 pb-20 max-w-3xl mx-auto flex justify-center items-center h-96 text-[#6F6F6F] animate-pulse">Loading meals...</div>
  }

  const isPaused = subscription?.status === 'Paused'

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="topbar">
        <div>
          <div className="location">📍 Mumbai, Maharashtra</div>
          <h1>Subscriptions</h1>
          <div className="muted small">Plan your meals around your life.</div>
        </div>
        <div className="avatar">R</div>
      </div>

      <div className="grid md:grid-cols-[1.35fr_0.8fr] gap-[18px]">
        <section>
          <div className="card">
            <div className="sectionhead flex justify-between items-center">
              <div>
                <h2 className="text-xl">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <span className="small muted">Weekly Plan Schedule</span>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-[7px] mt-2 mb-4">
              {["M", "T", "W", "T", "F", "S", "S"].map((x, i) => (
                <div key={i} className="text-center text-muted text-[11px] p-1.5">{x}</div>
              ))}
              {days.map((d) => {
                const isPast = d < today
                const dateObj = new Date()
                dateObj.setDate(d)
                const dateStr = dateObj.toISOString().split('T')[0]
                const order = orders.find(o => o.delivery_date === dateStr)
                const isSkipped = order?.status === 'Skipped' || (isPaused && !isPast)
                const isDeliveryDay = subscription && !isPast && !isSkipped // Simplify logic
                
                return (
                  <button 
                    key={d} 
                    onClick={() => !isPast && toggleSkipDate(d)}
                    disabled={processing || isPast}
                    className={`min-h-[56px] border border-line rounded-[10px] bg-white p-[7px] relative ${
                      isPast ? 'opacity-40 cursor-not-allowed' : 'hover:border-[#12666A] cursor-pointer'
                    } ${
                      isSkipped ? 'bg-[#eee] text-[#aaa] line-through' : ''
                    } ${
                      isDeliveryDay ? 'after:content-[\'\'] after:w-[7px] after:h-[7px] after:bg-green-500 after:rounded-full after:absolute after:bottom-2 after:left-1/2 after:-translate-x-1/2' : ''
                    }`}
                  >
                    <span className="text-sm">{d}</span>
                  </button>
                )
              })}
            </div>
            
            {subscription && (
              <button 
                className={`pause-btn w-full py-3 rounded-xl border ${isPaused ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-50 text-red-700 border-red-200'} font-bold transition-colors disabled:opacity-50`} 
                onClick={togglePause}
                disabled={processing}
              >
                {isPaused ? '▶ Resume Entire Subscription' : '⏸ Pause Entire Subscription'}
              </button>
            )}
            {!subscription && (
              <div className="text-center p-6 text-[#6F6F6F] bg-[#FBF6EC] rounded-xl">
                No active subscriptions found. Browse kitchens to start one!
              </div>
            )}
          </div>
        </section>

        {subscription && (
          <section className="mt-6 md:mt-0">
            <div className="card">
              <div className="eyebrow mb-1">Active subscription</div>
              <h2 className="text-xl mb-1">{subscription.kitchens?.emoji} {subscription.kitchens?.name}</h2>
              <p className="muted text-sm mb-4">{subscription.plan_type} Plan · 1 meal/day</p>
              
              <div className="grid grid-cols-3 gap-2.5">
                <div className="stat !p-3">
                  <span className="small muted">Next meal</span>
                  <strong className="text-lg text-[#12666A]">
                    {orders.find(o => o.status === 'Confirmed' || o.status === 'Preparing')?.delivery_date.slice(8, 10) || 'None'}
                  </strong>
                </div>
                <div className="stat !p-3">
                  <span className="small muted">Status</span>
                  <strong className={`text-lg ${isPaused ? 'text-red-500' : 'text-green-600'}`}>{subscription.status}</strong>
                </div>
                <div className="stat !p-3">
                  <span className="small muted">Plan</span>
                  <strong className="text-lg">{subscription.plan_type}</strong>
                </div>
              </div>
              
              <button className="btn btn-primary w-full mt-4" onClick={() => router.push('/customer/home')}>
                Browse More Kitchens
              </button>
            </div>
            
            <div className="card mt-[22px]">
              <h3 className="text-lg mb-1">Going out of town?</h3>
              <p className="small text-[#6F6F6F] mb-4">Tap on any upcoming date in the calendar to skip that day's meal without cancelling your plan.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
