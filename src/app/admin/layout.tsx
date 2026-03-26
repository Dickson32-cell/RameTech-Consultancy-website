import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      {/* On mobile, sidebar overlays; on desktop, it pushes content */}
      <main className="md:ml-64 p-4 md:p-8 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
