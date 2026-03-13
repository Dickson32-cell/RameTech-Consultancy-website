'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2' 
          : 'bg-white shadow-sm py-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center py-2">
            <div className="relative h-12 w-36 sm:h-14 sm:w-44">
              <Image 
                src="/logo.jpg" 
                alt="RAME Tech Consultancy"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link href="/" className="px-3 py-2 text-sm text-gray-700 hover:text-primary font-medium transition-colors">Home</Link>
            <Link href="/services" className="px-3 py-2 text-sm text-gray-700 hover:text-primary font-medium transition-colors">Services</Link>
            <Link href="/portfolio" className="px-3 py-2 text-sm text-gray-700 hover:text-primary font-medium transition-colors">Portfolio</Link>
            <Link href="/team" className="px-3 py-2 text-sm text-gray-700 hover:text-primary font-medium transition-colors">Team</Link>
            <Link href="/blog" className="px-3 py-2 text-sm text-gray-700 hover:text-primary font-medium transition-colors">Blog</Link>
            <Link href="/faq" className="px-3 py-2 text-sm text-gray-700 hover:text-primary font-medium transition-colors">FAQ</Link>
            <Link href="/contact" className="ml-2 btn-primary text-sm py-2 px-4">
              Get a Quote
            </Link>
          </nav>

          {/* Tablet Nav */}
          <nav className="hidden md:flex lg:hidden items-center space-x-2">
            <Link href="/services" className="text-sm text-gray-700 hover:text-primary font-medium">Services</Link>
            <Link href="/portfolio" className="text-sm text-gray-700 hover:text-primary font-medium">Portfolio</Link>
            <Link href="/team" className="text-sm text-gray-700 hover:text-primary font-medium">Team</Link>
            <Link href="/contact" className="btn-primary text-sm py-2 px-3">
              Quote
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
          }`}
        >
          <nav className="flex flex-col space-y-1 pt-2">
            <Link href="/" className="px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/services" className="px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Services</Link>
            <Link href="/portfolio" className="px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Portfolio</Link>
            <Link href="/team" className="px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Team</Link>
            <Link href="/blog" className="px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Blog</Link>
            <Link href="/faq" className="px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
            <Link href="/contact" className="mt-2 btn-primary text-center" onClick={() => setIsMenuOpen(false)}>Get a Quote</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
