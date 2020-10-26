import React, { useState, useEffect, useContext } from 'react';
import { Button, Typography, Paper, FormLabel, TextField, Snackbar, Grid, Avatar, ListItemAvatar,
    Checkbox, Link, Box, List, ListItem, Divider, ListItemText, IconButton} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert';
import { UserContext } from '../context/UserContext'
import { firestore, auth, firebaseGetUserInfo, firebaseReplyMessage} from '../api/Firebase'
import { Redirect } from "react-router-dom"
import Registration from './Registration'
import EmailIcon from '@material-ui/icons/Email'
import SendIcon from '@material-ui/icons/Send'
import moment from 'moment'
import { Restaurant } from '@material-ui/icons';

export default function Messages({ history }) {
    
    const [openError, setOpenError] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [allMessages, setAllMessages] = useState([])
    const [loadMessage, setLoadMessage] = useState(null)
    const [replyMessage, setReplyMessage] = useState('')

    useEffect(() => {

        // let unsubscribe

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

        //             setAllMessages([])

        //             snapshot.forEach((info) => {
        //                 let messageHolder = info.data()
        //                 firebaseGetUserInfo(messageHolder.clientId)
        //                     .then((otherUser) => {
        //                         messageHolder['otherUser'] = otherUser
        //                         messageHolder['jobPostTime'] = moment(messageHolder.jobPostTime).format('MMMM Do YYYY, h:mm a')
        //                         messageHolder['docId'] = info.id
        //                         setAllMessages((prevState) => [messageHolder, ...prevState])
        //                         // console.log(loadMessage)
        //                         // if(!loadMessage){
        //                         //     setLoadMessage(messageHolder)
        //                         // }
        //                     })
        //                     .catch((error) => {
        //                         setMessage('Sending message failed')
        //                         setOpenError(true)
        //                     })
        //             })
        //         })
        //     }
        // }

        // return () => {
        //     if (unsubscribe) {
        //         unsubscribe()
        //     }
        // };

    }, [])

    const theme = useTheme()
    const { user } = useContext(UserContext)

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
            height: '60%', 
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
        me: {
            textAlign: 'right',
            padding: theme.spacing(2),
        },
        meTypography:{
             background: theme.palette.primary.light,
             padding: theme.spacing(2),
             borderRadius: 20,
        },
        otherUser: {
            padding: theme.spacing(2),
            textAlign: 'left'
        }, 
        otherUserTypography: {
            background: theme.palette.secondary.light,
            padding: theme.spacing(2),
            borderRadius: 20,
        }

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

    const handleLoadMessage = (selectedMessage) => {
        setLoadMessage(selectedMessage)
    }

    const handleSendMessage = () => {
        
        const messageObject = {
            body: replyMessage,
            sender: user.type, 
            time: Date.now()
        }

        firebaseReplyMessage(loadMessage.docId, messageObject)
            .catch((error) => {
                console.log(error)
                setMessage('Sending message failed')
                setOpenError(true)
            })

            setReplyMessage('')
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
                    <Grid item xs={3} className={classes.grid}>
                        <Paper className={classes.paper1} elevation={3}>
                            <EmailIcon color='secondary' style={{ fontSize: 50, marginTop: theme.spacing(2) }}/>
                            <List component="nav" dense aria-label="mailbox folders" style={{ width: '100%'}}>
                                {allMessages.map((message, i) => (
                                    <div key={i}>
                                        <ListItem button onClick={() => handleLoadMessage(message)}>
                                            <ListItemAvatar >
                                                <Avatar src={message.otherUser.avatar}/>
                                            </ListItemAvatar>
                                            <ListItemText 
                                            primary={
                                                <Typography variant='subtitle2' color='primary'>{message.otherUser.firstName} {message.otherUser.lastName}</Typography>
                                            } 
                                            secondary={
                                                <>
                                                <Typography variant='caption' style={{display: 'block'}}>{message.title}</Typography>
                                                <Typography variant='caption' style={{display: 'block'}}>{message.jobPostTime}</Typography>
                                                </>
                                                
                                            }/>
                                        </ListItem>
                                        <Divider style={{padding: 0, marding: 0}}/>
                                    </div>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={9} className={classes.grid}>
                        <Paper className={classes.paper2} elevation={3}>
                            {loadMessage
                                ? <>
                                    {loadMessage.messages.map((item, j) => (
                                        <div key={j} className={item.sender === user.type ? classes.me : classes.otherUser}>
                                            <Typography variant='caption' className={item.sender === user.type ? classes.meTypography : classes.otherUserTypography}>{item.body}</Typography>
                                            <Typography variant='caption' color='textSecondary' style={{ display: 'block', paddingTop: theme.spacing(2)}}>{moment(item.time).format('MMMM Do YYYY, h:mm a')}</Typography>
                                        </div>
                                    ))}
                                    </>
                                
                                : null
                            }
                           
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