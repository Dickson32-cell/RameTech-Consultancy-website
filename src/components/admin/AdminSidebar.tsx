'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaHome, FaBriefcase, FaUsers, FaProjectDiagram, FaSignOutAlt, FaBars, FaBlog, FaEnvelope, FaShareAlt } from 'react-icons/fa'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: FaHome },
  { name: 'Services', href: '/admin/services', icon: FaBriefcase },
  { name: 'Team', href: '/admin/team', icon: FaUsers },
  { name: 'Portfolio', href: '/admin/portfolio', icon: FaProjectDiagram },
  { name: 'Blog', href: '/admin/blogs', icon: FaBlog },
  { name: 'Social Links', href: '/admin/social-links', icon: FaShareAlt },
  { name: 'Messages', href: '/admin/messages', icon: FaEnvelope },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      // If on admin page and not authenticated, redirect to login
      if (pathname !== '/admin/login') {
        router.push('/admin/login')
      }
      return
    }
    setIsAuthenticated(true)
  }, [pathname, router])

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return null
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-primary text-white transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-40`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">RAME Tech</h1>
                <p className="text-sm text-gray-300">Admin Panel</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <FaBars />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
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
              <span>Back to Site</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg"
        >
          <FaBars />
        </button>
      )}
    </>
  )
}
