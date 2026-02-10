'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function createGoal(data: {
  title: string
  description?: string
  motivation?: string
  targetDate: Date
}) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const goal = await prisma.goal.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  })

  return goal
}

export async function getGoals() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const goals = await prisma.goal.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      targetDate: 'asc',
    },
  })

  return goals
}

export async function getGoal(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const goal = await prisma.goal.findUnique({
    where: {
      id,
    },
  })

  if (!goal || goal.userId !== session.user.id) {
    throw new Error('Goal not found')
  }

  return goal
}

export async function updateGoal(
  id: string,
  data: {
    title?: string
    description?: string
    motivation?: string
    targetDate?: Date
    completed?: boolean
  }
) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const goal = await prisma.goal.findUnique({
    where: {
      id,
    },
  })

  if (!goal || goal.userId !== session.user.id) {
    throw new Error('Goal not found')
  }

  const updatedGoal = await prisma.goal.update({
    where: {
      id,
    },
    data,
  })

  return updatedGoal
}

export async function deleteGoal(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const goal = await prisma.goal.findUnique({
    where: {
      id,
    },
  })

  if (!goal || goal.userId !== session.user.id) {
    throw new Error('Goal not found')
  }

  await prisma.goal.delete({
    where: {
      id,
    },
  })
}
