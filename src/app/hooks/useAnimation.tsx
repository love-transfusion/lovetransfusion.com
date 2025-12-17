import { AnimatePresence, LazyMotion, m } from 'framer-motion'
import { ReactNode } from 'react'
const loadFeatures = () =>
  import('@/app/utilities/framerMotion/features').then((res) => res.default)

export const ClAnimationContainer = (props: { children: ReactNode }) => {
  const { children } = props
  return (
    <LazyMotion features={loadFeatures}>
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </LazyMotion>
  )
}

const animationList = {
  collapse: {
    initial: { height: 0, opacity: 0 },
    animate: { height: 'auto', opacity: 1 },
    exit: { height: 0, opacity: 0 },
    transition: { ease: 'easeInOut' },
    style: { overflow: 'hidden' },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { ease: 'easeInOut' },
  },
  fadeUp: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 16 },
    transition: { ease: 'easeOut' },
  },

  /** Fade + slide down */
  fadeDown: {
    initial: { opacity: 0, y: -16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
    transition: { ease: 'easeOut' },
  },

  /** Scale in (good for modals, confirmations) */
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { ease: 'easeOut' },
  },

  /** Scale + fade (very clean UI feel) */
  scaleFade: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.92 },
    transition: { ease: 'easeOut' },
  },

  /** Slide from left */
  slideLeft: {
    initial: { opacity: 0, x: -24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
    transition: { ease: 'easeOut' },
  },

  /** Slide from right */
  slideRight: {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 24 },
    transition: { ease: 'easeOut' },
  },
}

type AnimationTypes = keyof typeof animationList

const useAnimation = (props: {
  animationStyle: AnimationTypes
  /**Number in seconds */
  animationDuration: number
}) => {
  const { animationStyle, animationDuration } = props

  const ClMotionDiv = m.div
  const clAnimationStylesWithoutDuration = animationList[animationStyle]
  const clAnimationStyles = {
    ...clAnimationStylesWithoutDuration,
    transition: {
      ...clAnimationStylesWithoutDuration.transition,
      duration: animationDuration,
    },
  }
  return { ClMotionDiv, ClAnimationContainer, clAnimationStyles }
}

export default useAnimation
