import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { Button, message, Spin } from 'antd'

// 定义交易响应类型
interface TransactionResponse {
  hash: string
  to: string
  from: string
  value: bigint
}

// 定义钱包状态类型
interface WalletState {
  provider: ethers.JsonRpcProvider | undefined
  wallets: {
    wallet1: ethers.HDNodeWallet | undefined
    wallet2: ethers.Wallet | undefined
    wallet3: ethers.HDNodeWallet | undefined
  }
  balances: {
    balance1: bigint
    balance2: bigint
    balance3: bigint
  }
  addresses: {
    address1: string
    address2: string
    address3: string
  }
}

const SendEth: React.FC = () => {
  // 加载状态
  const [loading, setLoading] = useState(false)
  // 交易结果
  const [txRes, setTxRes] = useState<TransactionResponse | null>(null)

  // 合并钱包相关状态
  const [walletState, setWalletState] = useState<WalletState>({
    provider: undefined,
    wallets: {
      wallet1: undefined,
      wallet2: undefined,
      wallet3: undefined
    },
    balances: {
      balance1: BigInt(0),
      balance2: BigInt(0),
      balance3: BigInt(0)
    },
    addresses: {
      address1: '',
      address2: '',
      address3: ''
    }
  })

  // 获取所有钱包余额
  const getBalances = async () => {
    const { provider, wallets } = walletState
    if (!provider || !wallets.wallet1 || !wallets.wallet2 || !wallets.wallet3) return

    try {
      const [balance1, balance2, balance3] = await Promise.all([
        provider.getBalance(wallets.wallet1.address),
        provider.getBalance(wallets.wallet2.address),
        provider.getBalance(wallets.wallet3.address)
      ])

      setWalletState((prev) => ({
        ...prev,
        balances: {
          balance1,
          balance2,
          balance3
        }
      }))
      console.log('balance1', balance1)
      console.log('balance2', balance2)
      console.log('balance3', balance3)
    } catch (error) {
      console.error('获取余额失败:', error)
      message.error('获取余额失败')
    }
  }

  // 初始化钱包
  const initializeWallets = async () => {
    const provider = new ethers.JsonRpcProvider('http://0.0.0.0:8545')

    try {
      // 创建随机的wallet1
      const wallet1 = ethers.Wallet.createRandom()
      const wallet1WithProvider = wallet1.connect(provider)
      const mnemonic = wallet1.mnemonic

      // 使用私钥创建wallet2
      const privateKey = '0x4e102fde5eb7e0aa98c5042f893eae2f0f46e75644f04b8a6d450ac338f048d8'
      const wallet2 = new ethers.Wallet(privateKey, provider)

      // 使用助记词创建wallet3
      const wallet3 = ethers.Wallet.fromPhrase(mnemonic?.phrase || '').connect(provider)

      setWalletState({
        provider,
        wallets: {
          wallet1: wallet1WithProvider,
          wallet2,
          wallet3
        },
        balances: {
          balance1: BigInt(0),
          balance2: BigInt(0),
          balance3: BigInt(0)
        },
        addresses: {
          address1: wallet1WithProvider.address,
          address2: wallet2.address,
          address3: wallet3.address
        }
      })
    } catch (error) {
      console.error('初始化钱包失败:', error)
      message.error('初始化钱包失败')
    }
  }

  useEffect(() => {
    initializeWallets()
  }, [])

  // 监听钱包和provider的初始化状态
  useEffect(() => {
    const { provider, wallets } = walletState
    if (provider && wallets.wallet1 && wallets.wallet2 && wallets.wallet3) {
      getBalances()
    }
  }, [walletState.provider, walletState.wallets])

  // 发送ETH交易
  const sendEth = async () => {
    const { wallets, addresses } = walletState
    if (!wallets.wallet2 || !addresses.address3) {
      message.warning('钱包未准备就绪')
      return
    }

    setLoading(true)
    try {
      const tx = {
        to: addresses.address3,
        value: ethers.parseEther('1')
      }
      const txRes = await wallets.wallet2.sendTransaction(tx)
      setTxRes(txRes as TransactionResponse)

      await txRes.wait() // 等待交易确认
      message.success('转账成功')
      await getBalances() // 更新余额
    } catch (error) {
      console.error('转账失败:', error)
      message.error('转账失败')
    } finally {
      setLoading(false)
    }
  }

  // 渲染钱包信息
  const renderWalletInfo = (index: number, address: string, balance: bigint) => (
    <div className="mb-2">
      钱包{index}: {address} 余额: {ethers.formatEther(balance)} ETH
    </div>
  )

  // 渲染交易详情
  const renderTransactionDetails = () =>
    txRes && (
      <div className="mt-4">
        <h3>交易详情:</h3>
        <div>交易哈希: {txRes.hash}</div>
        <div>发送方: {txRes.from}</div>
        <div>接收方: {txRes.to}</div>
        <div>金额: {ethers.formatEther(txRes.value)} ETH</div>
      </div>
    )

  const { addresses, balances } = walletState

  return (
    <div className="p-4">
      <Spin spinning={loading}>
        <Button loading={loading} type="primary" onClick={sendEth}>
          转账
        </Button>
        <div className="mt-4">
          {renderWalletInfo(1, addresses.address1, balances.balance1)}
          {renderWalletInfo(2, addresses.address2, balances.balance2)}
          {renderWalletInfo(3, addresses.address3, balances.balance3)}
        </div>
        {renderTransactionDetails()}
      </Spin>
    </div>
  )
}

export default SendEth
