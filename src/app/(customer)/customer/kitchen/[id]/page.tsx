"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getKitchenById } from "@/lib/api"
import { Kitchen } from "@/lib/data/kitchens"
import { useLocation } from "@/contexts/LocationContext"

export default function KitchenProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { location } = useLocation()
  const [kitchen, setKitchen] = useState<Kitchen | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadKitchen() {
      setLoading(true)
      const data = await getKitchenById(id, location?.lat, location?.lng)
      if (data) setKitchen(data)
      setLoading(false)
    }
    loadKitchen()
  }, [id, location])

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const tomorrowStr = days[(new Date().getDay() + 1) % 7];
  const tomorrowMenu = kitchen?.weeklyMenu?.[tomorrowStr];

  if (loading) {
    return (
      <div className="animate-in fade-in duration-500 pb-20 max-w-3xl mx-auto flex justify-center items-center h-96">
        <div className="text-[#6F6F6F] text-lg animate-pulse">Loading kitchen details...</div>
      </div>
    )
  }

  if (!kitchen) {
    return (
      <div className="animate-in fade-in duration-500 pb-20 max-w-3xl mx-auto text-center mt-20">
        <h2 className="heading-lg text-[#252525] mb-4">Kitchen not found</h2>
        <button className="btn btn-secondary" onClick={() => router.push('/customer/home')}>Return Home</button>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-500 pb-20 max-w-3xl mx-auto">
      <button 
        className="mb-6 text-sm font-bold text-[#12666A] flex items-center gap-1 hover:underline" 
        onClick={() => router.push('/customer/home')}
      >
        ← Back to Home
      </button>
      
      {/* Kitchen Header */}
      <div className="card p-0 overflow-hidden mb-8 rounded-3xl shadow-sm border-none relative">
        <div className="relative w-full h-[280px]">
          <Image src={kitchen.imageUrl} alt={kitchen.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8">
            <div className="flex gap-2 mb-3">
              {kitchen.verified && <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded w-fit">✓ Verified</span>}
              {!kitchen.availability.lunch && !kitchen.availability.dinner && <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded w-fit">Closed Today</span>}
            </div>
            <h1 className="text-4xl font-black text-white mb-2">{kitchen.name}</h1>
            <div className="text-white/90 flex flex-wrap items-center gap-3 text-sm font-medium">
              <span className="text-[#F47A2A] font-bold bg-white/20 px-2 py-0.5 rounded">★ {kitchen.rating}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className={`w-3 h-3 rounded-sm border ${kitchen.diet === 'Veg' ? 'border-green-400' : 'border-red-400'} flex items-center justify-center shrink-0`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${kitchen.diet === 'Veg' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                </span>
                {kitchen.cuisine}
              </span>
              <span>•</span>
              <span>{kitchen.distance} km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chef Story & Tags Section */}
      <section className="mb-12 px-2">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-24 h-24 rounded-full overflow-hidden relative shrink-0 border-4 border-white shadow-md">
            <Image src={kitchen.chefImageUrl} alt={kitchen.chefName} fill className="object-cover" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Meet {kitchen.chefName}</h3>
            <p className="text-[#6F6F6F] leading-relaxed italic mb-4">"{kitchen.story}"</p>
            
            {/* Customization Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                <span>✓</span> No Preservatives
              </span>
              {kitchen.diet === "Veg" && (
                <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                  <span>✓</span> No Onion/Garlic on Request
                </span>
              )}
              {kitchen.cuisine.includes("Healthy") && (
                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                  <span>✓</span> Customized Macros
                </span>
              )}
              <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                <span>✓</span> Accepts spice preferences
              </span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Today's Menu Section */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-[#252525] mb-2 uppercase">
            Today's Menu
            <span className="inline-block border-2 border-[#12666A] rounded-sm w-4 h-4 ml-3 align-middle relative -top-1">
              <span className="absolute inset-[2px] bg-[#12666A] rounded-full"></span>
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lunch Menu */}
          {kitchen.todayMenu.lunch && (
            <div className="card rounded-3xl border-2 border-[#F0EBE3] shadow-sm relative overflow-hidden">
              {kitchen.capacity.lunch === 0 && kitchen.availability.lunch && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="bg-red-600 text-white font-bold py-2 px-6 rounded-full transform -rotate-12 text-lg shadow-lg">
                    SOLD OUT
                  </div>
                </div>
              )}
              <div className="flex justify-between items-start mb-4 border-b border-[#F0EBE3] pb-4">
                <div>
                  <h3 className="font-bold text-xl text-[#252525]">Lunch</h3>
                  <p className="text-sm text-[#6F6F6F]">Order by {kitchen.cutoffs.lunch}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#12666A]">₹{kitchen.todayMenu.lunch.price}</div>
                  <div className="text-xs text-[#F47A2A]">{kitchen.capacity.lunch} left</div>
                </div>
              </div>
              <h4 className="font-bold text-[#E65C00] mb-2">{kitchen.todayMenu.lunch.name}</h4>
              <ul className="space-y-2 mb-4">
                {kitchen.todayMenu.lunch.items.map((item, idx) => (
                  <li key={idx} className="text-[#6F6F6F] flex items-center gap-2 text-sm">
                    <span className="text-xs text-gray-300">●</span> {item}
                  </li>
                ))}
              </ul>
              {kitchen.todayMenu.lunch.description && (
                <div className="text-xs italic text-[#6F6F6F] bg-[#FBF6EC] p-3 rounded-xl">
                  {kitchen.todayMenu.lunch.description}
                </div>
              )}
            </div>
          )}

          {/* Dinner Menu */}
          {kitchen.todayMenu.dinner && (
            <div className="card rounded-3xl border-2 border-[#F0EBE3] shadow-sm relative overflow-hidden">
              {kitchen.capacity.dinner === 0 && kitchen.availability.dinner && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="bg-red-600 text-white font-bold py-2 px-6 rounded-full transform -rotate-12 text-lg shadow-lg">
                    SOLD OUT
                  </div>
                </div>
              )}
              <div className="flex justify-between items-start mb-4 border-b border-[#F0EBE3] pb-4">
                <div>
                  <h3 className="font-bold text-xl text-[#252525]">Dinner</h3>
                  <p className="text-sm text-[#6F6F6F]">Order by {kitchen.cutoffs.dinner}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#12666A]">₹{kitchen.todayMenu.dinner.price}</div>
                  <div className="text-xs text-[#F47A2A]">{kitchen.capacity.dinner} left</div>
                </div>
              </div>
              <h4 className="font-bold text-[#E65C00] mb-2">{kitchen.todayMenu.dinner.name}</h4>
              <ul className="space-y-2 mb-4">
                {kitchen.todayMenu.dinner.items.map((item, idx) => (
                  <li key={idx} className="text-[#6F6F6F] flex items-center gap-2 text-sm">
                    <span className="text-xs text-gray-300">●</span> {item}
                  </li>
                ))}
              </ul>
              {kitchen.todayMenu.dinner.description && (
                <div className="text-xs italic text-[#6F6F6F] bg-[#FBF6EC] p-3 rounded-xl">
                  {kitchen.todayMenu.dinner.description}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Subscription CTA Section */}
      <section className="mb-12">
        <div className="bg-[#12666A] rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl"></div>
          
          <div className="text-white z-10 md:w-2/3">
            <span className="badge bg-white/20 text-white border-none mb-4">WEEKLY SUBSCRIPTION</span>
            <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight">Never worry about "What's for dinner?"</h3>
            <p className="text-white/80 mb-6">Subscribe to {kitchen.name} and get guaranteed fresh meals delivered daily. Skip days easily.</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm font-medium">
              <div className="flex items-center gap-2">✓ Fixed time delivery</div>
              <div className="flex items-center gap-2">✓ Menu rotation</div>
              <div className="flex items-center gap-2">✓ Pause anytime</div>
              <div className="flex items-center gap-2">✓ Free delivery</div>
            </div>
          </div>
          
          <div className="z-10 w-full md:w-1/3 flex flex-col gap-4">
            <button 
              className="btn bg-[#F47A2A] text-white hover:bg-[#E65C00] border-none shadow-lg py-4 font-bold text-lg rounded-full w-full relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12"></div>
              Try 1 Meal @ ₹{kitchen.todayMenu.lunch?.price || kitchen.todayMenu.dinner?.price || 109}
            </button>
            <button 
              className="btn bg-white/10 text-white hover:bg-white/20 border border-white/30 py-3 rounded-full w-full flex flex-col items-center leading-tight"
              onClick={() => router.push(`/customer/checkout?kitchen=${kitchen.id}`)}
            >
              <span className="font-bold">Subscribe Weekly</span>
              <span className="text-xs text-white/70">Save 10% on all meals</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plan Tomorrow */}
      {tomorrowMenu && (tomorrowMenu.lunch || tomorrowMenu.dinner) && (
        <section className="mb-12">
          <div className="bg-[#FBF6EC] border border-[#F0EBE3] rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📅</span>
                <h3 className="text-xl font-bold text-[#252525]">Plan Tomorrow's {tomorrowStr}</h3>
              </div>
              <p className="text-sm text-[#6F6F6F] max-w-sm">
                Book now to guarantee your meal. Slots for popular home chefs fill up by 9 AM.
              </p>
            </div>
            <div className="flex gap-4">
              {tomorrowMenu.lunch && (
                <div className="bg-white px-4 py-3 rounded-xl border border-[#F0EBE3] min-w-[140px]">
                  <div className="text-[10px] uppercase font-bold text-[#F47A2A] mb-1">Lunch</div>
                  <div className="font-bold text-sm text-[#252525] line-clamp-1">{tomorrowMenu.lunch.name}</div>
                </div>
              )}
              {tomorrowMenu.dinner && (
                <div className="bg-white px-4 py-3 rounded-xl border border-[#F0EBE3] min-w-[140px]">
                  <div className="text-[10px] uppercase font-bold text-[#F47A2A] mb-1">Dinner</div>
                  <div className="font-bold text-sm text-[#252525] line-clamp-1">{tomorrowMenu.dinner.name}</div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Weekly Menu Preview */}
      <section className="mb-16">
        <h3 className="text-2xl font-bold mb-6">Menu Highlights this Week</h3>
        <div className="overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-4">
            {Object.entries(kitchen.weeklyMenu).map(([day, meals]) => {
              // Only show days that have menus configured
              if (!meals.lunch && !meals.dinner) return null;
              
              return (
                <div key={day} className="card rounded-2xl min-w-[240px] border border-[#F0EBE3] shadow-sm flex-shrink-0">
                  <div className="font-bold text-[#12666A] mb-3 pb-2 border-b border-[#F0EBE3]">{day}</div>
                  {meals.lunch && (
                    <div className="mb-3">
                      <div className="text-xs text-[#6F6F6F] font-bold uppercase mb-1">Lunch</div>
                      <div className="text-sm font-medium">{meals.lunch.name}</div>
                    </div>
                  )}
                  {meals.dinner && (
                    <div>
                      <div className="text-xs text-[#6F6F6F] font-bold uppercase mb-1">Dinner</div>
                      <div className="text-sm font-medium">{meals.dinner.name}</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
