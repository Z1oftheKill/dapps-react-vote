import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
import { ethers } from 'ethers'
const HelloV: React.FC = () => {
  // 注意: ethers内置的rpc访问速度有限制，仅测试用，生产环境还是要申请个人rpc。比如:
  //const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
  // const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL)
  const provider = new ethers.JsonRpcProvider('http://0.0.0.0:8545')

  const [balance, setBalance] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const main = async () => {
    // 查询provider 连接到了那条链路
    const network = await provider.getNetwork()
    setBalance(network.chainId.toString())

    // 查询区块高度
    const blockNumber = await provider.getBlockNumber()
    console.log('blockNumber', blockNumber)

    // 查询摸个钱包的交易吃书
    const tx = await provider.getTransaction('vitalik.eth')
    console.log('tx', tx)

    // 利用 getFeedData 查询 gas
    const feeData = await provider.getFeeData()
    console.log('feeData', feeData)

    // 查询区块信息
    const block = await provider.getBlock(0)
    console.log('block', block)

    // 查询合约的地址
    const code = await provider.getCode('0xc778417e063141139fce010982780140aa0cd5ab')
    console.log('🚀 ~ main ~ code:', code)
  }
  useEffect(() => {
    main()
  }, [])

  return (
    <Spin spinning={loading} className="h-full">
      <div>链路ID: {balance}</div>
    </Spin>
  )
}

export default HelloV
