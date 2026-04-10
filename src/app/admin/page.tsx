'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaBriefcase, FaUsers, FaProjectDiagram, FaArrowRight, FaCheckCircle, FaRobot } from 'react-icons/fa'

interface Stats {
  services: number
  team: number
  portfolio: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({ services: 0, team: 0, portfolio: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [runningDiagnostics, setRunningDiagnostics] = useState(false)
  const [testingChatbot, setTestingChatbot] = useState(false)

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    setIsAuthenticated(true)

    // Fetch stats
    const fetchStats = async () => {
      try {
        const [servicesRes, teamRes, portfolioRes] = await Promise.all([
          fetch('/api/v1/services'),
          fetch('/api/v1/admin/team'),
          fetch('/api/v1/admin/portfolio')
        ])

        const [servicesData, teamData, portfolioData] = await Promise.all([
          servicesRes.json(),
          teamRes.json(),
          portfolioRes.json()
        ])

        setStats({
          services: servicesData.success ? (servicesData.data?.length || 0) : 0,
          team: teamData.success ? (teamData.data?.length || 0) : 0,
          portfolio: portfolioData.success ? (portfolioData.data?.length || 0) : 0
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [router])

  const runSystemDiagnostics = async () => {
    setRunningDiagnostics(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/v1/admin/diagnostics', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await response.json()

      console.log('System Diagnostics:', result)

      // Format message
      const tableStatus = Object.entries(result.diagnostics?.tables || {})
        .map(([name, info]: [string, any]) => `${name}: ${info.status} (${info.count || 0} records)${info.error ? ` - ${info.error}` : ''}`)
        .join('\n')

      const message = `
SYSTEM DIAGNOSTICS
==================

${result.diagnostics?.overall || 'Unknown'}

DATABASE TABLES:
${tableStatus}

${result.diagnostics?.recommendations?.length > 0 ? `\nRECOMMENDATIONS:\n${result.diagnostics.recommendations.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}` : ''}

${result.diagnostics?.errors?.length > 0 ? `\nERRORS:\n${result.diagnostics.errors.join('\n')}` : ''}
      `.trim()

      alert(message)
    } catch (error: any) {
      alert(`Diagnostics failed: ${error.message}`)
    } finally {
      setRunningDiagnostics(false)
    }
  }

  const testChatbotKnowledge = async () => {
    setTestingChatbot(true)
    try {
      const response = await fetch('/api/v1/chatbot/knowledge-test')
      const result = await response.json()

      console.log('Chatbot Knowledge:', result)

      // Format examples
      const examples = Object.entries(result.knowledge?.examples || {})
        .map(([question, answer]) => `Q: "${question}"\nA: ${answer}`)
        .join('\n\n')

      const message = `
AI CHATBOT KNOWLEDGE TEST
=========================

Status: ${result.knowledge?.overall?.status || 'Unknown'}

WHAT CHATBOT KNOWS:
- Departments: ${result.knowledge?.summary?.departments || 0}
- Team Members: ${result.knowledge?.summary?.teamMembers || 0}
- Academic Writing Phases: ${result.knowledge?.summary?.academicWriting?.phases || 0}
- Academic Writing Items: ${result.knowledge?.summary?.academicWriting?.items || 0}
- Services: ${result.knowledge?.summary?.services || 0}
- FAQs: ${result.knowledge?.summary?.faqs || 0}
- Blog Posts: ${result.knowledge?.summary?.blogPosts || 0}
- Publications: ${result.knowledge?.summary?.publications || 0}
- Department Projects: ${result.knowledge?.summary?.departmentProjects || 0}
- Academic Document: ${result.knowledge?.summary?.academicDocument || 'None'}

TOTAL KNOWLEDGE ITEMS: ${result.knowledge?.overall?.totalKnowledgeItems || 0}

EXAMPLE RESPONSES:
${examples}

${result.recommendation || ''}
      `.trim()

      alert(message)
    } catch (error: any) {
      alert(`Chatbot test failed: ${error.message}`)
    } finally {
      setTestingChatbot(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  const statCards = [
    {
      title: 'Services',
      count: stats.services,
      icon: FaBriefcase,
      link: '/admin/services',
      color: 'bg-blue-500'
    },
    {
      title: 'Team Members',
      count: stats.team,
      icon: FaUsers,
      link: '/admin/team',
      color: 'bg-green-500'
    },
    {
      title: 'Portfolio Projects',
      count: stats.portfolio,
      icon: FaProjectDiagram,
      link: '/admin/portfolio',
      color: 'bg-purple-500'
    }
  ]

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to RAME Tech Admin Panel</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={testChatbotKnowledge}
            disabled={testingChatbot}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 text-sm"
            title="Test what the AI chatbot knows"
          >
            <FaRobot />
            {testingChatbot ? 'Testing...' : 'Chatbot Test'}
          </button>
          <button
            onClick={runSystemDiagnostics}
            disabled={runningDiagnostics}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 text-sm"
          >
            <FaCheckCircle />
            {runningDiagnostics ? 'Running...' : 'System Check'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statCards.map((card) => (
              <Link
                key={card.title}
                href={card.link}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                    <p className="text-4xl font-bold text-gray-900">{card.count}</p>
                  </div>
                  <div className={`${card.color} p-4 rounded-xl text-white`}>
                    <card.icon className="w-8 h-8" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-primary text-sm font-medium">
                  Manage {card.title} <FaArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/services/new"
                className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <h3 className="font-medium text-gray-900">Add New Service</h3>
                <p className="text-sm text-gray-500 mt-1">Create a new service offering</p>
              </Link>
              <Link
                href="/admin/team/new"
                className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <h3 className="font-medium text-gray-900">Add Team Member</h3>
                <p className="text-sm text-gray-500 mt-1">Add a new member to the team</p>
              </Link>
              <Link
                href="/admin/portfolio/new"
                className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <h3 className="font-medium text-gray-900">Add Portfolio Project</h3>
                <p className="text-sm text-gray-500 mt-1">Showcase a new completed project</p>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
