import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      {/* Main content - full width on mobile with top padding, shifted right on desktop */}
      <main className="w-full min-h-screen md:ml-64 pt-24 md:pt-0 px-4 pb-8 md:p-8 transition-all duration-300">
        <div className="overflow-x-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
