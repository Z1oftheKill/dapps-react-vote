import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
const Home: React.FC = () => {
  const [voteList, setVoteList] = useState([])
  const getVoteList = async () => {
    const provider = new ethers.JsonRpcProvider('http://0.0.0.0:8545')
    const contractAddresss = '0xd2Ca10E0C912C635d46DEfAc13E0192159699dA7'
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
    console.log('🚀 ~ getVoteList ~ contract:', contract)
    let voteList = await contract.getVoteList()
    voteList = [...voteList].map((i) => i[0])
    voteList = voteList.map((i: string) => ethers.decodeBytes32String(i))
    setVoteList(voteList)

    console.log('🚀 ~ getVoteList ~ voteList:', voteList)
  }
  useEffect(() => {
    getVoteList()
  }, [])
  return (
    <div className="w-min-[600px] m-auto mt-5  shadow-lg p-4">
      <h2 className="text-[26px]">Vote List</h2>
      <ul className="vote-list">
        {voteList.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  )
}
export default Home
