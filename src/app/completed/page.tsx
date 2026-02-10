import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getTodos } from "@/lib/actions/todos"
import { signOutAction } from "@/lib/actions/sign-out"
import { AddTodoForm } from "@/components/todos/add-todo-form"
import { TodoList } from "@/components/todos/todo-list"
import { FilterTabs } from "@/components/todos/filter-tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LogOut } from "lucide-react"

export default async function CompletedPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const todos = await getTodos("completed")

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h1 className="text-lg font-semibold">Todos</h1>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">
            {session.user.email}
          </span>
          <form action={signOutAction}>
            <Button type="submit" variant="ghost" size="icon-sm" aria-label="Sign out">
              <LogOut className="size-4" />
            </Button>
          </form>
        </div>
      </header>
      <Card className="m-4 flex flex-1 flex-col overflow-hidden">
        <AddTodoForm />
        <FilterTabs />
        <CardContent className="flex-1 overflow-auto p-0">
          <TodoList todos={todos} filter="completed" />
        </CardContent>
      </Card>
    </div>
  )
}
