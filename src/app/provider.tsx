'use client'

import { LazyMotion, m } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Configure } from 'shiro-rc'
import type { PropsWithChildren } from 'react'

const loadFeatures = () => import('./framer').then((res) => res.default)
export const Providers = ({ children }: PropsWithChildren) => {
  const { theme, systemTheme } = useTheme()

  return (
    <Configure
      m={m}
      darkMode={
        theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
      }
    >
      <LazyMotion features={loadFeatures} strict key="framer">
        {children}
      </LazyMotion>
    </Configure>
  )
}
