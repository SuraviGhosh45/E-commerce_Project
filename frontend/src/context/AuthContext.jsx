import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ================================
  // Normal login
  // ================================
  const login = (userData) => {
    setUser(userData);
  };

  // ================================
  // Update current user
  // Frontend-only for now
  // ================================
  const updateUser = (updatedData) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      return {
        ...currentUser,
        ...updatedData,
      };
    });
  };

  // ================================
  // Demo admin login
  // Frontend testing only
  // ================================
  const loginAsAdmin = () => {
    const adminUser = {
      id: "admin-001",
      name: "Vendora Admin",
      email: "admin@vendora.com",
      role: "admin",
    };

    setUser(adminUser);
  };

  // ================================
  // Demo customer login
  // Frontend testing only
  // ================================
  const loginAsUser = () => {
    const customerUser = {
      id: "user-001",
      name: "Suravi",
      email: "suravi@example.com",
      role: "user",
    };

    setUser(customerUser);
  };

  // ================================
  // Logout
  // ================================
  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = Boolean(user);

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isUser,
        login,
        updateUser,
        loginAsAdmin,
        loginAsUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ================================
// Custom hook
// ================================
const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };