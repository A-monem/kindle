import React from 'react'
import ThemeContextProvider from './ThemeContext'
import UserContextProvider from './UserContext'

export default function CombinedContext(props){
    return(
        <ThemeContextProvider>
            <UserContextProvider>
                {props.children}
            </UserContextProvider>
        </ThemeContextProvider>
    )
}