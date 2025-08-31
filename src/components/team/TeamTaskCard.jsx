import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Users,
  FileText,
  Brain,
  Play,
  Pause,
  Check,
  MessageSquare
} from 'lucide-react'

function TeamTaskCard({ project, currentUser, onTaskUpdate }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10'
      case 'in-progress': return 'text-blue-400 bg-blue-400/10'
      case 'completed': return 'text-green-400 bg-green-400/10'
      case 'rejected': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
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

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 20) return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  const handleTaskAction = (action) => {
    onTaskUpdate(project.id, 'task-id', action)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card hover:shadow-xl transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-white">{project.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(project.status)}`}>
          {getStatusIcon(project.status)}
          <span className="capitalize">{project.status}</span>
        </span>
      </div>

      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {project.description}
      </p>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-400">
            <Users className="w-4 h-4" />
            <span>Client</span>
          </div>
          <span className="text-white">{project.clientName}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Deadline</span>
          </div>
          <span className="text-white">
            {project.deadline ? format(new Date(project.deadline), 'MMM dd, yyyy') : 'Not set'}
          </span>
        </div>

        {project.files?.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-400">
              <FileText className="w-4 h-4" />
              <span>Files</span>
            </div>
            <span className="text-white">{project.files.length} attached</span>
          </div>
        )}
      </div>

      {project.status === 'in-progress' && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm font-medium">{project.progress || 0}%</span>
          </div>
          <div className="w-full bg-dark-600 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress || 0)}`}
              style={{ width: `${project.progress || 0}%` }}
            ></div>
          </div>
        </div>
      )}

      {project.aiAnalysis && (
        <div className="mb-4 p-3 bg-primary-500/10 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-primary-400">AI Analysis</span>
          </div>
          <div className="text-xs text-gray-400 space-y-1">
            <div>Timeline: {project.aiAnalysis.estimatedTimeline}</div>
            <div>Complexity: {project.aiAnalysis.complexity}</div>
          </div>
        </div>
      )}

      {/* Task Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-dark-600">
        {project.status === 'in-progress' && (
          <>
            <button
              onClick={() => handleTaskAction('pause')}
              className="btn-secondary text-xs px-3 py-1"
            >
              <Pause className="w-3 h-3 mr-1" />
              Pause
            </button>
            <button
              onClick={() => handleTaskAction('complete')}
              className="btn-primary text-xs px-3 py-1"
            >
              <Check className="w-3 h-3 mr-1" />
              Mark Complete
            </button>
          </>
        )}

        {project.status === 'pending' && (
          <button
            onClick={() => handleTaskAction('start')}
            className="btn-primary text-xs px-3 py-1"
          >
            <Play className="w-3 h-3 mr-1" />
            Start Task
          </button>
        )}

        <button className="text-primary-400 hover:text-primary-300 text-xs px-3 py-1">
          <MessageSquare className="w-3 h-3 mr-1" />
          Contact Client
        </button>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-dark-600 mt-4">
        <span className="text-xs text-gray-400">
          Assigned {project.createdAt ? format(new Date(project.createdAt.toDate()), 'MMM dd, yyyy') : 'Recently'}
        </span>
        <span className="text-xs text-gray-400">
          ID: {project.id.slice(0, 8)}...
        </span>
      </div>
    </motion.div>
  )
}

export default TeamTaskCard 