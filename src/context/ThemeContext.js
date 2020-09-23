import React, {Component, createContext} from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { grey, orange, blueGrey, blue,} from '@material-ui/core/colors'

export const ThemeContext = createContext()

export default class ThemeContextProvider extends Component{
    state = {
        darkMode: false
    }

    toggleTheme = () => {
        this.setState({
            darkMode: !this.state.darkMode
        })
    }

    render() {
        const theme = createMuiTheme({
            palette: {
              primary: orange,
              secondary: grey,
              type: this.state.darkMode ? 'dark' : 'light'
            }
        })

        return (
        <ThemeProvider theme={theme}>
            <ThemeContext.Provider value={{ darkMode: this.state.darkMode, toggleTheme: this.toggleTheme}}>
                {this.props.children}
            </ThemeContext.Provider>
        </ThemeProvider>
        )
      }
}