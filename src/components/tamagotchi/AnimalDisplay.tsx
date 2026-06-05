import { TamagotchiState } from '@/types/tamagotchi'

const ANIMAL_NORMAL: Record<string, string> = {
  cat: '🐱', dog: '🐶', rabbit: '🐰', hamster: '🐹',
}
const ANIMAL_HAPPY: Record<string, string> = {
  cat: '😸', dog: '🐕', rabbit: '🐰', hamster: '🐹',
}

const HAT_EMOJI: Record<string, string> = {
  none: '', baseball: '🧢', crown: '👑', witch: '🎩', party: '🎊', santa: '🎅',
}
const SHIRT_EMOJI: Record<string, string> = {
  none: '', striped_tee: '👕', heart_tee: '❤️', dress: '👗', suit: '🤵', hoodie: '🧥',
}
const ACC_EMOJI: Record<string, string> = {
  none: '', star_necklace: '⭐', heart_necklace: '💕', glasses: '👓', bow: '🎀', flower: '🌸',
}

const BG: Record<string, string> = {
  cat: 'from-orange-50 to-amber-100 border-orange-200',
  dog: 'from-amber-50 to-yellow-100 border-amber-200',
  rabbit: 'from-pink-50 to-purple-100 border-pink-200',
  hamster: 'from-yellow-50 to-orange-100 border-yellow-200',
}

interface Props { state: TamagotchiState }

export function AnimalDisplay({ state }: Props) {
  const { animalType, hunger, happiness, currentAction, isSleeping, equippedItems } = state

  const isHappy = happiness > 60 && hunger > 40
  const isSad = happiness < 30 || hunger < 20

  let animalEmoji = ANIMAL_NORMAL[animalType]
  if (isSleeping) animalEmoji = '😴'
  else if (currentAction === 'eating') animalEmoji = '😋'
  else if (isHappy) animalEmoji = ANIMAL_HAPPY[animalType]

  const animClass =
    currentAction === 'sleeping' || isSleeping
      ? 'animate-pulse'
      : currentAction === 'eating' || currentAction === 'playing'
      ? 'animate-bounce'
      : currentAction === 'petting'
      ? 'scale-110 transition-transform duration-300'
      : 'hover:scale-105 transition-transform duration-300'

  const moodText = isSleeping
    ? '💤 꿈나라 중...'
    : currentAction === 'eating' ? '😋 냠냠!'
    : currentAction === 'playing' ? '🎮 신나게 놀아요!'
    : currentAction === 'petting' ? '💕 기분 최고!'
    : isSad ? '😢 저 좀 봐줘요...'
    : isHappy ? '✨ 너무 행복해요!'
    : '😊 오늘도 잘 부탁해요~'

  const hat = HAT_EMOJI[equippedItems.hat]
  const shirt = SHIRT_EMOJI[equippedItems.shirt]
  const acc = ACC_EMOJI[equippedItems.acc]

  return (
    <div className={`mx-4 rounded-3xl bg-gradient-to-b ${BG[animalType]} border-2 shadow-lg py-6 px-4`}>
      <div className="flex flex-col items-center gap-1">
        {/* Hat row */}
        <div className="h-10 flex items-center justify-center">
          {hat ? <span className="text-4xl">{hat}</span> : null}
        </div>

        {/* Animal + acc row */}
        <div className="flex items-center gap-4">
          {acc ? (
            <span className="text-3xl">{acc}</span>
          ) : (
            <span className="w-10" />
          )}

          <span className={`text-8xl leading-none select-none cursor-pointer ${animClass}`}>
            {animalEmoji}
          </span>

          <span className="w-10" />
        </div>

        {/* Shirt row */}
        <div className="h-10 flex items-center justify-center">
          {shirt ? <span className="text-3xl">{shirt}</span> : null}
        </div>

        {/* Mood */}
        <div className="mt-2 px-4 py-1.5 bg-white/70 rounded-full text-sm font-medium text-gray-600 shadow-sm">
          {moodText}
        </div>
      </div>
    </div>
  )
}
