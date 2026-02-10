'use client'

import { useState } from 'react'
import { createGoal } from '@/lib/actions/goals'
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
import { Plus } from 'lucide-react'

export function CreateGoalDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    motivation: '',
    targetDate: '',
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
      await createGoal({
        title: formData.title,
        description: formData.description || undefined,
        motivation: formData.motivation || undefined,
        targetDate: new Date(formData.targetDate),
      })

      setFormData({
        title: '',
        description: '',
        motivation: '',
        targetDate: '',
      })
      setOpen(false)
      window.location.reload()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create goal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Goal</DialogTitle>
          <DialogDescription>
            Set a goal, define when you want to achieve it, and describe your
            motivation.
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
              {loading ? 'Creating...' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
