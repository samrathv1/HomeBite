"use client"

import { useAuth } from "@/contexts/AuthContext"

export default function ProfilePage() {
  const { logout } = useAuth()

  const profileItems = [
    { icon: "💳", title: "Wallet & Refunds", sub: "₹250 balance" },
    { icon: "📍", title: "Saved Addresses", sub: "2 saved" },
    { icon: "🥗", title: "Dietary & Allergy Settings", sub: "Veg · No peanuts" },
    { icon: "🧾", title: "Past Order History", sub: "18 orders" },
    { icon: "💬", title: "Help & Support Chat", sub: "We're here to help" },
    { icon: "↪", title: "Log out", sub: "", onClick: logout }
  ]

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="topbar">
        <div>
          <div className="location">📍 Mumbai, Maharashtra</div>
          <h1>Profile</h1>
          <div className="muted small">Manage your Home Bite experience.</div>
        </div>
        <div className="avatar">R</div>
      </div>

      <div className="card flex gap-[15px] items-center">
        <div className="avatar !w-[64px] !h-[64px] text-2xl">R</div>
        <div>
          <h2 className="text-xl">Rahul Sharma</h2>
          <div className="muted small">rahul@example.com · Student</div>
        </div>
        <button 
          className="btn secondary ml-auto py-2 px-4 text-sm" 
          onClick={() => alert('Edit profile demo')}
        >
          Edit
        </button>
      </div>

      <div className="mt-[22px] grid gap-[9px]">
        {profileItems.map((item, i) => (
          <button 
            key={i} 
            className="flex justify-between items-center p-4 bg-white border border-line rounded-[15px] text-left hover:bg-slate-50 transition-colors"
            onClick={item.onClick ? item.onClick : () => alert('This setting opens in the prototype.')}
          >
            <span className="flex gap-3 items-center">
              <span className="w-9 h-9 rounded-[10px] bg-[#fff0e9] grid place-items-center text-lg shrink-0">
                {item.icon}
              </span>
              <span>
                <b className="text-ink">{item.title}</b>
                {item.sub && <div className="small muted mt-0.5">{item.sub}</div>}
              </span>
            </span>
            <span className="text-muted text-xl">›</span>
          </button>
        ))}
      </div>
    </div>
  )
}
