import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiPackage, FiTruck, FiMapPin, FiArrowRight } from 'react-icons/fi'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1600&auto=format&fit=crop',
    title: 'Fast & Reliable Delivery',
    subtitle: 'On-time logistics across cities, warehouses, and your doorstep.'
  },
  {
    image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=1600&auto=format&fit=crop',
    title: 'Real-Time Package Tracking',
    subtitle: 'Track your shipments with live updates and detailed history.'
  },
  {
    image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=1600&auto=format&fit=crop',
    title: 'Secure Last-Mile Delivery',
    subtitle: 'Proof of delivery and notifications for every shipment.'
  }
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <section className="relative h-[70vh] sm:h-[80vh] lg:h-[85vh] overflow-hidden">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-dark-bg/90 via-dark-bg/70 to-dark-bg/90"></div>
          </div>
        ))}

        <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6">
          <div className="max-w-5xl w-full text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              {slides[currentSlide].title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 px-4">
              {slides[currentSlide].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link to="/tracking" className="bg-accent-primary hover:bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition flex items-center justify-center gap-2">
                <FiSearch />
                Track Package
              </Link>
              <a href="#services" className="bg-dark-card hover:bg-dark-hover border-2 border-dark-border text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition flex items-center justify-center gap-2">
                <FiPackage />
                Our Services
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide ? 'bg-accent-primary w-6 sm:w-8' : 'bg-gray-600 w-2'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">Our Services</h2>
            <p className="text-gray-400 text-base sm:text-lg px-4">Smart logistics, transparent tracking, and fast delivery experiences</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6 sm:p-8 hover:border-accent-primary transition group">
              <div className="bg-accent-primary/10 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-accent-primary/20 transition">
                <FiSearch className="text-accent-primary text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Package Tracking</h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">Live status, route milestones, and ETA updates at your fingertips.</p>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6 sm:p-8 hover:border-accent-primary transition group">
              <div className="bg-green-500/10 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-green-500/20 transition">
                <FiMapPin className="text-green-400 text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Doorstep Delivery</h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">Secure last-mile delivery with proof of delivery and alerts.</p>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6 sm:p-8 hover:border-accent-primary transition group md:col-span-2 lg:col-span-1">
              <div className="bg-purple-500/10 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-purple-500/20 transition">
                <FiTruck className="text-purple-400 text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Logistics Management</h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">Bulk shipments, warehousing, and route optimization for businesses.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-12 bg-dark-card border-y border-dark-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">About SwiftShip</h2>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed px-4">
            SwiftShip is committed to delivering reliable, secure and timely consignment services across cities and hubs. 
            We combine experienced local teams with modern logistics tools to give customers visibility and peace of mind.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 lg:px-12 bg-dark-bg border-t border-dark-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-sm sm:text-base">&copy; 2025 SwiftShip. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
