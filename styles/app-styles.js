/**
 * Application UI styles
 * Consistent styling definitions for Intention-Ally components
 */

// Text styles for headings, body text, and UI elements
export const text = {
  heading1: "text-3xl font-bold text-white mb-2",
  heading2: "text-2xl font-bold text-white mb-2",
  heading3: "text-xl font-semibold text-white mb-1",
  heading4: "text-lg font-semibold text-white mb-1",
  bodyLarge: "text-lg text-gray-300",
  bodyNormal: "text-base text-gray-300",
  bodySmall: "text-sm text-gray-400",
  label: "text-sm font-medium text-gray-400",
  accent: "text-yellow-500",
  muted: "text-gray-500",
  error: "text-red-500"
};

// Container and layout styles
export const containers = {
  card: "bg-gray-800 rounded-lg p-6 shadow-md",
  cardCompact: "bg-gray-800 rounded-lg p-4",
  modal: "bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700",
  panel: "bg-gray-900 rounded-lg p-4",
  section: "mb-8",
  divider: "border-t border-gray-700 my-6",
  sidebar: "bg-gray-900 border-r border-gray-800"
};

// Grid and layout helpers
export const grid = {
  container: "max-w-screen-xl mx-auto",
  twoColumn: "grid grid-cols-1 md:grid-cols-2 gap-6",
  threeColumn: "grid grid-cols-1 md:grid-cols-3 gap-6",
  fourColumn: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
};

// Buttons and interactive elements
export const buttons = {
  primary: "bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md transition-colors duration-200",
  secondary: "bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200",
  tertiary: "text-yellow-500 hover:text-yellow-400 font-medium",
  danger: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200",
  icon: "p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition-colors",
  iconActive: "p-2 text-yellow-500 rounded-full bg-gray-700",
  small: "text-sm px-3 py-1 rounded",
  large: "text-lg px-6 py-3 rounded-md",
  disabled: "opacity-50 cursor-not-allowed"
};

// Form elements
export const forms = {
  input: "bg-gray-800 border border-gray-700 text-white rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all",
  select: "bg-gray-800 border border-gray-700 text-white rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none",
  checkbox: "h-4 w-4 text-yellow-500 border-gray-600 rounded focus:ring-yellow-500 focus:ring-offset-gray-900",
  label: "block text-sm font-medium text-gray-400 mb-1",
  error: "mt-1 text-sm text-red-500",
  formGroup: "mb-4"
};

// Animation and transition helpers
export const animations = {
  fadeIn: "animate-fadeIn",
  slideIn: "animate-slideIn",
  pulse: "animate-pulse",
  spin: "animate-spin"
};

// Responsive helpers
export const responsive = {
  hideOnMobile: "hidden md:block",
  hideOnDesktop: "md:hidden",
  showOnlyOnSmall: "sm:hidden",
  showOnlyOnLarge: "hidden lg:block"
};

// Compile all styles into a single object
export const styles = {
  text,
  containers,
  grid,
  buttons,
  forms,
  animations,
  responsive
};

/**
 * Utility to combine multiple style classes
 * @param  {...string} classes - CSS classes to combine
 * @returns {string} - Combined class string
 */
export const combineStyles = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export default styles;