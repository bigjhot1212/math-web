type TransferNotification = { amountThb: number; courseName: string; email?: string | null }

export async function notifyNewBankTransfer({ amountThb, courseName, email }: TransferNotification) {
  const resendKey = process.env.RESEND_API_KEY
  const recipient = process.env.ADMIN_NOTIFICATION_EMAIL
  const text = `มีสลิปใหม่รอตรวจสอบ\nคอร์ส: ${courseName}\nยอด: ฿${amountThb.toLocaleString('th-TH')}\nผู้ซื้อ: ${email ?? '-'}`
  try {
    if (resendKey && recipient) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL ?? 'MathPrep <onboarding@resend.dev>',
          to: [recipient],
          subject: 'มีสลิปใหม่รอตรวจสอบ — MathPrep',
          text,
        }),
      })
      return
    }

    const webhook = process.env.ADMIN_NOTIFICATION_WEBHOOK_URL
    if (webhook) await fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: text, text }) })
  } catch (error) {
    console.error('Admin notification failed', error)
  }
}
