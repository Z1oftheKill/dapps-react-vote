import React, { useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Button, Menu, MenuProps } from 'antd'

import { AccountType } from './interface'
import WalletDialog from './WalletDialog'
import router from '@router/index'
import './index.less'

const MainLayout: React.FC = () => {
  const [account, setAccount] = useState<AccountType>({
    address: '',
    balance: 1n
  })
  const items = [
    {
      key: 'home',
      label: '主页'
    },
    {
      key: 'project',
      label: '项目',
      children: [{ key: 'vote', label: '投票' }]
    }
  ]
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

  const location = window.location
  const change: MenuProps['onClick'] = (e) => {
    router.navigate('/' + e.keyPath.reverse().join('/'))
  }

  return (
    <div className="my flex flex-col h-full">
      <div>
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
      </div>
      <div className="flex flex-[1] h-full ">
        <Menu
          className="w-[160px]"
          theme="dark"
          mode="inline"
          defaultSelectedKeys={location.pathname.split('/')}
          onClick={change}
          items={items}
        />
        <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
      </div>
    </div>
  )
}
export default MainLayout
