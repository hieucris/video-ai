import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import type { UserData } from '@/services/types/auth/request.types';

// Custom event for user info refresh
export const USER_INFO_REFRESHED_EVENT = 'userInfoRefreshed';

/**
 * Custom hook for authentication
 */
export const useAuth = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUserInfo = useCallback(async () => {
    try {
      const response = await authService.getUserInfo();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh user info:', error);
    }
  }, []);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      
      setIsAuthenticated(isAuth);
      setUser(currentUser);
      setIsLoading(false);
    };

    checkAuth();

    // Listen for user info refresh events
    const handleUserInfoRefresh = () => {
      const updatedUser = authService.getCurrentUser();
      setUser(updatedUser);
    };

    window.addEventListener(USER_INFO_REFRESHED_EVENT, handleUserInfoRefresh);

    return () => {
      window.removeEventListener(USER_INFO_REFRESHED_EVENT, handleUserInfoRefresh);
    };
  }, []);

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    refreshUserInfo,
  };
};

