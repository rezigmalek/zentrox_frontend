import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { toast } from 'react-hot-toast'
import LanguageSwitcher from '../../components/shared/LanguageSwitcher'
import { 
  LogOut, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  Search,
  Home
} from 'lucide-react'
// Firebase imports removed - using local storage instead
import AdminProjectCard from '../../components/admin/AdminProjectCard'
import TeamAssignmentModal from '../../components/admin/TeamAssignmentModal'

function AdminDashboard() {
  const { currentUser, logout } = useAuth()
  const { t } = useLanguage()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')


  useEffect(() => {
    const q = query(
      collection(db, 'projects'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProjects(projectsData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Error logging out')
    }
  }

  const handleProjectAction = async (projectId, action, data = {}) => {
    try {
      const projectRef = doc(db, 'projects', projectId)
      await updateDoc(projectRef, {
        status: action,
        ...data,
        updatedAt: new Date()
      })
      toast.success(`Project ${action} successfully`)
    } catch (error) {
      toast.error('Error updating project')
    }
  }



  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.status === filter
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: projects.length,
    pending: projects.filter(p => p.status === 'pending').length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    completed: projects.filter(p => p.status === 'completed').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Header */}
      <header className="glass-effect border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
              <Link to="/" className="btn-secondary">
                <Home className="w-4 h-4 mr-2" />
                {t('home')}
              </Link>
              <Link to="/team" className="btn-secondary">
                <Users className="w-4 h-4 mr-2" />
                {t('teamManagement')}
              </Link>
              <h1 className="text-2xl font-display font-bold gradient-text">
                {t('adminDashboard')}
              </h1>
            </div>

                          <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                <div className="flex items-center space-x-2 text-gray-300">
                  <User className="w-4 h-4" />
                  <span>{currentUser?.displayName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('logout')}
                </button>
              </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: 'Total Projects', value: stats.total, icon: Users, color: 'text-blue-400' },
            { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-yellow-400' },
            { label: 'In Progress', value: stats.inProgress, icon: AlertCircle, color: 'text-blue-400' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-400' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0"
        >
          <h2 className="text-2xl font-display font-bold">Project Management</h2>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-64"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Projects</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-gray-400">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No projects have been submitted yet'
              }
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AdminProjectCard
                  project={project}
                  onAction={handleProjectAction}
                  onAssignTeam={() => {
                    setSelectedProject(project)
                    setShowTeamModal(true)
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Team Assignment Modal */}
      {showTeamModal && selectedProject && (
        <TeamAssignmentModal
          project={selectedProject}
          onClose={() => {
            setShowTeamModal(false)
            setSelectedProject(null)
          }}
          onSuccess={() => {
            setShowTeamModal(false)
            setSelectedProject(null)
            toast.success('Team assigned successfully!')
          }}
        />
      )}


    </div>
  )
}

export default AdminDashboard 