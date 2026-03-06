import type { Metadata } from 'next'
import { FaCode, FaLaptopCode, FaPalette, FaServer, FaMobileAlt, FaDatabase, FaCloud, FaShieldAlt } from 'react-icons/fa'

export const metadata: Metadata = {
  title: 'Our Services | RAME Tech Consultancy',
  description: 'Explore our range of tech services including software development, hardware & IT solutions, and graphic design.',
}

const services = [
  {
    icon: FaCode,
    title: 'Software Development',
    description: 'Custom web applications, mobile apps, and enterprise software solutions tailored to your business needs.',
    features: ['Web Application Development', 'Mobile App Development (iOS & Android)', 'API Development & Integration', 'E-commerce Solutions', 'Custom Software']
  },
  {
    icon: FaLaptopCode,
    title: 'Hardware & IT',
    description: 'Complete IT infrastructure solutions including networking, server management, and technical support.',
    features: ['Network Setup & Maintenance', 'Server Management', 'IT Support & Maintenance', 'Hardware Procurement', 'Cloud Solutions']
  },
  {
    icon: FaPalette,
    title: 'Graphic Design',
    description: 'Professional design services to build your brand identity and create compelling visual content.',
    features: ['Logo & Brand Identity', 'Marketing Materials', 'Social Media Graphics', 'Print Design', 'UI/UX Design']
  },
  {
    icon: FaMobileAlt,
    title: 'Mobile Development',
    description: 'Native and cross-platform mobile applications for iOS and Android platforms.',
    features: ['iOS Development', 'Android Development', 'React Native Apps', 'Flutter Apps', 'App Store Submission']
  },
  {
    icon: FaDatabase,
    title: 'Database Solutions',
    description: 'Design, implementation, and management of scalable database systems.',
    features: ['Database Design', 'Data Migration', 'Performance Optimization', 'Backup & Recovery', 'Data Security']
  },
  {
    icon: FaCloud,
    title: 'Cloud Services',
    description: 'Cloud infrastructure setup and migration services for modern businesses.',
    features: ['Cloud Migration', 'AWS Services', 'Azure Solutions', 'Cloud Security', 'DevOps Services']
  }
]

export default function ServicesPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primaryDark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Comprehensive tech solutions to help your business grow and succeed in the digital age.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="text-sm text-gray-500 flex items-center">
                      <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's discuss your project and create a tailored solution for your business needs.
          </p>
          <a href="/contact" className="btn-primary">
            Get a Free Quote
          </a>
        </div>
      </section>
    </div>
  )
}
