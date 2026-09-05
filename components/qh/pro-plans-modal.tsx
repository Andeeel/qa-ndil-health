"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { X, Check, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import { PRO_PLANS } from "@/lib/qh-data"
import { useApp } from "./app-store"

export function ProPlansModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { setPlan } = useApp()
  const [selected, setSelected] = useState(PRO_PLANS.find((p) => p.highlight)?.id ?? PRO_PLANS[0].id)

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
            className="absolute inset-x-0 bottom-0 z-50 max-h-[92%] overflow-y-auto qh-no-scrollbar rounded-t-[36px] border-t border-[var(--qh-border)] bg-[var(--qh-surface)] px-5 pb-10 pt-3 shadow-2xl"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[var(--qh-border)]" />

            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-[var(--qh-brass)] text-[var(--qh-surface)]">
                  <Crown className="size-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-[var(--qh-ink)]">Choose your plan</h2>
                  <p className="text-xs font-medium text-[var(--qh-text-2)]">Coaching, insights & more</p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex size-9 items-center justify-center rounded-full bg-[var(--qh-surface-alt)] text-[var(--qh-ink)] transition-transform active:scale-90"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {PRO_PLANS.map((plan, i) => {
                const isActive = selected === plan.id
                return (
                  <motion.button
                    key={plan.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i + 0.08 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelected(plan.id)}
                    aria-pressed={isActive}
                    className={cn(
                      "relative rounded-3xl border p-4 text-left transition-colors",
                      isActive
                        ? "border-[var(--qh-brass)] bg-[var(--qh-brass-soft)]"
                        : "border-[var(--qh-border)] bg-[var(--qh-bg)]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-base font-bold text-[var(--qh-ink)]">{plan.name}</p>
                          {plan.badge && (
                            <span className="rounded-full bg-[var(--qh-brass)] px-2 py-0.5 text-[10px] font-semibold text-[var(--qh-surface)]">
                              {plan.badge}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs font-medium text-[var(--qh-text-2)]">{plan.tagline}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-right">
                          <span className="text-lg font-bold text-[var(--qh-ink)]">{plan.price}</span>
                          <span className="text-xs font-medium text-[var(--qh-text-2)]">{plan.period}</span>
                        </span>
                        <span
                          className={cn(
                            "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                            isActive
                              ? "border-[var(--qh-brass)] bg-[var(--qh-brass)] text-[var(--qh-surface)]"
                              : "border-[var(--qh-border)]",
                          )}
                        >
                          {isActive && <Check className="size-3" strokeWidth={3} />}
                        </span>
                      </div>
                    </div>

                    <ul className="mt-3 flex flex-col gap-1.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs font-medium text-[var(--qh-ink)]">
                          <Check className="size-3.5 shrink-0 text-[var(--qh-brass)]" strokeWidth={3} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </motion.button>
                )
              })}
            </div>

            <button
              onClick={() => {
                setPlan(selected)
                onClose()
              }}
              className="mt-5 w-full rounded-2xl bg-[var(--qh-brass)] py-3.5 text-sm font-semibold text-[var(--qh-surface)] transition-transform active:scale-95"
            >
              Start Pro
            </button>
            <p className="mt-3 text-center text-[11px] font-medium text-[var(--qh-text-2)]">
              Cancel anytime. Terms apply.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
