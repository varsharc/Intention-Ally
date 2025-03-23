// App-wide CSS classes using JS objects
// This approach allows us to use consistent styling without relying on Tailwind's class system
// which is having compatibility issues with the current setup

export const styles = {
  // Layout styles
  layout: {
    page: 'min-h-screen bg-[#111111] text-[#F9FAFB]',
    container: 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    section: 'py-6',
  },
  
  // Text styles
  text: {
    heading1: 'text-3xl font-bold text-[#F9FAFB]',
    heading2: 'text-2xl font-bold text-[#F9FAFB]',
    heading3: 'text-xl font-bold text-[#F9FAFB]',
    paragraph: 'text-base text-[#F9FAFB]',
    muted: 'text-sm text-[#9CA3AF]',
  },
  
  // Button styles
  button: {
    primary: 'px-4 py-2 bg-[#EAB308] hover:bg-[#CA8A04] text-black font-medium rounded transition-colors',
    secondary: 'px-4 py-2 bg-[#374151] hover:bg-[#4B5563] text-white font-medium rounded transition-colors',
    outline: 'px-4 py-2 border border-[#EAB308] text-[#EAB308] hover:bg-[#EAB308] hover:bg-opacity-10 font-medium rounded transition-colors',
  },
  
  // Card styles
  card: {
    base: 'bg-[#1F2937] border border-[#374151] rounded-lg shadow-md overflow-hidden',
    header: 'px-4 py-3 bg-[#111111] border-b border-[#374151]',
    body: 'p-4',
    footer: 'px-4 py-3 bg-[#111111] border-t border-[#374151]',
  },
  
  // Form styles
  form: {
    input: 'w-full px-3 py-2 bg-[#374151] border border-[#4B5563] rounded text-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#EAB308] focus:border-[#EAB308]',
    label: 'block text-sm font-medium text-[#D1D5DB] mb-1',
    select: 'w-full px-3 py-2 bg-[#374151] border border-[#4B5563] rounded text-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#EAB308] focus:border-[#EAB308]',
  },
  
  // Badge/Tag styles
  badge: {
    default: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    yellow: 'bg-[#EAB308] bg-opacity-20 text-[#EAB308]',
    gray: 'bg-[#4B5563] bg-opacity-20 text-[#9CA3AF]',
  },
  
  // Grid and flex layouts
  grid: {
    twoColumn: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
    threeColumn: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  },
  
  // Additional utility styles
  utils: {
    flexCenter: 'flex items-center justify-center',
    flexBetween: 'flex items-center justify-between',
    flexStart: 'flex items-center justify-start',
    flexEnd: 'flex items-center justify-end',
    flexCol: 'flex flex-col',
    flexRow: 'flex flex-row',
    shadow: 'shadow-lg',
    rounded: 'rounded-lg',
    roundedFull: 'rounded-full',
    transition: 'transition-all duration-150 ease-in-out',
  },
  
  // Sidebar and navigation
  nav: {
    sidebar: 'fixed inset-y-0 right-0 w-64 bg-[#111111] border-l border-[#374151] z-50 transform transition-transform',
    sidebarOpen: 'translate-x-0',
    sidebarClosed: 'translate-x-full',
    backdrop: 'fixed inset-0 bg-black bg-opacity-50 z-40',
  }
};

// Helper function to combine style strings
export const combineStyles = (...classes) => {
  return classes.filter(Boolean).join(' ');
};