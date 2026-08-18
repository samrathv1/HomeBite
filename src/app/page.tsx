"use client"

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LandingPage() {
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);

  const cravings = [
    { name: "All Cravings", img: "/kitchen-1.jpg" },
    { name: "Poli-Bhaji & Varan", img: "/kitchen-2.jpg" },
    { name: "North Indian Phulkas", img: "/kitchen-3.jpg" },
    { name: "Gujarati Rotli & Kadhi", img: "/hero-thali.jpg" },
    { name: "Konkani & Malvani", img: "/kitchen-1.jpg" },
    { name: "No Onion-Garlic", img: "/kitchen-2.jpg" },
    { name: "High-Protein", img: "/kitchen-3.jpg" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#252525] font-sans">
      
      {/* Promo Banner */}
      <div className="bg-[#E65C00] text-white text-center py-2 text-sm font-medium flex justify-center items-center gap-2">
        <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold">LIMITED TIME</span>
        Use code <span className="font-bold">MUMBAI50</span> for 50% OFF your first weekly meal subscription!
        <button className="absolute right-4 hidden md:flex items-center gap-1 text-xs border border-white/40 px-2 py-1 rounded hover:bg-white/10">
          📱 Get App
        </button>
      </div>

      {/* Main Header */}
      <header className="px-4 py-3 md:px-8 border-b border-[#F0EBE3] flex items-center justify-between bg-white sticky top-0 z-50">
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#F47A2A] rounded-full flex items-center justify-center text-white text-xl">
              🍱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl text-[#12666A]">HomeBite</span>
                <span className="bg-[#FFF0E6] text-[#E65C00] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#FFDAB3]">MUMBAI</span>
              </div>
              <div className="text-xs text-[#6F6F6F]">Your Aai's Kitchen, <span className="text-[#E65C00] font-bold">Now in Mumbai.</span></div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 bg-[#F8F9FA] px-3 py-1.5 rounded-full border border-[#E9ECEF]">
            <span className="text-[#F47A2A]">📍</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#6F6F6F] font-bold leading-none uppercase">Mumbai Delivery Hub</span>
              <span className="text-sm font-bold leading-none mt-1">Andheri West</span>
            </div>
            <span className="text-xs ml-2 opacity-50">▼</span>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search Poli-Bhaji, Rajma, Sange..."
            className="w-full bg-[#F8F9FA] border border-[#E9ECEF] rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#12666A]"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="hidden md:flex items-center gap-2 text-sm font-medium border border-[#E9ECEF] py-2 px-3 rounded-full cursor-pointer hover:bg-gray-50">
            <input type="checkbox" className="accent-green-600 w-4 h-4" />
            <span className="w-3 h-3 border border-green-600 flex items-center justify-center rounded-sm shrink-0">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
            </span>
            Pure Veg
          </label>

          <Dialog open={partnerModalOpen} onOpenChange={setPartnerModalOpen}>
            <DialogTrigger className="hidden sm:flex items-center gap-2 text-sm font-bold text-[#E65C00] border border-[#FFDAB3] bg-[#FFF0E6] py-2 px-4 rounded-full hover:bg-[#FFE4CC] transition-colors">
              👨‍🍳 Partner as Chef
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none rounded-2xl">
              <div className="bg-white p-8">
                <div className="flex justify-center mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#F47A2A] rounded-full flex items-center justify-center text-white text-sm">🍱</div>
                    <span className="font-extrabold text-xl text-[#12666A]">HomeBite</span>
                    <span className="bg-[#FFF0E6] text-[#E65C00] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#FFDAB3]">MUMBAI</span>
                  </div>
                </div>
                
                <div className="text-center mb-8">
                  <span className="inline-flex items-center gap-2 bg-[#FFF0E6] text-[#E65C00] text-xs font-bold px-3 py-1 rounded-full mb-4">
                    👨‍🍳 Partner With HomeBite Kitchen Network
                  </span>
                  <h2 className="text-3xl font-extrabold text-[#252525] mb-2 leading-tight">Turn Your Kitchen Into A Thriving Business</h2>
                  <p className="text-[#6F6F6F] text-sm">Earn ₹35,000 – ₹75,000/month cooking authentic meals from home.</p>
                </div>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setPartnerModalOpen(false); }}>
                  <div>
                    <label className="text-xs font-bold text-[#6F6F6F] uppercase tracking-wider mb-1 block">Full Name / Aapka Naam</label>
                    <Input placeholder="e.g. Sangeeta Kulkarni" className="bg-[#F8F9FA] border-[#E9ECEF] h-12" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#6F6F6F] uppercase tracking-wider mb-1 block">WhatsApp Mobile No.</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-[#E9ECEF] bg-[#F8F9FA] text-gray-500 text-sm font-medium">
                          +91
                        </span>
                        <Input placeholder="9876543210" className="rounded-l-none bg-[#F8F9FA] border-[#E9ECEF] h-12" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#6F6F6F] uppercase tracking-wider mb-1 block">Mumbai Neighborhood</label>
                      <Select>
                        <SelectTrigger className="bg-[#F8F9FA] border-[#E9ECEF] h-12">
                          <SelectValue placeholder="Dadar / Shivaji Park" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dadar">Dadar / Shivaji Park</SelectItem>
                          <SelectItem value="andheri">Andheri West</SelectItem>
                          <SelectItem value="bandra">Bandra West</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#6F6F6F] uppercase tracking-wider mb-1 block">Primary Cuisine</label>
                      <Select>
                        <SelectTrigger className="bg-[#F8F9FA] border-[#E9ECEF] h-12">
                          <SelectValue placeholder="Maharashtrian" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mh">Maharashtrian</SelectItem>
                          <SelectItem value="gj">Gujarati</SelectItem>
                          <SelectItem value="ni">North Indian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#6F6F6F] uppercase tracking-wider mb-1 block">Desired Capacity</label>
                      <Select>
                        <SelectTrigger className="bg-[#F8F9FA] border-[#E9ECEF] h-12">
                          <SelectValue placeholder="20-30 meals/day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10-20 meals/day</SelectItem>
                          <SelectItem value="20">20-30 meals/day</SelectItem>
                          <SelectItem value="30">30+ meals/day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-[#E65C00] hover:bg-[#CC5200] text-white h-14 rounded-xl text-lg font-bold mt-6">
                    🤍 Submit Chef Application
                  </Button>
                </form>
              </div>
            </DialogContent>
          </Dialog>

          <Link href="/login" className="hidden sm:flex items-center gap-2 bg-[#1A1A1A] text-white text-sm font-bold py-2 px-4 rounded-full hover:bg-black transition-colors">
            📱 Get App
          </Link>
          
          <Link href="/login" className="flex items-center gap-2 bg-[#E65C00] text-white text-sm font-bold py-2 px-4 rounded-full hover:bg-[#CC5200] transition-colors">
            <span className="relative">
              🛍️
              <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#E65C00]">1</span>
            </span>
            ₹763
          </Link>
        </div>
      </header>

      {/* Trust Banner */}
      <div className="border-b border-[#F0EBE3] py-2 px-4 md:px-8 bg-[#FAFAFA] flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-[#6F6F6F]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="font-bold text-black">Live Mumbai Network:</span> <span className="text-[#E65C00] font-bold">2,840+ Active Tiffins</span> Today
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span className="flex items-center gap-1">✓ FSSAI 4-Tier Audited</span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1">⏱️ Dabbawala Precision Lunch Delivery</span>
          <span className="text-gray-300">|</span>
          <span className="font-bold text-[#E65C00]">Zero Reused Palm Oil</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="px-4 md:px-8 py-12 md:py-20 max-w-7xl mx-auto">
        <div className="mb-6 inline-flex items-center rounded-full border border-[#FFDAB3] bg-[#FFF0E6] px-4 py-1.5 text-sm font-bold text-[#E65C00]">
          % FLAT ₹100 OFF on 1st Weekly Subscription (Code: MUMBAI50)
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1">
            <h1 className="text-5xl md:text-7xl font-black text-[#1A1A1A] leading-[1.1] tracking-tight mb-4 font-serif">
              Tired of Oily Mess Food?<br />
              <span className="text-[#E65C00]">Taste Maa Ke Haath Ka</span>
            </h1>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/login">
                <Button size="lg" className="bg-[#1A1A1A] hover:bg-black text-white h-14 px-8 rounded-full text-lg font-bold">
                  Browse Daily Menus & Thalis →
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-[#E9ECEF] text-[#252525] h-14 px-8 rounded-full text-lg font-bold hover:bg-[#F8F9FA]">
                  📱 Get Mobile App
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-xl">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                  <span className="w-2 h-2 border border-white flex items-center justify-center rounded-sm">
                    <span className="w-1 h-1 bg-white rounded-full"></span>
                  </span>
                  PURE VEG
                </span>
                <span className="bg-[#FFB800] text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                  ⭐ TODAY'S SPECIAL
                </span>
              </div>
              <div className="absolute top-4 right-4 z-10 bg-black/80 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                ★ 4.95 (1.4k+)
              </div>
              <Image 
                src="/hero-thali.jpg" 
                alt="Delicious Thali" 
                width={800} 
                height={600}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cravings Carousel */}
      <section className="px-4 md:px-8 py-12 border-t border-[#F0EBE3]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black mb-2">What are you craving today?</h2>
              <p className="text-[#6F6F6F]">Fresh authentic home cuisines cooked daily in small batches</p>
            </div>
            <Link href="/login" className="hidden sm:block text-[#E65C00] font-bold hover:underline">
              See Full Menu →
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {cravings.map((item, idx) => (
              <div key={idx} className={`snap-start shrink-0 w-36 md:w-44 p-4 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-transform hover:-translate-y-1 ${idx === 0 ? 'bg-[#FFF0E6] border-2 border-[#FFDAB3]' : 'bg-white border border-[#F0EBE3] hover:shadow-lg'}`}>
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md relative">
                  <Image src={item.img} alt={item.name} fill className="object-cover" />
                </div>
                <h3 className="font-bold text-sm leading-tight text-[#252525]">{item.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="bg-[#1A1A1A] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-black mb-2">
              <span className="text-white">Eat like you're home,</span><br/>
              <span className="text-[#E65C00]">with 1-Tap on the App</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl">
              Pause your tiffin before travel, switch between WFH flat and BKC office address, customize daily rotis, and track real-time delivery on the HomeBite App.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-sm font-medium">
              <div className="flex items-center gap-2"><span className="text-green-500">⊙</span> 1-Click Pause & Skip Calendar</div>
              <div className="flex items-center gap-2"><span className="text-green-500">⊙</span> Live Dabbawala Route Tracking</div>
              <div className="flex items-center gap-2"><span className="text-green-500">⊙</span> Switch Roti/Rice on Any Day</div>
              <div className="flex items-center gap-2"><span className="text-green-500">⊙</span> Flexible UPI Autopay / Zero Lock-in</div>
            </div>

            <div className="max-w-md">
              <p className="text-sm font-bold text-gray-300 mb-2">Enter your mobile number to get the direct download link via SMS:</p>
              <div className="flex gap-2">
                <div className="flex flex-1 bg-[#2A2A2A] rounded-xl border border-gray-700 overflow-hidden">
                  <span className="px-4 flex items-center text-gray-400 border-r border-gray-700">+91</span>
                  <input type="text" placeholder="98765 43210" className="w-full bg-transparent px-4 py-3 text-white focus:outline-none" />
                </div>
                <button className="bg-[#E65C00] hover:bg-[#CC5200] text-white px-6 font-bold rounded-xl whitespace-nowrap transition-colors">
                  ✈ Send App Link
                </button>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button className="flex items-center gap-2 bg-[#2A2A2A] hover:bg-[#333] border border-gray-700 rounded-xl px-4 py-2 transition-colors">
                <span className="text-2xl">▶</span>
                <div className="text-left">
                  <div className="text-[10px] text-gray-400 uppercase leading-none">Get it on</div>
                  <div className="font-bold leading-none mt-1">Google Play</div>
                </div>
              </button>
              <button className="flex items-center gap-2 bg-[#2A2A2A] hover:bg-[#333] border border-gray-700 rounded-xl px-4 py-2 transition-colors">
                <span className="text-2xl">🍎</span>
                <div className="text-left">
                  <div className="text-[10px] text-gray-400 uppercase leading-none">Download on the</div>
                  <div className="font-bold leading-none mt-1">App Store</div>
                </div>
              </button>
            </div>
          </div>

          <div className="shrink-0 bg-white p-8 rounded-3xl flex flex-col items-center text-center max-w-sm">
            <div className="w-48 h-48 bg-gray-100 rounded-xl mb-6 relative overflow-hidden flex items-center justify-center border-4 border-[#E65C00]">
              <Image src="/hero-thali.jpg" alt="QR" fill className="object-cover opacity-20 blur-sm" />
              <div className="z-10 bg-white p-4 rounded-lg shadow-xl font-black text-xl text-center">
                <div className="w-full h-full border-4 border-black border-dashed flex items-center justify-center p-4">
                  QR
                </div>
              </div>
              <div className="absolute w-10 h-10 bg-[#E65C00] rounded-lg z-20 flex items-center justify-center text-white text-xl border-2 border-white">
                🍱
              </div>
            </div>
            <h3 className="font-black text-xl text-black mb-1">Scan to Download App</h3>
            <p className="text-xs text-gray-500 font-medium">iOS & Android • Rated 4.9★</p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 text-center bg-white text-[#6F6F6F] border-t border-[#F0EBE3]">
        <p className="font-bold mb-2">HomeBite - Ghar jaisa khana, near you.</p>
        <p className="text-sm">© {new Date().getFullYear()} HomeBite. All rights reserved.</p>
      </footer>
    </div>
  );
}
