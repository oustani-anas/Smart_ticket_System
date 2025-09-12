'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LegacyPaymentSuccessRedirect() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const sessionId = params.get('session_id') || params.get('sessionId')
    const eventId = params.get('eventId')
    const query = new URLSearchParams()
    if (sessionId) query.set('session_id', sessionId)
    if (eventId) query.set('eventId', eventId)
    router.replace(`/dashboard/payment-success${query.toString() ? `?${query.toString()}` : ''}`)
  }, [params, router])

  return null
}


