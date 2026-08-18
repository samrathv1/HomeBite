"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { LayoutDashboard, Menu as MenuIcon, ClipboardList, Users, Store, LogOut } from "lucide-react"

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && (!user || user.role !== "provider")) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading || !user) return null

  const navItems = [
    { name: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
    { name: "Menu", href: "/provider/menu", icon: MenuIcon },
    { name: "Orders", href: "/provider/orders", icon: ClipboardList },
    { name: "Subscribers", href: "/provider/subscribers", icon: Users },
    { name: "Kitchen", href: "/provider/kitchen", icon: Store },
  ]

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-lg mr-2">
            H
          </div>
          <span className="font-bold text-xl text-sidebar-foreground">HomeBite <span className="text-sm font-normal text-muted-foreground ml-1">Chef</span></span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? "bg-secondary/10 text-secondary" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-sidebar-border">
          <button 
            onClick={logout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut size={20} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden h-16 flex items-center justify-between px-4 border-b bg-white sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-lg">
              H
            </div>
            <span className="font-bold text-lg">Chef</span>
          </div>
          <button onClick={logout} className="p-2 text-muted-foreground">
            <LogOut size={20} />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
          <div className="max-w-5xl mx-auto w-full">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white flex justify-around items-center h-16 z-50 px-2 pb-safe">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? "text-secondary" : "text-muted-foreground"
                }`}
              >
                <Icon size={22} className={isActive ? "fill-secondary/20" : ""} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
