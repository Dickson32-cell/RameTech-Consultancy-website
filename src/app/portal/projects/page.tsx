'use client'

import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa'

const projects = [
  { id: 1, name: 'E-Commerce Website', category: 'Web Development', status: 'In Progress', progress: 65, startDate: '2026-02-01', dueDate: '2026-03-15' },
  { id: 2, name: 'Mobile App Development', category: 'Mobile', status: 'Planning', progress: 15, startDate: '2026-02-15', dueDate: '2026-04-01' },
  { id: 3, name: 'Brand Identity Package', category: 'Design', status: 'Review', progress: 90, startDate: '2026-01-15', dueDate: '2026-03-01' },
]

export default function ProjectsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-1">Track and manage your ongoing projects</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <FaPlus /> New Request
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="input-field pl-10 w-full"
          />
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <FaFilter /> Filter
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-sm text-gray-500">{project.category}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                project.status === 'Planning' ? 'bg-gray-100 text-gray-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {project.status}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span>Started: {project.startDate}</span>
              <span>Due: {project.dueDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
