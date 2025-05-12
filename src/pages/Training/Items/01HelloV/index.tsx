import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
import { ethers } from 'ethers'
const HelloV: React.FC = () => {
  // 注意: ethers内置的rpc访问速度有限制，仅测试用，生产环境还是要申请个人rpc。比如:
  //const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
  // const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL)
  const provider = ethers.getDefaultProvider()

  const [balance, setBalance] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const main = async () => {
    setLoading(true)

    const balance = await provider.getBalance(`vitalik.eth`)

    setBalance(ethers.formatEther(balance))

    setLoading(false)
  }
  useEffect(() => {
    main()
  }, [])

  return (
    <Spin spinning={loading} className="h-full">
      <div>01HelloV: {balance}</div>
    </Spin>
  )
}

export default HelloV
