import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { GoalsList } from '@/components/goals/goals-list'
import { CreateGoalDialog } from '@/components/goals/create-goal-dialog'

export const metadata = {
  title: 'Goals | Todo App',
  description: 'Manage your personal goals',
}

export default async function GoalsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Goals</h1>
            <p className="mt-2 text-muted-foreground">
              Set and track your personal goals
            </p>
          </div>
          <CreateGoalDialog />
        </div>

        <GoalsList />
      </div>
    </main>
  )
}
