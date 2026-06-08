import { useState } from 'react'
import { ItemCategory, WardrobeItemDef, WARDROBE_ITEMS, EquippedItems } from '@/types/tamagotchi'

const CATEGORY_LABELS: Record<ItemCategory, string> = {
  hat: '🎩 모자',
  shirt: '👗 상의',
  acc: '💎 액세서리',
}

interface Props {
  equipped: EquippedItems
  onEquip: (category: ItemCategory, id: string) => void
  onClose: () => void
}

export function WardrobeModal({ equipped, onEquip, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<ItemCategory>('hat')

  const items = WARDROBE_ITEMS.filter(i => i.category === activeTab)

  function isSelected(item: WardrobeItemDef) {
    return equipped[item.category] === item.id
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-t-3xl shadow-2xl">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">👗 옷 입히기</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {(Object.keys(CATEGORY_LABELS) as ItemCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                activeTab === cat
                  ? 'text-purple-600 border-b-2 border-purple-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-3 gap-3 p-4 max-h-64 overflow-y-auto">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => onEquip(item.category, item.id)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all active:scale-95 ${
                isSelected(item)
                  ? 'border-purple-400 bg-purple-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50'
              }`}
            >
              <span className="text-3xl">{item.emoji}</span>
              <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                {item.name}
              </span>
              {isSelected(item) && (
                <span className="text-xs text-purple-600 font-bold">착용 중</span>
              )}
            </button>
          ))}
        </div>

        <div className="pb-6" />
      </div>
    </div>
  )
}
