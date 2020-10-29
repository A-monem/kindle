import React, { useState, useEffect, useContext} from 'react';
import { Button, Typography, Paper, TextField, Snackbar, Grid, Avatar, ListItemAvatar, ListItemSecondaryAction, 
     List, ListItem, Divider, ListItemText, IconButton, Tooltip, Modal} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert';
import { UserContext } from '../context/UserContext'
import { firebaseReplyMessage, firebaseGetUserMessages, firestore, auth, firebaseGetJob, firebaseSetMessageAsRead} from '../api/Firebase'
import { Redirect } from "react-router-dom"
import Registration from './Registration'
import EmailIcon from '@material-ui/icons/Email'
import SendIcon from '@material-ui/icons/Send'
import moment from 'moment'
import TouchAppIcon from '@material-ui/icons/TouchApp';
import ApplyJob from './ApplyJob'

export default function Messages({ history }) {
    
    const [openError, setOpenError] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [allMessages, setAllMessages] = useState([])
    const [index, setIndex] = useState(null)
    const [replyMessage, setReplyMessage] = useState('')
    const [job, setJob] = useState(null)
    const [openApplyModal, setOpenApplyModal] = useState(false)
    
    const theme = useTheme()
    const { user, messages, removeMessageBadge, setRemoveMessageBadge} = useContext(UserContext)


    useEffect(() => {

        console.log(messages)
        setAllMessages(messages)

        //getMessages()
        setRemoveMessageBadge(true)
        
        return () => {
            //setRemoveMessageBadge(true)
            //setAllMessages([])
        }

    }, [messages, removeMessageBadge])
   
    const useStyles = makeStyles(() => ({
        root: {
            width: '100%',
            height: '100%'
        },
        margin: {
            margin: theme.spacing(1)
        },
        grid: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        paper1: {
            height: '100%', 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        paper2: {
            padding: theme.spacing(2),
            width: '80%',
            overflow: 'auto',
            height: '60vh', 
        },
        select: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
        },
        paper3: {
            width: '80%',
            marginTop: theme.spacing(2),
            padding: theme.spacing(2),
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        avatar: {
            width: theme.spacing(7),
            height: theme.spacing(7),
            marginRight: theme.spacing(2)
        }, 
        me: {
            textAlign: 'right',
            padding: theme.spacing(2),
        },
        meTypography:{
             background: theme.palette.primary.light,
             padding: theme.spacing(2),
             borderRadius: 20,
             borderBottomRightRadius: 0
        },
        otherUser: {
            padding: theme.spacing(2),
            textAlign: 'left'
        }, 
        otherUserTypography: {
            background: theme.palette.secondary.light,
            padding: theme.spacing(2),
            borderRadius: 20,
            borderBottomLeftRadius: 0
        }, 
        new: {
            background: '#f0f0f0'
        },
        list: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }, 
        modal: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
        }, 
        modalPaper: {
            width: '60%', 
            height: '80%', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: theme.spacing(2)
        }, 
        particularDaysSelect: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },

    }))

    const classes = useStyles()

    const handleErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenError(false);
        setMessage('')
    }

    const handleSuccessClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
        setMessage('')
    }


    const handleSendMessage = () => {

        if(replyMessage){
             
            const messageObject = {
                body: replyMessage,
                sender: user.type, 
                time: Date.now()
            }

            firebaseReplyMessage(allMessages[index].docId, messageObject)
                .then(() => {
                    getMessages()
                })
                .then(() => setReplyMessage(''))
                .catch((error) => {
                    console.log(error)
                    setMessage('Sending message failed')
                    setOpenError(true)
                })

        }
       
    }

    const getMessages = () => {
        
        // firebaseGetUserMessages(user)
        // .then((messages) => {
        //     setAllMessages(messages)
        //     document.getElementById('messagingPlatform').scrollIntoView();
        // })
        // .catch((error) => {
        //     setMessage('Sending message failed')
        //     setOpenError(true)
        // })
    }

    const handleApplyForJob = (id) => {
        firebaseGetJob(id)
            .then((job) => {
                console.log(job)
                setJob(job)
            })
            .then(() => setOpenApplyModal(true))
            .catch((error) => {
                setMessage('Failed to get job. It might have been deleted')
                setOpenError(true)
            })
    }

    const handleCloseApplyModal = () => {
        setOpenApplyModal(false)
        setJob(null)
    }

    if (!user) {
        return <Redirect to={'/signin'} />
    } else {
        if (!user.complete) {
            return <Registration history={history}/>
        } else {
            return (
                <>
                <Grid container className={classes.root} spacing={0}>
                    <Grid item xs={4} className={classes.grid}>
                        <Paper className={classes.paper1} elevation={3}>
                            <EmailIcon color='secondary' style={{ fontSize: 50, marginTop: theme.spacing(2) }}/>
                            
                            <List component="nav" dense aria-label="mailbox folders" style={{ width: '100%'}}>
                                <Divider style={{padding: 0, marding: 0}}/>
                                {allMessages.map((message, i) => (
                                    <div key={i}>
                                        <ListItem
                                            className={(message.messages[message.messages.length-1].sender !== user.type && message.status === 'new') ? classes.new : null}
                                            button 
                                            onClick={() => {
                                                setIndex(i)
                                                firebaseSetMessageAsRead(message.docId)
                                                    .then(() => getMessages())
                                                    .catch((error) => {
                                                        setMessage('Sending message failed')
                                                        setOpenError(true)
                                                    })

                                                setTimeout(() => {
                                                    document.getElementById('messagingPlatform').scrollIntoView('smooth');
                                                }, 0)
                                            }}
                                        >
                                            <ListItemAvatar >
                                                <Avatar src={message.otherUser.avatar} className={classes.avatar}/>
                                            </ListItemAvatar>
                                            <ListItemText 
                                            primary={
                                                <Typography variant='subtitle2' color='primary'>{message.title}</Typography>
                                            } 
                                            secondary={
                                                <>
                                                    <Typography variant='caption' style={{display: 'block'}}>{message.otherUser.firstName} {message.otherUser.lastName}</Typography>
                                                    <Typography variant='caption' style={{display: 'block'}}>{message.jobPostTime}</Typography>
                                                </>
                                                
                                            }/>
                                            {user.type === 'worker'
                                            ?  <ListItemSecondaryAction>
                                                    <Tooltip title="Apply" aria-label="add">
                                                        <IconButton edge="end" aria-label="apply" onClick={() => handleApplyForJob(message.jobId)}>
                                                            <TouchAppIcon color='secondary'/>
                                                        </IconButton>
                                                    </Tooltip>
                                                </ListItemSecondaryAction>
                                            : null
                                            }
                                        </ListItem>
                                        <Divider style={{padding: 0, marding: 0}}/>
                                        <Modal
                                            open={openApplyModal}
                                            onClose={handleCloseApplyModal}
                                            aria-labelledby="simple-modal-title"
                                            aria-describedby="simple-modal-description"
                                        >
                                            <div style={{width: '100%', height:'100%'}}>
                                                <ApplyJob job={job}/>
                                            </div>
                                           
                                        </Modal>
                                    </div>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={8} className={classes.grid}>
                        <Paper className={classes.paper2} elevation={3}>
                       
                            {allMessages[index]
                                ? <>
                                    {allMessages[index].messages.map((item, j) => (
                                        <div key={j} className={item.sender === user.type ? classes.me : classes.otherUser}>
                                            <Typography variant='caption' className={item.sender === user.type ? classes.meTypography : classes.otherUserTypography}>{item.body}</Typography>
                                            <Typography variant='caption' color='textSecondary' style={{ display: 'block', paddingTop: theme.spacing(2)}}>{moment(item.time).format('MMMM Do YYYY, h:mm a')}</Typography>
                                        </div>
                                    ))}
                                    </>
                                : 
                                    <div className={classes.select}>
                                        <Typography>Select an item to read</Typography>
                                    </div>
                            }
                            <div id='messagingPlatform'></div>
                        </Paper>
                        <Paper className={classes.paper3} elevation={3}>
                            <TextField
                                variant='outlined'
                                margin='normal'
                                fullWidth
                                label='Send a message'
                                name='message'
                                multiline
                                rows={2}
                                value={replyMessage}
                                onChange={e => setReplyMessage(e.target.value)}
                            />
                            <IconButton  onClick={() => handleSendMessage()} ><SendIcon color='secondary'/></IconButton>
                        </Paper>
                    </Grid>
            </Grid>
             <Snackbar open={openError} autoHideDuration={6000} onClose={handleErrorClose}>
             <Alert onClose={handleErrorClose} severity='error'>
                 {message}
             </Alert>
            </Snackbar>
            <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleSuccessClose}>
                <Alert onClose={handleSuccessClose} severity='success'>
                    {message}
                </Alert>
            </Snackbar>
            </>
            );
        }
    }
}




    //let unsubscribe

        // if (user) {
        //     if (user.type === 'client') {
        //         unsubscribe = firestore.collection('messages').where( 'clientId' ,'==', auth.currentUser.uid)
        //             .onSnapshot((snapshot) => {
        //                 setAllMessages([])
        //                 snapshot.forEach((info) => {
        //                     let messageHolder = info.data()
        //                     firebaseGetUserInfo(messageHolder.workerId)
        //                         .then((otherUser) => {
        //                             messageHolder['otherUser'] = otherUser
        //                             messageHolder['jobPostTime'] = moment(messageHolder.jobPostTime).format('MMMM Do YYYY, h:mm a')
        //                             messageHolder['docId'] = info.id
        //                             setAllMessages((prevState) => [messageHolder, ...prevState])
        //                             if(!loadMessage){
        //                                 setLoadMessage(messageHolder)
        //                             }
        //                         })
        //                         .catch((error) => {
        //                             setMessage('Sending message failed')
        //                             setOpenError(true)
        //                         })
        //                 })
        //             })

        //     } else if ((user.type === 'worker')) {
        //         unsubscribe = firestore.collection('messages').where( 'workerId' ,'==', auth.currentUser.uid)
        //             .onSnapshot((snapshot) => {
        //                 setAllMessages([])
                        
        //                 snapshot.forEach((info) => {
        //                     let messageHolder = info.data()
        //                     firebaseGetUserInfo(messageHolder.clientId)
        //                         .then((otherUser) => {
        //                             messageHolder['otherUser'] = otherUser
        //                             messageHolder['jobPostTime'] = moment(messageHolder.jobPostTime).format('MMMM Do YYYY, h:mm a')
        //                             messageHolder['docId'] = info.id
        //                             setAllMessages((prevState) => [messageHolder, ...prevState])
        //                             // console.log(loadMessage)
        //                             // if(!loadMessage){
        //                             //     setLoadMessage(messageHolder)
        //                             // }
        //                         })
        //                         .catch((error) => {
        //                             setMessage('Sending message failed')
        //                             setOpenError(true)
        //                         })
        //                 })

        //                 // snapshot.docChanges().forEach(function(change) {
        //                 //     if (change.type === "added") {
        //                 //         console.log("", change.doc.data());
        //                 //     }
        //                 //     if (change.type === "modified") {
        //                 //         console.log("Modified city: ", change.doc.data());
        //                 //     }
        //                 //     if (change.type === "removed") {
        //                 //         console.log("Removed city: ", change.doc.data());
        //                 //     }
        //                 // });

        //             })
        //     }
        // }

        // return () => {
        //     if (unsubscribe) {
        //         unsubscribe()
        //     }
        // };


        // if (user){

        //     let queryId = ''

        //     if (user.type === 'client') {
        //         queryId = 'clientId'
        //     } else if ((user.type === 'worker')) {
        //         queryId = 'workerId'
        //     }

        //     if (activateSubscribe) {
        //         unsubscribe = firestore.collection('messages').where( queryId ,'==', auth.currentUser.uid)
        //             .onSnapshot((snapshot) => {
        //                 snapshot.docChanges().forEach((change) => {
        //                     if (change.type === "added") {
        //                         console.log("add", change.doc.data());
        //                     }
        //                     if (change.type === "modified") {
        //                         console.log("modified", change.doc.data())
        //                         const modifiedMessage = change.doc.data()
        //                         // const originalMessage = allMessages.filter((msg) => msg.jobId === modifiedMessage.jobId).messages = modifiedMessage.messages
        //                         // const restMessages = allMessages.filter((msg) => msg.jobId !== modifiedMessage.jobId)
        //                         // setAllMessages([...originalMessage, ...restMessages])


        //                         // const newAllMessages = allMessages.map((msg, i) => {
        //                         //     if (msg.jobId === modifiedMessage.jobId){
        //                         //         msg.messages = modifiedMessage.messages
        //                         //     }
        //                         //         return msg
        //                         // })

        //                         // setAllMessages(newAllMessages)
        //                         // console.log(newAllMessages)
        //                         // console.log(loadMessageIndex)
        //                         // setLoadMessage(newAllMessages[loadMessageIndex], loadMessageIndex)
                                
        //                         setActivateSubscribe(false)

        //                     }
        //                     if (change.type === "removed") {
        //                         console.log("Remove: ", change.doc.data());
        //                     }
        //                 });
        //             })
        //     } else {
        //         firebaseGetUserMessages(user)
        //             .then((messages) => {
        //                 console.log('in get user')
        //                 setAllMessages(messages)
        //                 handleLoadMessage(messages[loadMessageIndex], loadMessageIndex)
        //             })
        //             .then(() => setActivateSubscribe(true))
        //             .catch((error) => {
        //                 setMessage('Sending message failed')
        //                 setOpenError(true)
        //             })
        //     }

        //     return () => {
        //         if (unsubscribe) {
        //             unsubscribe()
        //         }
        //     };



            // unsubscribe = firestore.collection('messages').where( queryId ,'==', auth.currentUser.uid)
            //     .onSnapshot((snapshot) => {
            //         snapshot.docChanges().forEach((change) => {
                        
            //             if (change.type === "added") {
                            
            //                 console.log("add", change.doc.data());
                            
            //                 let messageHolder = change.doc.data()

            //                 firebaseGetUserInfo(messageHolder.clientId)
            //                     .then((otherUser) => {
            //                         messageHolder['otherUser'] = otherUser
            //                         messageHolder['jobPostTime'] = moment(messageHolder.jobPostTime).format('MMMM Do YYYY, h:mm a')
            //                         messageHolder['docId'] = change.doc.id
            //                         setAllMessages((prevState) => [messageHolder, ...prevState])
            //                     })
            //                     .catch((error) => {
            //                         setMessage('Sending message failed')
            //                         setOpenError(true)
            //                     })

            //             }
            //             if (change.type === "modified") {
            //                 console.log("modified", change.doc.data())
            //                 const modifiedMessage = change.doc.data()

            //                 // const originalMessage = allMessages.filter((msg) => msg.jobId === modifiedMessage.jobId).messages = modifiedMessage.messages
            //                 // const restMessages = allMessages.filter((msg) => msg.jobId !== modifiedMessage.jobId)
            //                 // setAllMessages([...originalMessage, ...restMessages])

            //                 handleModifiedMessage(modifiedMessage)

            //                 // console.log(allMessages)

            //                 // const newAllMessages = allMessages.map((msg, i) => {
            //                 //     if (msg.jobId === modifiedMessage.jobId){
            //                 //         msg.messages = modifiedMessage.messages
            //                 //     }
            //                 //         return msg
            //                 // })

            //                 // setAllMessages(newAllMessages)
            //                 // console.log(newAllMessages)
            //                 // console.log(loadMessageIndex)
            //                 // setLoadMessage(newAllMessages[loadMessageIndex], loadMessageIndex)

            //             }
            //             if (change.type === "removed") {
            //                 console.log("Remove: ", change.doc.data());
            //             }
            //         });
            //     })
          
       // }