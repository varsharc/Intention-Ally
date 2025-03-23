import React from 'react';

/**
 * ThemeProvider component
 * Provides theme context and styling for consistent UI appearance
 */
export const ThemeProvider = ({ children }) => {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Global theme styles */}
      <style jsx global>{`
        :root {
          --color-primary: #EAB308;
          --color-primary-dark: #CA8A04;
          --color-primary-light: #FDE68A;
          --color-bg-black: #000000;
          --color-bg-dark: #111827;
          --color-bg-card: #1F2937;
          --color-bg-accent: #374151;
          --color-text-white: #F9FAFB;
          --color-text-light: #D1D5DB;
          --color-text-muted: #9CA3AF;
          --color-border: #374151;
        }
        
        /* Custom scrollbar for the theme */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: var(--color-bg-dark);
        }
        
        ::-webkit-scrollbar-thumb {
          background: var(--color-bg-accent);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: var(--color-primary);
        }
        
        /* Focus styles */
        *:focus {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }
        
        /* Selection style */
        ::selection {
          background: var(--color-primary);
          color: black;
        }
      `}</style>
      
      {children}
    </div>
  );
};

export default ThemeProvider;