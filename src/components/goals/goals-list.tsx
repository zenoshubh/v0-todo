'use client'

import { useEffect, useState } from 'react'
import { getGoals } from '@/lib/actions/goals'
import { GoalCard } from './goal-card'
import { Button } from '@/components/ui/button'

export function GoalsList() {
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadGoals() {
      try {
        setLoading(true)
        setError(null)
        const data = await getGoals()
        setGoals(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load goals')
      } finally {
        setLoading(false)
      }
    }

    loadGoals()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading goals...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  if (goals.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center">
        <p className="text-muted-foreground">
          No goals yet. Create one to get started!
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} onUpdate={() => {}} />
      ))}
    </div>
  )
}
