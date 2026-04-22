'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

// 🚀 FIX: Point directly to your new horizontal logo in the public folder
const LOGO_URL = '/logo-horizontal.png'

// 🚀 FIX: Adjusted default height to be perfect for a horizontal layout
const SarathiLogo = ({ href = '/', className, imageClassName = 'h-8 sm:h-12 w-auto max-w-full' }) => {
  const logoImage = (
    <img
      src={LOGO_URL}
      alt="SARATHI logo"
      className={cn('w-auto object-contain', imageClassName)}
    />
  )

  if (!href) {
    return <div className={cn('inline-flex items-center', className)}>{logoImage}</div>
  }

  return (
    <Link href={href} className={cn('inline-flex items-center', className)}>
      {logoImage}
    </Link>
  )
}

export default SarathiLogo
