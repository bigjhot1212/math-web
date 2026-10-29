'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { BookOpen, Compass, GraduationCap, LayoutDashboard, Menu, MessageCircle, ShieldCheck } from 'lucide-react'
import { getNavigationMode, showFloatingSupport } from '@/lib/navigation'
import { BRAND_FULL_NAME } from '@/lib/brand'
import BrandMark from './brand-mark'
import CartIcon from './cart-icon'
import UserMenu from './user-menu'

type Props = {
  children: ReactNode
  user: { name: string; email: string; avatarUrl: string | null } | null
  isAdmin: boolean
}
const studentLinks = [
  ['/dashboard', 'ศูนย์บัญชาการ', LayoutDashboard],
  ['/practice', 'ภารกิจฝึกโจทย์', Compass],
  ['/exam', 'สนามสอบจำลอง', GraduationCap],
  ['/treasure', 'ขุมทรัพย์', BookOpen],
] as const
const moreLinks = [['/courses', 'คอร์สของฉัน'], ['/profile', 'ข้อมูลของฉัน'], ['/pricing', 'เลือกซื้อคอร์ส'], ['/premium', 'แบบฝึกหัด Premium'], ['/cart', 'ตะกร้าคอร์ส']] as const
const publicLinks = [['/practice', 'ภารกิจฝึกโจทย์'], ['/exam', 'สนามสอบจำลอง'], ['/treasure', 'ขุมทรัพย์'], ['/pricing', 'คอร์ส']] as const
const adminLinks = [['/admin/students', 'นักเรียน'], ['/admin/bank-transfers', 'ตรวจสลิปการโอน'], ['/admin/premium', 'จัดการ Premium']] as const

export default function AppShell({ children, user, isAdmin }: Props) {
  const pathname = usePathname()
  const mode = getNavigationMode(pathname, Boolean(user))
  const workspace = mode === 'student' || mode === 'admin'
  const routeArtwork: Record<string, [string, string, string]> = {
    '/courses': ['/adventure/archive.webp', 'YOUR FIELD LIBRARY', 'เสบียงความรู้สำหรับการเดินทาง'],
    '/profile': ['/adventure/curves.webp', 'HUNTER PROFILE', 'การเดินทางในแบบของคุณ'],
    '/treasure': ['/adventure/archive.webp', 'THE KNOWLEDGE ARCHIVE', 'ทุกการค้นพบ เริ่มจากความเข้าใจ'],
    '/exam': ['/adventure/celestial.webp', 'THE EXAMINATION GROUNDS', 'พร้อมก้าวเข้าสู่สนามจริง'],
    '/premium': ['/adventure/clockwork.webp', 'ADVANCED TRAINING', 'อีกขั้นของการฝึกฝน'],
  }
  const artwork = routeArtwork[pathname]
  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
  const navLink = (href: string, label: string) => (
    <Link key={href} href={href} aria-current={active(href) ? 'page' : undefined} className="shell-link">{label}</Link>
  )
  return (
    <div className={`app-shell shell-${mode}`}>
      <a href="#page-content" className="skip-link">ข้ามไปเนื้อหา</a>
      <header className="shell-header">
        <Link href={workspace ? '/dashboard' : '/'} className="shell-brand" aria-label="Math Hunters — หน้าหลัก">
          <BrandMark className="size-9 shrink-0" reversed />
          <span>Math Hunters<small>Association</small></span>
        </Link>
        {mode === 'public' && <nav className="public-links" aria-label="เมนูหลัก">{publicLinks.map(([href, label]) => navLink(href, label))}</nav>}
        {mode === 'session' && <p className="session-label">พื้นที่ฝึกฝน</p>}
        {workspace && <p className="workspace-label">{mode === 'admin' ? 'ฝ่ายดูแลนักเรียน' : 'พื้นที่ฝึกฝนของคุณ'}</p>}
        <div className="shell-account">
          {mode !== 'session' && <CartIcon />}
          {user ? <UserMenu {...user} /> : <Link className="shell-login" href="/login">เข้าสู่ระบบ</Link>}
          {mode === 'public' && (
            <details className="public-mobile-menu" key={pathname}>
              <summary aria-label="เปิดเมนูหลัก"><Menu className="size-5" /><span>เมนู</span></summary>
              <nav aria-label="เมนูหลักบนมือถือ">
                {publicLinks.map(([href, label]) => navLink(href, label))}
                {navLink('/premium', 'แบบฝึกหัด Premium')}
                {user && navLink('/dashboard', 'ศูนย์บัญชาการ')}
                {navLink('/cart', 'ตะกร้าคอร์ส')}
                <a className="shell-link" href="https://ig.me/m/j.3ra_" target="_blank" rel="noopener noreferrer">สอบถามผ่าน Instagram</a>
              </nav>
            </details>
          )}
        </div>
      </header>
      {workspace && (
        <aside className="shell-sidebar">
          <p className="sidebar-caption">{mode === 'admin' ? 'จัดการสมาคม' : 'เส้นทางการฝึก'}</p>
          <nav aria-label={mode === 'admin' ? 'เมนูแอดมิน' : 'เมนูนักเรียน'}>
            {mode === 'admin' ? adminLinks.map(([href, label]) => navLink(href, label)) : studentLinks.map(([href, label, Icon]) => (
              <Link key={href} href={href} className="shell-link" aria-current={active(href) ? 'page' : undefined}><Icon className="size-4" aria-hidden="true" />{label}</Link>
            ))}
          </nav>
          <nav className="sidebar-secondary" aria-label="เพิ่มเติม">
            {mode === 'admin' ? navLink('/dashboard', 'กลับไปพื้นที่นักเรียน') : <>
              {moreLinks.map(([href, label]) => navLink(href, label))}
              {isAdmin && <Link className="shell-link" href="/admin/students"><ShieldCheck className="size-4" aria-hidden="true" />ดูแลนักเรียน</Link>}
            </>}
          </nav>
          <a className="sidebar-help" href="https://ig.me/m/j.3ra_" target="_blank" rel="noopener noreferrer"><MessageCircle className="size-4" aria-hidden="true" />สอบถามพี่ทาง Instagram</a>
          <p className="sidebar-motto">ฝึกทีละข้อ<br />เก่งขึ้นทีละวัน</p>
        </aside>
      )}
      <div id="page-content" tabIndex={-1} className="shell-content">{artwork && <div className="adventure-route-banner"><Image src={artwork[0]} fill sizes="(max-width: 767px) 100vw, 1200px" alt="" /><div><p>{artwork[1]}</p><strong>{artwork[2]}</strong></div></div>}{children}</div>
      {mode === 'student' && (
        <nav className="student-mobile-nav" aria-label="เมนูนักเรียนบนมือถือ">
          {studentLinks.slice(0, 3).map(([href, label, Icon]) => <Link key={href} href={href} aria-current={active(href) ? 'page' : undefined}><Icon className="size-5" aria-hidden="true" /><span>{href === '/practice' ? 'ฝึกโจทย์' : href === '/exam' ? 'สอบจำลอง' : label}</span></Link>)}
          <details key={pathname}><summary><Menu className="size-5" /><span>เพิ่มเติม</span></summary><div className="mobile-more">
            {navLink('/treasure', 'ขุมทรัพย์')}{moreLinks.map(([href, label]) => navLink(href, label))}
            {isAdmin && navLink('/admin/students', 'ดูแลนักเรียน')}
            <a className="shell-link" href="https://ig.me/m/j.3ra_" target="_blank" rel="noopener noreferrer">สอบถามผ่าน Instagram</a>
          </div></details>
        </nav>
      )}
      {mode === 'admin' && <nav className="admin-mobile-nav" aria-label="เมนูแอดมินบนมือถือ">{adminLinks.map(([href, label]) => navLink(href, label))}{navLink('/dashboard', 'กลับไปฝึก')}</nav>}
      {mode === 'public' && <footer className="shell-footer"><div><BrandMark className="size-10" /><p>{BRAND_FULL_NAME}<span>ฝึกทีละข้อ เก่งขึ้นทีละวัน</span></p></div><nav aria-label="ท้ายหน้า"><Link href="/treasure">ขุมทรัพย์อ่านฟรี</Link><Link href="/privacy">นโยบายความเป็นส่วนตัว</Link><a href="https://ig.me/m/j.3ra_" target="_blank" rel="noopener noreferrer">ติดต่อพี่ทาง Instagram</a></nav></footer>}
      {showFloatingSupport(pathname) && <a className="floating-support" href="https://ig.me/m/j.3ra_" target="_blank" rel="noopener noreferrer"><MessageCircle className="size-4" aria-hidden="true" />สอบถามพี่ทาง Instagram</a>}
    </div>
  )
}
