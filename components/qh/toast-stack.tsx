"use client"

import { AnimatePresence, motion } from "motion/react"
import { CheckCircle2 } from "lucide-react"
import { useApp } from "./app-store"

export function ToastStack() {
  const { toasts, dismissToast } = useApp()

  return (
    <div className="pointer-events-none absolute inset-x-0 top-16 z-50 flex flex-col items-center gap-2 px-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            onClick={() => dismissToast(t.id)}
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-[var(--qh-border)] bg-[var(--qh-surface)]/95 px-4 py-2.5 shadow-[0_18px_40px_-20px_var(--qh-shadow)] backdrop-blur-xl"
          >
            <CheckCircle2 className="size-4 shrink-0 text-[var(--qh-sage)]" />
            <span className="text-xs font-semibold text-[var(--qh-ink)]">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
