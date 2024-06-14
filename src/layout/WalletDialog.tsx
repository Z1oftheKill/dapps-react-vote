import React, { useEffect } from 'react'
import { Modal } from 'antd'
import { ethers, JsonRpcApiProvider, AbstractProvider } from 'ethers'

import { WalletDialogProps } from './interface'
import metamask_icon from '@assets/images/icons/metamask.svg'

let signer: ethers.JsonRpcSigner

let provider: JsonRpcApiProvider | AbstractProvider

try {
  if (window.ethereum == null) {
    console.log('MetaMask not installed; using read-only defaults')
    provider = ethers.getDefaultProvider()
  } else {
    provider = new ethers.BrowserProvider(window.ethereum)
    signer = await (provider as JsonRpcApiProvider).getSigner()
  }
} catch (error) {
  console.log(error)
}

const walletList = [
  {
    icon: metamask_icon,
    label: 'MetaMask'
  }
]

const WalletDialog: React.FC<WalletDialogProps> = (props) => {
  const { setAccount, isModalOpen, handleCancel, handleOk } = props
  const selectWallet = async () => {
    try {
      const accounts = await (provider as JsonRpcApiProvider)?.listAccounts()
      const balance = await provider.getBalance(signer?.getAddress() || '')
      const address = accounts[0]?.address || ''
      localStorage.setItem('address', address)
      setAccount({ address, balance })
    } catch (error) {
      localStorage.setItem('address', '')
    } finally {
      handleOk()
    }
  }

  useEffect(() => {
    selectWallet()
  }, [])

  return (
    <Modal title="Select Wallet" open={isModalOpen} onCancel={handleCancel} onOk={handleOk}>
      <div>
        {walletList.map((i) => (
          <div
            className="flex items-center cursor-pointer hover:bg-slate-300 py-2 px-4 rounded-sm transition-all"
            key={i.label}
            onClick={() => selectWallet()}
          >
            <img src={i.icon} alt={i.label} />
            <span className="text-[18px] font-bold ml-5">{i.label}</span>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default WalletDialog
