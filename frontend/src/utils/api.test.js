import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  setAccessToken,
  getAccessToken,
  saveUser,
  getSavedUser,
  clearAuth,
  apiFetch,
  logoutSession,
} from "./api";

describe("API utility", () => {
  beforeEach(() => {
    sessionStorage.clear();
    setAccessToken(null);
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stores and retrieves the access token", () => {
    setAccessToken("test-token");

    expect(getAccessToken()).toBe("test-token");
  });

  it("stores and retrieves the saved user", () => {
    const user = { id: "123", fullName: "Test User" };

    saveUser(user);

    expect(getSavedUser()).toEqual(user);
  });

  it("returns null when saved user data is invalid", () => {
    sessionStorage.setItem("cureai-user", "invalid-json");

    expect(getSavedUser()).toBeNull();
  });

  it("clears authentication data", () => {
    setAccessToken("test-token");
    saveUser({ id: "123" });
    sessionStorage.setItem("cureai-token", "old-token");

    clearAuth();

    expect(getAccessToken()).toBeNull();
    expect(getSavedUser()).toBeNull();
    expect(sessionStorage.getItem("cureai-token")).toBeNull();
  });

  it("sends the access token with protected API requests", async () => {
    setAccessToken("test-token");

    fetch.mockResolvedValue({
      status: 200,
      ok: true,
    });

    await apiFetch("/api/test");

    const [url, options] = fetch.mock.calls[0];

    expect(url).toContain("/api/test");
    expect(options.headers.get("Authorization")).toBe("Bearer test-token");
    expect(options.credentials).toBe("include");
  });

  it("refreshes the session when no access token exists", async () => {
    const user = { id: "123", fullName: "Test User" };

    fetch
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: vi.fn().mockResolvedValue({
          success: true,
          token: "refreshed-token",
          user,
        }),
      })
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
      });

    await apiFetch("/api/test");

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch.mock.calls[0][0]).toContain("/api/auth/refresh");
    expect(fetch.mock.calls[1][1].headers.get("Authorization")).toBe(
      "Bearer refreshed-token",
    );
  });

  it("clears authentication after logout", async () => {
    setAccessToken("test-token");
    saveUser({ id: "123" });

    fetch.mockResolvedValue({ ok: true });

    await logoutSession();

    expect(fetch.mock.calls[0][0]).toContain("/api/auth/logout");
    expect(getAccessToken()).toBeNull();
    expect(getSavedUser()).toBeNull();
  });
});
