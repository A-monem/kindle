import React, {Component, createContext} from 'react'

export const UserContext = createContext()

export default class UserContextProvider extends Component{
    state = {
        user: null,
        password: null
    }

    addUser = (user) => {
        this.setState({
            user
        })
    }

    addPassword = (password) => {
        this.setState({
            password
        })
    }

    render() {
        const { user, password} = this.state
        return (
            <UserContext.Provider value={{ user: user, addUser: this.addUser, password: password, addPassword: this.addPassword}}>
                {this.props.children}
            </UserContext.Provider>
        )
      }
}