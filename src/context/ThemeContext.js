import React, { Component, createContext } from 'react'
import { createMuiTheme, ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles'
// import {
//   grey, orange, blueGrey, blue, purple, red, green, deepOrange, yellow, teal, amber, indigo,
// } from '@material-ui/core/colors'
import {
  amber, indigo, lightBlue,
} from '@material-ui/core/colors'

export const ThemeContext = createContext()

export default class ThemeContextProvider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      darkMode: false,
    }
  }

    toggleTheme = () => {
      this.setState((prevState) => ({
        darkMode: !prevState.darkMode,
      }))
    }

    render() {
      const { darkMode } = this.state
      const { children } = this.props
      let theme = createMuiTheme({
        palette: {
          primary: darkMode ? lightBlue : indigo,
          secondary: amber,
          type: darkMode ? 'dark' : 'light',
        },
        typography: {
          button: {
            textTransform: 'none',
          },
          subtitle1: {
            fontWeight: 'bold',
            '@media (max-width:960px)': {
              fontSize: '0.8rem',
            },
          },
          fontFamily: ['Open Sans',
            'Roboto'],
        },
        props: {
          MuiRadio: {
            size: 'small',
            color: 'primary',
          },
          MuiButton: {
            color: 'secondary',
          },
          MuiIconButton: {
            color: 'secondary',
          },
          MuiSvgIcon: {
            color: 'secondary',
          },
        },
        overrides: {
          MuiFormControlLabel: {
            label: {
              fontSize: '0.8rem',
            },
          },
        },
      })

      theme = responsiveFontSizes(theme)

      return (
        <ThemeProvider theme={theme}>
          <ThemeContext.Provider value={{
            darkMode,
            toggleTheme: this.toggleTheme,
          }}
          >
            {children}
          </ThemeContext.Provider>
        </ThemeProvider>
      )
    }
}
