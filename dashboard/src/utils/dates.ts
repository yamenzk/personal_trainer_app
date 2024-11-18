
// utils/dates.ts

export function prettyDate(date: string | Date, mini = false): string {
  if (!date) return "";

  const userDate = new Date(date);
  const now = new Date();
  const diff = (now.getTime() - userDate.getTime()) / 1000;
  const dayDiff = Math.floor(diff / 86400);

  if (isNaN(dayDiff) || dayDiff < 0) return "";

  if (mini) {
    if (dayDiff === 0) {
      if (diff < 60) return "now";
      if (diff < 3600) return `${Math.floor(diff / 60)}m`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    }
    if (dayDiff < 7) return `${dayDiff}d`;
    if (dayDiff < 31) return `${Math.floor(dayDiff / 7)}w`;
    if (dayDiff < 365) return `${Math.floor(dayDiff / 30)}M`;
    return `${Math.floor(dayDiff / 365)}y`;
  }

  if (dayDiff === 0) {
    if (diff < 60) return "just now";
    if (diff < 120) return "1 minute ago";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 7200) return "1 hour ago";
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  }
  if (dayDiff === 1) return "yesterday";
  if (dayDiff < 7) return `${dayDiff} days ago`;
  if (dayDiff < 14) return "1 week ago";
  if (dayDiff < 31) return `${Math.floor(dayDiff / 7)} weeks ago`;
  if (dayDiff < 62) return "1 month ago";
  if (dayDiff < 365) return `${Math.floor(dayDiff / 30)} months ago`;
  if (dayDiff < 730) return "1 year ago";
  return `${Math.floor(dayDiff / 365)} years ago`;
}