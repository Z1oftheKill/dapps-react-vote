import { RouterProvider } from 'react-router-dom'
import router from '@router/index'
import MainLayout from './layout'

function App() {
  return (
    <div className="my">
      <MainLayout></MainLayout>
      <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
    </div>
  )
}

export default App
