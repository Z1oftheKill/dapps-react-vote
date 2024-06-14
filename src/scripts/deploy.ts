import { ethers } from 'ethers'
import abi_json from '@/contracts/abi.json'
import bytecodes from './bytecode'
export async function deployContract() {
  // 以太坊节点 provider，可以是 Infura 或者本地节点
  const provider = new ethers.JsonRpcProvider('http://0.0.0.0:8545')

  // 私钥（仅用于本地测试，不要将私钥硬编码在代码中）
  const privateKey = '0x6ee2f408cb3db800e032713be9e5e52ed1f32232b647db7fb923a50fe6e5d7c6'
  // 连接到以太坊网络
  const wallet = new ethers.Wallet(privateKey, provider)

  // 合约 ABI 和字节码（假设您已经有了这些数据）
  const abi = abi_json
  const bytecode = bytecodes

  // 创建合约工厂
  const factory = new ethers.ContractFactory(abi, bytecode, wallet)

  const argumentsList = Array.from({ length: 10 }).map((i, k) =>
    ethers.encodeBytes32String('选项' + (k + 1))
  )
  // 部署合约
  const deployedContract = await factory.deploy(argumentsList)

  // 等待合约部署完成
  await deployedContract.waitForDeployment()

  return deployedContract.target
}
