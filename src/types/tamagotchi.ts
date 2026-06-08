export type AnimalType = 'cat' | 'dog' | 'rabbit' | 'hamster'

export type HatItem = 'none' | 'baseball' | 'crown' | 'witch' | 'party' | 'santa'
export type ShirtItem = 'none' | 'striped_tee' | 'heart_tee' | 'dress' | 'suit' | 'hoodie'
export type AccItem = 'none' | 'star_necklace' | 'heart_necklace' | 'glasses' | 'bow' | 'flower'

export interface EquippedItems {
  hat: HatItem
  shirt: ShirtItem
  acc: AccItem
}

export type ActionState = 'idle' | 'eating' | 'playing' | 'sleeping' | 'petting'

export interface TamagotchiState {
  animalType: AnimalType
  name: string
  ageDay: number
  hunger: number
  happiness: number
  intimacy: number
  health: number
  equippedItems: EquippedItems
  lastUpdated: number
  createdAt: number
  isSleeping: boolean
  currentAction: ActionState
  lastFed: number
  lastPlayed: number
  lastPetted: number
}

export type ItemCategory = 'hat' | 'shirt' | 'acc'

export interface WardrobeItemDef {
  id: string
  category: ItemCategory
  name: string
  emoji: string
  description: string
}

export const WARDROBE_ITEMS: WardrobeItemDef[] = [
  { id: 'none', category: 'hat', name: '없음', emoji: '✖️', description: '모자 없음' },
  { id: 'baseball', category: 'hat', name: '야구모자', emoji: '🧢', description: '스포티한 야구모자' },
  { id: 'crown', category: 'hat', name: '왕관', emoji: '👑', description: '반짝이는 왕관' },
  { id: 'witch', category: 'hat', name: '마법사 모자', emoji: '🎩', description: '신비로운 마법사 모자' },
  { id: 'party', category: 'hat', name: '파티 모자', emoji: '🎊', description: '신나는 파티 모자' },
  { id: 'santa', category: 'hat', name: '산타 모자', emoji: '🎅', description: '따뜻한 산타 모자' },

  { id: 'none', category: 'shirt', name: '없음', emoji: '✖️', description: '옷 없음' },
  { id: 'striped_tee', category: 'shirt', name: '줄무늬 티셔츠', emoji: '👕', description: '귀여운 줄무늬 티셔츠' },
  { id: 'heart_tee', category: 'shirt', name: '하트 티셔츠', emoji: '❤️', description: '하트 프린트 티셔츠' },
  { id: 'dress', category: 'shirt', name: '드레스', emoji: '👗', description: '예쁜 드레스' },
  { id: 'suit', category: 'shirt', name: '정장', emoji: '🤵', description: '멋진 정장' },
  { id: 'hoodie', category: 'shirt', name: '후디', emoji: '🧥', description: '편안한 후디' },

  { id: 'none', category: 'acc', name: '없음', emoji: '✖️', description: '액세서리 없음' },
  { id: 'star_necklace', category: 'acc', name: '별 목걸이', emoji: '⭐', description: '빛나는 별 목걸이' },
  { id: 'heart_necklace', category: 'acc', name: '하트 목걸이', emoji: '💕', description: '사랑스러운 하트 목걸이' },
  { id: 'glasses', category: 'acc', name: '안경', emoji: '👓', description: '똑똑해 보이는 안경' },
  { id: 'bow', category: 'acc', name: '리본', emoji: '🎀', description: '귀여운 리본' },
  { id: 'flower', category: 'acc', name: '꽃 장식', emoji: '🌸', description: '예쁜 꽃 장식' },
]
