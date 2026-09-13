import React, {  createContext, useContext, useEffect, useState } from 'react'

const ThemeContext=createContext()
const ThemeProvider = ({children}) => {
    const[theme,setTheme]=useState(()=>{
        return localStorage.getItem("vendora-theme")||"light";
    })
    useEffect(()=>{
        localStorage.setItem("vendora-theme",theme)
        document.documentElement.setAttribute("data-theme",theme)
    },[theme])
    const toggleTheme=()=>{
        setTheme((curr)=>
            curr==="light"?"dark":"light"
        )
    }

    const isDark=theme==="dark"

  return (
    <ThemeContext.Provider
    value={{
        theme,
        isDark,
        toggleTheme
    }}>
        {children}
    </ThemeContext.Provider>
  )
}

const useTheme=()=>{
    return useContext(ThemeContext)
}

export {useTheme,ThemeProvider}