/**
 * Application UI styles
 * Consistent styling definitions for Intention-Ally components
 */

export const styles = {
  // Card components
  card: {
    base: "bg-[#111827] rounded-xl shadow-md overflow-hidden",
    header: "px-6 py-4 border-b border-[#374151]",
    body: "p-6 text-[#F9FAFB]",
    footer: "px-6 py-4 border-t border-[#374151] bg-[#1F2937]"
  },
  
  // Text styles
  text: {
    heading1: "text-3xl font-bold text-[#F9FAFB]",
    heading2: "text-2xl font-bold text-[#F9FAFB]",
    heading3: "text-xl font-semibold text-[#F9FAFB]",
    paragraph: "text-[#D1D5DB]",
    muted: "text-[#9CA3AF]"
  },
  
  // Button styles
  button: {
    primary: "bg-[#EAB308] hover:bg-[#CA8A04] text-black font-medium px-4 py-2 rounded-md transition-colors flex items-center justify-center",
    secondary: "bg-[#4B5563] hover:bg-[#6B7280] text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center justify-center",
    outline: "border border-[#4B5563] hover:border-[#9CA3AF] text-[#D1D5DB] hover:text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center",
    icon: "text-[#9CA3AF] hover:text-[#F9FAFB] p-2 rounded-md hover:bg-[#374151] transition-colors",
    danger: "bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center justify-center"
  },
  
  // Input styles
  input: {
    default: "bg-[#1F2937] border border-[#374151] focus:border-[#EAB308] text-[#F9FAFB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#EAB308] transition-colors",
    search: "bg-[#1F2937] border border-[#374151] focus:border-[#EAB308] text-[#F9FAFB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#EAB308] pl-10 pr-4 py-2 transition-colors"
  },
  
  // Badge styles
  badge: {
    default: "px-2 py-1 rounded-md text-xs font-medium",
    colored: "bg-[#1F2937] text-[#D1D5DB] px-2 py-1 rounded-md text-xs font-medium",
    tag: "bg-[#374151] text-[#D1D5DB] px-2 py-1 rounded-md text-xs font-medium"
  },
  
  // Layout utilities
  grid: {
    twoColumn: "grid grid-cols-1 md:grid-cols-2 gap-6",
    threeColumn: "grid grid-cols-1 md:grid-cols-3 gap-6",
    fourColumn: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
  },
  
  // Utility classes
  utils: {
    flexCenter: "flex items-center",
    flexBetween: "flex justify-between items-center",
    flexColumn: "flex flex-col",
    transition: "transition-all duration-300 ease-in-out"
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