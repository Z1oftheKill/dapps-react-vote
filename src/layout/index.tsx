import React, { useState } from 'react'
import { Button } from 'antd'

import { AccountType } from './interface'
import WalletDialog from './WalletDialog'
import './index.less'

const MainLayout: React.FC = () => {
  const [account, setAccount] = useState<AccountType>({
    address: '',
    balance: 1n
  })

  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const linkWallet = () => {
    showModal()
  }

  const setWalletAccount = (e: AccountType) => {
    setAccount(e)
  }

  const enCodeAddress = (address: string): string => {
    if (!address) return ''

    // 中间的字符隐藏只保留前后5位
    const start = address.slice(0, 5)
    const end = address.slice(-5)
    return start + '...' + end
  }
  return (
    <div className="h-full py-3 px-6 layout-header flex justify-between items-center">
      <div>DAPPS</div>
      <div>
        <span className="mr-4">{enCodeAddress(account.address)}</span>
        <span className="mr-4">{account.balance.toString()}</span>
        {!account.address && (
          <Button type="primary" onClick={linkWallet}>
            Link Wallet
          </Button>
        )}
        <WalletDialog
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
          setAccount={setWalletAccount}
          handleOk={handleOk}
        ></WalletDialog>
      </div>
    </div>
  )
}
export default MainLayout
