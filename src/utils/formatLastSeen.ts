export const formatLastSeen = (date?: string | null) => {
    if (!date) return "offline";
  
    const d = new Date(date);
    const now = new Date();
  
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
  
    if (diffMin < 1) return "last seen just now";
    if (diffMin < 60) return `last seen ${diffMin} minutes ago`;
  
    const sameDay =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();
  
    if (sameDay) {
      return `last seen today at ${d.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
  
    return `last seen at ${d.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };
  