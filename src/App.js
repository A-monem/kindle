import React from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import {AppbarWithRouter} from './componenets/Appbar'
import Home from './componenets/Home'
import Error from './componenets/Error'
import SignupMain from './componenets/SignupMain'
import SignupClient from './componenets/SignupClient'
import SignupWorker from './componenets/SignupWorker'
import CombinedContextProvider from './context/CombinedContext'
import { CssBaseline } from '@material-ui/core'


function App() {

  return (
    <CombinedContextProvider>
        <CssBaseline />
        <Router>
          <AppbarWithRouter />
          <Switch>
            <Route path='/' exact component={Home}/>
            <Route path='/signup' exact component={SignupMain}/>
            <Route path='/signup/client' exact component={SignupClient}/>
            <Route path='/signup/worker' exact component={SignupWorker}/>
            <Route component={Error} />
          </Switch>
        </Router>
    </CombinedContextProvider>
  )
}

export default App