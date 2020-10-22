import React, { useState, useEffect, useContext} from 'react';
import { Typography, Button, RadioGroup, Radio, FormControlLabel, TableContainer, Table, TableHead, TableBody, TableCell,
    FormGroup, TextField, MenuItem, Snackbar, Grid, Icon, IconButton, TableRow, Paper} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firebaseAddUserInfo } from '../../api/Firebase'
import { UserContext } from '../../context/UserContext'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'

export default function WorkerRegistrationStepThree({ activeStep, setActiveStep }) {
    const [openError, setOpenError] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [highestEducation, setHighestEducation] = useState('')
    const educationOptions = ['Primary education', 'Secondary education', 'Certificate level', 'Advanced diploma and diploma level',
        'Bachelor degree level', 'Postgraduate degree level'] 
    const [areaOfEducation, setAreaOfEducation] = useState('')
    const areaOfEducationOptions = ['Natural and Physical Sciences', 'Information Technology', 'Engineering and Related Technologies', 
        'Architecture and Building', 'Agriculture, Environmental and Related Studies', 'Health', 'Education', 'Management and Commerce',
        'Society and Culture', 'Creative Arts', 'Food, Hospitality and Personal Services']
    const [otherQualifications, setOtherQualifications] = useState([])
    const [otherQualificationHolder, setOtherQualificationHolder] = useState('')
    const [otherQualificationYearHolder, setOtherQualificationYearHolder] = useState('')

    useEffect(() => {
        document.getElementById('kindleApp').scrollIntoView();

        if (user.education){
            setHighestEducation(user.education.level)
            setAreaOfEducation(user.education.area)
            setOtherQualifications(user.education.otherQualifications)
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
        form: {
            width: '100%'
        },
        highestEducation: {
            marginTop: theme.spacing(2),
            width: '50%'
        }, 
        qualification: {
            marginTop: theme.spacing(2),
            width: '100%'
        },
        qualificationAdd: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center'
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
        // const check = checkFields()
        e.preventDefault()

        const education = {
            level: highestEducation,
            area: areaOfEducation, 
            otherQualifications: otherQualifications
        }
        //Needs to be changed back to check
        if (true) {
           firebaseAddUserInfo('education', education)
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
        if (highestEducation === 'Primary education' || highestEducation === 'Secondary education' || (highestEducation && areaOfEducation)){
            return true
        }else{
            setMessage('Please make sure you added you education level')
            setOpenError(true)
            return false
        }
    }

    const handleAddQualification= () => {
        if (otherQualificationHolder && otherQualificationYearHolder){
            const arr = [...otherQualifications]
            if (!arr.includes(otherQualificationHolder)) {
                arr.push({
                    qualification: otherQualificationHolder,
                    year: otherQualificationYearHolder
                })
                setOtherQualifications(arr)
                setOtherQualificationHolder('')
                setOtherQualificationYearHolder('')
            }
        } else {
            setMessage('Please add a qualification and year of completion')
            setOpenError(true)
        }
    }

    const handleDeleteQualification = (otherQualification) => {
        const arr = otherQualifications.filter(quali => {
            if (quali.qualification === otherQualification.qualification && quali.year === otherQualification.year) {
                return false
            } else {
                return true
            }
        })

        setOtherQualifications(arr)
    }


    return (
        <div className={classes.root}>
            <form className={classes.form} onSubmit={e => handleNext(e)}>
                <div className={classes.highestEducation}>
                    <Typography variant='subtitle1' color='primary'>1) What is the highest level of education you have achieved ?</Typography>
                    <RadioGroup onChange={(e) => setHighestEducation(e.target.value)} value={highestEducation} >
                        {educationOptions.map((item, i) => (
                            <FormControlLabel key={i} value={item} control={<Radio color='primary' required/>} label={item} />
                        ))}
                    </RadioGroup>
                    {highestEducation && highestEducation !== 'Primary education' && highestEducation !== 'Secondary education'
                    ? <div style={{paddingTop: theme.spacing(2), paddingLeft: theme.spacing(2)}}>
                        <TextField
                            fullWidth
                            select
                            required
                            className={classes.margin}
                            size='small'
                            label='Select area of education'
                            value={areaOfEducation}
                            onChange={(e) => setAreaOfEducation(e.target.value)}
                            variant='outlined'
                        >
                            {areaOfEducationOptions.map((option, i) => (
                                <MenuItem key={i} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>    
                    : null}
                </div>
                <div className={classes.qualification}>
                    <Typography variant='subtitle1' color='primary'>2) Do you hold any other relevant qualifications ?</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6} className={classes.qualificationAdd}>
                            <TextField
                                size='small'
                                variant='outlined'
                                margin='normal'
                                fullWidth
                                id='qualification'
                                label='Qualification'
                                name='qualification'
                                value={otherQualificationHolder}
                                onChange={e => setOtherQualificationHolder(e.target.value)}
                            />
                            <TextField
                                size='small'
                                variant='outlined'
                                margin='normal'
                                fullWidth
                                id='year'
                                label='Year completed'
                                name='year'
                                value={otherQualificationYearHolder}
                                onChange={e => setOtherQualificationYearHolder(e.target.value)}
                            />
                            <IconButton onClick={handleAddQualification}>
                                <Icon color='primary' fontSize='large'>add_circle</Icon>
                            </IconButton>
                        </Grid>
                        <Grid item xs={6}>
                            <TableContainer component={Paper} className={classes.margin}>
                                <Table size="small" aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Qualification</TableCell>
                                            <TableCell>Year</TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {otherQualifications.map((row, i) => (
                                        <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {row.qualification}
                                        </TableCell>
                                        <TableCell>{row.year}</TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleDeleteQualification(row)}>
                                                <DeleteForeverIcon color='primary' />
                                            </IconButton>
                                        </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                    
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