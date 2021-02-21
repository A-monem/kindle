import React from 'react';
import Lottie from 'lottie-react-web'
import { useTheme } from '@material-ui/core/styles'
import searchAnimation from './searchAnimation.json'
import discussAnimation from './discussAnimation.json'
import approveAnimation from './approveAnimation.json'

export default function Animation({ name }) {
  switch (name) {
    case 'Search for a support worker':
      return <AnimationLottie animation={searchAnimation} />
    case 'Book a support session':
      return <AnimationLottie animation={discussAnimation} />
    case 'Approve timesheet':
      return <AnimationLottie animation={approveAnimation} />
    default:
      return <AnimationLottie animation={searchAnimation} />
  }
}

function AnimationLottie({ animation }) {
  const theme = useTheme()

  return (
    <Lottie
      options={{
        animationData: animation,
      }}
      height={theme.spacing(40)}
    />
  )
}
