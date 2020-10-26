import React, {useState, useEffect, useContext} from 'react';
import { Button, Box, Typography, Card, CardActions, CardContent,
    Switch, CircularProgress, Container} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firestore, auth, firebaseDeleteJob} from '../../api/Firebase'
import { UserContext } from '../../context/UserContext'
import moment from 'moment'

export default function OldJobs({ setEdit, setJobToBeEdited }){
    
    const [OldJobs, setOldJobs] = useState([])

    useEffect(() => {
        console.log('i am in old jobs')
        const unsubscribeOldJobs = firestore.collection('jobs').where( 'clientId' ,'==', auth.currentUser.uid)
            .onSnapshot((snapshot) => {
                let jobHolder = []
                snapshot.forEach((job) => {
                        console.log(job.data())
                        jobHolder.push(job.data())
                })
                setOldJobs(jobHolder.reverse())
        })

        return () => {
            unsubscribeOldJobs()
          };

    }, [])

    const theme = useTheme()
    //const { jobs, addJobs} = useContext(UserContext)

    const useStyles = makeStyles(() => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        card: {
            width: '100%',
            marginTop: theme.spacing(2)
        }, 
        cardTopRow: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        cardMiddleRow: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginTop: theme.spacing(2),
        },
        cardItem: {
            background: '#fafafa', 
            padding: theme.spacing(1),
            marginRight: theme.spacing(2),
            borderRadius: 5
        }, 
        cardSupportType: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexWrap: 'wrap',
        }
  
    }))

    const classes = useStyles()

    const handleEdit = (job) => {
        setEdit(true)
        setJobToBeEdited(job)
    }


    return (
        <div className={classes.root}>
            {OldJobs.map((job, i) => (
                <Card key={i} className={classes.card} variant="outlined">
                    <CardContent>
                        <div className={classes.cardTopRow}>
                            <Typography className={classes.title} color="primary" gutterBottom>
                                {job.title}
                            </Typography>
                            <Typography variant='caption' gutterBottom>{job.address}</Typography>
                        </div>
                        <Typography variant="body2" component="p"  gutterBottom>
                            {job.supportActivities}
                        </Typography>
                        <div className={classes.cardMiddleRow}>
                            <div className={classes.cardSupportType}>
                            {job.supportType.map((item, i) => (
                                <Box key={i}>
                                    <Typography variant='caption' className={classes.cardItem}>{item}</Typography>
                                </Box>
                            ))}
                            </div>
                        </div>
                        <div className={classes.cardMiddleRow}>
                            <Typography variant='caption' className={classes.cardItem} style={{color: job.status === 'Open' ? 'green' : 'red'}}>{job.status}</Typography>
                            <Typography variant='caption' className={classes.cardItem}>{job.jobType}</Typography>
                            <Typography variant='caption' className={classes.cardItem}>{job.hours}</Typography>
                            <Typography variant='caption' className={classes.cardItem}>{job.genderPreference}</Typography>
                        </div>
                        <div className={classes.cardMiddleRow}>
                            {job.supportTime === "No" 
                            ? <Typography variant='caption' className={classes.cardItem}>Flexible</Typography> 
                            : <div className={classes.cardSupportType}>
                                    {job.particularSupportTime.map((item, i) => (
                                        <Box key={i}>
                                            <Typography variant='caption' className={classes.cardItem}>{item.day} {item.time}</Typography>
                                        </Box>
                                    ))}
                                    </div>}
                                </div>
                    </CardContent>
                    <CardActions className={classes.cardTopRow}>
                        <div>
                            <Button size="small" variant='outlined' color='primary' style={{marginRight: theme.spacing(1)}} onClick={() => handleEdit(job)}>Edit</Button>
                            <Button size="small" variant='outlined' color='primary' onClick={() => firebaseDeleteJob(job.postTime)}>Delete</Button>
                        </div>
                        <Typography variant='subtitle2' color="textSecondary" gutterBottom>
                                {moment.duration(moment().diff(moment(job.postTime))).asHours() > 24 ? moment(job.postTime).format('MMMM Do YYYY, h:mm:ss a') : moment(job.postTime).fromNow()}
                        </Typography>
                    </CardActions>
              </Card>
            ))}
        </div>
    );
}