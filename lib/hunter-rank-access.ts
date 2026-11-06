import 'server-only'
import { isAdminEmail } from '@/lib/payment-config'

// Preview remains admin-only until a deliberate production configuration change.
export function canAccessHunterRank(email?: string | null) {
  return isAdminEmail(email) || process.env.HUNTER_RANK_PUBLIC_ENABLED === 'true'
}
