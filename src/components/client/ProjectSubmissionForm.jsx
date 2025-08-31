import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Brain, Clock, DollarSign, Target, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { toast } from 'react-hot-toast'
// Firebase imports removed - using local storage instead
import AIService from '../../services/aiService'

function ProjectSubmissionForm({ onClose, onSuccess }) {
  const { currentUser } = useAuth()
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    budget: ''
  })
  const [loading, setLoading] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const analyzeProject = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in title and description for AI analysis')
      return
    }

    setAnalyzing(true)
    try {
      const analysis = await AIService.analyzeProject(formData.title, formData.description)
      setAiAnalysis(analysis)
      toast.success('AI analysis completed!')
    } catch (error) {
      console.error('AI analysis error:', error)
      toast.error('AI analysis failed, but you can still submit your project')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const projectData = {
        ...formData,
        clientId: currentUser.uid,
        clientName: currentUser.displayName,
        status: 'pending',
        createdAt: serverTimestamp(),
        aiAnalysis: aiAnalysis || null,
        teamMembers: [],
        progress: 0
      }

      await addDoc(collection(db, 'projects'), projectData)
      toast.success('Project submitted successfully!')
      onSuccess()
    } catch (error) {
      console.error('Error submitting project:', error)
      toast.error('Failed to submit project. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <div className="holographic-border p-8 rounded-2xl">
            <div className="bg-cyber-dark p-8 rounded-xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-neon-gradient rounded-full flex items-center justify-center">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold holographic-text">
                      Submit New Project
                    </h2>
                    <p className="text-gray-300 font-cyber">
                      Create your project request with AI-powered analysis
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-cyber-dark hover:bg-red-500/20 border border-red-500/30 hover:border-red-500 transition-all duration-300 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-red-400 hover:text-white transition-colors" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Title */}
                <div>
                  <label className="block text-sm font-cyber text-gray-300 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="cyber-input w-full"
                    placeholder="Enter your project title"
                    required
                  />
                </div>

                {/* Project Description */}
                <div>
                  <label className="block text-sm font-cyber text-gray-300 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="cyber-input w-full resize-none"
                    placeholder="Describe your project requirements, goals, and specifications..."
                    required
                  />
                </div>

                {/* Deadline and Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-cyber text-gray-300 mb-2">
                      Deadline
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-neon-blue" />
                      </div>
                      <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="cyber-input pl-10 w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-cyber text-gray-300 mb-2">
                      Budget (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-neon-green" />
                      </div>
                      <input
                        type="text"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="cyber-input pl-10 w-full"
                        placeholder="e.g., $5000 or Flexible"
                      />
                    </div>
                  </div>
                </div>

                {/* AI Analysis Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-neon-purple" />
                      <span className="text-sm font-cyber text-gray-300">AI Project Analysis</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={analyzeProject}
                      disabled={analyzing || !formData.title || !formData.description}
                      className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {analyzing ? (
                        <div className="flex items-center space-x-2">
                          <div className="cyber-spinner w-4 h-4"></div>
                          <span>Analyzing...</span>
                        </div>
                      ) : (
                        <span>Analyze Project</span>
                      )}
                    </motion.button>
                  </div>

                  {/* AI Analysis Results */}
                  {aiAnalysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="futuristic-card border border-neon-purple/30"
                    >
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="w-3 h-3 bg-neon-gradient rounded-full animate-pulse"></div>
                        <span className="text-sm font-cyber text-neon-purple">AI Analysis Results</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {aiAnalysis.timeline && (
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-neon-blue" />
                            <span className="text-gray-300">Timeline:</span>
                            <span className="text-white font-cyber">{aiAnalysis.timeline}</span>
                          </div>
                        )}

                        {aiAnalysis.estimatedCost && (
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-neon-green" />
                            <span className="text-gray-300">Cost:</span>
                            <span className="text-white font-cyber">{aiAnalysis.estimatedCost}</span>
                          </div>
                        )}

                        {aiAnalysis.complexity && (
                          <div className="flex items-center space-x-2">
                            <Target className="w-4 h-4 text-neon-orange" />
                            <span className="text-gray-300">Complexity:</span>
                            <span className={`font-cyber ${
                              aiAnalysis.complexity === 'High' ? 'text-red-400' :
                              aiAnalysis.complexity === 'Medium' ? 'text-neon-orange' : 'text-neon-green'
                            }`}>
                              {aiAnalysis.complexity}
                            </span>
                          </div>
                        )}

                        {aiAnalysis.priority && (
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-neon-pink" />
                            <span className="text-gray-300">Priority:</span>
                            <span className={`font-cyber ${
                              aiAnalysis.priority === 'High' ? 'text-red-400' :
                              aiAnalysis.priority === 'Medium' ? 'text-neon-orange' : 'text-neon-green'
                            }`}>
                              {aiAnalysis.priority}
                            </span>
                          </div>
                        )}
                      </div>

                      {aiAnalysis.technologies && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs font-cyber text-gray-400">Recommended Technologies:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {aiAnalysis.technologies.map((tech, index) => (
                              <span key={index} className="px-2 py-1 bg-neon-blue/10 border border-neon-blue/30 rounded text-xs text-neon-blue font-cyber">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    className="btn-secondary"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="btn-cta group"
                  >
                    {loading ? (
                      <div className="cyber-spinner mx-auto"></div>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <Send className="w-5 h-5" />
                        <span>Submit Project</span>
                      </span>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ProjectSubmissionForm 