import React from 'react'
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'

const EmbeddedMap = (props) => {
  const { lat, long, google } = props

  return (
    <Map
      google={google}
      zoom={10}
      zoomControl={false}
      style={{
        width: '100%', height: '100%', margin: 0, paadding: 0,
      }}
      initialCenter={lat && long ? { lat, lng: long } : { lat: -33.8688, lng: 151.2093 }}
      center={lat && long ? { lat, lng: long } : { lat: -33.8688, lng: 151.2093 }}
    >
      {lat && long
        ? (
          <Marker
            title="The marker`s title will appear as a tooltip."
            name="SOMA"
            position={{ lat, lng: long }}
          />
        )
        : null}
    </Map>
  )
}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_FIREBASE_KEY),
})(EmbeddedMap)
