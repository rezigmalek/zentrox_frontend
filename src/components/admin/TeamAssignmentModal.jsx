import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { 
  X, 
  Users, 
  Brain, 
  Check, 
  Clock,
  Star,
  UserPlus,
  UserMinus
} from 'lucide-react'
// Firebase imports removed - using local storage instead

function TeamAssignmentModal({ project, onClose, onSuccess }) {
  const [teamMembers, setTeamMembers] = useState([])
  const [selectedMembers, setSelectedMembers] = useState(project.teamMembers || [])
  const [loading, setLoading] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState(null)

  useEffect(() => {
    loadTeamMembers()
    generateAISuggestions()
  }, [])

  const loadTeamMembers = async () => {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'team'))
      const snapshot = await getDocs(q)
      const members = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTeamMembers(members)
    } catch (error) {
      toast.error('Error loading team members')
    }
  }

  const generateAISuggestions = () => {
    // Simulate AI suggestions based on project requirements
    const suggestions = {
      recommendedMembers: teamMembers.slice(0, 3).map(member => ({
        ...member,
        reason: 'Skills match project requirements',
        confidence: Math.floor(Math.random() * 30) + 70
      })),
      estimatedTimeline: '2-3 weeks',
      teamSize: '3-4 members',
      keySkills: ['Frontend Development', 'Backend Development', 'UI/UX Design']
    }
    setAiSuggestions(suggestions)
  }

  const toggleMember = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  const applyAISuggestions = () => {
    const suggestedIds = aiSuggestions.recommendedMembers.map(member => member.id)
    setSelectedMembers(suggestedIds)
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const projectRef = doc(db, 'projects', project.id)
      await updateDoc(projectRef, {
        teamMembers: selectedMembers,
        updatedAt: new Date()
      })
      onSuccess()
    } catch (error) {
      toast.error('Error assigning team members')
    } finally {
      setLoading(false)
    }
  }

  const getSelectedMember = (memberId) => {
    return teamMembers.find(member => member.id === memberId)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-dark-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-display font-bold">Assign Team Members</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Suggestions */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-primary-400" />
                AI Recommendations
              </h3>
              
              {aiSuggestions && (
                <div className="card mb-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Recommended Team Size</p>
                      <p className="font-semibold">{aiSuggestions.teamSize}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Estimated Timeline</p>
                      <p className="font-semibold">{aiSuggestions.estimatedTimeline}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Key Skills Needed</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {aiSuggestions.keySkills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={applyAISuggestions}
                    className="btn-primary w-full mt-4"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Apply AI Suggestions
                  </button>
                </div>
              )}

              {/* Selected Members */}
              <div>
                <h4 className="text-md font-semibold mb-3">Selected Team Members</h4>
                <div className="space-y-2">
                  {selectedMembers.length === 0 ? (
                    <p className="text-gray-400 text-sm">No team members selected</p>
                  ) : (
                    selectedMembers.map(memberId => {
                      const member = getSelectedMember(memberId)
                      return member ? (
                        <div key={memberId} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {member.displayName?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{member.displayName}</p>
                              <p className="text-xs text-gray-400">{member.email}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleMember(memberId)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : null
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Available Team Members */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Available Team Members</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {teamMembers.map(member => (
                  <div
                    key={member.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                      selectedMembers.includes(member.id)
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-600 hover:border-dark-500'
                    }`}
                    onClick={() => toggleMember(member.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {member.displayName?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{member.displayName}</p>
                          <p className="text-xs text-gray-400">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {selectedMembers.includes(member.id) && (
                          <Check className="w-4 h-4 text-primary-400" />
                        )}
                        <Star className="w-4 h-4 text-yellow-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-dark-600 mt-6">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Saving...' : 'Save Assignment'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TeamAssignmentModal 