import { motion } from 'framer-motion'
import { Clock, CheckCircle, AlertCircle, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'

function ProjectCard({ project }) {
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

  const getStatusBg = (status) => {
    switch (status) {
      case 'pending': return 'bg-neon-orange/10 border-neon-orange/30'
      case 'in-progress': return 'bg-neon-blue/10 border-neon-blue/30'
      case 'completed': return 'bg-neon-green/10 border-neon-green/30'
      case 'rejected': return 'bg-red-400/10 border-red-400/30'
      default: return 'bg-gray-400/10 border-gray-400/30'
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="futuristic-card group hover:shadow-neon-blue cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {project.description}
          </p>
        </div>
        
        <div className={`ml-4 px-3 py-1 rounded-full border ${getStatusBg(project.status)}`}>
          <div className={`flex items-center space-x-1 text-xs font-cyber ${getStatusColor(project.status)}`}>
            {getStatusIcon(project.status)}
            <span className="capitalize">{project.status}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Timeline */}
        {project.aiAnalysis?.timeline && (
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-neon-blue" />
            <span className="text-gray-300">Timeline:</span>
            <span className="text-white font-cyber">{project.aiAnalysis.timeline}</span>
          </div>
        )}

        {/* Budget */}
        {project.aiAnalysis?.estimatedCost && (
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-4 h-4 bg-neon-gradient rounded flex items-center justify-center">
              <span className="text-xs text-white">$</span>
            </div>
            <span className="text-gray-300">Budget:</span>
            <span className="text-white font-cyber">{project.aiAnalysis.estimatedCost}</span>
          </div>
        )}

        {/* Team Members */}
        {project.teamMembers && project.teamMembers.length > 0 && (
          <div className="flex items-center space-x-2 text-sm">
            <User className="w-4 h-4 text-neon-purple" />
            <span className="text-gray-300">Team:</span>
            <span className="text-white font-cyber">{project.teamMembers.length} members</span>
          </div>
        )}

        {/* Created Date */}
        <div className="flex items-center space-x-2 text-sm">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">Created:</span>
          <span className="text-white font-cyber">
            {format(project.createdAt?.toDate() || new Date(), 'MMM dd, yyyy')}
          </span>
        </div>
      </div>

      {/* AI Analysis Preview */}
      {project.aiAnalysis && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-neon-gradient rounded-full animate-pulse"></div>
            <span className="text-xs font-cyber text-neon-blue">AI Analysis</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            {project.aiAnalysis.complexity && (
              <div className="flex items-center space-x-1">
                <span className="text-gray-400">Complexity:</span>
                <span className={`font-cyber ${
                  project.aiAnalysis.complexity === 'High' ? 'text-red-400' :
                  project.aiAnalysis.complexity === 'Medium' ? 'text-neon-orange' : 'text-neon-green'
                }`}>
                  {project.aiAnalysis.complexity}
                </span>
              </div>
            )}
            
            {project.aiAnalysis.priority && (
              <div className="flex items-center space-x-1">
                <span className="text-gray-400">Priority:</span>
                <span className={`font-cyber ${
                  project.aiAnalysis.priority === 'High' ? 'text-red-400' :
                  project.aiAnalysis.priority === 'Medium' ? 'text-neon-orange' : 'text-neon-green'
                }`}>
                  {project.aiAnalysis.priority}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default ProjectCard 