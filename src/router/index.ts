import { createBrowserRouter } from 'react-router-dom'
import Home from '@/pages/Home'
<<<<<<< HEAD
=======
import Vote from '@/pages/Project/Vote'

>>>>>>> 35fe428693dbcb274a0a0294ef7ae324f6cddc2f
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
  }
])

export default router
