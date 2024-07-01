import { createBrowserRouter } from 'react-router-dom'
import Home from '@/pages/Home'
import Vote from '@/pages/Project/Vote'

const router = createBrowserRouter([
  {
    path: 'home',
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
  }
])

export default router
