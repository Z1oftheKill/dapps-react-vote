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
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545')

    // 私钥（仅用于本地测试，不要将私钥硬编码在代码中）
    const privateKey = '0x11de11cd3586ad37509140a4b9ffb41a462f591bb3900fc56d9dd528caee33ef'
    // 连接到以太坊网络
    const wallet = new ethers.Wallet(privateKey, provider)

    // 合约 ABI 和字节码
    const abi = abi_json
    const bytecode = bytecodes

    // 创建合约工厂
    const factory = new ethers.ContractFactory(abi, bytecode, wallet)
    console.log('🚀 ~ deployContract ~ factory:', factory)

    // 生成10个默认投票选项
    const argumentsList = Array.from({ length: 10 }).map((_, k) =>
      ethers.encodeBytes32String('选项' + (k + 1))
    )

    // 部署合约
    console.log('开始部署合约...')
    const deployedContract = await factory.deploy(argumentsList)

    // 等待合约部署完成
    await deployedContract.waitForDeployment()

    const contractAddress = deployedContract.target
    console.log('合约部署成功,地址:', contractAddress)

    return contractAddress
  } catch (error) {
    console.error('合约部署失败:', error)
    throw error
  }
}
