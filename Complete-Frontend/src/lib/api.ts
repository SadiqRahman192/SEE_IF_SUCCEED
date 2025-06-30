<<<<<<< HEAD
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
=======
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
    console.log("API Interceptor: Token found and attached.");
  } else {
    console.log("API Interceptor: No token found.");
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

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    console.log("Login response:", response.data); // Debug
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message || "Login failed" : "Login failed";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export interface Provider {
  name: string;
  address: string;
  location: { lat: number; lng: number };
  rating?: number;
}

export interface EnrichedSuggestion {
  task: string;
  category: string;
  providers: Provider[];
}

export const fetchEnrichedSuggestions = async (
  eventName: string,
  eventDescription: string,
  venueNeeded: boolean,
  cateringNeeded: boolean
  // Removed location as it's no longer needed for initial task suggestions
): Promise<{ suggestions: EnrichedSuggestion[] }> => {
  try {
    const response = await api.post("/api/cohere/get-enriched-suggestions", {
      eventName,
      eventDescription,
      venueNeeded,
      cateringNeeded,
      // location, // Removed location from payload
    });
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch enriched suggestions.";
    toast.error(errorMessage);
    throw error;
  }
};

export interface SuggestedProvider {
  name: string;
  address?: string; // Make optional for Gemini fallback
  phone?: string; // Make optional for Gemini fallback
  booking_link?: string; // Make optional for Gemini fallback
  description?: string; // Add for Gemini fallback
  contact?: string; // Add for Gemini fallback
}

// Interface for the response from the new vendor suggestion endpoint
export interface VendorSuggestionResponse {
  task: string;
  category: string;
  suggested_providers: SuggestedProvider[];
}

// New function to fetch vendor suggestions for a specific task
export const fetchVendorSuggestionsForTask = async (taskTitle: string, eventId: string): Promise<VendorSuggestionResponse> => {
  try {
    const response = await api.post(`/api/cohere/get-vendor-suggestions`, { taskTitle, eventId });
    return response.data;
  } catch (error) {
    const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message || "Failed to fetch vendor suggestions." : "Failed to fetch vendor suggestions.";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// The existing fetchVendorSuggestions (from /api/tasks/suggest-vendors) is kept separate if needed elsewhere.
// If it's no longer used, it can be removed.
export interface TaskSuggestionResponse {
  task: string;
  category: string;
  suggested_providers: SuggestedProvider[];
}

export const fetchVendorSuggestions = async (taskId: string): Promise<TaskSuggestionResponse> => {
  try {
    const response = await api.post(`/api/tasks/suggest-vendors`, { taskId });
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch vendor suggestions.";
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
>>>>>>> e698f63 (enhance and bunch of features to the app)
