"use client"

import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"
import { useQhTheme } from "./theme"
import { QhAppProvider, useApp } from "./app-store"
import { StatusBar, HomeIndicator } from "./status-bar"
import { BottomNav } from "./bottom-nav"
import { QuickAddModal } from "./quick-add-modal"
import { HomeScreen } from "./home-screen"
import { WorkoutScreen } from "./workout-screen"
import { SettingsScreen } from "./settings-screen"
import { ToastStack } from "./toast-stack"
import { ExerciseConfigSheet } from "./exercise-config-sheet"
import { WorkoutBuilderSheet } from "./workout-builder-sheet"
import type { TabId } from "@/lib/qh-data"

const screens: Record<Exclude<TabId, "add">, React.ComponentType> = {
  home: HomeScreen,
  workout: WorkoutScreen,
  settings: SettingsScreen,
}

function PhoneShellInner() {
  const { isDark } = useQhTheme()
  const { tab, setTab, quickAddOpen, openQuickAdd, closeQuickAdd } = useApp()
  const Screen = screens[tab]

  return (
    <div
      className={cn(
        "qh-scope relative flex h-[925px] w-[430px] max-w-full flex-col overflow-hidden rounded-[55px] border-[10px] border-neutral-900 bg-[var(--qh-bg)]",
        "shadow-[0_50px_120px_-30px_rgba(0,0,0,0.6)]",
        isDark && "qh-dark",
      )}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <StatusBar />

      <main className="qh-no-scrollbar relative flex-1 overflow-y-auto pt-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <Screen />
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav active={tab} onSelect={(id) => id !== "add" && setTab(id)} onQuickAdd={openQuickAdd} />
      <QuickAddModal open={quickAddOpen} onClose={closeQuickAdd} />
      <ExerciseConfigSheet />
      <WorkoutBuilderSheet />
      <ToastStack />
      <HomeIndicator />
    </div>
  )
}

export function PhoneShell() {
  return (
    <QhAppProvider>
      <PhoneShellInner />
    </QhAppProvider>
  )
}
