import { useAuthStore } from "../store/useAuthStore";

const BASE_URL = "http://94.74.86.174:8080/api";

interface ApiError {
  message: string;
}

export const apiFetch = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | null> => {
  const { token } = useAuthStore.getState();

  // Gunakan tipe Record<string, string> supaya bisa diindex
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData: ApiError = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw new Error(errorData.message);
  }

  if (
    response.status === 204 ||
    response.headers.get("Content-Length") === "0"
  ) {
    return null;
  }

  return response.json() as Promise<T>;
};
