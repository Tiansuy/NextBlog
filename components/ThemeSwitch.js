import { useEffect, useState, useCallback, memo } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { HiSun, HiMoon } from 'react-icons/hi'
import useSound from 'use-sound'

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  const [ThemeSound] = useSound('/static/sounds/switch-on.mp3', {
    volume: 0.5,
    preload: true,
  })

  const handleThemeSwitch = useCallback(() => {
    const newTheme = theme === 'dark' || resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    ThemeSound()
  }, [theme, resolvedTheme, setTheme, ThemeSound])

  if (!mounted) return null

  return (
    <motion.div
      className="ml-1 cursor-pointer rounded-full bg-zinc-300 dark:bg-zinc-700"
      whileHover={{
        scale: 1.05,
        translateY: -2,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 10,
      }}
    >
      <motion.button
        className="flex h-8 w-8 items-center justify-center p-2"
        whileTap={{
          scale: 0.7,
          rotate: 360,
        }}
        transition={{
          duration: 0.2,
          ease: [0.25, 0.1, 0.25, 1.0],
        }}
        aria-label="Toggle Dark Mode"
        type="button"
        onClick={handleThemeSwitch}
      >
        <motion.div
          initial={false}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          exit={{
            scale: 0,
            opacity: 0,
          }}
          transition={{
            duration: 0.2,
          }}
        >
          {theme === 'dark' || resolvedTheme === 'dark' ? (
            <HiSun className="h-4 w-4 transform-gpu" />
          ) : (
            <HiMoon className="h-4 w-4 transform-gpu" />
          )}
        </motion.div>
      </motion.button>
    </motion.div>
  )
}

export default memo(ThemeSwitch)
