import React, { useState, useEffect } from 'react'
import {
  Button, TextField, Link, Typography, Card, CardActions, CardContent, Avatar, IconButton, Box, Collapse,
  useMediaQuery,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import EventIcon from '@material-ui/icons/Event'
import AccessibleIcon from '@material-ui/icons/Accessible'
import ScheduleIcon from '@material-ui/icons/Schedule'
import LoopIcon from '@material-ui/icons/Loop'
import WcIcon from '@material-ui/icons/Wc'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import moment from 'moment'
import { firestore, auth, firebaseSendMessage } from '../../../api/Firebase'
import { keyIdGenerator } from '../../../api/RandomId'
import { useAlert } from '../../../context/AlertContext'

export default function WorkerJobBoard() {
  const [openJobs, setOpenJobs] = useState([])
  const [expandCard, setExpandCard] = useState({})
  const [enquire, setEnquire] = useState({})
  const [enquiryMessage, setEnquiryMessage] = useState('')

  const theme = useTheme()
  const { showErrorAlert } = useAlert()
  const matches = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    const unsubscribe = firestore.collection('jobs').where('status', '==', 'Open')
      .onSnapshot((snapshot) => {
        const jobHolder = []

        snapshot.forEach((job) => {
          jobHolder.push(job.data())
        })
        setOpenJobs(jobHolder.reverse())
      })

    return () => {
      unsubscribe()
    }
  }, [])

  const useStyles = makeStyles(() => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '80%',
      [theme.breakpoints.down('md')]: {
        width: '90%',
      },
    },
    margin: {
      marginTop: theme.spacing(2),
    },
    card: {
      width: '100%',
      marginTop: theme.spacing(2),
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
    cardFlexStartColumn: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    avatar: {
      width: theme.spacing(7),
      height: theme.spacing(7),
      marginRight: theme.spacing(2),
    },
  }))

  const classes = useStyles()

  const handleExpandCard = (id) => {
    setExpandCard((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }))
  }

  const handleEnquire = (id) => {
    setEnquire((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
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
        time: Date.now(),
      }],
    }

    console.log(messageObject)

    firebaseSendMessage(messageObject)
      .catch((error) => {
        if (error.message) {
          showErrorAlert(error.message)
        } else {
          showErrorAlert('Failed to send message. Please contact Kindle support')
        }
      })

    setEnquiryMessage('')
    setEnquire(false)
  }

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.margin} gutterBottom>Open Jobs</Typography>
      {openJobs.map((job, i) => (
        <div key={keyIdGenerator()} className={classes.card} id={`openJobsCard${i}`}>
          <Card variant="outlined">
            <CardContent>
              <div className={matches ? classes.cardFlexStartColumn : classes.cardSpaceBetweenRow}>
                <Box mt={2} className={classes.cardFlexStartRow}>
                  <Avatar alt={job.name} src={job.avatar} className={classes.avatar} />
                  <Typography variant="subtitle1" color="primary">
                    <Link
                      href={`/profile/${job.name}`}
                    >
                      {job.name}
                    </Link>
                  </Typography>
                </Box>
                <Typography variant={matches ? 'caption' : 'subtitle2'} color="textSecondary">
                  {moment.duration(moment().diff(moment(job.postTime))).asHours() > 24 ? moment(job.postTime).format('MMMM Do YYYY, h:mm a') : moment(job.postTime).fromNow()}
                </Typography>
              </div>
              <div className={classes.cardSpaceBetweenRow}>
                <Typography variant="subtitle2" color="primary" className={classes.margin}>
                  {job.title}
                </Typography>
                <Typography variant="caption">{job.address}</Typography>
              </div>
              <Box mt={2}>
                <Typography variant="body2" component="p">
                  {job.supportActivities}
                </Typography>
                <Collapse in={expandCard[i]}>
                  <Box mt={2}>
                    <Box mt={2} className={classes.cardFlexStartRow}>
                      <AccessibleIcon color="secondary" />
                      <div className={matches ? classes.cardFlexStartColumn : null}>
                        {job.supportType.map((item) => (
                          <Typography key={keyIdGenerator()} variant="caption" style={{ marginLeft: theme.spacing(2) }}>{item}</Typography>
                        ))}
                      </div>
                    </Box>
                    <Box mt={2} className={classes.cardFlexStartRow}>
                      <LoopIcon color="secondary" />
                      <Typography variant="caption" style={{ marginLeft: theme.spacing(2) }}>{job.jobType}</Typography>
                    </Box>
                    <Box mt={2} className={classes.cardFlexStartRow}>
                      <ScheduleIcon color="secondary" />
                      <Typography variant="caption" style={{ marginLeft: theme.spacing(2) }}>{job.hours}</Typography>
                    </Box>
                    <Box mt={2} className={classes.cardFlexStartRow}>
                      <EventIcon color="secondary" />
                      {job.supportTime === 'No'
                        ? <Typography variant="caption">Flexible</Typography>
                        : (
                          <>
                            {job.particularSupportTime.map((item) => (
                              <Typography key={keyIdGenerator()} variant="caption" style={{ marginLeft: theme.spacing(2) }}>
                                {item.day}
                                {' '}
                                {item.time}
                              </Typography>
                            ))}
                          </>
                        )}
                    </Box>
                    <Box mt={2} className={classes.cardFlexStartRow}>
                      <WcIcon color="secondary" />
                      <Typography variant="caption" style={{ marginLeft: theme.spacing(2) }}>
                        {job.genderPreference}
                        {' '}
                        support Preferred
                      </Typography>
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            </CardContent>
            <CardActions className={classes.cardSpaceBetweenRow}>
              <div>
                <Collapse in={!enquire[i]}>
                  <Button size="small" variant="contained" style={{ marginRight: theme.spacing(1) }} onClick={() => handleEnquire(i)}>Enquire</Button>
                </Collapse>
              </div>
              <IconButton onClick={() => handleExpandCard(i)}>
                {expandCard[i]
                  ? <ExpandLessIcon />
                  : <ExpandMoreIcon />}
              </IconButton>
            </CardActions>
          </Card>
          <Collapse in={enquire[i]}>
            <Card className={classes.card} variant="outlined">
              <CardContent>
                <div className={classes.cardFlexEndRow}>
                  <IconButton onClick={() => handleEnquire(i)} style={{ margin: 0, padding: 0 }}>
                    <HighlightOffIcon />
                  </IconButton>
                </div>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Send a message"
                  name="message"
                  multiline
                  rows={2}
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                />
              </CardContent>
              <CardActions>
                <Button size="small" variant="contained" onClick={() => handleSendMessage(job)} style={{ marginRight: theme.spacing(1) }}>Send</Button>
              </CardActions>
            </Card>
          </Collapse>
        </div>
      ))}
    </div>
  )
}
