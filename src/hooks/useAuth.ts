import { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import type { UserData } from '@/services/types/auth/request.types';

/**
 * Custom hook for authentication
 */
export const useAuth = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
  };
};

