import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-t-2 border-primary-900',
        size === 'sm' && 'h-4 w-4 border-2',
        size === 'md' && 'h-8 w-8 border-2',
        size === 'lg' && 'h-12 w-12 border-4',
        className
      )}
    />
  )
}

export function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-gray-500">로딩 중...</p>
      </div>
    </div>
  )
}
