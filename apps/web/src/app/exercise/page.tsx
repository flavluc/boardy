'use client'

import Button from '@/components/Button'
import TextField from '@/components/TextField'

export default function ExercisePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Exercises</h2>
        <Button onClick={() => alert('clicked')}>click here</Button>
        <TextField label="teste" />
      </div>
    </div>
  )
}
