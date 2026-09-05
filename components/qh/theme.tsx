"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

type Mode = "light" | "dark"

interface ThemeContextValue {
  mode: Mode
  isDark: boolean
  toggle: () => void
  setMode: (m: Mode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function QhThemeProvider({ children, initial = "light" }: { children: ReactNode; initial?: Mode }) {
  const [mode, setMode] = useState<Mode>(initial)
  const toggle = useCallback(() => setMode((m) => (m === "light" ? "dark" : "light")), [])
  return (
    <ThemeContext.Provider value={{ mode, isDark: mode === "dark", toggle, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useQhTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useQhTheme must be used within QhThemeProvider")
  return ctx
}
