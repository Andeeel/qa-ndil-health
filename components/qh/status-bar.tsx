"use client"

import { Signal, Wifi, BatteryFull } from "lucide-react"

export function StatusBar() {
  return (
    <div className="relative z-30 flex items-center justify-between px-8 pt-3 text-[13px] font-semibold text-[var(--qh-ink)]">
      <span className="tabular-nums">9:41</span>
      {/* Dynamic Island */}
      <div className="absolute left-1/2 top-2 h-7 w-[104px] -translate-x-1/2 rounded-full bg-black" />
      <div className="flex items-center gap-1.5">
        <Signal className="size-4" strokeWidth={2.4} />
        <Wifi className="size-4" strokeWidth={2.4} />
        <BatteryFull className="size-5" strokeWidth={2} />
      </div>
    </div>
  )
}

export function HomeIndicator() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center pb-2">
      <div className="h-1.5 w-32 rounded-full bg-[var(--qh-ink)] opacity-70" />
    </div>
  )
}
