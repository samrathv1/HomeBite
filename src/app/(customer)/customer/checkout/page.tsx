"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getKitchenById } from "@/lib/api"
import { Kitchen } from "@/lib/data/kitchens"
import { createClient } from "@/lib/supabase/client"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const kitchenId = searchParams.get('kitchen')
  
  const [kitchen, setKitchen] = useState<Kitchen | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [plan, setPlan] = useState("weekly")
  const supabase = createClient()
  
  useEffect(() => {
    async function loadData() {
      if (kitchenId) {
        const data = await getKitchenById(kitchenId)
        if (data) setKitchen(data)
      }
      setLoading(false)
    }
    loadData()
  }, [kitchenId])

  const handlePayment = async () => {
    if (!kitchen) return
    setProcessing(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert("Please log in to continue")
        router.push("/login")
        return
      }

      const isTrial = plan === 'trial'
      const planType = plan === 'monthly' ? 'Monthly' : 'Weekly'
      
      const price = plan === 'trial' 
        ? kitchen.price + 10 
        : plan === 'weekly' 
          ? kitchen.price * 7 
          : Math.round(kitchen.price * 30 * 0.9)

      // Ensure a customer_profile exists
      const { data: profile } = await supabase.from('customer_profiles').select('id').eq('id', user.id).single()
      if (!profile) {
         await supabase.from('customer_profiles').insert({ id: user.id })
      }

      let subId = null

      if (!isTrial) {
        const { data: sub, error: subErr } = await supabase.from('subscriptions').insert({
          customer_id: user.id,
          kitchen_id: kitchen.id,
          plan_type: planType,
          meal_type: 'Lunch', // Hardcoded for MVP flow
          start_date: new Date().toISOString().split('T')[0],
          status: 'Active',
          price: price
        }).select().single()

        if (subErr) throw subErr
        subId = sub.id
      }

      // Create initial order
      const { error: orderErr } = await supabase.from('orders').insert({
        customer_id: user.id,
        kitchen_id: kitchen.id,
        subscription_id: subId,
        order_type: isTrial ? 'Trial' : 'Subscription',
        meal_type: 'Lunch',
        delivery_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        status: 'Confirmed',
        price: isTrial ? price : kitchen.price
      })

      if (orderErr) throw orderErr

      alert('Payment successful! Your order is confirmed.')
      router.push('/customer/home')
    } catch (err: any) {
      console.error(err)
      alert('Error processing order: ' + err.message)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return <div className="animate-in fade-in duration-500 pb-20 max-w-3xl mx-auto flex justify-center items-center h-96 text-[#6F6F6F] animate-pulse">Loading plans...</div>
  }

  if (!kitchen) {
    return (
      <div className="animate-in fade-in duration-500 pb-20 max-w-3xl mx-auto text-center mt-20">
        <h2 className="heading-lg mb-4">Kitchen not found</h2>
        <button className="btn btn-secondary" onClick={() => router.push('/customer/home')}>Return Home</button>
      </div>
    )
  }

  const basePrice = kitchen.price
  const trialPrice = basePrice + 10
  const weeklyPrice = basePrice * 7
  const monthlyPrice = Math.round(basePrice * 30 * 0.9) // 10% discount

  return (
    <div className="animate-in fade-in duration-500 pb-20 max-w-3xl mx-auto">
      <button 
        className="mb-6 text-sm font-bold text-[#12666A] flex items-center gap-1 hover:underline" 
        onClick={() => router.back()}
      >
        ← Back
      </button>

      <div className="mb-8 pt-2">
        <h1 className="heading-xl text-[#12666A] mb-2">Choose your plan</h1>
        <div className="text-lg text-[#6F6F6F] flex items-center gap-2">
          Subscribing to <strong>{kitchen.name}</strong>
          <span className="text-xs bg-[#FBF6EC] text-[#b66a00] px-2 py-1 rounded-md font-bold">Base: ₹{basePrice}/meal</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div 
          className={`card cursor-pointer transition-all ${plan === 'trial' ? 'border-2 border-[#F47A2A] bg-[#fff6f1]' : 'border border-[#F0EBE3] hover:border-[#F47A2A]/50'}`}
          onClick={() => setPlan('trial')}
        >
          <h3 className="mb-1.5 text-lg font-bold">1-Meal Trial</h3>
          <div className="text-3xl font-black text-[#252525]">₹{trialPrice}</div>
          <p className="text-sm text-[#6F6F6F] mt-2 mb-4">Try the kitchen once before committing.</p>
          <button className={`btn w-full rounded-full ${plan === 'trial' ? 'btn-primary' : 'btn-secondary'}`}>
            {plan === 'trial' ? 'Selected' : 'Choose'}
          </button>
        </div>
        
        <div 
          className={`card cursor-pointer transition-all relative ${plan === 'weekly' ? 'border-2 border-[#F47A2A] bg-[#fff6f1]' : 'border border-[#F0EBE3] hover:border-[#F47A2A]/50'}`}
          onClick={() => setPlan('weekly')}
        >
          <span className="absolute -top-3 -right-3 bg-green-600 text-white text-xs font-black px-2 py-1 rounded-lg transform rotate-6 shadow-md">POPULAR</span>
          <h3 className="mb-1.5 text-lg font-bold">Weekly Plan</h3>
          <div className="text-3xl font-black text-[#252525]">₹{weeklyPrice}</div>
          <p className="text-sm text-[#6F6F6F] mt-2 mb-4">7 days · 1 meal/day</p>
          <button className={`btn w-full rounded-full ${plan === 'weekly' ? 'btn-primary' : 'btn-secondary'}`}>
            {plan === 'weekly' ? 'Selected' : 'Choose'}
          </button>
        </div>
        
        <div 
          className={`card cursor-pointer transition-all relative ${plan === 'monthly' ? 'border-2 border-[#F47A2A] bg-[#fff6f1]' : 'border border-[#F0EBE3] hover:border-[#F47A2A]/50'}`}
          onClick={() => setPlan('monthly')}
        >
          <span className="absolute right-3 top-3 bg-green-100 text-green-700 text-xs font-black px-2 py-1 rounded-md">SAVE 10%</span>
          <h3 className="mb-1.5 text-lg font-bold">Monthly Plan</h3>
          <div className="text-3xl font-black text-[#252525]">₹{monthlyPrice}</div>
          <p className="text-sm text-[#6F6F6F] mt-2 mb-4">30 days · 1 meal/day</p>
          <button className={`btn w-full rounded-full ${plan === 'monthly' ? 'btn-primary' : 'btn-secondary'}`}>
            {plan === 'monthly' ? 'Selected' : 'Choose'}
          </button>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-2">Delivery address</h2>
        <p className="text-sm text-[#6F6F6F] mb-4">Where should we deliver your meals?</p>
        <div className="grid gap-4">
          <input 
            className="w-full p-3 border border-[#F0EBE3] rounded-xl bg-white text-[#252525] focus:outline-none focus:border-[#12666A]" 
            defaultValue="Rahul Sharma" 
            aria-label="Name" 
          />
          <input 
            className="w-full p-3 border border-[#F0EBE3] rounded-xl bg-white text-[#252525] focus:outline-none focus:border-[#12666A]" 
            defaultValue="Flat 402, Green Heights, Andheri West" 
            aria-label="Address" 
          />
          <select className="w-full p-3 border border-[#F0EBE3] rounded-xl bg-white text-[#252525] focus:outline-none focus:border-[#12666A]">
            <option>Hostel</option>
            <option>Flat</option>
            <option>Office</option>
          </select>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Payment</h2>
        <div className="flex gap-2 flex-wrap mb-6">
          <button className="pill active">UPI · GPay / PhonePe</button>
          <button className="pill">Card</button>
          <button className="pill">Net Banking</button>
        </div>
        <div className="bg-[#FBF6EC] p-6 rounded-2xl">
          <div className="grid gap-3">
            <div className="flex justify-between">
              <span className="text-[#6F6F6F] text-sm">Plan</span>
              <b className="text-[#252525]">{plan === 'trial' ? `₹${trialPrice}` : plan === 'weekly' ? `₹${weeklyPrice}` : `₹${monthlyPrice}`}</b>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6F6F6F] text-sm">Delivery</span>
              <span className="text-green-600 font-bold">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6F6F6F] text-sm">Platform fee</span>
              <span className="text-[#252525]">₹10</span>
            </div>
            <hr className="w-full border-0 border-t border-gray-300 my-2" />
            <div className="flex justify-between text-xl">
              <b className="text-[#252525]">Total</b>
              <b className="text-[#12666A]">{plan === 'trial' ? `₹${trialPrice + 10}` : plan === 'weekly' ? `₹${weeklyPrice + 10}` : `₹${monthlyPrice + 10}`}</b>
            </div>
          </div>
        </div>
        
        <button 
          className={`btn btn-primary w-full mt-6 py-4 text-lg rounded-full ${processing ? 'opacity-50 cursor-not-allowed' : ''}`} 
          onClick={handlePayment}
          disabled={processing}
        >
          {processing ? 'Processing Payment...' : 'Pay & Start Subscription'}
        </button>
        <p className="text-center text-xs text-[#6F6F6F] mt-3">By proceeding, you agree to our terms of service.</p>
      </div>
    </div>
  )
}
