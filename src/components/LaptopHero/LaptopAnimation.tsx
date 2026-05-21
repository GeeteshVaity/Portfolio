import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useLaptopAnimation } from '@/hooks/useLaptopAnimation'

const TOTAL_FRAMES = 300
const FRAME_BASE_PATH = '/animation/ezgif-frame-'

/**
 * LaptopAnimation Component
 *
 * Displays a cinematic pixel-art laptop animation with:
 * - Frame-by-frame animation sequence
 * - Scroll-based reverse animation
 * - Smooth fade-in on hero visibility
 * - Responsive sizing
 * - Subtle floating effect when fully open
 */
export function LaptopAnimation() {
  const desktopRef = useRef<HTMLDivElement>(null)
  const [loadedFrames, setLoadedFrames] = useState(new Set<number>())
  const [fadeInComplete, setFadeInComplete] = useState(false)
  const preloadingStarted = useRef(false)
  const frameCache = useRef<Map<number, string>>(new Map())

  const { currentFrame, hasInitialized } = useLaptopAnimation({
    totalFrames: TOTAL_FRAMES,
    containerRef: desktopRef,
  })

  const getFramePath = (frameNum: number) => {
    const frameIndex = frameNum + 1 // Frames are 1-indexed
    return `${FRAME_BASE_PATH}${String(frameIndex).padStart(3, '0')}.jpg`
  }

  // Preload frames for smooth playback with caching
  const preloadFrame = (frameNumber: number) => {
    if (frameNumber >= TOTAL_FRAMES) return
    if (frameCache.current.has(frameNumber)) return
    if (loadedFrames.has(frameNumber)) return

    const img = new Image()
    const framePath = getFramePath(frameNumber)
    img.src = framePath
    
    img.onload = () => {
      frameCache.current.set(frameNumber, framePath)
      setLoadedFrames(prev => new Set(prev).add(frameNumber))
    }
    
    img.onerror = () => {
      console.warn(`Failed to load frame ${frameNumber}`)
    }
  }

  // Aggressive preloading: Load all frames in background with priority for near frames
  useEffect(() => {
    if (preloadingStarted.current) return
    preloadingStarted.current = true

    // Priority queue: load current range first, then gradually expand
    const preloadRange = () => {
      // Load frames around current frame first (high priority)
      for (let i = Math.max(0, currentFrame - 10); i < Math.min(TOTAL_FRAMES, currentFrame + 120); i++) {
        preloadFrame(i)
      }
    }

    preloadRange()

    // Then load rest of frames in batches in background
    const loadAllFrames = async () => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (!frameCache.current.has(i) && !loadedFrames.has(i)) {
          preloadFrame(i)
          // Stagger requests to avoid overwhelming network
          if (i % 5 === 0) {
            await new Promise(resolve => setTimeout(resolve, 10))
          }
        }
      }
    }

    const timeoutId = setTimeout(() => {
      loadAllFrames()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [])

  // Preload frames aggressively around current frame
  useEffect(() => {
    if (!hasInitialized) return

    // Load 120 frames ahead for smooth playback at slower speeds
    for (let i = Math.max(0, currentFrame - 10); i < Math.min(TOTAL_FRAMES, currentFrame + 120); i++) {
      preloadFrame(i)
    }

    // Keep memory bounded: remove frames far behind
    if (currentFrame > 20) {
      const newCache = new Map(frameCache.current)
      for (let i = 0; i < currentFrame - 20; i++) {
        newCache.delete(i)
      }
      frameCache.current = newCache
    }
  }, [currentFrame, hasInitialized])

  const AnimationFrame = () => {
    // Use current frame if loaded, otherwise fall back to previous loaded frame
    let displayFrame = currentFrame
    if (!loadedFrames.has(currentFrame) && currentFrame > 0) {
      // Find the nearest loaded frame before current
      for (let i = currentFrame - 1; i >= 0; i--) {
        if (loadedFrames.has(i)) {
          displayFrame = i
          break
        }
      }
    }

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Responsive sizing container */}
        <div className="relative w-full aspect-square max-w-3xl">
          {/* Floating effect wrapper */}
          <motion.div
            className="relative w-full h-full"
            animate={
              currentFrame === TOTAL_FRAMES - 1 && fadeInComplete
                ? {
                    y: [0, -8, 0],
                    rotate: [0, 0.5, 0],
                  }
                : {}
            }
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Crop container to hide left and right lines */}
            <div className="relative w-full h-full overflow-hidden" style={{ clipPath: 'inset(0 5% 0 5%)' }}>
              {/* Frame Display */}
              <motion.img
                src={getFramePath(displayFrame)}
                alt={`Animation frame ${displayFrame + 1}`}
                className="w-full h-full object-contain"
                style={{
                  objectPosition: 'center',
                }}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0,
                  ease: 'linear',
                }}
              />
            </div>

          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Desktop/Tablet Animation - Right side of hero */}
      <motion.div
        ref={desktopRef}
        className="md:col-span-5 flex items-center justify-center hidden md:flex"
        initial={{ opacity: 0 }}
        animate={hasInitialized ? { opacity: 1 } : { opacity: 0 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
        }}
        onAnimationComplete={() => setFadeInComplete(true)}
      >
        <AnimationFrame />
      </motion.div>

      {/* Mobile view - show final frame below text */}
      <motion.div
        className="md:hidden col-span-1 flex items-center justify-center mt-lg w-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
        }}
        viewport={{ once: true }}
      >
        <div className="relative w-full max-w-xs px-4">
          <div className="relative w-full overflow-hidden" style={{ clipPath: 'inset(0 5% 0 5%)' }}>
            <img
              src={getFramePath(TOTAL_FRAMES - 1)}
              alt="Laptop animation - final frame"
              className="w-full object-contain"
              style={{
                objectPosition: 'center',
              }}
            />
          </div>
        </div>
      </motion.div>
    </>
  )
}
