import React, { useEffect, useState } from 'react'
import { Radio, Button, message, Spin } from 'antd'
import type { RadioChangeEvent } from 'antd'
import { ethers, JsonRpcApiProvider, Contract } from 'ethers'
import { deployContract } from '@/scripts/deploy'
import { VoteListProp } from './interface'
import abi_json from '@/contracts/abi.json'

const Vote: React.FC = () => {
  const [voteList, setVoteList] = useState<VoteListProp[]>([])
  const [value, setValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [boxLoading, setBoxLoading] = useState(false)
  const [contract, setContract] = useState<Contract>()
  const [hasVoteRight, setHasVoteRight] = useState(false)
  const [winnerName, setWinnerName] = useState('')

  const onChange = (e: RadioChangeEvent) => setValue(e.target.value)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const res = await contract?.vote(value)
      await res?.wait()
      message.success('投票成功')
      getWinner()
    } catch (error) {
      message.error((error as Error)?.message || '投票失败')
    } finally {
      setLoading(false)
    }
  }

  const getWinner = async () => {
    try {
      const winnerBytes = await contract?.winnerName()
      console.log('🚀 ~ getWinner ~ winnerBytes:', winnerBytes)
      const winner = ethers.decodeBytes32String(winnerBytes)
      setWinnerName(winner)
    } catch (error) {
      console.error('获取获胜者失败:', error)
    }
  }

  const checkVoteRight = async (address: string) => {
    try {
      const voter = await contract?.voters(address)
      console.log('🚀 ~ checkVoteRight ~ voter:', contract)
      setHasVoteRight(voter?.weight > 0 && !voter?.voted)
    } catch (error) {
      console.error('检查投票权失败:', error)
    }
  }

  useEffect(() => {
    const initContract = async () => {
      setBoxLoading(true)
      try {
        const provider = new ethers.JsonRpcProvider('http://0.0.0.0:8545')
        const contractAddress = await deployContract()
        const abi = abi_json
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        setContract(contract)

        const voteList = await contract.getVoteList()
        const formattedList = voteList.map((item: any) => ({
          label: ethers.decodeBytes32String(item.name),
          value: item.name,
          voteCount: Number(item.voteCount)
        }))
        setVoteList(formattedList)

        const address = await signer.getAddress()
        await checkVoteRight(address)
        await getWinner()
      } catch (error) {
        message.error('初始化合约失败')
      } finally {
        setBoxLoading(false)
      }
    }
    initContract()
  }, [])

  return (
    <Spin spinning={boxLoading}>
      <div className="w-[400px] m-auto mt-[40px] shadow-lg p-4">
        <h2 className="text-[26px]">投票列表</h2>
        <Radio.Group className="flex flex-col" onChange={onChange} value={value}>
          {voteList.length > 0 &&
            voteList.map((item, index) => (
              <Radio className="mt-2" key={item.label} value={index}>
                {item.label} (当前票数: {item.voteCount})
              </Radio>
            ))}
        </Radio.Group>
        {winnerName && (
          <div className="mt-4">
            <p>当前领先: {winnerName}</p>
          </div>
        )}
        <div className="footer mt-4 flex justify-end">
          <Button loading={loading} type="primary" onClick={handleConfirm}>
            {hasVoteRight ? '确认投票' : '无投票权'}
          </Button>
        </div>
      </div>
    </Spin>
  )
}

export default Vote
