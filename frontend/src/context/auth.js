import { createContext, useContext } from 'react';

export const AuthContext = createContext();

// hook for using AuthContext 
export const useAuth = () => {
  return useContext(AuthContext);
}
