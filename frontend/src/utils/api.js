const API_URL = import.meta.env.VITE_API_BASE_URL;

let accessToken = null;
let refreshPromise = null;

export function setAccessToken(token) {
  accessToken = token || null;
}

export function getAccessToken() {
  return accessToken;
}

export function saveUser(user) {
  sessionStorage.setItem("cureai-user", JSON.stringify(user));
}

export function getSavedUser() {
  try {
    return JSON.parse(sessionStorage.getItem("cureai-user") || "null");
  } catch {
    return null;
  }
}

export function clearAuth() {
  accessToken = null;
  sessionStorage.removeItem("cureai-token");
  sessionStorage.removeItem("cureai-user");
}

function requestSessionRefresh() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        clearAuth();

        return {
          status: "unauthenticated",
          token: null,
          user: null,
        };
      }

      if (!response.ok || !data.success || !data.token) {
        return {
          status: "unavailable",
          token: null,
          user: null,
        };
      }

      const user = data.user || getSavedUser();

      if (!user) {
        return {
          status: "unavailable",
          token: null,
          user: null,
        };
      }

      setAccessToken(data.token);
      saveUser(user);

      return {
        status: "authenticated",
        token: data.token,
        user,
      };
    } catch {
      return {
        status: "unavailable",
        token: null,
        user: null,
      };
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function refreshAccessToken() {
  const result = await requestSessionRefresh();

  return result.status === "authenticated" ? result.token : null;
}

export async function restoreSession() {
  const result = await requestSessionRefresh();

  return {
    status: result.status,
    user: result.user,
  };
}

export async function apiFetch(path, options = {}) {
  const url = `${API_URL}${path}`;

  const makeRequest = (token) => {
    const headers = new Headers(options.headers || {});

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      headers.delete("Authorization");
    }

    return fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });
  };

  let token = getAccessToken();

  if (!token && !path.startsWith("/api/auth/refresh")) {
    token = await refreshAccessToken();
  }

  let response = await makeRequest(token);

  if (response.status === 401 && token) {
    const refreshedToken = await refreshAccessToken();

    if (refreshedToken) {
      response = await makeRequest(refreshedToken);
    }
  }

  return response;
}

export async function logoutSession() {
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    clearAuth();
  }
}
