import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const mockUser = {
  id: "1",
  name: "Malik Zain",
  email: "malikzain@gmail.com",
  role: "admin",
  avatar:
    "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
  permissions: ["all"],
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(mockUser);

  const login = async (email, password) => {
    // Mock login - in real app, this would call an API
    if (email && password) {
      setUser(mockUser);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    return (
      user.permissions.includes("all") || user.permissions.includes(permission)
    );
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
