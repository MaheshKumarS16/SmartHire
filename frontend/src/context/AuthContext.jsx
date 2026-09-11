import { createContext, useContext, useState } from "react";
import { loginUser } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

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

  const login = async (email, password) => {
    const data = await loginUser(
      email,
      password
    );

    const newToken = data.data.token;
    const newUser = data.data.user;

    localStorage.setItem(
      "token",
      newToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(newUser)
    );

    setToken(newToken);
    setUser(newUser);

    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  const isAuthenticated =
    Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}