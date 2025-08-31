import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Rocket, 
  Users, 
  Brain, 
  Zap, 
  ArrowRight, 
  Star,
  CheckCircle,
  MessageCircle,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Crown,
  Briefcase,
  Facebook,
  MessageSquare,
  Sparkles,
  Target,
  Shield,
  Globe,
  Cpu,
  Network,
  Play,
  Smartphone,
  Code,
  Palette,
  Server,
  ArrowUpRight
} from 'lucide-react'
import LanguageSwitcher from '../components/shared/LanguageSwitcher'
import Chatbot from '../components/chat/Chatbot'

function LandingPage() {
  const { currentUser, logout } = useAuth()
  const { t } = useLanguage()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    // Create floating particles
    const newParticles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.3 + 0.1
    }))
    setParticles(newParticles)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const getDashboardPath = () => {
    if (!currentUser) return '/login'
    switch (currentUser.role) {
      case 'client': return '/client'
      case 'admin': return '/admin'
      case 'owner': return '/owner'
      default: return '/login'
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'client': return <User className="w-4 h-4" />
      case 'admin': return <Crown className="w-4 h-4" />
      case 'owner': return <Crown className="w-4 h-4" />
      default: return <User className="w-4 h-4" />
    }
  }

  const getRoleName = (role) => {
    switch (role) {
      case 'client': return 'Client'
      case 'admin': return 'Admin'
      case 'owner': return 'Owner'
      default: return 'User'
    }
  }

  return (
    <div className="min-h-screen bg-cyber-gradient relative overflow-hidden">
      {/* Particle Background */}
      <div className="particle-bg"></div>
      <div className="holographic-grid"></div>
      
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-neon-blue rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [particle.opacity, 0, particle.opacity],
            }}
            transition={{
              duration: 10 + particle.speed * 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Mouse Trail Effect */}
      <motion.div
        className="fixed w-4 h-4 bg-neon-blue rounded-full pointer-events-none z-10 mix-blend-screen"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Navigation */}
      <nav className="futuristic-nav relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center space-x-4"
            >
              <div className="holographic-border">
                <div className="bg-cyber-dark px-6 py-2 rounded-lg">
                  <h1 className="text-2xl font-display font-bold holographic-text">
                    ZENTROX CORE
                  </h1>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center space-x-4"
            >
              <LanguageSwitcher />
              
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <div className="relative group">
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg glass-effect hover:glass-effect-strong transition-all duration-300">
                      <div className="w-8 h-8 rounded-full bg-neon-gradient flex items-center justify-center">
                        {getRoleIcon(currentUser.role)}
                      </div>
                      <span className="text-white font-cyber">{currentUser.displayName}</span>
                      <ChevronDown className="w-4 h-4 text-neon-blue" />
                    </button>
                    
                    <div className="absolute right-0 mt-2 w-48 bg-cyber-dark rounded-lg shadow-neon-blue border border-neon-blue opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <div className="p-2">
                        <Link to={getDashboardPath()} className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white hover:bg-neon-blue hover:text-cyber-dark transition-colors">
                          <Briefcase className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                        <button onClick={handleLogout} className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white hover:bg-red-500 transition-colors w-full">
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="btn-secondary">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-cta">
                    Get Started
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mb-12"
            >
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-8">
                <span className="text-white">Transforming Ideas into</span>
                <br />
                <span className="holographic-text">Powerful Digital Solutions</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
                We design and build world-class mobile and web applications that help businesses grow.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
            >
              <Link to="/register" className="btn-cta group">
                <span className="flex items-center space-x-2">
                  <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                  <span>Start Your Project</span>
                </span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link to="#projects" className="btn-secondary group">
                <span className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5" />
                  <span>View Our Work</span>
                </span>
                <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="flex justify-center"
            >
              <div className="w-6 h-6 border-2 border-neon-blue rounded-full animate-bounce">
                <div className="w-2 h-2 bg-neon-blue rounded-full mx-auto mt-1"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                ABOUT US
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                We are Zentrox Core, a team of creative thinkers, problem solvers, and tech enthusiasts. 
                Our passion for innovation and excellence sets us apart.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-cyber-dark border border-neon-blue hover:bg-neon-blue/20 transition-all duration-300 group hover-glow"
              >
                <div className="w-10 h-10 rounded-full bg-neon-blue flex items-center justify-center group-hover:animate-pulse hover-bounce">
                  <Play className="w-5 h-5 text-white ml-0.5" />
                </div>
                <span className="text-white font-cyber">Play Video</span>
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="holographic-border p-4 rounded-2xl">
                <div className="bg-cyber-dark rounded-xl aspect-video relative overflow-hidden group hover-lift">
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 via-neon-purple/20 to-neon-pink/20 group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-neon-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-cyber-pulse hover-bounce">
                        <Users className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">
                        Our Team
                      </h3>
                      <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors">
                        Creative minds working together
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              OUR SERVICES
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive digital solutions tailored to your business needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Smartphone className="w-12 h-12" />,
                title: "Mobile App Development",
                description: "High-tech thinking, problem solvers, and innovative mobile solutions"
              },
              {
                icon: <Code className="w-12 h-12" />,
                title: "Web Development",
                description: "Web development services with cutting-edge technology"
              },
              {
                icon: <Palette className="w-12 h-12" />,
                title: "UI/UX Design",
                description: "Perfect control, cool design with pen and ruler approach"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="holographic-border p-6 rounded-2xl hover-lift hover-glow group">
                  <div className="bg-cyber-dark p-6 rounded-xl text-center group-hover:bg-cyber-dark/80 transition-all duration-300">
                    <div className="w-16 h-16 bg-neon-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-cyber-pulse hover-bounce">
                      <div className="text-white group-hover:scale-110 transition-transform duration-300">
                        {service.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-neon-blue transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              FEATURED PROJECTS
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Showcasing our latest work and innovative solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Project One",
                description: "Mobile Application",
                image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop"
              },
              {
                title: "Project Two",
                description: "Web Platform",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
              },
              {
                title: "Project Three",
                description: "Dashboard System",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
              }
            ].map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl hover-lift hover-glow group">
                  <div className="aspect-[4/3] bg-gradient-to-br from-neon-blue/20 via-neon-purple/20 to-neon-pink/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-cyber-dark/80 group-hover:bg-cyber-dark/60 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-neon-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-cyber-pulse hover-bounce">
                          <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 border border-neon-blue/30 rounded-2xl group-hover:border-neon-blue/60 transition-all duration-300"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="holographic-border p-8 rounded-2xl hover-lift"
          >
            <div className="bg-cyber-dark p-8 rounded-xl">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                <span className="holographic-text">Have no ideas?</span>
                <br />
                <span className="text-white">Let's bring it to life</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Ready to transform your vision into reality? Let's create something amazing together.
              </p>
              <Link to="/register" className="btn-cta inline-flex items-center space-x-2 hover-bounce">
                <Zap className="w-5 h-5" />
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
          <Chatbot />
        </div>
      </section>
    </div>
  )
}

export default LandingPage 