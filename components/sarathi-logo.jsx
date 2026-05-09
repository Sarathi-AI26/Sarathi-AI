'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// Pointing directly to your new horizontal logo in the public folder
const LOGO_URL = '/logo-horizontal.png'

const SarathiLogo = ({ href = '/', className, imageClassName = 'h-auto w-[140px] sm:w-[180px] lg:w-[220px] object-contain' }) => {
  const logoImage = (
    // 🚀 THE FIX: Upgraded to Next.js Image component with priority and explicit dimensions
    <Image
      src={LOGO_URL}
      alt="SARATHI Logo"
      width={440} 
      height={120} 
      priority 
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
