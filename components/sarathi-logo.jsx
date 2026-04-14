'use client'

import Link from 'next/link'

import { cn } from '@/lib/utils'

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_guidance-hub-78/artifacts/xatwivnm_sarathi%20logo.png'

const SarathiLogo = ({ href = '/', className, imageClassName = 'h-14 w-auto' }) => {
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
