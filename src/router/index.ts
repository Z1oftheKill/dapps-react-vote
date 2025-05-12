import { createBrowserRouter } from 'react-router-dom'
import Home from '@/pages/Home'
import Vote from '@/pages/Project/Vote'
import Training from '@/pages/Training'
const router = createBrowserRouter([
  {
    path: '/',
    Component: Home
  },
  {
    path: '/home',
    Component: Home
  },
  {
    path: 'project',
    children: [
      {
        path: 'vote',
        Component: Vote
      }
    ]
  },
  {
    path: 'training',
    Component: Training
  }
])

export default router
