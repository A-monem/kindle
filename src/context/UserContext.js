import React, {Component, createContext} from 'react'
import {firestore, auth} from '../api/Firebase'

export const UserContext = createContext()

export default class UserContextProvider extends Component{


    constructor() {
        super();
        
        this.state = {
            user: null,
            password: null,
            messagesBadge: true
        };

        this.unsubscribe = null
    }


    componentDidUpdate(){

        if (this.state.user) {

            let queryId = ''

            if (this.state.user.type === 'client') {
              queryId = 'clientId'
            } else if ((this.state.user.type === 'worker')) {
              queryId = 'workerId'
            }

            this.unsubscribe = firestore.collection('messages').where( queryId ,'==', auth.currentUser.uid)
                .onSnapshot((snapshot) => {
                    snapshot.docChanges().forEach((change) => {

                        if (change.type === "added") {
                            console.log("add", change.doc.data());
                            const message = change.doc.data()
                            if (message.status === 'new' && message.messages[message.messages.length-1].sender !== this.user.type){
                                this.setMessageBadge(false)
                            }
                        }
                        if (change.type === "modified") {
                            console.log("modified", change.doc.data())
                            this.setMessageBadge(false)
                        }
                        if (change.type === "removed") {
                            console.log("Remove: ", change.doc.data());
                        }
                    });
                })
        }
    }

    componentWillUnmount(){
        this.unsubscribe()
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

    setMessageBadge = (value) => {
        this.setState({
            messagesBadge: value
        })
    }

    render() {
        const { user, password, messagesBadge} = this.state
        return (
            <UserContext.Provider 
                value={{ user: user, 
                        addUser: this.addUser, 
                        password: password, 
                        addPassword: this.addPassword,
                        messagesBadge: messagesBadge,
                        setMessageBadge: this.setMessageBadge
                    }}
            >
                {this.props.children}
            </UserContext.Provider>
        )
      }
}