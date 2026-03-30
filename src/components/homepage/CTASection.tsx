'use client'

import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary-dark via-primary to-secondary overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-20 animate-float"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-20 animate-float delay-300"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-20 animate-float delay-500"></div>

      {/* Tech Grid Pattern */}
      <div className="absolute inset-0 tech-grid-pattern opacity-30"></div>

      {/* Geometric Decorations */}
      <div className="absolute top-10 left-10 w-32 h-32 border-2 border-neon-blue/20 rounded-lg rotate-12 animate-rotate-slow"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-purple/20 rotate-45 animate-pulse"></div>

      {/* Circuit Lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan to-transparent"></div>
        <div className="absolute bottom-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 glass-tech neon-border rounded-full px-5 py-2.5 mb-6 group hover:shadow-neon transition-all duration-300">
          <svg className="w-5 h-5 text-cyan group-hover:text-neon-blue transition-colors" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-white text-sm font-semibold tracking-wide">Start Your Project Today</span>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4 md:mb-6">
          Ready to Transform{' '}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-white to-accent">Your Business</span>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan via-accent to-transparent rounded-full"></div>
          </span>
          ?
        </h2>
        
        <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Let's discuss your project and create a tailored solution that drives real results for your business.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="group relative btn-accent text-lg px-8 py-4 shadow-lg shadow-accent/30 hover:shadow-accent/50 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Get a Free Quote</span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent via-accent-glow to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          <Link
            href="/contact"
            className="group relative glass-tech neon-border text-white px-8 py-4 rounded-lg font-semibold hover:shadow-neon transition-all duration-300 cursor-pointer text-lg overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Schedule Consultation
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
        </div>

        {/* Quick Trust Signals */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
          <div className="group flex items-center gap-3 glass-tech px-4 py-3 rounded-xl neon-border hover:shadow-neon transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan/20 to-cyan/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">Free Consultation</p>
              <p className="text-white/70 text-sm">No obligation</p>
            </div>
          </div>
          <div className="group flex items-center gap-3 glass-tech px-4 py-3 rounded-xl neon-border hover:shadow-neon transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-purple/20 to-purple/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">Quick Response</p>
              <p className="text-white/70 text-sm">Within 24 hours</p>
            </div>
          </div>
          <div className="group flex items-center gap-3 glass-tech px-4 py-3 rounded-xl neon-border hover:shadow-neon transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">100% Satisfaction</p>
              <p className="text-white/70 text-sm">Guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
