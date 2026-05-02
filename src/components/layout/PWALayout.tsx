import { Outlet } from 'react-router-dom'
import BottomTabBar from './BottomTabBar'

export default function PWALayout() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-gray-50">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  )
}
