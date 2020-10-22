import React, { useState, useEffect, useContext} from 'react';
import { Typography, Button, RadioGroup, Radio, FormControlLabel, 
    FormGroup, TextField, MenuItem, Snackbar, Checkbox, Tooltip,} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firebaseAddUserInfo } from '../../api/Firebase'
import { UserContext } from '../../context/UserContext'

export default function WorkerRegistrationStepTwo({ activeStep, setActiveStep }) {
    const [openError, setOpenError] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [supportTime, setSupportTime] = useState('')
    const supportTimeEachWeekArray = ['0 - 5 hours per week', '6 - 10 hours per week', '11 - 15 hours per week', 
        '16 - 20 hours per week', '21 - 25 hours per week', '26 - 30 hours per week', '30+ hours per week']
    const [supportType, setSupportType] = useState([])
    const [renderTransport, setRenderTransport] = useState(false)
    const [drivingLicence, setDrivingLicence] = useState('')
    const [drivingClientCar, setDrivingClientCar] = useState('')
    const [drivingOwnCar, setDrivingOwnCar] = useState('')
    const [plateNumber, setPlateNumber] = useState('')
    const supportTypeArray = [{title: "Help around the house", toolTip: 'Help around the house is important for you to be able to remain independently at home. This might include help in the graden, home-office duties and keeping the house tidy by assisting with laundry, taking out the rubbish or feeding pets.'},
        {title: "In-home care", toolTip: 'In-home care is important to help you maintain your independence. This includes assistance with morning and evening routines, showring and toileting, mealtime preparation and medication reminders.'}, 
        {title: "Personal care", toolTip: 'Personal care and hygiene support is important for maintaining an active and social lifestyle. This might include toileting (in the home or out in the community) and mealtime assistance'}, 
        {title: "Outdoor care", toolTip: 'This might include anything from shopping to fitness, to joining a new community group to social events.'}, 
        {title: "Education, training and employment", toolTip: 'This might include assisting you at school, in the classroom or in the playground, at university or TAFE, in the workplace or to develop new skills.'}, 
        {title: "Therapy support", toolTip: 'Therapy support is designed to help you if you have an early intervention, developmental services, physiotherapy, occupational therapy or speech pathology plan. Your worker will follow your individualised program to help with the ongoing implementation of your therapy at home and in other environments.'}, 
        {title: "Transport", toolTip: "Transport support is helping you to get ready, accompanying and providing assistance at the destination, and ensuring you return home safely. Depending on your worker's preference this might be in your car or theirs."}]
    const [genderPreference, setGenderPreference] = useState('')
    const [agePreference, setAgrePreference] = useState([])
    const ageGroupsOptions = ['Adults', 'Teenagers', 'Children']
    const [workType, setWorkType] = useState([])
    const workTypeOptions = ['ongoing', 'occasional']
    const [workAvailability, setWorkAvailability] = useState([])
    const workAvailabilityOptions = ['Weekdays', 'Evenings', 'Weekends']
    const [travelType, setTravelType] = useState('')
    const [visa, setVisa] = useState('')
    const [permissionToCheckVisa, setPermissionToCheckVisa] = useState(false)
    const [paidWorkExperience, setPaidWorkExperience] = useState('')
    const [unpaidWorkExperience, setUnpaidWorkExperience] = useState('')
    const [unpaidWorkExperienceType, setUnpaidWorkExperienceType] = useState([])
    const unpaidWorkExperienceOptions = ['Providing informal support for a family member', 
                                        'Providing informal support for a friend or neighbour', 
                                        'Doing a placement through study or coursework', 
                                        'Volunteering in another setting']

    useEffect(() => {
        document.getElementById('kindleApp').scrollIntoView();

        if (user.work){
         
            setSupportTime(user.work.supportTime)
            setSupportType(user.work.supportType)
            setRenderTransport(user.work.transport)
            setDrivingLicence(user.work.drivingLicence)
            setDrivingClientCar(user.work.drivingClientCar)
            setDrivingOwnCar(user.work.drivingOwnCar)
            setPlateNumber(user.work.plateNumber)
            setGenderPreference(user.work.genderPreference)
            setAgrePreference(user.work.agePreference)
            setWorkType(user.work.workType)
            setWorkAvailability(user.work.workAvailability)
            setTravelType(user.work.travelType)
            setVisa(user.work.visa)
            setPermissionToCheckVisa(user.work.permissionToCheckVisa)
            setPaidWorkExperience(user.work.paidWorkExperience)
            setUnpaidWorkExperience(user.work.unpaidWorkExperience)
            setUnpaidWorkExperienceType(user.work.unpaidWorkExperienceType)
        }

    }, [])

    const theme = useTheme()
    const { user, addUser} = useContext(UserContext)

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
            marginTop: theme.spacing(2),
            width: '50%'
        }, 
        supportType:{
            marginTop: theme.spacing(2),
            width: '100%' 
        },
        transport: {
            display: 'flex', 
            flexDirection: 'row',
            marginLeft: theme.spacing(2)
        },
        gender: {
            marginTop: theme.spacing(2),
        }, 
        age: {
            marginTop: theme.spacing(2),
            width: '50%' 
        }, 
        workType: {
            marginTop: theme.spacing(2),
            width: '50%' 
        }, 
        workAvailability: {
            marginTop: theme.spacing(2),
            width: '50%' 
        },
        travelType: {
            marginTop: theme.spacing(2),
            width: '50%' 
        },
        workRights: {
            marginTop: theme.spacing(2),
        }, 
        paidWorkExperience: {
            marginTop: theme.spacing(2),
        }, 
        unpaidWorkExperience: {
            marginTop: theme.spacing(2),
            width: '100%' 
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

    const handleNext = (e) => {
        e.preventDefault()
        const check = checkFields()
        const work = {
            supportTime, 
            supportType,
            transport: renderTransport,
            drivingLicence,
            drivingClientCar,
            drivingOwnCar,
            plateNumber,
            genderPreference, 
            agePreference, 
            workType,
            workAvailability,
            travelType,
            visa,
            permissionToCheckVisa,
            paidWorkExperience,
            unpaidWorkExperience,
            unpaidWorkExperienceType
        }

        if (check){
            firebaseAddUserInfo('work', work)
                .then((user) => {
                    addUser(user)
                    setActiveStep((prevActiveStep) => prevActiveStep + 1)
                })
                .catch((error) => {
                    setMessage(error)
                    setOpenError(true)
                })
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const checkFields = () => {
        if (supportType.length >= 1) {
            if  (agePreference.length >= 1) {
                if  (workType.length >= 1) {
                    if  (workAvailability.length >= 1) {
                        if( unpaidWorkExperience ==='No' || unpaidWorkExperience ==='Yes' && unpaidWorkExperienceType.length >= 1){
                            return true
                        } else {
                            setMessage('Please make sure you have selected unpaid work experience type')
                            setOpenError(true)
                            return false
                        }
                    } else {
                        setMessage('Please make sure you have selected your availability')
                        setOpenError(true)
                        return false
                    }
                } else {
                    setMessage('Please make sure you have selected one or more work type')
                    setOpenError(true)
                    return false
                }
            } else {
                setMessage('Please make sure you have selected one or more age group')
                setOpenError(true)
                return false
            }
            
        } else {
            setMessage('Please make sure you have selected one or more support type')
            setOpenError(true)
            return false
        }
    }

    const handleSupportTypeChange = (e) => {
        let supportTypeHolder = supportType

        if (!supportType.includes(e.target.value)){

            supportTypeHolder.push(e.target.value)

            if (e.target.value === 'Transport'){
                setRenderTransport(true)
            }

        } else {

            supportTypeHolder = supportTypeHolder.filter((item) => item !== e.target.value)

            if (e.target.value === 'Transport'){
                setRenderTransport(false)
            }

        }

        setSupportType([...supportTypeHolder])
    }

    const handleAgeChange = (e) => {
        let ageGroupHolder = agePreference

        if (!agePreference.includes(e.target.value)){
            ageGroupHolder.push(e.target.value)
        } else {
            ageGroupHolder = ageGroupHolder.filter((item) => item !== e.target.value)
        }

        setAgrePreference([...ageGroupHolder])
    }

    const handleWorkTypeChange = (e) => {

        if (workType.includes(e.target.value)){
            const workTypeHolder = workType.filter((item) => item !== e.target.value)
            setWorkType([...workTypeHolder])
        } else {
           const workTypeHolder = workType
            workTypeHolder.push(e.target.value)
            setWorkType([...workTypeHolder])
        }
    }

    const handleWorkAvailabiltyChange = (e) => {

        if (workAvailability.includes(e.target.value)){
            const workAvailabilityHolder = workAvailability.filter((item) => item !== e.target.value)
            setWorkAvailability([...workAvailabilityHolder])
        } else {
            const workAvailabilityHolder = workAvailability
            workAvailabilityHolder.push(e.target.value)
            setWorkAvailability([...workAvailabilityHolder])
        }
    }

    const handleUnpaidWorkExperienceChange = (e) => {

        if (unpaidWorkExperienceType.includes(e.target.value)){
            const unpaidWorkExperienceTypeHolder = unpaidWorkExperienceType.filter((item) => item !== e.target.value)
            setUnpaidWorkExperienceType([...unpaidWorkExperienceTypeHolder])
        } else {
            const unpaidWorkExperienceTypeHolder = unpaidWorkExperienceType
            unpaidWorkExperienceTypeHolder.push(e.target.value)
            setUnpaidWorkExperienceType([...unpaidWorkExperienceTypeHolder])
        }

    }

    return (
        <div className={classes.root}>
             <form className={classes.form} onSubmit={e => handleNext(e)}>
                <div className={classes.time}>
                    <Typography variant='subtitle1' color='primary'>1) How much one to one support do you need each week ?</Typography>
                    <TextField
                        required
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
                <div className={classes.supportType}>
                    <Typography variant='subtitle1' color='primary'>2) What type of support can you provide ?</Typography>
                        <FormGroup >
                        {supportTypeArray.map((item, i) => (
                            <Tooltip key={i} title={item.toolTip} placement="right" style={{width:'50%'}}>
                                <FormControlLabel
                                    control={<Checkbox
                                                onChange={handleSupportTypeChange} 
                                                color='primary' 
                                                value={item.title} 
                                                name={item.title} 
                                                checked={supportType.includes(item.title)}
                                            />
                                    }
                                    label={item.title}
                                   
                                />
                            </Tooltip>
                        ))}
                        </FormGroup>
                        {renderTransport 
                        ? (
                            <div style={{paddingTop: theme.spacing(2), paddingLeft: theme.spacing(2)}}>
                            <Typography variant='subtitle1'>Transport</Typography>
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <Typography variant='subtitle2' color='primary'>Do you have an unrestricted licence ?</Typography>
                                <RadioGroup onChange={(e) => setDrivingLicence(e.target.value)} className={classes.transport} value={drivingLicence}>
                                    <FormControlLabel value='Yes' control={<Radio color='primary' required/>} label='Yes' />
                                    <FormControlLabel value='No' control={<Radio color='primary' required/>} label='No' />
                                </RadioGroup>
                            </div>
                            
                            {drivingLicence === 'Yes'
                            ? (<>
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    <Typography variant='subtitle2' color='primary'>Are you willing to drive your client's car ?</Typography>
                                    <RadioGroup onChange={(e) => setDrivingClientCar(e.target.value)} className={classes.transport} value={drivingClientCar}>
                                        <FormControlLabel value='Yes' control={<Radio color='primary' required/>} label='Yes' />
                                        <FormControlLabel value='No' control={<Radio color='primary' required/>} label='No' />
                                    </RadioGroup>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    <Typography variant='subtitle2' color='primary'>Will you be driving your own car ?</Typography>
                                    <RadioGroup onChange={(e) => setDrivingOwnCar(e.target.value)} className={classes.transport} value={drivingOwnCar}>
                                        <FormControlLabel value='Yes' control={<Radio color='primary' required/>} label='Yes' />
                                        <FormControlLabel value='No' control={<Radio color='primary' required/>} label='No' />
                                    </RadioGroup>
                                </div>
                                </>
                            )
                            : null }

                            {drivingOwnCar === 'Yes'
                            ? (
                                <div style={{display: 'flex', flexDirection: 'row', marginTop: theme.spacing(1)}}>
                                        <TextField
                                        required
                                        size='small'
                                        label='Your plate number'
                                        value={plateNumber}
                                        onChange={(e) => setPlateNumber(e.target.value)}
                                        variant='outlined'
                                    />
                                </div>
                            )
                            : null }
                            </div>
                        )
                        : null}
                </div>
                <div className={classes.gender}>
                    <Typography variant='subtitle1' color='primary'>3) Do you have a gender preference for who you work with ?</Typography>
                    <RadioGroup onChange={(e) => setGenderPreference(e.target.value)} value={genderPreference}>
                        <FormControlLabel value='Male' control={<Radio color='primary' required/>} label='Male' />
                        <FormControlLabel value='Female' control={<Radio color='primary' required/>} label='Female' />
                        <FormControlLabel value='No' control={<Radio color='primary' required/>} label='No Preference' />
                    </RadioGroup>
                </div>
                <div className={classes.age}>
                    <Typography variant='subtitle1' color='primary'>4) Do you have an age preference for who you work with ?</Typography>
                    <FormGroup>
                        {ageGroupsOptions.map((item, i) => (
                            <FormControlLabel
                                key={i}
                                control={<Checkbox onChange={handleAgeChange} color='primary' value={item} name={item} checked={agePreference.includes(item)}/>}
                                label={item}
                            />
                        ))}
                    </FormGroup>
                    <div className={classes.margin}>
                        <Typography variant='caption'>If you would like to work with teenagers or children you will need a current, paid Working with Children Check and a current and paid Disability Services Employment check (volunteer checks are no longer accepted).</Typography>
                    </div>
                </div>
                <div className={classes.workType}>
                    <Typography variant='subtitle1' color='primary'>5) What type of work are you looking for ?</Typography>
                    <FormGroup>
                        {workTypeOptions.map((item, i) => (
                            <FormControlLabel
                                key={i}
                                control={<Checkbox onChange={handleWorkTypeChange} color='primary' value={item} name={item} />}
                                label={item}
                                checked={workType.includes(item)}
                            />
                        ))}
                    </FormGroup>
                </div>
                <div className={classes.workAvailability}>
                    <Typography variant='subtitle1' color='primary'>6) When are you available for work ?</Typography>
                    <FormGroup>
                        {workAvailabilityOptions.map((item, i) => (
                            <FormControlLabel
                                key={i}
                                control={<Checkbox onChange={handleWorkAvailabiltyChange} color='primary' value={item} name={item} />}
                                label={item}
                                checked={workAvailability.includes(item)}
                            />
                        ))}
                    </FormGroup>
                </div>
                <div className={classes.travelType}>
                    <Typography variant='subtitle1' color='primary'>7) How will you travel to work ?</Typography>
                    <RadioGroup onChange={(e) => setTravelType(e.target.value)} value={travelType}>
                        <FormControlLabel value='Drive' control={<Radio color='primary' required/>} label='Use my own car' />
                        <FormControlLabel value='Public transport' control={<Radio color='primary' required/>} label='Use public transportation' />
                    </RadioGroup>
                </div>
                <div className={classes.workRights}>
                    <Typography variant='subtitle1' color='primary'>8) Do you have the right to work in Australia ?</Typography>
                    <RadioGroup onChange={(e) => setVisa(e.target.value)} value={visa}>
                        <FormControlLabel value='Austalian citizen' control={<Radio color='primary' required/>} label='I am an Australian citizen' />
                        <FormControlLabel value='New Zealand citizen' control={<Radio color='primary' required/>} label='I am a New Zealand citizen' />
                        <FormControlLabel value='Visa' control={<Radio color='primary' required/>} label='My visa allows me to work in Australia' />
                    </RadioGroup>
                    {visa === 'Visa'
                    ? <FormControlLabel
                        style={{padding: theme.spacing(2)}}
                        size={'small'}
                        className={classes.margin} 
                        control={<Checkbox onChange={() => setPermissionToCheckVisa(prevState => !prevState)} color='primary'
                        value={permissionToCheckVisa} name={'visa_permission'} />}
                        label={'I give permission for Kindle to verify my visa status'}
                        checked={permissionToCheckVisa}
                        />
                    : null}
                </div>
                <div className={classes.paidWorkExperience}>
                    <Typography variant='subtitle1' color='primary'>9) Have you ever had paid experience providing disability support ?</Typography>
                    <RadioGroup onChange={(e) => setPaidWorkExperience(e.target.value)} value={paidWorkExperience}>
                        <FormControlLabel value='Yes' control={<Radio color='primary' required/>} label='Yes' />
                        <FormControlLabel value='No' control={<Radio color='primary' required/>} label='No' />
                    </RadioGroup>
                </div>
                <div className={classes.unpaidWorkExperience}>
                    <Typography variant='subtitle1' color='primary'>10) Have you ever had unpaid experience providing disability support ?</Typography>
                    <RadioGroup onChange={(e) => setUnpaidWorkExperience(e.target.value)} value={unpaidWorkExperience}>
                        <FormControlLabel value='Yes' control={<Radio color='primary' required/>} label='Yes' />
                        <FormControlLabel value='No' control={<Radio color='primary' required/>} label='No' />
                    </RadioGroup>
                    {unpaidWorkExperience === 'Yes'
                        ? <FormGroup style={{padding: theme.spacing(2)}}>
                            {unpaidWorkExperienceOptions.map((item, i) => (
                                <FormControlLabel
                                    key={i}
                                    control={<Checkbox onChange={handleUnpaidWorkExperienceChange} 
                                    color='primary' value={item} name={item} />}
                                    label={item}
                                    checked={unpaidWorkExperienceType.includes(item)}
                                />
                            ))}
                        </FormGroup>
                        : null
                    }
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
                    <Button variant='contained' color='primary' type='submit'>
                        Next
                    </Button>
                </div>
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
             </form>
        </div>
    );
}