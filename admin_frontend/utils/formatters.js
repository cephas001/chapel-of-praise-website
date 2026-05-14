// utils/formatters.js

export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatEventDisplay = (event) => {
  if (!event) return "";

  const date = formatDate(event.eventDate);

  if (event.service === "SPECIAL PROGRAM") {
    const programName = event.specialProgram || "Special Program";
    const dayLabel = event.programDay ? `: ${event.programDay}` : "";

    return `${date} • ${programName}${dayLabel}`;
  }

  return `${date} • ${event.service || "Unknown Event"}`;
};

export const cleanPhone = (phone) => {
  if (!phone) return "";
  let cleaned = phone.replace(/\D/g, "");
  // Auto-append Nigeria country code if it starts with 0
  if (cleaned.startsWith("0")) {
    cleaned = "234" + cleaned.substring(1);
  }
  return cleaned;
};
