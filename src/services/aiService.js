// AI Service for Gemini Integration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

export class AIService {
  static async analyzeProject(projectData) {
    try {
      const prompt = `
        You are an expert project manager and technical consultant. Analyze this project request and provide detailed insights in JSON format:

        Project Title: ${projectData.title}
        Description: ${projectData.description}
        Category: ${projectData.category}
        Budget: ${projectData.budget}
        Deadline: ${projectData.deadline}

        Please provide a JSON response with the following structure:
        {
          "estimatedTimeline": "X-Y weeks",
          "suggestedTeam": ["Role 1", "Role 2", "Role 3"],
          "taskBreakdown": ["Task 1", "Task 2", "Task 3"],
          "estimatedCost": "$X,000 - $Y,000",
          "complexity": "Low/Medium/High",
          "priority": "Low/Medium/High",
          "risks": ["Risk 1", "Risk 2"],
          "technologies": ["Tech 1", "Tech 2"],
          "keySkills": ["Skill 1", "Skill 2"],
          "successMetrics": ["Metric 1", "Metric 2"]
        }

        Base your analysis on the project requirements and provide realistic estimates.
      `

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      })

      const data = await response.json()
      
      if (data.candidates && data.candidates[0]) {
        const analysis = data.candidates[0].content.parts[0].text
        return this.parseAIAnalysis(analysis)
      }
      
      throw new Error('Failed to get AI analysis')
    } catch (error) {
      console.error('AI Analysis Error:', error)
      // Fallback to simulated analysis
      return this.getSimulatedAnalysis(projectData)
    }
  }

  static parseAIAnalysis(analysisText) {
    try {
      // Try to parse as JSON first
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          estimatedTimeline: parsed.estimatedTimeline || '2-3 weeks',
          suggestedTeam: parsed.suggestedTeam || ['Frontend Developer', 'Backend Developer', 'UI/UX Designer'],
          taskBreakdown: parsed.taskBreakdown || [
            'Project setup and environment configuration',
            'Database design and API development',
            'Frontend development and UI implementation',
            'Testing and quality assurance',
            'Deployment and final delivery'
          ],
          estimatedCost: parsed.estimatedCost || '$3,000 - $5,000',
          complexity: parsed.complexity || 'Medium',
          priority: parsed.priority || 'High',
          risks: parsed.risks || ['Timeline delays', 'Scope creep'],
          technologies: parsed.technologies || ['React', 'Node.js', 'Express'],
          keySkills: parsed.keySkills || ['JavaScript', 'React', 'Node.js'],
          successMetrics: parsed.successMetrics || ['On-time delivery', 'Client satisfaction']
        }
      }

      // Fallback parsing for non-JSON responses
      const lines = analysisText.split('\n')
      const result = {
        estimatedTimeline: '',
        suggestedTeam: [],
        taskBreakdown: [],
        estimatedCost: '',
        complexity: '',
        priority: '',
        risks: [],
        technologies: [],
        keySkills: [],
        successMetrics: []
      }

      lines.forEach(line => {
        const lowerLine = line.toLowerCase()
        if (lowerLine.includes('timeline') || lowerLine.includes('weeks')) {
          result.estimatedTimeline = line.split(':')[1]?.trim() || '2-3 weeks'
        }
        if (lowerLine.includes('team') || lowerLine.includes('roles')) {
          result.suggestedTeam = line.split(':')[1]?.split(',').map(s => s.trim()) || []
        }
        if (lowerLine.includes('cost') || lowerLine.includes('budget')) {
          result.estimatedCost = line.split(':')[1]?.trim() || '$3,000 - $5,000'
        }
        if (lowerLine.includes('complexity')) {
          result.complexity = line.split(':')[1]?.trim() || 'Medium'
        }
        if (lowerLine.includes('priority')) {
          result.priority = line.split(':')[1]?.trim() || 'High'
        }
      })

      return result
    } catch (error) {
      console.error('Error parsing AI analysis:', error)
      return this.getSimulatedAnalysis({})
    }
  }

  static getSimulatedAnalysis(projectData) {
    // Fallback simulation when AI is not available
    return {
      estimatedTimeline: '2-3 weeks',
      suggestedTeam: ['Frontend Developer', 'Backend Developer', 'UI/UX Designer'],
      taskBreakdown: [
        'Project setup and environment configuration',
        'Database design and API development',
        'Frontend development and UI implementation',
        'Testing and quality assurance',
        'Deployment and final delivery'
      ],
      estimatedCost: '$3,000 - $5,000',
      complexity: 'Medium',
      priority: 'High',
      risks: ['Timeline delays', 'Scope creep', 'Technical challenges'],
      technologies: ['React', 'Node.js', 'Express', 'Tailwind CSS'],
      keySkills: ['JavaScript', 'React', 'Node.js', 'Express'],
      successMetrics: ['On-time delivery', 'Client satisfaction', 'Code quality']
    }
  }

  static async suggestTeamMembers(projectRequirements, availableMembers) {
    try {
      const prompt = `
        You are an expert HR manager and project coordinator. Based on these project requirements:
        ${JSON.stringify(projectRequirements, null, 2)}
        
        And these available team members:
        ${JSON.stringify(availableMembers, null, 2)}
        
        Suggest the best team composition with confidence scores. Provide response in JSON format:
        {
          "recommendations": [
            {
              "memberId": "member_id",
              "confidence": 85,
              "reason": "Strong frontend skills match project requirements",
              "role": "Frontend Developer"
            }
          ],
          "estimatedTimeline": "X-Y weeks",
          "teamSize": "X members",
          "keySkills": ["Skill 1", "Skill 2"]
        }
      `

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      })

      const data = await response.json()
      
      if (data.candidates && data.candidates[0]) {
        return this.parseTeamSuggestions(data.candidates[0].content.parts[0].text)
      }
      
      throw new Error('Failed to get team suggestions')
    } catch (error) {
      console.error('Team Suggestion Error:', error)
      return this.getSimulatedTeamSuggestions(availableMembers)
    }
  }

  static parseTeamSuggestions(suggestionsText) {
    try {
      // Try to parse as JSON first
      const jsonMatch = suggestionsText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          recommendations: parsed.recommendations || [],
          estimatedTimeline: parsed.estimatedTimeline || '2-3 weeks',
          teamSize: parsed.teamSize || '3-4 members',
          keySkills: parsed.keySkills || ['Frontend Development', 'Backend Development', 'UI/UX Design']
        }
      }

      // Fallback parsing
      const lines = suggestionsText.split('\n')
      const recommendations = []
      
      lines.forEach(line => {
        if (line.includes('confidence') || line.includes('%')) {
          const confidence = parseInt(line.match(/\d+/)?.[0] || 70)
          recommendations.push({
            confidence,
            reason: line.split(':')[1]?.trim() || 'Skills match project requirements'
          })
        }
      })

      return {
        recommendations,
        estimatedTimeline: '2-3 weeks',
        teamSize: '3-4 members',
        keySkills: ['Frontend Development', 'Backend Development', 'UI/UX Design']
      }
    } catch (error) {
      console.error('Error parsing team suggestions:', error)
      return this.getSimulatedTeamSuggestions([])
    }
  }

  static getSimulatedTeamSuggestions(availableMembers) {
    return {
      recommendations: availableMembers.slice(0, 3).map(member => ({
        ...member,
        confidence: Math.floor(Math.random() * 30) + 70,
        reason: 'Skills match project requirements'
      })),
      estimatedTimeline: '2-3 weeks',
      teamSize: '3-4 members',
      keySkills: ['Frontend Development', 'Backend Development', 'UI/UX Design']
    }
  }

  // New method for real-time project analysis
  static async getRealTimeAnalysis(projectId, currentProgress) {
    try {
      const prompt = `
        As an AI project manager, analyze this project's current progress and provide insights:
        
        Project Progress: ${currentProgress}%
        Current Status: In Progress
        
        Provide real-time analysis in JSON format:
        {
          "estimatedCompletion": "X days remaining",
          "riskLevel": "Low/Medium/High",
          "recommendations": ["Action 1", "Action 2"],
          "bottlenecks": ["Bottleneck 1", "Bottleneck 2"],
          "nextMilestone": "Milestone description",
          "teamPerformance": "Good/Needs Improvement/Excellent"
        }
      `

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      })

      const data = await response.json()
      
      if (data.candidates && data.candidates[0]) {
        const analysis = data.candidates[0].content.parts[0].text
        return this.parseRealTimeAnalysis(analysis)
      }
      
      throw new Error('Failed to get real-time analysis')
    } catch (error) {
      console.error('Real-time Analysis Error:', error)
      return this.getSimulatedRealTimeAnalysis()
    }
  }

  static parseRealTimeAnalysis(analysisText) {
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      
      return this.getSimulatedRealTimeAnalysis()
    } catch (error) {
      console.error('Error parsing real-time analysis:', error)
      return this.getSimulatedRealTimeAnalysis()
    }
  }

  static getSimulatedRealTimeAnalysis() {
    return {
      estimatedCompletion: '5 days remaining',
      riskLevel: 'Medium',
      recommendations: ['Increase team communication', 'Review code quality'],
      bottlenecks: ['API integration', 'Testing phase'],
      nextMilestone: 'Complete frontend development',
      teamPerformance: 'Good'
    }
  }
}

export default AIService 