'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  photoUrl: string | null
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/v1/team')
      .then(res => res.json())
      .then(data => {
        if (data.success) setMembers(data.data)
      })
      .catch(() => {})
  }, [])

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2)
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-secondary to-primary text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <span className="text-sm font-medium">Meet the Experts</span>
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">Our Team</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Meet the talented people behind RAME Tech Consultancy who make it all happen.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <div 
                key={member.id}
                className="bento-card text-center group cursor-pointer"
                onMouseEnter={() => setHoveredId(member.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Avatar */}
                <div className="relative w-40 h-40 mx-auto mb-6">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className={`w-full h-full object-cover rounded-full transition-all duration-300 ${hoveredId === member.id ? 'scale-105' : ''}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white text-3xl font-bold rounded-full">
                      {getInitials(member.name)}
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent rounded-full flex items-end justify-center pb-4 transition-opacity duration-300 ${hoveredId === member.id ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex gap-3">
                      <a href="#" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-colors duration-200 cursor-pointer">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-heading font-semibold text-text mb-1">{member.name}</h3>
                <p className="text-accent font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-secondary to-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Want to Join Our Team?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals. Get in touch with us!
          </p>
          <Link href="/contact" className="btn-accent text-lg px-8 py-4 cursor-pointer">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}
