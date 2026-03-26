import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      {/* Responsive: full width on mobile, ml-64 on desktop */}
      <main className="md:ml-64 p-4 md:p-8 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
