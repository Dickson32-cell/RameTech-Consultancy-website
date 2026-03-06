'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { FaHome, FaProjectDiagram, FaFileInvoice, FaUser, FaSignOutAlt } from 'react-icons/fa'

const navigation = [
  { name: 'Dashboard', href: '/portal/dashboard', icon: FaHome },
  { name: 'Projects', href: '/portal/projects', icon: FaProjectDiagram },
  { name: 'Invoices', href: '/portal/invoices', icon: FaFileInvoice },
  { name: 'Profile', href: '/portal/profile', icon: FaUser },
]

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-primary text-white">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/20">
            <Link href="/" className="block relative h-10 w-32">
              <Image 
                src="/logo.jpg" 
                alt="RAME Tech"
                fill
                className="object-contain invert"
              />
            </Link>
            <p className="text-sm text-gray-300 mt-1">Client Portal</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/20">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
