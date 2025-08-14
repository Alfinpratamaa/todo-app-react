import { apiFetch } from "../utils/fetcher";

// ================= Auth =================
interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  data?: {
    token: string;
  };
  statusCode?: number;
  message?: string;
}

interface RegisterData {
  username: string;
  password: string;
  email?: string;
}

export const loginUser = (credentials: LoginCredentials) =>
  apiFetch<AuthResponse>("/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const registerUser = (data: RegisterData) =>
  apiFetch<AuthResponse>("/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

// ================= Checklist =================
export interface ChecklistItem {
  id: string;
  name: string;
  itemCompletionStatus: boolean; // misal status selesai / belum
}

// Checklist utama
export interface Checklist {
  id: string;
  name: string;
  checklistCompletionStatus: boolean; // status keseluruhan checklist
  items: ChecklistItem[] | null; // bisa null kalau belum ada item
}

interface ChecklistRequest {
  name: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export const getChecklists = () =>
  apiFetch<ApiResponse<Checklist[]>>("/checklist");

export const createChecklist = (data: ChecklistRequest) =>
  apiFetch<Checklist>("/checklist", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteChecklist = (id: string) =>
  apiFetch<void>(`/checklist/${id}`, { method: "DELETE" });

// ================= Checklist Items =================
export interface ChecklistItem {
  id: string;
  name: string;
  completed: boolean;
}

interface ChecklistItemRequest {
  name: string;
}

export const getChecklistItems = (checklistId: string) =>
  apiFetch<ApiResponse<ChecklistItem[]>>(`/checklist/${checklistId}/item`);

export const createChecklistItem = (
  checklistId: string,
  data: ChecklistItemRequest
) =>
  apiFetch<ChecklistItem>(`/checklist/${checklistId}/item`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateItemStatus = (checklistId: string, itemId: string) =>
  apiFetch<ChecklistItem>(`/checklist/${checklistId}/item/${itemId}`, {
    method: "PUT",
  });

export const renameItem = (
  checklistId: string,
  itemId: string,
  data: ChecklistItemRequest
) =>
  apiFetch<ChecklistItem>(`/checklist/${checklistId}/item/rename/${itemId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteChecklistItem = (checklistId: string, itemId: string) =>
  apiFetch<void>(`/checklist/${checklistId}/item/${itemId}`, {
    method: "DELETE",
  });
