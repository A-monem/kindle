import React, { useState, useEffect } from 'react';
import {
  Typography, RadioGroup, Radio, FormControlLabel, TableContainer, Table, TableHead, TableBody, TableCell, TextField,
  MenuItem, Grid, Icon, IconButton, TableRow, Paper, Collapse, Box, Tooltip,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import PropTypes from 'prop-types'
import { firebaseAddUserInfo } from '../../../api/Firebase'
import NextBackButtons from '../NextBackButtons'
import { useUser } from '../../../context/UserContext'
import { arrays } from '../../../constants'
import { keyIdGenerator } from '../../../api/RandomId'
import { useAlert } from '../../../context/AlertContext'

function WorkerRegistrationStepThree({ activeStep, setActiveStep }) {
  const [highestEducation, setHighestEducation] = useState('')
  const [areaOfEducation, setAreaOfEducation] = useState('')
  const [otherQualifications, setOtherQualifications] = useState([])
  const [otherQualificationHolder, setOtherQualificationHolder] = useState('')
  const [otherQualificationYearHolder, setOtherQualificationYearHolder] = useState('')

  const { user, addUser } = useUser()
  const { showErrorAlert } = useAlert()
  const theme = useTheme()

  useEffect(() => {
    document.getElementById('kindleApp').scrollIntoView();

    if (user.education) {
      setHighestEducation(user.education.level)
      setAreaOfEducation(user.education.area)
      setOtherQualifications(user.education.otherQualifications)
    }
  }, [])

  const useStyles = makeStyles(() => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexGrow: 1,
      width: '100%',
      marginTop: theme.spacing(3),
      [theme.breakpoints.down('lg')]: {
        marginTop: theme.spacing(0),
      },
    },
    form: {
      width: '100%',
    },
    margin: {
      marginTop: theme.spacing(2),
    },
    padding: {
      padding: theme.spacing(2),
    },
    fullWidthOnMedium: {
      width: '50%',
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    buttons: {
      width: '100%',
      marginTop: theme.spacing(4),
      display: 'flex',
      justifyContent: 'center',
    },
    qualificationAdd: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  }))

  const classes = useStyles()

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const checkFields = () => {
    if (highestEducation === 'Primary education' || highestEducation === 'Secondary education' || (highestEducation && areaOfEducation)) {
      return true
    }

    showErrorAlert('Please make sure you added you education level')

    return false
  }

  const handleNext = (e) => {
    const check = checkFields()

    e.preventDefault()

    const education = {
      level: highestEducation,
      area: areaOfEducation,
      otherQualifications,
    }

    if (check) {
      firebaseAddUserInfo('education', education)
        .then((userInfo) => {
          addUser(userInfo)
          setActiveStep((prevActiveStep) => prevActiveStep + 1)
        })
        .catch((error) => {
          if (error.message) {
            showErrorAlert(error.message)
          } else {
            showErrorAlert('Failed to add inforamtion. Please contact Kindle support')
          }
        })
    }
  };

  const handleAddQualification = () => {
    if (otherQualificationHolder && otherQualificationYearHolder) {
      const arr = [...otherQualifications]

      if (!arr.includes(otherQualificationHolder)) {
        arr.push({
          qualification: otherQualificationHolder,
          year: otherQualificationYearHolder,
        })
        setOtherQualifications(arr)
        setOtherQualificationHolder('')
        setOtherQualificationYearHolder('')
      }
    } else {
      showErrorAlert('Please add a qualification and year of completion')
    }
  }

  const handleDeleteQualification = (otherQualification) => {
    const arr = otherQualifications.filter((quali) => {
      if (quali.qualification === otherQualification.qualification && quali.year === otherQualification.year) {
        return false
      }

      return true
    })

    setOtherQualifications(arr)
  }

  return (
    <div className={classes.root}>
      <form className={classes.form} onSubmit={(e) => handleNext(e)}>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">1) What is the highest level of education you have achieved ?</Typography>
          <RadioGroup onChange={(e) => setHighestEducation(e.target.value)} value={highestEducation}>
            {arrays.educationOptions.map((item) => (
              <FormControlLabel key={keyIdGenerator()} value={item} control={<Radio color="primary" required />} label={item} />
            ))}
          </RadioGroup>
          <Collapse in={highestEducation !== '' && !(highestEducation === 'Primary education' || highestEducation === 'Secondary education')}>
            <div className={classes.fullWidthOnMedium}>
              <TextField
                fullWidth
                select
                required={highestEducation !== '' && !(highestEducation === 'Primary education' || highestEducation === 'Secondary education')}
                className={classes.margin}
                size="small"
                label="Select area of education"
                value={areaOfEducation}
                onChange={(e) => setAreaOfEducation(e.target.value)}
                variant="outlined"
              >
                {arrays.areaOfEducationOptions.map((option) => (
                  <MenuItem key={keyIdGenerator()} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </Collapse>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">2) Do you hold any other relevant qualifications ?</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                fullWidth
                id="qualification"
                label="Qualification"
                name="qualification"
                value={otherQualificationHolder}
                placeholder="Diploma in Nursing"
                onChange={(e) => setOtherQualificationHolder(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6} className={classes.qualificationAdd}>
              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                fullWidth
                id="year"
                label="Year completed"
                name="year"
                placeholder="2017"
                value={otherQualificationYearHolder}
                onChange={(e) => setOtherQualificationYearHolder(e.target.value)}
              />
              <Tooltip title="Add">
                <IconButton onClick={handleAddQualification}>
                  <Icon color="primary" fontSize="large">add_circle</Icon>
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table size="small" aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Qualification</TableCell>
                      <TableCell>Year</TableCell>
                      <TableCell align="right" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {otherQualifications.map((row) => (
                      <TableRow key={keyIdGenerator()}>
                        <TableCell component="th" scope="row">
                          {row.qualification}
                        </TableCell>
                        <TableCell>{row.year}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="remove">
                            <IconButton onClick={() => handleDeleteQualification(row)}>
                              <DeleteForeverIcon color="primary" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Box>
        <NextBackButtons classes={classes} handleBack={handleBack} disable={activeStep === 0} />
      </form>
    </div>
  );
}

WorkerRegistrationStepThree.propTypes = {
  activeStep: PropTypes.number.isRequired,
  setActiveStep: PropTypes.func.isRequired,
}

export default WorkerRegistrationStepThree
