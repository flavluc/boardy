import Link from 'next/link'

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>
      {' '}
      {/* Adjust height based on your header */}
      {/* Sidebar Navigation (Persistent within Dashboard) */}
      <aside style={{ width: '250px', padding: '2rem', borderRight: '1px solid #ccc' }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/dashboard">Overview</Link>
          <Link href="/dashboard/projects">Projects</Link>
          <Link href="/dashboard/settings">Settings (@TODO)</Link>
        </nav>
      </aside>
      {/* Main Dashboard Content Area */}
      <section style={{ flexGrow: 1, padding: '2rem' }}>
        {children} {/* Renders the specific dashboard page content (overview, projects, etc.) */}
      </section>
    </div>
  )
}
