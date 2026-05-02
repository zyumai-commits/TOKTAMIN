import { Home, Calendar, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const tabs = [
  { to: '/dashboard', icon: Home,     label: '홈'         },
  { to: '/habits',    icon: Calendar,  label: '습관 트래커' },
  { to: '/profile',   icon: User,      label: '내 정보'    },
]

export default function BottomTabBar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-3 transition-colors',
                isActive
                  ? 'text-primary-900'
                  : 'text-gray-400'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className={cn('text-xs', isActive ? 'font-semibold' : 'font-normal')}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
