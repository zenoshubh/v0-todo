"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getTodos(filter?: "all" | "active" | "completed") {
  const session = await auth()
  if (!session?.user?.id) return []

  const where = { userId: session.user.id }
  if (filter === "active") Object.assign(where, { completed: false })
  if (filter === "completed") Object.assign(where, { completed: true })

  return prisma.todo.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })
}

export async function createTodo(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const title = (formData.get("title") as string)?.trim()
  if (!title) return { error: "Title is required" }

  await prisma.todo.create({
    data: { title, userId: session.user.id },
  })
  revalidatePath("/")
}

export async function toggleTodo(id: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const todo = await prisma.todo.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!todo) return { error: "Todo not found" }

  await prisma.todo.update({
    where: { id },
    data: { completed: !todo.completed },
  })
  revalidatePath("/")
}

export async function deleteTodo(id: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  await prisma.todo.deleteMany({
    where: { id, userId: session.user.id },
  })
  revalidatePath("/")
}

export async function updateTodoTitle(id: string, title: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const trimmed = title.trim()
  if (!trimmed) return { error: "Title is required" }

  await prisma.todo.updateMany({
    where: { id, userId: session.user.id },
    data: { title: trimmed },
  })
  revalidatePath("/")
}
