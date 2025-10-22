import { createContext, useContext, useState,  useEffect } from "react";
import type { ReactNode } from "react";

import {jwtDecode} from "jwt-decode";

interface AuthContextType {
  user: any;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token");
        logout();
      }
    }
  }, [token]);

  const login = (jwt: string) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
