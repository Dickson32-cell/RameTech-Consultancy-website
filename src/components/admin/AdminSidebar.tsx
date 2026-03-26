'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaHome, FaBriefcase, FaUsers, FaProjectDiagram, FaSignOutAlt, FaBars, FaBlog, FaEnvelope, FaShareAlt, FaTimes } from 'react-icons/fa'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: FaHome },
  { name: 'Services', href: '/admin/services', icon: FaBriefcase },
  { name: 'Team', href: '/admin/team', icon: FaUsers },
  { name: 'Portfolio', href: '/admin/portfolio', icon: FaProjectDiagram },
  { name: 'Blog', href: '/admin/blogs', icon: FaBlog },
  { name: 'Social Links', href: '/admin/social-links', icon: FaShareAlt },
  { name: 'Messages', href: '/admin/messages', icon: FaEnvelope, badge: true },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false) // Start closed on mobile
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      if (pathname !== '/admin/login') {
        router.push('/admin/login')
      }
      return
    }
    setIsAuthenticated(true)
  }, [pathname, router])

  // Fetch unread message count
  useEffect(() => {
    if (!isAuthenticated) return
    
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch('/api/v1/contact')
        const data = await res.json()
        if (data.success && data.data) {
          const unread = data.data.filter((msg: any) => !msg.isRead).length
          setUnreadCount(unread)
        }
      } catch (error) {
        console.error('Failed to fetch unread count:', error)
      }
    }
    
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated])

  // Close sidebar when clicking a link on mobile
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return null
  }

  if (!isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile by default, slides in when open */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-primary text-white transition-transform duration-300 z-40 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">RAME Tech</h1>
                <p className="text-sm text-gray-300">Admin Panel</p>
              </div>
              {/* Close button - only show on mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white/70 hover:text-white md:hidden"
              >
                <FaTimes />
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
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon />
                  <span>{item.name}</span>
                  {item.badge && unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/20 space-y-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
            >
              <span>Back to Site</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile menu toggle - always visible on mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg md:hidden"
      >
        <FaBars />
      </button>
    </>
  )
}
