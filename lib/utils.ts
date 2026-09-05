import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* Weight unit conversion — canonical storage is always kilograms */
export function kgToLb(kg: number) {
  return Math.round(kg * 2.20462 * 10) / 10
}

export function lbToKg(lb: number) {
  return Math.round((lb / 2.20462) * 10) / 10
}
