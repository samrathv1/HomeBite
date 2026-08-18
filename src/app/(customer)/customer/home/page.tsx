"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { getKitchens, searchKitchens } from "@/lib/api"
import { Kitchen } from "@/lib/data/kitchens"
import ChefAvatar from "@/components/ChefAvatar"
import { useLocation } from "@/contexts/LocationContext"

export default function CustomerHomePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [chefs, setChefs] = useState<Kitchen[]>([])
  const [displayChefs, setDisplayChefs] = useState<Kitchen[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("🌟 All")
  
  const { location } = useLocation()
  
  // Mock customer state - toggle this to see subscriber vs guest view
  const hasSubscription = false; 

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const lat = location?.lat
      const lng = location?.lng

      const all = await getKitchens(lat, lng)
      setChefs(all)
      
      const filtered = await searchKitchens(search, filter, lat, lng)
      setDisplayChefs(filtered.slice(0, 3)) // Show top 3 on home
      setLoading(false)
    }
    loadData()
  }, [search, filter, location])

  const filterPills = ["🌟 All", "📍 Near Me", "🌿 Pure Veg", "💰 Under ₹120", "💪 High Protein", "🍱 Lunch", "🌙 Dinner"]

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      
      {/* 1. Greeting + Location */}
      <section className="mb-10">
        <h1 className="heading-xl text-[#12666A] mb-2">Good morning, {user?.fullName?.split(' ')[0] || 'Guest'} 👋</h1>
        <p className="text-lg text-[#6F6F6F]">Fresh home-cooked meals waiting near you.</p>
      </section>

      {/* Subscriber View vs Guest View */}
      {hasSubscription ? (
        <>
          {/* Subscriber Priority: Today's Meal */}
          <section className="mb-12">
            <div className="card p-0 overflow-hidden flex flex-col md:flex-row rounded-3xl">
              <div className="relative w-full md:w-[55%] h-[240px] md:h-[320px]">
                <Image src={chefs[0]?.todayMenu?.lunch?.imageUrl || "/hero-thali.jpg"} alt="Today's Meal" fill className="object-cover" />
              </div>
              <div className="p-8 flex flex-col justify-center flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="eyebrow">YOUR LUNCH TODAY</span>
                  <span className="badge badge-teal">Being Prepared</span>
                </div>
                <h2 className="heading-lg mb-2">{chefs[0]?.todayMenu?.lunch?.name || "Homecooked Thali"}</h2>
                
                <div className="flex items-center gap-3 mt-4 mb-6">
                  <div className="w-10 h-10 rounded-full overflow-hidden relative">
                    <Image src={chefs[0]?.chefImageUrl || "/kitchen-1.jpg"} alt="Chef" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-bold">{chefs[0]?.name || "Home Kitchen"}</p>
                    <div className="text-sm text-[#6F6F6F] flex items-center gap-1">
                      <span className="text-[#F47A2A]">★ {chefs[0]?.rating}</span>
                      <span>•</span>
                      <span>{chefs[0]?.distance} km</span>
                    </div>
                  </div>
                </div>

                <div className="text-sm font-medium text-[#6F6F6F] mb-6">
                  Delivery between 12:30 PM – 1:00 PM
                </div>

                <div className="flex gap-4">
                  <button className="btn btn-primary flex-1 text-sm md:text-base rounded-full">Track Meal</button>
                  <button className="btn btn-secondary flex-1 text-sm md:text-base rounded-full">Skip Today</button>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Stats Row */}
          <section className="mb-12 grid grid-cols-3 gap-4">
            <div className="card bg-[#FBF6EC] border-none !p-5 rounded-3xl">
              <div className="text-2xl mb-2">🍱</div>
              <div className="text-[#6F6F6F] text-sm mb-1">This week</div>
              <div className="font-bold text-xl">5 meals</div>
            </div>
            <div className="card bg-[#FBF6EC] border-none !p-5 rounded-3xl">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-[#6F6F6F] text-sm mb-1">Saved</div>
              <div className="font-bold text-xl">₹420</div>
            </div>
            <div className="card bg-[#FBF6EC] border-none !p-5 rounded-3xl">
              <div className="text-2xl mb-2">📅</div>
              <div className="text-[#6F6F6F] text-sm mb-1">Active Plan</div>
              <div className="font-bold text-xl">Weekly</div>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Guest Priority: Search & Filters */}
          <section className="mb-12">
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
              <input 
                type="text" 
                placeholder="Search home chefs, dishes or cuisines..."
                className="w-full bg-white border border-[#F0EBE3] rounded-full py-4 pl-12 pr-4 text-[#252525] focus:outline-none focus:border-[#12666A] shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full">
                ⚙️
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {filterPills.map((pill) => (
                <button 
                  key={pill} 
                  className={`pill ${filter === pill ? 'active' : ''}`}
                  onClick={() => setFilter(pill)}
                >
                  {pill}
                </button>
              ))}
            </div>
          </section>

          {/* Home food near you */}
          <section className="mb-16">
            <div className="mb-6 flex justify-between items-end">
              <div>
                <h2 className="heading-lg font-heading mb-1">Home food near you</h2>
                <p className="text-[#6F6F6F]">Fresh meals prepared around your location.</p>
              </div>
              <button className="text-[#12666A] font-bold text-sm hover:underline" onClick={() => router.push('/customer/explore')}>
                See all
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="card p-0 rounded-3xl h-72 animate-pulse bg-gray-100 border-none"></div>
                ))}
              </div>
            ) : displayChefs.length === 0 ? (
              <div className="card rounded-3xl text-center py-12 text-[#6F6F6F] border-2 border-dashed border-[#F0EBE3]">
                {search || filter !== "🌟 All" ? (
                  <>
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="font-bold text-lg mb-2 text-[#252525]">No home kitchens match these filters.</h3>
                    <p className="mb-6">Try adjusting your filters or search term.</p>
                    <button onClick={() => {setFilter("🌟 All"); setSearch("");}} className="btn btn-secondary mx-auto">Clear Filters</button>
                  </>
                ) : (
                  <>
                    <div className="text-5xl mb-4">🏡</div>
                    <h3 className="font-black text-2xl mb-2 text-[#252525]">We're coming to {location?.locality || location?.city || location?.label || "your area"}!</h3>
                    <p className="mb-6 max-w-md mx-auto text-base">HomeBite doesn't have enough verified Home Chefs near this location yet.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button className="btn bg-[#12666A] text-white hover:bg-[#0d4f52]">Notify me when HomeBite launches here</button>
                      <button className="btn btn-secondary border border-[#F0EBE3]">Become a Home Chef</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {displayChefs.map((chef) => (
                  <div 
                    key={chef.id} 
                    className="card p-0 overflow-hidden card-hover cursor-pointer rounded-3xl"
                    onClick={() => router.push(`/customer/kitchen/${chef.id}`)}
                  >
                    <div className="relative h-48 w-full bg-gray-100">
                      <Image 
                        src={chef.imageUrl} 
                        alt={chef.name} 
                        fill 
                        className="object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full p-2 hover:bg-white transition-colors">
                        🤍
                      </div>
                      {!chef.availability.lunch && !chef.availability.dinner && (
                        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          Closed Today
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg line-clamp-1">{chef.name}</h3>
                        {chef.verified && <span className="badge badge-green shrink-0 text-[10px]">✓ Verified</span>}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-[#6F6F6F] mb-3">
                        <span className="text-[#F47A2A]">★ {chef.rating}</span>
                        <span>({chef.reviews})</span>
                        <span>•</span>
                        <span>{chef.distance} km</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#6F6F6F] mb-4">
                        <span className={`w-4 h-4 rounded-sm border ${chef.diet === 'Veg' ? 'border-green-600' : 'border-red-600'} flex items-center justify-center shrink-0`}>
                          <span className={`w-2 h-2 rounded-full ${chef.diet === 'Veg' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                        </span>
                        <span>{chef.cuisine}</span>
                      </div>
                      <div className="pt-4 border-t border-[#F0EBE3] flex justify-between items-center">
                        <div>
                          <span className="text-[#12666A] font-bold">₹{chef.price}</span>
                          <span className="text-xs text-[#6F6F6F]"> onwards</span>
                        </div>
                        {chef.capacity.lunch === 0 && chef.availability.lunch ? (
                          <span className="text-xs font-bold text-red-500">Lunch Sold Out</span>
                        ) : chef.capacity.lunch <= 5 && chef.availability.lunch ? (
                          <span className="text-xs font-bold text-orange-500">Only {chef.capacity.lunch} left!</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* HomeBite Collections */}
          <section className="mb-16">
            <h2 className="heading-lg font-heading mb-6">HomeBite Collections</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x px-1">
              <div 
                onClick={() => { setFilter("🌟 All"); setSearch("Maharashtrian"); }}
                className="min-w-[280px] h-[160px] rounded-2xl relative overflow-hidden cursor-pointer snap-start group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=600&auto=format&fit=crop" alt="Taste of Maharashtra" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-lg">Taste of Maharashtra</h3>
                  <p className="text-sm text-white/80">Authentic local flavors</p>
                </div>
              </div>
              
              <div 
                onClick={() => { setFilter("🌿 Pure Veg"); setSearch(""); }}
                className="min-w-[280px] h-[160px] rounded-2xl relative overflow-hidden cursor-pointer snap-start group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1546833998-877b37c2e5c4?q=80&w=600&auto=format&fit=crop" alt="Pure Veg Comfort" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#557A55]/90 via-[#557A55]/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-lg">Pure Veg Comfort</h3>
                  <p className="text-sm text-white/80">100% vegetarian kitchens</p>
                </div>
              </div>

              <div 
                onClick={() => { setFilter("💪 High Protein"); setSearch(""); }}
                className="min-w-[280px] h-[160px] rounded-2xl relative overflow-hidden cursor-pointer snap-start group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop" alt="Fitness Friendly" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F47A2A]/90 via-[#F47A2A]/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-lg">Fitness Friendly</h3>
                  <p className="text-sm text-white/80">High protein, macros counted</p>
                </div>
              </div>
            </div>
          </section>

          {/* Weekly Plan CTA */}
          <section className="mb-16">
            <div className="bg-[#12666A] rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
              <div className="text-white">
                <h2 className="heading-lg font-heading mb-4">Make everyday meals easier.</h2>
                <ul className="flex flex-col gap-2 text-white/80">
                  <li className="flex items-center gap-2">✓ Subscribe once, eat all week</li>
                  <li className="flex items-center gap-2">✓ Pause or skip days anytime</li>
                  <li className="flex items-center gap-2">✓ 7-Day rotating menus</li>
                  <li className="flex items-center gap-2">✓ Free daily delivery</li>
                </ul>
              </div>
              <button className="btn btn-primary whitespace-nowrap shrink-0 hover:-translate-y-1 transition-transform">
                Explore Weekly Plans →
              </button>
            </div>
          </section>
        </>
      )}

      {/* Popular Home Chefs (Both Views) */}
      <section className="mb-16">
        <h2 className="heading-lg font-heading mb-6">Popular Home Chefs</h2>
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-2 -mx-2 scrollbar-hide snap-x">
          {chefs.map((chef) => (
            <div 
              key={chef.id} 
              className="card bg-white p-4 min-w-[240px] max-w-[240px] cursor-pointer group hover:-translate-y-1 transition-all shadow-sm hover:shadow-md border border-[#F0EBE3] snap-start shrink-0 flex flex-col gap-3 rounded-2xl"
              onClick={() => router.push(`/customer/kitchen/${chef.id}`)}
            >
              <div className="flex items-center gap-4">
                <ChefAvatar src={chef.chefImageUrl} name={chef.chefName} size="lg" className="border border-[#F0EBE3] shrink-0" />
                <div className="flex flex-col">
                  <span className="font-bold text-base text-[#252525] group-hover:text-[#12666A] transition-colors leading-tight">{chef.chefName}</span>
                  <span className="text-xs text-[#6F6F6F] mt-1 line-clamp-1">{chef.cuisine}</span>
                </div>
              </div>
              <div className="border-t border-[#F0EBE3] pt-3 flex justify-between items-center text-sm">
                <div className="flex items-center gap-1 font-medium">
                  <span className="text-[#F47A2A]">★</span> {chef.rating}
                </div>
                <div className="text-[#6F6F6F] text-xs">
                  {chef.distance} km
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <span className="badge badge-green mb-3">✓ PURE HYGIENE & SAFETY STANDARDS</span>
          <h2 className="heading-xl font-heading mb-4">Why {location?.city || 'Pune'} Trusts HomeBite</h2>
          <p className="text-[#6F6F6F] max-w-2xl mx-auto text-lg">
            Commercial cloud kitchens cut corners with cheap oils and frozen gravies. Our verified homemakers cook just like they do for their own children.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-[#ebf3ea] text-[#557A55] text-2xl flex items-center justify-center mx-auto mb-4">
              🛡️
            </div>
            <h3 className="font-bold text-lg mb-2">FSSAI Audits</h3>
            <p className="text-[#6F6F6F] text-sm">Every home kitchen is physically inspected, water tested, and FSSAI certified before a single meal is sold.</p>
          </div>
          
          <div className="card text-center rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-[#fce5d4] text-[#F47A2A] text-2xl flex items-center justify-center mx-auto mb-4">
              🔥
            </div>
            <h3 className="font-bold text-lg mb-2">Zero Reused Palm Oil</h3>
            <p className="text-[#6F6F6F] text-sm">Strict policy: Only cold-pressed groundnut/mustard oil and pure Desi Ghee used in our kitchens.</p>
          </div>
          
          <div className="card text-center rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-[#e6f2f2] text-[#12666A] text-2xl flex items-center justify-center mx-auto mb-4">
              🍱
            </div>
            <h3 className="font-bold text-lg mb-2">Stainless Steel Dabbas</h3>
            <p className="text-[#6F6F6F] text-sm">Say goodbye to toxic hot plastic containers. Meals arrive in insulated food-grade stainless steel tiffins.</p>
          </div>
        </div>
      </section>

    </div>
  )
}
