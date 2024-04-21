'use client'

import { useUncontrolledInput } from '@/hooks/use-uncontrolled-input'
import { useState } from 'react'
import { FloatPopover, Input, Select, StyledButton } from 'shiro-rc'

interface Time {
  clientRequestStart: number
  serverRequestStart: number
  serverResponseEnd: number
  clientResponseEnd: number
}

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

  'default',
]
export default function Home() {
  const [_, getValue, ref] = useUncontrolledInput()

  const [result, setResult] = useState<Time | null>(null)
  const handleCheck = async () => {
    const endpoint = getValue()
    if (!endpoint) return
    if (!isUrl(endpoint)) {
      alert('Please enter a valid URL')
      return
    }

    const requestStart = Date.now()
    const data = await fetch(
      '/api/' + (selectedRegion === 'default' ? 'nodejs' : selectedRegion),
      {
        method: 'POST',
        body: JSON.stringify({ endpoint }),
      },
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        return data as {
          nextResponseTime: number

          endpointResponseTime: number
          status: number
        }
      })

    setResult({
      clientRequestStart: requestStart,
      clientResponseEnd: Date.now(),
      serverRequestStart: data.nextResponseTime,
      serverResponseEnd: data.endpointResponseTime,
    })
  }

  const [selectedRegion, setSelectedRegion] = useState<string>('default')

  return (
    <div className="max-w-[80ch] m-auto mt-12 flex flex-col items-center justify-center">
      <h1 className="font-bold text-3xl mt-36 mb-12">
        Check Vercel Edge Network/Nodejs Runtime Latency
      </h1>
      <p className="text-base leading-tight text-center">
        {
          "This tool checks the latency of Vercel's requests to any address in a geographically diverse edge network and nodejs runtime."
        }
      </p>

      <small className="text-sm mt-3 mb-8">
        Note: Please calibrate the local time before execution
      </small>
      <form
        className="flex w-full flex-col gap-5 mb-6 items-center"
        onSubmit={(e) => {
          e.preventDefault()
          handleCheck()
        }}
      >
        <Input
          placeholder="Enter your API endpoint or URL"
          type="text"
          ref={ref}
          className="w-full"
        />

        <div className="flex items-center justify-center gap-4">
          <Select
            values={regions.map((region) => ({
              label: region,
              value: region,
            }))}
            value={selectedRegion}
            onChange={(val) => {
              setSelectedRegion(val)
            }}
          ></Select>
          <StyledButton>Check</StyledButton>
        </div>
      </form>

      <div className="flex mt-8 flex-col gap-2 w-[500px] max-w-full px-4">
        {result && (
          <>
            <ResultGraph result={result} />
            <p>
              Total cost:{result.clientResponseEnd - result.clientRequestStart}
              ms
            </p>
          </>
        )}
      </div>
    </div>
  )
}

const ResultGraph = ({ result }: { result: Time }) => {
  const totalCost = result.clientResponseEnd - result.clientRequestStart
  const t1Precent =
    ((result.serverRequestStart - result.clientRequestStart) / totalCost) * 100
  const t2Precent =
    ((result.serverResponseEnd - result.serverRequestStart) / totalCost) * 100
  const t3Precent =
    ((result.clientResponseEnd - result.serverResponseEnd) / totalCost) * 100

  return (
    <div className="flex flex-col relative h-12">
      <FloatPopover
        offset={40}
        type="tooltip"
        triggerElement={
          <div
            className="h-2 rounded-md bg-blue-500 absolute"
            style={{ width: `${t1Precent}%` }}
          >
            <div className="absolute -top-1 -left-2 -translate-x-full text-xs">
              {result.serverRequestStart - result.clientRequestStart}ms
            </div>
          </div>
        }
      >
        Browser to server response time:
        {result.serverRequestStart - result.clientRequestStart}ms, +
        {result.serverRequestStart - result.clientRequestStart}ms
      </FloatPopover>
      <FloatPopover
        type="tooltip"
        offset={40}
        triggerElement={
          <div
            className="h-2 rounded-md bg-green-500 absolute"
            style={{
              width: `${t2Precent}%`,

              left: `${t1Precent}%`,
              top: '1rem',
            }}
          >
            <div className="absolute -top-1 -left-2 -translate-x-full text-xs">
              {result.serverResponseEnd - result.serverRequestStart}ms
            </div>
          </div>
        }
      >
        Server processing time:
        {result.serverResponseEnd - result.serverRequestStart}ms, +
        {result.serverResponseEnd - result.clientRequestStart}ms
      </FloatPopover>
      <FloatPopover
        offset={40}
        type="tooltip"
        triggerElement={
          <div
            className="h-2 rounded-md bg-red-500 absolute"
            style={{
              width: `${t3Precent}%`,

              top: '2rem',
              left: `${t1Precent + t2Precent}%`,
            }}
          >
            <div className="absolute -top-1 -left-2 -translate-x-full text-xs">
              {result.clientResponseEnd - result.serverResponseEnd}ms
            </div>
          </div>
        }
      >
        The browser receives the response time:
        {result.clientResponseEnd - result.serverResponseEnd}ms , +
        {result.clientResponseEnd - result.clientRequestStart}ms
      </FloatPopover>
    </div>
  )
}

const isUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
