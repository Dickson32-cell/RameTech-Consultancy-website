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
          ? 'glass-tech shadow-lg border-b border-primary/10 py-2'
          : 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 py-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center py-2 -ml-2 cursor-pointer">
            <div className="relative h-12 w-36 sm:h-14 sm:w-44">
              <Image 
                src="/logo.png" 
                alt="RAME Tech Consultancy"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link href="/" className="relative px-4 py-2 text-text hover:text-primary font-medium transition-colors duration-200 cursor-pointer rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-cyan/5 group">
              <span className="relative z-10">Home</span>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-cyan group-hover:w-3/4 transition-all duration-300"></div>
            </Link>
            <Link href="/services" className="relative px-4 py-2 text-text hover:text-primary font-medium transition-colors duration-200 cursor-pointer rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-cyan/5 group">
              <span className="relative z-10">Services</span>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-cyan group-hover:w-3/4 transition-all duration-300"></div>
            </Link>
            <Link href="/portfolio" className="relative px-4 py-2 text-text hover:text-primary font-medium transition-colors duration-200 cursor-pointer rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-cyan/5 group">
              <span className="relative z-10">Portfolio</span>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-cyan group-hover:w-3/4 transition-all duration-300"></div>
            </Link>
            <Link href="/team" className="relative px-4 py-2 text-text hover:text-primary font-medium transition-colors duration-200 cursor-pointer rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-cyan/5 group">
              <span className="relative z-10">Team</span>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-cyan group-hover:w-3/4 transition-all duration-300"></div>
            </Link>
            <Link href="/blog" className="relative px-4 py-2 text-text hover:text-primary font-medium transition-colors duration-200 cursor-pointer rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-cyan/5 group">
              <span className="relative z-10">Blog</span>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-cyan group-hover:w-3/4 transition-all duration-300"></div>
            </Link>
            <Link href="/faq" className="relative px-4 py-2 text-text hover:text-primary font-medium transition-colors duration-200 cursor-pointer rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-cyan/5 group">
              <span className="relative z-10">FAQ</span>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-cyan group-hover:w-3/4 transition-all duration-300"></div>
            </Link>
            <Link href="/contact" className="ml-2 group relative btn-primary text-sm py-2.5 px-5 overflow-hidden">
              <span className="relative z-10">Get a Quote</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-cyan to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </nav>

          {/* Tablet Nav */}
          <nav className="hidden md:flex lg:hidden items-center space-x-2">
            <Link href="/services" className="px-3 py-2 text-text hover:text-primary font-medium transition-colors duration-200 cursor-pointer">Services</Link>
            <Link href="/portfolio" className="px-3 py-2 text-text hover:text-primary font-medium transition-colors duration-200 cursor-pointer">Portfolio</Link>
            <Link href="/team" className="px-3 py-2 text-text hover:text-primary font-medium transition-colors duration-200 cursor-pointer">Team</Link>
            <Link href="/contact" className="btn-primary text-sm py-2 px-4">
              Quote
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <Link href="/" className="px-4 py-3 text-text hover:bg-primary/5 hover:text-primary rounded-lg transition-colors duration-200 cursor-pointer" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/services" className="px-4 py-3 text-text hover:bg-primary/5 hover:text-primary rounded-lg transition-colors duration-200 cursor-pointer" onClick={() => setIsMenuOpen(false)}>Services</Link>
            <Link href="/portfolio" className="px-4 py-3 text-text hover:bg-primary/5 hover:text-primary rounded-lg transition-colors duration-200 cursor-pointer" onClick={() => setIsMenuOpen(false)}>Portfolio</Link>
            <Link href="/team" className="px-4 py-3 text-text hover:bg-primary/5 hover:text-primary rounded-lg transition-colors duration-200 cursor-pointer" onClick={() => setIsMenuOpen(false)}>Team</Link>
            <Link href="/blog" className="px-4 py-3 text-text hover:bg-primary/5 hover:text-primary rounded-lg transition-colors duration-200 cursor-pointer" onClick={() => setIsMenuOpen(false)}>Blog</Link>
            <Link href="/faq" className="px-4 py-3 text-text hover:bg-primary/5 hover:text-primary rounded-lg transition-colors duration-200 cursor-pointer" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
            <Link href="/contact" className="mt-2 btn-primary text-center cursor-pointer" onClick={() => setIsMenuOpen(false)}>Get a Quote</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
