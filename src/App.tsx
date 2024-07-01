import { RouterProvider } from 'react-router-dom'
import { Menu, MenuProps } from 'antd'

import router from '@router/index'
import MainLayout from './layout'

const App: React.FC = () => {
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
  const location = window.location
  const change: MenuProps['onClick'] = (e) => {
    console.log(e, router.navigate('/' + e.keyPath.reverse().join('/')))
  }

  return (
    <div className="my flex flex-col h-full">
      <div>
        <MainLayout></MainLayout>
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

export default App
