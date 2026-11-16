import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  predictThyroid,
  predictSkin,
  predictLung,
  predictBreast,
} from "./mlApi";

describe("ML API utility", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const predictionFunctions = [
    ["Thyroid", predictThyroid, "thyroid"],
    ["Skin", predictSkin, "skin"],
    ["Lung", predictLung, "lung"],
    ["Breast", predictBreast, "breast"],
  ];

  it.each(predictionFunctions)(
    "sends the correct %s prediction request",
    async (name, predictFunction, endpoint) => {
      const payload = { feature: "test-value" };
      const result = {
        cancer_type: `${name} Cancer`,
        prediction: "Benign",
        message: "AI-assisted preliminary classification.",
      };

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(result),
      });

      const response = await predictFunction(payload);

      expect(response).toEqual(result);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp(`/predict/${endpoint}$`)),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
    },
  );

  it("throws the API error message when the server returns an error", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 422,
      json: vi.fn().mockResolvedValue({
        detail: "Invalid prediction input",
      }),
    });

    await expect(predictThyroid({})).rejects.toThrow(
      "Invalid prediction input",
    );
  });

  it("uses the HTTP status when the server provides no error detail", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue({}),
    });

    await expect(predictSkin({})).rejects.toThrow(
      "Prediction request failed with status 500",
    );
  });

  it("throws a connection error when the ML server is unreachable", async () => {
    fetch.mockRejectedValue(new Error("Network error"));

    await expect(predictLung({})).rejects.toThrow(
      "Unable to connect to the CureAI ML API. Please check whether the ML server is running.",
    );
  });
});
