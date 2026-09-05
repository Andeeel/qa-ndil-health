import type { LucideIcon } from "lucide-react"
import {
  Footprints,
  HeartPulse,
  MoonStar,
  Droplet,
  Flame,
  Dumbbell,
  Timer,
  Waves,
  Bike,
  Activity,
  Zap,
  Mountain,
  Repeat,
  Wind,
  Target,
  Move,
  Weight,
  PersonStanding,
  RotateCw,
  Anchor,
  Gauge,
  Swords,
} from "lucide-react"

export type TabId = "home" | "workout" | "add" | "settings"

export interface NavigationItem {
  id: TabId
  label: string
  icon: LucideIcon
}

export interface UserMetric {
  id: string
  label: string
  value: string
  unit: string
  icon: LucideIcon
  tone: "sage" | "brass" | "plain"
}

export type Muscle = "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Core" | "Cardio"
export type ExerciseCategory = "Bodyweight" | "Gym" | "Cardio"
export type ExerciseLevel = "Easy" | "Medium" | "Hard"

export interface Exercise {
  id: string
  name: string
  muscle: Muscle
  category: ExerciseCategory
  equipment: string
  level: ExerciseLevel
  icon: LucideIcon
  defaultSets: number
  defaultReps: number
  repUnit: "reps" | "sec"
  defaultRestSec: number
  kcalPerSet: number
}

export const USER = {
  name: "Yahia",
  greeting: "Welcome,",
}

/* Starting values for the live app store */
export const METRICS_INIT = {
  steps: 7240,
  stepsGoal: 10000,
  heartRate: 72,
  baselineKcal: 340,
  baselineActiveMin: 26,
  workoutsGoal: 3,
}

export const METRICS: UserMetric[] = [
  { id: "steps", label: "Steps", value: "7,240", unit: "of 10k", icon: Footprints, tone: "sage" },
  { id: "hr", label: "Heart rate", value: "72", unit: "bpm", icon: HeartPulse, tone: "brass" },
]

export const SLEEP = {
  label: "Total sleep",
  hours: 6,
  minutes: 48,
  goalHours: 8,
  icon: MoonStar,
}

export const HYDRATION = {
  label: "Hydration",
  current: 1.9,
  goal: 2.0,
  percent: 95,
  icon: Droplet,
}

export const MUSCLE_GROUPS = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Cardio"] as const
export const EXERCISE_CATEGORIES = ["All", "Bodyweight", "Gym", "Cardio"] as const

/* ─────────────────────────────────────────────
   Exercise library generation
   ───────────────────────────────────────────── */

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

interface ExerciseSeed {
  name: string
  equipment: string
  level: ExerciseLevel
  category: ExerciseCategory
  icon?: LucideIcon
  repUnit?: "reps" | "sec"
  reps?: number
  sets?: number
  rest?: number
}

function makeExercise(muscle: Muscle, seed: ExerciseSeed, fallbackIcon: LucideIcon): Exercise {
  const level = seed.level
  const repUnit = seed.repUnit ?? "reps"
  const sets = seed.sets ?? (level === "Hard" ? 4 : 3)
  const reps =
    seed.reps ??
    (repUnit === "sec"
      ? level === "Hard"
        ? 30
        : level === "Medium"
          ? 40
          : 45
      : level === "Hard"
        ? 8
        : level === "Medium"
          ? 10
          : 14)
  const rest = seed.rest ?? (level === "Hard" ? 90 : level === "Medium" ? 60 : 40)
  const kcalPerSet = level === "Hard" ? 12 : level === "Medium" ? 8 : 5

  return {
    id: slugify(seed.name),
    name: seed.name,
    muscle,
    category: seed.category,
    equipment: seed.equipment,
    level,
    icon: seed.icon ?? fallbackIcon,
    defaultSets: sets,
    defaultReps: reps,
    repUnit,
    defaultRestSec: rest,
    kcalPerSet,
  }
}

function buildGroup(muscle: Muscle, seeds: ExerciseSeed[], iconPalette: LucideIcon[]): Exercise[] {
  return seeds.map((s, i) => makeExercise(muscle, s, iconPalette[i % iconPalette.length]))
}

const CHEST_ICONS = [Dumbbell, Activity, Move, Weight]
const BACK_ICONS = [Move, Dumbbell, Repeat, Anchor]
const LEGS_ICONS = [Footprints, Dumbbell, Mountain, Weight]
const SHOULDER_ICONS = [PersonStanding, Dumbbell, Move, Wind]
const ARM_ICONS = [Dumbbell, Repeat, Activity, RotateCw]
const CORE_ICONS = [Target, Activity, RotateCw, Anchor]

const CHEST_SEEDS: ExerciseSeed[] = [
  { name: "Barbell Bench Press", equipment: "Barbell", level: "Hard", category: "Gym" },
  { name: "Incline Barbell Bench Press", equipment: "Barbell", level: "Hard", category: "Gym" },
  { name: "Decline Barbell Bench Press", equipment: "Barbell", level: "Medium", category: "Gym" },
  { name: "Dumbbell Bench Press", equipment: "Dumbbell", level: "Medium", category: "Gym" },
  { name: "Incline Dumbbell Press", equipment: "Dumbbell", level: "Medium", category: "Gym" },
  { name: "Decline Dumbbell Press", equipment: "Dumbbell", level: "Medium", category: "Gym" },
  { name: "Dumbbell Fly", equipment: "Dumbbell", level: "Easy", category: "Gym" },
  { name: "Cable Fly (Mid)", equipment: "Cable", level: "Easy", category: "Gym" },
  { name: "Cable Fly (Low to High)", equipment: "Cable", level: "Medium", category: "Gym" },
  { name: "Cable Fly (High to Low)", equipment: "Cable", level: "Medium", category: "Gym" },
  { name: "Cable Crossover", equipment: "Cable", level: "Medium", category: "Gym" },
  { name: "Machine Chest Press", equipment: "Machine", level: "Medium", category: "Gym" },
  { name: "Pec Deck Machine", equipment: "Machine", level: "Easy", category: "Gym" },
  { name: "Smith Machine Bench Press", equipment: "Machine", level: "Hard", category: "Gym" },
  { name: "Landmine Press", equipment: "Barbell", level: "Medium", category: "Gym" },
  { name: "Svend Press", equipment: "Dumbbell", level: "Easy", category: "Gym" },
  { name: "Dumbbell Pullover", equipment: "Dumbbell", level: "Medium", category: "Gym" },
  { name: "Weighted Dip", equipment: "Dip Belt", level: "Hard", category: "Gym" },
  { name: "Machine Fly", equipment: "Machine", level: "Easy", category: "Gym" },
  { name: "Iso-Lateral Chest Press", equipment: "Machine", level: "Medium", category: "Gym" },
  { name: "Resistance Band Chest Press", equipment: "Resistance Band", level: "Easy", category: "Gym" },
  { name: "Cable Iron Cross", equipment: "Cable", level: "Medium", category: "Gym" },
  { name: "Push Up", equipment: "Bodyweight", level: "Easy", category: "Bodyweight" },
  { name: "Wide Push Up", equipment: "Bodyweight", level: "Easy", category: "Bodyweight" },
  { name: "Diamond Push Up", equipment: "Bodyweight", level: "Medium", category: "Bodyweight" },
  { name: "Decline Push Up", equipment: "Bodyweight", level: "Medium", category: "Bodyweight" },
  { name: "Incline Push Up", equipment: "Bodyweight", level: "Easy", category: "Bodyweight" },
  { name: "Archer Push Up", equipment: "Bodyweight", level: "Hard", category: "Bodyweight" },
  { name: "Plyo Push Up", equipment: "Bodyweight", level: "Hard", category: "Bodyweight" },
  { name: "Clap Push Up", equipment: "Bodyweight", level: "Hard", category: "Bodyweight" },
  { name: "Pseudo Planche Push Up", equipment: "Bodyweight", level: "Hard", category: "Bodyweight" },
]

const BACK_SEEDS: ExerciseSeed[] = [
  { name: "Barbell Row", equipment: "Barbell", level: "Hard", category: "Gym" },
  { name: "Pendlay Row", equipment: "Barbell", level: "Hard", category: "Gym" },
  { name: "T-Bar Row", equipment: "Barbell", level: "Medium", category: "Gym" },
  { name: "Seated Cable Row", equipment: "Cable", level: "Medium", category: "Gym" },
  { name: "Lat Pulldown", equipment: "Cable", level: "Medium", category: "Gym" },
  { name: "Close-Grip Lat Pulldown", equipment: "Cable", level: "Medium", category: "Gym" },
  { name: "Straight-Arm Pulldown", equipment: "Cable", level: "Easy", category: "Gym" },
  { name: "Single-Arm Dumbbell Row", equipment: "Dumbbell", level: "Medium", category: "Gym" },
  { name: "Chest-Supported Row", equipment: "Dumbbell", level: "Medium", category: "Gym" },
  { name: "Deadlift", equipment: "Barbell", level: "Hard", category: "Gym" },
  { name: "Rack Pull", equipment: "Barbell", level: "Hard", category: "Gym" },
  { name: "Trap Bar Deadlift", equipment: "Barbell", level: "Hard", category: "Gym" },
  { name: "Sumo Deadlift", equipment: "Barbell", level: "Hard", category: "Gym" },
  { name: "Machine Row", equipment: "Machine", level: "Medium", category: "Gym" },
  { name: "Reverse Fly (Cable)", equipment: "Cable", level: "Easy", category: "Gym" },
  { name: "Reverse Fly (Dumbbell)", equipment: "Dumbbell", level: "Easy", category: "Gym" },
  { name: "Meadows Row", equipment: "Barbell", level: "Medium", category: "Gym" },
  { name: "Seal Row", equipment: "Barbell", level: "Medium", category: "Gym" },
  { name: "Cable Pullover", equipment: "Cable", level: "Easy", category: "Gym" },
  { name: "Good Morning", equipment: "Barbell", level: "Medium", category: "Gym" },
  { name: "Banded Row", equipment: "Resistance Band", level: "Easy", category: "Gym" },
  { name: "Suspension Trainer Row", equipment: "TRX", level: "Medium", category: "Gym" },
  { name: "Pull Up", equipment: "Bodyweight", level: "Hard", category: "Bodyweight" },
  { name: "Chin Up", equipment: "Bodyweight", level: "Hard", category: "Bodyweight" },
  { name: "Wide-Grip Pull Up", equipment: "Bodyweight", level: "Hard", category: "Bodyweight" },
  { name: "Australian Row", equipment: "Bodyweight", level: "Medium", category: "Bodyweight" },
  { name: "Superman", equipment: "Bodyweight", level: "Easy", category: "Bodyweight" },
  { name: "Inverted Row", equipment: "Bodyweight", level: "Medium", category: "Bodyweight" },
  { name: "Scapular Pull Up", equipment: "Bodyweight", level: "Medium", category: "Bodyweight" },
  { name: "Towel Row", equipment: "Bodyweight", level: "Medium", category: "Bodyweight" },
]

const LEGS_SEEDS: ExerciseSeed[] = [
  { name: "Back Squat", equipment: "Barbell", level: "Hard", category: "Gym" },
  { name: "Front Squat", equipment: "Barbell", level: "Hard", category: "Gym" },
  { name: "Hack Squat", equipment: "Machine", level: "Hard", category: "Gym" },
  { name: "Leg Press", equipment: "Machine", level: "Medium", category: "Gym" },
  { name: "Leg Extension", equipment: "Machine", level: "Easy", category: "Gym" },
  { name: "Leg Curl (Lying)", equipment: "Machine", level: "Easy", category: "Gym" },
  { name: "Leg Curl (Seated)", equipment: "Machine", level: "Easy", category: "Gym" },
  { name: "Romanian Deadlift", equipment: "Barbell", level: "Hard", category: "Gym" },
  { name: "Stiff-Leg Deadlift", equipment: "Barbell", level: "Hard", category: "Gym" },
  { name: "Bulgarian Split Squat", equipment: "Dumbbell", level: "Hard", category: "Gym" },
  { name: "Walking Lunge (Dumbbell)", equipment: "Dumbbell", level: "Medium", category: "Gym" },
  { name: "Goblet Squat", equipment: "Kettlebell", level: "Medium", category: "Gym" },
  { name: "Hip Thrust (Barbell)", equipment: "Barbell", level: "Medium", category: "Gym" },
  { name: "Glute Bridge (Barbell)", equipment: "Barbell", level: "Easy", category: "Gym" },
  { name: "Calf Raise (Machine)", equipment: "Machine", level: "Easy", category: "Gym" },
  { name: "Seated Calf Raise", equipment: "Machine", level: "Easy", category: "Gym" },
  { name: "Smith Machine Squat", equipment: "Machine", level: "Medium", category: "Gym" },
  { name: "Cable Kickback", equipment: "Cable", level: "Easy", category: "Gym" },
  { name: "Zercher Squat", equipment: "Barbell", level: "Hard", category: "Gym" },
  { name: "Box Squat", equipment: "Barbell", level: "Medium", category: "Gym" },
  { name: "Adductor Machine", equipment: "Machine", level: "Easy", category: "Gym" },
  { name: "Abductor Machine", equipment: "Machine", level: "Easy", category: "Gym" },
  { name: "Glute Kickback Machine", equipment: "Machine", level: "Easy", category: "Gym" },
  { name: "Standing Calf Raise", equipment: "Machine", level: "Easy", category: "Gym" },
  { name: "Kettlebell Sumo Squat", equipment: "Kettlebell", level: "Medium", category: "Gym" },
  { name: "Banded Squat", equipment: "Resistance Band", level: "Easy", category: "Gym" },
  { name: "Bodyweight Squat", equipment: "Bodyweight", level: "Easy", category: "Bodyweight" },
  { name: "Lunge", equipment: "Bodyweight", level: "Easy", category: "Bodyweight" },
  { name: "Jump Squat", equipment: "Bodyweight", level: "Medium", category: "Bodyweight" },
  { name: "Wall Sit", equipment: "Bodyweight", level: "Easy", category: "Bodyweight", repUnit: "sec" },
  { name: "Single-Leg Glute Bridge", equipment: "Bodyweight", level: "Medium", category: "Bodyweight" },
  { name: "Pistol Squat", equipment: "Bodyweight", level: "Hard", category: "Bodyweight" },
  { name: "Step Up", equipment: "Bodyweight", level: "Medium", category: "Bodyweight" },
  { name: "Curtsy Lunge", equipment: "Bodyweight", level: "Medium", category: "Bodyweight" },
  { name: "Broad Jump", equipment: "Bodyweight", level: "Hard", category: "Bodyweight" },
  { name: "Skater Hop", equipment: "Bodyweight", level: "Medium", category: "Bodyweight" },
  { name: "Sissy Squat", equipment: "Bodyweight", level: "Hard", category: "Bodyweight" },
]

const SHOULDER_SEEDS: ExerciseSeed[] = [
  { name: "Overhead Barbell Press", equipment: "Barbell", level: "Hard", category: "Gym" },
  { name: "Seated Dumbbell Press", equipment: "Dumbbell", level: "Medium", category: "Gym" },
  { name: "Arnold Press", equipment: "Dumbbell", level: "Medium", category: "Gym" },
  { name: "Lateral Raise (Dumbbell)", equipment: "Dumbbell", level: "Easy", category: "Gym" },
  { name: "Lateral Raise (Cable)", equipment: "Cable", level: "Easy", category: "Gym" },
  { name: "Front Raise", equipment: "Dumbbell", level: "Easy", category: "Gym" },
  { name: "Rear Delt Fly (Machine)", equipment: "Machine", level: "Easy", category: "Gym" },
  { name: "Upright Row", equipment: "Barbell", level: "Medium", category: "Gym" },
  { name: "Face Pull", equipment: "Cable", level: "Easy", category: "Gym" },
  { name: "Shrug (Barbell)", equipment: "Barbell", level: "Medium", category: "Gym" },
  { name: "Shrug (Dumbbell)", equipment: "Dumbbell", level: "Medium", category: "Gym" },
  { name: "Machine Shoulder Press", equipment: "Machine", level: "Medium", category: "Gym" },
  { name: "Cable Front Raise", equipment: "Cable", level: "Easy", category: "Gym" },
  { name: "Behind-the-Neck Press", equipment: "Barbell", level: "Hard", category: "Gym" },
  { name: "Scott Press", equipment: "Barbell", level: "Medium", category: "Gym" },
  { name: "Cuban Press", equipment: "Dumbbell", level: "Medium", category: "Gym" },
  { name: "Banded Lateral Raise", equipment: "Resistance Band", level: "Easy", category: "Gym" },
  { name: "Landmine Lateral Raise", equipment: "Barbell", level: "Medium", category: "Gym" },
  { name: "Pike Push Up", equipment: "Bodyweight", level: "Medium", category: "Bodyweight" },
  { name: "Wall Handstand Hold", equipment: "Bodyweight", level: "Hard", category: "Bodyweight", repUnit: "sec" },
  { name: "Handstand Push Up", equipment: "Bodyweight", level: "Hard", category: "Bodyweight" },
  { name: "Arm Circles", equipment: "Bodyweight", level: "Easy", category: "Bodyweight", repUnit: "sec" },
  { name: "Bear Crawl Shoulder Tap", equipment: "Bodyweight", level: "Medium", category: "Bodyweight" },
]

const ARM_SEEDS: ExerciseSeed[] = [
  { name: "Barbell Curl", equipment: "Barbell", level: "Medium", category: "Gym" },
  { name: "EZ-Bar Curl", equipment: "Barbell", level: "Medium", category: "Gym" },
  { name: "Dumbbell Curl", equipment: "Dumbbell", level: "Easy", category: "Gym" },
  { name: "Hammer Curl", equipment: "Dumbbell", level: "Easy", category: "Gym" },
  { name: "Cable Curl", equipment: "Cable", level: "Easy", category: "Gym" },
  { name: "Preacher Curl", equipment: "Barbell", level: "Medium", category: "Gym" },
  { name: "Concentration Curl", equipment: "Dumbbell", level: "Easy", category: "Gym" },
  { name: "Skull Crusher", equipment: "Barbell", level: "Medium", category: "Gym" },
  { name: "Tricep Pushdown", equipment: "Cable", level: "Easy", category: "Gym" },
  { name: "Overhead Tricep Extension", equipment: "Dumbbell", level: "Medium", category: "Gym" },
  { name: "Close-Grip Bench Press", equipment: "Barbell", level: "Hard", category: "Gym" },
  { name: "Cable Kickback (Tricep)", equipment: "Cable", level: "Easy", category: "Gym" },
  { name: "Reverse Curl", equipment: "Barbell", level: "Medium", category: "Gym" },
  { name: "Wrist Curl", equipment: "Barbell", level: "Easy", category: "Gym" },
  { name: "Spider Curl", equipment: "Dumbbell", level: "Medium", category: "Gym" },
  { name: "Zottman Curl", equipment: "Dumbbell", level: "Medium", category: "Gym" },
  { name: "Rope Pushdown", equipment: "Cable", level: "Easy", category: "Gym" },
  { name: "JM Press", equipment: "Barbell", level: "Hard", category: "Gym" },
  { name: "Drag Curl", equipment: "Barbell", level: "Medium", category: "Gym" },
  { name: "Banded Curl", equipment: "Resistance Band", level: "Easy", category: "Gym" },
  { name: "Cross-Body Hammer Curl", equipment: "Dumbbell", level: "Easy", category: "Gym" },
  { name: "Tricep Dip", equipment: "Bodyweight", level: "Medium", category: "Bodyweight" },
  { name: "Diamond Push Up (Triceps)", equipment: "Bodyweight", level: "Medium", category: "Bodyweight" },
  { name: "Chin-Up (Bicep Focus)", equipment: "Bodyweight", level: "Hard", category: "Bodyweight" },
  { name: "Bench Dip", equipment: "Bodyweight", level: "Easy", category: "Bodyweight" },
  {
    name: "Isometric Curl Hold",
    equipment: "Bodyweight",
    level: "Medium",
    category: "Bodyweight",
    repUnit: "sec",
  },
  { name: "Ring Dip", equipment: "Bodyweight", level: "Hard", category: "Bodyweight" },
  { name: "Table Row", equipment: "Bodyweight", level: "Easy", category: "Bodyweight" },
]

const CORE_SEEDS: ExerciseSeed[] = [
  { name: "Cable Woodchopper", equipment: "Cable", level: "Medium", category: "Gym" },
  { name: "Weighted Sit Up", equipment: "Weight Plate", level: "Medium", category: "Gym" },
  { name: "Cable Crunch", equipment: "Cable", level: "Medium", category: "Gym" },
  { name: "Landmine Rotation", equipment: "Barbell", level: "Medium", category: "Gym" },
  { name: "Ab Machine Crunch", equipment: "Machine", level: "Easy", category: "Gym" },
  { name: "Weighted Russian Twist", equipment: "Weight Plate", level: "Medium", category: "Gym" },
  { name: "Decline Weighted Crunch", equipment: "Weight Plate", level: "Hard", category: "Gym" },
  { name: "Pallof Press", equipment: "Cable", level: "Medium", category: "Gym" },
  { name: "Banded Woodchopper", equipment: "Resistance Band", level: "Medium", category: "Gym" },
  { name: "Ab Wheel Rollout", equipment: "Ab Wheel", level: "Hard", category: "Gym" },
  { name: "Stability Ball Crunch", equipment: "Stability Ball", level: "Easy", category: "Gym" },
  { name: "Suitcase Carry", equipment: "Dumbbell", level: "Medium", category: "Gym" },
  { name: "Plank", equipment: "Bodyweight", level: "Medium", category: "Bodyweight", repUnit: "sec" },
  { name: "Side Plank", equipment: "Bodyweight", level: "Medium", category: "Bodyweight", repUnit: "sec" },
  { name: "Crunch", equipment: "Bodyweight", level: "Easy", category: "Bodyweight" },
  { name: "Bicycle Crunch", equipment: "Bodyweight", level: "Medium", category: "Bodyweight" },
  { name: "Russian Twist", equipment: "Bodyweight", level: "Medium", category: "Bodyweight" },
  { name: "Hanging Leg Raise", equipment: "Bodyweight", level: "Hard", category: "Bodyweight" },
  { name: "Flutter Kicks", equipment: "Bodyweight", level: "Medium", category: "Bodyweight", repUnit: "sec" },
  {
    name: "Mountain Climbers (Core)",
    equipment: "Bodyweight",
    level: "Medium",
    category: "Bodyweight",
    repUnit: "sec",
  },
  { name: "V-Up", equipment: "Bodyweight", level: "Medium", category: "Bodyweight" },
  { name: "Leg Raise", equipment: "Bodyweight", level: "Medium", category: "Bodyweight" },
  { name: "Dead Bug", equipment: "Bodyweight", level: "Easy", category: "Bodyweight" },
  { name: "Hollow Hold", equipment: "Bodyweight", level: "Hard", category: "Bodyweight", repUnit: "sec" },
  { name: "Toe Touch", equipment: "Bodyweight", level: "Easy", category: "Bodyweight" },
  { name: "Plank Up-Down", equipment: "Bodyweight", level: "Medium", category: "Bodyweight" },
  { name: "Reverse Crunch", equipment: "Bodyweight", level: "Easy", category: "Bodyweight" },
  { name: "L-Sit", equipment: "Bodyweight", level: "Hard", category: "Bodyweight", repUnit: "sec" },
  { name: "Windshield Wipers", equipment: "Bodyweight", level: "Hard", category: "Bodyweight" },
]

const CARDIO_SEEDS: (ExerciseSeed & { icon: LucideIcon })[] = [
  { name: "Jump Rope", equipment: "Rope", level: "Medium", category: "Cardio", repUnit: "sec", icon: Zap },
  { name: "Burpees", equipment: "Bodyweight", level: "Hard", category: "Cardio", icon: Flame },
  { name: "Mountain Climbers", equipment: "Bodyweight", level: "Medium", category: "Cardio", repUnit: "sec", icon: Waves },
  { name: "Cycle Sprint", equipment: "Bike", level: "Hard", category: "Cardio", repUnit: "sec", icon: Bike },
  { name: "Rowing Machine", equipment: "Machine", level: "Hard", category: "Cardio", repUnit: "sec", icon: Waves },
  { name: "Treadmill Run", equipment: "Treadmill", level: "Medium", category: "Cardio", repUnit: "sec", icon: Footprints },
  { name: "Stair Climber", equipment: "Machine", level: "Medium", category: "Cardio", repUnit: "sec", icon: Gauge },
  { name: "Elliptical", equipment: "Machine", level: "Easy", category: "Cardio", repUnit: "sec", icon: Gauge },
  { name: "Jumping Jacks", equipment: "Bodyweight", level: "Easy", category: "Cardio", repUnit: "sec", icon: Activity },
  { name: "High Knees", equipment: "Bodyweight", level: "Medium", category: "Cardio", repUnit: "sec", icon: Footprints },
  { name: "Battle Ropes", equipment: "Rope", level: "Hard", category: "Cardio", repUnit: "sec", icon: Zap },
  { name: "Box Jumps", equipment: "Box", level: "Hard", category: "Cardio", icon: Zap },
  { name: "Sled Push", equipment: "Sled", level: "Hard", category: "Cardio", icon: Weight },
  { name: "Shadow Boxing", equipment: "Bodyweight", level: "Medium", category: "Cardio", repUnit: "sec", icon: Swords },
  { name: "Swimming", equipment: "Pool", level: "Medium", category: "Cardio", repUnit: "sec", icon: Waves },
  { name: "Assault Bike Sprint", equipment: "Bike", level: "Hard", category: "Cardio", repUnit: "sec", icon: Bike },
  { name: "Ski Erg", equipment: "Machine", level: "Hard", category: "Cardio", repUnit: "sec", icon: Waves },
  { name: "Farmer's Carry", equipment: "Dumbbell", level: "Medium", category: "Cardio", icon: Weight },
  { name: "Tuck Jumps", equipment: "Bodyweight", level: "Hard", category: "Cardio", icon: Zap },
  { name: "Kettlebell Swing", equipment: "Kettlebell", level: "Medium", category: "Cardio", icon: Dumbbell },
  { name: "Sprint Intervals", equipment: "Track", level: "Hard", category: "Cardio", repUnit: "sec", icon: Footprints },
  { name: "Battle Rope Slams", equipment: "Rope", level: "Hard", category: "Cardio", repUnit: "sec", icon: Zap },
  { name: "Uphill Sprint", equipment: "Track", level: "Hard", category: "Cardio", repUnit: "sec", icon: Footprints },
  {
    name: "Stationary Bike Steady State",
    equipment: "Bike",
    level: "Easy",
    category: "Cardio",
    repUnit: "sec",
    icon: Bike,
  },
  { name: "Speed Skaters", equipment: "Bodyweight", level: "Medium", category: "Cardio", icon: HeartPulse },
]

export const EXERCISES: Exercise[] = [
  ...buildGroup("Chest", CHEST_SEEDS, CHEST_ICONS),
  ...buildGroup("Back", BACK_SEEDS, BACK_ICONS),
  ...buildGroup("Legs", LEGS_SEEDS, LEGS_ICONS),
  ...buildGroup("Shoulders", SHOULDER_SEEDS, SHOULDER_ICONS),
  ...buildGroup("Arms", ARM_SEEDS, ARM_ICONS),
  ...buildGroup("Core", CORE_SEEDS, CORE_ICONS),
  ...CARDIO_SEEDS.map((s) => makeExercise("Cardio", s, s.icon)),
]

export interface QuickAddOption {
  id: string
  label: string
  hint: string
  icon: LucideIcon
  tone: "sage" | "brass"
}

export interface ProPlan {
  id: string
  name: string
  price: string
  period: string
  tagline: string
  features: string[]
  highlight?: boolean
  badge?: string
}

export const PRO_PLANS: ProPlan[] = [
  {
    id: "monthly",
    name: "Monthly",
    price: "$9",
    period: "/mo",
    tagline: "Flexible, cancel anytime",
    features: ["Personalized coaching", "Advanced insights", "Unlimited workouts"],
  },
  {
    id: "annual",
    name: "Annual",
    price: "$69",
    period: "/yr",
    tagline: "Best value — save 36%",
    features: ["Everything in Monthly", "Nutrition planner", "Priority support", "Recovery analytics"],
    highlight: true,
    badge: "Most popular",
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "$199",
    period: "once",
    tagline: "Pay once, keep forever",
    features: ["Everything in Annual", "All future features", "Founding member badge"],
  },
]

export const QUICK_ADD_OPTIONS: QuickAddOption[] = [
  { id: "water", label: "Water", hint: "Log a glass", icon: Droplet, tone: "sage" },
  { id: "workout", label: "Workout", hint: "Start a session", icon: Dumbbell, tone: "sage" },
  { id: "sleep", label: "Sleep", hint: "Add last night", icon: MoonStar, tone: "brass" },
  { id: "steps", label: "Steps", hint: "Sync activity", icon: Footprints, tone: "sage" },
]
