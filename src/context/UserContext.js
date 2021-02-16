import React, { Component, createContext, useContext } from 'react'
import moment from 'moment'
import { firestore, auth, firebaseGetUserInfo } from '../api/Firebase'

export const UserContext = createContext()

export function useUser() {
  return useContext(UserContext)
}

export default class UserContextProvider extends Component {
  constructor() {
    super();

    this.state = {
      user: null,
      messages: [],
      removeMessageBadge: true,
    };

    this.unsubscribeMessages = null
  }

  componentDidMount() {
    if (auth.currentUser) {
      firebaseGetUserInfo(auth.currentUser.uid)
        .then((user) => this.addUser(user))
        .catch((error) => console.log(error))
    }
  }

  componentWillUnmount() {
    try {
      if (this.unsubscribeMessages) {
        this.unsubscribeMessages()
      }
    } catch (error) {
      console.log(error)
    }

    this.setState({
      user: null,
      messages: [],
      removeMessageBadge: true,
    })
  }

    addUser = (user) => {
      const { removeMessageBadge } = this.state

      this.setState({
        user,
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

        this.unsubscribeMessages = firestore.collection('messages').where(queryId, '==', auth.currentUser.uid)
          .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === 'added') {
                const messageHolder = change.doc.data()

                if (removeMessageBadge && messageHolder.status === 'new' && messageHolder.messages[messageHolder.messages.length - 1].sender !== user.type) {
                  this.setRemoveMessageBadge(false)
                }

                firebaseGetUserInfo(messageHolder[otherUserId])
                  .then((otherUser) => {
                    messageHolder.otherUser = otherUser
                    messageHolder.jobPostTime = moment(messageHolder.jobPostTime).format('MMMM Do YYYY, h:mm a')
                    messageHolder.docId = change.doc.id
                  })
                  .then(() => {
                    this.setState((prevState) => {
                      const x = [...prevState.messages]

                      x.push(messageHolder)

                      return ({
                        messages: x,
                      })
                    })
                  })
                  .catch((error) => console.log(error.message))
              }

              if (change.type === 'modified') {
                const messageHolder = change.doc.data()

                this.setState((prevState) => {
                  const x = [...prevState.messages]
                  const y = x.filter((message) => message.docId === change.doc.id).map((item) => ({
                    ...item,
                    messages: messageHolder.messages,
                    status: messageHolder.status,
                  }))
                  const index = x.findIndex((message) => message.docId === change.doc.id)
                  const m = y[0]

                  x[index] = m

                  return ({
                    messages: x,
                  })
                })

                if (removeMessageBadge && messageHolder.status === 'new' && messageHolder.messages[messageHolder.messages.length - 1].sender !== user.type) {
                  this.setRemoveMessageBadge(false)
                }
              }

              if (change.type === 'removed') {
                console.log('Remove: ', change.doc.data());
              }
            });
          })
      } else {
        if (this.unsubscribeMessages) {
          this.unsubscribeMessages()
        }

        this.setState({
          user: null,
          messages: [],
          removeMessageBadge: true,
        })
      }
    }

    setRemoveMessageBadge = (value) => {
      this.setState({
        removeMessageBadge: value,
      })
    }

    render() {
      const {
        user, messages, removeMessageBadge,
      } = this.state
      const { children } = this.props

      return (
        <UserContext.Provider
          value={{
            user,
            addUser: this.addUser,
            messages,
            removeMessageBadge,
            setRemoveMessageBadge: this.setRemoveMessageBadge,
          }}
        >
          {children}
        </UserContext.Provider>
      )
    }
}
