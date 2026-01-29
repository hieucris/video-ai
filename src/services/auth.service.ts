import axios, { AxiosError } from 'axios';
import type { LoginRequest, LoginResponse, UserData } from './types/auth/request.types';

// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV 
  ? '/api/v1'  // Proxy to avoid CORS in development
  : 'https://system.kingcontent.pro/api/v1';

/**
 * Auth Service
 * Handles authentication API calls
 */
class AuthService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
      },
      timeout: 30000, // 30 seconds
      withCredentials: false, // Don't send cookies
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add token if exists
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.axiosInstance.post<LoginResponse>(
        '/user/login',
        credentials
      );

      // Save token if login successful
      if (response.data.success && response.data.access_token) {
        this.saveToken(response.data.access_token);
        this.saveUser(response.data.data);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  /**
   * Get user info from API
   */
  async getUserInfo(): Promise<LoginResponse> {
    try {
      const response = await this.axiosInstance.get<LoginResponse>('/user/me');

      // Update stored user data
      if (response.data.success && response.data.data) {
        this.saveUser(response.data.data);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearToken();
    this.clearUser();
    window.location.href = '/login';
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Save token to localStorage
   */
  private saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * Get token from localStorage
   */
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Clear token from localStorage
   */
  private clearToken(): void {
    localStorage.removeItem('token');
  }

  /**
   * Save user to localStorage
   */
  private saveUser(user: UserData): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Clear user from localStorage
   */
  private clearUser(): void {
    localStorage.removeItem('user');
  }
}

// Export singleton instance
export const authService = new AuthService();

