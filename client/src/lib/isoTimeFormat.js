// client/src/lib/isoTimeFormat.js
export default function isoTimeFormat(timeString) {
  if (!timeString) return "";

  // Case 1: Already "HH:mm" from backend (e.g., "14:00")
  if (/^\d{2}:\d{2}$/.test(timeString)) {
    const [hour, minute] = timeString.split(":");
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
  }

  // Case 2: Fallback if backend accidentally sends full ISO
  const date = new Date(timeString);
  if (isNaN(date.getTime())) return "Invalid Time";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
