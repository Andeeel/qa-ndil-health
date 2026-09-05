"use client"

import { motion } from "motion/react"
import { Sun, Moon, Plus, Minus, Footprints, HeartPulse, MoonStar, Flame, Timer } from "lucide-react"
import { Card, IconBadge } from "./ui-bits"
import { useQhTheme } from "./theme"
import { useApp } from "./app-store"

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 320, damping: 30 } },
}

export function HomeScreen() {
  const { isDark, toggle } = useQhTheme()
  const {
    userName,
    steps,
    stepsGoal,
    heartRate,
    sleepMinutes,
    sleepGoalMinutes,
    hydration,
    hydrationGoal,
    hydrationPercent,
    caloriesBurned,
    activeMinutes,
    sessions,
    addWater,
  } = useApp()

  const sleepHours = Math.floor(sleepMinutes / 60)
  const sleepRemMinutes = sleepMinutes % 60
  const sleepGoalHours = Math.round(sleepGoalMinutes / 60)

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4 px-5 pb-40">
      {/* Header */}
      <motion.header variants={item} className="flex items-start justify-between pt-2">
        <div>
          <p className="text-sm font-medium text-[var(--qh-text-2)]">Welcome,</p>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--qh-ink)]">{userName}</h1>
        </div>
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="flex size-11 items-center justify-center rounded-2xl border border-[var(--qh-border)] bg-[var(--qh-surface)] text-[var(--qh-ink)] shadow-sm transition-transform duration-150 active:scale-90"
        >
          {isDark ? <Moon className="size-5" /> : <Sun className="size-5" />}
        </button>
      </motion.header>

      {/* Metric pair */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <IconBadge tone="sage">
            <Footprints className="size-5" />
          </IconBadge>
          <p className="mt-4 text-2xl font-bold leading-none text-[var(--qh-ink)]">{steps.toLocaleString()}</p>
          <p className="mt-1.5 text-xs font-medium text-[var(--qh-text-2)]">
            of {Math.round(stepsGoal / 1000)}k · Steps
          </p>
        </Card>
        <Card className="p-4">
          <IconBadge tone="brass">
            <HeartPulse className="size-5" />
          </IconBadge>
          <p className="mt-4 text-2xl font-bold leading-none text-[var(--qh-ink)]">{heartRate}</p>
          <p className="mt-1.5 text-xs font-medium text-[var(--qh-text-2)]">bpm · Heart rate</p>
        </Card>
      </motion.div>

      {/* Sleep card with textured background */}
      <motion.div variants={item}>
        <Card className="overflow-hidden p-5">
          <div
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{
              background:
                "repeating-linear-gradient(115deg, var(--qh-teal) 0px, var(--qh-teal) 14px, var(--qh-teal-2) 14px, var(--qh-teal-2) 26px)",
              maskImage: "linear-gradient(120deg, black, transparent 90%)",
              WebkitMaskImage: "linear-gradient(120deg, black, transparent 90%)",
            }}
          />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconBadge tone="ink">
                <MoonStar className="size-5" />
              </IconBadge>
              <div>
                <p className="text-2xl font-bold leading-none text-[var(--qh-ink)]">
                  {sleepHours}h {sleepRemMinutes}m
                </p>
                <p className="mt-1.5 text-xs font-medium text-[var(--qh-text-2)]">Total sleep</p>
              </div>
            </div>
            <span className="rounded-full bg-[var(--qh-surface)]/70 px-3 py-1 text-[11px] font-semibold text-[var(--qh-ink)] backdrop-blur">
              Goal {sleepGoalHours}h
            </span>
          </div>
        </Card>
      </motion.div>

      {/* Hydration */}
      <motion.div variants={item}>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconBadge tone="sage">
                <Plus className="size-5" />
              </IconBadge>
              <div>
                <p className="text-sm font-semibold text-[var(--qh-ink)]">Hydration</p>
                <p className="text-xs font-medium text-[var(--qh-text-2)]">
                  {hydration.toFixed(1)}L / {hydrationGoal.toFixed(1)}L
                </p>
              </div>
            </div>
            <span className="text-lg font-bold text-[var(--qh-sage)]">{hydrationPercent}%</span>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[var(--qh-surface-alt)]">
            <motion.div
              className="h-full rounded-full bg-[var(--qh-sage)]"
              animate={{ width: `${hydrationPercent}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 26 }}
            />
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              onClick={() => addWater(-0.25)}
              aria-label="Remove water"
              className="flex size-9 items-center justify-center rounded-full border border-[var(--qh-border)] text-[var(--qh-ink)] transition-transform active:scale-90"
            >
              <Minus className="size-4" />
            </button>
            <button
              onClick={() => addWater(0.25)}
              aria-label="Add water"
              className="flex size-9 items-center justify-center rounded-full bg-[var(--qh-sage)] text-[var(--qh-surface)] transition-transform active:scale-90"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Today's activity, driven by completed workouts */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <IconBadge tone="brass">
            <Flame className="size-5" />
          </IconBadge>
          <p className="mt-4 text-2xl font-bold leading-none text-[var(--qh-ink)]">{caloriesBurned}</p>
          <p className="mt-1.5 text-xs font-medium text-[var(--qh-text-2)]">kcal · Burned today</p>
        </Card>
        <Card className="p-4">
          <IconBadge tone="sage">
            <Timer className="size-5" />
          </IconBadge>
          <p className="mt-4 text-2xl font-bold leading-none text-[var(--qh-ink)]">{activeMinutes}</p>
          <p className="mt-1.5 text-xs font-medium text-[var(--qh-text-2)]">min · Active today</p>
        </Card>
      </motion.div>

      {sessions.length > 0 && (
        <motion.div variants={item}>
          <p className="px-1 pb-2 text-sm font-semibold text-[var(--qh-ink)]">Recent workouts</p>
          <Card className="divide-y divide-[var(--qh-border)]">
            {sessions.slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center justify-between p-4">
                <span className="text-sm font-semibold text-[var(--qh-ink)]">{s.name}</span>
                <span className="text-xs font-medium text-[var(--qh-text-2)]">
                  {s.minutes}m · {s.kcal} kcal
                </span>
              </div>
            ))}
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
