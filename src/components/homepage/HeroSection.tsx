'use client'

import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-dark via-primary to-secondary overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-float"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple rounded-full blur-3xl animate-float delay-300"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-float delay-500"></div>
      </div>

      {/* Tech Grid Pattern */}
      <div className="absolute inset-0 tech-grid-pattern opacity-30"></div>

      {/* Geometric Shapes */}
      <div className="absolute top-20 right-10 w-32 h-32 border-2 border-neon-blue/20 rotate-45 animate-rotate-slow"></div>
      <div className="absolute bottom-32 left-10 w-24 h-24 border-2 border-purple/20 rotate-12 animate-pulse"></div>

      {/* Circuit Lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan to-transparent"></div>
        <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left animate-fade-in-up">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 glass-tech neon-border rounded-full px-5 py-2.5 mb-6 group hover:shadow-neon transition-all duration-300">
              <svg className="w-5 h-5 text-cyan group-hover:text-neon-blue transition-colors" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white text-sm font-semibold tracking-wide">Trusted by 30+ Businesses</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              Innovative Tech{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-accent to-accent-glow">Solutions</span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan via-accent to-transparent rounded-full"></div>
              </span>{' '}
              for Your Business
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0">
              RAME Tech Consultancy delivers cutting-edge software development, hardware & IT solutions, and professional graphic design services to help your business thrive.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/contact"
                className="group relative btn-accent text-center text-lg px-8 py-4 shadow-lg shadow-accent/30 hover:shadow-accent/50 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Get a Free Quote</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent via-accent-glow to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                href="/portfolio"
                className="group relative glass-tech neon-border text-white px-8 py-4 rounded-lg font-semibold hover:shadow-neon transition-all duration-300 cursor-pointer text-center text-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  View Our Work
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-10">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white/70 text-sm">5+ Years Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white/70 text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white/70 text-sm">100% Satisfaction</span>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="hidden lg:block animate-fade-in-up delay-200">
            <div className="relative glass-tech rounded-3xl p-8 neon-border shadow-2xl group hover:shadow-neon-strong transition-all duration-500">
              {/* Decorative Corner Elements */}
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-neon-blue/40"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-purple/40"></div>

              <div className="grid grid-cols-2 gap-6">
                <div className="group/card relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 text-center border border-white/10 hover:border-cyan/50 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan/0 to-cyan/10 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan">50+</div>
                    <div className="text-white/70 text-sm font-medium">Projects Completed</div>
                  </div>
                </div>
                <div className="group/card relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 text-center border border-white/10 hover:border-purple/50 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple/0 to-purple/10 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple">30+</div>
                    <div className="text-white/70 text-sm font-medium">Happy Clients</div>
                  </div>
                </div>
                <div className="group/card relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 text-center border border-white/10 hover:border-accent/50 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/10 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-accent">5+</div>
                    <div className="text-white/70 text-sm font-medium">Years Experience</div>
                  </div>
                </div>
                <div className="group/card relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 text-center border border-white/10 hover:border-neon-blue/50 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/0 to-neon-blue/10 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-neon-blue">24/7</div>
                    <div className="text-white/70 text-sm font-medium">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F8FAFC"/>
        </svg>
      </div>
    </section>
  )
}
