import React, { useEffect, useState } from 'react'
import { Radio, Button } from 'antd'
import type { RadioChangeEvent } from 'antd'
import { ethers, JsonRpcApiProvider } from 'ethers'

import { VoteListProp } from './interface'
import abi_json from '@/contracts/abi.json'
const provider = new ethers.JsonRpcProvider('http://0.0.0.0:8545')
const contractAddresss = '0x95f236eaa7fDb41C981FfA79569ABE692e9fbcAf'
const abi = abi_json
const signer = await (provider as JsonRpcApiProvider).getSigner()

const contract = new ethers.Contract(contractAddresss, abi, signer)
const Home: React.FC = () => {
  const [voteList, setVoteList] = useState<VoteListProp[]>([])

  const [value, setValue] = useState(0)
  const [loading, setLoading] = useState(false)

  const onChange = (e: RadioChangeEvent) => setValue(e.target.value)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const res = await contract.vote(value)
      console.log('🚀 ~ handleConfirm ~ res:', res)
    } catch (error) {
      console.log('🚀 ~ handleConfirm ~ error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const getVoteList = async () => {
      let voteList = await contract.getVoteList()
      voteList = [...voteList].map((i) => i[0])
      voteList = voteList.map((i: string) => ({ label: ethers.decodeBytes32String(i), value: i }))
      console.log('🚀 ~ getVoteList ~ voteList:', voteList)
      setVoteList(voteList)
    }
    getVoteList()
  }, [])
  return (
    <div className="w-[400px] m-auto mt-[10%]  shadow-lg p-4">
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
  )
}
export default Home
