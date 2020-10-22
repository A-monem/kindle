import React from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { AppbarWithRouter } from './componenets/Appbar'
import Home from './componenets/Home'
import Error from './componenets/Error'
import Signup from './componenets/Signup'
import Signin from './componenets/Signin'
import Dashboard from './componenets/Dashboard'
import JobBoard from './componenets/JobBoard'
import Messages from './componenets/Messages'
import Terms from './componenets/Terms'
import Privacy from './componenets/Privacy'
import CombinedContextProvider from './context/CombinedContext'
import { CssBaseline } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ScrollToTop from './api/ScrollToTop'


function App() {

  const useStyles = makeStyles(() => ({
    app: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: '100%',
      width: '100%',
    }
  }))
  const classes = useStyles()

  return (
    <CombinedContextProvider>
      <CssBaseline />
      <Router>
        <ScrollToTop>
          <div className={classes.app} id='kindleApp'>
            <AppbarWithRouter />
            <Switch>
              <Route path='/' exact component={Home} />
              <Route path='/signup' exact component={Signup} />
              <Route path='/signin' exact component={Signin} />
              <Route path='/dashboard' exact component={Dashboard} />
              <Route path='/jobs' exact component={JobBoard} />
              <Route path='/messages' exact component={Messages} />
              <Route path='/terms' exact component={Terms} />
              <Route path='/privacy' exact component={Privacy} />
              <Route component={Error} />
            </Switch>
          </div>
          </ScrollToTop>
      </Router>
    </CombinedContextProvider>
  )
}

export default App