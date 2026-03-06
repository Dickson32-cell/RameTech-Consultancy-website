import Link from 'next/link'
import Image from 'next/image'
import { FaPhone, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaInstagram } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="relative h-12 w-40 mb-4">
              <Image 
                src="/logo.jpg" 
                alt="RAME Tech Consultancy"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-gray-400 mb-4">
              Professional tech consultancy delivering innovative solutions in software development, hardware & IT, and graphic design.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/rametech_consultancy?igsh=MTJyOXhic2F4Z2Fhcw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-colors"><FaInstagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-accent transition-colors">Services</Link></li>
              <li><Link href="/portfolio" className="text-gray-400 hover:text-accent transition-colors">Portfolio</Link></li>
              <li><Link href="/team" className="text-gray-400 hover:text-accent transition-colors">Team</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-accent transition-colors">Blog</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-accent transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-gray-400 hover:text-accent transition-colors">Software Development</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-accent transition-colors">Hardware & IT</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-accent transition-colors">Graphic Design</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-accent transition-colors">Get a Quote</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400">
                <FaPhone className="mr-2" />
                <span>+233 55 733 2615</span>
              </li>
              <li className="flex items-center text-gray-400">
                <FaWhatsapp className="mr-2" />
                <span>+233 55 733 2615</span>
              </li>
              <li className="flex items-center text-gray-400">
                <FaEnvelope className="mr-2" />
                <span>info.rametechconsultancy@gmail.com</span>
              </li>
              <li className="flex items-start text-gray-400">
                <FaMapMarkerAlt className="mr-2 mt-1" />
                <span>Ghana</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} RAME Tech Consultancy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
