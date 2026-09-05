"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Search, Sun, Bell, Crown, ChevronRight, User, LogOut, Scale } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, IconBadge, Toggle, SegmentedControl } from "./ui-bits"
import { useQhTheme } from "./theme"
import { useApp } from "./app-store"
import { ProPlansModal } from "./pro-plans-modal"

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 320, damping: 30 } },
}

export function SettingsScreen() {
  const { isDark, setMode } = useQhTheme()
  const { signedIn, userName, notifications, setNotifications, toggleSignIn, weightUnit, setWeightUnit } = useApp()
  const [plansOpen, setPlansOpen] = useState(false)

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4 px-5 pb-40">
      <motion.header variants={item} className="pt-2">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--qh-ink)]">Settings</h1>
      </motion.header>

      {/* Search */}
      <motion.div
        variants={item}
        className="flex items-center gap-2 rounded-full bg-[var(--qh-surface-alt)] p-1.5 pl-4"
      >
        <Search className="size-4 text-[var(--qh-text-2)]" />
        <input
          placeholder="Search settings"
          className="min-w-0 flex-1 bg-transparent text-sm text-[var(--qh-ink)] outline-none placeholder:text-[var(--qh-text-2)]"
        />
      </motion.div>

      {/* Account */}
      <motion.div variants={item}>
        <Card className="flex items-center gap-4 p-4">
          <span className="flex size-14 items-center justify-center rounded-full bg-[var(--qh-surface-alt)] text-[var(--qh-text-2)]">
            <User className="size-7" />
          </span>
          <div className="flex-1">
            <p className="text-base font-semibold text-[var(--qh-ink)]">{signedIn ? userName : "Guest"}</p>
            <p className="text-xs font-medium text-[var(--qh-text-2)]">
              {signedIn ? "Synced to your account" : "Sign in to sync your data"}
            </p>
          </div>
          <button
            onClick={toggleSignIn}
            aria-pressed={signedIn}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-transform active:scale-95",
              signedIn
                ? "border border-[var(--qh-border)] text-[var(--qh-ink)]"
                : "bg-[var(--qh-sage)] text-[var(--qh-surface)]",
            )}
          >
            {signedIn && <LogOut className="size-3.5" />}
            {signedIn ? "Sign out" : "Sign in"}
          </button>
        </Card>
      </motion.div>

      {/* Preferences */}
      <motion.div variants={item}>
        <Card className="divide-y divide-[var(--qh-border)]">
          <div className="flex items-center gap-3 p-4">
            <IconBadge tone="plain">
              <Sun className="size-5" />
            </IconBadge>
            <span className="flex-1 text-sm font-semibold text-[var(--qh-ink)]">Dark / Light mode</span>
            <Toggle checked={isDark} onChange={(v) => setMode(v ? "dark" : "light")} label="Dark mode" />
          </div>
          <div className="flex items-center gap-3 p-4">
            <IconBadge tone="plain">
              <Bell className="size-5" />
            </IconBadge>
            <span className="flex-1 text-sm font-semibold text-[var(--qh-ink)]">Notifications</span>
            <Toggle checked={notifications} onChange={setNotifications} label="Notifications" />
          </div>
          <div className="flex items-center gap-3 p-4">
            <IconBadge tone="plain">
              <Scale className="size-5" />
            </IconBadge>
            <span className="flex-1 text-sm font-semibold text-[var(--qh-ink)]">Weight unit</span>
            <SegmentedControl
              value={weightUnit}
              onChange={setWeightUnit}
              className="w-28"
              options={[
                { value: "kg", label: "kg" },
                { value: "lb", label: "lb" },
              ]}
            />
          </div>
        </Card>
      </motion.div>

      {/* Pro plan */}
      <motion.div variants={item}>
        <Card className="overflow-hidden border-[var(--qh-brass)]/40 p-5">
          <div
            className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full"
            style={{ background: "radial-gradient(circle, var(--qh-brass-soft), transparent 70%)" }}
          />
          <button onClick={() => setPlansOpen(true)} className="relative flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <IconBadge tone="brass">
                <Crown className="size-5" />
              </IconBadge>
              <div className="text-left">
                <p className="text-lg font-bold tracking-tight text-[var(--qh-ink)]">PRO PLAN</p>
                <p className="text-xs font-medium text-[var(--qh-text-2)]">3 plans from $9/mo</p>
              </div>
            </div>
            <ChevronRight className="size-5 text-[var(--qh-brass)]" />
          </button>
          <button
            onClick={() => setPlansOpen(true)}
            className="relative mt-4 w-full rounded-2xl bg-[var(--qh-brass)] py-3 text-sm font-semibold text-[var(--qh-surface)] transition-transform active:scale-95"
          >
            View plans
          </button>
        </Card>
      </motion.div>

      <ProPlansModal open={plansOpen} onClose={() => setPlansOpen(false)} />
    </motion.div>
  )
}
