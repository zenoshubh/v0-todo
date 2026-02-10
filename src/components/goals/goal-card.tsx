'use client'

import { useState } from 'react'
import { deleteGoal, updateGoal } from '@/lib/actions/goals'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { EditGoalDialog } from './edit-goal-dialog'
import { Trash2, CheckCircle2, Circle } from 'lucide-react'
import { format } from 'date-fns'

interface GoalCardProps {
  goal: {
    id: string
    title: string
    description?: string
    motivation?: string
    targetDate: Date | string
    completed: boolean
  }
  onUpdate: () => void
}

export function GoalCard({ goal, onUpdate }: GoalCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this goal?')) return

    try {
      setIsDeleting(true)
      await deleteGoal(goal.id)
      onUpdate()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete goal')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleComplete = async () => {
    try {
      setIsToggling(true)
      await updateGoal(goal.id, { completed: !goal.completed })
      onUpdate()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update goal')
    } finally {
      setIsToggling(false)
    }
  }

  const targetDate = new Date(goal.targetDate)
  const isOverdue = targetDate < new Date() && !goal.completed
  const daysRemaining = Math.ceil(
    (targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <Card className={goal.completed ? 'opacity-60' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleComplete}
                disabled={isToggling}
                className="text-muted-foreground hover:text-foreground"
              >
                {goal.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
              <CardTitle className={goal.completed ? 'line-through' : ''}>
                {goal.title}
              </CardTitle>
            </div>
            <CardDescription className="mt-1">
              Due: {format(targetDate, 'MMM dd, yyyy')}
              {!goal.completed && daysRemaining > 0 && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({daysRemaining} days remaining)
                </span>
              )}
              {isOverdue && (
                <span className="ml-2 text-xs text-destructive">
                  (Overdue)
                </span>
              )}
            </CardDescription>
          </div>
          <EditGoalDialog goal={goal} onUpdate={onUpdate} />
        </div>
      </CardHeader>

      {(goal.description || goal.motivation) && (
        <CardContent className="space-y-3">
          {goal.description && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Description
              </p>
              <p className="text-sm text-foreground">{goal.description}</p>
            </div>
          )}
          {goal.motivation && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Motivation
              </p>
              <p className="text-sm text-foreground">{goal.motivation}</p>
            </div>
          )}
        </CardContent>
      )}

      <div className="border-t border-border px-6 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="w-full text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </Card>
  )
}
