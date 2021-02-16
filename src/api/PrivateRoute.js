import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { strings } from '../constants'
import Registration from '../componenets/Registration'

function PrivateRoute({ component: Component, ...rest }) {
  const { user } = useUser()

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!user) {
          return <Redirect to={strings.signin_url} />
        }

        if (!user.complete) {
          return <Registration />
        }

        return <Component {...props} />
      }}
    />
  )
}

export default PrivateRoute
