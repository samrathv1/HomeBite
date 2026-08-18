"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { LayoutDashboard, Users, Store, ClipboardList, Shield, LogOut } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading || !user) return null

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Providers", href: "/admin/providers", icon: Store },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Orders & Analytics", href: "/admin/orders", icon: ClipboardList },
  ]

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white mr-3">
            <Shield size={18} />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">Admin</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Management</div>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-medium transition-colors ${
                  isActive 
                    ? "bg-blue-600/10 text-blue-400" 
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={logout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-16 flex items-center justify-between px-4 border-b bg-slate-900 text-white sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-blue-500" />
            <span className="font-bold text-lg">Admin</span>
          </div>
          <button onClick={logout} className="p-2 text-slate-400">
            <LogOut size={20} />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
