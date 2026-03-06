import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Portfolio | RAME Tech Consultancy',
  description: 'View our portfolio of completed projects across software development, hardware & IT, and graphic design.',
}

const projects = [
  {
    title: 'E-Commerce Platform',
    category: 'Web Development',
    description: 'A full-featured online store with payment integration, inventory management, and admin dashboard.',
    image: 'https://ui-avatars.com/api/?name=E-Commerce&size=600x400&background=1A5276&color=fff',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe']
  },
  {
    title: 'Mobile Banking App',
    category: 'Mobile Development',
    description: 'Secure mobile banking application with bill payments, transfers, and transaction history.',
    image: 'https://ui-avatars.com/api/?name=Banking+App&size=600x400&background=F39C12&color=fff',
    technologies: ['React Native', 'Node.js', 'MongoDB']
  },
  {
    title: 'Corporate Branding Package',
    category: 'Graphic Design',
    description: 'Complete brand identity including logo, business cards, letterhead, and brand guidelines.',
    image: 'https://ui-avatars.com/api/?name=Branding&size=600x400&background=154360&color=fff',
    technologies: ['Adobe Illustrator', 'Photoshop', 'Figma']
  },
  {
    title: 'School Management System',
    category: 'Web Development',
    description: 'Comprehensive school management software with student records, attendance, and grading.',
    image: 'https://ui-avatars.com/api/?name=School+System&size=600x400&background=2E86AB&color=fff',
    technologies: ['React', 'Python Django', 'PostgreSQL']
  },
  {
    title: 'Hotel Reservation System',
    category: 'Web Development',
    description: 'Online booking system with room availability, payment processing, and admin management.',
    image: 'https://ui-avatars.com/api/?name=Hotel+System&size=600x400&background=E67E22&color=fff',
    technologies: ['Vue.js', 'Laravel', 'MySQL']
  },
  {
    title: 'Healthcare App',
    category: 'Mobile Development',
    description: 'Patient management and telemedicine application for healthcare providers.',
    image: 'https://ui-avatars.com/api/?name=Healthcare+App&size=600x400&background=27AE60&color=fff',
    technologies: ['Flutter', 'Firebase', 'Node.js']
  }
]

export default function PortfolioPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primaryDark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Portfolio</h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Browse through our completed projects and see how we've helped businesses transform their digital presence.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="card overflow-hidden p-0 group">
                <div className="relative h-56 bg-gray-200">
                  <Image 
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-accent font-medium mb-2">{project.category}</p>
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, tIndex) => (
                      <span key={tIndex} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Have a Project in Mind?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's discuss your project and create something amazing together.
          </p>
          <a href="/contact" className="btn-primary">
            Start Your Project
          </a>
        </div>
      </section>
    </div>
  )
}
