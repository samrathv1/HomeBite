"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getKitchens, searchKitchens } from "@/lib/api"
import { Kitchen } from "@/lib/data/kitchens"

const categories = ["🌟 All", "🥗 Veg", "🍗 Non-Veg", "🍛 Maharashtrian", "🥘 High Protein", "🌱 Healthy", "🍱 Lunch", "🌙 Dinner", "Gujarati"]

export default function ExplorePage() {
  const router = useRouter()
  const [filter, setFilter] = useState("🌟 All")
  const [search, setSearch] = useState("")
  const [chefs, setChefs] = useState<Kitchen[]>([])
  const [filteredChefs, setFilteredChefs] = useState<Kitchen[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const all = await getKitchens()
      setChefs(all)
      
      const filtered = await searchKitchens(search, filter)
      setFilteredChefs(filtered)
      setLoading(false)
    }
    loadData()
  }, [search, filter])

  return (
    <div className="animate-in fade-in duration-500 pb-20 max-w-5xl mx-auto">
      <div className="mb-8 pt-4">
        <h1 className="heading-xl text-[#12666A] mb-2">Explore Kitchens</h1>
        <p className="text-lg text-[#6F6F6F]">Find a kitchen that feels like home.</p>
      </div>

      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
        <input 
          className="w-full bg-white border border-[#F0EBE3] rounded-full py-4 pl-12 pr-4 text-[#252525] focus:outline-none focus:border-[#12666A] shadow-sm" 
          placeholder="Search meals, chefs or cuisines…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full">
          ⚙️
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-8">
        {categories.map(cat => (
          <button 
            key={cat}
            className={`pill ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mb-12">
        <div className="mb-6 flex justify-between items-end">
          <h2 className="heading-lg font-heading mb-1">Home Chefs Near You</h2>
          <span className="text-sm font-bold text-[#6F6F6F]">{filteredChefs.length} kitchens</span>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card p-0 rounded-3xl h-72 animate-pulse bg-gray-100 border-none"></div>
            ))}
          </div>
        ) : filteredChefs.length === 0 ? (
          <div className="card rounded-3xl text-center py-16 text-[#6F6F6F]">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="font-bold text-xl mb-2">No kitchens found</h3>
            <p className="mb-6">Try adjusting your filters or search term to see more options.</p>
            <button onClick={() => {setFilter("🌟 All"); setSearch("")}} className="btn btn-secondary mx-auto">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredChefs.map((chef) => (
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
      </div>

    </div>
  )
}
