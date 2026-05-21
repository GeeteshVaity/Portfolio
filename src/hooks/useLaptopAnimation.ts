import { useEffect, useRef, useState } from 'react'

interface UseLaptopAnimationProps {
  totalFrames: number
  containerRef: React.RefObject<HTMLDivElement>
}

export function useLaptopAnimation({
  totalFrames,
  containerRef,
}: UseLaptopAnimationProps) {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [hasInitialized, setHasInitialized] = useState(false)
  
  const stateRef = useRef({
    frameIndex: 0,
    direction: 'forward' as 'forward' | 'backward',
    animationId: null as number | null,
    lastScrollY: 0,
  })

  // Main animation loop - run once on mount
  useEffect(() => {
    setHasInitialized(true)
    
    const WAVING_START_FRAME = 270 // Start of waving frames
    const FINAL_FRAME = totalFrames - 1
    
    // The animation function
    const tick = () => {
      const state = stateRef.current
      const speed = 0.5
      
      // Update frame index based on direction
      if (state.direction === 'forward') {
        state.frameIndex += speed
        if (state.frameIndex >= FINAL_FRAME) {
          // Loop back to waving start for infinite loop
          state.frameIndex = WAVING_START_FRAME
        }
      } else {
        state.frameIndex -= speed
        if (state.frameIndex <= 0) {
          state.frameIndex = 0
        }
      }
      
      // Update React state with rounded frame
      const newFrame = Math.floor(state.frameIndex)
      setCurrentFrame(newFrame)
      
      // Cleanup and schedule next frame
      state.animationId = requestAnimationFrame(tick)
    }
    
    // Start animation
    stateRef.current.animationId = requestAnimationFrame(tick)
    
    // Cleanup on unmount
    return () => {
      if (stateRef.current.animationId !== null) {
        cancelAnimationFrame(stateRef.current.animationId)
      }
    }
  }, [])

  // Handle scroll for reverse animation
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      
      const currentScrollY = window.scrollY
      const state = stateRef.current
      
      // Detect scroll direction
      if (currentScrollY > state.lastScrollY) {
        // Scrolling down - close laptop (backward)
        state.direction = 'backward'
      } else if (currentScrollY < state.lastScrollY) {
        // Scrolling up - open laptop (forward)
        state.direction = 'forward'
      }
      
      state.lastScrollY = currentScrollY
    }
    
    // Call once immediately to set initial scroll position
    const state = stateRef.current
    state.lastScrollY = window.scrollY

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [containerRef])

  return {
    currentFrame,
    hasInitialized,
  }
}
