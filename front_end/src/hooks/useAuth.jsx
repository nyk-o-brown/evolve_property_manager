import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    setUser(null);
  };

  const isTenant = user?.role === 'tenant';
  const isManager = user?.role === 'manager';

  return {
    user,
    isLoading,
    isTenant,
    isManager,
    hasRole: (role) => user?.role === role,
    logout
  };
};