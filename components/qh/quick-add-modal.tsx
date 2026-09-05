"use client"

import { AnimatePresence, motion } from "motion/react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { QUICK_ADD_OPTIONS } from "@/lib/qh-data"
import { useApp } from "./app-store"

export function QuickAddModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { addWater, addSteps, addSleep, setTab } = useApp()

  function handleSelect(id: string) {
    switch (id) {
      case "water":
        addWater(0.25)
        break
      case "sleep":
        addSleep(30)
        break
      case "steps":
        addSteps(500)
        break
      case "workout":
        setTab("workout")
        break
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) onClose()
            }}
            className="absolute inset-x-0 bottom-0 z-50 rounded-t-[36px] border-t border-[var(--qh-border)] bg-[var(--qh-surface)] px-5 pb-10 pt-3 shadow-2xl"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[var(--qh-border)]" />
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[var(--qh-ink)]">Quick add</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex size-9 items-center justify-center rounded-full bg-[var(--qh-surface-alt)] text-[var(--qh-ink)] transition-transform active:scale-90"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ADD_OPTIONS.map((opt, i) => {
                const Icon = opt.icon
                return (
                  <motion.button
                    key={opt.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i + 0.1 }}
                    onClick={() => handleSelect(opt.id)}
                    whileTap={{ scale: 0.96 }}
                    className="flex flex-col items-start gap-3 rounded-3xl border border-[var(--qh-border)] bg-[var(--qh-bg)] p-4 text-left"
                  >
                    <span
                      className={cn(
                        "flex size-11 items-center justify-center rounded-2xl text-[var(--qh-surface)]",
                        opt.tone === "sage" ? "bg-[var(--qh-sage)]" : "bg-[var(--qh-brass)]",
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--qh-ink)]">{opt.label}</p>
                      <p className="text-xs font-medium text-[var(--qh-text-2)]">{opt.hint}</p>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
