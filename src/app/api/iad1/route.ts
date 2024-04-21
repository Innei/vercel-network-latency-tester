import { type NextRequest } from 'next/server'
import { POST as post } from '../base-route'
export const runtime = 'edge'
export const preferredRegion = ['iad1']
export const dynamic = 'force-dynamic'
export const POST = async (req: NextRequest) => {
  return post(req)
}
