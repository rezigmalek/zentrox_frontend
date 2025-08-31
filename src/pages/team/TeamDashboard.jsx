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
  Home,
  Briefcase,
  Calendar,
  Star
} from 'lucide-react'
// Firebase imports removed - using local storage instead

function TeamDashboard() {
  const { currentUser, logout } = useAuth()
  const { t } = useLanguage()
  const [projects, setProjects] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Fetch all projects
    const projectsQuery = query(
      collection(db, 'projects'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProjects(projectsData)
    })

    // Fetch team members
    const teamQuery = query(
      collection(db, 'users'),
      where('role', '==', 'team')
    )

    const unsubscribeTeam = onSnapshot(teamQuery, (snapshot) => {
      const teamData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTeamMembers(teamData)
      setLoading(false)
    })

    return () => {
      unsubscribeProjects()
      unsubscribeTeam()
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Error logging out')
    }
  }

  const getMemberStats = (memberId) => {
    const memberProjects = projects.filter(project => 
      project.teamMembers && project.teamMembers.includes(memberId)
    )
    
    return {
      total: memberProjects.length,
      inProgress: memberProjects.filter(p => p.status === 'in-progress').length,
      completed: memberProjects.filter(p => p.status === 'completed').length,
      pending: memberProjects.filter(p => p.status === 'pending').length
    }
  }

  const getMemberProjects = (memberId) => {
    return projects.filter(project => 
      project.teamMembers && project.teamMembers.includes(memberId)
    )
  }

  const filteredTeamMembers = teamMembers.filter(member => {
    const matchesSearch = member.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const stats = {
    totalMembers: teamMembers.length,
    activeMembers: teamMembers.filter(m => getMemberStats(m.id).total > 0).length,
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'in-progress').length
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
              <h1 className="text-2xl font-display font-bold gradient-text">
                {t('teamDashboard')}
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
            { label: 'Total Team Members', value: stats.totalMembers, icon: Users, color: 'text-blue-400' },
            { label: 'Active Members', value: stats.activeMembers, icon: User, color: 'text-green-400' },
            { label: 'Total Projects', value: stats.totalProjects, icon: Briefcase, color: 'text-purple-400' },
            { label: 'Active Projects', value: stats.activeProjects, icon: AlertCircle, color: 'text-yellow-400' }
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

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0"
        >
          <h2 className="text-2xl font-display font-bold">Team Members Overview</h2>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-64"
              />
            </div>
          </div>
        </motion.div>

        {/* Team Members Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading team members...</p>
          </div>
        ) : filteredTeamMembers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No team members found</h3>
            <p className="text-gray-400">
              {searchTerm 
                ? 'Try adjusting your search criteria'
                : 'No team members have been added yet'
              }
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTeamMembers.map((member, index) => {
              const memberStats = getMemberStats(member.id)
              const memberProjects = getMemberProjects(member.id)
              
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card"
                >
                  {/* Member Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-glow-blue to-glow-purple rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.displayName}</h3>
                        <p className="text-sm text-gray-400">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-gray-400">{member.availability || 'Full Time'}</span>
                    </div>
                  </div>

                  {/* Member Details */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Specialization</p>
                      <p className="text-sm font-medium">{member.specialization || 'Not specified'}</p>
                    </div>
                    {member.skills && (
                      <div>
                        <p className="text-sm text-gray-400">Skills</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {member.skills.split(',').map((skill, idx) => (
                            <span key={idx} className="text-xs bg-dark-700 px-2 py-1 rounded">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Member Stats */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { label: 'Total', value: memberStats.total, color: 'text-blue-400' },
                      { label: 'Active', value: memberStats.inProgress, color: 'text-yellow-400' },
                      { label: 'Done', value: memberStats.completed, color: 'text-green-400' },
                      { label: 'Pending', value: memberStats.pending, color: 'text-orange-400' }
                    ].map((stat, idx) => (
                      <div key={idx} className="text-center">
                        <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs text-gray-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Member Projects */}
                  {memberProjects.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Current Projects</p>
                      <div className="space-y-2">
                        {memberProjects.slice(0, 3).map((project) => (
                          <div key={project.id} className="flex items-center justify-between text-xs">
                            <span className="truncate flex-1">{project.title}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              project.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              project.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                              project.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                        ))}
                        {memberProjects.length > 3 && (
                          <p className="text-xs text-gray-400 text-center">
                            +{memberProjects.length - 3} more projects
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {memberProjects.length === 0 && (
                    <div className="text-center py-4">
                      <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No projects assigned</p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamDashboard 