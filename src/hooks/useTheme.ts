import { useEffect, useState } from "react"

const themeMediaQuery = "(prefers-color-scheme: dark)"

export const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  const handleThemeChange = (
    mediaQueryList: MediaQueryList | MediaQueryListEvent = window.matchMedia(
      themeMediaQuery
    )
  ) => {
    const nextTheme = mediaQueryList.matches ? "dark" : "light"

    setTheme(nextTheme)

    document.querySelector("html").setAttribute("data-app-theme", nextTheme)
  }

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    handleThemeChange()
  }, [])

  useEffect(() => {
    window
      .matchMedia(themeMediaQuery)
      .addEventListener("change", handleThemeChange)

    return () => {
      window
        .matchMedia(themeMediaQuery)
        .removeEventListener("change", handleThemeChange)
    }
  }, [])

  return {
    theme,
  }
}
