"use client"

import { cn, kgToLb, lbToKg } from "@/lib/utils"
import { motion } from "motion/react"
import { Minus, Plus } from "lucide-react"
import type { ReactNode } from "react"

/* Rounded elevated card matching the QH surface style */
export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  const Comp: any = onClick ? motion.button : motion.div
  return (
    <Comp
      onClick={onClick}
      whileTap={onClick ? { scale: 0.97 } : undefined}
      className={cn(
        "relative w-full rounded-[28px] border border-[var(--qh-border)] bg-[var(--qh-surface)] text-left",
        "shadow-[0_10px_30px_-18px_var(--qh-shadow)]",
        className,
      )}
    >
      {children}
    </Comp>
  )
}

/* Circular icon badge */
export function IconBadge({
  children,
  tone = "sage",
  className,
}: {
  children: ReactNode
  tone?: "sage" | "brass" | "ink" | "plain" | "success" | "warning" | "danger"
  className?: string
}) {
  const toneMap: Record<string, string> = {
    sage: "bg-[var(--qh-sage)] text-[var(--qh-surface)]",
    brass: "bg-[var(--qh-brass)] text-[var(--qh-surface)]",
    ink: "bg-[var(--qh-ink)] text-[var(--qh-bg)]",
    plain: "bg-[var(--qh-surface-alt)] text-[var(--qh-ink)]",
    success: "bg-[var(--qh-success-soft)] text-[var(--qh-success)]",
    warning: "bg-[var(--qh-warning-soft)] text-[var(--qh-warning)]",
    danger: "bg-[var(--qh-danger-soft)] text-[var(--qh-danger)]",
  }
  return (
    <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-2xl", toneMap[tone], className)}>
      {children}
    </span>
  )
}

/* Maps an exercise difficulty to its badge tone (Easy=green, Medium=yellow, Hard=red) */
export function levelTone(level: "Easy" | "Medium" | "Hard"): "success" | "warning" | "danger" {
  return level === "Easy" ? "success" : level === "Medium" ? "warning" : "danger"
}

/* iOS-style toggle switch */
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex h-8 w-[52px] shrink-0 items-center rounded-full p-1 transition-colors duration-300",
        checked ? "bg-[var(--qh-sage)]" : "bg-[var(--qh-surface-alt)]",
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 600, damping: 34 }}
        className={cn("size-6 rounded-full bg-white shadow-md", checked ? "ml-auto" : "ml-0")}
      />
    </button>
  )
}

/* Numeric +/- stepper used for reps, weight, sets, rest */
export function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  max = 999,
  suffix,
  size = "md",
}: {
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
  max?: number
  suffix?: string
  size?: "sm" | "md"
}) {
  const btnSize = size === "sm" ? "size-7" : "size-8"
  const iconSize = size === "sm" ? "size-3" : "size-3.5"
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, +(value - step).toFixed(2)))}
        aria-label="Decrease"
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-[var(--qh-surface-alt)] text-[var(--qh-ink)] transition-transform active:scale-90",
          btnSize,
        )}
      >
        <Minus className={iconSize} strokeWidth={2.6} />
      </button>
      <span className="min-w-[2.5rem] text-center text-sm font-bold tabular-nums text-[var(--qh-ink)]">
        {value}
        {suffix && <span className="ml-0.5 text-[11px] font-medium text-[var(--qh-text-2)]">{suffix}</span>}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, +(value + step).toFixed(2)))}
        aria-label="Increase"
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-[var(--qh-surface-alt)] text-[var(--qh-ink)] transition-transform active:scale-90",
          btnSize,
        )}
      >
        <Plus className={iconSize} strokeWidth={2.6} />
      </button>
    </div>
  )
}

/* Level pill — Easy=green, Medium=yellow, Hard=red */
export function LevelPill({ level }: { level: "Easy" | "Medium" | "Hard" }) {
  const map = {
    Easy: "bg-[var(--qh-success-soft)] text-[var(--qh-success)]",
    Medium: "bg-[var(--qh-warning-soft)] text-[var(--qh-warning)]",
    Hard: "bg-[var(--qh-danger-soft)] text-[var(--qh-danger)]",
  }
  return <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", map[level])}>{level}</span>
}

/* Weight stepper — stores canonical kilograms, displays/edits in the active unit */
export function WeightStepper({
  kg,
  onChange,
  unit,
  size = "sm",
}: {
  kg: number
  onChange: (kg: number) => void
  unit: "kg" | "lb"
  size?: "sm" | "md"
}) {
  const display = unit === "kg" ? kg : kgToLb(kg)
  const step = unit === "kg" ? 2.5 : 5

  function handleChange(next: number) {
    const nextKg = unit === "kg" ? next : lbToKg(next)
    onChange(Math.max(0, +nextKg.toFixed(2)))
  }

  return <Stepper value={display} onChange={handleChange} step={step} min={0} suffix={unit} size={size} />
}

/* Two-option pill switcher, e.g. kg/lb or Exercises/My Workouts */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-1 rounded-full bg-[var(--qh-surface-alt)] p-1", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
            value === o.value
              ? "bg-[var(--qh-surface)] text-[var(--qh-ink)] shadow-sm"
              : "text-[var(--qh-text-2)]",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
