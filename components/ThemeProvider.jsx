import React, { createContext, useContext, useState } from 'react';

// Create context for theming
const ThemeContext = createContext({
  mode: 'dark', // 'dark' or 'light'
  toggleMode: () => {},
  accent: 'yellow', // 'yellow' (default), 'blue', 'green'
  setAccent: () => {},
});

/**
 * ThemeProvider component for managing theme settings
 */
const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('dark');
  const [accent, setAccent] = useState('yellow');
  
  const toggleMode = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };
  
  const changeAccent = (newAccent) => {
    setAccent(newAccent);
  };
  
  const value = {
    mode,
    toggleMode,
    accent,
    setAccent: changeAccent,
  };
  
  // Apply theme classes to document body
  React.useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${mode}`);
    
    document.body.classList.remove('accent-yellow', 'accent-blue', 'accent-green');
    document.body.classList.add(`accent-${accent}`);
  }, [mode, accent]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;