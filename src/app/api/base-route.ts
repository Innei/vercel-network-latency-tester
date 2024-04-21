import { MIDDLEWARE_TIME_HEADER } from '@/constants'
import { NextResponse, type NextRequest } from 'next/server'

export const runtime = 'edge'
export const preferredRegion = ['arn1']
export const dynamic = 'force-dynamic'
export const POST = async (req: NextRequest) => {
  // const middlewareTime = req.headers.get(MIDDLEWARE_TIME_HEADER)
  const now = Date.now()

  const { endpoint } = await req.json()
  if (!endpoint) {
    return new Response('Missing endpoint', { status: 400 })
  }

  // const dns = await lookup(endpoint)

  let endpointResponseTime
  const { status } = await fetch(endpoint, {
    method: 'GET',
  }).finally(() => {
    endpointResponseTime = Date.now()
  })

  return NextResponse.json({
    // middlewareTime,
    nextResponseTime: now,

    endpointResponseTime,
    status,
    // dns,
  })
}
