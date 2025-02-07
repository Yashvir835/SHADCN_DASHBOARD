import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* lib/utils.ts - Utility functions */

/**
 * Returns the list of pages with their metadata
 * @returns {Array} List of page objects
 */
export const getPages = () => [
  { name: 'Home', href: '/landingPage' },
  { name: 'Overview', href: '/landingPage/overView' },
  { name: 'Our Mission', href: '/landingPage/Mission' },
  { name: 'Products', href: '/landingPage/products' },
  { name: 'Contact', href: '/landingPage/contact' },
];


/**
 * Gets current page index based on pathname
 * @returns {number} Current page index
 */
export const getCurrentPageIndex = () => {
  const pathname = window.location.pathname;
  return getPages().findIndex(page => page.href === pathname);
};