import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Status = 'verifying' | 'success' | 'error'

export default function SuccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<Status>('verifying')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const verify = async () => {
      const paymentKey = searchParams.get('paymentKey')
      const orderId = searchParams.get('orderId')
      const amount = searchParams.get('amount')

      if (!paymentKey || !orderId || !amount) {
        setErrorMessage('결제 정보가 올바르지 않습니다.')
        setStatus('error')
        return
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: {
            paymentKey,
            orderId,
            amount: parseInt(amount, 10),
          },
        })

        if (error || !data?.success) {
          setErrorMessage(
            error?.message ?? '결제 검증에 실패했습니다. 고객센터에 문의해 주세요.'
          )
          setStatus('error')
          return
        }

        setStatus('success')
        setTimeout(() => navigate('/dashboard'), 3000)
      } catch (err) {
        setErrorMessage('서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
        setStatus('error')
      }
    }

    verify()
  }, [])

  if (status === 'verifying') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary-900" />
        <p className="text-gray-600">결제를 확인하고 있습니다...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <XCircle size={64} className="mb-4 text-red-500" />
        <h1 className="mb-2 text-xl font-bold text-gray-900">결제 오류</h1>
        <p className="mb-6 text-gray-500">{errorMessage}</p>
        <button
          onClick={() => navigate('/checkout')}
          className="rounded-xl bg-primary-900 px-6 py-3 text-sm font-bold text-white hover:bg-primary-800"
        >
          다시 시도하기
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-6xl">🎉</div>
      <CheckCircle2 size={56} className="mb-4 text-teal-500" />
      <h1 className="mb-2 text-2xl font-extrabold text-gray-900">
        결제가 완료되었습니다!
      </h1>
      <p className="mb-2 text-gray-600">
        톡타민 66일 건강 여정을 시작합니다.
      </p>
      <p className="text-sm text-gray-400">
        가입 환영 이메일을 발송했습니다. 잠시 후 대시보드로 이동합니다...
      </p>

      <div className="mt-8">
        <div className="mx-auto h-1.5 w-48 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full animate-[progress_3s_linear_forwards] rounded-full bg-primary-900" />
        </div>
      </div>
    </div>
  )
}
