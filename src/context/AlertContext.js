import React, { Component, createContext, useContext } from 'react'
import Alert from '@material-ui/lab/Alert'
import { Snackbar } from '@material-ui/core'

export const AlertContext = createContext()

export function useAlert() {
  return useContext(AlertContext)
}

class AlertContextProvider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      openSuccess: false,
      openError: false,
      message: '',
    }
  }

  handleSuccessClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    this.setState({
      openSuccess: false,
      message: '',
    })
  }

  handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    this.setState({
      openError: false,
    })
  }

  showSuccessAlert = (message) => {
    this.setState({
      message,
      openSuccess: true,
    })
  }

  showErrorAlert = (message) => {
    this.setState({
      message,
      openError: true,
    })
  }

  render() {
    const { openSuccess, openError, message } = this.state
    const { children } = this.props

    return (
      <AlertContext.Provider
        value={{
          showSuccessAlert: this.showSuccessAlert,
          showErrorAlert: this.showErrorAlert,
        }}
      >
        {children}
        <Snackbar open={openError} autoHideDuration={6000} onClose={this.handleErrorClose}>
          <Alert onClose={this.handleErrorClose} severity="error">
            {message}
          </Alert>
        </Snackbar>
        <Snackbar open={openSuccess} autoHideDuration={6000} onClose={this.handleSuccessClose}>
          <Alert onClose={this.handleSuccessClose} severity="success">
            {message}
          </Alert>
        </Snackbar>
      </AlertContext.Provider>
    )
  }
}

export default AlertContextProvider
