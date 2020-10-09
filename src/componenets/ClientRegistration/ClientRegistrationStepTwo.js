import React, { useState, useEffect } from 'react';
import { Typography, Button, RadioGroup, Radio, FormControlLabel, FormGroup, TextField, MenuItem, Snackbar, Checkbox, Tooltip} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firebaseAddDisabilityInfo } from '../../api/Firebase'

export default function ClientRegistrationStepTwo({ activeStep, setActiveStep }) {
    const [openError, setOpenError] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [supportTime, setSupportTime] = useState('')
    const supportTimeEachWeekArray = ['0 - 5 hours per week', '6 - 10 hours per week', '11 - 15 hours per week', 
        '16 - 20 hours per week', '21 - 25 hours per week', '26 - 30 hours per week', '30+ hours per week']
    const [disability, setDisability] = useState('')
    const [supportType, setSupportType] = useState([])
    const supportTypeArray = [{title: "Help around the house", toolTip: 'Help around the house is important for you to be able to remain independently at home. This might include help in the graden, home-office duties and keeping the house tidy by assisting with laundry, taking out the rubbish or feeding pets.'},
        {title: "In-home care", toolTip: 'In-home care is important to help you maintain your independence. This includes assistance with morning and evening routines, showring and toileting, mealtime preparation and medication reminders.'}, 
        {title: "Personal care", toolTip: 'Personal care and hygiene support is important for maintaining an active and social lifestyle. This might include toileting (in the home or out in the community) and mealtime assistance'}, 
        {title: "Outdoor care", toolTip: 'This might include anything from shopping to fitness, to joining a new community group to social events.'}, 
        {title: "Education, training and employment", toolTip: 'This might include assisting you at school, in the classroom or in the playground, at university or TAFE, in the workplace or to develop new skills.'}, 
        {title: "Therapy support", toolTip: 'Therapy support is designed to help you if you have an early intervention, developmental services, physiotherapy, occupational therapy or speech pathology plan. Your worker will follow your individualised program to help with the ongoing implementation of your therapy at home and in other environments.'}, 
        {title: "Transport", toolTip: "Transport support is helping you to get ready, accompanying and providing assistance at the destination, and ensuring you return home safely. Depending on your worker's preference this might be in your car or theirs."}]
    const [behaviourSupport ,setBehaviourSupport] = useState('')
    const restrictivePracticesTooltip = "A restrictive practice is any practice or intervention that has the effect of restricting the rights of freedom of movement of a person with disability, with the primary purpose of protecting the person or others from harm. This could include seclusion, using medication to influence a person's behaviour, using physical force to restrain a person, using equipment to restrain someone's movement or preventing access to certain places."
    const [restrictivePractices, setRestrictivePractices] = useState('')
    const [medication, setMedication] = useState('')
    const [administerMedication, setAdministerMedication] = useState('')
    const [genderPreference, setGenderPreference] = useState('')

    useEffect(() => {
        document.getElementById('kindleApp').scrollIntoView();
    }, [])

    const theme = useTheme()

    const useStyles = makeStyles(() => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flexGrow: 1,
            width: '100%',
            marginTop: theme.spacing(2)
        },
        margin: {
            marginTop: theme.spacing(2)
        },
        padding: {
            padding: theme.spacing(2)
        },
        backButton: {
            marginRight: theme.spacing(1),
        },
        buttons: {
            width: '100%', 
            marginTop: theme.spacing(4), 
            display: 'flex', 
            justifyContent: 'center'
        },
        time: {
            marginTop: theme.spacing(10),
            width: '50%'
        }, 
        disabilty:{
            marginTop: theme.spacing(2),
            width: '50%' 
        }, 
        supportType:{
            marginTop: theme.spacing(2),
            width: '50%' 
        },
        behaviourSupport:{
            marginTop: theme.spacing(2),
            width: '50%' 
        }, 
        medication: {
            marginTop: theme.spacing(2),
            width: '50%' 
        }, 
        gender: {
            marginTop: theme.spacing(2),
            width: '50%' 
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

    const handleNext = () => {
        const check = checkFields()
        const disabilityInfo = {
            supportTime,
            disability,
            supportType,
            behaviourSupport,
            restrictivePractices,
            medication,
            administerMedication,
            genderPreference
        }

        if (true){
            firebaseAddDisabilityInfo(disabilityInfo)
                .then(() => setActiveStep((prevActiveStep) => prevActiveStep + 1))
                .catch((error) => {
                    setMessage(error)
                    setOpenError(true)
                })
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSupportTypeChange = (e) => {
        let supportTypeHolder = supportType
        
        if (e.target.checked){
            supportTypeHolder.push(e.target.value)
        } else {
            supportTypeHolder = supportTypeHolder.filter((item) => item !== e.target.value)
        }

        setSupportType(supportTypeHolder)
    }

    const checkFields = () => {
        if (supportTime) {
            if (disability) {
                console.log(supportType.length)
                if (supportType.length >= 1) {
                    console.log('i am in')
                    if (behaviourSupport) {
                        if (behaviourSupport === 'Yes' && restrictivePractices || behaviourSupport === 'No') {
                            if (medication) {
                                if (medication === 'Yes' && administerMedication || medication === 'No') {
                                    if (genderPreference) {
                                        return true
                                    } else {
                                        setMessage('Please make sure you have selected a gender preference')
                                        setOpenError(true)
                                        return false
                                    }
                                } else {
                                    setMessage('Please make sure you have selected whether you need woker to administer medication')
                                    setOpenError(true)
                                    return false
                                }
                            } else {
                                setMessage('Please make sure you have selected whether you take prescribed medication')
                                setOpenError(true)
                                return false
                            }
                        } else {
                            setMessage('Please make sure you have selected whether you need restrictive practices')
                            setOpenError(true)
                            return false
                        }
                    } else {
                        setMessage('Please make sure you have selected whether you need positive behaviour support')
                        setOpenError(true)
                        return false
                    }
                } else {
                    setMessage('Please make sure you have selected one or more support type')
                    setOpenError(true)
                    return false
                }
            } else {
                setMessage('Please make sure you have wrote a little bit about your disability')
                setOpenError(true)
                return false
            }
        } else {
            setMessage('Please make sure you have selected how much support you need each week')
            setOpenError(true)
            return false
        }
    }

    return (
        <div className={classes.root}>
            <div className={classes.time}>
                <Typography variant='subtitle1' color='primary'>1) How much one to one support do you need each week ?</Typography>
                <TextField
                    fullWidth
                    select
                    size='small'
                    label='Select a period'
                    value={supportTime}
                    onChange={e => setSupportTime(e.target.value)}
                    variant='outlined'
                    className={classes.margin}
                >
                    {supportTimeEachWeekArray.map((option, i) => (
                        <MenuItem key={i} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
            <div className={classes.disabilty}>
                <Typography variant='subtitle1' color='primary'>2) Tell us a little bit more about your disability ?</Typography>
                <TextField
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    id='bio'
                    label='disability'
                    name='bio'
                    multiline
                    rows={7}
                    onChange={e => setDisability(e.target.value)}
                />
            </div>
            <div className={classes.supportType}>
                <Typography variant='subtitle1' color='primary'>3) What type of support do you need ?</Typography>
                <FormGroup>
                    {supportTypeArray.map((item, i) => (
                        <Tooltip key={i} title={item.toolTip} arrow placement="bottom-start">
                            <FormControlLabel
                                control={<Checkbox onChange={handleSupportTypeChange} color='primary' value={item.title} name={item.title} />}
                                label={item.title}
                            />
                        </Tooltip>
                    ))}
                </FormGroup>
            </div>
            <div className={classes.behaviourSupport}>
                <Typography variant='subtitle1' color='primary'>4) Do you require any positive behaviour support ?</Typography>
                <RadioGroup onChange={(e) => setBehaviourSupport(e.target.value)}>
                    <FormControlLabel value='Yes' control={<Radio color='primary' />} label='Yes' />
                    <FormControlLabel value='No' control={<Radio color='primary' />} label='No' />
                </RadioGroup>
                { behaviourSupport === 'Yes' ? 
                <div className={classes.padding}>
                        <Tooltip title={restrictivePracticesTooltip} arrow placement="right-start">
                        <Typography variant='subtitle2' color='primary'>Will any of the workers be required to use restrictive practices ?</Typography>
                        </Tooltip>
                        <RadioGroup onChange={(e) => setRestrictivePractices(e.target.value)}>
                            <FormControlLabel value='Yes' control={<Radio color='primary' />} label='Yes' />
                            <FormControlLabel value='No' control={<Radio color='primary' />} label='No' />
                        </RadioGroup>
                </div>
                : null
                    }
            </div>
            <div className={classes.medication}>
                <Typography variant='subtitle1' color='primary'>5) Do you take any prescribed medication ?</Typography>
                <RadioGroup onChange={(e) => setMedication(e.target.value)}>
                    <FormControlLabel value='Yes' control={<Radio color='primary' />} label='Yes' />
                    <FormControlLabel value='No' control={<Radio color='primary' />} label='No' />
                </RadioGroup>
                { medication === 'Yes' ? 
                <div className={classes.padding}>
                        <Typography variant='subtitle2' color='primary'>Will any of the workers be required to administer medication ?</Typography>
                        <RadioGroup onChange={(e) => setAdministerMedication(e.target.value)}>
                            <FormControlLabel value='Yes' control={<Radio color='primary' />} label='Yes' />
                            <FormControlLabel value='No' control={<Radio color='primary' />} label='No' />
                        </RadioGroup>
                </div>
                : null
                    }
            </div>
            <div className={classes.gender}>
                <Typography variant='subtitle1' color='primary'>6) Do you have a gender preference for who supports you ?</Typography>
                <RadioGroup onChange={(e) => setGenderPreference(e.target.value)}>
                    <FormControlLabel value='Male' control={<Radio color='primary' />} label='Male' />
                    <FormControlLabel value='Female' control={<Radio color='primary' />} label='Female' />
                    <FormControlLabel value='No' control={<Radio color='primary' />} label='No Preference' />
                </RadioGroup>
            </div>
            <div className={classes.buttons}>
                <Button
                    variant='contained'
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.backButton}
                >
                    Back
                </Button>
                <Button variant='contained' color='primary' onClick={handleNext}>
                    Next
                </Button>
            </div>
            <>
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
        </div>
    );
}