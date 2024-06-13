import React, { useEffect, useState } from 'react'
import { Radio, Button } from 'antd'
import { ethers } from 'ethers'

import type { RadioChangeEvent } from 'antd'
import { VoteListProp } from './interface'

const Home: React.FC = () => {
  const [voteList, setVoteList] = useState<VoteListProp[]>([])

  const [value, setValue] = useState(1)

  const onChange = (e: RadioChangeEvent) => setValue(e.target.value)

  const handleConfirm = () => {
    console.log(value)
  }

  useEffect(() => {
    const getVoteList = async () => {
      const provider = new ethers.JsonRpcProvider('http://0.0.0.0:8545')
      const contractAddresss = '0xce30F4Bba32e48bAe66a9011Fe947A156f549018'
      const abi = [
        {
          constant: true,
          inputs: [],
          name: 'getVoteList',
          outputs: [
            {
              components: [
                {
                  internalType: 'bytes32',
                  name: 'name',
                  type: 'bytes32'
                },
                {
                  internalType: 'uint256',
                  name: 'voteCount',
                  type: 'uint256'
                }
              ],
              internalType: 'struct Ballot.Proposal[]',
              name: '',
              type: 'tuple[]'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        }
      ]
      const contract = new ethers.Contract(contractAddresss, abi, provider)
      console.dir(contract.chairperson)
      let voteList = await contract.getVoteList()
      voteList = [...voteList].map((i) => i[0])
      voteList = voteList.map((i: string) => ({ label: ethers.decodeBytes32String(i), value: i }))
      setVoteList(voteList)
    }
    getVoteList()
  }, [])
  return (
    <div className="w-[400px] m-auto mt-[10%]  shadow-lg p-4">
      <h2 className="text-[26px]">Vote List</h2>
      <Radio.Group className="flex flex-col" onChange={onChange} value={value}>
        {voteList.length > 0 &&
          voteList.map((i) => (
            <Radio className="mt-2" key={i.label} value={i.value}>
              {i.label}
            </Radio>
          ))}
      </Radio.Group>
      <div className="footer mt-4 flex justify-end">
        <Button type="primary" onClick={handleConfirm}>
          confirm
        </Button>
      </div>
    </div>
  )
}
export default Home
