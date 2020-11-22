import React, {useState, useEffect, useContext} from 'react'
import { Button, TextField, Link, Paper, Box, Grid, Typography, Card, CardActions, CardContent,
     Avatar, Icon, IconButton, Snackbar} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import EventIcon from '@material-ui/icons/Event'
import AccessibleIcon from '@material-ui/icons/Accessible'
import ScheduleIcon from '@material-ui/icons/Schedule'
import LoopIcon from '@material-ui/icons/Loop'
import WcIcon from '@material-ui/icons/Wc'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firestore, auth, firebaseSendMessage } from '../../api/Firebase'
import { UserContext } from '../../context/UserContext'
import moment from 'moment'
import userEvent from '@testing-library/user-event'

export default function OpenJobs({ setEdit, setJobId }){
    
    const [openError, setOpenError] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [openJobs, setOpenJobs] = useState([])
    const [expandCard, setExpandCard] = useState({})
    const [enquire, setEnquire] = useState({})
    const [enquiryMessage, setEnquiryMessage] = useState('')

    useEffect(() => {

        const unsubscribe = firestore.collection('jobs').where( 'status' ,'==', 'Open')
            .onSnapshot((snapshot) => {
                let jobHolder = []
                snapshot.forEach((job) => {
                        jobHolder.push(job.data())
                })
                setOpenJobs(jobHolder.reverse())
        })

        return () => {
            unsubscribe()
          }

    }, [])

    const theme = useTheme()
    const { user } = useContext(UserContext)

    const useStyles = makeStyles(() => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '60%'
        },
        margin: {
            marginTop: theme.spacing(2)
        },
        card: {
            width: '100%',
            marginTop: theme.spacing(2)
        }, 
        cardSpaceBetweenRow: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        cardFlexStartRow: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginTop: theme.spacing(2),
        },
        cardItem: {
            marginRight: theme.spacing(2),
        }, 
        cardFlexEndRow: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
        }, 
        avatar: {
            width: theme.spacing(7),
            height: theme.spacing(7),
            marginRight: theme.spacing(2)
        }, 
        details: {
            marginTop: theme.spacing(2)
        },
        hr: {
            border: 0,
            height: '1px',
            background: 'rgba(0, 0, 0, 0.54)',
            backgroundImage: 'linear-gradient(to right, #ccc, rgba(0, 0, 0, 0.54), #ccc)',
            margin: theme.spacing(2)
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


    const handleExpandCard = (id) => {

        // document.getElementById(`openJobsCard${id}`).scrollIntoView({block: "start"});
        // console.log(`openJobsCard${id}`)
        //document.getElementById('kindleApp').scrollIntoView();

        setExpandCard((prevState) => ({
            ...prevState,
            [id]: !prevState[id]
        }))
    }

    const handleEnquire = (id) => {
        setEnquire((prevState) => ({
            ...prevState,
            [id]: !prevState[id]
        }))
    }

    const handleSendMessage = (job) => {
        
        const messageObject = {
            workerId: auth.currentUser.uid, 
            clientId: job.clientId,
            title: job.title,
            jobId: job.jobId,
            jobPostTime: job.postTime,
            status: 'new',
            messages: [{
                body: enquiryMessage,
                sender: 'worker',
                time: Date.now()
            }]
        }

        console.log(messageObject)

        firebaseSendMessage(messageObject)
            .catch((error) => {
                console.log(error)
                setMessage('Sending message failed')
                setOpenError(true)
            })

            setEnquiryMessage('')
            setEnquire(false)
    }

    return (
        <div className={classes.root}>
            <Typography variant='h6' className={classes.margin} gutterBottom>Open Jobs</Typography>
            {openJobs.map((job, i) => (
                <div key={i} className={classes.card} id={`openJobsCard${i}`}>
                    <Card variant="outlined" >
                        <CardContent>
                            <div className={classes.cardSpaceBetweenRow} >
                                <div className={classes.cardFlexStartRow}>
                                    <Avatar alt={job.name} src={job.avatar} className={classes.avatar} />
                                    <Typography variant='subtitle1' color="primary">
                                        <Link
                                            href={`/profile/${job.name}`}
                                        >
                                            {job.name}
                                        </Link>
                                    </Typography>
                                </div>
                                <Typography variant='subtitle2' color="textSecondary">
                                    {moment.duration(moment().diff(moment(job.postTime))).asHours() > 24 ? moment(job.postTime).format('MMMM Do YYYY, h:mm a') : moment(job.postTime).fromNow()}
                                </Typography>
                            </div>
                            <div className={classes.cardSpaceBetweenRow}>
                                <Typography variant='subtitle2' color="primary" className={classes.margin}>
                                    {job.title}
                                </Typography>
                                <Typography variant='caption'>{job.address}</Typography>
                            </div>
                            <div style={{ padding: theme.spacing(1) }}>
                                <Typography variant="body2" component="p" >
                                    {job.supportActivities}
                                </Typography>
                                {expandCard[i]
                                    ?
                                    <div className={classes.details}>
                                        <div className={classes.cardFlexStartRow}>
                                            <AccessibleIcon color='secondary'/>
                                            {job.supportType.map((item, j) => (
                                                <Typography key={j} variant='caption' style={{ marginLeft: theme.spacing(2) }}>{item}</Typography>
                                            ))}
                                        </div>
                                        <div className={classes.cardFlexStartRow}>
                                            <LoopIcon color='secondary'/>
                                            <Typography variant='caption' style={{ marginLeft: theme.spacing(2) }}>{job.jobType}</Typography>
                                        </div>
                                        <div className={classes.cardFlexStartRow}>
                                            <ScheduleIcon color='secondary'/>
                                            <Typography variant='caption' style={{ marginLeft: theme.spacing(2) }}>{job.hours}</Typography>
                                        </div>
                                        <div className={classes.cardFlexStartRow}>
                                            <EventIcon color='secondary'/>
                                            {job.supportTime === "No"
                                                ? <Typography variant='caption'>Flexible</Typography>
                                                : <>
                                                    {job.particularSupportTime.map((item, j) => (
                                                        <Typography key={j} variant='caption' style={{ marginLeft: theme.spacing(2) }}>{item.day} {item.time}</Typography>
                                                    ))}
                                                </>}
                                        </div>
                                        <div className={classes.cardFlexStartRow}>
                                            <WcIcon color='secondary'/>
                                            <Typography variant='caption' style={{ marginLeft: theme.spacing(2) }}>{job.genderPreference} support Preferred</Typography>
                                        </div>
                                    </div>
                                    : null
                                }
                            </div>
                        </CardContent>
                        <CardActions className={classes.cardSpaceBetweenRow}>
                            <div>
                            {enquire[i]
                                ? null
                                : <Button size="small" variant='outlined' color='primary' style={{ marginRight: theme.spacing(1) }} onClick={() => handleEnquire(i)}>Enquire</Button>
                            }
                            </div>
                            <IconButton onClick={() => handleExpandCard(i)}>
                                {expandCard[i]
                                    ? <ExpandLessIcon />
                                    : <ExpandMoreIcon />
                                }
                            </IconButton>
                        </CardActions>
                    </Card>
                    {enquire[i]
                        ? <Card className={classes.card} variant="outlined">
                                <CardContent>
                                    <div className={classes.cardFlexEndRow}>
                                        <IconButton onClick={() => handleEnquire(i)} style={{margin: 0, padding: 0}}>
                                            <HighlightOffIcon />
                                        </IconButton>
                                    </div>
                                    <TextField
                                        variant='outlined'
                                        margin='normal'
                                        required
                                        fullWidth
                                        label='Send a message'
                                        name='message'
                                        multiline
                                        rows={2}
                                        value={enquiryMessage}
                                        onChange={e => setEnquiryMessage(e.target.value)}
                                    />
                                </CardContent>
                                <CardActions >
                                    <Button size="small" variant='outlined' color='primary' onClick={() => handleSendMessage(job)} style={{ marginRight: theme.spacing(1) }}>Send</Button>
                                </CardActions>
                            </Card>
                        :   null
                    }
                </div>
            ))}
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
        </div>
    )
}