"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { X, Clock, Trash2, Dumbbell, PlayCircle, Save } from "lucide-react"
import { IconBadge, Stepper, WeightStepper } from "./ui-bits"
import { useApp } from "./app-store"

export function WorkoutBuilderSheet() {
  const {
    builderOpen: open,
    builder: exercises,
    closeBuilder: onClose,
    updateBuilderSet: onUpdateSet,
    removeBuilderSet: onRemoveSet,
    addBuilderSet: onAddSet,
    updateBuilderRest: onUpdateRest,
    removeBuilderExercise: onRemoveExercise,
    finishBuilderWorkout: onFinish,
    saveBuilderAsTemplate,
    savedWorkouts,
    weightUnit,
  } = useApp()

  const [name, setName] = useState("")

  const totalSets = exercises.reduce((sum, e) => sum + e.sets.length, 0)
  const totalKcal = exercises.reduce((sum, e) => sum + e.sets.length * e.kcalPerSet, 0)

  function handleSave() {
    saveBuilderAsTemplate(name.trim() || `Workout ${savedWorkouts.length + 1}`)
    setName("")
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
            className="absolute inset-x-0 bottom-0 z-50 flex max-h-[90%] flex-col rounded-t-[36px] border-t border-[var(--qh-border)] bg-[var(--qh-surface)] px-5 pb-8 pt-3 shadow-2xl"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-[var(--qh-border)]" />

            <div className="mb-4 flex shrink-0 items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[var(--qh-ink)]">My Workout</h2>
                <p className="text-xs font-medium text-[var(--qh-text-2)]">
                  {exercises.length} {exercises.length === 1 ? "exercise" : "exercises"} · {totalSets} sets · ~
                  {totalKcal} kcal
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex size-9 items-center justify-center rounded-full bg-[var(--qh-surface-alt)] text-[var(--qh-ink)] transition-transform active:scale-90"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="qh-no-scrollbar flex-1 overflow-y-auto">
              {exercises.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-14 text-center">
                  <Dumbbell className="size-8 text-[var(--qh-text-2)]" />
                  <p className="text-sm font-medium text-[var(--qh-text-2)]">
                    No exercises yet. Add some from the library.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pb-2">
                  {exercises.map((ex) => {
                    const Icon = ex.icon
                    const repLabel = ex.repUnit === "sec" ? "sec" : "reps"
                    return (
                      <div key={ex.exerciseId} className="rounded-3xl border border-[var(--qh-border)] p-4">
                        <div className="flex items-center gap-3">
                          <IconBadge tone="sage" className="size-10 rounded-2xl">
                            <Icon className="size-5" />
                          </IconBadge>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[var(--qh-ink)]">{ex.name}</p>
                            <p className="text-[11px] font-medium text-[var(--qh-text-2)]">
                              {ex.sets.length} sets · {ex.muscle}
                            </p>
                          </div>
                          <button
                            onClick={() => onRemoveExercise(ex.exerciseId)}
                            aria-label={`Remove ${ex.name}`}
                            className="flex size-8 shrink-0 items-center justify-center rounded-full text-[var(--qh-text-2)] transition-transform active:scale-90"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between rounded-2xl bg-[var(--qh-surface-alt)] px-3 py-2">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--qh-ink)]">
                            <Clock className="size-3.5 text-[var(--qh-text-2)]" />
                            Rest
                          </div>
                          <Stepper
                            value={ex.restSec}
                            onChange={(v) => onUpdateRest(ex.exerciseId, v)}
                            step={15}
                            min={0}
                            max={300}
                            suffix="s"
                            size="sm"
                          />
                        </div>

                        <div className="mt-2 flex flex-col gap-1.5">
                          {ex.sets.map((set, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between rounded-2xl bg-[var(--qh-bg)] px-3 py-2"
                            >
                              <span className="w-8 text-center text-xs font-bold text-[var(--qh-ink)]">{i + 1}</span>
                              <Stepper
                                value={set.reps}
                                onChange={(v) => onUpdateSet(ex.exerciseId, i, { reps: v })}
                                step={ex.repUnit === "sec" ? 5 : 1}
                                min={0}
                                suffix={repLabel}
                                size="sm"
                              />
                              <WeightStepper
                                kg={set.weight}
                                onChange={(v) => onUpdateSet(ex.exerciseId, i, { weight: v })}
                                unit={weightUnit}
                                size="sm"
                              />
                              <button
                                onClick={() => onRemoveSet(ex.exerciseId, i)}
                                aria-label="Remove set"
                                disabled={ex.sets.length <= 1}
                                className="flex size-7 shrink-0 items-center justify-center rounded-full text-[var(--qh-text-2)] transition-transform active:scale-90 disabled:opacity-30"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => onAddSet(ex.exerciseId)}
                          className="mt-2 w-full rounded-2xl border border-dashed border-[var(--qh-border)] py-2 text-xs font-semibold text-[var(--qh-sage)] transition-transform active:scale-[0.98]"
                        >
                          + Add set
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {exercises.length > 0 && (
              <div className="mt-4 flex shrink-0 flex-col gap-2">
                <div className="flex items-center gap-2 rounded-full bg-[var(--qh-surface-alt)] px-2 py-1.5">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`Name this workout (e.g. Push Day)`}
                    className="min-w-0 flex-1 bg-transparent px-2 text-sm text-[var(--qh-ink)] outline-none placeholder:text-[var(--qh-text-2)]"
                  />
                  <button
                    onClick={handleSave}
                    className="flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--qh-surface)] px-3 py-2 text-xs font-bold text-[var(--qh-ink)] shadow-sm transition-transform active:scale-95"
                  >
                    <Save className="size-3.5" />
                    Save
                  </button>
                </div>
                <button
                  onClick={onFinish}
                  className="flex items-center justify-center gap-2 rounded-full bg-[var(--qh-sage)] py-3.5 text-center text-sm font-bold text-[var(--qh-surface)] transition-transform active:scale-[0.98]"
                >
                  <PlayCircle className="size-4" />
                  Finish workout · ~{totalKcal} kcal
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
