import { BaseContract, ContractInterface } from 'ethers'

export interface VoteListProp {
  value: string
  name: string
  label: string
  voteCount: number
}

type a = BaseContract & Omit<ContractInterface, keyof BaseContract>
export type ExtendedContract = a & {
  // 添加新的方法
  vote(e: number): Promise<void>
  // 添加新的属性
}
