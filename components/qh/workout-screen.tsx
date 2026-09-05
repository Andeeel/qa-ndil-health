"use client"

import { useMemo, useState } from "react"
import { motion } from "motion/react"
import { Search, ChevronRight, Dumbbell, PlayCircle, Trash2, Plus } from "lucide-react"
import { Card, IconBadge, LevelPill, SegmentedControl, levelTone } from "./ui-bits"
import { useApp } from "./app-store"
import { EXERCISES, MUSCLE_GROUPS, EXERCISE_CATEGORIES, type Exercise } from "@/lib/qh-data"

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 320, damping: 30 } },
}

export function WorkoutScreen() {
  const [view, setView] = useState<"library" | "saved">("library")
  const [query, setQuery] = useState("")
  const [muscle, setMuscle] = useState<(typeof MUSCLE_GROUPS)[number]>("All")
  const [category, setCategory] = useState<(typeof EXERCISE_CATEGORIES)[number]>("All")

  const { openExercise, builder, builderOpen, openBuilder, savedWorkouts, startTemplate, deleteTemplate } = useApp()

  const results = useMemo(
    () =>
      EXERCISES.filter(
        (e) =>
          (muscle === "All" || e.muscle === muscle) &&
          (category === "All" || e.category === category) &&
          e.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query, muscle, category],
  )

  const addedIds = useMemo(() => new Set(builder.map((b) => b.exerciseId)), [builder])
  const totalSets = builder.reduce((sum, e) => sum + e.sets.length, 0)

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4 px-5 pb-40">
        <motion.header variants={item} className="flex items-center justify-between pt-2">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--qh-ink)]">Workout</h1>
        </motion.header>

        <motion.div variants={item}>
          <SegmentedControl
            value={view}
            onChange={setView}
            options={[
              { value: "library", label: "Exercises" },
              { value: "saved", label: "My Workouts" },
            ]}
          />
        </motion.div>

        {view === "library" ? (
          <>
            {/* Search */}
            <motion.div
              variants={item}
              className="flex items-center gap-2 rounded-full bg-[var(--qh-surface-alt)] p-1.5 pl-4"
            >
              <Search className="size-4 text-[var(--qh-text-2)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search exercises"
                className="min-w-0 flex-1 bg-transparent text-sm text-[var(--qh-ink)] outline-none placeholder:text-[var(--qh-text-2)]"
              />
            </motion.div>

            {/* Category filter chips: Bodyweight / Gym / Cardio */}
            <motion.div variants={item} className="qh-no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
              {EXERCISE_CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                    category === c
                      ? "bg-[var(--qh-ink)] text-[var(--qh-bg)]"
                      : "bg-[var(--qh-surface-alt)] text-[var(--qh-text-2)]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </motion.div>

            {/* Muscle group filter chips */}
            <motion.div variants={item} className="qh-no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
              {MUSCLE_GROUPS.map((g) => (
                <button
                  key={g}
                  onClick={() => setMuscle(g)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    muscle === g
                      ? "bg-[var(--qh-sage)] text-[var(--qh-surface)]"
                      : "bg-[var(--qh-surface-alt)] text-[var(--qh-text-2)]"
                  }`}
                >
                  {g}
                </button>
              ))}
            </motion.div>

            <motion.p variants={item} className="px-1 pt-1 text-sm font-semibold text-[var(--qh-ink)]">
              Exercises · {results.length}
            </motion.p>

            {results.map((e) => (
              <ExerciseRow key={e.id} exercise={e} added={addedIds.has(e.id)} onOpen={() => openExercise(e)} />
            ))}

            {results.length === 0 && (
              <motion.p variants={item} className="py-8 text-center text-sm text-[var(--qh-text-2)]">
                No exercises match &ldquo;{query}&rdquo;
              </motion.p>
            )}
          </>
        ) : (
          <>
            <motion.p variants={item} className="px-1 pt-1 text-sm font-semibold text-[var(--qh-ink)]">
              Saved workouts · {savedWorkouts.length}
            </motion.p>

            {savedWorkouts.length === 0 ? (
              <motion.div variants={item} className="flex flex-col items-center gap-3 py-16 text-center">
                <Dumbbell className="size-8 text-[var(--qh-text-2)]" />
                <p className="text-sm font-medium text-[var(--qh-text-2)]">
                  No saved workouts yet. Build one in Exercises and tap Save.
                </p>
                <button
                  onClick={() => setView("library")}
                  className="flex items-center gap-1.5 rounded-full bg-[var(--qh-sage)] px-4 py-2.5 text-sm font-semibold text-[var(--qh-surface)] transition-transform active:scale-95"
                >
                  <Plus className="size-4" />
                  Browse exercises
                </button>
              </motion.div>
            ) : (
              savedWorkouts.map((t) => {
                const totalSetsT = t.exercises.reduce((sum, e) => sum + e.sets.length, 0)
                const totalKcalT = t.exercises.reduce((sum, e) => sum + e.sets.length * e.kcalPerSet, 0)
                const muscles = Array.from(new Set(t.exercises.map((e) => e.muscle)))
                return (
                  <motion.div key={t.id} variants={item}>
                    <Card className="flex flex-col gap-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-base font-semibold text-[var(--qh-ink)]">{t.name}</p>
                          <p className="mt-1 text-xs font-medium text-[var(--qh-text-2)]">
                            {t.exercises.length} {t.exercises.length === 1 ? "exercise" : "exercises"} · {totalSetsT}{" "}
                            sets · ~{totalKcalT} kcal
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {muscles.slice(0, 4).map((m) => (
                              <span
                                key={m}
                                className="rounded-full bg-[var(--qh-surface-alt)] px-2 py-0.5 text-[10px] font-semibold text-[var(--qh-text-2)]"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteTemplate(t.id)}
                          aria-label={`Delete ${t.name}`}
                          className="flex size-8 shrink-0 items-center justify-center rounded-full text-[var(--qh-text-2)] transition-transform active:scale-90"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => startTemplate(t.id)}
                        className="flex items-center justify-center gap-2 rounded-full bg-[var(--qh-sage)] py-2.5 text-sm font-semibold text-[var(--qh-surface)] transition-transform active:scale-[0.98]"
                      >
                        <PlayCircle className="size-4" />
                        Start workout
                      </button>
                    </Card>
                  </motion.div>
                )
              })
            )}
          </>
        )}
      </motion.div>

      {/* Floating "My Workout" bar */}
      {builder.length > 0 && !builderOpen && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={openBuilder}
          className="absolute inset-x-5 bottom-28 z-30 flex items-center justify-between rounded-full bg-[var(--qh-ink)] px-5 py-3.5 shadow-[0_18px_40px_-20px_var(--qh-shadow)]"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-[var(--qh-bg)]">
            <Dumbbell className="size-4" />
            My Workout · {builder.length} {builder.length === 1 ? "exercise" : "exercises"}
          </span>
          <span className="rounded-full bg-[var(--qh-sage)] px-3 py-1 text-xs font-bold text-[var(--qh-surface)]">
            {totalSets} sets
          </span>
        </motion.button>
      )}
    </>
  )
}

function ExerciseRow({ exercise, added, onOpen }: { exercise: Exercise; added: boolean; onOpen: () => void }) {
  const Icon = exercise.icon
  return (
    <motion.div variants={item}>
      <Card onClick={onOpen} className="flex items-center gap-4 p-4">
        <IconBadge tone={levelTone(exercise.level)} className="size-12 rounded-3xl">
          <Icon className="size-6" />
        </IconBadge>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-base font-semibold text-[var(--qh-ink)]">{exercise.name}</p>
            <LevelPill level={exercise.level} />
          </div>
          <div className="mt-1.5 flex items-center gap-3 text-xs font-medium text-[var(--qh-text-2)]">
            <span>{exercise.muscle}</span>
            <span>{exercise.equipment}</span>
            <span>
              {exercise.defaultSets} × {exercise.defaultReps} {exercise.repUnit === "sec" ? "sec" : "reps"}
            </span>
          </div>
        </div>
        {added ? (
          <span className="shrink-0 rounded-full bg-[var(--qh-sage-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--qh-sage)]">
            Added
          </span>
        ) : (
          <ChevronRight className="size-4 shrink-0 text-[var(--qh-text-2)]" />
        )}
      </Card>
    </motion.div>
  )
}
