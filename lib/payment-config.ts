export const BANK_TRANSFER_INFO = {
  bankName: 'ธนาคารกสิกรไทย',
  accountNumber: '038-1-98602-0',
  accountName: 'ธีระภัทร ไพจิตจินดา',
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  const admins = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return admins.includes(email.toLowerCase())
}
