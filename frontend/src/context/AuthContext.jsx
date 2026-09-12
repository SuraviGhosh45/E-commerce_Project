import { createContext, useContext, useState } from "react"

const AuthContext=createContext()
const AuthProvider = ({children}) => {
    const[user,setUser]=useState(null)

    // for login
    const login=(userData)=>{
        setUser(userData)
    }

    //for logout
    const logout=()=>{
        setUser(null)
    }

    const isAuthenticated=!!user
  return (
    <AuthContext.Provider
    value={{
        user,
        isAuthenticated,
        login,
        logout
    }}>
        {children}
    </AuthContext.Provider>
  )
}
// Custom hook
const useAuth=()=>{
    return useContext(AuthContext)
}
export { AuthProvider, useAuth};