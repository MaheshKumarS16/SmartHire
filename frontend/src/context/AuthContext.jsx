import { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        localStorage.removeItem("user");
        return null;
      }
    }

    return null;
  });

  function persistSession(newToken, newUser) {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    persistSession(data.data.token, data.data.user);
    return data.data.user;
  };

  const register = async (payload) => {
    return registerUser(payload);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Return safe defaults when context is not available (e.g., during HMR)
    return {
      token: null,
      user: null,
      isAuthenticated: false,
      login: async () => {},
      register: async () => {},
      logout: () => {},
    };
  }
  return ctx;
}
