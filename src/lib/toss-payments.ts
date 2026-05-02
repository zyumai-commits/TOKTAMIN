declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TossPayments: (clientKey: string) => any
  }
}

export interface PaymentOptions {
  amount: number
  orderId: string
  orderName: string
  customerName: string
  customerEmail: string
  successUrl: string
  failUrl: string
}

let tossInstance: ReturnType<typeof window.TossPayments> | null = null

export const loadTossPayments = (): Promise<ReturnType<typeof window.TossPayments>> => {
  return new Promise((resolve, reject) => {
    const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY as string
    if (!clientKey) {
      reject(new Error('VITE_TOSS_CLIENT_KEY 환경 변수가 설정되지 않았습니다.'))
      return
    }

    if (tossInstance) {
      resolve(tossInstance)
      return
    }

    if (window.TossPayments) {
      tossInstance = window.TossPayments(clientKey)
      resolve(tossInstance)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://js.tosspayments.com/v1/payment'
    script.onload = () => {
      tossInstance = window.TossPayments(clientKey)
      resolve(tossInstance)
    }
    script.onerror = () => reject(new Error('토스 페이먼츠 SDK 로드에 실패했습니다.'))
    document.head.appendChild(script)
  })
}

export const generateOrderId = (planId: string): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `TOKTAMIN-${planId.toUpperCase()}-${timestamp}-${random}`
}

export const PLAN_AMOUNT_MAP: Record<string, number> = {
  basic: 39000,
  pro: 54000,
  couple: 83000,
}
