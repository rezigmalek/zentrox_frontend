import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { toast } from 'react-hot-toast'
import LanguageSwitcher from '../../components/shared/LanguageSwitcher'
import { 
  Plus, 
  LogOut, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MessageCircle,
  FileText,
  Calendar,
  Home,
  Rocket,
  Target,
  TrendingUp
} from 'lucide-react'
import ProjectSubmissionForm from '../../components/client/ProjectSubmissionForm'
import ProjectCard from '../../components/client/ProjectCard'
// Firebase imports removed - using local storage instead

function ClientDashboard() {
  const { currentUser, logout } = useAuth()
  const { t } = useLanguage()
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) return

    const q = query(
      collection(db, 'projects'),
      where('clientId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProjects(projectsData)
      setLoading(false)
    }, (error) => {
      console.error('Error fetching projects:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [currentUser])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Error logging out')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-neon-orange'
      case 'in-progress': return 'text-neon-blue'
      case 'completed': return 'text-neon-green'
      case 'rejected': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'in-progress': return <AlertCircle className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const stats = {
    total: projects.length,
    pending: projects.filter(p => p.status === 'pending').length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    completed: projects.filter(p => p.status === 'completed').length
  }

  return (
    <div className="min-h-screen bg-cyber-gradient relative overflow-hidden">
      {/* Background Effects */}
      <div className="particle-bg"></div>
      <div className="holographic-grid"></div>
      
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-green rounded-full"
            style={{
              left: Math.random() * window.innerWidth,
              top: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.3 + 0.1,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 6 + Math.random() * 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="futuristic-nav relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="btn-secondary">
                <Home className="w-4 h-4 mr-2" />
                {t('home')}
              </Link>
              <h1 className="text-2xl font-display font-bold holographic-text">
                {t('clientDashboard')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              
              <button
                onClick={() => setShowSubmissionForm(true)}
                className="btn-cta group"
              >
                <Plus className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                New Project
              </button>
              
              <div className="relative group">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg glass-effect hover:glass-effect-strong transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-neon-gradient flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-cyber">{currentUser?.displayName}</span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-cyber-dark rounded-lg shadow-neon-blue border border-neon-blue opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="p-2">
                    <button onClick={handleLogout} className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white hover:bg-red-500 transition-colors w-full">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { icon: <Rocket className="w-6 h-6" />, label: 'Total Projects', value: stats.total, color: 'neon-blue' },
            { icon: <Clock className="w-6 h-6" />, label: 'Pending', value: stats.pending, color: 'neon-orange' },
            { icon: <Target className="w-6 h-6" />, label: 'In Progress', value: stats.inProgress, color: 'neon-purple' },
            { icon: <CheckCircle className="w-6 h-6" />, label: 'Completed', value: stats.completed, color: 'neon-green' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="futuristic-card group hover:shadow-neon-blue"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg bg-neon-gradient flex items-center justify-center group-hover:animate-cyber-pulse`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <div>
                  <div className={`text-2xl font-display font-bold text-${stat.color} group-hover:animate-neon-flicker`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-300 font-cyber text-sm">
                    {stat.label}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Projects Section */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-between"
          >
            <h2 className="text-2xl font-display font-bold text-white">
              Your Projects
            </h2>
            <div className="flex items-center space-x-2 text-gray-300">
              <TrendingUp className="w-4 h-4" />
              <span className="font-cyber">Project Overview</span>
            </div>
          </motion.div>

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="futuristic-card text-center py-12"
            >
              <div className="cyber-spinner mx-auto mb-4"></div>
              <p className="text-gray-300 font-cyber">Loading projects...</p>
            </motion.div>
          ) : projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="futuristic-card text-center py-12"
            >
              <div className="w-16 h-16 bg-neon-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2">
                No projects yet
              </h3>
              <p className="text-gray-300 mb-6">
                Start by submitting your first project request
              </p>
              <button
                onClick={() => setShowSubmissionForm(true)}
                className="btn-cta group"
              >
                <Plus className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                Create Your First Project
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Project Submission Modal */}
      {showSubmissionForm && (
        <ProjectSubmissionForm
          onClose={() => setShowSubmissionForm(false)}
          onSuccess={() => {
            setShowSubmissionForm(false)
            toast.success('Project submitted successfully!')
          }}
        />
      )}
    </div>
  )
}

export default ClientDashboard 