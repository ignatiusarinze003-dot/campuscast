// helpers.js — shared utility functions for CampusCast

// Format a timestamp to readable time
export function formatTime(date = new Date()) {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Truncate long text with ellipsis
export function truncate(text, maxLength = 40) {
  if (!text) return '';
  return text.length > maxLength
    ? text.substring(0, maxLength) + '...'
    : text;
}

// Generate a consistent avatar color from a name
export function avatarColor(name = '') {
  const colors = [
    '#6c63ff', '#ff6584', '#43e97b',
    '#f9a825', '#00bcd4', '#e91e63',
    '#ff9800', '#9c27b0',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

// Capitalise first letter of a string
export function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Check if a string is a valid URL
export function isValidUrl(str = '') {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

// Format a number with commas
export function formatNumber(num = 0) {
  return num.toLocaleString();
}

// Get time elapsed since a date string
export function timeAgo(dateStr = '') {
  const now = new Date();
  const past = new Date(dateStr);
  const diff = Math.floor((now - past) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// Generate initials from a full name
export function getInitials(name = '') {
  return name
    .split(' ')
    .map((n) => n.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
}