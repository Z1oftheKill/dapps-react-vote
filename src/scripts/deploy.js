import { ethers } from 'ethers'
import abi_json from '@/contracts/abi.json'
import bytecodes from './bytecode'

async function deployContract() {
  // 以太坊节点 provider，可以是 Infura 或者本地节点
  const provider = new ethers.providers.JsonRpcProvider('http://0.0.0.0:8545')
  const wallet1 = ethers.Wallet.createRandom()

  /*  // 私钥（仅用于本地测试，不要将私钥硬编码在代码中）
  const privateKey = 'YOUR_PRIVATE_KEY'
  // 连接到以太坊网络
  const wallet = new ethers.Wallet(privateKey, provider) */

  // 合约 ABI 和字节码（假设您已经有了这些数据）
  const abi = abi_json
  const bytecode = bytecodes

  // 创建合约工厂
  const factory = new ethers.ContractFactory(abi, bytecode, wallet1)

  // 部署合约
  const deployedContract = await factory.deploy(/* constructor arguments */)

  // 等待合约部署完成
  await deployedContract.deployed()

  console.log('Contract deployed to:', deployedContract.address)
}

deployContract().catch((error) => console.error('Deployment error:', error))
