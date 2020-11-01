import React, {useState, useEffect, useContext} from 'react';
import { Button, Box, Typography, Card, CardActions, CardContent, Chip, Avatar, Tooltip, IconButton,
    List, ListItem, ListItemText, ListItemAvatar, Divider, Table, TableCell, TableContainer, TableBody,
    Paper, TableHead, TableRow } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firestore, auth, firebaseDeleteJob, firebaseAcceptOffer} from '../../api/Firebase'
import { UserContext } from '../../context/UserContext'
import moment from 'moment'
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';

export default function OldJobs({ setEdit, setJobToBeEdited }){
    
    const [OldJobs, setOldJobs] = useState([])
    const [showOffers, setShowOffers] = useState({})

    useEffect(() => {
    
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
        margin: {
            marginTop: theme.spacing(1), 
            marginBottom: theme.spacing(1)
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
        cardFlexEndRow: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
        }, 
        Item: {
            marginRight: theme.spacing(2),
        }, 
        cardSupportType: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexWrap: 'wrap',
        },
        avatar: {
            width: theme.spacing(7),
            height: theme.spacing(7),
            marginRight: theme.spacing(2)
        }, 
  
    }))

    const classes = useStyles()

    const handleEdit = (job) => {
        setEdit(true)
        setJobToBeEdited(job)
    }

    const handleOffers = (id) => {
        setShowOffers((prevState) => ({
            ...prevState,
            [id]: !prevState[id]
        }))
    }

    const handleAcceptOffer = (jobId, index) => {
        console.log(index)
        console.log(jobId)

        firebaseAcceptOffer(jobId, index)
        
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
                        <Typography variant="body2" component="p" gutterBottom>
                            {job.supportActivities}
                        </Typography>
                        <div className={classes.cardMiddleRow}>
                            <div className={classes.cardSupportType}>
                                {job.supportType.map((item, j) => (
                                    <Box key={j}>
                                        <Chip label={item} className={classes.cardItem} />
                                    </Box>
                                ))}
                            </div>
                        </div>
                        <div className={classes.cardMiddleRow}>
                            <Chip label={job.status} style={{ color: job.status === 'Open' ? 'green' : 'red' }} className={classes.cardItem} />
                            <Chip label={job.jobType} className={classes.cardItem} />
                            <Chip label={job.hours} className={classes.cardItem} />
                            <Chip label={job.genderPreference} className={classes.cardItem} />
                        </div>
                        <div className={classes.cardMiddleRow}>
                            {job.supportTime === "No"
                                ? <Chip label='Flexible' className={classes.cardItem} />
                                : <div className={classes.cardSupportType}>
                                    {job.particularSupportTime.map((item, j) => (
                                        <Box key={j}>
                                            <Chip label={`${item.day} ${item.time}`} className={classes.cardItem} />
                                        </Box>
                                    ))}
                                </div>}
                        </div>
                        <div className={classes.cardMiddleRow}>
                            {job.offers.length === 0
                                ? <Chip label='No offers' className={classes.cardItem} style={{ color: 'red' }} />
                                : <Tooltip title="click to see offers" aria-label="offers">
                                    <Chip
                                        avatar={<Avatar>{job.offers.length}</Avatar>}
                                        label={job.offers.length > 1 ? 'Offers' : 'Offer'}
                                        onClick={() => handleOffers(i)}
                                        variant="outlined"
                                        style={{ color: 'green' }}
                                    />
                                </Tooltip>
                            }
                        </div>
                        <div className={classes.cardMiddleRow}>
                        {showOffers[i]
                            ?    <List component="nav" dense aria-label="mailbox folders" style={{ width: '100%'}}>
                                    <Divider style={{padding: 0, marding: 0}}/>
                                    {job.offers.map((offer, j) => (
                                        <div key={j}>
                                            <ListItem key={j} alignItems="flex-start">
                                                <ListItemAvatar >
                                                    <Avatar src={offer.avatar} className={classes.avatar}/>
                                                </ListItemAvatar>
                                                <ListItemText 
                                                    primary={
                                                        <Typography variant='subtitle2' color='primary'>{offer.name}</Typography>
                                                    } 
                                                    secondary={
                                                            <Typography variant='caption'><span style={{ color: theme.palette.primary.main }}>Hourly rate: </span>{offer.rate}</Typography>
                                                    }
                                                />
                                                {job.status === 'Open'
                                                    ? <Tooltip title="Accept offer" aria-label="accept">
                                                            <IconButton edge="end" aria-label="apply" onClick={() => handleAcceptOffer(job.id, j)} >
                                                                <DoneOutlineIcon color='secondary'/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    : <Typography variant='caption' style={{ color: offer.status === 'Accepted' ? 'green' : 'red'}}>{offer.status}</Typography>
                                                }
                                                
                                            </ListItem>
                                            <TableContainer component={Paper} className={classes.margin}>
                                                <Table size="small" aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Day</TableCell>
                                                            <TableCell>From</TableCell>
                                                            <TableCell>To</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {offer.particularSupportTime.map((row, k) => (
                                                            <TableRow key={k}>
                                                                <TableCell component="th" scope="row">
                                                                    {job.jobType === 'Ongoing'
                                                                        ? row.day
                                                                        : moment(new Date(row.day)).format("DD/MM/YYYY")
                                                                    }
                                                                </TableCell>
                                                                <TableCell>{moment(new Date(row.from)).format('LT')}</TableCell>
                                                                <TableCell>{moment(new Date(row.to)).format('LT')}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <Divider style={{padding: 0, marding: 0}}/>
                                        </div>
                                    ))}
                                </List>
                            : null
                        }
                        </div>
                    </CardContent>
                    <CardActions className={classes.cardTopRow}>
                        <div>
                            <Button size="small" variant='outlined' color='secondary' style={{ marginRight: theme.spacing(1) }} onClick={() => handleEdit(job)}>Edit</Button>
                            <Button size="small" variant='outlined' color='secondary' onClick={() => firebaseDeleteJob(job.postTime)}>Delete</Button>
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