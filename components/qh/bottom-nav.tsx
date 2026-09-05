"use client"

import { Home, Dumbbell, Plus, Settings } from "lucide-react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import type { TabId, NavigationItem } from "@/lib/qh-data"

const ITEMS: NavigationItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "workout", label: "Workout", icon: Dumbbell },
  { id: "add", label: "Add", icon: Plus },
  { id: "settings", label: "Settings", icon: Settings },
]

export function BottomNav({
  active,
  onSelect,
  onQuickAdd,
}: {
  active: TabId
  onSelect: (id: TabId) => void
  onQuickAdd: () => void
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-5 pb-8">
      <nav
        className={cn(
          "pointer-events-auto flex items-center gap-1 rounded-[26px] border border-[var(--qh-border)] p-1.5",
          "bg-[var(--qh-surface)]/80 shadow-[0_18px_40px_-20px_var(--qh-shadow)] backdrop-blur-2xl",
        )}
      >
        {ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id

          if (item.id === "add") {
            return (
              <button
                key={item.id}
                onClick={onQuickAdd}
                aria-label="Quick add"
                className="mx-0.5 flex size-12 items-center justify-center rounded-2xl bg-[var(--qh-sage)] text-[var(--qh-surface)] shadow-lg transition-transform duration-150 active:scale-90"
              >
                <Icon className="size-6" strokeWidth={2.6} />
              </button>
            )
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className="relative flex size-12 items-center justify-center rounded-2xl transition-transform duration-150 active:scale-90"
            >
              {isActive && (
                <motion.span
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 500, damping: 36 }}
                  className="absolute inset-0 rounded-2xl bg-[var(--qh-sage-soft)]"
                />
              )}
              <Icon
                className={cn(
                  "relative size-[22px] transition-colors",
                  isActive ? "text-[var(--qh-sage)]" : "text-[var(--qh-text-2)]",
                )}
                strokeWidth={isActive ? 2.6 : 2}
              />
            </button>
          )
        })}
      </nav>
    </div>
  )
}
