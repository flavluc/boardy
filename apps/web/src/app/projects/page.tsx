'use client'

import { FormEvent, useMemo, useState } from 'react'

import Button from '@/components/Button'
import TextField from '@/components/TextField'

type Project = { id: string; title: string; updatedAt: string }

export default function ProjectsPage() {
  const [projects, setProject] = useState<Project[]>([])
  const [title, setTitle] = useState('')

  const onCreate = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const p: Project = {
      id: crypto.randomUUID(),
      title: title.trim(),
      updatedAt: new Date().toISOString(),
    }
    setProject((prev) => [p, ...prev])
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
        ></TextField>
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
