import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser, User } from '../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedTypes?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedTypes }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-[#F7FAFF] flex items-center justify-center">
        <div className="text-[#64748B]">A carregar...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedTypes && !allowedTypes.includes(user.user_metadata?.tipo || '')) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

