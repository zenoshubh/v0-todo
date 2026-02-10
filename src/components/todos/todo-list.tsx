"use client"

import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toggleTodo, deleteTodo } from "@/lib/actions/todos"
import { cn } from "@/lib/utils"

type Todo = {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}

type Filter = "all" | "active" | "completed"

export function TodoList({
  todos,
  filter,
}: {
  todos: Todo[]
  filter: Filter
}) {
  const router = useRouter()

  async function handleToggle(id: string) {
    await toggleTodo(id)
    router.refresh()
  }

  async function handleDelete(id: string) {
    await deleteTodo(id)
    router.refresh()
  }

  if (todos.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        {filter === "completed"
          ? "No completed todos."
          : filter === "active"
            ? "No active todos. Add one above!"
            : "No todos yet. Add one above!"}
      </p>
    )
  }

  return (
    <ul className="divide-y divide-border">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
        >
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => handleToggle(todo.id)}
            aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
            className="shrink-0"
          />
          <span
            className={cn(
              "min-w-0 flex-1 text-sm",
              todo.completed && "text-muted-foreground line-through"
            )}
          >
            {todo.title}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
            onClick={() => handleDelete(todo.id)}
            aria-label="Delete todo"
          >
            <Trash2 className="size-4" />
          </Button>
        </li>
      ))}
    </ul>
  )
}
