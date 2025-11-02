'use client';

export const dynamic = 'force-dynamic';

import Marketplace from '@/components/Marketplace'
import BackToTown from '@/components/BackToTown'

export default function MarketplacePage() {
  return (
    <>
      <BackToTown />
      <Marketplace />
    </>
  )
}
