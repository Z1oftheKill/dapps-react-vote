import React, { useEffect, useCallback } from 'react'
import { Modal } from 'antd'
import { ethers, JsonRpcApiProvider } from 'ethers'

import { WalletDialogProps } from './interface'
import metamask_icon from '@assets/images/icons/metamask.svg'

let signer = null

let provider

if (window.ethereum == null) {
  console.log('MetaMask not installed; using read-only defaults')
  provider = ethers.getDefaultProvider()
} else {
  provider = new ethers.BrowserProvider(window.ethereum)
  signer = await provider.getSigner()
}

const walletList = [
  {
    icon: metamask_icon,
    label: 'MetaMask'
  }
]

const WalletDialog: React.FC<WalletDialogProps> = (props) => {
  const { setAccount, isModalOpen, handleCancel, handleOk } = props
  const selectWallet = useCallback(async () => {
    const accounts = await (provider as JsonRpcApiProvider)?.listAccounts()
    const balance = await provider.getBalance(signer?.getAddress() || '')
    const address = accounts[0]?.address || ''
    setAccount({ address, balance })
    handleOk()
  }, [setAccount, handleOk])

  useEffect(() => {
    selectWallet()
  }, [selectWallet])

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
