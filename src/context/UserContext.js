import React, {Component, createContext} from 'react'

export const UserContext = createContext()

export default class UserContextProvider extends Component{
    state = {
        user: null,
    }

    addUser = (user) => {
        this.setState({
            user
        })
    }

    render() {
        const { user } = this.state
        return (
            <UserContext.Provider value={{ user: user, addUser: this.addUser}}>
                {this.props.children}
            </UserContext.Provider>
        )
      }
}