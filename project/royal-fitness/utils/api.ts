const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body?: any,
  token?: string | null
) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}