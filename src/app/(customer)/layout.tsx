"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import LocationSelector from "@/components/LocationSelector"

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // For the MVP UI demo, if not logged in, we let them see the layout but they will be redirected to login
  useEffect(() => {
    if (!loading && (!user || user.role !== "customer")) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) return null

  const navItems = [
    { id: "home", href: "/customer/home", icon: "⌂", label: "Home" },
    { id: "explore", href: "/customer/explore", icon: "⌕", label: "Explore" },
    { id: "meals", href: "/customer/meals", icon: "▣", label: "My Meals" },
    { id: "saved", href: "/customer/saved", icon: "♡", label: "Saved" },
    { id: "profile", href: "/customer/profile", icon: "◉", label: "Profile" },
  ]

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <div className="w-full bg-[#FBF6EC] min-h-screen relative overflow-x-hidden font-sans">
      {/* Desktop Top Navigation */}
      <header className="hidden md:block bg-[#FBF6EC] sticky top-0 z-40 border-b border-[#F0EBE3]">
        <div className="container-max px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/customer/home" className="flex items-center gap-2 font-bold text-2xl font-heading">
            <span className="w-10 h-10 rounded-xl bg-[#F47A2A] text-white flex items-center justify-center text-xl">
              ⌂
            </span>
            <span className="text-[#12666A]">Home<span className="text-[#F47A2A]">Bite</span></span>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-8">
            {navItems.slice(0, 3).map((item) => (
              <Link 
                key={item.id} 
                href={item.href}
                className={`text-base font-medium transition-colors ${
                  isActive(item.href) ? "text-[#12666A] font-bold" : "text-[#6F6F6F] hover:text-[#12666A]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Area (Location & Avatar) */}
          <div className="flex items-center gap-6">
            <LocationSelector />
            <Link href="/customer/profile">
              <div className="avatar bg-[#12666A] text-white">
                {user?.fullName?.[0]?.toUpperCase() || 'O'}
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#FBF6EC] sticky top-0 z-40 px-5 py-3 flex items-center justify-between border-b border-[#F0EBE3]">
        <div className="flex items-center gap-2 font-bold text-xl font-heading">
          <span className="w-8 h-8 rounded-lg bg-[#F47A2A] text-white flex items-center justify-center text-lg">
            ⌂
          </span>
          <span className="text-[#12666A]">Home<span className="text-[#F47A2A]">Bite</span></span>
        </div>
        <LocationSelector />
      </header>

      {/* Main Content */}
      <main className="container-max px-5 md:px-8 py-8 pb-32 md:pb-16 min-h-[calc(100vh-80px)]">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#F0EBE3] z-50 px-2 py-1 flex justify-around items-center safe-area-bottom">
        {navItems.map((item) => (
          <Link 
            key={item.id} 
            href={item.href}
            className={`flex flex-col items-center justify-center w-16 h-14 gap-1 ${
              isActive(item.href) ? "text-[#12666A]" : "text-[#6F6F6F]"
            }`}
          >
            <span className={`text-xl ${isActive(item.href) ? "font-bold" : ""}`}>{item.icon}</span>
            <span className={`text-[10px] ${isActive(item.href) ? "font-bold" : "font-medium"}`}>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
