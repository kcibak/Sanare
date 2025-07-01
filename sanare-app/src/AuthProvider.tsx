import React, { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // TODO: Restore rudimentary login/session logic here
  return <>{children}</>;
};

export default AuthProvider;
