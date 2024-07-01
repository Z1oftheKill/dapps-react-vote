import { ethers } from 'ethers'
import abi_json from '@/contracts/abi.json'
import bytecodes from './bytecode'
export async function deployContract() {
  // 以太坊节点 provider，可以是 Infura 或者本地节点
  const provider = new ethers.JsonRpcProvider('http://0.0.0.0:8545')

  // 私钥（仅用于本地测试，不要将私钥硬编码在代码中）
  const privateKey = '0xd96c3885f55c288e938bfe9f8756522d0a5d251247dca5895d743f9c83ba83da'
  // 连接到以太坊网络
  const wallet = new ethers.Wallet(privateKey, provider)

  // 合约 ABI 和字节码（假设您已经有了这些数据）
  const abi = abi_json
  const bytecode = bytecodes

  // 创建合约工厂
  const factory = new ethers.ContractFactory(abi, bytecode, wallet)

  const argumentsList = Array.from({ length: 10 }).map((_, k) =>
    ethers.encodeBytes32String('选项' + (k + 1))
  )
  // 部署合约
  const deployedContract = await factory.deploy(argumentsList)

  // 等待合约部署完成
  await deployedContract.waitForDeployment()

  return deployedContract.target
}
