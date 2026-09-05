"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { X, Clock, Plus, Trash2 } from "lucide-react"
import { IconBadge, Stepper, WeightStepper, LevelPill, levelTone } from "./ui-bits"
import { useApp, type BuilderSet } from "./app-store"

export function ExerciseConfigSheet() {
  const { activeExercise: exercise, closeExercise, addToBuilder, weightUnit } = useApp()
  const [sets, setSets] = useState<BuilderSet[]>([])
  const [restSec, setRestSec] = useState(60)

  // Reset the draft whenever a new exercise is opened
  useEffect(() => {
    if (exercise) {
      setSets(Array.from({ length: exercise.defaultSets }, () => ({ reps: exercise.defaultReps, weight: 0 })))
      setRestSec(exercise.defaultRestSec)
    }
  }, [exercise])

  if (!exercise) return null
  const Icon = exercise.icon
  const repLabel = exercise.repUnit === "sec" ? "sec" : "reps"

  function updateSet(index: number, patch: Partial<BuilderSet>) {
    setSets((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)))
  }

  function addSet() {
    const fallbackReps = exercise?.defaultReps ?? 10
    setSets((prev) => [...prev, prev.length > 0 ? { ...prev[prev.length - 1] } : { reps: fallbackReps, weight: 0 }])
  }

  function removeSet(index: number) {
    setSets((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <AnimatePresence>
      {exercise && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeExercise}
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
              if (info.offset.y > 120) closeExercise()
            }}
            className="absolute inset-x-0 bottom-0 z-50 flex max-h-[88%] flex-col rounded-t-[36px] border-t border-[var(--qh-border)] bg-[var(--qh-surface)] px-5 pb-8 pt-3 shadow-2xl"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-[var(--qh-border)]" />

            <div className="mb-5 flex shrink-0 items-center gap-3">
              <IconBadge tone={levelTone(exercise.level)} className="size-12 rounded-3xl">
                <Icon className="size-6" />
              </IconBadge>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-lg font-bold text-[var(--qh-ink)]">{exercise.name}</h2>
                  <LevelPill level={exercise.level} />
                </div>
                <p className="text-xs font-medium text-[var(--qh-text-2)]">
                  {exercise.muscle} · {exercise.equipment}
                </p>
              </div>
              <button
                onClick={closeExercise}
                aria-label="Close"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--qh-surface-alt)] text-[var(--qh-ink)] transition-transform active:scale-90"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="qh-no-scrollbar flex-1 overflow-y-auto">
              {/* Rest timer */}
              <div className="mb-4 flex items-center justify-between rounded-3xl border border-[var(--qh-border)] bg-[var(--qh-bg)] px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--qh-ink)]">
                  <Clock className="size-4 text-[var(--qh-text-2)]" />
                  Rest between sets
                </div>
                <Stepper value={restSec} onChange={setRestSec} step={15} min={0} max={300} suffix="s" size="sm" />
              </div>

              {/* Set rows */}
              <div className="flex items-center justify-between px-1 pb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--qh-text-2)]">
                <span className="w-10">Set</span>
                <span>{repLabel === "sec" ? "Seconds" : "Reps"}</span>
                <span>Weight</span>
                <span className="w-7" />
              </div>

              <div className="flex flex-col gap-2">
                {sets.map((set, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between rounded-2xl bg-[var(--qh-surface-alt)] px-3 py-2.5"
                  >
                    <span className="flex w-10 items-center justify-center text-sm font-bold text-[var(--qh-ink)]">
                      {i + 1}
                    </span>
                    <Stepper
                      value={set.reps}
                      onChange={(v) => updateSet(i, { reps: v })}
                      step={exercise.repUnit === "sec" ? 5 : 1}
                      min={0}
                      suffix={repLabel}
                      size="sm"
                    />
                    <WeightStepper
                      kg={set.weight}
                      onChange={(v) => updateSet(i, { weight: v })}
                      unit={weightUnit}
                      size="sm"
                    />
                    <button
                      onClick={() => removeSet(i)}
                      aria-label="Remove set"
                      disabled={sets.length <= 1}
                      className="flex size-7 shrink-0 items-center justify-center rounded-full text-[var(--qh-text-2)] transition-transform active:scale-90 disabled:opacity-30"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={addSet}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-[var(--qh-border)] py-2.5 text-sm font-semibold text-[var(--qh-sage)] transition-transform active:scale-[0.98]"
              >
                <Plus className="size-4" />
                Add set
              </button>
            </div>

            <button
              onClick={() => addToBuilder(exercise, sets, restSec)}
              className="mt-5 shrink-0 rounded-full bg-[var(--qh-sage)] py-3.5 text-center text-sm font-bold text-[var(--qh-surface)] transition-transform active:scale-[0.98]"
            >
              Add {sets.length} {sets.length === 1 ? "set" : "sets"} to workout
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
