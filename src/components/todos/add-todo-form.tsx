"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { createTodo } from "@/lib/actions/todos"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

export function AddTodoForm() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    await createTodo(formData)
    formRef.current?.reset()
    router.refresh()
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex gap-2 border-b border-border px-4 py-3"
    >
      <Input
        name="title"
        placeholder="What needs to be done?"
        className="min-w-0 flex-1"
        required
        maxLength={500}
        autoComplete="off"
      />
      <Button type="submit" size="icon" aria-label="Add todo">
        <Plus className="size-4" />
      </Button>
    </form>
  )
}
