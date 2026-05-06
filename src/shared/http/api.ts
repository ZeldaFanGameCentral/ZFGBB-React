export function getApiBaseUrl() {
  if (import.meta.env.SSR) {
    return import.meta.env.REACT_ZFGBB_API_URL_INTERNAL;
  }
  return import.meta.env.REACT_ZFGBB_API_URL;
}

export function getPublicApiBaseUrl() {
  return import.meta.env.REACT_ZFGBB_API_URL;
}
