import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// export const login = async (email: string, password: string): Promise<LoginResponse> => {
//   try {
//     const response = await api.post("/api/auth/login", { email, password });
//     localStorage.setItem("token", response.data.token);
//     return response.data;
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : "Login failed. Please try again.";
//     toast.error(errorMessage);
//     throw error;
//   }
// };

export const login = async (email, password) => {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    console.log("Login response:", response.data); // Debug
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const suggestTasks = async (eventName: string, eventDescription: string, venueNeeded: boolean, cateringNeeded: boolean): Promise<string[]> => {
  try {
    const response = await api.post("/api/cohere/suggest-tasks", {
      eventName,
      eventDescription,
      venueNeeded,
      cateringNeeded,
    });
    // Assuming suggestions are newline-separated, split and filter empty lines
    const parsedSuggestions = response.data.suggestions
      .split("\n")
      .map((s: string) => s.trim())
      .filter(Boolean);
    return parsedSuggestions;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to get task suggestions.";
    toast.error(errorMessage);
    throw error;
  }
};

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer?: string;
  userId: string;
  createdAt: string;
  reminderSent?: boolean;
  requiresVenue?: boolean; // Added
  requiresCatering?: boolean; // Added
}

export const createEvent = async (eventData: Omit<Event, '_id' | 'userId' | 'createdAt' | 'reminderSent'>): Promise<Event> => {
  try {
    const response = await api.post("/api/events", eventData);
    toast.success("Event created successfully!");
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create event.";
    toast.error(errorMessage);
    throw error;
  }
};

export const fetchEventById = async (id: string): Promise<Event> => {
  try {
    const response = await api.get(`/api/events/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch event details.";
    toast.error(errorMessage);
    throw error;
  }
};

export const updateEvent = async (id: string, eventData: Partial<Event>): Promise<Event> => {
  try {
    const response = await api.put(`/api/events/${id}`, eventData);
    toast.success("Event updated successfully!");
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update event.";
    toast.error(errorMessage);
    throw error;
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/events/${id}`);
    toast.success("Event deleted successfully!");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete event.";
    toast.error(errorMessage);
    throw error;
  }
};

export const register = async (email: string, password: string, name: string): Promise<LoginResponse> => {
  try {
    const response = await api.post("/api/auth/register", { email, password, name }); // Added 'name' to the payload
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Registration failed. Please try again.";
    toast.error(errorMessage);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post("/api/auth/logout");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Logout failed. Please try again.";
    toast.error(errorMessage);
    throw error;
  }
};

export const fetchAuthenticatedUser = async (): Promise<User> => {
  try {
    const response = await api.get("/api/auth/me"); // Assuming a /api/auth/me endpoint
    return response.data.user;
  } catch (error) {
    console.error("Failed to fetch authenticated user:", error);
    localStorage.removeItem("token"); // Clear token if verification fails
    throw error;
  }
};

export const fetchEvents = async () => {
  try {
    const response = await api.get("/api/events");
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch events.";
    toast.error(errorMessage);
    throw error;
  }
};

export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  eventId: string;
  createdAt: string;
}

export const fetchPendingTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get("/api/tasks/pending");
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch pending tasks.";
    toast.error(errorMessage);
    throw error;
  }
};
