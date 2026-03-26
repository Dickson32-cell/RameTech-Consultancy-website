'use client'

import { useState } from 'react'
import { FaCheckCircle, FaExclamationCircle, FaClock, FaPlayCircle } from 'react-icons/fa'

const stats = [
  { label: 'Active Projects', value: '2', icon: FaPlayCircle, color: 'text-blue-600' },
  { label: 'Completed', value: '5', icon: FaCheckCircle, color: 'text-green-600' },
  { label: 'Pending Review', value: '1', icon: FaClock, color: 'text-yellow-600' },
  { label: 'On Hold', value: '0', icon: FaExclamationCircle, color: 'text-red-600' },
]

const recentProjects = [
  { id: 1, name: 'E-Commerce Website', status: 'In Progress', progress: 65, dueDate: '2026-03-15' },
  { id: 2, name: 'Mobile App Development', status: 'Planning', progress: 15, dueDate: '2026-04-01' },
  { id: 3, name: 'Brand Identity Package', status: 'Review', progress: 90, dueDate: '2026-03-01' },
]

const recentInvoices = [
  { id: 1, number: 'INV-2026-001', amount: 'GHS 5,000', status: 'Paid', dueDate: '2026-02-15' },
  { id: 2, number: 'INV-2026-002', amount: 'GHS 3,500', status: 'Pending', dueDate: '2026-03-15' },
]

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-1">Here's an overview of your projects and invoices.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`w-10 h-10 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{project.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    project.status === 'Planning' ? 'bg-gray-100 text-gray-700' :
                    project.status === 'Review' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Due: {project.dueDate}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Invoices</h2>
          <div className="space-y-4">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{invoice.number}</p>
                  <p className="text-sm text-gray-600">Due: {invoice.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{invoice.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    invoice.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {invoice.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
