import React, { useContext } from 'react'
import { Redirect } from "react-router-dom"
import { UserContext } from '../context/UserContext'
import Registration from './Registration'
import Timetable from './Timetabale'
import { strings } from '../constants'


export default function Dashboard({ history }) {

    const { user } = useContext(UserContext)

    if (!user) {
        return <Redirect to={strings.signin_url} />
    } else {
        if (!user.complete) {
            return <Registration history={history}/>
        } else {
            return <Timetable/>
        }
    }
}

