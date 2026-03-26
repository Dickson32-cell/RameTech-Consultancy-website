'use client'

import { FaSearch, FaFilter, FaDownload, FaEye } from 'react-icons/fa'

const invoices = [
  { id: 1, number: 'INV-2026-001', amount: 'GHS 5,000', status: 'Paid', description: 'Website Development - Phase 1', dueDate: '2026-02-15', paidDate: '2026-02-10' },
  { id: 2, number: 'INV-2026-002', amount: 'GHS 3,500', status: 'Pending', description: 'Mobile App - Initial Setup', dueDate: '2026-03-15', paidDate: null },
  { id: 3, number: 'INV-2025-012', amount: 'GHS 2,000', status: 'Paid', description: 'Logo Design Package', dueDate: '2025-12-20', paidDate: '2025-12-18' },
  { id: 4, number: 'INV-2025-008', amount: 'GHS 1,500', status: 'Overdue', description: 'Consultation Fee', dueDate: '2025-11-30', paidDate: null },
]

export default function InvoicesPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-700'
      case 'Pending': return 'bg-yellow-100 text-yellow-700'
      case 'Overdue': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const totalPending = invoices.filter(i => i.status === 'Pending').reduce((acc, i) => acc + 3500, 0)
  const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((acc, i) => acc + 1500, 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Invoices</h1>
        <p className="text-gray-600 mt-1">View and manage your invoices</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-600">Total Paid</p>
          <p className="text-2xl font-bold text-green-600">GHS 7,000</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">GHS {totalPending.toLocaleString()}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Overdue</p>
          <p className="text-2xl font-bold text-red-600">GHS {totalOverdue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoices..."
            className="input-field pl-10 w-full"
          />
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <FaFilter /> Filter
        </button>
      </div>

      {/* Invoices Table */}
      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-600">Invoice</th>
              <th className="text-left p-4 font-semibold text-gray-600">Description</th>
              <th className="text-left p-4 font-semibold text-gray-600">Amount</th>
              <th className="text-left p-4 font-semibold text-gray-600">Due Date</th>
              <th className="text-left p-4 font-semibold text-gray-600">Status</th>
              <th className="text-left p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-t border-gray-100">
                <td className="p-4 font-medium">{invoice.number}</td>
                <td className="p-4 text-gray-600">{invoice.description}</td>
                <td className="p-4 font-semibold">{invoice.amount}</td>
                <td className="p-4 text-gray-600">{invoice.dueDate}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-600 hover:text-primary" title="View">
                      <FaEye />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-primary" title="Download">
                      <FaDownload />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
