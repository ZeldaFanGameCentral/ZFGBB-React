export function getApiBaseUrl(): string {
  if (import.meta.env.SSR) {
    return import.meta.env.REACT_ZFGBB_API_URL_INTERNAL;
  }
  return import.meta.env.REACT_ZFGBB_API_URL;
}
