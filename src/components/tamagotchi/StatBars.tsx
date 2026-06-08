import { TamagotchiState } from '@/types/tamagotchi'

interface BarProps {
  icon: string
  label: string
  value: number
  color: string
}

function StatBar({ icon, label, value, color }: BarProps) {
  const pct = Math.round(value)
  const danger = pct < 25

  return (
    <div className="flex items-center gap-3">
      <span className="text-xl w-7 text-center">{icon}</span>
      <span className="text-sm font-medium text-gray-600 w-16">{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${danger ? 'bg-red-400 animate-pulse' : color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-bold w-8 text-right ${danger ? 'text-red-500' : 'text-gray-500'}`}>
        {pct}
      </span>
    </div>
  )
}

interface Props { state: TamagotchiState }

export function StatBars({ state }: Props) {
  return (
    <div className="mx-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
      <StatBar icon="🍎" label="포만감" value={state.hunger}    color="bg-orange-400" />
      <StatBar icon="😊" label="행복도" value={state.happiness} color="bg-yellow-400" />
      <StatBar icon="💕" label="친밀도" value={state.intimacy}  color="bg-pink-400"   />
      <StatBar icon="💪" label="건강"   value={state.health}    color="bg-green-400"  />
    </div>
  )
}
