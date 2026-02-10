"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const filters = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
] as const

export function FilterTabs() {
  const pathname = usePathname()
  const current = pathname === "/" ? "all" : pathname.replace("/", "") || "all"

  return (
    <nav
      className="flex gap-1 border-b border-border px-4"
      aria-label="Filter todos"
    >
      {filters.map(({ value, label }) => (
        <Link
          key={value}
          href={value === "all" ? "/" : `/${value}`}
          className={cn(
            "border-b-2 px-4 py-3 text-sm font-medium transition-colors",
            current === value
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
