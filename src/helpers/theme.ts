import { EventEmitter } from "events"
import { useEffect } from "react"

export type Theme = "light" | "dark"

const createThemeEventEmitter = () => {
  const eventEmitter = new EventEmitter()
  const eventName = "theme-changed"
  const on = handler => eventEmitter.on(eventName, handler)
  const off = handler => eventEmitter.off(eventName, handler)
  const emit = (theme: Theme) => eventEmitter.emit(eventName, theme)

  return {
    on,
    off,
    emit,
  }
}

export const themeEventEmitter = createThemeEventEmitter()

const mediaQuery = "(prefers-color-scheme: dark)"

const setTheme = (mediaQueryList: MediaQueryList | MediaQueryListEvent) => {
  const theme: Theme = mediaQueryList.matches ? "dark" : "light"
  document.querySelector("html").setAttribute("data-app-theme", theme)
  themeEventEmitter.emit(theme)
}

export const useTheme = () => {
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    setTheme(window.matchMedia(mediaQuery))
  }, [])

  useEffect(() => {
    window.matchMedia(mediaQuery).addEventListener("change", setTheme)
  }, [])

  return {
    setTheme,
  }
}
