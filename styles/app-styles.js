/**
 * Application UI styles
 * Consistent styling definitions for Intention-Ally components
 */

export const styles = {
  // Container and card styles
  card: {
    base: "bg-[#111827] rounded-xl shadow-md overflow-hidden",
    header: "bg-[#1F2937] px-6 py-4 border-b border-[#374151]",
    body: "px-6 py-4",
    footer: "bg-[#1F2937] px-6 py-4 border-t border-[#374151]",
  },
  
  // Text styles
  text: {
    heading1: "text-3xl font-bold text-[#F9FAFB]",
    heading2: "text-2xl font-bold text-[#F9FAFB]",
    heading3: "text-xl font-semibold text-[#F9FAFB]",
    paragraph: "text-[#D1D5DB]",
    muted: "text-[#9CA3AF]",
    highlight: "text-[#EAB308]",
  },
  
  // Button styles
  button: {
    primary: "px-4 py-2 bg-[#EAB308] text-black font-medium rounded-md hover:bg-[#CA8A04] transition-colors flex items-center",
    secondary: "px-4 py-2 bg-[#1F2937] text-[#F9FAFB] font-medium rounded-md hover:bg-[#374151] transition-colors flex items-center",
    outline: "px-4 py-2 border border-[#374151] text-[#F9FAFB] font-medium rounded-md hover:bg-[#1F2937] transition-colors flex items-center",
    icon: "p-2 text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1F2937] rounded-md transition-colors",
  },
  
  // Input styles
  input: {
    default: "bg-[#1F2937] border border-[#374151] rounded-md text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#EAB308] focus:border-transparent",
    search: "pl-10 pr-4 py-2 w-full",
  },
  
  // Badge/tag styles
  badge: {
    default: "px-2 py-1 rounded-md text-xs font-medium",
    primary: "bg-[#EAB308] bg-opacity-20 text-[#EAB308]",
    secondary: "bg-[#374151] text-[#D1D5DB]",
    colored: "bg-[#374151] text-[#D1D5DB]",
  },
  
  // Layout utilities
  grid: {
    twoColumn: "grid grid-cols-1 md:grid-cols-2 gap-6",
    threeColumn: "grid grid-cols-1 md:grid-cols-3 gap-6",
  },
  
  // Utility styles
  utils: {
    flexCenter: "flex items-center",
    flexBetween: "flex items-center justify-between",
    flexColumn: "flex flex-col",
    roundedFull: "rounded-full",
    shadow: "shadow-md",
  }
};

/**
 * Utility to combine multiple style classes
 * @param  {...string} classes - CSS classes to combine
 * @returns {string} - Combined class string
 */
export const combineStyles = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export default styles;