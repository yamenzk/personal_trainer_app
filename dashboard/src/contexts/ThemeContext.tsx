// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // First try to get theme from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme') as Theme;
      if (stored) return stored;
    }
    return 'light';
  });

  // Effect for system theme detection and changes
  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      // Create media query for dark mode
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Function to handle system theme changes
      const handleSystemThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
        const systemTheme = e.matches ? 'dark' : 'light';
        
        // Only update if no user preference is stored
        if (!localStorage.getItem('theme')) {
          setTheme(systemTheme);
        }
      };

      // Initial check
      handleSystemThemeChange(darkModeMediaQuery);

      // Listen for system theme changes
      darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);

      return () => {
        darkModeMediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    }
  }, []);

  // Effect for applying theme
  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';

    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(theme);

    // Only store in localStorage if user explicitly changes theme
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Store user preference
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};