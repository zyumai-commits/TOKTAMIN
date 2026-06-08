import { TamagotchiState } from '@/types/tamagotchi'

interface ActionButtonProps {
  emoji: string
  label: string
  onClick: () => void
  disabled?: boolean
  hint?: string
  variant?: 'default' | 'sleep'
  isActive?: boolean
}

function ActionButton({ emoji, label, onClick, disabled, hint, variant = 'default', isActive }: ActionButtonProps) {
  const base =
    'flex flex-col items-center justify-center gap-1 p-3 rounded-2xl border-2 transition-all duration-200 active:scale-95 select-none'
  const colors =
    disabled
      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
      : isActive
      ? 'bg-indigo-100 border-indigo-300 text-indigo-700 shadow-inner'
      : variant === 'sleep'
      ? 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100 cursor-pointer shadow-sm'
      : 'bg-white border-gray-200 text-gray-700 hover:bg-orange-50 hover:border-orange-200 cursor-pointer shadow-sm'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${colors}`}
      title={hint}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-xs font-semibold">{label}</span>
    </button>
  )
}

interface Props {
  state: TamagotchiState
  onFeed: () => void
  onPlay: () => void
  onPet: () => void
  onToggleSleep: () => void
}

export function ActionButtons({ state, onFeed, onPlay, onPet, onToggleSleep }: Props) {
  const now = Date.now()
  const feedCooldown = now - state.lastFed < 30_000
  const playCooldown = now - state.lastPlayed < 30_000
  const petCooldown = now - state.lastPetted < 10_000

  return (
    <div className="mx-4 grid grid-cols-4 gap-3">
      <ActionButton
        emoji="🍎"
        label="먹이기"
        onClick={onFeed}
        disabled={feedCooldown || state.hunger > 90 || state.isSleeping}
        hint={feedCooldown ? '잠시 후 다시 시도하세요' : state.hunger > 90 ? '배가 불러요!' : ''}
      />
      <ActionButton
        emoji="🎮"
        label="놀기"
        onClick={onPlay}
        disabled={playCooldown || state.hunger < 20 || state.isSleeping}
        hint={playCooldown ? '잠시 후 다시 시도하세요' : state.hunger < 20 ? '배가 고파서 못 놀아요' : ''}
      />
      <ActionButton
        emoji="🤝"
        label="쓰다듬기"
        onClick={onPet}
        disabled={petCooldown || state.isSleeping}
        hint={petCooldown ? '잠시 후 다시 시도하세요' : ''}
      />
      <ActionButton
        emoji={state.isSleeping ? '☀️' : '😴'}
        label={state.isSleeping ? '깨우기' : '재우기'}
        onClick={onToggleSleep}
        variant="sleep"
        isActive={state.isSleeping}
      />
    </div>
  )
}
