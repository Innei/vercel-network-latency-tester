import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { MIDDLEWARE_TIME_HEADER } from './constants'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const now = Date.now()

  console.log('Middleware time:', now)
  request.headers.set(MIDDLEWARE_TIME_HEADER, now.toString())

  return NextResponse.next()
}
