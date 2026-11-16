import { useCallback, useEffect, useState } from "react";

import {
  clearAuth,
  logoutSession,
  restoreSession,
  saveUser,
  setAccessToken,
} from "../utils/api.js";

import { AuthContext } from "./authContext.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authStatus, setAuthStatus] = useState("checking");
  const [authError, setAuthError] = useState("");

  const initializeAuth = useCallback(async () => {
    setAuthStatus("checking");
    setAuthError("");

    const result = await restoreSession();

    if (result.status === "authenticated") {
      setUser(result.user);
      setAuthStatus("authenticated");
      return;
    }

    if (result.status === "unauthenticated") {
      setUser(null);
      setAuthStatus("unauthenticated");
      return;
    }

    setAuthError(
      "CureAI could not verify your session. Check your connection and try again.",
    );
    setAuthStatus("unavailable");
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      setAuthStatus("checking");

      const result = await restoreSession();

      if (cancelled) return;

      if (result.status === "authenticated") {
        setUser(result.user);
        setAuthStatus("authenticated");
      } else if (result.status === "unauthenticated") {
        setUser(null);
        setAuthStatus("unauthenticated");
      } else {
        setAuthError(
          "CureAI could not verify your session. Check your connection and try again.",
        );
        setAuthStatus("unavailable");
      }
    }

    checkSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback((token, userData) => {
    setAccessToken(token);
    saveUser(userData);
    setUser(userData);
    setAuthError("");
    setAuthStatus("authenticated");
  }, []);

  const updateUser = useCallback((userData) => {
    saveUser(userData);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutSession();
    } finally {
      clearAuth();
      setUser(null);
      setAuthError("");
      setAuthStatus("unauthenticated");
    }
  }, []);

  const value = {
    user,
    authStatus,
    authError,
    isCheckingAuth: authStatus === "checking",
    isAuthenticated: authStatus === "authenticated",
    isAuthUnavailable: authStatus === "unavailable",
    retryAuth: initializeAuth,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
