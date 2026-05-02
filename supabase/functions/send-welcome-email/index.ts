import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PLAN_NAMES: Record<string, string> = {
  lite: 'LITE',
  basic: 'BASIC',
  pro: 'PRO',
  couple: 'COUPLE',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, planType, email, fullName } = await req.json()

    const resendApiKey = Deno.env.get('RESEND_API_KEY')!
    const appUrl = Deno.env.get('APP_URL') ?? 'https://toktamin.com'
    const planName = PLAN_NAMES[planType] ?? planType.toUpperCase()
    const name = fullName ?? '고객'

    const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Apple SD Gothic Neo',sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- 헤더 -->
    <div style="background:linear-gradient(135deg,#1E3A8A,#0d9488);padding:40px 32px;text-align:center;">
      <div style="font-size:32px;margin-bottom:8px;">🌿</div>
      <h1 style="color:#ffffff;font-size:26px;font-weight:800;margin:0;">톡타민</h1>
      <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:6px 0 0;">나만의 영양제 구독 서비스</p>
    </div>

    <!-- 본문 -->
    <div style="padding:40px 32px;">
      <h2 style="color:#1E3A8A;font-size:22px;font-weight:800;margin:0 0 12px;">
        🎉 ${name}님, 환영합니다!
      </h2>
      <p style="color:#4b5563;font-size:15px;line-height:1.8;margin:0 0 20px;">
        <strong>톡타민 ${planName} 플랜</strong>에 가입해 주셔서 감사합니다.<br />
        이제 건강한 66일 여정을 함께 시작할 준비가 되었습니다!
      </p>

      <!-- 강조 박스 -->
      <div style="background:#f0f9ff;border-left:4px solid #0d9488;border-radius:8px;padding:20px;margin:24px 0;">
        <h3 style="color:#0f766e;font-size:15px;font-weight:700;margin:0 0 10px;">지금 바로 시작하세요</h3>
        <ul style="color:#4b5563;font-size:14px;margin:0;padding-left:20px;line-height:2;">
          <li>66일 습관 트래커로 건강 루틴 시작</li>
          <li>오늘의 영양제 복용 체크</li>
          <li>건강 목표 달성 현황 확인</li>
        </ul>
      </div>

      <!-- CTA 버튼 -->
      <a href="${appUrl}/dashboard"
         style="display:block;background:#1E3A8A;color:#ffffff;text-align:center;padding:16px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;margin:24px 0;">
        대시보드 바로가기 →
      </a>

      <!-- 66일 정보 -->
      <div style="background:#f9fafb;border-radius:12px;padding:20px;margin-top:24px;">
        <p style="color:#6b7280;font-size:13px;text-align:center;margin:0;">
          💡 <strong>알고 계셨나요?</strong><br />
          습관 형성에는 평균 66일이 필요합니다. 톡타민과 함께라면 반드시 해낼 수 있어요!
        </p>
      </div>
    </div>

    <!-- 푸터 -->
    <div style="background:#f8fafc;padding:24px 32px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">
        © 2024 톡타민 · 문의: support@toktamin.com<br />
        <a href="${appUrl}" style="color:#6b7280;text-decoration:none;">톡타민 홈페이지</a>
      </p>
    </div>
  </div>
</body>
</html>
    `.trim()

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: '톡타민 <hello@toktamin.com>',
        to: [email],
        subject: `🎉 ${name}님, 톡타민 66일 건강 여정 시작을 환영합니다!`,
        html,
      }),
    })

    const result = await res.json()

    return new Response(
      JSON.stringify({ sent: res.ok, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    const message = error instanceof Error ? error.message : '이메일 발송 실패'
    console.error('[send-welcome-email]', message)
    return new Response(
      JSON.stringify({ sent: false, error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
