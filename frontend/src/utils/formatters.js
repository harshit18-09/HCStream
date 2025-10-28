import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const formatRelativeTime = (value) => {
  if (!value) {
    return "just now";
  }
  return dayjs(value).fromNow();
};

export const formatNumber = (value) => {
  if (value == null) {
    return "0";
  }
  return Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatDuration = (seconds) => {
  if (!seconds || Number.isNaN(Number(seconds))) {
    return "00:00";
  }
  const totalSeconds = Math.floor(Number(seconds));
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hrs > 0) {
    return [hrs, mins.toString().padStart(2, "0"), secs.toString().padStart(2, "0")].join(":");
  }
  return [mins.toString().padStart(2, "0"), secs.toString().padStart(2, "0")].join(":");
};
