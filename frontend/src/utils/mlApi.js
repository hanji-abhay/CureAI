const ML_API_URL = (
  import.meta.env.VITE_ML_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

async function predict(endpoint, payload) {
  let response;

  try {
    response = await fetch(`${ML_API_URL}/predict/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Unable to connect to the CureAI ML API. Please check whether the ML server is running.",
    );
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message = result?.detail
      ? typeof result.detail === "string"
        ? result.detail
        : JSON.stringify(result.detail)
      : `Prediction request failed with status ${response.status}`;

    throw new Error(message);
  }

  return result;
}

export function predictThyroid(payload) {
  return predict("thyroid", payload);
}

export function predictSkin(payload) {
  return predict("skin", payload);
}

export function predictLung(payload) {
  return predict("lung", payload);
}

export function predictBreast(payload) {
  return predict("breast", payload);
}
