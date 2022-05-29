import { createContext, FC } from "react"

interface ThemeContext {
  theme: "light" | "dark"
}

const themeContext = createContext<ThemeContext>({
  theme: "light",
})

export const ThemeProvider: FC = ({ children }) => {
  const contextValue: ThemeContext = {
    theme: "light",
  }
  return (
    <themeContext.Provider value={contextValue}>
      {children}
    </themeContext.Provider>
  )
}
