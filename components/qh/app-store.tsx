"use client"

import { createContext, useContext, useState, useCallback, useMemo, useRef, type ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { USER, METRICS_INIT, SLEEP, HYDRATION, type TabId, type Exercise, type Muscle } from "@/lib/qh-data"

export interface SessionEntry {
  id: string
  name: string
  kcal: number
  minutes: number
  at: number
}

export interface ToastItem {
  id: number
  message: string
}

/* Weight is always stored canonically in kilograms */
export interface BuilderSet {
  reps: number
  weight: number
}

export interface BuilderExercise {
  exerciseId: string
  name: string
  muscle: Muscle
  icon: LucideIcon
  repUnit: "reps" | "sec"
  kcalPerSet: number
  restSec: number
  sets: BuilderSet[]
}

export interface WorkoutTemplate {
  id: string
  name: string
  exercises: BuilderExercise[]
  createdAt: number
}

type WeightUnit = "kg" | "lb"

interface AppStore {
  /* navigation */
  tab: Exclude<TabId, "add">
  setTab: (t: Exclude<TabId, "add">) => void

  /* quick-add sheet */
  quickAddOpen: boolean
  openQuickAdd: () => void
  closeQuickAdd: () => void

  /* live metrics */
  steps: number
  stepsGoal: number
  heartRate: number
  sleepMinutes: number
  sleepGoalMinutes: number
  hydration: number
  hydrationGoal: number

  /* activity totals */
  caloriesBurned: number
  activeMinutes: number
  sessions: SessionEntry[]

  /* account */
  signedIn: boolean
  userName: string
  notifications: boolean
  setNotifications: (v: boolean) => void
  toggleSignIn: () => void

  /* preferences */
  weightUnit: WeightUnit
  setWeightUnit: (u: WeightUnit) => void

  /* subscription */
  plan: string | null
  setPlan: (id: string) => void

  /* actions */
  addWater: (liters: number) => void
  addSteps: (n: number) => void
  addSleep: (minutes: number) => void
  completeWorkout: (w: { id: string; name: string; kcal: number; minutes: number }) => void

  /* workout builder — the exercise being configured */
  activeExercise: Exercise | null
  openExercise: (e: Exercise) => void
  closeExercise: () => void
  addToBuilder: (exercise: Exercise, sets: BuilderSet[], restSec: number) => void

  /* workout builder — the in-progress workout */
  builder: BuilderExercise[]
  builderOpen: boolean
  openBuilder: () => void
  closeBuilder: () => void
  updateBuilderSet: (exerciseId: string, index: number, patch: Partial<BuilderSet>) => void
  addBuilderSet: (exerciseId: string) => void
  removeBuilderSet: (exerciseId: string, index: number) => void
  updateBuilderRest: (exerciseId: string, restSec: number) => void
  removeBuilderExercise: (exerciseId: string) => void
  finishBuilderWorkout: () => void
  saveBuilderAsTemplate: (name: string) => void

  /* saved workout templates */
  savedWorkouts: WorkoutTemplate[]
  startTemplate: (id: string) => void
  deleteTemplate: (id: string) => void

  /* derived */
  stepsPercent: number
  sleepPercent: number
  hydrationPercent: number

  /* toasts */
  toasts: ToastItem[]
  pushToast: (message: string) => void
  dismissToast: (id: number) => void
}

const Ctx = createContext<AppStore | null>(null)

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

export function QhAppProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<Exclude<TabId, "add">>("home")
  const [quickAddOpen, setQuickAddOpen] = useState(false)

  const [steps, setSteps] = useState(METRICS_INIT.steps)
  const [heartRate] = useState(METRICS_INIT.heartRate)
  const [sleepMinutes, setSleepMinutes] = useState(SLEEP.hours * 60 + SLEEP.minutes)
  const [hydration, setHydration] = useState(HYDRATION.current)

  const [caloriesBurned, setCaloriesBurned] = useState(METRICS_INIT.baselineKcal)
  const [activeMinutes, setActiveMinutes] = useState(METRICS_INIT.baselineActiveMin)
  const [sessions, setSessions] = useState<SessionEntry[]>([])

  const [signedIn, setSignedIn] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [plan, setPlanState] = useState<string | null>(null)
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg")

  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null)
  const [builder, setBuilder] = useState<BuilderExercise[]>([])
  const [builderOpen, setBuilderOpen] = useState(false)
  const [savedWorkouts, setSavedWorkouts] = useState<WorkoutTemplate[]>([])

  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastId = useRef(0)

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const pushToast = useCallback(
    (message: string) => {
      const id = ++toastId.current
      setToasts((t) => [...t, { id, message }])
      setTimeout(() => dismissToast(id), 2600)
    },
    [dismissToast],
  )

  const addWater = useCallback(
    (liters: number) => {
      setHydration((h) => {
        const next = clamp(+(h + liters).toFixed(2), 0, HYDRATION.goal)
        return next
      })
      if (liters > 0) pushToast(`Logged ${(liters * 1000).toFixed(0)} ml of water`)
    },
    [pushToast],
  )

  const addSteps = useCallback(
    (n: number) => {
      setSteps((s) => Math.max(0, s + n))
      if (n > 0) pushToast(`Added ${n.toLocaleString()} steps`)
    },
    [pushToast],
  )

  const addSleep = useCallback(
    (minutes: number) => {
      setSleepMinutes((m) => clamp(m + minutes, 0, 16 * 60))
      pushToast(minutes >= 0 ? `Added ${minutes} min of sleep` : `Removed ${-minutes} min of sleep`)
    },
    [pushToast],
  )

  const completeWorkout = useCallback(
    (w: { id: string; name: string; kcal: number; minutes: number }) => {
      setCaloriesBurned((c) => c + w.kcal)
      setActiveMinutes((m) => m + w.minutes)
      setSessions((prev) => [
        { id: `${w.id}-${Date.now()}`, name: w.name, kcal: w.kcal, minutes: w.minutes, at: Date.now() },
        ...prev,
      ])
      pushToast(`Completed ${w.name} · +${w.kcal} kcal`)
    },
    [pushToast],
  )

  const toggleSignIn = useCallback(() => {
    setSignedIn((s) => {
      pushToast(s ? "Signed out" : `Welcome back, ${USER.name}`)
      return !s
    })
  }, [pushToast])

  const setPlan = useCallback(
    (id: string) => {
      setPlanState(id)
      pushToast("Pro plan activated")
    },
    [pushToast],
  )

  const openExercise = useCallback((e: Exercise) => setActiveExercise(e), [])
  const closeExercise = useCallback(() => setActiveExercise(null), [])

  const addToBuilder = useCallback(
    (exercise: Exercise, sets: BuilderSet[], restSec: number) => {
      setBuilder((prev) => {
        const entry: BuilderExercise = {
          exerciseId: exercise.id,
          name: exercise.name,
          muscle: exercise.muscle,
          icon: exercise.icon,
          repUnit: exercise.repUnit,
          kcalPerSet: exercise.kcalPerSet,
          restSec,
          sets,
        }
        const existing = prev.findIndex((b) => b.exerciseId === exercise.id)
        if (existing >= 0) {
          const next = [...prev]
          next[existing] = entry
          return next
        }
        return [...prev, entry]
      })
      setActiveExercise(null)
      pushToast(`${exercise.name} added to your workout`)
    },
    [pushToast],
  )

  const openBuilder = useCallback(() => setBuilderOpen(true), [])
  const closeBuilder = useCallback(() => setBuilderOpen(false), [])

  const updateBuilderSet = useCallback((exerciseId: string, index: number, patch: Partial<BuilderSet>) => {
    setBuilder((prev) =>
      prev.map((e) =>
        e.exerciseId === exerciseId
          ? { ...e, sets: e.sets.map((s, i) => (i === index ? { ...s, ...patch } : s)) }
          : e,
      ),
    )
  }, [])

  const addBuilderSet = useCallback((exerciseId: string) => {
    setBuilder((prev) =>
      prev.map((e) =>
        e.exerciseId === exerciseId
          ? {
              ...e,
              sets: [...e.sets, e.sets.length > 0 ? { ...e.sets[e.sets.length - 1] } : { reps: 10, weight: 0 }],
            }
          : e,
      ),
    )
  }, [])

  const removeBuilderSet = useCallback((exerciseId: string, index: number) => {
    setBuilder((prev) =>
      prev.map((e) => (e.exerciseId === exerciseId ? { ...e, sets: e.sets.filter((_, i) => i !== index) } : e)),
    )
  }, [])

  const updateBuilderRest = useCallback((exerciseId: string, restSec: number) => {
    setBuilder((prev) => prev.map((e) => (e.exerciseId === exerciseId ? { ...e, restSec } : e)))
  }, [])

  const removeBuilderExercise = useCallback((exerciseId: string) => {
    setBuilder((prev) => prev.filter((e) => e.exerciseId !== exerciseId))
  }, [])

  const finishBuilderWorkout = useCallback(() => {
    setBuilder((current) => {
      const totalKcal = current.reduce((sum, e) => sum + e.sets.length * e.kcalPerSet, 0)
      const totalRestMin = current.reduce((sum, e) => sum + (e.sets.length * e.restSec) / 60, 0)
      const totalWorkMin = current.reduce((sum, e) => sum + e.sets.length * 0.75, 0)
      const totalMinutes = Math.max(1, Math.round(totalRestMin + totalWorkMin))

      setCaloriesBurned((c) => c + totalKcal)
      setActiveMinutes((m) => m + totalMinutes)
      setSessions((prev) => [
        {
          id: `custom-${Date.now()}`,
          name: `Custom Workout · ${current.length} ${current.length === 1 ? "exercise" : "exercises"}`,
          kcal: totalKcal,
          minutes: totalMinutes,
          at: Date.now(),
        },
        ...prev,
      ])
      pushToast(`Workout complete · +${totalKcal} kcal`)
      return []
    })
    setBuilderOpen(false)
  }, [pushToast])

  const saveBuilderAsTemplate = useCallback(
    (name: string) => {
      setBuilder((current) => {
        if (current.length === 0) return current
        setSavedWorkouts((prev) => [
          { id: `template-${Date.now()}`, name: name.trim() || `Workout ${prev.length + 1}`, exercises: current, createdAt: Date.now() },
          ...prev,
        ])
        return current
      })
      pushToast("Workout saved")
    },
    [pushToast],
  )

  const startTemplate = useCallback(
    (id: string) => {
      setSavedWorkouts((templates) => {
        const template = templates.find((t) => t.id === id)
        if (template) {
          setBuilder(template.exercises.map((e) => ({ ...e, sets: e.sets.map((s) => ({ ...s })) })))
          setBuilderOpen(true)
        }
        return templates
      })
    },
    [],
  )

  const deleteTemplate = useCallback(
    (id: string) => {
      setSavedWorkouts((prev) => prev.filter((t) => t.id !== id))
      pushToast("Workout deleted")
    },
    [pushToast],
  )

  const stepsPercent = useMemo(() => clamp(Math.round((steps / METRICS_INIT.stepsGoal) * 100), 0, 100), [steps])
  const sleepPercent = useMemo(
    () => clamp(Math.round((sleepMinutes / (SLEEP.goalHours * 60)) * 100), 0, 100),
    [sleepMinutes],
  )
  const hydrationPercent = useMemo(() => clamp(Math.round((hydration / HYDRATION.goal) * 100), 0, 100), [hydration])

  const value: AppStore = {
    tab,
    setTab,
    quickAddOpen,
    openQuickAdd: () => setQuickAddOpen(true),
    closeQuickAdd: () => setQuickAddOpen(false),
    steps,
    stepsGoal: METRICS_INIT.stepsGoal,
    heartRate,
    sleepMinutes,
    sleepGoalMinutes: SLEEP.goalHours * 60,
    hydration,
    hydrationGoal: HYDRATION.goal,
    caloriesBurned,
    activeMinutes,
    sessions,
    signedIn,
    userName: USER.name,
    notifications,
    setNotifications,
    toggleSignIn,
    weightUnit,
    setWeightUnit,
    plan,
    setPlan,
    addWater,
    addSteps,
    addSleep,
    completeWorkout,
    activeExercise,
    openExercise,
    closeExercise,
    addToBuilder,
    builder,
    builderOpen,
    openBuilder,
    closeBuilder,
    updateBuilderSet,
    addBuilderSet,
    removeBuilderSet,
    updateBuilderRest,
    removeBuilderExercise,
    finishBuilderWorkout,
    saveBuilderAsTemplate,
    savedWorkouts,
    startTemplate,
    deleteTemplate,
    stepsPercent,
    sleepPercent,
    hydrationPercent,
    toasts,
    pushToast,
    dismissToast,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useApp must be used within QhAppProvider")
  return ctx
}
