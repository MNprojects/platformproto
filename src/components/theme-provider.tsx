'use client'

import * as React from 'react'
const NextThemesProvider = dynamic(
	() => import('next-themes').then((e) => e.ThemeProvider),
	{
		ssr: false,
	}
)

// @ts-ignore: Ignore missing type declarations for next-themes
import { type ThemeProviderProps } from 'next-themes/dist/types'
import dynamic from 'next/dynamic'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}