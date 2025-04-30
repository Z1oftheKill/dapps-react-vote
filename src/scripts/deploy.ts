import { ethers } from 'ethers'
import abi_json from '@/contracts/abi.json'
import bytecodes from './bytecode'

/**
 * 部署投票合约
 * @returns 部署后的合约地址
 */
export async function deployContract() {
  try {
    // 以太坊节点 provider，可以是 Infura 或者本地节点
    const provider = new ethers.JsonRpcProvider('http://0.0.0.0:8545')
    console.log('provider', provider)
    // 私钥（仅用于本地测试，不要将私钥硬编码在代码中）
    const privateKey = 
      process.env.PRIVATE_KEY ||
      '0xd96c3885f55c288e938bfe9f8756522d0a5d251247dca5895d743f9c83ba83da'

    // 连接到以太坊网络
    const wallet = new ethers.Wallet(privateKey, provider)

    // 合约 ABI 和字节码
    const abi = abi_json
    const bytecode = bytecodes

    // 创建合约工厂
    const factory = new ethers.ContractFactory(abi, bytecode, wallet)

    // 生成10个默认投票选项
    const argumentsList = Array.from({ length: 10 }).map((_, k) =>
      ethers.encodeBytes32String('选项' + (k + 1))
    )

    // 部署合约
    console.log('开始部署合约...')
    const deployedContract = await factory.deploy(argumentsList)

    // 等待合约部署完成
    console.log('等待合约部署确认...')
    await deployedContract.waitForDeployment()

    const contractAddress = deployedContract.target
    console.log('合约部署成功,地址:', contractAddress)

    return contractAddress
  } catch (error) {
    console.error('合约部署失败:', error)
    throw error
  }
}
