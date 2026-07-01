"use client"

import { useSyncExternalStore } from "react"

export type Language = "id" | "en"
export type Theme = "light" | "dark" | "system"

const eventName = "tuneboss-preferences"

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback)
  window.addEventListener(eventName, callback)
  return () => {
    window.removeEventListener("storage", callback)
    window.removeEventListener(eventName, callback)
  }
}

function emit() {
  window.dispatchEvent(new Event(eventName))
}

function getLanguage(): Language {
  if (typeof window === "undefined") return "id"
  return localStorage.getItem("tuneboss-language") === "en" ? "en" : "id"
}

function getTheme(): Theme {
  if (typeof window === "undefined") return "system"
  const saved = localStorage.getItem("tuneboss-theme")
  return saved === "light" || saved === "dark" ? saved : "system"
}

export function useStoredLanguage() {
  return useSyncExternalStore(subscribe, getLanguage, () => "id")
}

export function setStoredLanguage(value: Language) {
  if (typeof window === "undefined") return
  localStorage.setItem("tuneboss-language", value)
  document.documentElement.lang = value
  emit()
}

export function useStoredTheme() {
  return useSyncExternalStore(subscribe, getTheme, () => "system")
}

export function setStoredTheme(value: Theme) {
  if (typeof window === "undefined") return
  localStorage.setItem("tuneboss-theme", value)
  emit()
}

export function applyTheme(theme: Theme) {
  if (typeof window === "undefined") return
  const dark = theme === "dark" ||
    (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList.toggle("dark", dark)
}
