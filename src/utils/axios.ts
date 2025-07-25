import axios from "axios";
import { User, AuthResponse, ErrorResponse } from "@/types";

const API_URL =
  import.meta.env.VITE_API_URL || "https://swift-ride-server.vercel.app/api";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth utilities
export const auth = {
  // Register new user
  async register(
    name: string,
    email: string,
    password: string,
    cnic: string
  ): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>("/auth/register", {
      name,
      email,
      password,
      cnic,
    });

    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
    }

    return response.data;
  },

  // Login user
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>("/auth/login", {
      email: email,
      password: password,
    });

    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }

    return response.data;
  },

  // Get current user
  async getCurrentUser(id: string): Promise<User> {
    const response = await axiosInstance.get<{
      success: boolean;
      data: { user: User };
    }>("/auth/profile/" + id.toString());
    return response.data.data.user;
  },

  // Update user profile
  async updateProfile(data: {
    _id?: string;
    name?: string;
    city?: string;
    cnic?: string;
    gender?: "male" | "female" | "other";
  }): Promise<User> {
    const response = await axiosInstance.put<{
      success: boolean;
      data: { user: User };
    }>("/auth/profile", data);
    return response.data.data.user;
  },

  // Logout user
  logout() {
    localStorage.removeItem("token");
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },

  // Forgot password - send OTP
  async forgotPassword(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.post<{
      success: boolean;
      message: string;
    }>("auth/forgot-password", {
      email,
    });
    return response.data;
  },

  // Verify OTP
  async verifyOTP(
    email: string,
    otp: string
  ): Promise<{ success: boolean; message: string; token?: string }> {
    const response = await axiosInstance.post<{
      success: boolean;
      message: string;
      token?: string;
    }>("auth/verify-otp", {
      email,
      otp,
    });
    return response.data;
  },

  // Reset password
  async resetPassword(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.post<{
      success: boolean;
      message: string;
    }>("auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    return response.data;
  },

  // Update password
  async updatePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.put<{
      success: boolean;
      message: string;
    }>("/auth/update-password", { currentPassword, newPassword });
    return response.data;
  },
};

export default axiosInstance;
