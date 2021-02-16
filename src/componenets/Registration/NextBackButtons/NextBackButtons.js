import React from 'react'
import { Button } from '@material-ui/core'
import PropTypes from 'prop-types'

function NextBackButtons({ classes, handleBack, disable }) {
  return (
    <div className={classes.buttons}>
      <Button
        variant="contained"
        disabled={disable}
        onClick={handleBack}
        className={classes.backButton}
        color="secondary"
      >
        Back
      </Button>
      <Button variant="contained" color="secondary" type="submit">
        Next
      </Button>
    </div>
  )
}

NextBackButtons.propTypes = {
  classes: PropTypes.object.isRequired,
  handleBack: PropTypes.func.isRequired,
  disable: PropTypes.bool.isRequired,
}

export default NextBackButtons
