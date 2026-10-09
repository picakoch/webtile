// Build-time settings: VITE_* names, falling back to the older VUE_APP_* ones
// still used by existing .env files.
export function env(name, fallback) {
  return (
    import.meta.env[`VITE_${name}`] ||
    import.meta.env[`VUE_APP_${name}`] ||
    fallback
  );
}
