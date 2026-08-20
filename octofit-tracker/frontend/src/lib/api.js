const codespaceName =
  import.meta.env.VITE_CODESPACE_NAME?.trim() ||
  (typeof window !== 'undefined' && window.location.hostname.includes('app.github.dev')
    ? window.location.hostname.replace(/-\d+\.app\.github\.dev$/, '')
    : '');

export function getApiBaseUrl() {
  if (codespaceName && codespaceName.trim() !== '') {
    return `https://${codespaceName}-8000.app.github.dev`;
  }

  return 'http://localhost:8000';
}

export function buildApiUrl(resource) {
  const baseUrl = getApiBaseUrl();
  const normalizedResource = String(resource).replace(/^\/+|\/+$/g, '');
  const apiPath = normalizedResource.startsWith('api/')
    ? normalizedResource
    : `api/${normalizedResource}`;
  return `${baseUrl}/${apiPath}/`;
}

export const apiConfig = {
  baseUrl: getApiBaseUrl(),
  codespaceName,
};

export const ENV_NOTE =
  'VITE_CODESPACE_NAME must be defined in .env.local for Codespaces, or the app falls back to localhost:8000.';
