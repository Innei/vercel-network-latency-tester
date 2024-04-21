import { type NextRequest } from 'next/server'
import { POST as post } from '../base-route'
export const POST = async (req: NextRequest) => {
  return post(req)
}
