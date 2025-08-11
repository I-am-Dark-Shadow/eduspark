import { useEffect } from 'react';
import useThemeStore from '../store/themeStore';

export const useTheme = () => {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';
    
    root.classList.toggle('dark', isDark);
    root.classList.toggle('light', !isDark);

  }, [theme]);

  // THIS IS THE FIX: Return an array instead of an object
  return [theme, toggleTheme];
};