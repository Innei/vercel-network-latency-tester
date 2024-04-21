import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const routeDefine = readFileSync(
  path.resolve(__dirname, '../src/app/api/base-route.ts'),
)

const regions = [
  'arn1',
  'bom1',
  'cdg1',
  'cle1',
  'cpt1',
  'dub1',
  'fra1',
  'gru1',
  'hkg1',
  'hnd1',
  'iad1',
  'icn1',
  'kix1',
  'lhr1',
  'pdx1',
  'sfo1',
  'sin1',
  'syd1',
  'dev1',
]

for (const r of regions) {
  mkdirSync(path.resolve(__dirname, `../src/app/api/${r}`), { recursive: true })
  writeFileSync(
    path.resolve(__dirname, `../src/app/api/${r}/route.ts`),
    `import { type NextRequest } from 'next/server'
import { POST as post } from '../base-route'
export const runtime = 'edge'
export const preferredRegion = ['${r}']
export const dynamic = 'force-dynamic'
export const POST = async (req: NextRequest) => {
  return post(req)
}
`,
  )
}
