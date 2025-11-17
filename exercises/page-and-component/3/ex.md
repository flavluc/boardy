## 3) Page: Projects List with “Create Project” (controlled form)

Goal: build a page component that ties together layout, list rendering, a form, and simple state management—no libs.

Constraints:

- maintain a list in state
- provide a controlled input and submit handler
- show empty state and use stable keys

## Solution

```tsx
// pages/ProjectsPage.tsx
import { FormEvent, useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { TextField } from '../components/TextField'

type Project = { id: string; title: string; updatedAt: string }

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [title, setTitle] = useState('')

  function onCreate(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const p: Project = {
      id: crypto.randomUUID(),
      title: title.trim(),
      updatedAt: new Date().toISOString(),
    }
    setProjects((prev) => [p, ...prev])
    setTitle('')
  }

  const countLabel = useMemo(
    () => (projects.length === 0 ? 'No projects' : `${projects.length} projects`),
    [projects.length]
  )

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <span className="text-sm text-black/60">{countLabel}</span>
      </header>

      <form onSubmit={onCreate} className="grid grid-cols-[1fr_auto] gap-3">
        <TextField
          label="Title"
          placeholder="New project title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="self-end">
          <Button type="submit" disabled={!title.trim()}>
            Create
          </Button>
        </div>
      </form>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-black/60">
          Create your first project
        </div>
      ) : (
        <ul className="grid gap-3">
          {projects.map((p) => (
            <li key={p.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{p.title}</h2>
                <time className="text-xs text-black/50">
                  {new Date(p.updatedAt).toLocaleString()}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

## Explanation

Why this is good

- Demonstrates page composition: header + form + list.
- Controlled input for correctness.
- Stable keys and a minimal, comprehensible layout.

## Notes:

- onChange: atuliza os valores do state
- onSubmit: atualiza o array state criando o elemento
