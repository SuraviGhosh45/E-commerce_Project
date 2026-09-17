import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Restore login after browser refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("vendora_user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to restore user:", error);
        localStorage.removeItem("vendora_user");
      }
    }
  }, []);

  // Login
  const login = (userData) => {
    setUser(userData);

    localStorage.setItem(
      "vendora_user",
      JSON.stringify(userData)
    );
  };

  // Update current user
  const updateUser = (updatedData) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      const updatedUser = {
        ...currentUser,
        ...updatedData,
      };

      localStorage.setItem(
        "vendora_user",
        JSON.stringify(updatedUser)
      );

      return updatedUser;
    });
  };

  // Demo admin login
  const loginAsAdmin = () => {
    const adminUser = {
      id: "admin-001",
      name: "Vendora Admin",
      email: "admin@vendora.com",
      role: "admin",
      token: "demo-admin-token",
    };

    login(adminUser);
  };

  // Demo customer login
  const loginAsUser = () => {
    const customerUser = {
      id: "user-001",
      name: "Suravi",
      email: "suravi@example.com",
      role: "user",
      token: "demo-user-token",
    };

    login(customerUser);
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("vendora_user");
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

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};

export { AuthProvider, useAuth };