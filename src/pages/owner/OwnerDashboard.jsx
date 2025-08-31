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
  Brain,
  Settings,
  Filter,
  Search,
  Home,
  Plus,
  Crown,
  UserPlus,
  Briefcase,
  Target,
  Star
} from 'lucide-react'
// Firebase imports removed - using local storage instead

function OwnerDashboard() {
  const { currentUser, logout } = useAuth()
  const { t } = useLanguage()
  const [projects, setProjects] = useState([])
  const [admins, setAdmins] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [showAddTeamMember, setShowAddTeamMember] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Form states
  const [newAdminData, setNewAdminData] = useState({
    email: '',
    displayName: '',
    role: 'admin'
  })

  const [newTeamMemberData, setNewTeamMemberData] = useState({
    email: '',
    displayName: '',
    role: 'team',
    skills: '',
    specialization: '',
    availability: 'full-time'
  })

  useEffect(() => {
    // Load projects
    const projectsQuery = query(
      collection(db, 'projects'),
      orderBy('createdAt', 'desc')
    )

    const projectsUnsubscribe = onSnapshot(projectsQuery, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProjects(projectsData)
    })

    // Load admins
    const adminsQuery = query(
      collection(db, 'users'),
      where('role', '==', 'admin')
    )

    const adminsUnsubscribe = onSnapshot(adminsQuery, (snapshot) => {
      const adminsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setAdmins(adminsData)
    })

    // Load team members
    const teamQuery = query(
      collection(db, 'users'),
      where('role', '==', 'team')
    )

    const teamUnsubscribe = onSnapshot(teamQuery, (snapshot) => {
      const teamData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTeamMembers(teamData)
      setLoading(false)
    })

    return () => {
      projectsUnsubscribe()
      adminsUnsubscribe()
      teamUnsubscribe()
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

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    try {
      const adminId = `admin_${Date.now()}`
      await setDoc(doc(db, 'users', adminId), {
        uid: adminId,
        email: newAdminData.email,
        displayName: newAdminData.displayName,
        role: 'admin',
        createdAt: new Date(),
        createdBy: currentUser.uid,
        permissions: ['manage_projects', 'assign_teams', 'view_reports']
      })
      
      toast.success('Admin user created successfully!')
      setShowAddAdmin(false)
      setNewAdminData({ email: '', displayName: '', role: 'admin' })
    } catch (error) {
      toast.error('Error creating admin user')
    }
  }

  const handleAddTeamMember = async (e) => {
    e.preventDefault()
    try {
      const memberId = `team_${Date.now()}`
      await setDoc(doc(db, 'users', memberId), {
        uid: memberId,
        email: newTeamMemberData.email,
        displayName: newTeamMemberData.displayName,
        role: 'team',
        skills: newTeamMemberData.skills.split(',').map(skill => skill.trim()),
        specialization: newTeamMemberData.specialization,
        availability: newTeamMemberData.availability,
        createdAt: new Date(),
        createdBy: currentUser.uid,
        currentProjects: [],
        completedProjects: 0,
        rating: 0
      })
      
      toast.success('Team member created successfully!')
      setShowAddTeamMember(false)
      setNewTeamMemberData({
        email: '',
        displayName: '',
        role: 'team',
        skills: '',
        specialization: '',
        availability: 'full-time'
      })
    } catch (error) {
      toast.error('Error creating team member')
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
    completed: projects.filter(p => p.status === 'completed').length,
    admins: admins.length,
    teamMembers: teamMembers.length
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
                {t('ownerDashboard')}
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
          className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8"
        >
          {[
            { label: 'Total Projects', value: stats.total, icon: Briefcase, color: 'text-blue-400' },
            { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-yellow-400' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-400' },
            { label: 'Pending', value: stats.pending, icon: AlertCircle, color: 'text-orange-400' },
            { label: 'Admins', value: stats.admins, icon: Crown, color: 'text-purple-400' },
            { label: 'Team Members', value: stats.teamMembers, icon: Users, color: 'text-cyan-400' }
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

        {/* Team Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Admins */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold">Admin Team</h2>
              <button
                onClick={() => setShowAddAdmin(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Admin
              </button>
            </div>
            <div className="space-y-3">
              {admins.map((admin) => (
                <div key={admin.uid} className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Crown className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="font-medium">{admin.displayName}</p>
                      <p className="text-sm text-gray-400">{admin.email}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">Admin</span>
                </div>
              ))}
              {admins.length === 0 && (
                <p className="text-gray-400 text-center py-4">No admins yet</p>
              )}
            </div>
          </div>

          {/* Team Members */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold">Team Members</h2>
              <button
                onClick={() => setShowAddTeamMember(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </button>
            </div>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.uid} className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="font-medium">{member.displayName}</p>
                      <p className="text-sm text-gray-400">{member.specialization}</p>
                      <p className="text-xs text-gray-500">{member.skills?.join(', ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">{member.availability}</span>
                    <div className="flex items-center mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-400 ml-1">{member.rating || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
              {teamMembers.length === 0 && (
                <p className="text-gray-400 text-center py-4">No team members yet</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-display font-bold">All Projects</h2>
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
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-gray-400">No projects match your current filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{project.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      project.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      project.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                      project.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Client: {project.clientName}</span>
                    <span>{new Date(project.createdAt?.toDate()).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Admin Modal */}
      {showAddAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-800 p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-display font-bold mb-4">Add New Admin</h2>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label htmlFor="admin-email" className="block text-gray-300 text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  id="admin-email"
                  value={newAdminData.email}
                  onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="admin-name" className="block text-gray-300 text-sm font-medium mb-1">Display Name</label>
                <input
                  type="text"
                  id="admin-name"
                  value={newAdminData.displayName}
                  onChange={(e) => setNewAdminData({ ...newAdminData, displayName: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Admin
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAdmin(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Team Member Modal */}
      {showAddTeamMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-800 p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-display font-bold mb-4">Add Team Member</h2>
            <form onSubmit={handleAddTeamMember} className="space-y-4">
              <div>
                <label htmlFor="member-email" className="block text-gray-300 text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  id="member-email"
                  value={newTeamMemberData.email}
                  onChange={(e) => setNewTeamMemberData({ ...newTeamMemberData, email: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="member-name" className="block text-gray-300 text-sm font-medium mb-1">Display Name</label>
                <input
                  type="text"
                  id="member-name"
                  value={newTeamMemberData.displayName}
                  onChange={(e) => setNewTeamMemberData({ ...newTeamMemberData, displayName: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="member-specialization" className="block text-gray-300 text-sm font-medium mb-1">Specialization</label>
                <input
                  type="text"
                  id="member-specialization"
                  value={newTeamMemberData.specialization}
                  onChange={(e) => setNewTeamMemberData({ ...newTeamMemberData, specialization: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Frontend Developer, UI/UX Designer"
                  required
                />
              </div>
              <div>
                <label htmlFor="member-skills" className="block text-gray-300 text-sm font-medium mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  id="member-skills"
                  value={newTeamMemberData.skills}
                  onChange={(e) => setNewTeamMemberData({ ...newTeamMemberData, skills: e.target.value })}
                  className="input-field"
                  placeholder="e.g., React, TypeScript, Figma"
                  required
                />
              </div>
              <div>
                <label htmlFor="member-availability" className="block text-gray-300 text-sm font-medium mb-1">Availability</label>
                <select
                  id="member-availability"
                  value={newTeamMemberData.availability}
                  onChange={(e) => setNewTeamMemberData({ ...newTeamMemberData, availability: e.target.value })}
                  className="input-field"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTeamMember(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default OwnerDashboard 