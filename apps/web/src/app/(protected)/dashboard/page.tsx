// import { ProjectForm } from './components/ProjectForm'
// import { ProjectsTable } from './components/ProjectsTable'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight mb-4">Projects</h1>

        <p className="text-sm text-muted-foreground mb-6">
          Create a new project.
        </p>

        {/* <ProjectForm /> */}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Your projects</h2>

        {/* <ProjectsTable /> */}
      </section>
    </div>
  )
}
