import React, { useEffect, useState } from 'react'
import { Radio, Button, message, Spin } from 'antd'
import type { RadioChangeEvent } from 'antd'
import { ethers, JsonRpcApiProvider, BaseContract } from 'ethers'
import { deployContract } from '@/scripts/deploy'
import { VoteListProp } from './interface'
import abi_json from '@/contracts/abi.json'

const Vote: React.FC = () => {
  const [voteList, setVoteList] = useState<VoteListProp[]>([])

  const [value, setValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [boxLoading, setBoxLoading] = useState(false)

  const [contract, setContract] = useState<BaseContract>()

  const onChange = (e: RadioChangeEvent) => setValue(e.target.value)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const res = await contract.vote(value)
      console.log('🚀 ~ handleConfirm ~ res:', res)
      message.success('投票成功')
    } catch (error) {
      console.log('🚀 ~ handleConfirm ~ error:', (error as Error)?.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const getVoteList = async () => {
      setBoxLoading(true)
      const provider = new ethers.JsonRpcProvider('http://0.0.0.0:8545')
      const contractAddresss = await deployContract()
      const abi = abi_json
      const signer = await (provider as JsonRpcApiProvider).getSigner()
      const contract = new ethers.Contract(contractAddresss, abi, signer)
      setContract(contract)
      let voteList = await contract.getVoteList()
      voteList = [...voteList].map((i) => i[0])
      voteList = voteList.map((i: string) => ({ label: ethers.decodeBytes32String(i), value: i }))
      setVoteList(voteList)
      setBoxLoading(false)
    }
    getVoteList()
  }, [])
  return (
    <Spin spinning={boxLoading}>
      <div className="w-[400px] m-auto mt-[40px]  shadow-lg p-4">
        <h2 className="text-[26px]">Vote List</h2>
        <Radio.Group className="flex flex-col" onChange={onChange} value={value}>
          {voteList.length > 0 &&
            voteList.map((i, index) => (
              <Radio className="mt-2" key={i.label} value={index}>
                {i.label}
              </Radio>
            ))}
        </Radio.Group>
        <div className="footer mt-4 flex justify-end">
          <Button loading={loading} type="primary" onClick={handleConfirm}>
            confirm
          </Button>
        </div>
      </div>
    </Spin>
  )
}
export default Vote
