const PLACEHOLDER_HOSTS = ["via.placeholder.com", "via.placeholder"];

export const getSafeImageUrl = (
  url?: string | null,
  fallback = "/default-avatar.png",
) => {
  if (!url || typeof url !== "string") return fallback;

  const trimmed = url.trim();
  if (!trimmed) return fallback;

  const lowered = trimmed.toLowerCase();
  if (PLACEHOLDER_HOSTS.some((host) => lowered.includes(host))) {
    return fallback;
  }

  return trimmed;
};
