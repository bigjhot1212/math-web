import type { Metadata } from 'next'
import { TREASURE_RESOURCES } from '@/content/treasure'
import TreasureLibrary from './treasure-library'

export const metadata: Metadata = {
  title: 'ขุมทรัพย์ | Math Hunters',
  description: 'คลังสรุป ทริคอ่านโจทย์ และเช็กลิสต์คณิตศาสตร์ฟรีจาก Math Hunters Association',
}

export default function TreasurePage() {
  return <TreasureLibrary resources={TREASURE_RESOURCES} />
}
