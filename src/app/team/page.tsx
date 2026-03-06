import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Our Team | RAME Tech Consultancy',
  description: 'Meet the talented team behind RAME Tech Consultancy.',
}

const teamMembers = [
  {
    name: 'Abdul Rashid Dickson',
    role: 'CEO',
    bio: 'Leading RAME Tech with vision and expertise in software development and business strategy.',
    image: '/images/team/abdul-rashid-dickson.jpg'
  },
  {
    name: 'Harriet Emefa Asonkey',
    role: 'Administrator',
    bio: 'Keeping operations smooth and efficient with exceptional organizational skills.',
    image: '/images/team/harriet-emefa-asonkey.jpg'
  },
  {
    name: 'Dickson Abdul-Wahab',
    role: 'Researcher',
    bio: 'Driving innovation through thorough research and technical exploration.',
    image: '/images/team/dickson-abdul-wahab.jpg'
  },
  {
    name: 'Anyetei Sowah Joseph',
    role: 'Graphic Designer',
    bio: 'Creative designer bringing brands to life with stunning visual designs.',
    image: '/images/team/anyetei-sowah-joseph.jpg'
  },
  {
    name: 'David Tetteh',
    role: 'Hardware Technician',
    bio: 'Expert in hardware setup, repairs, and IT infrastructure maintenance.',
    image: '/images/team/david-tetteh.jpg'
  }
]

export default function TeamPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primaryDark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Team</h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Meet the talented people behind RAME Tech Consultancy who make it all happen.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="card text-center group">
                <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden bg-gray-200">
                  {member.image ? (
                    <Image 
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-white text-2xl font-bold">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-accent font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Join Our Team?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals. Get in touch with us!
          </p>
          <a href="/contact" className="btn-primary">
            Contact Us
          </a>
        </div>
      </section>
    </div>
  )
}
