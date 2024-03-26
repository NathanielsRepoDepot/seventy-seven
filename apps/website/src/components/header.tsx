'use client'

import { Button } from '@seventy-seven/ui/button'
import { Icon } from '@seventy-seven/ui/icon'
import { Logo } from '@seventy-seven/ui/logo'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export const Header = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const { setTheme, resolvedTheme } = useTheme()

  const onThemeChange = () => {
    if (resolvedTheme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  return (
    <header className="p-4 border-b h-20 flex items-center">
      <div className="w-full grid grid-cols-[1fr_1fr_1fr] items-center">
        <Link href="/" className="hover:scale-105 transition-transform duration-300">
          <Logo />
        </Link>

        <nav className="justify-self-center">
          <ul className="flex items-center gap-4">
            <li>
              <Link href="/">Pricing</Link>
            </li>
            <li>
              <Link href="/">Story</Link>
            </li>
            <li>
              <Link href="/">Docs</Link>
            </li>
          </ul>
        </nav>

        <div className="justify-self-end flex items-center gap-4">
          {isClient && (
            <Button size="icon" variant="outline" onClick={onThemeChange} className="overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={resolvedTheme}
                  initial={{ opacity: 0, rotate: -90, x: -30, y: 10 }}
                  animate={{ opacity: 1, rotate: 0, x: 0, y: 0 }}
                  exit={{ opacity: 0, rotate: 90, x: 30, y: 10 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon name={resolvedTheme === 'light' ? 'moon' : 'sun'} className="size-4" />
                </motion.div>
              </AnimatePresence>
            </Button>
          )}
          <Button asChild>
            <a href="https://dashboard.seventy-seven.dev">Sign in</a>
          </Button>
        </div>
      </div>
    </header>
  )
}
