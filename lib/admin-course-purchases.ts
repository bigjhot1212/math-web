import 'server-only'

import { BUNDLES } from '@/content/course-videos'

export type AdminPurchaseRow = {
  user_id: string
  topic_id: string
  price_thb: number | null
  payment_method: string | null
}

export type ConfirmedTransferRow = {
  user_id: string
  topic_id: string | null
  bundle_id: string | null
  confirmed_at: string | null
}

function transferTopicIds(transfer: ConfirmedTransferRow) {
  if (transfer.bundle_id) return BUNDLES[transfer.bundle_id]?.topicIds ?? []
  return transfer.topic_id?.split(',').filter(Boolean) ?? []
}

export function buildConfirmationMap(transfers: ConfirmedTransferRow[]) {
  const confirmations = new Map<string, string>()

  for (const transfer of transfers) {
    if (!transfer.confirmed_at) continue

    for (const topicId of transferTopicIds(transfer)) {
      const key = `${transfer.user_id}:${topicId}`
      const previous = confirmations.get(key)
      if (!previous || Date.parse(transfer.confirmed_at) > Date.parse(previous)) {
        confirmations.set(key, transfer.confirmed_at)
      }
    }
  }

  return confirmations
}

export function getPurchaseConfirmation(
  purchase: Pick<AdminPurchaseRow, 'user_id' | 'topic_id'>,
  confirmations: Map<string, string>,
) {
  return confirmations.get(`${purchase.user_id}:${purchase.topic_id}`) ?? null
}

export function getPaymentLabel(method: string | null) {
  if (method === 'bank_transfer') return 'โอนผ่าน QR'
  if (method === 'stripe') return 'ชำระออนไลน์'
  if (method === 'pre_site') return 'สิทธิ์นักเรียนเดิม'
  return 'เปิดสิทธิ์โดยแอดมิน'
}
