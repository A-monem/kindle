import React, {Component, createContext} from 'react'
import {firestore, auth, firebaseGetToken, messaging, firebaseGetUserInfo} from '../api/Firebase'
import moment from 'moment'
export const UserContext = createContext()

export default class UserContextProvider extends Component{

    constructor() {
        super();
        
        this.state = {
            user: null,
            password: null,
            messages: [],
            removeMessageBadge: true
        };

        this.unsubscribeMessages = null
    }

    componentWillUnmount(){
        this.unsubscribeMessages()

        this.setState({
            user: null,
            password: null,
            messages: [],
            removeMessageBadge: true
        })
    }

    addUser = (user) => {
        
        this.setState({
            user
        })


        if (user) {
            let queryId = ''
            let otherUserId = ''

            if (user.type === 'client') {
                queryId = 'clientId'
                otherUserId = 'workerId'
            } else if ((user.type === 'worker')) {
                queryId = 'workerId'
                otherUserId = 'clientId'
            }

            this.unsubscribeMessages = firestore.collection('messages').where( queryId ,'==', auth.currentUser.uid)
                .onSnapshot((snapshot) => {
                    snapshot.docChanges().forEach((change) => {

                        if (change.type === "added") {

                            let messageHolder = change.doc.data()

                            if (this.state.removeMessageBadge && messageHolder.status === 'new' && messageHolder.messages[messageHolder.messages.length-1].sender !== user.type){
                               
                                this.setRemoveMessageBadge(false)
                            }

                            firebaseGetUserInfo(messageHolder[otherUserId])
                                .then((otherUser) => {
                                
                                    messageHolder['otherUser'] = otherUser
                                    messageHolder['jobPostTime'] = moment(messageHolder.jobPostTime).format('MMMM Do YYYY, h:mm a')
                                    messageHolder['docId'] = change.doc.id
                
                                })
                                .then(() => {
                                    this.setState((prevState) =>{
                                        let x = [...prevState.messages]
                                        x.push(messageHolder)
            
                                        return({
                                            messages: x
                                        })
                                    })
                                })
                                .catch(error => console.log(error.message))
                        }
                        if (change.type === "modified") {
                            
                            let messageHolder = change.doc.data()
                            
                            this.setState((prevState) =>{
                                let x = [...prevState.messages]
                                
                                const y = x.filter((message) => message.docId === change.doc.id).map((item) => ({
                                    ...item,
                                    messages: messageHolder.messages, 
                                    status: messageHolder.status, 
                                }))

                                const index = x.findIndex((message) => message.docId === change.doc.id)

                                x[index] = y[0]
                               
                                return({
                                    messages: x
                                })
                            })

                            if (this.state.removeMessageBadge && messageHolder.status === 'new' && messageHolder.messages[messageHolder.messages.length-1].sender !== user.type){
                                this.setRemoveMessageBadge(false)
                            }
                        }
                        if (change.type === "removed") {
                            console.log("Remove: ", change.doc.data());
                        }
                    });
                })
        } else {

            this.unsubscribeMessages()

            this.setState({
                user: null,
                password: null,
                messages: [],
                removeMessageBadge: true
            })

        }
        
    }

    addPassword = (password) => {
        this.setState({
            password
        })
    }

    setRemoveMessageBadge = (value) => {
        this.setState({
            removeMessageBadge: value
        })
    }

    render() {
        const { user, password, messages, removeMessageBadge} = this.state
        return (
            <UserContext.Provider 
                value={{ user: user, 
                        addUser: this.addUser, 
                        password: password, 
                        addPassword: this.addPassword,
                        messages: messages,
                        removeMessageBadge:  removeMessageBadge,
                        setRemoveMessageBadge: this.setRemoveMessageBadge
                    }}
            >
                {this.props.children}
            </UserContext.Provider>
        )
      }
}