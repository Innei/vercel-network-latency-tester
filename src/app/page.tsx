'use client'

import { useUncontrolledInput } from '@/hooks/use-uncontrolled-input'
import { useState } from 'react'
import { Input, StyledButton } from 'shiro-rc'

interface Time {
  clientRequestStart: number
  serverRequestStart: number
  serverResponseEnd: number
  clientResponseEnd: number
}
export default function Home() {
  const [_, getValue, ref] = useUncontrolledInput('https://baidu.com')

  const [result, setResult] = useState<Time | null>(null)
  const handleCheck = async () => {
    const endpoint = getValue()
    const requestStart = Date.now()
    const data = await fetch('/api/edge', {
      method: 'POST',
      body: JSON.stringify({ endpoint }),
    })
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

    // setResult({
    //   clientRequestStart: 0,
    //   serverRequestStart: data.nextResponseTime - requestStart,
    //   serverResponseEnd: data.endpointResponseTime - data.nextResponseTime,

    //   clientResponseEnd: Date.now() - data.endpointResponseTime,
    // })
  }

  return (
    <div className="max-w-[80ch] m-auto mt-12 flex flex-col items-center justify-center">
      <form
        className="flex flex-col gap-2 items-center"
        onSubmit={(e) => {
          e.preventDefault()
          handleCheck()
        }}
      >
        <Input type="text" ref={ref} />
        <StyledButton>Check</StyledButton>
      </form>

      <div className="flex mt-8 flex-col gap-2">
        {result && (
          <>
            <p>浏览器请求开始时间：{result.clientRequestStart}</p>
            <p>服务器开始处理时间：{result.serverRequestStart}</p>
            <p>服务器请求完成时间：{result.serverResponseEnd}</p>
            <p>浏览器请求完成时间：{result.clientResponseEnd}</p>
          </>
        )}
      </div>
    </div>
  )
}
