import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PLAN_AMOUNT_MAP: Record<string, number> = {
  basic: 39000,
  pro: 54000,
  couple: 83000,
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { paymentKey, orderId, amount } = await req.json()

    if (!paymentKey || !orderId || !amount) {
      throw new Error('필수 파라미터가 누락되었습니다.')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // ── 1. 멱등성 체크: 이미 처리된 결제인지 확인 ──
    const { data: existing } = await supabase
      .from('payment_events')
      .select('id')
      .eq('order_id', orderId)
      .maybeSingle()

    if (existing) {
      return new Response(
        JSON.stringify({ success: true, duplicate: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── 2. 토스 페이먼츠 결제 승인 API 호출 ──
    const tossSecretKey = Deno.env.get('TOSS_SECRET_KEY')!
    const encodedKey = btoa(`${tossSecretKey}:`)

    const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encodedKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    })

    if (!tossRes.ok) {
      const errBody = await tossRes.json()
      throw new Error(`토스 결제 승인 실패: ${errBody.message ?? tossRes.statusText}`)
    }

    const payment = await tossRes.json()

    // ── 3. 유저 인증 ──
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('인증 정보가 없습니다.')

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (authError || !user) throw new Error('인증에 실패했습니다.')

    // ── 4. orderId에서 플랜 파싱 및 금액 검증 ──
    // orderId 형식: TOKTAMIN-{PLAN}-{timestamp}-{random}
    const parts = orderId.split('-')
    const planType = parts[1]?.toLowerCase()
    const expectedAmount = PLAN_AMOUNT_MAP[planType]

    if (!expectedAmount) {
      throw new Error(`올바르지 않은 플랜: ${planType}`)
    }
    if (amount !== expectedAmount) {
      throw new Error(`금액 불일치: 예상 ${expectedAmount}, 실제 ${amount}`)
    }

    // ── 5. DB 기록 ──
    const nextBilling = new Date()
    nextBilling.setMonth(nextBilling.getMonth() + 1)

    // payment_events 멱등성 레코드 저장
    await supabase.from('payment_events').insert({
      order_id: orderId,
      payment_key: paymentKey,
      user_id: user.id,
      amount,
      status: payment.status,
    })

    // subscriptions 생성
    await supabase.from('subscriptions').insert({
      user_id: user.id,
      plan_type: planType,
      toss_order_id: orderId,
      toss_payment_key: paymentKey,
      amount,
      next_billing_date: nextBilling.toISOString().split('T')[0],
    })

    // profiles 구독 상태 업데이트
    await supabase
      .from('profiles')
      .update({ subscription_status: planType })
      .eq('id', user.id)

    // ── 6. 환영 이메일 비동기 발송 ──
    // 에러가 나도 결제 플로우를 중단하지 않음
    supabase.functions.invoke('send-welcome-email', {
      body: {
        userId: user.id,
        planType,
        email: user.email,
        fullName: user.user_metadata?.full_name ?? '고객',
      },
    }).catch(console.error)

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    console.error('[verify-payment]', message)
    return new Response(
      JSON.stringify({ success: false, error: message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
