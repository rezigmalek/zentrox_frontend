import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import LanguageSwitcher from '../../components/shared/LanguageSwitcher'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      toast.success('Logged in successfully!')
    } catch (error) {
      toast.error('Failed to log in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cyber-gradient relative overflow-hidden">
      {/* Background Effects */}
      <div className="particle-bg"></div>
      <div className="holographic-grid"></div>
      
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 30 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-blue rounded-full"
            style={{
              left: Math.random() * window.innerWidth,
              top: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-20 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="btn-secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToHome')}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="holographic-border p-8 rounded-2xl">
            <div className="bg-cyber-dark p-8 rounded-xl">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-16 h-16 bg-neon-gradient rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Lock className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-3xl font-display font-bold holographic-text mb-2">
                  {t('signIn')}
                </h2>
                <p className="text-gray-300">
                  Welcome back to Zentrox Core
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-cyber text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-neon-blue" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="cyber-input pl-10 w-full"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-cyber text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neon-blue" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="cyber-input pl-10 pr-10 w-full"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-neon-blue transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-neon-blue transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="btn-cta w-full group"
                >
                  {loading ? (
                    <div className="cyber-spinner mx-auto"></div>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <Lock className="w-5 h-5" />
                      <span>{t('signIn')}</span>
                    </span>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-300">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-neon-blue hover:text-neon-purple transition-colors font-cyber">
                    {t('signUp')}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login 