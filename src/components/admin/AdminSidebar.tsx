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
  const [sidebarOpen, setSidebarOpen] = useState(false)
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

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

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

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-primary text-white transition-transform duration-300 z-40 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:shadow-2xl`}>
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo */}
          <div className="p-4 md:p-6 border-b border-white/20 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-bold truncate">RAME Tech</h1>
                <p className="text-xs md:text-sm text-white/80">Admin Panel</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white/80 hover:text-white p-1 md:p-0 md:hidden flex-shrink-0"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 md:p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-all duration-200 text-sm md:text-base ${
                    isActive
                      ? 'bg-white/25 text-white font-semibold'
                      : 'text-white/90 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                  {item.badge && unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full flex-shrink-0">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 md:p-4 border-t border-white/20 space-y-1 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 md:px-4 py-2.5 md:py-3 text-red-200 hover:bg-red-500/30 hover:text-red-100 rounded-lg transition-all duration-200 text-sm md:text-base"
            >
              <FaSignOutAlt className="w-5 h-5 flex-shrink-0" />
              <span>Logout</span>
            </button>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 text-white/90 hover:bg-white/15 hover:text-white rounded-lg transition-all duration-200 text-sm md:text-base"
            >
              <span>Back to Site</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile menu toggle - fixed position top right on mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 right-4 z-50 p-2.5 bg-primary text-white rounded-lg shadow-lg md:hidden"
      >
        <FaBars className="w-5 h-5" />
      </button>
    </>
  )
}
