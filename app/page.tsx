"use client"

import { Moon, Sun } from "lucide-react"
import { QhThemeProvider, useQhTheme } from "@/components/qh/theme"
import { PhoneShell } from "@/components/qh/phone-shell"

function DesktopFrame() {
  const { isDark, toggle } = useQhTheme()
  return (
    <div
      className="flex min-h-dvh w-full flex-col items-center justify-center gap-8 py-10 transition-colors duration-500"
      style={{ background: isDark ? "#0d0c0a" : "#e8e5dd" }}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <p
          className="text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: isDark ? "#8FA085" : "#4A5645" }}
        >
          Qandil Health
        </p>
        <p className="text-sm" style={{ color: isDark ? "#9B978E" : "#8A8680" }}>
          iOS &amp; Android prototype
        </p>
      </div>

      <PhoneShell />

      <button
        onClick={toggle}
        className="flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-transform active:scale-95"
        style={{
          borderColor: isDark ? "#332F28" : "#E4E0D8",
          background: isDark ? "#211F1B" : "#ffffff",
          color: isDark ? "#F7F5F0" : "#1A1A18",
        }}
      >
        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        {isDark ? "Light mode" : "Dark mode"}
      </button>
    </div>
  )
}

export default function Page() {
  return (
    <QhThemeProvider initial="light">
      <DesktopFrame />
    </QhThemeProvider>
  )
}
