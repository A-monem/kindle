import React, { useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'
import { set } from 'date-fns'

let lat, long

export const setCoordinates = (latValue, longValue) => {
  lat = latValue
  long = longValue
}

const EmbeddedMap = (props) => {
    // const [lat, setLat] = useState(null)
    // const [long, setLong] = useState(null)

    return (
       <Map 
        google={props.google}
        zoom={10}
        zoomControl={false}
        style={{ width: '100%', height:'100%', margin: 0, paadding: 0}}
        initialCenter={props.lat && props.long ? {lat: props.lat, lng: props.long} : {lat: -33.8688, lng: 151.2093}}
        center= {props.lat && props.long ? {lat: props.lat, lng: props.long} : {lat: -33.8688, lng: 151.2093}}
        >
          {props.lat && props.long ?
          <Marker
          title={'The marker`s title will appear as a tooltip.'}
          name={'SOMA'}
          position={{lat: props.lat, lng: props.long}} />
          : null}
        </Map>
    )
}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_FIREBASE_KEY),
})(EmbeddedMap)