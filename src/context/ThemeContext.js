import React, {Component, createContext} from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { grey, orange, blueGrey, blue, purple, red, green, deepOrange, yellow, teal} from '@material-ui/core/colors'

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
              secondary: blueGrey,
              type: this.state.darkMode ? 'dark' : 'light'
            },
            typography: {
                button: {
                  textTransform: 'none'
                }, 
                subtitle1: {
                    fontWeight: 'bold'
                }
            },
            props: {
                MuiRadio: {
                    size: 'small',
                    color: 'primary'
                },
            },
            overrides: {
                MuiFormControlLabel: {
                    root: {
                        // padding: '1rem', 
                        height: '1.5rem'
                    },
                    label: {
                        fontSize: '0.8rem',
                        
                    }
                },
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