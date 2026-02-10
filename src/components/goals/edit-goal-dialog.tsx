'use client'

import { useState } from 'react'
import { updateGoal } from '@/lib/actions/goals'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Edit2 } from 'lucide-react'
import { format } from 'date-fns'

interface EditGoalDialogProps {
  goal: {
    id: string
    title: string
    description?: string
    motivation?: string
    targetDate: Date | string
  }
  onUpdate: () => void
}

export function EditGoalDialog({ goal, onUpdate }: EditGoalDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: goal.title,
    description: goal.description || '',
    motivation: goal.motivation || '',
    targetDate: format(new Date(goal.targetDate), 'yyyy-MM-dd'),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      alert('Goal title is required')
      return
    }

    if (!formData.targetDate) {
      alert('Target date is required')
      return
    }

    try {
      setLoading(true)
      await updateGoal(goal.id, {
        title: formData.title,
        description: formData.description || undefined,
        motivation: formData.motivation || undefined,
        targetDate: new Date(formData.targetDate),
      })

      setOpen(false)
      window.location.reload()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update goal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
          <DialogDescription>
            Update your goal details and information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="text-sm font-medium">
              Goal Title *
            </label>
            <Input
              id="title"
              placeholder="e.g., Learn React"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="targetDate" className="text-sm font-medium">
              Target Date *
            </label>
            <Input
              id="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={(e) =>
                setFormData({ ...formData, targetDate: e.target.value })
              }
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="What do you want to achieve?"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={loading}
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="motivation" className="text-sm font-medium">
              Motivation
            </label>
            <Textarea
              id="motivation"
              placeholder="Why is this goal important to you?"
              value={formData.motivation}
              onChange={(e) =>
                setFormData({ ...formData, motivation: e.target.value })
              }
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
